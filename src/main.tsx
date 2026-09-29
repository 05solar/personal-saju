// main.tsx
// 애플리케이션 진입점. 루트 DOM에 App 컴포넌트를 마운트하고 전역 스타일을 불러온다.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
