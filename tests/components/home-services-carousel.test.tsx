import {
  act,
  fireEvent,
  render,
  screen,
  cleanup,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeServicesCarousel } from "@/features/home/home-services-carousel";
import { CarouselItem } from "@/components/ui/carousel";

const embla = vi.hoisted(() => {
  const listeners = new Map<string, Set<() => void>>();
  const emit = (event: string) =>
    listeners.get(event)?.forEach((listener) => listener());
  const api = {
    canScrollPrev: () => true,
    canScrollNext: () => true,
    scrollPrev: vi.fn(() => emit("select")),
    scrollNext: vi.fn(() => emit("select")),
    rootNode: () => document.createElement("div"),
    slideNodes: () => [] as HTMLElement[],
    on: (event: string, listener: () => void) => {
      const handlers = listeners.get(event) ?? new Set<() => void>();
      handlers.add(listener);
      listeners.set(event, handlers);
      return api;
    },
    off: (event: string, listener: () => void) => {
      listeners.get(event)?.delete(listener);
      return api;
    },
  };
  return { api, listeners };
});
vi.mock("embla-carousel-react", () => ({
  default: () => [undefined, embla.api],
}));

let reduced: boolean;
let media: EventTarget;
let observers: Set<IntersectionObserverCallback>;
const visible = (isIntersecting: boolean) =>
  act(() => {
    observers.forEach((callback) =>
      callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
  });
const advance = (time = 5000) => act(() => vi.advanceTimersByTime(time));
function mount() {
  return render(
    <HomeServicesCarousel headingId="services-heading">
      <CarouselItem>
        <a href="/contact/">Ask about training</a>
      </CarouselItem>
    </HomeServicesCarousel>,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  embla.listeners.clear();
  reduced = false;
  media = new EventTarget();
  Object.defineProperty(media, "matches", { get: () => reduced });
  observers = new Set();
  vi.stubGlobal("matchMedia", () => media);
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe() {
        observers.add(this.callback);
      }
      disconnect() {
        observers.delete(this.callback);
      }
    },
  );
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("rotates one service every five seconds only while visible and cleans up", () => {
  const view = mount();
  advance();
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  visible(true);
  advance(4999);
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  advance(1);
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(2);
  view.unmount();
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(2);
  expect(observers.size).toBe(0);
  expect(
    [...embla.listeners.values()].every((listeners) => listeners.size === 0),
  ).toBe(true);
});

it("suspends on hover, offscreen and document hiding, resuming after a fresh delay", () => {
  mount();
  const root = document.querySelector<HTMLElement>(
    "[data-home-services-carousel]",
  )!;
  visible(true);
  advance(2000);
  fireEvent.mouseEnter(root);
  advance();
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  fireEvent.mouseLeave(root);
  advance(4999);
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  advance(1);
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  visible(false);
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  visible(true);
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
  fireEvent(document, new Event("visibilitychange"));
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  fireEvent(document, new Event("visibilitychange"));
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(2);
});

it("keyboard focus and manual navigation stay paused until explicitly played", () => {
  mount();
  visible(true);
  fireEvent.focus(screen.getByRole("link"));
  fireEvent.blur(screen.getByRole("link"));
  advance(15000);
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Next service" }));
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  fireEvent.click(
    screen.getByRole("button", { name: "Play automatic rotation" }),
  );
  fireEvent.mouseLeave(
    document.querySelector("[data-home-services-carousel]")!,
  );
  visible(true);
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(2);
  fireEvent.keyDown(screen.getByRole("link"), { key: "ArrowLeft" });
  expect(embla.api.scrollPrev).toHaveBeenCalledWith(false);
  expect(
    screen.getByRole("button", { name: "Play automatic rotation" }),
  ).toBeVisible();
});

it("pointer pause preserves its intended action across focus and play can resume after dragging", () => {
  mount();
  visible(true);
  const rotation = screen.getByRole("button", {
    name: "Pause automatic rotation",
  });
  fireEvent.pointerDown(rotation);
  fireEvent.focus(rotation);
  fireEvent.click(rotation);
  advance();
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  fireEvent.pointerDown(rotation);
  fireEvent.click(rotation);
  fireEvent.mouseLeave(
    document.querySelector("[data-home-services-carousel]")!,
  );
  visible(true);
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  fireEvent.pointerDown(screen.getByRole("link"));
  advance();
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(1);
  expect(rotation).toHaveAccessibleName("Play automatic rotation");
});

it("reduced motion changes stop the timer and make manual navigation immediate", () => {
  mount();
  visible(true);
  act(() => {
    reduced = true;
    media.dispatchEvent(new Event("change"));
  });
  advance();
  expect(embla.api.scrollNext).not.toHaveBeenCalled();
  expect(
    screen.queryByRole("button", { name: /automatic rotation/ }),
  ).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Next service" }));
  expect(embla.api.scrollNext).toHaveBeenCalledWith(true);
});
