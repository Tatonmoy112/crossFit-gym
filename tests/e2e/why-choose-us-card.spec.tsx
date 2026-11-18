import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { loadServerComponent } from "./helpers/server-component";
import { whyCardFixture } from "../fixtures/why-choose-us.data";

const { WhyChooseUsCard } = loadServerComponent<
  typeof import("@/features/home/why-choose-us-card")
>("src/features/home/why-choose-us-card.tsx");

async function mount(page: Page, long = false) {
  await page.goto("/about/");
  await page.waitForLoadState("networkidle");
  const markup = renderToStaticMarkup(
    <section
      id="why-card-fixture"
      className="layout-container py-8"
      aria-label="Card specimen"
    >
      <h2>Card specimen</h2>
      <div className="max-w-96">
        <WhyChooseUsCard
          item={
            long
              ? {
                  ...whyCardFixture,
                  title: `Specimen ${"LongTitle".repeat(15)}`,
                  description: `Specimen ${"UnbrokenDescription".repeat(25)}`,
                }
              : whyCardFixture
          }
        />
      </div>
    </section>,
  );
  await page.evaluate(
    (markup) =>
      document.querySelector("main")!.insertAdjacentHTML("beforeend", markup),
    markup,
  );
  await page.locator("#why-card-fixture article").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  return page.locator("#why-card-fixture article");
}

test("H01-D02: actual card geometry, image, fonts and readable scrim follow the selected pattern", async ({
  page,
}) => {
  const article = await mount(page);
  const card = article.locator('[data-slot="card"]');
  await expect(article).toHaveAccessibleName("Certified Trainers");
  await expect(card).toHaveCSS("min-height", "384px");
  await expect(card).toHaveCSS("border-radius", "12px");
  await expect(card).toHaveCSS("padding-top", "0px");
  await expect(card).toHaveCSS("background-color", "rgb(32, 32, 32)");
  const image = article.locator("img");
  await expect(image).toHaveAttribute("loading", "lazy");
  await expect(image).toHaveJSProperty("naturalWidth", 1672);
  await expect(image).toHaveCSS("object-position", "0% 50%");
  const scrim = await article.locator("[data-why-scrim]").evaluate((node) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    context.fillStyle = getComputedStyle(node).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data];
  });
  // CSS color-mix uses OKLab; 8-bit canvas conversion can round a channel by 1.
  for (const channel of scrim.slice(0, 3))
    expect(Math.abs(channel - 32)).toBeLessThanOrEqual(1);
  expect(scrim[3]).toBe(179);
  for (const text of [article.locator("h3"), article.locator("p")]) {
    await expect(text).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(text).toHaveCSS("font-family", /inter/i);
    await expect(text).toBeVisible();
  }
  await expect(article.locator("p")).toHaveCSS("font-size", "16px");
  await expect(article.locator("p")).toHaveCSS("line-height", "25.6px");
  const luminance = (channel: number) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const alpha = scrim[3] / 255;
  expect(
    1.05 / (luminance(scrim[0] * alpha + 255 * (1 - alpha)) + 0.05),
  ).toBeGreaterThanOrEqual(4.5);
  await expect(
    article.locator("a, button, [tabindex], [aria-live]"),
  ).toHaveCount(0);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("H01-D02: only the image zooms on capable hover and reduced motion suppresses it", async ({
  page,
}) => {
  const article = await mount(page);
  const image = article.locator("img");
  const before = (await article.boundingBox())!;
  await article.hover();
  const hover = await page.evaluate(() => matchMedia("(hover: hover)").matches);
  await expect(image).toHaveCSS("scale", hover ? "1.1" : "none");
  await expect(image).toHaveCSS("transition-duration", "0.5s");
  expect((await article.boundingBox())!.height).toBeCloseTo(before.height, 1);
  await expect(article.getByText("30+ certified trainers.")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(image).toHaveCSS("scale", "none");
  await expect(article.getByRole("heading", { level: 3 })).toBeVisible();
});

test("H01-D02: long and enlarged text grows the card without clipping at each width", async ({
  page,
}) => {
  const article = await mount(page, true);
  for (const scale of [1, 2]) {
    if (scale === 2)
      await page.addStyleTag({
        content:
          "html{font-size:200%!important} #why-card-fixture *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
      });
    for (const width of [320, 375, 768, 1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(
        await article.evaluate((root) =>
          [root, ...root.querySelectorAll("h3,p")].every((node) => {
            const box = node.getBoundingClientRect();
            return (
              node.scrollWidth <= node.clientWidth + 1 &&
              box.left >= 0 &&
              box.right <= innerWidth + 1
            );
          }),
        ),
      ).toBe(true);
      const bounds = (await article.boundingBox())!;
      for (const text of [article.locator("h3"), article.locator("p")]) {
        const box = (await text.boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(bounds.y);
        expect(box.y + box.height).toBeLessThanOrEqual(
          bounds.y + bounds.height,
        );
      }
    }
  }
});

test("H01-D02: failed image/fonts and system colors preserve static card text", async ({
  page,
}) => {
  await page.route(/home-hero\.webp|\.woff2(?:\?|$)/, (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  const article = await mount(page);
  await expect(article.locator("img")).toHaveJSProperty("naturalWidth", 0);
  await expect(article.getByText("30+ certified trainers.")).toBeVisible();
  await expect(article.locator('[data-slot="card"]')).toHaveCSS(
    "background-color",
    "rgb(32, 32, 32)",
  );
  await page.emulateMedia({ forcedColors: "active" });
  await expect(article.getByRole("heading", { level: 3 })).toBeVisible();
  await expect(article.locator("p")).toBeVisible();
});
