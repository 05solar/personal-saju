# 사주 만세력 (Saju Manseryeok)

생년월일, 출생시간, 출생지역을 직접 입력하면 사주 명식(四柱)과 오행 분포를 계산해 보여주는 독립 실행형 웹앱이다.
원본 HC 프로젝트의 만세력 계산 및 표시 기능만 떼어내 재구성했으며, 엑셀 입출력과 백엔드 연동은 제거했다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 실행
npm run build    # 타입체크 후 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 배포 (Netlify)

`netlify.toml`에 빌드 명령(`npm run build`)과 배포 디렉터리(`dist`), SPA 리다이렉트가 설정되어 있다.
Netlify에서 이 GitHub 저장소를 연결하면 push할 때마다 자동으로 빌드/배포된다.
(빌드 명령: `npm run build`, 게시 디렉터리: `dist`)

## 기능

- 생년월일(양력), 출생시간(모름 선택 가능), 출생지역 직접 입력
- 출생지역은 국가/도시 선택 또는 도시 검색으로 고르며, 국내외 도시를 지원
- 선택한 도시의 IANA 시간대로 현지 출생시각을 절대 시각으로 변환해 해외 시차(표준시/서머타임)를 자동 반영
- 사주 명식(시주/일주/월주/년주)을 천간, 지지, 한자로 표시
- 오행(목/화/토/금/수) 분포와 결핍 오행 표시
- 출생시간을 모르면 시주를 확정하지 않고 나머지 주만 표시 (진태양시 보정에는 출생지역 경도 사용)
- 사주 계산은 npm `manseryeok` 라이브러리로 브라우저에서 단독 수행

## 파일 구조

```
saju/
├── agent.md                  # 이 프로젝트의 작업 규칙(디자인/구조/문서 규칙)
├── README.md                 # 프로젝트 및 각 파일 설명(현재 문서)
├── process.md                # 진행 상황 기록(명령 수행마다 갱신)
├── package.json              # 의존성 및 스크립트 정의
├── tsconfig.json             # 앱 소스용 TypeScript 설정
├── tsconfig.node.json        # Vite 설정용 TypeScript 설정
├── vite.config.ts            # Vite 빌드 설정(React 플러그인)
├── index.html                # 앱 HTML 진입 문서
└── src/
    ├── main.tsx              # 진입점. App을 DOM에 마운트하고 전역 CSS 로드
    ├── App.tsx               # 루트 컴포넌트. SajuPage 렌더링
    ├── vite-env.d.ts         # Vite 클라이언트 타입 참조
    ├── styles/
    │   └── global.css        # 전역 디자인 토큰, 리셋, 기본 타이포그래피
    ├── lib/
    │   ├── saju.ts           # manseryeok 기반 순수 사주 계산 로직(현지->UTC->KST 변환 후 진태양시 계산)
    │   ├── cities.ts         # 국가/도시별 IANA 시간대 및 경도 데이터, 검색 함수
    │   └── timezone.ts       # IANA 시간대 기준 현지 벽시계 -> 절대 UTC 변환(Intl, DST 자동 반영)
    ├── components/
    │   ├── BirthInputForm/   # 생년월일/출생시간/출생지역 입력 폼(tsx + css)
    │   ├── DatePicker/       # 커스텀 달력(연/월 커스텀 드롭다운, 기본 2000년 1월)(tsx + css)
    │   ├── Dropdown/         # 네이티브 select 대체 커스텀 드롭다운(tsx + css)
    │   ├── TimePicker/       # 커스텀 시간 선택기(스크롤 휠)(tsx + css)
    │   ├── PillarTable/      # 사주 명식 표(tsx + css)
    │   └── ElementDistribution/  # 오행 분포 표시(tsx + css)
    └── pages/
        └── SajuPage/         # 사주 계산 단일 페이지(tsx + css)
```

## 작업 규칙

디자인, 파일 구조, 문서화 규칙은 `agent.md`에 정리되어 있다. 이 저장소를 수정할 때는 해당 규칙을 준수한다.
