import nextJest from "next/jest.js";
import path from "path";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",

  // Явно указываем, где искать тесты для Jest
  roots: ["<rootDir>/tests/jest-trial"],

  // Дополнительная защита - игнорируем все другие тестовые файлы
  moduleNameMapper: {
    // Обработка алиасов из tsconfig.json
    "^@/(.*)$": "<rootDir>/$1",
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@components/(.*)$": "<rootDir>/components/$1",

    // Специальные моки для CSS и других файлов
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/vitest-main/",
    "/tests/e2e/",
    "\\.vitest-main\\.",
    "\\.test\\.ts$",
    "\\.spec\\.ts$",
  ],

  // Альтернативный вариант вместо roots:
  // testMatch: ["**/tests/jest/**/*.test.[jt]s?(x)"]
};

export default createJestConfig(config);
