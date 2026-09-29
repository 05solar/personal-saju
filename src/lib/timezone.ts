/*
 * timezone.ts
 * IANA 시간대 기준으로 "현지 벽시계 시각"을 절대 UTC 시각으로 변환한다.
 * 브라우저의 Intl(IANA tz 데이터베이스)을 사용하므로 과거 표준시 변경과 서머타임(DST)이
 * 자동으로 반영된다. (원본 시스템에서 백엔드가 ZoneRules로 하던 역할을 브라우저에서 수행)
 */

const MINUTE_MS = 60000;

// 주어진 UTC 순간에 해당 시간대의 UTC offset(분)을 구한다.
function offsetMinutes(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const part of dtf.formatToParts(new Date(utcMs))) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  let hour = Number(map.hour);
  if (hour === 24) hour = 0; // 일부 엔진이 자정을 24로 표기하는 경우 보정
  const asIfUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    hour,
    Number(map.minute),
    Number(map.second),
  );
  return Math.round((asIfUtc - utcMs) / MINUTE_MS);
}

/**
 * 특정 시간대의 현지 벽시계 시각(연/월/일/시/분)을 절대 UTC 밀리초로 변환한다.
 * 2회 보정으로 DST 경계 부근의 offset 변화를 반영한다. 변환 불가 시 null.
 */
export function zonedWallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): number | null {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  if (Number.isNaN(guess)) return null;
  try {
    const offset1 = offsetMinutes(guess, timeZone);
    const utc1 = guess - offset1 * MINUTE_MS;
    const offset2 = offsetMinutes(utc1, timeZone);
    return guess - offset2 * MINUTE_MS;
  } catch {
    return null;
  }
}
