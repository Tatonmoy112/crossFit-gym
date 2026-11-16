import { expect, it } from "vitest";
import {
  homeWhyChooseUsSchema,
  whyChooseUsItemSchema,
} from "@/schemas/content";
import { whyCardFixture } from "../fixtures/why-choose-us.data";
import { homeHero, homeWhyChooseUs } from "@/content/home";
import { site } from "@/content/site";

it("H01-D03: section uses exactly the selected supplied facts and photo without borrowed demo copy", () => {
  expect(homeWhyChooseUs.heading).toBe("Why choose us");
  expect(homeWhyChooseUs.items.map((item) => item.title)).toEqual([
    "Certified Training Team",
    "Your Gym in Uttara",
    "Start With a Conversation",
  ]);
  expect(homeWhyChooseUs.items.map((item) => item.description)).toEqual([
    "Train at Crossfit Gym, home to a team of 30+ certified trainers.",
    `Make training part of your routine. Visit us at ${site.address}.`,
    `Have questions before your first visit? Call ${site.phone} to speak directly with the Crossfit Gym team.`,
  ]);
  expect(homeWhyChooseUs.items.map((item) => item.imagePosition)).toEqual([
    "left",
    "center",
    "right",
  ]);
  expect(
    homeWhyChooseUs.items.every(
      (item) => item.image.src === homeHero.image.src && item.source.trim(),
    ),
  ).toBe(true);
  expect(homeWhyChooseUs.items[0].source).toContain("Owner supplied");
  expect(homeWhyChooseUsSchema.safeParse(homeWhyChooseUs).success).toBe(true);
});

it("H01-D03: accepts the sourced local card and an empty collection", () => {
  expect(whyChooseUsItemSchema.safeParse(whyCardFixture).success).toBe(true);
  expect(
    homeWhyChooseUsSchema.safeParse({ heading: "Why choose us", items: [] })
      .success,
  ).toBe(true);
});

it.each([
  { title: " " },
  { description: "" },
  { id: "bad id" },
  { source: " " },
  { imagePosition: "arbitrary" },
  {
    image: {
      ...whyCardFixture.image,
      src: "https://example.invalid/image.webp",
    },
  },
  { image: { ...whyCardFixture.image, src: "//example.invalid/image.webp" } },
  { image: { ...whyCardFixture.image, src: "/images/../private.webp" } },
  { image: { ...whyCardFixture.image, width: 0 } },
  { image: { ...whyCardFixture.image, height: -1 } },
  { image: { ...whyCardFixture.image, width: 4.5 } },
  { image: { ...whyCardFixture.image, alt: "" } },
])("H01-D03: rejects malformed card content %j", (override) => {
  expect(
    whyChooseUsItemSchema.safeParse({ ...whyCardFixture, ...override }).success,
  ).toBe(false);
});

it("H01-D03: rejects blank section headings and duplicate card IDs", () => {
  expect(
    homeWhyChooseUsSchema.safeParse({ heading: " ", items: [] }).success,
  ).toBe(false);
  expect(
    homeWhyChooseUsSchema.safeParse({
      heading: "Why choose us",
      items: [whyCardFixture, whyCardFixture],
    }).success,
  ).toBe(false);
});
