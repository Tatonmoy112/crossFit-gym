import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { homeAbout, aboutPage } from "@/content/about";
import { HomeAbout } from "@/features/home/home-about";
import { AboutPage } from "@/features/about/about-page";

it("renders the homepage introduction as one named section with a native About destination", () => {
  const { container } = render(<HomeAbout content={homeAbout} />);
  const section = screen.getByRole("region", { name: homeAbout.heading });
  expect(within(section).getByRole("heading", { level: 2 })).toHaveAttribute(
    "id",
    "home-about-title",
  );
  homeAbout.paragraphs.forEach((text) =>
    expect(within(section).getByText(text)).toBeVisible(),
  );
  expect(
    within(section).getByRole("link", { name: "Discover Our Story" }),
  ).toHaveAttribute("href", expect.stringMatching(/^\/about\/?$/));
  expect(within(section).getByRole("img")).toHaveAttribute(
    "alt",
    homeAbout.image.alt,
  );
  expect(container.querySelector("h1, button, form, [aria-live]")).toBeNull();
});

it("composes all nine About sections with semantic headings and working membership/contact actions", () => {
  const { container } = render(<AboutPage content={aboutPage} />);
  expect(
    [...container.querySelectorAll("[data-about-section]")].map((node) =>
      node.getAttribute("data-about-section"),
    ),
  ).toEqual([
    "hero",
    "story",
    "purpose",
    "values",
    "experience",
    "approach",
    "community",
    "membership",
    "cta",
  ]);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    aboutPage.hero.heading,
  );
  expect(
    screen.queryByRole("navigation", { name: /breadcrumb/i }),
  ).not.toBeInTheDocument();
  const ids = [...container.querySelectorAll("[id]")].map((node) => node.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const section of container.querySelectorAll("[data-about-section]")) {
    expect(
      section.querySelector(`#${section.getAttribute("aria-labelledby")}`),
    ).not.toBeNull();
  }
  expect(
    screen.getByRole("link", { name: "Explore Membership Plans" }),
  ).toHaveAttribute("href", expect.stringMatching(/^\/membership\/?$/));
  expect(screen.getByRole("link", { name: "Become a Member" })).toHaveAttribute(
    "href",
    expect.stringMatching(/^\/membership\/?$/),
  );
  expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
    "href",
    expect.stringMatching(/^\/contact\/?$/),
  );
  expect(
    screen.queryByText("Page components are awaiting rebuild."),
  ).toBeNull();
  expect(container.querySelector("form, input, dialog")).toBeNull();
});

it("escapes supplied paragraphs rather than interpreting them as markup", () => {
  const { container } = render(
    <HomeAbout
      content={{ ...homeAbout, paragraphs: ["<script>Fixture</script>"] }}
    />,
  );
  expect(screen.getByText("<script>Fixture</script>")).toBeVisible();
  expect(container.querySelector("script")).toBeNull();
});
