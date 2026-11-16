import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { CountUp } from "@/features/home/count-up";

let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
let observers: {
  callback: IntersectionObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}[];
let reduce: boolean;
let motionChanged: ((event: MediaQueryListEvent) => void) | undefined;
const removeMotionListener = vi.fn();
const cancel = vi.fn((id: number) => frames.delete(id));

function stubBrowser({ observer = true } = {}) {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: reduce && query.includes("reduce"),
        media: query,
        addEventListener(
          _type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) {
          motionChanged = listener;
        },
        removeEventListener: removeMotionListener,
      }) as unknown as MediaQueryList,
  );
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", cancel);
  vi.stubGlobal(
    "IntersectionObserver",
    observer
      ? class {
          observe = vi.fn();
          disconnect = vi.fn();
          constructor(callback: IntersectionObserverCallback) {
            observers.push({
              callback,
              observe: this.observe,
              disconnect: this.disconnect,
            });
          }
        }
      : undefined,
  );
}

// Run every queued frame once at the given timestamp.
function runFrames(time: number) {
  const queued = [...frames.entries()];
  frames.clear();
  act(() => queued.forEach(([, callback]) => callback(time)));
}

function intersect(isIntersecting = true) {
  act(() =>
    observers
      .at(-1)!
      .callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
  );
}

const visual = (container: HTMLElement) =>
  container.querySelector("[data-count-visual]")!;
const announced = (container: HTMLElement) =>
  container.querySelector(".sr-only")!;

beforeEach(() => {
  frames = new Map();
  nextFrame = 0;
  observers = [];
  reduce = false;
  cancel.mockClear();
  motionChanged = undefined;
  removeMotionListener.mockClear();
});
afterEach(() => vi.unstubAllGlobals());

it("H01-C03: server render shows the final value for no-JS users", () => {
  const html = renderToString(<CountUp value={4.9} decimals={1} />);

  expect(html).toContain(">4.9<");
  expect(html).toContain('aria-hidden="true"');
});

it("H01-C03: reduced motion keeps the final value and never observes", () => {
  reduce = true;
  stubBrowser();
  const { container } = render(<CountUp value={4.9} decimals={1} />);

  expect(visual(container)).toHaveTextContent("4.9");
  expect(observers).toHaveLength(0);
  expect(frames.size).toBe(0);
});

it("H01-C03: without IntersectionObserver the final value stays", () => {
  stubBrowser({ observer: false });
  const { container } = render(<CountUp value={10} decimals={0} />);

  expect(visual(container)).toHaveTextContent("10");
  expect(frames.size).toBe(0);
});

it("H01-C03: counts from zero to exactly the final value once, without overshoot", () => {
  stubBrowser();
  const { container } = render(<CountUp value={4.9} decimals={1} />);

  expect(visual(container)).toHaveTextContent("0.0");
  expect(visual(container)).toHaveAttribute("aria-hidden", "true");
  expect(announced(container)).toHaveTextContent("4.9");
  expect(observers[0].observe).toHaveBeenCalledOnce();

  intersect(false);
  expect(frames.size).toBe(0);
  intersect();

  const seen: number[] = [];
  for (const time of [1000, 1375, 1750, 2125, 2500]) {
    runFrames(time);
    seen.push(Number(visual(container).textContent));
    expect(announced(container)).toHaveTextContent("4.9");
  }
  expect(seen.at(-1)).toBe(4.9);
  expect(Math.max(...seen)).toBeLessThanOrEqual(4.9);
  expect(seen).toEqual([...seen].sort((a, b) => a - b));
  expect(seen[1]).toBeGreaterThan(0);
  expect(seen[1]).toBeLessThan(4.9);
  expect(frames.size).toBe(0);
  expect(observers[0].disconnect).toHaveBeenCalled();

  intersect();
  expect(frames.size).toBe(0);
  expect(visual(container)).toHaveTextContent("4.9");
});

it("H01-C03: unmount mid-count cancels the frame and disconnects", () => {
  stubBrowser();
  const { unmount } = render(<CountUp value={10} decimals={0} />);
  intersect();
  runFrames(0);
  expect(frames.size).toBe(1);

  unmount();
  expect(cancel).toHaveBeenCalled();
  expect(observers[0].disconnect).toHaveBeenCalled();
});

it("H01-C03: reserves the final width so counting does not shift layout", () => {
  stubBrowser();
  const { container } = render(<CountUp value={1200} decimals={0} />);

  // An invisible copy of the final value alone sizes the box; the counting
  // text overlays it, so proportional digits cannot shift layout.
  const ghost = container.querySelector("[data-count-reserve]")!;
  expect(ghost).toHaveTextContent("1,200");
  expect(ghost).toHaveClass("invisible");
  expect(ghost.parentElement).toBe(visual(container).parentElement);
  expect(ghost.closest('[aria-hidden="true"]')).not.toBeNull();
  expect(visual(container)).toHaveTextContent("0");
  expect(visual(container)).toHaveClass("tabular-nums", "text-end");
});

it("H01-C03: enabling reduced motion mid-count stops immediately at the final value", () => {
  stubBrowser();
  const { container, unmount } = render(<CountUp value={1200} decimals={0} />);
  intersect();
  runFrames(0);
  runFrames(500);
  expect(visual(container)).not.toHaveTextContent("1,200");

  act(() => motionChanged?.({ matches: true } as MediaQueryListEvent));
  expect(visual(container)).toHaveTextContent("1,200");
  expect(announced(container)).toHaveTextContent("1,200");
  expect(frames.size).toBe(0);
  expect(observers[0].disconnect).toHaveBeenCalled();
  unmount();
  expect(removeMotionListener).toHaveBeenCalled();
});

it("H01-C03: missing matchMedia retains the final value without throwing", () => {
  stubBrowser();
  vi.stubGlobal("matchMedia", undefined);
  const { container } = render(<CountUp value={1200} decimals={0} />);
  expect(visual(container)).toHaveTextContent("1,200");
  expect(frames.size).toBe(0);
  expect(observers).toHaveLength(0);
});

it("H01-C03: a changed value cancels the old count and honors reduced motion", () => {
  stubBrowser();
  const { container, rerender } = render(<CountUp value={10} decimals={0} />);
  intersect();
  runFrames(0);
  reduce = true;
  rerender(<CountUp value={4.8} decimals={1} />);
  expect(visual(container)).toHaveTextContent("4.8");
  expect(announced(container)).toHaveTextContent("4.8");
  expect(frames.size).toBe(0);
});

it("H01-C03: zero finishes exactly and unmounting before intersection disconnects", () => {
  stubBrowser();
  const { container, unmount } = render(<CountUp value={0} decimals={2} />);
  expect(visual(container)).toHaveTextContent("0.00");
  expect(announced(container)).toHaveTextContent("0.00");
  unmount();
  expect(observers[0].disconnect).toHaveBeenCalled();
  expect(frames.size).toBe(0);
});
