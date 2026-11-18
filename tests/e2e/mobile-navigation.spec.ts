import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { buildBrowserComponent } from "./helpers/browser-component.mjs";

let bundle: string;
test.beforeAll(async () => {
  bundle = await buildBrowserComponent(
    "tests/fixtures/mobile-navigation.browser.tsx",
  );
});
async function mount(page: Page, surface = "light", path = "/membership/") {
  await page.goto(path);
  await page.evaluate((surface) => {
    const root = document.createElement("div");
    root.id = "mobile-navigation-fixture";
    root.dataset.surface = surface;
    document.body.append(root);
  }, surface);
  await page.addScriptTag({ content: bundle });
  await page.evaluate(() => document.fonts.ready);
}
const menu = (page: Page) =>
  page
    .locator("#mobile-navigation-fixture")
    .getByRole("button", { name: "Menu", exact: true });
const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Site navigation" });
async function open(page: Page) {
  await menu(page).click();
  await expect(dialog(page)).toBeVisible();
}
async function unlocked(page: Page) {
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
    .not.toBe("hidden");
  await expect(page.locator("#main")).not.toHaveAttribute(
    "aria-hidden",
    "true",
  );
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const box = (await dialog(page).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(
    (await page.viewportSize())!.width,
  );
  for (const node of await dialog(page).locator("button, a").all()) {
    expect(
      await node.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    ).toBe(true);
    expect((await node.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
}

test("L02-B01/B02/B03: modal keyboard, current state, dismissal, selection and route reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mount(page);
  await expect(
    page.locator("#mobile-navigation-fixture").getByRole("navigation"),
  ).toHaveCount(0);
  await menu(page).focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close menu" });
  await expect(close).toBeFocused();
  await expect(dialog(page).getByRole("heading")).toHaveCount(5);
  await expect(dialog(page).getByRole("link")).toHaveCount(14);
  await expect(
    dialog(page).getByRole("link", { name: "Membership", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(dialog(page).locator("[aria-current]")).toHaveCount(1);
  await expect(page.locator("#main")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog(page).getByRole("link", { name: "Locations", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog(page).getByRole("link", { name: "Our story" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu(page)).toBeFocused();
  await expect(dialog(page)).toHaveCount(0);
  await unlocked(page);
  await open(page);
  await close.click();
  await expect(menu(page)).toBeFocused();
  await open(page);
  await page.mouse.click(2, 2);
  await expect(dialog(page)).toHaveCount(0);
  await expect(menu(page)).toBeFocused();
  await unlocked(page);
  await open(page);
  // Test-only route context change; no application route or public fixture.
  await page
    .locator("#mobile-navigation-fixture button")
    .filter({ hasText: "Change fixture pathname" })
    .evaluate((node: HTMLButtonElement) => node.click());
  await expect(dialog(page)).toHaveCount(0);
  await unlocked(page);
  await open(page);
  await expect(
    dialog(page).getByRole("link", { name: "Contact" }),
  ).toHaveAttribute("aria-current", "page");
  await dialog(page)
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await mount(page, "light", "/products/whey-protein-powder/");
  await open(page);
  await expect(
    dialog(page).getByRole("link", { name: "Products", exact: true }),
  ).toHaveAttribute("aria-current", "location");
});

test("L02-B04: mobile breakpoint, scrollable short viewport and enlarged text", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mount(page);
  for (const width of [320, 375, 768, 1023]) {
    await page.setViewportSize({ width, height: 568 });
    await open(page);
    await fits(page);
    const contact = dialog(page).getByRole("link", {
      name: "Contact",
      exact: true,
    });
    await contact.focus();
    await expect(contact).toBeInViewport();
    await expect(
      page.getByRole("button", { name: "Close menu" }),
    ).toBeInViewport();
    await page.keyboard.press("Escape");
  }
  await open(page);
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(dialog(page)).toHaveCount(0);
  await expect(menu(page)).toHaveCount(0);
  await expect(page.locator("#main")).toBeFocused();
  await unlocked(page);
  for (const width of [1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(menu(page)).toHaveCount(0);
  }
  await page.setViewportSize({ width: 320, height: 480 });
  await expect(menu(page)).toHaveAttribute("aria-expanded", "false");
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} #mobile-navigation-fixture *, [data-mobile-panel] * {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  await open(page);
  await expect(dialog(page).getByRole("link").first()).toHaveCSS(
    "font-size",
    "32px",
  );
  await fits(page);
  await dialog(page)
    .getByRole("link", { name: "Contact", exact: true })
    .focus();
  await expect(
    dialog(page).getByRole("link", { name: "Contact", exact: true }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toBeInViewport();
  await page.screenshot({
    path: info.outputPath("mobile-navigation-enlarged.png"),
  });
});

test("L02-B05: semantic surfaces, visible focus, modal axe audit and geometry", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const surface of ["light", "yellow", "charcoal"]) {
    await mount(page, surface);
    await menu(page).focus();
    await expect(menu(page)).toHaveCSS("outline-width", "3px");
    await expect(menu(page)).toHaveCSS("outline-offset", "3px");
    await expect(menu(page)).toHaveCSS("font-family", /inter/i);
    expect((await menu(page).boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const closedAudit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(closedAudit.violations).toEqual([]);
    await open(page);
    await expect(dialog(page)).toHaveAttribute("data-surface", "light");
    await expect(dialog(page)).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(dialog(page)).toHaveCSS("color", "rgb(23, 23, 23)");
    await expect(dialog(page)).toHaveCSS("border-radius", "16px");
    const close = page.getByRole("button", { name: "Close menu" });
    await close.focus();
    await expect(close).toHaveCSS("outline-width", "3px");
    await fits(page);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`mobile-navigation-${surface}.png`),
    });
    await page.keyboard.press("Escape");
  }
});

test("L02-B05: reduced motion, blocked fonts and forced colors retain operation", async ({
  page,
}) => {
  let blocked = 0;
  await page.route(/\.woff2(?:\?.*)?$/, (route) => {
    blocked++;
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 320, height: 568 });
  await mount(page);
  expect(blocked).toBeGreaterThan(0);
  await expect(menu(page)).toHaveCSS("transition-property", "none");
  await open(page);
  const close = page.getByRole("button", { name: "Close menu" });
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS("outline-width", "3px");
  await expect(close).toHaveCSS("forced-color-adjust", "auto");
  await fits(page);
  await page.keyboard.press("Escape");
  await expect(menu(page)).toBeFocused();
  await unlocked(page);
});
