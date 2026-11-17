import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { buildBrowserComponent } from "./helpers/browser-component.mjs";
import { loadServerComponent } from "./helpers/server-component";
import { fixture } from "../fixtures/home-stats.data";

const { HomeStats } = loadServerComponent<
  typeof import("@/features/home/home-stats")
>("src/features/home/home-stats.tsx");
const widths = [320, 375, 768, 1280, 1920];
const regionName = "Crossfit Gym in numbers";
let bundle: string;

test.beforeAll(async () => {
  bundle = await buildBrowserComponent("tests/fixtures/home-stats.browser.tsx");
});

// Fictitious fixture mounted directly after the real hero on Home.
async function mount(page: Page, { hydrate = true } = {}) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Replace the real preview only for isolated fixture cases: HomeStats owns
  // one section ID and must not be mounted twice on the same page.
  await page
    .locator("[data-home-stats-preview]")
    .evaluateAll((nodes) => nodes.forEach((node) => node.remove()));
  if (hydrate) {
    await page.evaluate(() => {
      const root = document.createElement("div");
      root.id = "home-stats-fixture";
      root.setAttribute("data-surface", "charcoal");
      root.style.padding = "16px";
      document
        .querySelector('[aria-labelledby="home-hero-title"]')!
        .after(root);
    });
    await page.addScriptTag({ content: bundle });
  } else {
    const markup = renderToStaticMarkup(
      <div
        id="home-stats-fixture"
        data-surface="charcoal"
        style={{ padding: 16 }}
      >
        <HomeStats content={fixture} />
      </div>,
    );
    await page.evaluate((markup) => {
      document
        .querySelector('[aria-labelledby="home-hero-title"]')!
        .insertAdjacentHTML("afterend", markup);
    }, markup);
  }
  await page.evaluate(() => document.fonts.ready);
  return page.getByRole("region", { name: regionName });
}

const values = (page: Page) =>
  page.locator("#home-stats-fixture [data-count-visual]");

test("H01-C06: real Home embeds labeled example figures in the hero", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: regionName })).toHaveCount(0);
  const preview = page.locator("[data-home-stats-preview]");
  await expect(
    preview.getByRole("region", { name: "Example counter figures" }),
  ).toBeVisible();
  await expect(preview.getByRole("note")).toHaveText(
    "Example figures for layout preview only. These are not verified gym statistics.",
  );
  expect(
    await page.evaluate(
      () =>
        document
          .querySelector('[aria-labelledby="home-hero-title"]')!
          .querySelector("[data-home-stats-preview]") !== null,
    ),
  ).toBe(true);
  expect(
    await preview.evaluate((node) =>
      node
        .closest("[data-home-hero]")
        ?.nextElementSibling?.getAttribute("aria-labelledby"),
    ),
  ).toBe("home-about-title");
  expect(
    await preview.evaluate((node) =>
      node
        .closest("[data-home-hero]")
        ?.nextElementSibling?.nextElementSibling?.getAttribute(
          "aria-labelledby",
        ),
    ),
  ).toBe("home-why-choose-us-title");
  await preview.scrollIntoViewIfNeeded();
  await expect(preview.locator("[data-count-visual]")).toHaveText(
    ["1,200", "4.8", "5", "30"],
    { timeout: 4000 },
  );
  await expect(preview.getByRole("listitem")).toHaveCount(4);
  await expect(
    preview
      .getByRole("listitem")
      .last()
      .getByText("Certified Trainers", { exact: true }),
  ).toBeVisible();
  await expect(
    preview.getByRole("listitem").last().locator("[data-stat-value]"),
  ).toContainText("+");
  for (const value of await preview.locator("[data-count-visual]").all()) {
    const shown = (await value.boundingBox())!;
    const reserved = (await value.locator("..").boundingBox())!;
    expect(shown.x).toBeGreaterThanOrEqual(reserved.x - 0.5);
    expect(shown.x + shown.width).toBeLessThanOrEqual(
      reserved.x + reserved.width + 0.5,
    );
  }
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/$/,
  );
  await preview.screenshot({
    path: info.outputPath(`home-counter-${info.project.name}.png`),
  });
});

test("H01-C04: charcoal band typography, separators and axe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const band = await mount(page);
  await band.scrollIntoViewIfNeeded();
  await expect(values(page).nth(1)).toHaveText("4.9", { timeout: 4000 });

  await expect(band.locator("..")).toHaveCSS(
    "background-color",
    "rgb(32, 32, 32)",
  );
  const value = band.locator("[data-stat-value]").first();
  await expect(value).toHaveCSS("font-family", /barlow/i);
  await expect(value).toHaveCSS("font-weight", "700");
  await expect(value).toHaveCSS("color", "rgb(255, 255, 255)");
  const label = band.locator("[data-stat-label]").first();
  await expect(label).toHaveCSS("font-family", /inter/i);
  await expect(label).toHaveCSS("font-size", "12px");
  await expect(label).toHaveCSS("text-transform", "uppercase");
  await expect(label).toHaveCSS("color", "rgb(245, 245, 245)");

  const vertical = band.locator(
    '[data-slot="separator"][data-orientation="vertical"]',
  );
  const horizontal = band.locator(
    '[data-slot="separator"][data-orientation="horizontal"]',
  );
  await expect(vertical).toHaveCount(2);
  for (const index of [0, 1]) {
    await expect(vertical.nth(index)).toBeVisible();
    await expect(horizontal.nth(index)).toBeHidden();
  }
  const boxes = await band
    .getByRole("listitem")
    .evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().top),
    );
  expect(new Set(boxes.map(Math.round)).size).toBe(1);

  expect(
    (
      await new AxeBuilder({ page })
        .include("#home-stats-fixture")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("H01-C04: uses two columns on phones and never overflows", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const band = await mount(page);
  const horizontal = band.locator(
    '[data-slot="separator"][data-orientation="horizontal"]',
  );
  await expect(horizontal.first()).toBeHidden();
  await expect(
    band
      .locator('[data-slot="separator"][data-orientation="vertical"]')
      .first(),
  ).toBeVisible();
  const tops = await band
    .getByRole("listitem")
    .evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().top),
    );
  expect(tops[1]).toBeCloseTo(tops[0], 0);
  expect(tops[2]).toBeGreaterThan(tops[0]);

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

test("H01-C04: integrated counters inherit the hero surface without a separate band", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator("[data-home-hero]");
  await expect(hero).toHaveCSS("clip-path", "none");
  await expect(hero.locator("[data-home-stats-preview]")).toHaveCount(1);
  await expect(hero.locator(".home-stats")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(hero.locator(".home-stats .layout-container")).toHaveCount(0);
});

test("H01-C05: counts up from zero after scrolling into view with stable width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await mount(page);
  const rating = values(page).nth(1);
  await expect(rating).toHaveText("0.0");
  // The overlay may vary; its wrapper is the layout box and must stay fixed.
  const box = rating.locator("..");
  const before = (await box.boundingBox())!.width;
  await page.locator("#home-stats-fixture").scrollIntoViewIfNeeded();
  await expect(rating).toHaveText("4.9", { timeout: 2500 });
  await expect(values(page).nth(0)).toHaveText("10");
  await expect(values(page).nth(2)).toHaveText("5");
  expect(Math.abs((await box.boundingBox())!.width - before)).toBeLessThan(0.5);
  await expect(
    page.locator("#home-stats-fixture [data-stat-value] .sr-only").first(),
  ).toHaveText("10");
});

test("H01-C05: reduced motion shows final values immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await mount(page);
  await expect(values(page)).toHaveText(["10", "4.9", "5"]);
});

test("H01-C04/C05: real preview reflows with enlarged text, blocked fonts and reduced motion", async ({
  page,
}) => {
  await page.route(/\.woff2(?:\?|$)/, (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const preview = page.locator("[data-home-stats-preview]");
  await expect(preview.locator("[data-count-visual]")).toHaveText([
    "1,200",
    "4.8",
    "5",
    "30",
  ]);
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} [data-home-stats-preview] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    // Reduced-motion foundations use a 0.01ms transition guard. Wait for the
    // responsive layout to commit before measuring the new breakpoint.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const overflow = await preview.evaluate((root) =>
      [root, ...root.querySelectorAll("li, p, [data-count-visual]")]
        .filter((node) => {
          const box = node.getBoundingClientRect();
          return (
            box.left < -1 ||
            box.right > innerWidth + 1 ||
            node.scrollWidth > node.clientWidth + 1
          );
        })
        .map((node) => ({
          text: node.textContent,
          width: node.clientWidth,
          scroll: node.scrollWidth,
        })),
    );
    expect(
      overflow,
      `Counter overflow at ${width}px with enlarged text`,
    ).toEqual([]);
  }
  await page.emulateMedia({ forcedColors: "active" });
  await expect(preview.getByRole("note")).toBeVisible();
  await expect(preview.locator("[data-count-visual]")).toHaveText([
    "1,200",
    "4.8",
    "5",
    "30",
  ]);
});

test("H01-C05: server-rendered markup (no JavaScript) shows final values", async ({
  page,
}) => {
  await mount(page, { hydrate: false });
  await expect(values(page)).toHaveText(["10", "4.9", "5"]);
});

test("H01-C05/C06: real Home shows final example values without JavaScript", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const preview = page.locator("[data-home-stats-preview]");
    await expect(preview.locator("[data-count-visual]")).toHaveText([
      "1,200",
      "4.8",
      "5",
      "30",
    ]);
    await expect(preview.getByRole("note")).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  } finally {
    await context.close();
  }
});
