import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const widths = [320, 375, 768, 1280, 1920];
const heroName = "One step closer. Crossfit Gym";
const hero = (page: Page) =>
  page.getByRole("region", { name: heroName, exact: true });
const actions = (page: Page) =>
  hero(page).locator("[data-hero-actions]").getByRole("link");

async function ready(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("banner")).toHaveAttribute("data-overlay", "");
}

// Photograph-independent contrast check: render a white backdrop, hide foreground
// content without changing geometry, then sample the actual browser-painted scrims.
async function contrastOverWhite(page: Page) {
  const selectors = [
    "[data-hero-tagline]",
    "[data-hero-name]",
    "[data-hero-location]",
    "[data-stat-label]",
    "[data-home-stats-preview] [role=note]",
  ];
  const samples = await page.evaluate((selectors) => {
    const hero = document
      .querySelector("[data-home-hero]")!
      .getBoundingClientRect();
    return selectors.flatMap((selector) =>
      [...document.querySelectorAll(selector)].map((node) => {
        const box = node.getBoundingClientRect();
        return {
          x: box.x - hero.x,
          y: box.y - hero.y,
          width: box.width,
          height: box.height,
          color: getComputedStyle(node).color,
        };
      }),
    );
  }, selectors);
  const image = hero(page).getByRole("img");
  await image.evaluate((node) => {
    node.style.opacity = "0";
  });
  await page.locator("[data-home-hero]").evaluate((node) => {
    (node as HTMLElement).style.backgroundColor = "white";
  });
  await page.locator(".home-hero-content").evaluate((node) => {
    (node as HTMLElement).style.visibility = "hidden";
  });
  const png = (await hero(page).screenshot()).toString("base64");
  const ratios = await page.evaluate(
    async ({ png, samples }) => {
      const image = new Image();
      image.src = "data:image/png;base64," + png;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(image, 0, 0);
      function luminance(rgb: number[]) {
        const [r, g, b] = rgb.map((v) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
      return samples.map((sample) => {
        const text = luminance(
          sample.color
            .match(/[0-9.]+/g)!
            .slice(0, 3)
            .map(Number),
        );
        let minimum = Infinity;
        for (let x = Math.ceil(sample.x); x < sample.x + sample.width; x += 8) {
          for (
            let y = Math.ceil(sample.y);
            y < sample.y + sample.height;
            y += 8
          ) {
            const bg = luminance(
              [...ctx.getImageData(x, y, 1, 1).data].slice(0, 3),
            );
            minimum = Math.min(
              minimum,
              (Math.max(text, bg) + 0.05) / (Math.min(text, bg) + 0.05),
            );
          }
        }
        return minimum;
      });
    },
    { png, samples },
  );
  await page.locator(".home-hero-content").evaluate((node) => {
    (node as HTMLElement).style.removeProperty("visibility");
  });
  await image.evaluate((node) => {
    node.style.removeProperty("opacity");
  });
  await page.locator("[data-home-hero]").evaluate((node) => {
    (node as HTMLElement).style.removeProperty("background-color");
  });
  return ratios;
}

test("H01-A3: approved two-tone headline and rendered gradients maintain contrast", async ({
  page,
}) => {
  for (const width of [375, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await ready(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const title = hero(page).getByRole("heading", { level: 1, name: heroName });
    await expect(title).toHaveCSS("font-family", /barlow/i);
    await expect(title).toHaveCSS("text-transform", "uppercase");
    await expect(page.locator("[data-hero-tagline]")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator("[data-hero-name]")).toHaveCSS(
      "color",
      "rgb(255, 204, 0)",
    );
    for (const ratio of await contrastOverWhite(page))
      expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("H01-A3: rounded yellow and outlined actions have real Contact and Membership destinations", async ({
  page,
}) => {
  await ready(page);
  const links = actions(page);
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveAccessibleName("Start your journey");
  await expect(links.nth(0)).toHaveAttribute("href", "/contact/");
  await expect(links.nth(1)).toHaveAccessibleName("View memberships");
  await expect(links.nth(1)).toHaveAttribute("href", "/membership/");
  for (const link of await links.all()) {
    await expect(link).toHaveCSS("font-family", /inter/i);
    await expect(link).toHaveCSS("text-decoration-line", "none");
    expect(
      await link.evaluate((node) =>
        parseFloat(getComputedStyle(node).borderTopLeftRadius),
      ),
    ).toBeGreaterThanOrEqual(12);
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(links.first()).toHaveCSS("background-color", "rgb(255, 204, 0)");
  await expect(links.first()).toHaveCSS("color", "rgb(23, 23, 23)");
  await expect(links.first().locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await expect(links.last()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(links.last().locator("svg")).toHaveCount(0);
  await links.first().click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.goBack();
  await actions(page).last().click();
  await expect(page).toHaveURL(/\/membership\/$/);
});

test("H01-A3: reference composition clears the header and responds at five widths", async ({
  page,
}, info) => {
  await ready(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await expect(hero(page)).toHaveCSS("clip-path", "none");
    await expect(page.locator("[data-hero-vertical]")).toHaveCount(0);
    await expect
      .poll(async () => {
        const title = (await page.locator("#home-hero-title").boundingBox())!;
        const header = (await page.getByRole("banner").boundingBox())!;
        return title.y - header.y - header.height;
      })
      .toBeGreaterThanOrEqual(40);
    const frame = (await hero(page).boundingBox())!;
    expect(frame.height).toBeGreaterThanOrEqual(Math.min(900, 56 * 16) - 1);
    expect(frame.y).toBeCloseTo(0, 0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const columns = await page
      .locator(".home-stats-grid")
      .evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(width < 360 ? 1 : width < 768 ? 2 : 4);
    const [first, second] = await actions(page).all();
    const a = (await first.boundingBox())!,
      b = (await second.boundingBox())!;
    if (width < 640) expect(b.y).toBeGreaterThanOrEqual(a.y + a.height);
    else expect(b.y).toBeCloseTo(a.y, 0);
    await hero(page).screenshot({
      path: info.outputPath(`hero-${width}.png`),
    });
  }
});

test("H01-A3: supplied photograph covers the hero, with hidden decorative gradients", async ({
  page,
}) => {
  await ready(page);
  const image = hero(page).getByRole("img");
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
  const outer = (await hero(page).boundingBox())!,
    photo = (await image.boundingBox())!;
  expect(photo.width).toBeCloseTo(outer.width, 0);
  expect(photo.height).toBeCloseTo(outer.height, 0);
  for (const selector of [
    "[data-hero-overlay]",
    "[data-hero-gradient]",
    "[data-hero-bottom-gradient]",
  ])
    await expect(page.locator(selector)).toHaveAttribute("aria-hidden", "true");
});

test("H01-A3: hover states and keyboard focus remain visible", async ({
  page,
}) => {
  await ready(page);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  for (const link of await actions(page).all()) {
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-width", "3px");
  }
  if (await page.evaluate(() => matchMedia("(hover: hover)").matches)) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await actions(page).first().hover();
    await expect(actions(page).first()).toHaveCSS(
      "background-color",
      "rgb(230, 184, 0)",
    );
    await actions(page).last().hover();
    await expect(actions(page).last()).not.toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
  }
});

test("H01-A3: blocked assets and enlarged text retain content and header clearance", async ({
  page,
}, info) => {
  await page.route(/home-hero\.webp|\.woff2(?:\?|$)/, (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} [data-home-hero] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await expect
      .poll(async () => {
        const header = (await page.getByRole("banner").boundingBox())!,
          title = (await page.locator("#home-hero-title").boundingBox())!;
        return title.y - header.y - header.height;
      })
      .toBeGreaterThanOrEqual(40);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await expect(hero(page).getByRole("note")).toBeVisible();
    await hero(page).screenshot({
      path: info.outputPath(`hero-enlarged-${width}.png`),
    });
  }
  await page.emulateMedia({ forcedColors: "active" });
  await expect(hero(page).getByRole("heading", { level: 1 })).toBeVisible();
});

test("H01-A3: long headline expands without horizontal overflow", async ({
  page,
}) => {
  await ready(page);
  await page.locator("[data-hero-name]").evaluate((node) => {
    node.textContent += "UnbrokenHeroTitle".repeat(10);
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
});

test("H01-A3: no-JavaScript fallback keeps header in flow and all hero content usable", async ({
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
    await expect(page.getByRole("banner")).not.toHaveAttribute(
      "data-overlay",
      "",
    );
    const header = (await page.getByRole("banner").boundingBox())!,
      section = (await hero(page).boundingBox())!;
    expect(section.y).toBeCloseTo(header.y + header.height, 0);
    await expect(hero(page).getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.locator("[data-home-stats-preview] [data-count-visual]"),
    ).toHaveText(["1,200", "4.8", "5", "30"]);
    await expect(hero(page).getByRole("note")).toBeVisible();
    await actions(page).last().click();
    await expect(page).toHaveURL(/\/membership\/$/);
  } finally {
    await context.close();
  }
});
