import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const banner = (page: Page) => page.getByRole("banner");
const desktop = (page: Page) =>
  banner(page).getByRole("navigation", { name: "Primary navigation" });
const mobile = (page: Page) =>
  banner(page).getByRole("button", { name: "Menu", exact: true });
const panel = (page: Page) =>
  page.getByRole("dialog", { name: "Site navigation" });
async function ready(page: Page, path = "/programs/") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const bounds = (await banner(page).boundingBox())!;
  for (const node of await banner(page).locator("a, button").all()) {
    if (!(await node.isVisible())) continue;
    const box = (await node.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x - 6).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width + 6).toBeLessThanOrEqual(
      (await page.viewportSize())!.width,
    );
    expect(
      await node.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    ).toBe(true);
  }
  expect(bounds.width).toBe((await page.viewportSize())!.width);
}
async function closedModal(page: Page) {
  await expect(panel(page)).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
    .not.toBe("hidden");
  await expect(page.getByRole("main")).toHaveCount(1);
}
async function currentLink(page: Page, label: string, group = "Training") {
  if ((await page.viewportSize())!.width < 1024) {
    await mobile(page).click();
    return panel(page).getByRole("link", { name: label, exact: true });
  }
  await desktop(page).getByRole("button", { name: group }).click();
  return desktop(page).getByRole("link", { name: label, exact: true });
}

test("L01-B01/B02/B03: actual header, first skip, responsive exposure and breakpoint focus cleanup", async ({
  page,
}, info) => {
  await ready(page);
  await expect(banner(page)).toHaveCount(1);
  await expect(
    banner(page).getByRole("link", { name: "Crossfit Gym home" }),
  ).toBeVisible();
  await expect(banner(page).getByRole("heading")).toHaveCount(0);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  expect(
    await skip.evaluate((node) => {
      const r = node.getBoundingClientRect();
      return node.contains(
        document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2),
      );
    }),
  ).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  for (const width of [320, 375, 768, 1023, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
    if (width < 1024) {
      await expect(mobile(page)).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: "Primary navigation" }),
      ).toHaveCount(0);
      await banner(page).getByRole("link").focus();
      await page.keyboard.press("Tab");
      await expect(mobile(page)).toBeFocused();
    } else {
      await expect(mobile(page)).toHaveCount(0);
      await expect(
        page.getByRole("navigation", { name: "Primary navigation" }),
      ).toHaveCount(1);
      await desktop(page).getByRole("button", { name: "Training" }).click();
      await fits(page);
      await page.keyboard.press("Escape");
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await desktop(page)
    .getByRole("button", { name: "About", exact: true })
    .click();
  await desktop(page).getByRole("link", { name: "Our story" }).focus();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByRole("main")).toBeFocused();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(
    desktop(page).getByRole("button", { name: "About", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.setViewportSize({ width: 375, height: 812 });
  await mobile(page).click();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.setViewportSize({ width: 1280, height: 900 });
  await closedModal(page);
  await expect(page.getByRole("main")).toBeFocused();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(mobile(page)).toHaveAttribute("aria-expanded", "false");
  await mobile(page).focus();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("main")).toBeFocused();
  await desktop(page).getByRole("button", { name: "Training" }).focus();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByRole("main")).toBeFocused();
  await banner(page).screenshot({ path: info.outputPath("header-mobile.png") });
  await page.setViewportSize({ width: 1280, height: 900 });
  await banner(page).screenshot({
    path: info.outputPath("header-desktop.png"),
  });
  const recovery = page.getByRole("link", {
    name: "Back to home",
    exact: true,
  });
  await recovery.focus();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(recovery).toBeFocused();
});

test("L01-B01/B05: static brand and page recovery remain usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/about/");
    await expect(banner(page)).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Back to home", exact: true }),
    ).toBeVisible();
    await banner(page).getByRole("link", { name: "Crossfit Gym home" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Home", exact: true }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  } finally {
    await context.close();
  }
});

test("L01-B04: hydrated App Router links, same-page dismissal, history and current cues", async ({
  page,
}) => {
  await ready(page, "/about/");
  const token = await page.evaluate(() => {
    const token = Math.random().toString(36);
    document.documentElement.dataset.headerDocument = token;
    return token;
  });
  await (await currentLink(page, "Programs")).click();
  await expect(page).toHaveURL(/\/programs\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Programs", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute(
    "data-header-document",
    token,
  );
  await closedModal(page);
  let link = await currentLink(page, "Programs");
  await expect(link).toHaveAttribute("aria-current", "page");
  await link.click();
  await closedModal(page);
  await expect(desktop(page).getByRole("link")).toHaveCount(0);
  await (await currentLink(page, "Contact", "Visit us")).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-header-document",
    token,
  );
  // Open a menu before traversing history to detect stale open state.
  await currentLink(page, "Programs");
  await page.goBack();
  await expect(page).toHaveURL(/\/programs\/$/);
  await closedModal(page);
  await expect(desktop(page).getByRole("link")).toHaveCount(0);
  await page.goForward();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-header-document",
    token,
  );
  await banner(page).getByRole("link", { name: "Crossfit Gym home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-header-document",
    token,
  );
  await expect(
    page.getByRole("navigation", { name: "Page inventory" }),
  ).toBeVisible();
  await ready(page, "/programs/content-preview/");
  link = await currentLink(page, "Programs");
  await expect(link).toHaveAttribute("aria-current", "location");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await ready(page, "/locations/uttara/");
  link = await currentLink(page, "Uttara, Dhaka", "Visit us");
  await expect(link).toHaveAttribute("aria-current", "page");
  await ready(page, "/not-a-page/");
  await expect(banner(page)).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "404", exact: true }),
  ).toBeVisible();
  await currentLink(page, "Programs");
  await expect(page.locator("[aria-current]")).toHaveCount(0);
});

test("L01-B02/B05: charcoal shell, enlargement, accessibility and preference/failure fallback", async ({
  page,
}, info) => {
  await ready(page);
  await expect(banner(page)).toHaveAttribute("data-surface", "charcoal");
  await expect(banner(page)).toHaveCSS("background-color", "rgb(32, 32, 32)");
  const audit = async () =>
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  await audit();
  await currentLink(page, "Programs");
  await audit();
  await page.keyboard.press("Escape");
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} header *, [data-mobile-panel] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
  }
  await banner(page).screenshot({
    path: info.outputPath("header-enlarged.png"),
  });
  let blocked = 0;
  await page.route(
    /(?:\.woff2(?:\?.*)?$|\/images\/brand\/brand-mark\.webp$)/,
    (route) => {
      blocked++;
      return route.abort();
    },
  );
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await ready(page);
  expect(blocked).toBeGreaterThan(0);
  const brand = banner(page).getByRole("link", { name: "Crossfit Gym home" });
  await expect(brand).toBeVisible();
  await brand.focus();
  await expect(brand).toHaveCSS("outline-width", "3px");
  await expect(brand).toHaveCSS("transition-property", "none");
  await fits(page);
  await currentLink(page, "Programs");
  await page.keyboard.press("Escape");
});
