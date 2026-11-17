import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("./tests/setup.ts", import.meta.url))],
    include: ["tests/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
});
