import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { maintenancePages } from "../../src/content/maintenance";
import { navigation } from "../../src/content/navigation";

test("all planned pages keep their own URL, recovery links and non-indexed metadata", async ({
  page,
  request,
}, info) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const entry of maintenancePages) {
    expect((await page.goto(`${entry.path}/`))?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(`${entry.path}/$`));
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText(
      entry.title,
    );
    await expect(
      main.getByText("Under maintenance", { exact: true }),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: "Back to home" }),
    ).toHaveAttribute("href", "/");
    await expect(
      main.getByRole("link", { name: "Contact the gym" }),
    ).toHaveAttribute("href", "/contact/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${entry.path}/$`),
    );
    expect(sitemap).not.toContain(`${entry.path}/`);
    if (entry.path === "/programs")
      await page.screenshot({ path: info.outputPath("maintenance-page.png") });
  }
  await page
    .getByRole("main")
    .getByRole("link", { name: "Contact the gym" })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
});

test("header hover opens aligned panels without filled triggers or links", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Fine-pointer interaction");
  await page.goto("/membership/");
  await page.waitForLoadState("networkidle");
  const nav = page.locator('[data-dropdown-navigation="header"]');
  const trigger = nav.getByRole("button", { name: "Training", exact: true });
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(trigger).toHaveCSS("text-decoration-line", "underline");
  const panel = nav.locator("details[open] [data-dropdown-panel]");
  const triggerBox = (await trigger.boundingBox())!;
  const panelBox = (await panel.boundingBox())!;
  expect(panelBox.x).toBeGreaterThanOrEqual(16);
  expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(1264);
  expect(panelBox.y).toBeGreaterThanOrEqual(
    triggerBox.y + triggerBox.height - 1,
  );
  const link = nav.getByRole("link", { name: "Membership", exact: true });
  await link.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(link).toHaveAttribute("aria-current", "page");
  await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(link).toHaveCSS("text-decoration-line", "underline");
  await page.mouse.down();
  await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await page.mouse.move(1, 1);
  await page.mouse.up();
  await trigger.click();
  await page.mouse.move(1, 1);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.press("ArrowDown");
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-width", "3px");
  await page.screenshot({
    path: info.outputPath("header-text-navigation.png"),
    animations: "disabled",
  });
  const audit = await new AxeBuilder({ page })
    .include('[data-dropdown-navigation="header"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("footer links stay visible and use underline feedback without background fills", async ({
  page,
}, info) => {
  await page.goto("/about/");
  await page.waitForLoadState("networkidle");
  const footer = page.getByRole("contentinfo");
  const nav = footer.getByRole("navigation", { name: "Footer navigation" });
  await expect(nav.getByRole("link")).toHaveCount(14);
  await expect(nav.getByRole("heading", { level: 2 })).toHaveCount(4);
  await expect(
    footer.locator("details,summary,button,[data-dropdown-panel]"),
  ).toHaveCount(0);
  for (const link of await footer.locator(".footer-text-link").all()) {
    await expect(link).toBeVisible();
    await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    if (info.project.name === "desktop") {
      await link.hover();
      await expect(link).toHaveCSS("text-decoration-line", "underline");
      await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await page.mouse.down();
      await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await page.mouse.move(1, 1);
      await page.mouse.up();
    }
    await page.keyboard.press("Tab");
    await link.focus();
    await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(link).toHaveCSS("text-decoration-line", "underline");
    await expect(link).toHaveCSS("outline-width", "3px");
  }
  const action = footer.getByRole("link", {
    name: "Start your journey",
    exact: true,
  });
  await page.getByRole("main").focus();
  await expect(action).toHaveCSS("background-color", "rgb(255, 204, 0)");
  await footer.screenshot({
    path: info.outputPath(`footer-visible-${info.project.name}.png`),
    animations: "disabled",
  });
  await nav.getByRole("link", { name: "Programs", exact: true }).click();
  await expect(page).toHaveURL(/\/programs\/$/);
  await expect(
    page.getByRole("main").getByText("Under maintenance", { exact: true }),
  ).toBeVisible();
});

test("native header disclosures and visible footer links work without JavaScript", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: {
      width: info.project.name === "desktop" ? 1280 : 375,
      height: 900,
    },
  });
  try {
    const page = await context.newPage();
    await page.goto("/about/");
    if (info.project.name === "desktop") {
      const nav = page.locator('[data-dropdown-navigation="header"]');
      for (const group of navigation) {
        await nav
          .getByRole("button", { name: group.label, exact: true })
          .click();
        for (const link of group.links)
          await expect(
            nav.getByRole("link", { name: link.label, exact: true }),
          ).toBeVisible();
        await nav
          .getByRole("button", { name: group.label, exact: true })
          .click();
      }
    }
    const footer = page.getByRole("navigation", { name: "Footer navigation" });
    await expect(footer.getByRole("link")).toHaveCount(14);
    await expect(footer.locator("details,summary,button")).toHaveCount(0);
    for (const link of await footer.getByRole("link").all())
      await expect(link).toBeVisible();
    await footer.getByRole("link", { name: "Programs", exact: true }).click();
    await expect(
      page.getByRole("main").getByText("Under maintenance", { exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("mobile header links retain transparent current, focus and pressed states", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/membership/");
  await page.waitForLoadState("networkidle");
  const menu = page
    .getByRole("banner")
    .getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  const link = dialog.getByRole("link", { name: "Membership", exact: true });
  await expect(link).toHaveAttribute("aria-current", "page");
  await link.focus();
  await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(link).toHaveCSS("text-decoration-line", "underline");
  await expect(link).toHaveCSS("outline-width", "3px");
  if (info.project.name === "desktop") {
    await link.hover();
    await page.mouse.down();
    await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await page.mouse.move(1, 1);
    await page.mouse.up();
  }
  await page.screenshot({
    path: info.outputPath("mobile-text-navigation.png"),
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});
