import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FaqDisclosures } from "@/features/faq/faq-disclosures";

let fine = true;
beforeEach(() => {
  fine = true;
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return fine;
    },
  }));
});
afterEach(() => vi.unstubAllGlobals());

const mount = () => {
  const view = render(
    <FaqDisclosures>
      {[0, 1].map((index) => (
        <details data-faq-row key={index}>
          <summary>Fixture question {index}</summary>
          <div data-faq-answer>
            <a href="#fixture">Fixture answer {index}</a>
          </div>
        </details>
      ))}
    </FaqDisclosures>,
  );
  const rows = [...view.container.querySelectorAll("details")];
  return {
    ...view,
    rows,
    summaries: rows.map((row) => row.querySelector("summary")!),
  };
};
function enter(row: HTMLDetailsElement, pointerType = "mouse") {
  const event = new Event("pointerenter");
  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(row, event);
}

it("previews on mouse entry, stays open through the answer, closes on exit and pins on click", () => {
  const { rows, summaries } = mount();
  enter(rows[0]);
  expect(rows[0].open).toBe(true);
  fireEvent.pointerLeave(rows[0]);
  expect(rows[0].open).toBe(false);
  enter(rows[0]);
  fireEvent.click(summaries[0]);
  fireEvent.pointerLeave(rows[0]);
  expect(rows[0].open).toBe(true);
  enter(rows[1]);
  expect(rows[0].open).toBe(false);
  expect(rows[1].open).toBe(true);
  fireEvent.click(summaries[1]);
  fireEvent.click(summaries[1]);
  expect(rows[1].open).toBe(false);
});

it("ignores touch/pen hover and coarse pointers while clicks still toggle", () => {
  const { rows, summaries } = mount();
  enter(rows[0], "touch");
  enter(rows[0], "pen");
  expect(rows[0].open).toBe(false);
  fine = false;
  enter(rows[0]);
  expect(rows[0].open).toBe(false);
  fireEvent.click(summaries[0]);
  expect(rows[0].open).toBe(true);
  fireEvent.click(summaries[0]);
  expect(rows[0].open).toBe(false);
});

it("protects focused answer content from pointer dismissal and restores focus with Escape", async () => {
  const { rows, summaries } = mount();
  enter(rows[0]);
  rows[0].querySelector("a")!.focus();
  fireEvent.pointerLeave(rows[0]);
  enter(rows[1]);
  expect(rows[0].open).toBe(true);
  expect(rows[1].open).toBe(false);
  fireEvent.keyDown(rows[0].querySelector("a")!, { key: "Escape" });
  expect(rows[0].open).toBe(false);
  expect(summaries[0]).toHaveFocus();
  enter(rows[0]);
  rows[0].querySelector("a")!.focus();
  fireEvent.pointerLeave(rows[0]);
  await act(async () => summaries[1].focus());
  expect(rows[0].open).toBe(false);
});

it("removes its enhancement listeners and ready flag on unmount", () => {
  const { rows, container, unmount } = mount();
  const list = container.querySelector("[data-faq-list]")!;
  expect(list).toHaveAttribute("data-ready", "true");
  unmount();
  enter(rows[0]);
  expect(rows[0].open).toBe(false);
  expect(list).not.toHaveAttribute("data-ready");
});
