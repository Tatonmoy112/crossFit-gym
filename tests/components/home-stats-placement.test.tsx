import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Page from "@/app/(marketing)/page";
import { homeStats } from "@/content/home";
import { fixture } from "../fixtures/home-stats.data";

const flags = vi.hoisted(() => ({ preview: true }));

vi.mock("@/content/site", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/content/site")>();
  return {
    ...original,
    site: {
      ...original.site,
      get preview() {
        return flags.preview;
      },
    },
  };
});

vi.mock("@/content/home", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/content/home")>();
  return { ...original, homeStats: { ...original.homeStats, items: [] } };
});

beforeEach(() => {
  flags.preview = true;
  homeStats.items = [];
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
});

afterEach(() => vi.unstubAllGlobals());

it("H01-C06: shows a clearly labeled example counter immediately between the real hero and Why choose us", () => {
  const { container } = render(<Page />);
  const preview = screen.getByRole("region", {
    name: "Example counter figures",
  });
  const wrapper = preview.closest<HTMLElement>("[data-home-stats-preview]")!;
  expect(wrapper.previousElementSibling).toHaveAttribute(
    "aria-labelledby",
    "home-hero-title",
  );
  expect(wrapper.nextElementSibling).toHaveAttribute(
    "aria-labelledby",
    "home-why-choose-us-title",
  );
  expect(wrapper.nextElementSibling?.nextElementSibling).toHaveAttribute(
    "aria-labelledby",
    "home-story-title",
  );
  const items = within(preview).getAllByRole("listitem");
  expect(items).toHaveLength(4);
  expect(within(items[3]).getByText("Certified Trainers")).toBeVisible();
  expect(items[3].querySelector("[data-count-reserve]")).toHaveTextContent(
    "30",
  );
  expect(items[3].querySelector("[data-stat-value]")).toHaveTextContent("+");
  expect(within(preview).getByText("Example clients")).toBeVisible();
  expect(within(wrapper).getByRole("note")).toHaveTextContent(
    "Example figures for layout preview only. These are not verified gym statistics.",
  );
  expect(container.querySelectorAll("h1")).toHaveLength(1);
  expect(homeStats.items).toEqual([]);
});

it("H01-C06: never renders sample figures when site preview is disabled", () => {
  flags.preview = false;
  const { container } = render(<Page />);
  expect(container.querySelector("[data-home-stats-preview]")).toBeNull();
  expect(
    screen.queryByRole("region", { name: "Features and services" }),
  ).toBeNull();
  expect(
    container.querySelector('[aria-labelledby="home-stats-title"]'),
  ).toBeNull();
  expect(
    container.querySelector('[aria-labelledby="home-hero-title"]')
      ?.nextElementSibling,
  ).toHaveAttribute("aria-labelledby", "home-why-choose-us-title");
});

it("H01-C06: approved statistics replace samples in both preview and release configurations", () => {
  homeStats.items = fixture.items;
  const { container, rerender } = render(<Page />);
  expect(screen.getByRole("region", { name: homeStats.heading })).toBeVisible();
  expect(container.querySelector("[data-home-stats-preview]")).toBeNull();
  flags.preview = false;
  rerender(<Page />);
  expect(screen.getByRole("region", { name: homeStats.heading })).toBeVisible();
  expect(container.querySelector("[data-home-stats-preview]")).toBeNull();
  expect(screen.queryByRole("note")).toBeNull();
});
