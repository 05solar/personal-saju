import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite 설정. React 플러그인만 사용하는 최소 구성.
export default defineConfig({
  plugins: [react()],
});
