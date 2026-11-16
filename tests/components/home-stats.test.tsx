import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, expect, it, vi } from "vitest";
import { HomeStats } from "@/features/home/home-stats";
import { homeStats } from "@/content/home";
import type { HomeStatsContent } from "@/schemas/content";

// Clearly fictitious fixture: verifies layout/semantics only, never shipped.
const fixture: HomeStatsContent = {
  heading: "Crossfit Gym in numbers",
  items: [
    {
      value: 10,
      decimals: 0,
      suffix: "K+",
      label: "Fixture members",
      source: "Test fixture",
    },
    {
      value: 4.9,
      decimals: 1,
      suffix: "★",
      suffixLabel: "out of 5",
      label: "Fixture rating",
      source: "Test fixture",
    },
    {
      value: 5,
      decimals: 0,
      suffix: "+",
      label: "Fixture years",
      source: "Test fixture",
    },
  ],
};

// Text a screen reader would announce: skip aria-hidden subtrees.
function spoken(node: Node): string {
  if (node instanceof Element && node.getAttribute("aria-hidden") === "true")
    return "";
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  return [...node.childNodes].map(spoken).join("");
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: query.includes("reduce"),
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  );
});

it("H01-C02: real content renders nothing", () => {
  const { container } = render(<HomeStats content={homeStats} />);

  expect(container).toBeEmptyDOMElement();
});

it("H01-C02: fixture renders a named region with spoken value and label pairs", () => {
  const { container } = render(<HomeStats content={fixture} />);

  const region = screen.getByRole("region", {
    name: "Crossfit Gym in numbers",
  });
  const heading = within(region).getByRole("heading", { level: 2 });
  expect(heading).toHaveAttribute("id", "home-stats-title");
  expect(heading).toHaveClass("sr-only");
  expect(container.querySelector("h1")).toBeNull();

  const items = within(within(region).getByRole("list")).getAllByRole(
    "listitem",
  );
  expect(items).toHaveLength(3);
  expect(
    items.map((item) => spoken(item.querySelector("[data-stat-value]")!)),
  ).toEqual(["10K+", "4.9 out of 5", "5+"]);
  expect(
    items.map((item) => item.querySelector("[data-stat-label]")!.textContent),
  ).toEqual(["Fixture members", "Fixture rating", "Fixture years"]);
  expect(spoken(items[1])).not.toContain("★");
});

it("H01-C02: separators are decorative and appear only between items", () => {
  const { container } = render(<HomeStats content={fixture} />);

  const separators = container.querySelectorAll('[data-slot="separator"]');
  // One horizontal (stacked) and one vertical (row) divider per gap.
  expect(separators).toHaveLength(4);
  expect(screen.queryAllByRole("separator")).toHaveLength(0);
  const [first] = screen.getAllByRole("listitem");
  expect(first.querySelector('[data-slot="separator"]')).toBeNull();
  expect(
    container.querySelector("a, button, form, input, [aria-live]"),
  ).toBeNull();
});

it("H01-C02: server HTML contains the final values and hides nothing from no-JS users", () => {
  const html = renderToString(<HomeStats content={fixture} />);

  expect(html).toContain("Crossfit Gym in numbers");
  for (const value of [">10<", ">4.9<", ">5<"]) expect(html).toContain(value);
  expect(html).not.toMatch(/>0(\.0)?</);
});

it.each([1, 4])(
  "H01-C02: supports %s items with dividers only between them",
  (count) => {
    const items = Array.from({ length: count }, (_, index) => ({
      ...fixture.items[0],
      value: index,
      label: `Example ${index}`,
    }));
    const { container } = render(<HomeStats content={{ ...fixture, items }} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(count);
    expect(container.querySelectorAll('[data-slot="separator"]')).toHaveLength(
      (count - 1) * 2,
    );
    expect(
      container.querySelector("[data-stat-value] .sr-only"),
    ).toHaveTextContent("0");
  },
);
