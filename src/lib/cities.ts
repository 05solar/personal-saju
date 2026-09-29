/*
 * cities.ts
 * 국가/도시별 IANA 시간대(timeZone)와 경도(longitude) 데이터셋.
 * 사용자가 국가와 도시를 선택하거나 검색하면 이 데이터에서 시간대와 경도를 얻는다.
 * - timeZone: 현지 출생시각을 절대 UTC 시각으로 변환할 때 사용(과거 서머타임/표준시 변경 반영).
 * - longitude: 진태양시(眞太陽時) 보정에 사용.
 * (외부 지오코딩 API 없이 앱에 내장한 정적 데이터로 동작한다.)
 */

export interface City {
  id: string;
  city: string; // 도시명(한글)
  cityEn: string; // 도시명(영문, 검색용)
  country: string; // 국가명(한글)
  countryEn: string; // 국가명(영문, 검색용)
  timeZone: string; // IANA 시간대 ID
  longitude: number; // 동경(degrees east)
}

interface RawCity {
  city: string;
  cityEn: string;
  timeZone: string;
  longitude: number;
}
interface CountryBlock {
  country: string;
  countryEn: string;
  code: string;
  cities: RawCity[];
}

// 한반도 표준 자오선. 도시를 특정하지 못했을 때의 기본 경도.
export const DEFAULT_LONGITUDE = 127.5;

const DATA: CountryBlock[] = [
  {
    country: "대한민국",
    countryEn: "South Korea",
    code: "KR",
    cities: [
      { city: "서울", cityEn: "Seoul", timeZone: "Asia/Seoul", longitude: 126.978 },
      { city: "인천", cityEn: "Incheon", timeZone: "Asia/Seoul", longitude: 126.705 },
      { city: "수원", cityEn: "Suwon", timeZone: "Asia/Seoul", longitude: 127.029 },
      { city: "춘천", cityEn: "Chuncheon", timeZone: "Asia/Seoul", longitude: 127.734 },
      { city: "강릉", cityEn: "Gangneung", timeZone: "Asia/Seoul", longitude: 128.876 },
      { city: "대전", cityEn: "Daejeon", timeZone: "Asia/Seoul", longitude: 127.385 },
      { city: "청주", cityEn: "Cheongju", timeZone: "Asia/Seoul", longitude: 127.489 },
      { city: "세종", cityEn: "Sejong", timeZone: "Asia/Seoul", longitude: 127.289 },
      { city: "전주", cityEn: "Jeonju", timeZone: "Asia/Seoul", longitude: 127.147 },
      { city: "광주", cityEn: "Gwangju", timeZone: "Asia/Seoul", longitude: 126.852 },
      { city: "목포", cityEn: "Mokpo", timeZone: "Asia/Seoul", longitude: 126.392 },
      { city: "여수", cityEn: "Yeosu", timeZone: "Asia/Seoul", longitude: 127.662 },
      { city: "대구", cityEn: "Daegu", timeZone: "Asia/Seoul", longitude: 128.601 },
      { city: "포항", cityEn: "Pohang", timeZone: "Asia/Seoul", longitude: 129.365 },
      { city: "안동", cityEn: "Andong", timeZone: "Asia/Seoul", longitude: 128.727 },
      { city: "부산", cityEn: "Busan", timeZone: "Asia/Seoul", longitude: 129.075 },
      { city: "울산", cityEn: "Ulsan", timeZone: "Asia/Seoul", longitude: 129.311 },
      { city: "창원", cityEn: "Changwon", timeZone: "Asia/Seoul", longitude: 128.681 },
      { city: "진주", cityEn: "Jinju", timeZone: "Asia/Seoul", longitude: 128.104 },
      { city: "제주", cityEn: "Jeju", timeZone: "Asia/Seoul", longitude: 126.531 },
    ],
  },
  {
    country: "일본",
    countryEn: "Japan",
    code: "JP",
    cities: [
      { city: "도쿄", cityEn: "Tokyo", timeZone: "Asia/Tokyo", longitude: 139.69 },
      { city: "오사카", cityEn: "Osaka", timeZone: "Asia/Tokyo", longitude: 135.50 },
      { city: "나고야", cityEn: "Nagoya", timeZone: "Asia/Tokyo", longitude: 136.91 },
      { city: "삿포로", cityEn: "Sapporo", timeZone: "Asia/Tokyo", longitude: 141.35 },
      { city: "후쿠오카", cityEn: "Fukuoka", timeZone: "Asia/Tokyo", longitude: 130.40 },
    ],
  },
  {
    country: "중국",
    countryEn: "China",
    code: "CN",
    cities: [
      { city: "베이징", cityEn: "Beijing", timeZone: "Asia/Shanghai", longitude: 116.41 },
      { city: "상하이", cityEn: "Shanghai", timeZone: "Asia/Shanghai", longitude: 121.47 },
      { city: "광저우", cityEn: "Guangzhou", timeZone: "Asia/Shanghai", longitude: 113.26 },
      { city: "청두", cityEn: "Chengdu", timeZone: "Asia/Shanghai", longitude: 104.07 },
      { city: "시안", cityEn: "Xian", timeZone: "Asia/Shanghai", longitude: 108.94 },
      { city: "우루무치", cityEn: "Urumqi", timeZone: "Asia/Urumqi", longitude: 87.62 },
    ],
  },
  {
    country: "대만",
    countryEn: "Taiwan",
    code: "TW",
    cities: [{ city: "타이베이", cityEn: "Taipei", timeZone: "Asia/Taipei", longitude: 121.56 }],
  },
  {
    country: "홍콩",
    countryEn: "Hong Kong",
    code: "HK",
    cities: [{ city: "홍콩", cityEn: "Hong Kong", timeZone: "Asia/Hong_Kong", longitude: 114.16 }],
  },
  {
    country: "베트남",
    countryEn: "Vietnam",
    code: "VN",
    cities: [
      { city: "하노이", cityEn: "Hanoi", timeZone: "Asia/Ho_Chi_Minh", longitude: 105.85 },
      { city: "호치민", cityEn: "Ho Chi Minh City", timeZone: "Asia/Ho_Chi_Minh", longitude: 106.66 },
    ],
  },
  {
    country: "태국",
    countryEn: "Thailand",
    code: "TH",
    cities: [{ city: "방콕", cityEn: "Bangkok", timeZone: "Asia/Bangkok", longitude: 100.50 }],
  },
  {
    country: "싱가포르",
    countryEn: "Singapore",
    code: "SG",
    cities: [{ city: "싱가포르", cityEn: "Singapore", timeZone: "Asia/Singapore", longitude: 103.82 }],
  },
  {
    country: "말레이시아",
    countryEn: "Malaysia",
    code: "MY",
    cities: [{ city: "쿠알라룸푸르", cityEn: "Kuala Lumpur", timeZone: "Asia/Kuala_Lumpur", longitude: 101.69 }],
  },
  {
    country: "인도네시아",
    countryEn: "Indonesia",
    code: "ID",
    cities: [
      { city: "자카르타", cityEn: "Jakarta", timeZone: "Asia/Jakarta", longitude: 106.85 },
      { city: "발리(덴파사르)", cityEn: "Bali Denpasar", timeZone: "Asia/Makassar", longitude: 115.21 },
    ],
  },
  {
    country: "필리핀",
    countryEn: "Philippines",
    code: "PH",
    cities: [{ city: "마닐라", cityEn: "Manila", timeZone: "Asia/Manila", longitude: 120.98 }],
  },
  {
    country: "인도",
    countryEn: "India",
    code: "IN",
    cities: [
      { city: "뉴델리", cityEn: "New Delhi", timeZone: "Asia/Kolkata", longitude: 77.21 },
      { city: "뭄바이", cityEn: "Mumbai", timeZone: "Asia/Kolkata", longitude: 72.87 },
    ],
  },
  {
    country: "아랍에미리트",
    countryEn: "United Arab Emirates",
    code: "AE",
    cities: [{ city: "두바이", cityEn: "Dubai", timeZone: "Asia/Dubai", longitude: 55.27 }],
  },
  {
    country: "사우디아라비아",
    countryEn: "Saudi Arabia",
    code: "SA",
    cities: [{ city: "리야드", cityEn: "Riyadh", timeZone: "Asia/Riyadh", longitude: 46.72 }],
  },
  {
    country: "몽골",
    countryEn: "Mongolia",
    code: "MN",
    cities: [{ city: "울란바토르", cityEn: "Ulaanbaatar", timeZone: "Asia/Ulaanbaatar", longitude: 106.92 }],
  },
  {
    country: "카자흐스탄",
    countryEn: "Kazakhstan",
    code: "KZ",
    cities: [{ city: "알마티", cityEn: "Almaty", timeZone: "Asia/Almaty", longitude: 76.95 }],
  },
  {
    country: "러시아",
    countryEn: "Russia",
    code: "RU",
    cities: [
      { city: "모스크바", cityEn: "Moscow", timeZone: "Europe/Moscow", longitude: 37.62 },
      { city: "블라디보스토크", cityEn: "Vladivostok", timeZone: "Asia/Vladivostok", longitude: 131.89 },
    ],
  },
  {
    country: "튀르키예",
    countryEn: "Turkey",
    code: "TR",
    cities: [{ city: "이스탄불", cityEn: "Istanbul", timeZone: "Europe/Istanbul", longitude: 28.98 }],
  },
  {
    country: "영국",
    countryEn: "United Kingdom",
    code: "GB",
    cities: [{ city: "런던", cityEn: "London", timeZone: "Europe/London", longitude: -0.13 }],
  },
  {
    country: "프랑스",
    countryEn: "France",
    code: "FR",
    cities: [{ city: "파리", cityEn: "Paris", timeZone: "Europe/Paris", longitude: 2.35 }],
  },
  {
    country: "독일",
    countryEn: "Germany",
    code: "DE",
    cities: [
      { city: "베를린", cityEn: "Berlin", timeZone: "Europe/Berlin", longitude: 13.40 },
      { city: "뮌헨", cityEn: "Munich", timeZone: "Europe/Berlin", longitude: 11.58 },
    ],
  },
  {
    country: "스페인",
    countryEn: "Spain",
    code: "ES",
    cities: [
      { city: "마드리드", cityEn: "Madrid", timeZone: "Europe/Madrid", longitude: -3.70 },
      { city: "바르셀로나", cityEn: "Barcelona", timeZone: "Europe/Madrid", longitude: 2.17 },
    ],
  },
  {
    country: "이탈리아",
    countryEn: "Italy",
    code: "IT",
    cities: [
      { city: "로마", cityEn: "Rome", timeZone: "Europe/Rome", longitude: 12.50 },
      { city: "밀라노", cityEn: "Milan", timeZone: "Europe/Rome", longitude: 9.19 },
    ],
  },
  {
    country: "네덜란드",
    countryEn: "Netherlands",
    code: "NL",
    cities: [{ city: "암스테르담", cityEn: "Amsterdam", timeZone: "Europe/Amsterdam", longitude: 4.90 }],
  },
  {
    country: "스위스",
    countryEn: "Switzerland",
    code: "CH",
    cities: [{ city: "취리히", cityEn: "Zurich", timeZone: "Europe/Zurich", longitude: 8.54 }],
  },
  {
    country: "스웨덴",
    countryEn: "Sweden",
    code: "SE",
    cities: [{ city: "스톡홀름", cityEn: "Stockholm", timeZone: "Europe/Stockholm", longitude: 18.07 }],
  },
  {
    country: "미국",
    countryEn: "United States",
    code: "US",
    cities: [
      { city: "뉴욕", cityEn: "New York", timeZone: "America/New_York", longitude: -74.01 },
      { city: "워싱턴 D.C.", cityEn: "Washington DC", timeZone: "America/New_York", longitude: -77.04 },
      { city: "보스턴", cityEn: "Boston", timeZone: "America/New_York", longitude: -71.06 },
      { city: "시카고", cityEn: "Chicago", timeZone: "America/Chicago", longitude: -87.63 },
      { city: "덴버", cityEn: "Denver", timeZone: "America/Denver", longitude: -104.99 },
      { city: "로스앤젤레스", cityEn: "Los Angeles", timeZone: "America/Los_Angeles", longitude: -118.24 },
      { city: "샌프란시스코", cityEn: "San Francisco", timeZone: "America/Los_Angeles", longitude: -122.42 },
      { city: "시애틀", cityEn: "Seattle", timeZone: "America/Los_Angeles", longitude: -122.33 },
      { city: "라스베이거스", cityEn: "Las Vegas", timeZone: "America/Los_Angeles", longitude: -115.14 },
      { city: "호놀룰루", cityEn: "Honolulu", timeZone: "Pacific/Honolulu", longitude: -157.86 },
      { city: "앵커리지", cityEn: "Anchorage", timeZone: "America/Anchorage", longitude: -149.90 },
    ],
  },
  {
    country: "캐나다",
    countryEn: "Canada",
    code: "CA",
    cities: [
      { city: "토론토", cityEn: "Toronto", timeZone: "America/Toronto", longitude: -79.38 },
      { city: "몬트리올", cityEn: "Montreal", timeZone: "America/Toronto", longitude: -73.57 },
      { city: "밴쿠버", cityEn: "Vancouver", timeZone: "America/Vancouver", longitude: -123.12 },
    ],
  },
  {
    country: "멕시코",
    countryEn: "Mexico",
    code: "MX",
    cities: [{ city: "멕시코시티", cityEn: "Mexico City", timeZone: "America/Mexico_City", longitude: -99.13 }],
  },
  {
    country: "브라질",
    countryEn: "Brazil",
    code: "BR",
    cities: [
      { city: "상파울루", cityEn: "Sao Paulo", timeZone: "America/Sao_Paulo", longitude: -46.63 },
      { city: "리우데자네이루", cityEn: "Rio de Janeiro", timeZone: "America/Sao_Paulo", longitude: -43.17 },
    ],
  },
  {
    country: "아르헨티나",
    countryEn: "Argentina",
    code: "AR",
    cities: [
      { city: "부에노스아이레스", cityEn: "Buenos Aires", timeZone: "America/Argentina/Buenos_Aires", longitude: -58.38 },
    ],
  },
  {
    country: "호주",
    countryEn: "Australia",
    code: "AU",
    cities: [
      { city: "시드니", cityEn: "Sydney", timeZone: "Australia/Sydney", longitude: 151.21 },
      { city: "멜버른", cityEn: "Melbourne", timeZone: "Australia/Melbourne", longitude: 144.96 },
      { city: "브리즈번", cityEn: "Brisbane", timeZone: "Australia/Brisbane", longitude: 153.03 },
      { city: "퍼스", cityEn: "Perth", timeZone: "Australia/Perth", longitude: 115.86 },
    ],
  },
  {
    country: "뉴질랜드",
    countryEn: "New Zealand",
    code: "NZ",
    cities: [{ city: "오클랜드", cityEn: "Auckland", timeZone: "Pacific/Auckland", longitude: 174.76 }],
  },
  {
    country: "이집트",
    countryEn: "Egypt",
    code: "EG",
    cities: [{ city: "카이로", cityEn: "Cairo", timeZone: "Africa/Cairo", longitude: 31.24 }],
  },
  {
    country: "남아프리카공화국",
    countryEn: "South Africa",
    code: "ZA",
    cities: [{ city: "요하네스버그", cityEn: "Johannesburg", timeZone: "Africa/Johannesburg", longitude: 28.05 }],
  },
];

export const CITIES: City[] = DATA.flatMap((block) =>
  block.cities.map((c) => ({
    id: `${block.code}-${c.cityEn.replace(/\s+/g, "")}`,
    city: c.city,
    cityEn: c.cityEn,
    country: block.country,
    countryEn: block.countryEn,
    timeZone: c.timeZone,
    longitude: c.longitude,
  })),
);

// 데이터 등장 순서를 유지한 국가명 목록.
export const COUNTRIES: string[] = Array.from(new Set(CITIES.map((c) => c.country)));

const CITY_BY_ID = new Map(CITIES.map((c) => [c.id, c]));

// 기본 선택 도시(서울).
export const DEFAULT_CITY_ID = CITIES[0].id;

export function findCity(id: string): City | undefined {
  return CITY_BY_ID.get(id);
}

export function citiesInCountry(country: string): City[] {
  return CITIES.filter((c) => c.country === country);
}

// 도시/국가명을 한글 또는 영문으로 검색한다.
export function searchCities(query: string, limit = 40): City[] {
  const raw = query.trim();
  if (!raw) return [];
  const q = raw.toLowerCase();
  return CITIES.filter(
    (c) =>
      c.city.includes(raw) ||
      c.cityEn.toLowerCase().includes(q) ||
      c.country.includes(raw) ||
      c.countryEn.toLowerCase().includes(q),
  ).slice(0, limit);
}
