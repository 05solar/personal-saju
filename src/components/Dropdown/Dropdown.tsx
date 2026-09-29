/**
 * Dropdown 컴포넌트
 * 네이티브 select 대신 쓰는 커스텀 드롭다운.
 * 트리거를 누르면 옵션 목록이 펼쳐지고, 항목을 클릭하면 값이 선택된다.
 * (연/월 선택 등 목록이 길 수 있어 목록 영역은 스크롤된다.)
 */
import { useEffect, useRef, useState } from "react";
import "./Dropdown.css";

export interface DropdownOption<T extends number | string> {
  value: T;
  label: string;
}

export function Dropdown<T extends number | string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // 열릴 때 선택 항목을 목록 중앙으로 스크롤
  useEffect(() => {
    if (!open) return;
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-active="true"]`);
    el?.scrollIntoView({ block: "center" });
  }, [open]);

  return (
    <div className="dropdown" ref={rootRef}>
      <button
        type="button"
        className="dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span>{current?.label ?? ""}</span>
        <span className={`dropdown__caret${open ? " dropdown__caret--open" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="dropdown__list" role="listbox">
          {options.map((o) => (
            <button
              key={String(o.value)}
              type="button"
              role="option"
              aria-selected={o.value === value}
              data-active={o.value === value}
              className={`dropdown__option${
                o.value === value ? " dropdown__option--active" : ""
              }`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
