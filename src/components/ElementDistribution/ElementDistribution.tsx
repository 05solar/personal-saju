/**
 * ElementDistribution 컴포넌트
 * 사주 8자(출생시간 미상이면 6자)의 오행 분포를 표시한다.
 * 각 오행을 큰 색상 박스(안에 한자) + 한글 이름 + 개수로 보여주고,
 * 결핍 오행을 강조한 뒤, 하단에 오행별 분포를 색상 막대그래프로 크게 그린다.
 */
import type { FiveElement, SajuResult } from "../../lib/saju";
import "./ElementDistribution.css";

const ORDER: FiveElement[] = ["목", "화", "토", "금", "수"];
const HANJA: Record<FiveElement, string> = { 목: "木", 화: "火", 토: "土", 금: "金", 수: "水" };
const CLASS: Record<FiveElement, string> = { 목: "mok", 화: "hwa", 토: "to", 금: "geum", 수: "su" };

export function ElementDistribution({ result }: { result: SajuResult }) {
  const counts = ORDER.map((el) => result.elementCounts[el]);
  const max = Math.max(1, ...counts);

  return (
    <div className="element">
      <div className="element__list">
        {ORDER.map((el) => {
          const count = result.elementCounts[el];
          const missing = result.missing.includes(el);
          return (
            <div key={el} className={`element__item${missing ? " is-missing" : ""}`}>
              <span className={`element__box element__box--${CLASS[el]}`}>{HANJA[el]}</span>
              <span className="element__name">{el}</span>
              <span className="element__count">{count}</span>
            </div>
          );
        })}
      </div>

      {result.missing.length > 0 ? (
        <p className="element__note">
          결핍 오행: <strong>{result.missing.join(", ")}</strong>
        </p>
      ) : (
        <p className="element__note element__note--balanced">오행이 고르게 분포되어 있습니다.</p>
      )}

      <div className="element__bars">
        {ORDER.map((el) => {
          const count = result.elementCounts[el];
          const pct = (count / max) * 100;
          return (
            <div key={el} className="element__bar-col">
              <span className="element__bar-value">{count}</span>
              <span className="element__bar-track">
                <span
                  className={`element__bar-fill element__bar-fill--${CLASS[el]}`}
                  style={{ height: `${pct}%` }}
                />
              </span>
              <span className="element__bar-label">
                {el} {HANJA[el]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
