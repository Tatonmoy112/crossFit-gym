import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { homeServices } from "@/content/home-services";
import { homeServicesSchema } from "@/schemas/content";
import { programs } from "@/content/programs";

it("uses all eight owner-approved titles and subtitles verbatim and in source order", () => {
  const source = readFileSync("newsection.md", "utf8");
  let position = 0;
  expect(homeServices.items).toHaveLength(8);
  for (const item of homeServices.items) {
    const title = source.indexOf(`**${item.title}**`, position);
    expect(title).toBeGreaterThanOrEqual(position);
    position = source.indexOf(item.subtitle, title);
    expect(position).toBeGreaterThan(title);
    expect(item.href).toBe("/contact/");
    expect(item.image).toBeUndefined();
  }
  expect(source).toContain(homeServices.heading);
  expect(source).toContain(homeServices.description);
  expect(programs).toEqual([]);
});

it.each([
  ["blank heading", (content: typeof homeServices) => (content.heading = " ")],
  [
    "blank subtitle",
    (content: typeof homeServices) => (content.items[0].subtitle = " "),
  ],
  [
    "duplicate ID",
    (content: typeof homeServices) =>
      (content.items[1].id = content.items[0].id),
  ],
  [
    "unsafe ID",
    (content: typeof homeServices) => (content.items[0].id = "../escape"),
  ],
  [
    "future missing route",
    (content: typeof homeServices) =>
      (content.items[0].href = "/services/personal-training/"),
  ],
  [
    "external destination",
    (content: typeof homeServices) =>
      (content.items[0].href = "https://example.com/"),
  ],
])("rejects %s", (_name, mutate) => {
  const content = structuredClone(homeServices);
  mutate(content);
  expect(homeServicesSchema.safeParse(content).success).toBe(false);
});

it("accepts empty content and a future local image without creating fake records", () => {
  expect(
    homeServicesSchema.safeParse({ ...homeServices, items: [] }).success,
  ).toBe(true);
  const content = structuredClone(homeServices);
  content.items[0].image = {
    src: "/images/service.webp",
    alt: "Owner-supplied training photograph",
    width: 600,
    height: 800,
  };
  expect(homeServicesSchema.safeParse(content).success).toBe(true);
});
