import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { homeAbout, aboutPage } from "../../src/content/about";

const homeSection = (page: Page) => page.locator("[data-home-about]");
const about = (page: Page) => page.locator("[data-about-page]");
async function ready(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}
async function resize(page: Page, width: number) {
  await page.setViewportSize({ width, height: 1000 });
  // Let viewport media/container queries and the compositor commit before measuring.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

test("Home About sits immediately below the hero, reflows and opens the complete About page", async ({
  page,
}, info) => {
  await ready(page, "/");
  expect(
    await homeSection(page).evaluate(
      (node) =>
        node.previousElementSibling?.hasAttribute("data-home-hero") &&
        node.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-why-choose-us-title",
    ),
  ).toBe(true);
  await expect(page.locator("#home-story-title")).toHaveCount(0);
  for (const width of [320, 375, 768, 1280, 1920]) {
    await resize(page, width);
    await homeSection(page).scrollIntoViewIfNeeded();
    await fits(page);
    const boxes = await homeSection(page).evaluate((node) => ({
      image: node.querySelector("img")!.getBoundingClientRect().toJSON(),
      text: node
        .querySelector(".home-about-content")!
        .getBoundingClientRect()
        .toJSON(),
    }));
    if (width >= 1280)
      expect(boxes.text.left).toBeGreaterThan(boxes.image.right);
    else expect(boxes.text.top).toBeGreaterThanOrEqual(boxes.image.bottom);
    if ([375, 1280].includes(width))
      await homeSection(page).screenshot({
        path: info.outputPath(`home-about-${width}.png`),
      });
  }
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-about]")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  const link = homeSection(page).getByRole("link", {
    name: homeAbout.action.label,
  });
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: aboutPage.hero.heading }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(homeSection(page)).toBeVisible();
});

test("About page preserves all sections, responsive layouts, metadata and accessible structure", async ({
  page,
}, info) => {
  await ready(page, "/about/");
  await expect(about(page).locator("[data-about-section]")).toHaveCount(9);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    about(page).locator("[data-about-section=values] li"),
  ).toHaveCount(4);
  await expect(
    about(page).locator("[data-about-section=experience] li"),
  ).toHaveCount(4);
  await expect(page).toHaveTitle(
    "About Us | Our Story & Fitness Philosophy | Crossfit Gym",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/about\/$/,
  );
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(
    page.getByRole("navigation", { name: /breadcrumb/i }),
  ).toHaveCount(0);
  for (const width of [320, 375, 768, 1280, 1920]) {
    await resize(page, width);
    await fits(page);
    if ([375, 1280].includes(width))
      await page.screenshot({
        path: info.outputPath(`about-page-${width}.png`),
        fullPage: true,
      });
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("membership and Contact actions navigate and restore About with browser history", async ({
  page,
}) => {
  await ready(page, "/about/");
  const token = "about-navigation-check";
  await page.evaluate(
    (value) => (document.documentElement.dataset.aboutDocument = value),
    token,
  );
  for (const label of [
    "Explore Membership Plans",
    "Become a Member",
    "Contact Us",
  ]) {
    const destination =
      label === "Contact Us" ? /\/contact\/$/ : /\/membership\/$/;
    const link = about(page).getByRole("link", { name: label, exact: true });
    await link.focus();
    await expect(link).toHaveCSS("outline-width", "3px");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(destination);
    await expect(page.locator("html")).toHaveAttribute(
      "data-about-document",
      token,
    );
    await page.goBack();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator("#about-hero-title")).toHaveText(
      aboutPage.hero.heading,
    );
  }
});

test("About content and links work without JavaScript", async ({
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
    await homeSection(page)
      .getByRole("link", { name: homeAbout.action.label })
      .click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(about(page).locator("[data-about-section]")).toHaveCount(9);
    await about(page)
      .getByRole("link", { name: "Explore Membership Plans" })
      .click();
    await expect(page).toHaveURL(/\/membership\/$/);
    await page.goBack();
    await about(page).getByRole("link", { name: "Contact Us" }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await page.goBack();
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Crossfit Gym home" })
      .click();
    await expect(page).toHaveURL(/\/$/);
  } finally {
    await context.close();
  }
});

test("enlarged text, failed images/fonts and reduced motion retain readable About content", async ({
  page,
}, info) => {
  await page.route("**/*.{webp,png,woff2}", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/about/"]) {
    await ready(page, path);
    await page.addStyleTag({
      content:
        "html{font-size:200%!important} [data-home-about] p,[data-about-page] p{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
    });
    for (const width of [320, 768, 1280]) {
      await resize(page, width);
      await fits(page);
    }
    const target = path === "/" ? homeSection(page) : about(page);
    await expect(target.locator("h1,h2").first()).toBeVisible();
    expect(
      await target.evaluate(
        (node) => node.getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
    await target.screenshot({
      path: info.outputPath(
        path === "/"
          ? "home-about-enlarged-failed-assets.png"
          : "about-enlarged-failed-assets.png",
      ),
    });
  }
});
