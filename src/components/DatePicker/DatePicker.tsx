/**
 * DatePicker 컴포넌트
 * 네이티브 date 입력 대신 쓰는 커스텀 달력.
 * 큰 버튼과 연/월 빠른 선택으로 생년월일을 쉽게 고를 수 있게 한다.
 * 값은 "YYYY-MM-DD" 문자열로 상위에 전달하고, 처음 펼치면 2000년 1월을 보여준다.
 */
import { useEffect, useRef, useState } from "react";
import { Dropdown, type DropdownOption } from "../Dropdown/Dropdown";
import "./DatePicker.css";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

// 연 선택 범위: 과거부터 올해까지 (기본 표시 시작은 2000년)
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS: DropdownOption<number>[] = [];
for (let y = CURRENT_YEAR; y >= 1920; y--) YEAR_OPTIONS.push({ value: y, label: `${y}년` });

const MONTH_OPTIONS: DropdownOption<number>[] = MONTHS.map((m, i) => ({ value: i, label: m }));

const pad = (n: number) => String(n).padStart(2, "0");

// "YYYY-MM-DD" -> {year, month(0-base), day}
function parse(value: string): { year: number; month: number; day: number } | null {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d };
}

export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const parsed = parse(value);
  const [open, setOpen] = useState(false);
  // 처음 펼칠 때 기준: 선택값이 있으면 그 달, 없으면 2000년 1월
  const [viewYear, setViewYear] = useState(parsed?.year ?? 2000);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? 0);
  const rootRef = useRef<HTMLDivElement>(null);

  // 선택값이 바뀌면 보이는 달도 그 달로 맞춘다.
  useEffect(() => {
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }, [value]);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const stepMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  };

  const pick = (day: number) => {
    onChange(`${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`);
    setOpen(false);
  };

  const label = parsed
    ? `${parsed.year}년 ${parsed.month + 1}월 ${parsed.day}일`
    : "날짜를 선택하세요";

  return (
    <div className="date-picker" ref={rootRef}>
      <button
        type="button"
        className={`date-picker__trigger${parsed ? "" : " date-picker__trigger--empty"}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
      </button>

      {open && (
        <div className="date-picker__panel">
          <div className="date-picker__top">
            <Dropdown
              options={YEAR_OPTIONS}
              value={viewYear}
              onChange={setViewYear}
              ariaLabel="연도 선택"
            />
            <Dropdown
              options={MONTH_OPTIONS}
              value={viewMonth}
              onChange={setViewMonth}
              ariaLabel="월 선택"
            />
          </div>

          <div className="date-picker__nav">
            <button type="button" className="date-picker__navbtn" onClick={() => stepMonth(-1)}>
              이전
            </button>
            <span className="date-picker__navlabel">
              {viewYear}년 {viewMonth + 1}월
            </span>
            <button type="button" className="date-picker__navbtn" onClick={() => stepMonth(1)}>
              다음
            </button>
          </div>

          <div className="date-picker__weekdays">
            {WEEKDAYS.map((w) => (
              <span key={w} className="date-picker__weekday">
                {w}
              </span>
            ))}
          </div>

          <div className="date-picker__grid">
            {cells.map((day, i) => {
              if (day == null) return <span key={`e${i}`} className="date-picker__empty" />;
              const selected =
                parsed &&
                parsed.year === viewYear &&
                parsed.month === viewMonth &&
                parsed.day === day;
              return (
                <button
                  key={day}
                  type="button"
                  className={`date-picker__day${selected ? " date-picker__day--selected" : ""}`}
                  onClick={() => pick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
