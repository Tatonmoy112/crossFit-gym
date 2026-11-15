import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { site } from "../../src/content/site";

const footer = (page: Page) => page.getByRole("contentinfo");
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
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
  }
  await expect(footer(page)).toHaveCSS("background-color", "rgb(32, 32, 32)");
  await footer(page).getByRole("link", { name: "Crossfit Gym home" }).focus();
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
  await page.keyboard.press("Escape");
  await expect(footer(page)).toHaveCount(1);
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} footer *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
  }
  await footer(page).screenshot({
    path: info.outputPath("footer-enlarged.png"),
  });
});

test("L03-A04/A05: blocked fonts/mark and user preferences preserve footer links", async ({
  page,
}) => {
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
});

test("L03-A01/A02/A03: footer content and navigation work without JavaScript", async ({
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
    await page.goto("/about/");
    await expect(footer(page)).toHaveCount(1);
    await expect(footer(page).getByRole("link")).toHaveCount(22);
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
      page.getByRole("heading", { level: 1, name: "Home", exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
