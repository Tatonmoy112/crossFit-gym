import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { homeAffiliates } from "../../src/content/home-affiliates";

const section = (page: Page) => page.locator("[data-home-affiliates]");
async function ready(page: Page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await section(page).scrollIntoViewIfNeeded();
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await section(page)
      .locator("h2,h3,p,a,figcaption")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => node.scrollWidth > node.clientWidth + 1)
          .map((node) => node.textContent),
      ),
  ).toEqual([]);
  expect(
    await section(page)
      .locator("[data-partnership-opportunity], [data-partnership-hub]")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const parent = node.closest("figure")!.getBoundingClientRect();
            const box = node.getBoundingClientRect();
            return box.left < parent.left - 1 || box.right > parent.right + 1;
          })
          .map((node) => node.textContent),
      ),
  ).toEqual([]);
}

test("partnership invitation sits between Product Categories and Success Stories with responsive diagram geometry", async ({
  page,
}, info) => {
  await ready(page);
  expect(
    await section(page).evaluate(
      (node) =>
        node.previousElementSibling?.hasAttribute(
          "data-home-product-categories",
        ) &&
        node.nextElementSibling?.hasAttribute("data-home-success-stories") &&
        node.nextElementSibling.nextElementSibling?.hasAttribute(
          "data-home-faq",
        ),
    ),
  ).toBe(true);
  await expect(section(page).getByRole("heading", { level: 2 })).toHaveText(
    homeAffiliates.heading,
  );
  await expect(section(page).locator("figcaption")).toHaveText(
    "Partnership opportunities",
  );
  await expect(section(page).locator("li h3")).toHaveText(
    homeAffiliates.opportunities.map((item) => item.title),
  );
  await expect(section(page).locator("a")).toHaveCount(1);
  await expect(section(page).locator("form,button,[data-preview]")).toHaveCount(
    0,
  );
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const geometry = await section(page).evaluate((node) => {
      const box = (selector: string) =>
        node.querySelector(selector)!.getBoundingClientRect().toJSON();
      return {
        intro: box("header"),
        diagram: box("figure"),
        action: box(".home-affiliates-action"),
        hub: box("[data-partnership-hub]"),
        tiles: box(".partnership-opportunities"),
      };
    });
    if (width >= 1024)
      expect(geometry.intro.right).toBeLessThan(geometry.diagram.left);
    else {
      expect(geometry.diagram.top).toBeGreaterThanOrEqual(
        geometry.intro.bottom,
      );
      expect(geometry.action.top).toBeGreaterThanOrEqual(
        geometry.diagram.bottom,
      );
    }
    if (width >= 768)
      expect(geometry.hub.right).toBeLessThan(geometry.tiles.left);
    else expect(geometry.hub.bottom).toBeLessThan(geometry.tiles.top);
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath(`affiliates-${width}.png`),
    });
  }
});

test("the only section action has visible keyboard focus and reaches Contact with history recovery", async ({
  page,
}, info) => {
  await ready(page);
  const link = section(page).getByRole("link", { name: "Become a Partner" });
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
  if (info.project.name === "mobile") await link.tap();
  else await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.goBack();
  await expect(
    section(page).getByRole("heading", { name: homeAffiliates.heading }),
  ).toBeVisible();
});

test("the complete invitation and Contact action work without JavaScript", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await ready(page);
  await expect(section(page).locator("li")).toHaveCount(3);
  await expect(
    section(page).locator(".home-affiliates-intro p").last(),
  ).toHaveText(homeAffiliates.description);
  await fits(page);
  await section(page).getByRole("link", { name: "Become a Partner" }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await context.close();
});

test("enlarged spaced text, long labels, blocked assets and reduced motion retain the complete diagram", async ({
  page,
}, info) => {
  await page.route(/\.(?:woff2?|webp|png|jpg)(?:\?|$)/, (route) =>
    route.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.addStyleTag({
    content:
      "html { font-size: 200% !important } [data-home-affiliates] { letter-spacing: .12em; word-spacing: .16em; line-height: 1.8 }",
  });
  await section(page)
    .locator("li h3")
    .first()
    .evaluate((node) => node.append(" Unbrokenfixtureword".repeat(14)));
  await expect(section(page).locator("[data-partnership-hub] p")).toBeVisible();
  await expect(
    section(page).getByRole("link", { name: "Become a Partner" }),
  ).toBeVisible();
  await fits(page);
  await section(page).screenshot({
    path: info.outputPath("affiliates-enlarged.png"),
  });
});

test("charcoal introduction, light tiles and yellow action retain accessible contrast and forced-colors focus", async ({
  page,
}) => {
  await ready(page);
  await expect(section(page)).toHaveCSS("background-color", "rgb(32, 32, 32)");
  await expect(section(page).locator("li").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-affiliates]")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.emulateMedia({ forcedColors: "active" });
  const link = section(page).getByRole("link", { name: "Become a Partner" });
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
  await fits(page);
});
