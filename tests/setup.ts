import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
// JSDOM has no media-query engine. Individual responsive tests override this.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (media: string) => ({
    media,
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }),
});
afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});
