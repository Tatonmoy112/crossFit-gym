import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { routes } from "@/config/routes";
import { navigation } from "@/content/navigation";
import { navigationSchema } from "@/schemas/navigation";
import { homeFeatures } from "@/content/home-features";
import { footerContent } from "@/content/footer";
import { maintenancePages } from "@/content/maintenance";

it("registers implemented and maintenance pages while rejecting unavailable detail/legal destinations", () => {
  expect(routes).toEqual([
    "/",
    "/about",
    "/membership",
    "/contact",
    "/products",
    "/supplements",
    ...maintenancePages.map((page) => page.path),
  ]);
  for (const href of [
    "/programs/content-preview",
    "/coaches/content-preview",
    "/locations/uttara",
    "/privacy",
    "/terms",
  ]) {
    expect(
      navigationSchema.safeParse([
        { label: "Retired", links: [{ label: "Retired", href }] },
      ]).success,
    ).toBe(false);
  }
  expect(
    navigation
      .flatMap((group) => group.links)
      .every((link) => routes.includes(link.href)),
  ).toBe(true);
  expect(
    homeFeatures.items
      .filter((item) => item.id !== "supportive-community")
      .every((item) => item.href === "/contact/"),
  ).toBe(true);
  expect(footerContent.legal).toEqual([]);
  expect(footerContent.legalNotice).toBe("Legal text is awaiting approval.");
});

it("keeps the completed pages and ten maintenance routes without the old homepage inventory", () => {
  function pages(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? pages(join(dir, entry.name))
        : entry.name === "page.tsx"
          ? [join(dir, entry.name)]
          : [],
    );
  }
  const files = pages("src/app");
  expect(files).toHaveLength(17);
  for (const file of files)
    expect(readFileSync(file, "utf8")).not.toContain(
      "Page components are awaiting rebuild.",
    );
  const home = readFileSync("src/app/(marketing)/page.tsx", "utf8");
  expect(home).not.toMatch(/Page inventory|awaiting rebuild|content-preview/);
});
