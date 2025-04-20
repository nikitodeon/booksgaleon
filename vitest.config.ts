import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./tests/vitest.setup.ts",
    globals: true,

    // Указываем, где искать тесты для Vitest
    include: ["**/tests/vitest-main/**/*.{test,spec}.{js,ts,jsx,tsx}"],

    // Игнорируем тесты Jest и другие файлы
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/e2e/**",
      "**/jest-trial/**", // Игнорируем папку с тестами Jest
      ".idea",
      ".git",
      ".cache",
      "**/*.jest.{js,ts}", // Игнорируем файлы с .jest. в названии
    ],

    alias: [
      {
        find: /^@\/(.*)$/,
        replacement: path.resolve(__dirname, "./$1"),
      },
      {
        find: /^@app\/(.*)$/,
        replacement: path.resolve(__dirname, "./app/$1"),
      },
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "next/server": path.resolve(
        __dirname,
        "./tests/__mocks__/nextServerMock.ts"
      ),
    },
  },
});
