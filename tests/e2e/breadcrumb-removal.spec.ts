import { expect, test, type Page } from "@playwright/test";
import { previewProducts } from "../../src/content/previews/products";

const introductions = [
  "/about/",
  "/membership/",
  "/contact/",
  "/products/",
  "/products/whey-protein-powder/",
];
const formerBreadcrumbRoutes = [
  ...introductions,
  "/supplements/",
  ...previewProducts.map((product) => `/products/${product.id}/`),
];
async function absent(page: Page) {
  await expect(
    page.getByRole("navigation", { name: /breadcrumb/i }),
  ).toHaveCount(0);
  await expect(page.locator('[data-slot="breadcrumb"]')).toHaveCount(0);
  await expect(page.locator("h1")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

test("breadcrumb-free page introductions retain header clearance and responsive spacing", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  const widths =
    info.project.name === "desktop" ? [768, 1024, 1280, 1920] : [320, 375];
  for (const path of introductions) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await absent(page);
      const heading = await page.locator("h1").boundingBox();
      const header = await page.getByRole("banner").boundingBox();
      expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1);
      if (path === "/about/") {
        const geometry = await page
          .locator(".about-hero-content")
          .evaluate((node) => ({
            bottom:
              node.getBoundingClientRect().bottom -
              parseFloat(getComputedStyle(node).paddingBottom),
            intro: node
              .querySelector(".about-hero-intro")!
              .getBoundingClientRect().bottom,
          }));
        expect(Math.abs(geometry.bottom - geometry.intro)).toBeLessThanOrEqual(
          1,
        );
      }
      await page.screenshot({
        path: info.outputPath(
          `${path.split("/").filter(Boolean).join("-")}-${width}.png`,
        ),
      });
    }
  }
});

test("all former breadcrumb routes retain native recovery and content without JavaScript", async ({
  browser,
  baseURL,
  page,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: page.viewportSize()!,
  });
  try {
    const native = await context.newPage();
    for (const path of new Set(formerBreadcrumbRoutes)) {
      await native.goto(path);
      await absent(native);
      await expect(native.getByRole("contentinfo")).toHaveCount(1);
    }
    await native
      .getByRole("banner")
      .getByRole("link", { name: "Crossfit Gym home" })
      .click();
    await expect(native).toHaveURL(/\/$/);
  } finally {
    await context.close();
  }
});

test("enlarged spaced text and failed assets keep breadcrumb-free introductions readable", async ({
  page,
}, info) => {
  await page.route("**/*.{woff2,webp,png}", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/about/",
    "/contact/",
    "/products/whey-protein-powder/",
  ]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.addStyleTag({
      content:
        "html{font-size:200%!important} main p{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
    });
    await absent(page);
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Crossfit Gym home" })
      .focus();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Crossfit Gym home" }),
    ).toHaveCSS("outline-style", "solid");
    await page.screenshot({
      path: info.outputPath(
        `${path.split("/").filter(Boolean).join("-")}-enlarged.png`,
      ),
    });
  }
});
