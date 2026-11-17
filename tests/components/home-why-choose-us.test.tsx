import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeWhyChooseUs } from "@/features/home/home-why-choose-us";
import { homeWhyChooseUs } from "@/content/home";
import Page from "@/app/(marketing)/page";

vi.mock("embla-carousel-react", () => ({
  default: () => [undefined, undefined],
}));

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
});
afterEach(() => vi.unstubAllGlobals());

it("H01-D04: reuses the same card for three H3 articles inside a named H2 section", () => {
  const { container } = render(<HomeWhyChooseUs content={homeWhyChooseUs} />);
  const region = screen.getByRole("region", { name: "Why choose us" });
  expect(within(region).getByRole("heading", { level: 2 })).toHaveAttribute(
    "id",
    "home-why-choose-us-title",
  );
  const items = within(within(region).getByRole("list")).getAllByRole(
    "listitem",
  );
  expect(items).toHaveLength(3);
  expect(
    within(region)
      .getAllByRole("article")
      .map((article) => article.getAttribute("data-why-card")),
  ).toEqual(homeWhyChooseUs.items.map((item) => item.id));
  expect(
    within(region)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent),
  ).toEqual(homeWhyChooseUs.items.map((item) => item.title));
  expect(
    new Set(
      within(region)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.id),
    ).size,
  ).toBe(3);
  expect(
    container.querySelector("h1, a, button, form, [tabindex], [aria-live]"),
  ).toBeNull();
});

it("H01-D04: an empty collection renders no section, heading or empty grid", () => {
  const { container } = render(
    <HomeWhyChooseUs content={{ ...homeWhyChooseUs, items: [] }} />,
  );
  expect(container).toBeEmptyDOMElement();
});

it("H01-D04: actual Home places the new services section after Why choose us", () => {
  const { container } = render(<Page />);
  expect(
    screen.queryByRole("region", { name: "Features and services" }),
  ).toBeNull();
  expect(
    container.querySelector("[data-features-wheel], [data-feature-card]"),
  ).toBeNull();
  const region = screen.getByRole("region", { name: "Why choose us" });
  expect(region.previousElementSibling).toHaveAttribute("data-home-hero");
  expect(
    region.previousElementSibling?.querySelector("[data-home-stats-preview]"),
  ).not.toBeNull();
  expect(region.nextElementSibling).toHaveAttribute(
    "aria-labelledby",
    "home-services-title",
  );
  expect(region.nextElementSibling?.nextElementSibling).toHaveAttribute(
    "aria-labelledby",
    "home-features-title",
  );
  expect(
    region.nextElementSibling?.nextElementSibling?.nextElementSibling,
  ).toHaveAttribute("aria-labelledby", "home-memberships-title");
  expect(container.querySelectorAll("h1")).toHaveLength(1);
  expect(screen.getByText("Our story has not been supplied yet")).toBeVisible();
});
