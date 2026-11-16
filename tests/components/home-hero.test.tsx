import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { HomeHero } from "@/features/home/home-hero";
import { homeHero } from "@/content/home";
import { site } from "@/content/site";

const heroName = `${site.tagline} ${site.name}`;

it("H01-A01: names the hero region by a two-part H1 (tagline, then gym name)", () => {
  const { container } = render(<HomeHero content={homeHero} />);

  const region = screen.getByRole("region", { name: heroName });
  expect(region.tagName).toBe("SECTION");
  const heading = within(region).getByRole("heading", {
    level: 1,
    name: heroName,
  });
  expect(heading).toHaveAttribute("id", "home-hero-title");
  expect(heading.querySelector("[data-hero-tagline]")).toHaveTextContent(
    site.tagline,
  );
  expect(heading.querySelector("[data-hero-name]")).toHaveTextContent(
    site.name,
  );
  expect(
    heading
      .querySelector("[data-hero-tagline]")!
      .compareDocumentPosition(heading.querySelector("[data-hero-name]")!) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(container.querySelectorAll("h1")).toHaveLength(1);
  expect(container.querySelector("h2, h3, h4, h5, h6")).toBeNull();
  expect(container.querySelector("[data-hero-location]")).toHaveTextContent(
    site.shortAddress,
  );
});

it("H01-A01: contains no forms, buttons or live regions", () => {
  const { container } = render(<HomeHero content={homeHero} />);

  expect(
    container.querySelector("form, button, input, [aria-live], dialog"),
  ).toBeNull();
});

it("H01-A02: renders exactly two real actions as shadcn Button links", () => {
  render(<HomeHero content={homeHero} />);

  const links = within(screen.getByRole("list")).getAllByRole("link");
  expect(links.map((link) => link.textContent?.trim())).toEqual([
    `Call ${site.phone}`,
    "Get directions",
  ]);
  expect(links[0]).toHaveAttribute("href", `tel:${site.telephone}`);
  expect(links[1]).toHaveAttribute("href", site.directions);
  expect(links.map((link) => link.getAttribute("data-slot"))).toEqual([
    "button",
    "button",
  ]);
  expect(links.map((link) => link.getAttribute("data-variant"))).toEqual([
    "default",
    "outline",
  ]);
  expect(links.map((link) => link.getAttribute("data-action"))).toEqual([
    "primary",
    "secondary",
  ]);
  links.forEach((link) => {
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("type");
    expect(link.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });
});

it("H01-A03/A11: image, hidden scrims and decorative vertical name", () => {
  const { container } = render(<HomeHero content={homeHero} />);

  const image = screen.getByRole("img", { name: homeHero.image.alt });
  expect(image).toHaveAttribute("src", homeHero.image.src);
  expect(image).toHaveAttribute("width", String(homeHero.image.width));
  expect(image).toHaveAttribute("height", String(homeHero.image.height));
  expect(image).toHaveAttribute("loading", "eager");
  expect(image).toHaveAttribute("fetchpriority", "high");

  for (const selector of [
    "[data-hero-overlay]",
    "[data-hero-gradient]",
    "[data-hero-vertical]",
  ]) {
    expect(container.querySelector(selector)).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  }
  expect(container.querySelector("[data-hero-vertical]")).toHaveTextContent(
    site.name,
  );
  expect(screen.getAllByText(site.name)).toHaveLength(2);
});

it("H01-A06: renders a single action as one primary Button link", () => {
  render(
    <HomeHero
      content={{
        ...homeHero,
        actions: [{ label: "Contact us", href: "/contact" }],
      }}
    />,
  );

  const links = within(screen.getByRole("list")).getAllByRole("link");
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveAttribute("data-action", "primary");
  expect(links[0]).toHaveAttribute("data-variant", "default");
});

it("H01-A06: escapes markup-like content as literal text", () => {
  const { container } = render(
    <HomeHero content={{ ...homeHero, tagline: "<b>One step</b>" }} />,
  );

  expect(screen.getByText("<b>One step</b>")).toBeInTheDocument();
  expect(container.querySelector("b")).toBeNull();
});
