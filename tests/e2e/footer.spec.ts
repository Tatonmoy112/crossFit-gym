import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { site } from "../../src/content/site";

const footer = (page: Page) => page.getByRole("contentinfo");
const widths = [320, 375, 768, 1024, 1280, 1920];
async function ready(page: Page, path = "/about/") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect((await footer(page).boundingBox())!.width).toBe(
    (await page.viewportSize())!.width,
  );
  for (const link of await footer(page).getByRole("link").all()) {
    const box = (await link.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.x - 6).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width + 6).toBeLessThanOrEqual(
      (await page.viewportSize())!.width,
    );
    expect(
      await link.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
      (await link.textContent()) ?? "Footer link",
    ).toBe(true);
  }
  expect(
    await footer(page)
      .locator("h2,address,p:not(.footer-wordmark),a")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => node.scrollWidth > node.clientWidth + 1)
          .map((node) => ({
            text: node.textContent,
            width: node.clientWidth,
            scrollWidth: node.scrollWidth,
          })),
      ),
  ).toEqual([]);
}

test("L03-A01/A02/A03/A05: actual footer, native contacts and soft internal/legal navigation", async ({
  page,
}) => {
  await ready(page);
  await expect(footer(page)).toHaveCount(1);
  expect(
    await footer(page).evaluate(
      (node) =>
        !!(
          document.querySelector("main")!.compareDocumentPosition(node) &
          Node.DOCUMENT_POSITION_FOLLOWING
        ) && !node.closest("main"),
    ),
  ).toBe(true);
  await expect(
    footer(page)
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link"),
  ).toHaveCount(15);
  await expect(footer(page).locator("address")).toHaveText(site.address);
  const phone = footer(page).getByRole("link", {
    name: site.phone,
    exact: true,
  });
  await expect(phone).toHaveAttribute("href", `tel:${site.telephone}`);
  for (const [label, href] of [
    ["Facebook", site.facebook],
    ["Instagram", site.instagram],
    ["Get directions", site.directions],
  ]) {
    const link = footer(page).getByRole("link", { name: label, exact: true });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).not.toHaveAttribute("target");
  }
  // Prevent external contact; verify native activation against a local response.
  let socialRequest = "";
  await page.route("https://www.facebook.com/**", (route) => {
    if (route.request().isNavigationRequest())
      socialRequest = route.request().url();
    return route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Intercepted test destination</title><p>Test response</p>",
    });
  });
  await footer(page)
    .getByRole("link", { name: "Facebook", exact: true })
    .click();
  await expect.poll(() => socialRequest).toBe(site.facebook);
  await expect(page).toHaveURL(site.facebook);
  await ready(page);
  const sentinel = await page.evaluate(() => {
    const value = Math.random().toString(36);
    document.documentElement.dataset.footerDocument = value;
    return value;
  });
  for (const [label, path] of [
    ["Programs", "/programs/"],
    ["Privacy", "/privacy/"],
    ["Terms", "/terms/"],
  ]) {
    await footer(page).getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator("html")).toHaveAttribute(
      "data-footer-document",
      sentinel,
    );
    await expect(
      footer(page).getByText("Legal text is awaiting approval."),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
  await ready(page, "/not-a-page/");
  await expect(footer(page)).toHaveCount(1);
  await footer(page).getByRole("link", { name: "Crossfit Gym home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("L03-A04: responsive geometry, focus order, header isolation and accessibility", async ({
  page,
}, info) => {
  await ready(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
    const geometry = await footer(page).evaluate((node) => {
      const panel = node.querySelector(".footer-panel")!;
      const style = getComputedStyle(panel);
      const usable =
        panel.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      return {
        usable,
        navColumns: getComputedStyle(
          node.querySelector(".footer-navigation")!,
        ).gridTemplateColumns.split(" ").length,
        mainColumns: getComputedStyle(
          node.querySelector(".footer-panel-main")!,
        ).gridTemplateColumns.split(" ").length,
      };
    });
    expect(geometry.navColumns).toBe(
      geometry.usable >= 1024 ? 4 : geometry.usable >= 288 ? 2 : 1,
    );
    expect(geometry.mainColumns).toBe(geometry.usable >= 1024 ? 2 : 1);
    await footer(page).screenshot({
      path: info.outputPath(`footer-${width}.png`),
    });
  }
  await expect(footer(page)).toHaveCSS(
    "background-color",
    "rgb(245, 245, 245)",
  );
  const action = footer(page).getByRole("link", {
    name: "Start your journey",
    exact: true,
  });
  await action.focus();
  await expect(action).toHaveCSS("outline-width", "3px");
  await expect(action).toHaveCSS("background-color", "rgb(255, 204, 0)");
  await page.keyboard.press("Tab");
  await expect(
    footer(page).getByRole("link", { name: "Crossfit Gym home" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  const phone = footer(page).getByRole("link", {
    name: site.phone,
    exact: true,
  });
  await expect(phone).toBeFocused();
  await expect(phone).toHaveCSS("outline-width", "3px");
  await expect(phone).toHaveCSS("outline-offset", "3px");
  await expect(phone).toBeInViewport();
  await page.keyboard.press("Tab");
  await expect(
    footer(page).getByRole("link", { name: "Get directions" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    footer(page).getByRole("link", { name: "Our story" }),
  ).toBeFocused();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.setViewportSize({ width: 1280, height: 900 });
  await footer(page).screenshot({
    path: info.outputPath("footer-desktop.png"),
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await footer(page).screenshot({ path: info.outputPath("footer-mobile.png") });
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Menu", exact: true })
    .click();
  await expect(footer(page)).toHaveCount(0);
  await expect(page.locator("footer")).toHaveAttribute("aria-hidden", "true");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(footer(page)).toHaveCount(1);
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} footer *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
    await footer(page).screenshot({
      path: info.outputPath(`footer-enlarged-${width}.png`),
    });
  }
  await footer(page).screenshot({
    path: info.outputPath("footer-enlarged.png"),
  });
});

test("L03-B: the shared CTA and decorative wordmark appear on Home, interior, legal and 404 pages", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/missing-footer-route/",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(
      path.includes("missing-footer") ? 404 : 200,
    );
    await expect(footer(page)).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const cta = footer(page).getByRole("region", {
      name: "Your Stronger Future Starts Here.",
    });
    await expect(cta).toHaveAttribute("data-surface", "charcoal");
    await expect(cta).toContainText(
      "Visit Crossfit Gym in Sector 12, Uttara, Dhaka. Contact our team to get started.",
    );
    await expect(
      cta.getByRole("link", { name: "Start your journey", exact: true }),
    ).toHaveAttribute("href", "/contact/");
    const wordmark = footer(page).locator(".footer-wordmark-frame");
    await expect(wordmark).toHaveAttribute("aria-hidden", "true");
    await expect(wordmark).toHaveAttribute("inert", "");
    await expect(wordmark).toHaveCSS("pointer-events", "none");
    await expect(wordmark).toHaveCSS("overflow-x", "clip");
    await expect(wordmark).toHaveText("CROSSFIT GYM");
    await expect(footer(page).locator(".footer-panel")).toHaveCSS(
      "box-shadow",
      /16px 48px/,
    );
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
  await page.goto("/about/");
  await page.evaluate(
    () =>
      (document.documentElement.dataset.footerCtaSentinel = "same-document"),
  );
  const action = footer(page).getByRole("link", {
    name: "Start your journey",
    exact: true,
  });
  await action.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator("html")).toHaveAttribute(
    "data-footer-cta-sentinel",
    "same-document",
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/about\/$/);
  if (await page.evaluate(() => matchMedia("(hover: hover)").matches)) {
    await action.hover();
    await expect(action).toHaveCSS("background-color", "rgb(230, 184, 0)");
  }
});

test("L03-A04/A05: blocked fonts/mark and user preferences preserve footer links", async ({
  page,
}, info) => {
  let blocked = 0;
  await page.route(
    /(?:\.woff2(?:\?.*)?$|\/images\/brand\/brand-mark\.webp$)/,
    (route) => {
      blocked++;
      return route.abort();
    },
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  expect(blocked).toBeGreaterThan(0);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
    await footer(page).screenshot({
      path: info.outputPath(`footer-blocked-assets-${width}.png`),
    });
  }
  await page.emulateMedia({ forcedColors: "active" });
  const brand = footer(page).getByRole("link", { name: "Crossfit Gym home" });
  await expect(brand).toBeVisible();
  await brand.focus();
  await expect(brand).toHaveCSS("outline-width", "3px");
  await expect(brand).toHaveCSS("transition-property", "none");
  await page.keyboard.press("Tab");
  await expect(
    footer(page).getByRole("link", { name: site.phone, exact: true }),
  ).toBeFocused();
  await fits(page);
  await footer(page).screenshot({
    path: info.outputPath("footer-forced-colors.png"),
  });
});

test("L03-A01/A02/A03: footer content and navigation work without JavaScript", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/about/");
    await expect(footer(page)).toHaveCount(1);
    await expect(footer(page).getByRole("link")).toHaveCount(23);
    await expect(
      footer(page).getByRole("heading", {
        name: "Your Stronger Future Starts Here.",
      }),
    ).toBeVisible();
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await fits(page);
      await footer(page).screenshot({
        path: info.outputPath(`footer-no-javascript-${width}.png`),
      });
    }
    await footer(page)
      .getByRole("link", { name: "Start your journey", exact: true })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(
      footer(page).getByText(
        "Opening hours have not been supplied. Call to confirm.",
      ),
    ).toBeVisible();
    await footer(page)
      .getByRole("link", { name: "Terms", exact: true })
      .click();
    await expect(page).toHaveURL(/\/terms\/$/);
    await expect(
      footer(page).getByText("Legal text is awaiting approval."),
    ).toBeVisible();
    await footer(page).getByRole("link", { name: "Crossfit Gym home" }).click();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "One step closer. Crossfit Gym",
        exact: true,
      }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
