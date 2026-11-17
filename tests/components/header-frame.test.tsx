import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HeaderFrame } from "@/components/layout/header-frame";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
let notifyResize: ResizeObserverCallback;
const disconnect = vi.fn();

beforeEach(() => {
  route.pathname = "/";
  disconnect.mockClear();
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    height: 96,
  } as DOMRect);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

it("measures Home's header, updates its inset on resize and cleans up when leaving Home", () => {
  const { rerender, unmount } = render(
    <HeaderFrame>Navigation fixture</HeaderFrame>,
  );
  const header = screen.getByRole("banner");
  expect(header).toHaveAttribute("data-overlay", "");
  expect(
    document.documentElement.style.getPropertyValue("--home-header-height"),
  ).toBe("96px");
  vi.mocked(header.getBoundingClientRect).mockReturnValue({
    height: 180,
  } as DOMRect);
  notifyResize([], {} as ResizeObserver);
  expect(
    document.documentElement.style.getPropertyValue("--home-header-height"),
  ).toBe("180px");
  route.pathname = "/membership/";
  rerender(<HeaderFrame>Navigation fixture</HeaderFrame>);
  expect(header).toHaveAttribute("data-home", "false");
  expect(header).not.toHaveAttribute("data-overlay");
  expect(
    document.documentElement.style.getPropertyValue("--home-header-height"),
  ).toBe("");
  expect(disconnect).toHaveBeenCalledOnce();
  route.pathname = "/";
  rerender(<HeaderFrame>Navigation fixture</HeaderFrame>);
  expect(header).toHaveAttribute("data-overlay", "");
  unmount();
  expect(
    document.documentElement.style.getPropertyValue("--home-header-height"),
  ).toBe("");
});

it("keeps an in-flow fallback when measurement is unavailable", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  render(<HeaderFrame>Navigation fixture</HeaderFrame>);
  expect(screen.getByRole("banner")).not.toHaveAttribute("data-overlay");
  expect(
    document.documentElement.style.getPropertyValue("--home-header-height"),
  ).toBe("");
});
