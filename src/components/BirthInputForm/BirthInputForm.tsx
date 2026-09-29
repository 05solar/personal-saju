/**
 * BirthInputForm 컴포넌트
 * 사용자가 생년월일, 출생시간(모름 선택 가능), 출생지역을 직접 입력하는 폼.
 * 생년월일은 커스텀 달력(DatePicker), 출생시간은 커스텀 선택기(TimePicker)로 입력한다.
 * 출생지역은 도시 검색 또는 국가/도시 드롭다운으로 고르며, 선택한 도시의 IANA 시간대와
 * 경도를 함께 넘겨 해외 시차(표준시/서머타임)를 자동 반영해 계산한다.
 * 입력값을 SajuInput 으로 만들어 onCalculate 콜백으로 상위(SajuPage)에 전달한다.
 */
import { useMemo, useState, type FormEvent } from "react";
import {
  COUNTRIES,
  DEFAULT_CITY_ID,
  citiesInCountry,
  findCity,
  searchCities,
  type City,
} from "../../lib/cities";
import type { SajuInput } from "../../lib/saju";
import { DatePicker } from "../DatePicker/DatePicker";
import { Dropdown, type DropdownOption } from "../Dropdown/Dropdown";
import { TimePicker } from "../TimePicker/TimePicker";
import "./BirthInputForm.css";

const DEFAULT_CITY = findCity(DEFAULT_CITY_ID)!;

export function BirthInputForm({ onCalculate }: { onCalculate: (input: SajuInput) => void }) {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [country, setCountry] = useState(DEFAULT_CITY.country);
  const [cityId, setCityId] = useState(DEFAULT_CITY.id);
  const [citySearch, setCitySearch] = useState("");
  const [error, setError] = useState("");

  const countryOptions: DropdownOption<string>[] = useMemo(
    () => COUNTRIES.map((c) => ({ value: c, label: c })),
    [],
  );
  const cityOptions: DropdownOption<string>[] = useMemo(
    () => citiesInCountry(country).map((c) => ({ value: c.id, label: c.city })),
    [country],
  );
  const searchResults = useMemo(() => searchCities(citySearch), [citySearch]);
  const selectedCity = findCity(cityId);

  const handleCountryChange = (nextCountry: string) => {
    setCountry(nextCountry);
    const first = citiesInCountry(nextCountry)[0];
    if (first) setCityId(first.id);
  };

  const pickCity = (city: City) => {
    setCountry(city.country);
    setCityId(city.id);
    setCitySearch("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!birthDate) {
      setError("생년월일을 입력해 주세요.");
      return;
    }
    const [y, m, d] = birthDate.split("-").map(Number);
    if (!y || !m || !d) {
      setError("생년월일 형식이 올바르지 않습니다.");
      return;
    }

    let hour: number | undefined;
    let minute: number | undefined;
    if (!timeUnknown) {
      if (!birthTime) {
        setError("출생시간을 입력하거나 '출생시간 모름'을 선택해 주세요.");
        return;
      }
      const [hh, mm] = birthTime.split(":").map(Number);
      hour = hh;
      minute = mm;
    }

    if (!selectedCity) {
      setError("출생지역을 선택해 주세요.");
      return;
    }

    setError("");
    onCalculate({
      year: y,
      month: m,
      day: d,
      hour,
      minute,
      longitude: selectedCity.longitude,
      timeZone: selectedCity.timeZone,
    });
  };

  return (
    <form className="birth-form" onSubmit={submit}>
      <div className="birth-form__row">
        <span className="birth-form__label">생년월일 (양력)</span>
        <DatePicker value={birthDate} onChange={setBirthDate} />
      </div>

      <div className="birth-form__row">
        <span className="birth-form__label">출생시간</span>
        <TimePicker value={birthTime} disabled={timeUnknown} onChange={setBirthTime} />
        <label className="birth-form__check">
          <input
            type="checkbox"
            checked={timeUnknown}
            onChange={(e) => setTimeUnknown(e.target.checked)}
          />
          <span>출생시간 모름</span>
        </label>
      </div>

      <div className="birth-form__row">
        <span className="birth-form__label">출생지역</span>

        <input
          className="birth-form__input"
          value={citySearch}
          onChange={(e) => setCitySearch(e.target.value)}
          placeholder="도시 검색 (예: 서울, Tokyo, New York)"
        />
        {citySearch.trim().length > 0 && (
          <ul className="birth-form__results">
            {searchResults.length > 0 ? (
              searchResults.map((c) => (
                <li key={c.id}>
                  <button type="button" className="birth-form__result" onClick={() => pickCity(c)}>
                    <span className="birth-form__result-city">{c.city}</span>
                    <span className="birth-form__result-country">{c.country}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="birth-form__result-empty">검색 결과가 없습니다.</li>
            )}
          </ul>
        )}

        <div className="birth-form__geo">
          <div className="birth-form__geo-field">
            <span className="birth-form__sublabel">국가</span>
            <Dropdown
              ariaLabel="국가 선택"
              options={countryOptions}
              value={country}
              onChange={handleCountryChange}
            />
          </div>
          <div className="birth-form__geo-field">
            <span className="birth-form__sublabel">도시</span>
            <Dropdown ariaLabel="도시 선택" options={cityOptions} value={cityId} onChange={setCityId} />
          </div>
        </div>

        {selectedCity && (
          <p className="birth-form__hint">
            {selectedCity.country} · {selectedCity.city} (시간대 {selectedCity.timeZone})
          </p>
        )}
      </div>

      {error && <p className="birth-form__error">{error}</p>}

      <button type="submit" className="birth-form__submit">
        사주 계산
      </button>
    </form>
  );
}
