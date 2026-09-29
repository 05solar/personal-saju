/**
 * PillarTable 컴포넌트
 * 계산된 사주 명식(시주/일주/월주/년주)의 천간과 지지를 한글과 한자로 표시한다.
 * 출생시간 미상이면 시주를 "미상"으로 표시한다.
 */
import type { SajuResult } from "../../lib/saju";
import "./PillarTable.css";

const COLUMNS = [
  { key: "hour", label: "시주" },
  { key: "day", label: "일주" },
  { key: "month", label: "월주" },
  { key: "year", label: "년주" },
] as const;

export function PillarTable({ result }: { result: SajuResult }) {
  return (
    <div className="pillar">
      <table className="pillar__table">
        <thead>
          <tr>
            <th className="pillar__corner" aria-hidden="true"></th>
            {COLUMNS.map((c) => (
              <th key={c.key} className="pillar__col-head">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="pillar__row-head">천간</th>
            {COLUMNS.map((c) => {
              const p = result.pillars[c.key];
              return (
                <td key={c.key} className="pillar__cell">
                  {p ? (
                    <>
                      <span className="pillar__ko">{p.stem}</span>
                      <span className="pillar__hanja">{p.stemHanja}</span>
                    </>
                  ) : (
                    <span className="pillar__unknown">미상</span>
                  )}
                </td>
              );
            })}
          </tr>
          <tr>
            <th className="pillar__row-head">지지</th>
            {COLUMNS.map((c) => {
              const p = result.pillars[c.key];
              return (
                <td key={c.key} className="pillar__cell">
                  {p ? (
                    <>
                      <span className="pillar__ko">{p.branch}</span>
                      <span className="pillar__hanja">{p.branchHanja}</span>
                    </>
                  ) : (
                    <span className="pillar__unknown">미상</span>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      {result.accuracy === "UNKNOWN" && (
        <p className="pillar__note">출생시간을 알 수 없어 시주는 확정하지 않았습니다.</p>
      )}
    </div>
  );
}
