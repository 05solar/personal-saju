/**
 * App 루트 컴포넌트
 * 애플리케이션의 최상위 컴포넌트. 현재는 사주 계산 단일 페이지(SajuPage)만 렌더링한다.
 */
import { SajuPage } from "./pages/SajuPage/SajuPage";

export default function App() {
  return <SajuPage />;
}
