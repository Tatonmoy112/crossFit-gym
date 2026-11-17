import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { homeFeatures } from "@/content/home-features";
import { homeFeaturesSchema } from "@/schemas/content";
import { routes } from "@/config/routes";

it("uses the six supplied features, descriptions and button labels verbatim in source order", () => {
  const source = readFileSync("newsection.md", "utf8")
    .split("# **03.")[1]
    .split("# **04.")[0];
  expect(source).toContain(homeFeatures.heading);
  expect(source).toContain(homeFeatures.description);
  expect(homeFeatures.items).toHaveLength(6);
  let position = 0;
  for (const item of homeFeatures.items) {
    const title = source.indexOf(`**${item.title}**`, position);
    expect(title).toBeGreaterThanOrEqual(position);
    position = source.indexOf(item.description, title);
    expect(position).toBeGreaterThan(title);
    expect(source).toContain(`CTA: ${item.actionLabel}`);
    expect(routes).toContain(item.href.slice(0, -1));
    expect(item.image).toBeUndefined();
  }
  expect(homeFeatures.action.href).toBe("/contact/");
});

it.each([
  ["duplicate ID", (c: typeof homeFeatures) => (c.items[1].id = c.items[0].id)],
  [
    "missing route",
    (c: typeof homeFeatures) =>
      (c.items[0].href = "/features/modern-equipment/"),
  ],
  ["empty action", (c: typeof homeFeatures) => (c.items[0].actionLabel = " ")],
  ["empty description", (c: typeof homeFeatures) => (c.description = " ")],
  [
    "external CTA",
    (c: typeof homeFeatures) => (c.action.href = "https://example.com/"),
  ],
  [
    "remote image",
    (c: typeof homeFeatures) =>
      (c.items[0].image = {
        src: "https://example.com/photo.webp",
        alt: "Photo",
        width: 600,
        height: 900,
      }),
  ],
])("rejects %s", (_name, mutate) => {
  const content = structuredClone(homeFeatures);
  mutate(content);
  expect(homeFeaturesSchema.safeParse(content).success).toBe(false);
});
