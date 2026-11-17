import { expect, test } from "@playwright/test";

test("Website preview banner is absent on Home, interior, structural preview and 404 pages while indexing stays disabled", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/about/",
    "/programs/",
    "/programs/content-preview/",
    "/blog/content-preview/",
    "/terms/",
    "/not-a-page/",
  ]) {
    expect((await page.goto(path))?.status()).toBe(
      path === "/not-a-page/" ? 404 : 200,
    );
    await expect(
      page.getByRole("note", { name: "Website preview" }),
    ).toHaveCount(0);
    await expect(
      page.getByText(
        "This website is being rebuilt. Content is incomplete and awaiting approval.",
        { exact: true },
      ),
    ).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "<loc>",
  );
});

test("Home hero starts under its overlay header without the removed banner or an empty gap", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("banner")).toHaveAttribute("data-overlay", "");
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("banner")).toHaveCSS(
      "border-bottom-width",
      "1px",
    );
    await expect(page.getByRole("banner")).toHaveCSS("box-shadow", "none");
    await expect(page.locator('[aria-labelledby="home-hero-title"]')).toHaveCSS(
      "border-top-width",
      "0px",
    );
    const geometry = await page.evaluate(() => {
      const header = document.querySelector("header")!;
      const main = document.querySelector("main")!;
      const hero = document.querySelector(
        '[aria-labelledby="home-hero-title"]',
      )!;
      return {
        first: main.firstElementChild === hero,
        headerTop: header.getBoundingClientRect().top,
        heroTop: hero.getBoundingClientRect().top,
        fits: document.documentElement.scrollWidth <= innerWidth + 1,
      };
    });
    expect(geometry.first).toBe(true);
    expect(geometry.heroTop).toBeCloseTo(geometry.headerTop, 1);
    expect(geometry.fits).toBe(true);
  }
  await expect(
    page.locator("[data-home-stats-preview]").getByRole("note"),
  ).toContainText("not verified gym statistics");
  await page.setViewportSize({
    width: info.project.name === "mobile" ? 375 : 1280,
    height: 900,
  });
  await page.screenshot({
    path: info.outputPath("home-without-website-preview.png"),
  });
});

test("skip-link focus and mobile navigation remain usable after removing the banner", async ({
  page,
}) => {
  await page.goto("/about/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Back to home", exact: true }),
  ).toBeFocused();
  await page.setViewportSize({ width: 375, height: 812 });
  const trigger = page
    .getByRole("banner")
    .getByRole("button", { name: "Menu", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("note", { name: "Website preview" })).toHaveCount(
    0,
  );
});

test("the banner stays removed with JavaScript disabled and native navigation works", async ({
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
      page.getByRole("note", { name: "Website preview" }),
    ).toHaveCount(0);
    await expect(
      page.locator('[aria-labelledby="home-hero-title"]'),
    ).toBeVisible();
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Our story", exact: true })
      .click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(
      page.getByRole("note", { name: "Website preview" }),
    ).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  } finally {
    await context.close();
  }
});
