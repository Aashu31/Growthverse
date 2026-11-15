import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    environmentOptions: {
      jsdom: {
        url: "http://localhost:3000/",
      },
    },
    css: false,
    restoreMocks: true,
    clearMocks: true,
  },
});
