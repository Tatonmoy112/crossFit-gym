import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { HomeStory } from "@/features/home/home-story";
import { ContentState } from "@/components/shared/content-state";
import { homeStory } from "@/content/home";

// Clearly fictitious fixture text: verifies layout only, never shipped.
const fixtureStory = {
  ...homeStory,
  story:
    "Fixture paragraph one.\n\n\n  Fixture paragraph two.  \n\n   \n\nFixture paragraph three.",
};

it("H01-B01: real content shows the explicit missing state as the named region", () => {
  const { container } = render(<HomeStory content={homeStory} />);

  const region = screen.getByRole("region", {
    name: homeStory.missing.title,
  });
  const heading = within(region).getByRole("heading", { level: 2 });
  expect(heading).toHaveAttribute("id", "home-story-title");
  expect(within(region).getByText(homeStory.missing.description)).toBeVisible();
  expect(within(region).queryByRole("link")).toBeNull();
  expect(screen.queryByText("Our story")).toBeNull();
  expect(
    container.querySelector("h1, form, button, input, [aria-live]"),
  ).toBeNull();
});

it("H01-B02: a supplied story renders heading, split paragraphs and the About link", () => {
  const { container } = render(<HomeStory content={fixtureStory} />);

  const region = screen.getByRole("region", { name: "Our story" });
  expect(
    within(region).getByRole("heading", { level: 2, name: "Our story" }),
  ).toHaveAttribute("id", "home-story-title");
  const paragraphs = [...region.querySelectorAll("[data-story-paragraph]")];
  expect(paragraphs.map((node) => node.textContent)).toEqual([
    "Fixture paragraph one.",
    "Fixture paragraph two.",
    "Fixture paragraph three.",
  ]);
  paragraphs.forEach((node) => expect(node.tagName).toBe("P"));
  expect(
    [...region.querySelectorAll("p")].every((p) => p.textContent?.trim()),
  ).toBe(true);
  expect(
    within(region).getByRole("link", { name: "More about Crossfit Gym" }),
  ).toHaveAttribute("href", "/about");
  expect(screen.queryByText(homeStory.missing.title)).toBeNull();
  expect(container.querySelector("h1")).toBeNull();
});

it("H01-B02: a single-paragraph story renders one paragraph", () => {
  render(<HomeStory content={{ ...homeStory, story: "Only fixture line." }} />);

  expect(
    screen
      .getByRole("region", { name: "Our story" })
      .querySelectorAll("[data-story-paragraph]"),
  ).toHaveLength(1);
});

it("H01-B02: story text is escaped, not parsed as markup", () => {
  const { container } = render(
    <HomeStory content={{ ...homeStory, story: "<b>Fixture</b> & more" }} />,
  );

  expect(screen.getByText("<b>Fixture</b> & more")).toBeInTheDocument();
  expect(container.querySelector("b")).toBeNull();
});

it("H01-B04: ContentState forwards headingId to its H2 and stays unchanged without it", () => {
  const { rerender } = render(
    <ContentState
      title="Fixture title"
      description="Fixture description."
      headingId="fixture-id"
    />,
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Fixture title" }),
  ).toHaveAttribute("id", "fixture-id");

  rerender(
    <ContentState title="Fixture title" description="Fixture description." />,
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Fixture title" }),
  ).not.toHaveAttribute("id");
});
