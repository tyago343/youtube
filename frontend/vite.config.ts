/// <reference types="vitest/browser" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@app": path.resolve(__dirname, "./src/core"),
      "@pages": path.resolve(__dirname, "./src/core/pages"),
      "@user": path.resolve(__dirname, "./src/modules/user"),
      "@video": path.resolve(__dirname, "./src/modules/video"),
      "@auth": path.resolve(__dirname, "./src/modules/auth"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/shared/lib/setupTests.ts"],
  },
});
