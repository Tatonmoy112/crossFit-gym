import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Page from "@/app/(marketing)/page";
import { homeStats } from "@/content/home";
import { fixture } from "../fixtures/home-stats.data";

vi.mock("embla-carousel-react", () => ({
  default: () => [undefined, undefined],
}));

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

it("H01-C06: shows a clearly labeled example counter inside the real hero before Why choose us", () => {
  const { container } = render(<Page />);
  const preview = screen.getByRole("region", {
    name: "Example counter figures",
  });
  const wrapper = preview.closest<HTMLElement>("[data-home-stats-preview]")!;
  const hero = wrapper.closest("[data-home-hero]")!;
  expect(hero).toContainElement(wrapper);
  expect(hero.nextElementSibling).toHaveAttribute(
    "aria-labelledby",
    "home-why-choose-us-title",
  );
  expect(hero.nextElementSibling?.nextElementSibling).toHaveAttribute(
    "aria-labelledby",
    "home-services-title",
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
  const memberships = container.querySelector("[data-home-memberships]")!;
  expect(memberships.previousElementSibling).toHaveAttribute(
    "data-home-services",
  );
  const features = memberships.nextElementSibling!;
  expect(features).toHaveAttribute("data-home-features");
  expect(features.nextElementSibling).toHaveAttribute(
    "data-home-product-categories",
  );
  const affiliates = features.nextElementSibling?.nextElementSibling;
  expect(affiliates).toHaveAttribute("data-home-affiliates");
  expect(affiliates?.nextElementSibling).toHaveAttribute(
    "data-home-success-stories",
  );
  expect(affiliates?.nextElementSibling?.nextElementSibling).toHaveAttribute(
    "data-home-faq",
  );
  expect(
    affiliates?.nextElementSibling?.nextElementSibling?.nextElementSibling,
  ).toHaveAttribute("aria-labelledby", "home-story-title");
});

it("H01-C06: never renders sample figures when site preview is disabled", () => {
  flags.preview = false;
  const { container } = render(<Page />);
  expect(container.querySelector("[data-home-stats-preview]")).toBeNull();
  expect(container.querySelector("[data-hero-stats]")).toBeNull();
  expect(container.querySelector("[data-home-memberships]")).toBeNull();
  expect(container.querySelector("[data-home-product-categories]")).toBeNull();
  expect(container.querySelector("[data-home-success-stories]")).toBeNull();
  const affiliates = container.querySelector("[data-home-affiliates]");
  expect(affiliates).toBeInTheDocument();
  expect(affiliates?.previousElementSibling).toHaveAttribute(
    "data-home-features",
  );
  expect(affiliates?.nextElementSibling).toHaveAttribute("data-home-faq");
  expect(container.querySelector("[data-home-faq]")).toBeInTheDocument();
  expect(container.querySelectorAll("[data-faq-row]")).toHaveLength(6);
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
