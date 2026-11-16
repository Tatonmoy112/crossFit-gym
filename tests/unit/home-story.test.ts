import { expect, it } from "vitest";
import { aboutSchema } from "@/schemas/content";
import { about } from "@/content/about";
import { homeStory } from "@/content/home";

const empty = { story: null, mission: null, values: [], community: null };

it("H01-B03: about content validates and keeps the story explicitly absent", () => {
  expect(aboutSchema.safeParse(about).success).toBe(true);
  expect(about.story).toBeNull();
});

it.each([
  ["blank story", { ...empty, story: "" }],
  ["whitespace story", { ...empty, story: "   \n  " }],
  ["blank mission", { ...empty, mission: " " }],
  ["blank community", { ...empty, community: "" }],
  ["blank value", { ...empty, values: ["Strength", " "] }],
])("H01-B03: aboutSchema rejects %s", (_name, input) => {
  expect(aboutSchema.safeParse(input).success).toBe(false);
});

it("H01-B03: aboutSchema accepts nulls and nonblank text", () => {
  expect(aboutSchema.safeParse(empty).success).toBe(true);
  expect(
    aboutSchema.safeParse({ ...empty, story: "Fixture story.", values: ["A"] })
      .success,
  ).toBe(true);
});

it("H01-B03: homeStory derives from about and invents no copy", () => {
  expect(homeStory.story).toBe(about.story);
  expect(homeStory.heading).toBe("Our story");
  expect(homeStory.link).toEqual({
    label: "More about Crossfit Gym",
    href: "/about",
  });
  expect(homeStory.missing).toEqual({
    title: "Our story has not been supplied yet",
    description:
      "Approved story text for Crossfit Gym has not been provided for this website.",
  });
});
