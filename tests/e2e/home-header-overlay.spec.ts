import { expect, test, type Page } from "@playwright/test";

async function overlay(page: Page, expected: boolean) {
  const header = page.getByRole("banner");
  if (expected) {
    await expect(header).toHaveAttribute("data-overlay", "");
    await expect(header).toHaveCSS("position", "absolute");
    await expect
      .poll(async () => {
        const banner = (await header.boundingBox())!;
        const title = (await page.locator("#home-hero-title").boundingBox())!;
        return title.y - banner.y - banner.height;
      })
      .toBeGreaterThanOrEqual(40);
  } else {
    await expect(header).not.toHaveAttribute("data-overlay", "");
    await expect(header).toHaveCSS("position", "relative");
    expect(
      await page.evaluate(() =>
        document.documentElement.style.getPropertyValue("--home-header-height"),
      ),
    ).toBe("");
  }
}

test("Home-only header placement survives soft navigation and browser history", async ({
  page,
}) => {
  await page.goto("/");
  await overlay(page, true);
  await page.evaluate(() => {
    (window as Window & { headerSentinel?: string }).headerSentinel =
      "same-document";
  });
  await page
    .locator("[data-hero-actions]")
    .getByRole("link", { name: "Start your journey" })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await overlay(page, false);
  expect(
    await page.evaluate(
      () => (window as Window & { headerSentinel?: string }).headerSentinel,
    ),
  ).toBe("same-document");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Crossfit Gym home" })
    .click();
  await overlay(page, true);
  await page.goBack();
  await overlay(page, false);
  await page.goForward();
  await overlay(page, true);
});

test("overlay navigation remains above the hero and the mobile dialog retains focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await overlay(page, true);
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  const trigger = navigation.getByRole("button", {
    name: "Training",
    exact: true,
  });
  await trigger.click();
  const link = navigation.getByRole("link", { name: "Programs", exact: true });
  await expect(link).toBeVisible();
  expect(
    await link.evaluate((node) => {
      const box = node.getBoundingClientRect();
      return node.contains(
        document.elementFromPoint(
          box.x + box.width / 2,
          box.y + box.height / 2,
        ),
      );
    }),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 375, height: 812 });
  const menu = page
    .getByRole("banner")
    .getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close menu" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(dialog).toHaveCount(0);
});
