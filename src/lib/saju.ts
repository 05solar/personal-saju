/*
 * saju.ts
 * manseryeok 라이브러리를 사용하는 순수 사주(四柱) 계산 로직.
 * 사용자가 입력한 생년월일/출생시간과 출생지의 시간대/경도를 받아 명식과 오행 분포를 계산한다.
 *
 * 시차 처리 흐름(원본 시스템과 동일한 결과):
 *  1) 현지 벽시계 시각 + 출생지 IANA 시간대 -> 절대 UTC 시각(과거 표준시/서머타임 자동 반영).
 *  2) 절대 UTC 시각 -> KST(UTC+9) 벽시계 숫자로 표현.
 *  3) manseryeok에 KST 벽시계 + 출생지 경도를 넘기고 applyHistoricalDst=false로 계산.
 *     manseryeok은 입력을 KST 표준시로 보고 (UTC + 경도*4분 + 균시차)로 진태양시를 산출하므로,
 *     위 절차를 거치면 출생지가 어디든 올바른 진태양시로 계산된다.
 * (엑셀 입출력이나 백엔드 연동 없이 브라우저에서 단독으로 계산한다.)
 */
import { calculateFourPillars, lunarToSolar } from "manseryeok";
import { zonedWallClockToUtc } from "./timezone";

export type FiveElement = "목" | "화" | "토" | "금" | "수";

// 출생시간을 아는 경우 EXACT, 모르는 경우 UNKNOWN. UNKNOWN이면 시주를 확정하지 않는다.
export type TimeAccuracy = "EXACT" | "UNKNOWN";

export interface PillarView {
  stem: string; // 천간(한글)
  branch: string; // 지지(한글)
  stemHanja: string; // 천간(한자)
  branchHanja: string; // 지지(한자)
}

export interface SajuResult {
  pillars: {
    year: PillarView;
    month: PillarView;
    day: PillarView;
    hour: PillarView | null; // 출생시간 미상이면 null
  };
  elementCounts: Record<FiveElement, number>;
  missing: FiveElement[];
  accuracy: TimeAccuracy;
}

export interface SajuInput {
  year: number;
  month: number;
  day: number;
  hour?: number; // undefined 이면 출생시간 미상
  minute?: number;
  longitude: number; // 진태양시 보정용 경도(동경)
  timeZone: string; // 출생지 IANA 시간대 ID (예: "Asia/Seoul")
  calendar?: "solar" | "lunar"; // 입력한 생년월일의 역법. 생략 시 양력(solar).
  isLeapMonth?: boolean; // 음력 입력일 때 윤달 여부 (calendar === "lunar" 일 때만 의미 있음)
}

/**
 * 음력으로 입력된 생년월일을 양력으로 변환한다.
 * 양력 입력이면 그대로 돌려주고, 변환 불가(지원 범위 밖 등)면 null.
 */
export function toSolarDate(input: SajuInput): { year: number; month: number; day: number } | null {
  if (input.calendar !== "lunar") {
    return { year: input.year, month: input.month, day: input.day };
  }
  try {
    const s = lunarToSolar(input.year, input.month, input.day, input.isLeapMonth ?? false);
    return { year: s.year, month: s.month, day: s.day };
  } catch {
    return null;
  }
}

const ELEMENTS: FiveElement[] = ["목", "화", "토", "금", "수"];
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 생년월일/출생시간/시간대/경도로 사주를 계산한다. 잘못된 날짜 등 계산 불가면 null을 반환한다.
export function computeSaju(input: SajuInput): SajuResult | null {
  const { longitude, timeZone } = input;
  if (!input.year || !input.month || !input.day) return null;

  // 음력 입력이면 먼저 양력으로 변환한다(시간대/DST 보정은 실제 양력 날짜 기준으로 해야 정확).
  const solar = toSolarDate(input);
  if (!solar) return null;
  const { year, month, day } = solar;

  const known = input.hour != null;
  const localHour = known ? (input.hour as number) : 12; // 시간 미상이면 정오로 계산 후 시주 제외
  const localMinute = known ? (input.minute ?? 0) : 0;

  // 1) 현지 벽시계 -> 절대 UTC 시각(시간대/DST 자동 반영)
  const utcMs = zonedWallClockToUtc(year, month, day, localHour, localMinute, timeZone);
  if (utcMs == null) return null;

  // 2) 절대 UTC -> KST 벽시계 숫자
  const kst = new Date(utcMs + KST_OFFSET_MS);

  let detail;
  try {
    detail = calculateFourPillars({
      year: kst.getUTCFullYear(),
      month: kst.getUTCMonth() + 1,
      day: kst.getUTCDate(),
      hour: kst.getUTCHours(),
      minute: kst.getUTCMinutes(),
      isLunar: false,
      dayBoundary: "midnight",
      // 3) KST 벽시계 + 출생지 경도, DST는 위에서 이미 처리했으므로 재적용하지 않는다.
      trueSolarTime: { longitude, applyHistoricalDst: false },
    });
  } catch {
    return null;
  }

  const hanja = detail.toHanjaObject();
  const toView = (
    pillar: { heavenlyStem: string; earthlyBranch: string },
    combinedHanja: string,
  ): PillarView => {
    const chars = Array.from(combinedHanja);
    return {
      stem: pillar.heavenlyStem,
      branch: pillar.earthlyBranch,
      stemHanja: chars[0] ?? "",
      branchHanja: chars[1] ?? "",
    };
  };

  const counts: Record<FiveElement, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  // 출생시간 미상이면 시주는 오행 집계에서 제외한다(확정할 수 없는 주를 확정값처럼 쓰지 않는다).
  const pairs = known
    ? [detail.yearElement, detail.monthElement, detail.dayElement, detail.hourElement]
    : [detail.yearElement, detail.monthElement, detail.dayElement];
  for (const pair of pairs) {
    counts[pair.stem as FiveElement] += 1;
    counts[pair.branch as FiveElement] += 1;
  }
  const missing = ELEMENTS.filter((e) => counts[e] === 0);

  return {
    pillars: {
      year: toView(detail.year, hanja.year.hanja),
      month: toView(detail.month, hanja.month.hanja),
      day: toView(detail.day, hanja.day.hanja),
      hour: known ? toView(detail.hour, hanja.hour.hanja) : null,
    },
    elementCounts: counts,
    missing,
    accuracy: known ? "EXACT" : "UNKNOWN",
  };
}
