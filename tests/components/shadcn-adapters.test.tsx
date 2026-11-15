import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const embla = vi.hoisted(() => {
  const selection = { previous: false, next: true };
  const listeners = new Map<string, Set<() => void>>();
  const api = {
    canScrollPrev: () => selection.previous,
    canScrollNext: () => selection.next,
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn((event: string, listener: () => void) => {
      const handlers = listeners.get(event) ?? new Set<() => void>();
      handlers.add(listener);
      listeners.set(event, handlers);
      return api;
    }),
    off: vi.fn((event: string, listener: () => void) => {
      listeners.get(event)?.delete(listener);
      return api;
    }),
  };
  return { api, selection, listeners };
});

vi.mock("embla-carousel-react", () => ({
  default: () => [undefined, embla.api],
}));

afterEach(() => vi.unstubAllGlobals());

function ViewportStatus() {
  return <p>{useIsMobile() ? "Mobile" : "Desktop"}</p>;
}

it("hydrates the mobile viewport without a mismatch and follows breakpoint changes", () => {
  let matches = true;
  const media = new EventTarget();
  Object.defineProperty(media, "matches", { get: () => matches });
  const removeListener = vi.spyOn(media, "removeEventListener");
  const matchMedia = vi.fn(() => media);
  vi.stubGlobal("matchMedia", matchMedia);
  const errors = vi.spyOn(console, "error");

  const container = document.createElement("div");
  container.innerHTML = renderToString(<ViewportStatus />);
  expect(container.textContent).toBe("Desktop");
  expect(matchMedia).not.toHaveBeenCalled();
  document.body.appendChild(container);
  const view = render(<ViewportStatus />, { container, hydrate: true });
  expect(screen.getByText("Mobile")).toBeInTheDocument();

  act(() => {
    matches = false;
    media.dispatchEvent(new Event("change"));
  });
  expect(screen.getByText("Desktop")).toBeInTheDocument();
  expect(errors).not.toHaveBeenCalled();
  view.unmount();
  expect(removeListener).toHaveBeenCalledWith("change", expect.any(Function));
  container.remove();
});

it("keeps carousel controls in sync with selection/reinitialization and removes subscriptions", () => {
  const view = render(
    <Carousel aria-label="Test slides">
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>,
  );
  const previous = screen.getByRole("button", { name: "Previous slide" });
  const next = screen.getByRole("button", { name: "Next slide" });
  expect(previous).toBeDisabled();
  expect(next).toBeEnabled();
  fireEvent.click(next);
  expect(embla.api.scrollNext).toHaveBeenCalledOnce();

  act(() => {
    embla.selection.previous = true;
    embla.selection.next = false;
    embla.listeners.get("select")?.forEach((listener) => listener());
  });
  expect(previous).toBeEnabled();
  expect(next).toBeDisabled();
  fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" });
  expect(embla.api.scrollPrev).toHaveBeenCalledOnce();

  act(() => {
    embla.selection.previous = false;
    embla.selection.next = true;
    embla.listeners.get("reInit")?.forEach((listener) => listener());
  });
  expect(previous).toBeDisabled();
  expect(next).toBeEnabled();
  view.unmount();
  expect(embla.listeners.get("select")?.size).toBe(0);
  expect(embla.listeners.get("reInit")?.size).toBe(0);
});
