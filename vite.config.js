import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Never ship source maps that reveal source code of an auth-related page.
  build: { sourcemap: false },
});
