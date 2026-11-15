import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
test("key templates have no automated WCAG AA violations", async ({ page }) => {
  test.setTimeout(120000);
  const violations: { path: string; id: string; nodes: string[][] }[] = [];
  for (const path of [
    "/",
    "/programs/",
    "/contact/",
    "/faq/",
    "/gallery/",
    "/locations/uttara/",
    "/programs/content-preview/",
  ]) {
    await page.goto(path);
    await page.locator("body").waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    violations.push(
      ...results.violations.map((v) => ({
        path,
        id: v.id,
        nodes: v.nodes.map((n) => n.target.map(String)),
      })),
    );
  }
  expect(violations).toEqual([]);
});
