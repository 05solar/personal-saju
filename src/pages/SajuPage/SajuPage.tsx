/**
 * SajuPage 페이지
 * 사주 만세력 계산의 단일 페이지. 사용자가 생년월일/출생시간/출생지역을 입력하면
 * 명식(PillarTable)과 오행 분포(ElementDistribution)를 화면에 표시한다.
 */
import { useState } from "react";
import { BirthInputForm } from "../../components/BirthInputForm/BirthInputForm";
import { ElementDistribution } from "../../components/ElementDistribution/ElementDistribution";
import { PillarTable } from "../../components/PillarTable/PillarTable";
import { computeSaju, type SajuInput, type SajuResult } from "../../lib/saju";
import "./SajuPage.css";

export function SajuPage() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [failed, setFailed] = useState(false);

  const handleCalculate = (input: SajuInput) => {
    const computed = computeSaju(input);
    setResult(computed);
    setFailed(computed == null);
  };

  return (
    <main className="saju-page">
      <div className="saju-page__inner">
        <header className="saju-page__header">
          <h1 className="saju-page__title">사주 만세력</h1>
          <p className="saju-page__subtitle">
            생년월일과 출생시간, 출생지역을 입력하면 사주 명식과 오행 분포를 계산합니다.
          </p>
        </header>

        <section className="saju-page__section">
          <BirthInputForm onCalculate={handleCalculate} />
        </section>

        {failed && (
          <p className="saju-page__error">
            입력한 날짜로는 사주를 계산할 수 없습니다. 값을 다시 확인해 주세요.
          </p>
        )}

        {result && (
          <section className="saju-page__result">
            <h2 className="saju-page__result-title">명식</h2>
            <PillarTable result={result} />
            <h2 className="saju-page__result-title">오행 분포</h2>
            <ElementDistribution result={result} />
          </section>
        )}
      </div>
    </main>
  );
}
