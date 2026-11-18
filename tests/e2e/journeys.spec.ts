import { expect, test } from "@playwright/test";
import { routes } from "../../src/config/routes";
import { previewProducts } from "../../src/content/previews/products";
import { removedRoutes } from "../fixtures/route-inventory";

const liveRoutes = [
  ...routes.map((path) => (path === "/" ? path : path + "/")),
  ...previewProducts.map((product) => "/products/" + product.id + "/"),
];

test("implemented route inventory loads without overflow or placeholders", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of liveRoutes) {
    expect((await page.goto(path))?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(
      page.getByText("Page components are awaiting rebuild.", { exact: true }),
    ).toHaveCount(0);
    await expect(page.locator('[data-slot="breadcrumb"]')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      path,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("removed placeholder URLs use the custom 404 with native recovery", async ({
  page,
  request,
}) => {
  for (const path of removedRoutes)
    expect((await request.get(path)).status(), path).toBe(404);
  expect((await page.goto("/programs/"))?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "404", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("Home and shared navigation link only to implemented destinations", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("navigation", { name: "Page inventory" }),
  ).toHaveCount(0);
  const paths = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(
        links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
      ),
    ]);
  for (const path of paths) {
    expect(removedRoutes).not.toContain(path);
    expect((await request.get(path)).status(), path).toBe(200);
  }
  await page
    .locator('[aria-labelledby="home-hero-title"]')
    .getByRole("link", { name: "View memberships", exact: true })
    .click();
  await expect(page).toHaveURL(/\/membership\/$/);
  await page.goBack();
  await expect(page.getByRole("banner")).toHaveAttribute("data-overlay", "");
  await page.goForward();
  await expect(page.getByRole("banner")).not.toHaveAttribute(
    "data-overlay",
    "",
  );
});

test("native homepage and footer links remain valid without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(
      page.getByRole("navigation", { name: "Page inventory" }),
    ).toHaveCount(0);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")!));
    for (const href of links) expect(removedRoutes).not.toContain(href);
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Contact", exact: true })
      .click();
    await expect(page.locator("#contact-title")).toHaveText(
      "Let's Connect. Your Fitness Journey Matters.",
    );
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Our story", exact: true })
      .click();
    await expect(page.locator("#about-hero-title")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("tablet and wide layouts fit the viewport", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  for (const width of [768, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/",
      "/about/",
      "/contact/",
      "/membership/",
      "/products/",
      "/products/whey-protein-powder/",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        path,
      ).toBe(true);
    }
  }
});

test("skip link moves keyboard focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("unknown pages and detail slugs use the custom 404", async ({ page }) => {
  for (const path of ["/not-a-page/", "/products/missing/"]) {
    expect((await page.goto(path))?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "404", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to home", exact: true }),
    ).toHaveAttribute("href", "/");
  }
});
