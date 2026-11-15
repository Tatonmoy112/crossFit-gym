import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { buildBrowserComponent } from "./helpers/browser-component.mjs";

let bundle: string;
test.beforeAll(async () => {
  bundle = await buildBrowserComponent(
    "tests/fixtures/desktop-navigation.browser.tsx",
  );
});

async function mount(page: Page, path = "/programs/") {
  await page.goto(path);
  await page.evaluate(() => {
    const root = document.createElement("div");
    root.id = "desktop-navigation-fixtures";
    document.body.append(root);
  });
  await page.addScriptTag({ content: bundle });
  await page.evaluate(() => document.fonts.ready);
}
function nav(page: Page, surface = "light") {
  return page
    .locator(`#desktop-navigation-fixtures [data-surface="${surface}"]`)
    .getByRole("navigation", { name: "Primary navigation" });
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  for (const node of await page
    .locator(
      "#desktop-navigation-fixtures button, #desktop-navigation-fixtures a",
    )
    .all()) {
    if (!(await node.isVisible())) continue;
    expect(
      await node.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
    ).toBe(true);
  }
}

test("L02-A01/A02/A03: actual client disclosures preserve current links keyboard navigation and dismissal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mount(page);
  const menu = nav(page),
    training = menu.getByRole("button", { name: "Training" });
  await expect(training).toHaveAccessibleDescription("Current section");
  await expect(menu.getByRole("link")).toHaveCount(0);
  await training.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  const programs = menu.getByRole("link", { name: "Programs", exact: true });
  await expect(programs).toBeFocused();
  await expect(programs).toHaveAttribute("aria-current", "page");
  await expect(menu.locator("[aria-current]")).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(
    menu.getByRole("link", { name: "Class schedule" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(programs).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(training).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(programs).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(training).toBeFocused();
  await expect(training).toHaveAttribute("aria-expanded", "false");
  await expect(programs).toBeHidden();
  await page.keyboard.press("Space");
  await expect(training).toHaveAttribute("aria-expanded", "true");
  await page
    .locator('#desktop-navigation-fixtures [data-surface="light"]')
    .getByRole("button", { name: "Outside navigation" })
    .click();
  await expect(training).toHaveAttribute("aria-expanded", "false");
  await expect(menu.getByRole("link")).toHaveCount(0);
  for (const [label, count] of [
    ["About", 5],
    ["Training", 4],
    ["Explore", 3],
    ["Visit us", 3],
  ] as const) {
    const trigger = menu.getByRole("button", { name: label });
    await trigger.click();
    await expect(menu.getByRole("link")).toHaveCount(count);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await trigger.press("Escape");
  }
  await menu.getByRole("button", { name: "Visit us" }).click();
  await menu.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await mount(page, "/programs/content-preview/");
  await nav(page).getByRole("button", { name: "Training" }).click();
  await expect(
    nav(page).getByRole("link", { name: "Programs", exact: true }),
  ).toHaveAttribute("aria-current", "location");
  await mount(page, "/locations/uttara/");
  await nav(page).getByRole("button", { name: "Visit us" }).click();
  await expect(
    nav(page).getByRole("link", { name: "Uttara, Dhaka" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    nav(page).getByRole("link", { name: "Locations", exact: true }),
  ).not.toHaveAttribute("aria-current");
});

test("L02-A04: desktop breakpoint readable surfaces panel geometry focus and reflow", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mount(page);
  for (const width of [320, 375, 768, 1023, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    if (width < 1024) {
      await expect(nav(page)).toBeHidden();
      await expect(
        page
          .locator("#desktop-navigation-fixtures")
          .getByRole("navigation", { name: "Primary navigation" }),
      ).toHaveCount(0);
      const outside = page
        .locator("#desktop-navigation-fixtures")
        .getByRole("button", { name: "Outside navigation" });
      await outside.nth(0).focus();
      await page.keyboard.press("Tab");
      await expect(outside.nth(1)).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(outside.nth(0)).toBeFocused();
    } else {
      await expect(nav(page)).toBeVisible();
      await nav(page).getByRole("button", { name: "Visit us" }).click();
      await expect(
        nav(page).getByRole("link", { name: "Contact", exact: true }),
      ).toBeVisible();
      await fits(page);
      await page.keyboard.press("Escape");
    }
    await fits(page);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const surface of ["light", "yellow", "charcoal"]) {
    const menu = nav(page, surface),
      trigger = menu.getByRole("button", { name: "Training" });
    await expect(trigger).toHaveCSS("font-family", /inter/i);
    await expect(trigger).toHaveCSS("font-size", "16px");
    await expect(trigger).toHaveCSS("font-weight", "600");
    await expect(trigger).toHaveCSS("text-decoration-line", "underline");
    await expect(trigger).toHaveCSS("border-radius", "8px");
    expect((await trigger.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect(menu.getByRole("button", { name: "About" })).toHaveCSS(
      "font-weight",
      "500",
    );
    await trigger.focus();
    await expect(trigger).toHaveCSS("outline-width", "3px");
    await expect(trigger).toHaveCSS("outline-offset", "3px");
    await trigger.press("Enter");
    await trigger.press("ArrowDown");
    const link = menu.getByRole("link", { name: "Programs", exact: true });
    await expect(link).toBeFocused();
    await expect(trigger).toHaveCSS(
      "background-color",
      surface === "charcoal" ? "rgb(23, 23, 23)" : "rgb(245, 245, 245)",
    );
    await expect(trigger).toHaveCSS(
      "color",
      surface === "charcoal" ? "rgb(245, 245, 245)" : "rgb(23, 23, 23)",
    );
    await expect(link).toHaveCSS("outline-width", "3px");
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const panel = link.locator("xpath=ancestor::div[@data-desktop-panel]");
    await expect(panel).toHaveCSS("border-radius", "16px");
    const box = (await panel.boundingBox())!,
      linkBox = (await link.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(1280);
    expect(linkBox.x - 6).toBeGreaterThanOrEqual(box.x);
    expect(linkBox.x + linkBox.width + 6).toBeLessThanOrEqual(
      box.x + box.width,
    );
    const audit = await new AxeBuilder({ page })
      .include("#desktop-navigation-fixtures")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.keyboard.press("Escape");
  }
  await nav(page).getByRole("button", { name: "Training" }).click();
  await page
    .locator('#desktop-navigation-fixtures [data-surface="light"]')
    .screenshot({ path: info.outputPath("desktop-navigation.png") });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.addStyleTag({
    content:
      "html {font-size:200% !important} #desktop-navigation-fixtures * {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important}",
  });
  await expect(nav(page)).toBeVisible();
  await expect(nav(page).getByRole("button", { name: "Training" })).toHaveCSS(
    "font-size",
    "32px",
  );
  await nav(page).getByRole("button", { name: "Visit us" }).click();
  await fits(page);
  await page.setViewportSize({ width: 1024, height: 1080 });
  await fits(page);
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(nav(page)).toBeHidden();
  await fits(page);
});

test("L02-A05: font fallback reduced motion and forced colors preserve keyboard operation", async ({
  page,
}) => {
  let blocked = 0;
  await page.route(/\.woff2(?:\?.*)?$/, (route) => {
    blocked++;
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await mount(page);
  const trigger = nav(page).getByRole("button", { name: "About" });
  await expect(trigger).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(blocked).toBeGreaterThan(0);
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument");
    const { nodeId } = await session.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector:
        '#desktop-navigation-fixtures [data-surface="light"] nav button',
    });
    const { fonts } = await session.send("CSS.getPlatformFontsForNode", {
      nodeId,
    });
    expect(
      fonts.some((font) => font.glyphCount > 0 && !font.isCustomFont),
    ).toBe(true);
  } finally {
    await session.detach();
  }
  await expect(trigger).toHaveCSS("transition-property", "none");
  await page.emulateMedia({ forcedColors: "active" });
  await trigger.focus();
  await expect(trigger).toHaveCSS("outline-width", "3px");
  await trigger.press("Enter");
  await trigger.press("ArrowDown");
  const link = nav(page).getByRole("link", { name: "Our story" });
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("forced-color-adjust", "auto");
  await fits(page);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
