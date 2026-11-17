import { expect, it } from "vitest";
import { homeAbout, aboutPage } from "@/content/about";
import { homeAboutSchema, aboutPageSchema } from "@/schemas/about";
import { homeHero } from "@/content/home";
import { metadata } from "@/app/(marketing)/about/page";

it("uses supplied About copy and the owner-approved local photograph", () => {
  expect(homeAboutSchema.safeParse(homeAbout).success).toBe(true);
  expect(aboutPageSchema.safeParse(aboutPage).success).toBe(true);
  expect(homeAbout.image).toEqual(homeHero.image);
  expect(aboutPage.hero.image).toEqual(homeHero.image);
  expect(JSON.stringify({ homeAbout, aboutPage })).not.toContain("[Gym Name]");
  expect(
    homeAbout.paragraphs.join(" ").split(/\s+/).length,
  ).toBeLessThanOrEqual(100);
});

it("rejects blank copy, invalid photography and nonexistent action destinations", () => {
  expect(
    homeAboutSchema.safeParse({ ...homeAbout, paragraphs: [" "] }).success,
  ).toBe(false);
  expect(
    homeAboutSchema.safeParse({
      ...homeAbout,
      image: { ...homeAbout.image, alt: "" },
    }).success,
  ).toBe(false);
  expect(
    homeAboutSchema.safeParse({
      ...homeAbout,
      action: { label: "Story", href: "/about-us/" },
    }).success,
  ).toBe(false);
  expect(
    aboutPageSchema.safeParse({
      ...aboutPage,
      cta: {
        ...aboutPage.cta,
        primary: { label: "Join", href: "https://example.invalid" },
      },
    }).success,
  ).toBe(false);
});

it("rejects duplicate content IDs and unsupported experience icons", () => {
  const values = [...aboutPage.values.items];
  values[1] = values[0];
  expect(
    aboutPageSchema.safeParse({
      ...aboutPage,
      values: { ...aboutPage.values, items: values },
    }).success,
  ).toBe(false);
  const items = [...aboutPage.experience.items];
  items[1] = items[0];
  expect(
    aboutPageSchema.safeParse({
      ...aboutPage,
      experience: { ...aboutPage.experience, items },
    }).success,
  ).toBe(false);
  expect(
    aboutPageSchema.safeParse({
      ...aboutPage,
      experience: {
        ...aboutPage.experience,
        items: aboutPage.experience.items.map((item) => ({
          ...item,
          icon: "invented",
        })),
      },
    }).success,
  ).toBe(false);
});

it("preserves the canonical About route and current preview indexing safeguards", () => {
  expect(metadata.title).toBe(aboutPage.seo.title);
  expect(metadata.description).toBe(aboutPage.seo.description);
  expect(metadata.alternates?.canonical).toMatch(/\/about\/$/);
  expect(metadata.robots).toEqual({ index: false, follow: false });
});
