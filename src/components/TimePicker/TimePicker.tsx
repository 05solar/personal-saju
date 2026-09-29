/**
 * TimePicker 컴포넌트
 * 네이티브 time 입력 대신 쓰는 커스텀 시간 선택기.
 * 오전/오후, 시(1-12), 분(00/30)을 세로 스크롤 휠에서 골라 실제 시계처럼 시간을 맞춘다.
 * 값은 24시간제 "HH:MM" 문자열로 상위에 전달한다.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import "./TimePicker.css";

const PERIODS = ["오전", "오후"] as const;
const HOURS12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = [0, 30];

const pad = (n: number) => String(n).padStart(2, "0");

// 24시간제 hh -> {period, hour12}
function to12(hh: number): { period: "오전" | "오후"; hour12: number } {
  const period = hh < 12 ? "오전" : "오후";
  const hour12 = ((hh + 11) % 12) + 1;
  return { period, hour12 };
}

// {period, hour12} -> 24시간제 hh
function to24(period: "오전" | "오후", hour12: number): number {
  const base = hour12 % 12; // 12 -> 0
  return period === "오후" ? base + 12 : base;
}

// 스크롤 휠 한 열: 항목을 세로로 나열하고 클릭/스크롤로 중앙 항목을 선택한다.
function WheelColumn<T extends number | string>({
  items,
  selected,
  onSelect,
  render,
}: {
  items: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
  render: (value: T) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // 선택값이 바뀌면 해당 항목을 중앙으로 스크롤
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>(`[data-active="true"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="time-picker__wheel" ref={ref}>
      {items.map((item) => (
        <button
          key={String(item)}
          type="button"
          data-active={item === selected}
          className={`time-picker__item${
            item === selected ? " time-picker__item--active" : ""
          }`}
          onClick={() => onSelect(item)}
        >
          {render(item)}
        </button>
      ))}
    </div>
  );
}

export function TimePicker({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => {
    if (!value) return null;
    const [hh, mm] = value.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return { hh, mm };
  }, [value]);

  // 아직 선택 전이면 오전 8시 00분을 기본 커서로 둔다(확정은 클릭 시).
  const cursor = parsed ?? { hh: 8, mm: 0 };
  const { period, hour12 } = to12(cursor.hh);
  const minute = MINUTES.includes(cursor.mm) ? cursor.mm : 0;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const emit = (p: "오전" | "오후", h12: number, m: number) => {
    onChange(`${pad(to24(p, h12))}:${pad(m)}`);
  };

  const label =
    parsed != null
      ? `${period} ${hour12}시 ${pad(minute)}분`
      : "시간을 선택하세요";

  return (
    <div className="time-picker" ref={rootRef}>
      <button
        type="button"
        className={`time-picker__trigger${
          parsed != null ? "" : " time-picker__trigger--empty"
        }`}
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-expanded={open}
      >
        {label}
      </button>

      {open && !disabled && (
        <div className="time-picker__panel">
          <div className="time-picker__wheels">
            <div className="time-picker__band" aria-hidden="true" />
            <WheelColumn
              items={PERIODS}
              selected={period}
              onSelect={(p) => emit(p, hour12, minute)}
              render={(p) => String(p)}
            />
            <WheelColumn
              items={HOURS12}
              selected={hour12}
              onSelect={(h) => emit(period, h, minute)}
              render={(h) => `${h}시`}
            />
            <WheelColumn
              items={MINUTES}
              selected={minute}
              onSelect={(m) => emit(period, hour12, m)}
              render={(m) => `${pad(m)}분`}
            />
          </div>

          <button
            type="button"
            className="time-picker__done"
            onClick={() => setOpen(false)}
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}
