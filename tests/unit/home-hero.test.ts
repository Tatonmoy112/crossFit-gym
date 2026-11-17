import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { homeHeroSchema } from "@/schemas/content";
import { homeHero } from "@/content/home";
import { site } from "@/content/site";

const valid = () => structuredClone(homeHero);

it("H01-A04: derives hero text and actions from approved site content only", () => {
  expect(homeHero.title).toBe(site.name);
  expect(homeHero.tagline).toBe(site.tagline);
  expect(homeHero.location).toBe(site.shortAddress);
  expect(homeHero.actions).toEqual([
    { label: "Start your journey", href: "/contact/" },
    { label: "View memberships", href: "/membership/" },
  ]);
  expect(JSON.stringify(homeHero)).not.toMatch(/mailto:|welcome/i);
});

it.each([
  ["blank title", (hero: ReturnType<typeof valid>) => (hero.title = "  ")],
  ["blank tagline", (hero: ReturnType<typeof valid>) => (hero.tagline = "")],
  ["blank location", (hero: ReturnType<typeof valid>) => (hero.location = " ")],
  [
    "blank image alt",
    (hero: ReturnType<typeof valid>) => (hero.image.alt = ""),
  ],
  [
    "blank action label",
    (hero: ReturnType<typeof valid>) => (hero.actions[0].label = " "),
  ],
  [
    "http destination",
    (hero: ReturnType<typeof valid>) =>
      (hero.actions[1].href = "http://maps.example.com"),
  ],
  [
    "javascript destination",
    (hero: ReturnType<typeof valid>) =>
      (hero.actions[1].href = "javascript:alert(1)"),
  ],
  [
    "protocol-relative destination",
    (hero: ReturnType<typeof valid>) =>
      (hero.actions[1].href = "//evil.example"),
  ],
  [
    "malformed telephone",
    (hero: ReturnType<typeof valid>) => (hero.actions[0].href = "tel:01323"),
  ],
  ["no actions", (hero: ReturnType<typeof valid>) => (hero.actions = [])],
  [
    "four actions",
    (hero: ReturnType<typeof valid>) =>
      hero.actions.push(
        { label: "Extra", href: "/about" },
        { label: "More", href: "/faq" },
      ),
  ],
])("H01-A04: schema rejects %s", (_name, mutate) => {
  const hero = valid();
  mutate(hero);
  expect(homeHeroSchema.safeParse(hero).success).toBe(false);
});

it("H01-A04: schema accepts a single root-relative action", () => {
  const hero = valid();
  hero.actions = [{ label: "Contact us", href: "/contact" }];
  expect(homeHeroSchema.safeParse(hero).success).toBe(true);
});

it("H01-A03: hero image is a local WebP derivative matching its provenance", () => {
  expect(homeHero.image.src).toBe("/images/brand/home-hero.webp");
  const file = resolve("public", homeHero.image.src.slice(1));
  expect(existsSync(file)).toBe(true);
  const bytes = readFileSync(file);
  expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
  expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");

  const provenance = JSON.parse(
    readFileSync(resolve("public/images/brand/home-hero-source.json"), "utf8"),
  );
  expect(provenance.source.path).toBe("public/images/brand/hero_section.png");
  expect(provenance.output).toMatchObject({
    path: "public/images/brand/home-hero.webp",
    bytes: bytes.length,
    width: homeHero.image.width,
    height: homeHero.image.height,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
  expect(homeHero.image).toMatchObject({ width: 1672, height: 941 });
  expect(bytes.length).toBeLessThan(400_000);
});
