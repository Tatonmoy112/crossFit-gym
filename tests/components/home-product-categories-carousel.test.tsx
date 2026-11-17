import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeProductCategoriesCarousel } from "@/features/home/home-product-categories-carousel";
import { CarouselItem } from "@/components/ui/carousel";

const embla = vi.hoisted(() => {
  let selected = 1;
  const listeners = new Map<string, Set<() => void>>();
  const emit = () => listeners.get("select")?.forEach((listener) => listener());
  const root = () => {
    const node = document.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]',
    )!;
    node.getBoundingClientRect = () => ({ left: 0, right: 1000 }) as DOMRect;
    return node;
  };
  const slides = () =>
    [
      ...document.querySelectorAll<HTMLElement>('[data-slot="carousel-item"]'),
    ].map((node, index) => {
      node.getBoundingClientRect = () =>
        ({
          left: (index - selected) * 1000,
          right: (index - selected + 1) * 1000,
        }) as DOMRect;
      return node;
    });
  const api = {
    canScrollPrev: () => selected > 0,
    canScrollNext: () => selected < 3,
    selectedScrollSnap: () => selected,
    scrollPrev: vi.fn(() => {
      selected--;
      emit();
    }),
    scrollNext: vi.fn(() => {
      selected++;
      emit();
    }),
    rootNode: root,
    slideNodes: slides,
    on: (event: string, listener: () => void) => {
      const handlers = listeners.get(event) ?? new Set();
      handlers.add(listener);
      listeners.set(event, handlers);
      return api;
    },
    off: (event: string, listener: () => void) => {
      listeners.get(event)?.delete(listener);
      return api;
    },
  };
  return {
    api,
    listeners,
    reset: () => {
      selected = 1;
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
    <HomeProductCategoriesCarousel
      headingId="categories"
      count={4}
      action={<a href="/contact/">Ask about products</a>}
    >
      {[
        "Sports Nutrition",
        "Training Equipment",
        "Gym Accessories",
        "Fitness Apparel",
      ].map((name) => (
        <CarouselItem key={name}>
          <blockquote>{name}</blockquote>
        </CarouselItem>
      ))}
    </HomeProductCategoriesCarousel>,
  );

it("starts at Training Equipment, guards finite boundaries and keeps the activated control focused", () => {
  mount();
  expect(screen.getByText("Product category 2 of 4")).toBeInTheDocument();
  expect(embla.api.slideNodes().filter((slide) => slide.inert)).toHaveLength(3);
  const prev = screen.getByRole("button", {
    name: "Previous product category",
  });
  const next = screen.getByRole("button", { name: "Next product category" });
  prev.focus();
  fireEvent.click(prev);
  fireEvent.click(prev);
  expect(embla.api.scrollPrev).toHaveBeenCalledTimes(1);
  expect(prev).toHaveFocus();
  expect(prev).toHaveAttribute("aria-disabled", "true");
  expect(prev).not.toBeDisabled();
  fireEvent.keyDown(prev, { key: "ArrowRight" });
  fireEvent.click(next);
  fireEvent.click(next);
  fireEvent.click(next);
  expect(embla.api.scrollNext).toHaveBeenCalledTimes(3);
  expect(next).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByText("Product category 4 of 4")).toBeInTheDocument();
});

it("observes reduced motion and cleans inert, active and event state on unmount", () => {
  const view = mount();
  const slides = embla.api.slideNodes();
  act(() => {
    reduced = true;
    media.dispatchEvent(new Event("change"));
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Next product category" }),
  );
  expect(embla.api.scrollNext).toHaveBeenCalledWith(true);
  expect(slides[2]).toHaveAttribute("data-category-active");
  view.unmount();
  expect(
    slides.every(
      (slide) => !slide.inert && !slide.hasAttribute("data-category-active"),
    ),
  ).toBe(true);
  expect(
    [...embla.listeners.values()].every((handlers) => handlers.size === 0),
  ).toBe(true);
});
