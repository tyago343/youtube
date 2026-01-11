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
      "@core": path.resolve(__dirname, "./src/core"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@user": path.resolve(__dirname, "./src/modules/user"),
      "@video": path.resolve(__dirname, "./src/modules/video"),
      "@auth": path.resolve(__dirname, "./src/modules/auth"),
      "@search": path.resolve(__dirname, "./src/modules/search"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/shared/lib/tests/setup.tests.ts"],
  },
});
