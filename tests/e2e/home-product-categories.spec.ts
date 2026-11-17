import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) => page.locator("[data-home-product-categories]");
const carousel = (page: Page) =>
  section(page).locator("[data-home-product-categories-carousel]");
const viewport = (page: Page) =>
  carousel(page).locator('[data-slot="carousel-content"]');
const status = (page: Page) => section(page).locator('[aria-live="polite"]');
const previous = (page: Page) =>
  section(page).getByRole("button", { name: "Previous product category" });
const next = (page: Page) =>
  section(page).getByRole("button", { name: "Next product category" });
const widths = [320, 375, 768, 1024, 1280, 1920];

async function ready(page: Page) {
  await page.goto("/");
  await expect(carousel(page)).toHaveAttribute("data-ready", "true");
  await page.evaluate(() => document.fonts.ready);
  await section(page).scrollIntoViewIfNeeded();
}

async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await section(page)
      .locator("h2,h3,p:not(.sr-only),a")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const bounds = node.getBoundingClientRect();
            const card = node
              .closest("[data-product-category]")
              ?.getBoundingClientRect();
            return (
              node.scrollWidth > node.clientWidth + 1 ||
              (card &&
                (bounds.left < card.left - 1 ||
                  bounds.right > card.right + 1 ||
                  bounds.top < card.top - 1 ||
                  bounds.bottom > card.bottom + 1))
            );
          })
          .map((node) => node.textContent),
      ),
  ).toEqual([]);
}

test("four disclosed categories follow Features with centered layering and usable responsive cards", async ({
  page,
}, info) => {
  await ready(page);
  expect(
    await section(page).evaluate(
      (node) =>
        node.previousElementSibling?.hasAttribute("data-home-features") &&
        node.nextElementSibling?.hasAttribute("data-home-affiliates"),
    ),
  ).toBe(true);
  await expect(section(page).getByRole("note")).toHaveText(
    "Product category layout preview. Example products are illustrative; availability and prices are not confirmed.",
  );
  await expect(section(page).locator("[data-product-category]")).toHaveCount(4);
  await expect(section(page).locator("img,form")).toHaveCount(0);
  await expect(section(page).locator("a")).toHaveCount(5);
  for (const link of await section(page).locator("a").all())
    await expect(link).toHaveAttribute(
      "href",
      /^\/products\/(?:\?category=[a-z-]+)?$/,
    );
  await expect(status(page)).toHaveText("Product category 2 of 4");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        carousel(page).evaluate((root) => {
          const v = root
            .querySelector('[data-slot="carousel-content"]')!
            .getBoundingClientRect();
          const card = root
            .querySelector('[data-category-index="1"]')!
            .getBoundingClientRect();
          return Math.abs((card.left + card.right - v.left - v.right) / 2) < 1;
        }),
      )
      .toBe(true);
    if (width >= 1280) {
      const boxes = await section(page)
        .locator("[data-product-category]")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getBoundingClientRect().toJSON()),
        );
      expect(boxes[1].height).toBeGreaterThan(boxes[0].height);
      expect(boxes[0].right).toBeGreaterThan(boxes[1].left);
    }
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath(`categories-${width}.png`),
    });
  }
  for (const control of await section(page).locator("button,a").all()) {
    const box = (await control.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const categoryAction = section(page).getByRole("link", {
    name: "Explore Equipment",
    exact: true,
  });
  await categoryAction.hover();
  await expect(categoryAction).toHaveCSS("color", "rgb(23, 23, 23)");
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-product-categories]")
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("finite controls, viewport keys and partially visible card focus keep actions accessible", async ({
  page,
}) => {
  await ready(page);
  await previous(page).press("Enter");
  await expect(status(page)).toHaveText("Product category 1 of 4");
  await expect(previous(page)).toBeFocused();
  await expect(previous(page)).toHaveAttribute("aria-disabled", "true");
  await previous(page).press("Enter");
  await expect(status(page)).toHaveText("Product category 1 of 4");
  await previous(page).press("ArrowRight");
  await expect(status(page)).toHaveText("Product category 2 of 4");
  await viewport(page).focus();
  await viewport(page).press("ArrowRight");
  await viewport(page).press("ArrowRight");
  await expect(status(page)).toHaveText("Product category 4 of 4");
  await expect(viewport(page)).toBeFocused();
  await expect(next(page)).toHaveAttribute("aria-disabled", "true");
  await next(page).press("Enter");
  await expect(next(page)).toBeFocused();
  await expect(status(page)).toHaveText("Product category 4 of 4");
  await next(page).press("ArrowLeft");
  await expect(status(page)).toHaveText("Product category 3 of 4");
  await page.setViewportSize({ width: 375, height: 1000 });
  await expect
    .poll(() => section(page).locator("[inert]").count())
    .toBeGreaterThan(0);
  // Tab into the partially visible prior slide: Embla must reveal its action.
  await viewport(page).focus();
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveAttribute(
    "href",
    /^\/products\/(?:\?category=[a-z-]+)?$/,
  );
  const linkBox = (await focused.boundingBox())!;
  const viewBox = (await viewport(page).boundingBox())!;
  expect(linkBox.x).toBeGreaterThanOrEqual(viewBox.x - 1);
  expect(linkBox.x + linkBox.width).toBeLessThanOrEqual(
    viewBox.x + viewBox.width + 1,
  );
  await focused.click();
  await expect(page).toHaveURL(/\/products\/(?:\?category=[a-z-]+)?$/);
  await page.goBack();
  await expect(carousel(page)).toHaveAttribute("data-ready", "true");
  await section(page).getByRole("link", { name: "View All Product" }).click();
  await expect(page).toHaveURL(/\/products\/(?:\?category=[a-z-]+)?$/);
});

test("mouse or touch swipe selects a category without automatic rotation", async ({
  page,
}, info) => {
  await ready(page);
  await page.setViewportSize({ width: 375, height: 1000 });
  await viewport(page).scrollIntoViewIfNeeded();
  const box = (await viewport(page).boundingBox())!;
  const y = box.y + Math.min(box.height * 0.4, 250);
  if (info.project.name === "mobile") {
    const touch = await page.context().newCDPSession(page);
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width * 0.8, y }],
    });
    for (let i = 1; i <= 12; i++)
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: box.x + box.width * (0.8 - (0.6 * i) / 12), y }],
      });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touch.detach();
  } else {
    await page.mouse.move(box.x + box.width * 0.8, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, y, { steps: 12 });
    await page.mouse.up();
  }
  await expect(status(page)).toHaveText("Product category 3 of 4");
  await page.clock.install();
  await page.clock.runFor(15000);
  await expect(status(page)).toHaveText("Product category 3 of 4");
  await expect(section(page).locator("[data-product-category]")).toHaveCount(4);
});

test("enlarged text, failed assets and live reduced motion retain all category copy", async ({
  page,
}, info) => {
  await page.route(/\.(?:woff2|png|webp|jpe?g)(?:\?.*)?$/, (route) =>
    route.abort(),
  );
  await ready(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await previous(page).click();
  await expect(status(page)).toHaveText("Product category 1 of 4");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await next(page).click();
  await expect(status(page)).toHaveText("Product category 2 of 4");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content:
      "html{font-size:200%} [data-home-product-categories] p,[data-home-product-categories] a{line-height:1.8;letter-spacing:.12em;word-spacing:.16em}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath(`categories-enlarged-${width}.png`),
    });
  }
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-product-categories]")
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("without JavaScript every category and listing action remains natively available", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 1000 },
  });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await section(page).scrollIntoViewIfNeeded();
    await expect(carousel(page)).toHaveAttribute("data-ready", "false");
    await expect(section(page).getByRole("note")).toBeVisible();
    await expect(section(page).getByRole("button")).toHaveCount(0);
    await expect(section(page).locator("[inert]")).toHaveCount(0);
    await expect(section(page).locator("[data-product-category]")).toHaveCount(
      4,
    );
    await expect(viewport(page)).toHaveCSS("overflow-x", "auto");
    await viewport(page).focus();
    await viewport(page).press("ArrowRight");
    await expect
      .poll(() => viewport(page).evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 1100 });
      await section(page).scrollIntoViewIfNeeded();
      await fits(page);
      await section(page).screenshot({
        path: info.outputPath(`categories-no-js-${width}.png`),
      });
    }
    await section(page).getByRole("link", { name: "Explore Apparel" }).click();
    await expect(page).toHaveURL(/\/products\/(?:\?category=[a-z-]+)?$/);
  } finally {
    await context.close();
  }
});
