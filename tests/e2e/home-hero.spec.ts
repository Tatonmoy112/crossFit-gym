import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const widths = [320, 375, 768, 1280, 1920];
const heroName = "One step closer. Crossfit Gym";
const hero = (page: Page) =>
  page.getByRole("region", { name: heroName, exact: true });
const actions = (page: Page) => hero(page).getByRole("list").getByRole("link");

async function ready(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}

// Composite colours onto white/black backdrops with canvas, then compute WCAG
// contrast against the uniform scrim only (the decorative gradient only darkens).
async function worstCaseContrast(page: Page, selector: string) {
  return page.evaluate((selector) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    const paint = (...colors: string[]) => {
      context.clearRect(0, 0, 1, 1);
      for (const color of colors) {
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
      }
      return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)];
    };
    const luminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((value) => {
        const channel = value / 255;
        return channel <= 0.03928
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (a: number[], b: number[]) => {
      const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (light + 0.05) / (dark + 0.05);
    };
    const overlay = getComputedStyle(
      document.querySelector("[data-hero-overlay]")!,
    ).backgroundColor;
    const text = getComputedStyle(document.querySelector(selector)!).color;
    return Math.min(
      ratio(paint("#fff", text), paint("#fff", overlay)),
      ratio(paint("#000", text), paint("#000", overlay)),
    );
  }, selector);
}

test("H01-A08: start-aligned uppercase two-tone headline with safe contrast and no axe violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await ready(page);
  const region = hero(page);
  await expect(region).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const h1 = region.getByRole("heading", { level: 1, name: heroName });
  await expect(h1).toHaveCSS("font-family", /barlow/i);
  await expect(h1).toHaveCSS("font-weight", "700");
  await expect(h1).toHaveCSS("text-transform", "uppercase");
  await expect(h1).toHaveCSS("text-align", "start");
  await expect(region.locator("[data-hero-tagline]")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  await expect(region.locator("[data-hero-name]")).toHaveCSS(
    "color",
    "rgb(255, 204, 0)",
  );
  const container = region.locator(".layout-container");
  const [h1Box, containerBox] = [
    (await h1.boundingBox())!,
    (await container.boundingBox())!,
  ];
  const gutter = await container.evaluate((node) =>
    parseFloat(getComputedStyle(node).paddingInlineStart),
  );
  expect(h1Box.x).toBeCloseTo(containerBox.x + gutter, 0);
  expect(h1Box.x + h1Box.width / 2).toBeLessThan(640);

  expect(
    await worstCaseContrast(page, "[data-hero-tagline]"),
  ).toBeGreaterThanOrEqual(4.5);
  expect(
    await worstCaseContrast(page, "[data-hero-location]"),
  ).toBeGreaterThanOrEqual(4.5);
  expect(
    await worstCaseContrast(page, "[data-hero-name]"),
  ).toBeGreaterThanOrEqual(3);

  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("H01-A09: shadcn Button links follow the reference button style", async ({
  page,
}) => {
  await ready(page);
  const links = actions(page);
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveAccessibleName("Call 01323-275695");
  await expect(links.nth(0)).toHaveAttribute("href", "tel:+8801323275695");
  await expect(links.nth(1)).toHaveAccessibleName("Get directions");
  await expect(links.nth(1)).toHaveAttribute(
    "href",
    /^https:\/\/www\.google\.com\/maps\/search\//,
  );

  for (const index of [0, 1]) {
    const link = links.nth(index);
    await expect(link).toHaveCSS("text-transform", "uppercase");
    await expect(link).toHaveCSS("font-size", "14px");
    await expect(link).toHaveCSS("font-weight", "700");
    await expect(link).toHaveCSS("text-decoration-line", "none");
    expect(
      await link.evaluate((node) =>
        parseFloat(getComputedStyle(node).letterSpacing),
      ),
    ).toBeGreaterThan(0);
    expect(
      await link.evaluate((node) =>
        parseFloat(getComputedStyle(node).borderTopLeftRadius),
      ),
    ).toBeLessThanOrEqual(4);
    await expect(link.locator('svg[aria-hidden="true"]')).toHaveCount(1);
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(links.nth(0)).toHaveCSS("background-color", "rgb(255, 204, 0)");
  await expect(links.nth(0)).toHaveCSS("color", "rgb(23, 23, 23)");
  await expect(links.nth(1)).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(links.nth(1)).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(links.nth(1)).toHaveCSS("border-top-style", "solid");
  await expect(links.nth(1)).toHaveCSS(
    "border-top-color",
    "rgb(255, 255, 255)",
  );
});

test("H01-A10: slotted Button links receive variant hover states", async ({
  page,
}) => {
  await ready(page);
  test.skip(
    !(await page.evaluate(() => matchMedia("(hover: hover)").matches)),
    "Hover styling applies to hover-capable pointers only.",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  const links = actions(page);
  await links.nth(0).hover();
  await expect(links.nth(0)).toHaveCSS("background-color", "rgb(230, 184, 0)");
  await links.nth(1).hover();
  await expect(links.nth(1)).not.toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
});

test("H01-A11/A12: decorative vertical name, V-cut edge and hero height", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await ready(page);
  const vertical = page.locator("[data-hero-vertical]");
  await expect(vertical).toBeVisible();
  await expect(vertical).toHaveAttribute("aria-hidden", "true");
  await expect(vertical).toHaveCSS("writing-mode", "vertical-rl");
  await expect(vertical).toHaveCSS("color", "rgb(255, 204, 0)");
  for (const width of [1280, 1440, 1550, 1614, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    const [verticalBox, titleBox] = [
      (await vertical.boundingBox())!,
      (await page.locator("#home-hero-title").boundingBox())!,
    ];
    expect(verticalBox.x).toBeGreaterThanOrEqual(0);
    expect(
      titleBox.x - (verticalBox.x + verticalBox.width),
    ).toBeGreaterThanOrEqual(8);
  }
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(vertical).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(hero(page)).toHaveCSS("clip-path", /^polygon\(/);
  expect((await hero(page).boundingBox())!.height).toBeGreaterThanOrEqual(
    Math.min(0.88 * 900, 56 * 16) - 1,
  );

  for (const [width, height] of [
    [375, 812],
    [1280, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await ready(page);
    const box = (await page.locator("#home-hero-title").boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(height);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator("[data-hero-vertical]")).toBeHidden();
});

test("H01-A03: supplied image loads and covers the hero under hidden scrims", async ({
  page,
}) => {
  await ready(page);
  const image = hero(page).getByRole("img", {
    name: "Crossfit Gym training floor with treadmills, cross-trainers and strength racks",
  });
  await expect(image).toHaveCSS("object-fit", "cover");
  expect(
    await image.evaluate((node: HTMLImageElement) => ({
      complete: node.complete,
      width: node.naturalWidth,
      height: node.naturalHeight,
      src: new URL(node.currentSrc).pathname,
    })),
  ).toEqual({
    complete: true,
    width: 1672,
    height: 941,
    src: "/images/brand/home-hero.webp",
  });
  const [heroBox, imageBox] = [
    (await hero(page).boundingBox())!,
    (await image.boundingBox())!,
  ];
  expect(imageBox.width).toBeCloseTo(heroBox.width, 0);
  expect(imageBox.height).toBeCloseTo(heroBox.height, 0);
  for (const selector of ["[data-hero-overlay]", "[data-hero-gradient]"]) {
    await expect(page.locator(selector)).toHaveAttribute("aria-hidden", "true");
  }
});

test("H01-A13: long titles reflow at each width", async ({ page }) => {
  await ready(page);
  await page.locator("[data-hero-name]").evaluate((node) => {
    node.textContent += " " + "UnbrokenHeroTitle".repeat(10);
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() =>
        document.documentElement.scrollWidth <= innerWidth + 1
          ? []
          : [...document.body.querySelectorAll("*")]
              .filter(
                (node) => node.getBoundingClientRect().right > innerWidth + 1,
              )
              .map(
                (node) => `${innerWidth}: ${node.tagName}.${node.className}`,
              ),
      ),
    ).toEqual([]);
  }
});

test("H01-A13: keyboard reaches Call then Directions with the focus ring", async ({
  page,
}) => {
  await ready(page);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const links = actions(page);
  for (const index of [0, 1]) {
    await page.keyboard.press("Tab");
    await expect(links.nth(index)).toBeFocused();
    await expect(links.nth(index)).toHaveCSS("outline-style", "solid");
    await expect(links.nth(index)).toHaveCSS("outline-width", "3px");
  }
});

test("H01-A13: blocked image, reduced motion and forced colors keep the hero readable", async ({
  page,
}) => {
  await page.route(/home-hero\.webp/, (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await ready(page);
  const region = hero(page);
  await expect(region.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(actions(page)).toHaveCount(2);
  expect(
    await region.evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);

  await page.emulateMedia({ forcedColors: "none" });
  await expect(region).toHaveCSS("background-color", "rgb(32, 32, 32)");
});

test("H01-A13: hero and page inventory work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(hero(page).getByRole("heading", { level: 1 })).toBeVisible();
    await expect(actions(page)).toHaveCount(2);
    await page
      .getByRole("navigation", { name: "Page inventory" })
      .getByRole("link", { name: "/contact/" })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
  } finally {
    await context.close();
  }
});
