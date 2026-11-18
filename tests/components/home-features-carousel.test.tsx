import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeFeaturesCarousel } from "@/features/home/home-features-carousel";
import { CarouselItem } from "@/components/ui/carousel";

const embla = vi.hoisted(() => {
  const listeners = new Map<string, Set<() => void>>();
  let selected = 0;
  const emit = () => listeners.get("select")?.forEach((listener) => listener());
  const api = {
    canScrollPrev: () => true,
    canScrollNext: () => true,
    selectedScrollSnap: () => selected,
    scrollPrev: vi.fn(() => {
      selected = (selected + 5) % 6;
      emit();
    }),
    scrollNext: vi.fn(() => {
      selected = (selected + 1) % 6;
      emit();
    }),
    rootNode: () => document.createElement("div"),
    slideNodes: () => [] as HTMLElement[],
    on: (event: string, handler: () => void) => {
      const handlers = listeners.get(event) ?? new Set();
      handlers.add(handler);
      listeners.set(event, handlers);
      return api;
    },
    off: (event: string, handler: () => void) => {
      listeners.get(event)?.delete(handler);
      return api;
    },
  };
  return {
    api,
    listeners,
    reset: () => {
      selected = 0;
      listeners.clear();
    },
  };
});
vi.mock("embla-carousel-react", () => ({
  default: () => [undefined, embla.api],
}));
let reduced: boolean;
let media: EventTarget;

beforeEach(() => {
  embla.reset();
  vi.clearAllMocks();
  reduced = false;
  media = new EventTarget();
  Object.defineProperty(media, "matches", { get: () => reduced });
  vi.stubGlobal("matchMedia", () => media);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const mount = () =>
  render(
    <HomeFeaturesCarousel
      headingId="title"
      count={6}
      introduction={<h2 id="title">Features</h2>}
    >
      <CarouselItem>
        <a href="/contact/">Ask About Equipment</a>
      </CarouselItem>
    </HomeFeaturesCarousel>,
  );

it("updates its announced position, loops backwards, retains focus and cleans subscriptions", () => {
  const view = mount();
  const next = screen.getByRole("button", { name: "Next feature" });
  next.focus();
  fireEvent.click(next);
  expect(next).toHaveFocus();
  expect(screen.getByText(/of 6/).parentElement).toHaveTextContent(
    "Feature 02 of 6",
  );
  fireEvent.keyDown(next, { key: "ArrowLeft" });
  fireEvent.keyDown(next, { key: "ArrowLeft" });
  expect(screen.getByText(/of 6/).parentElement).toHaveTextContent(
    "Feature 06 of 6",
  );
  expect(screen.queryByRole("button", { name: /rotation/ })).toBeNull();
  view.unmount();
  expect(
    [...embla.listeners.values()].every((handlers) => !handlers.size),
  ).toBe(true);
});

it("responds to live reduced motion and keeps all manual movement immediate", () => {
  mount();
  act(() => {
    reduced = true;
    media.dispatchEvent(new Event("change"));
  });
  fireEvent.click(screen.getByRole("button", { name: "Next feature" }));
  fireEvent.keyDown(screen.getByRole("button", { name: "Previous feature" }), {
    key: "ArrowLeft",
  });
  expect(embla.api.scrollNext).toHaveBeenCalledWith(true);
  expect(embla.api.scrollPrev).toHaveBeenCalledWith(true);
});
