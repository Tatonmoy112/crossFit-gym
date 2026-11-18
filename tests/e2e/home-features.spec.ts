import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) => page.locator("[data-home-features]");
const carousel = (page: Page) => page.locator("[data-home-features-carousel]");
const titles = [
  "Modern Equipment",
  "Expert Guidance",
  "Dedicated Training Zones",
  "Supportive Community",
  "Clean & Comfortable Space",
  "Progress-Focused Training",
];
async function ready(page: Page) {
  await page.goto("/");
  await expect(carousel(page)).toHaveAttribute("data-ready", "true");
  await page.evaluate(() => document.fonts.ready);
  await section(page).scrollIntoViewIfNeeded();
}
const next = (page: Page) =>
  section(page).getByRole("button", { name: "Next feature" });
const position = (page: Page) => section(page).locator('[aria-live="polite"]');

test("features follow Memberships with split introduction, staggered cards and yellow pill links", async ({
  page,
}, info) => {
  await ready(page);
  expect(
    await section(page).evaluate(
      (node) =>
        node.previousElementSibling?.hasAttribute("data-home-memberships") &&
        node.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-product-categories-title",
    ),
  ).toBe(true);
  await expect(section(page).locator("h3")).toHaveText(titles);
  await expect(section(page).locator("a")).toHaveCount(7);
  await expect(section(page).locator("img")).toHaveCount(0);
  await expect(
    section(page).getByRole("button", { name: /rotation/ }),
  ).toHaveCount(0);
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    await expect
      .poll(async () =>
        carousel(page).evaluate((root) => {
          const viewport = root
            .querySelector('[data-slot="carousel-content"]')!
            .getBoundingClientRect();
          const card = root
            .querySelector('[data-slot="carousel-item"]')!
            .getBoundingClientRect();
          return Math.round((card.width / viewport.width) * 100);
        }),
      )
      .toBe(width >= 768 ? 49 : 88);
    const geometry = await carousel(page).evaluate((root) => {
      const cards = [...root.querySelectorAll("[data-home-feature-card]")].map(
        (n) => n.getBoundingClientRect(),
      );
      const viewport = root
        .querySelector('[data-slot="carousel-content"]')!
        .getBoundingClientRect();
      const intro = root
        .querySelector(".home-features-intro")!
        .getBoundingClientRect();
      return {
        ratio: cards[0].width / viewport.width,
        offset: cards[0].height - cards[1].height,
        introRight: intro.right,
        viewportLeft: viewport.left,
      };
    });
    if (width >= 768) {
      expect(geometry.ratio).toBeCloseTo(
        (1 -
          20 /
            (await carousel(page)
              .locator('[data-slot="carousel-content"]')
              .boundingBox())!.width) /
          2,
        2,
      );
      expect(geometry.offset).toBeCloseTo(72, 0);
    }
    if (width >= 1280)
      expect(geometry.introRight).toBeLessThan(geometry.viewportLeft);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await section(page).screenshot({
      path: info.outputPath(`features-${width}.png`),
    });
  }
  const link = section(page).getByRole("link", {
    name: "Ask About Equipment",
    exact: true,
  });
  await expect(link).toHaveAttribute("href", "/contact/");
  expect(
    parseFloat(
      await link.evaluate((node) => getComputedStyle(node).borderRadius),
    ),
  ).toBeGreaterThanOrEqual(22);
  await expect(link).toHaveCSS("text-decoration-line", "none");
  await link.hover();
  await expect(link).toHaveCSS("color", "rgb(23, 23, 23)");
  const controls = section(page).getByRole("button");
  for (const control of await controls.all()) {
    const box = (await control.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test("manual arrows loop, keyboard focus reveals visible cards and CTA navigation works", async ({
  page,
}) => {
  await ready(page);
  for (let index = 1; index <= 6; index++) {
    await next(page).click();
    await expect(position(page)).toHaveText(
      `Feature ${String((index % 6) + 1).padStart(2, "0")} of 6`,
    );
    await expect(next(page)).toBeFocused();
    await expect
      .poll(() =>
        section(page).evaluate((root) => {
          const controls = root
            .querySelector("[data-features-controls]")!
            .getBoundingClientRect();
          return [
            ...root.querySelectorAll(
              '[data-slot="carousel-item"]:not([inert]) a',
            ),
          ].every((link) => {
            const box = link.getBoundingClientRect();
            return (
              box.right <= controls.left ||
              box.left >= controls.right ||
              box.bottom <= controls.top ||
              box.top >= controls.bottom
            );
          });
        }),
      )
      .toBe(true);
  }
  await next(page).press("ArrowLeft");
  await expect(position(page)).toHaveText("Feature 06 of 6");
  await expect(
    section(page).locator('[data-slot="carousel-item"][inert]'),
  ).not.toHaveCount(0);
  await page.keyboard.press("Tab");
  const links = section(page).locator(
    '[data-slot="carousel-item"]:not([inert]) a',
  );
  const label = (await links.last().textContent())!.trim();
  const link = section(page).getByRole("link", { name: label, exact: true });
  await link.focus();
  await expect(link).toBeFocused();
  await expect
    .poll(async () => {
      const a = (await link.boundingBox())!,
        v = (await carousel(page)
          .locator('[data-slot="carousel-content"]')
          .boundingBox())!;
      return a.x >= v.x - 1 && a.x + a.width <= v.x + v.width + 1;
    })
    .toBe(true);
  // Return to a known card and open its existing destination.
  await ready(page);
  await next(page).click();
  await expect(position(page)).toHaveText("Feature 02 of 6");
  await section(page)
    .getByRole("link", { name: "Ask About Coaching", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.goBack();
  await expect(carousel(page)).toHaveAttribute("data-ready", "true");
});

test("mouse and touch swipes navigate without automatic rotation", async ({
  page,
}, info) => {
  await ready(page);
  const viewport = carousel(page).locator('[data-slot="carousel-content"]');
  const b = (await viewport.boundingBox())!,
    y = b.y + b.height * 0.45;
  if (info.project.name === "mobile") {
    const touch = await page.context().newCDPSession(page);
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: b.x + b.width * 0.8, y }],
    });
    for (let step = 1; step <= 12; step++)
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: b.x + b.width * (0.8 - (0.65 * step) / 12), y }],
      });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touch.detach();
  } else {
    await page.mouse.move(b.x + b.width * 0.8, y);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width * 0.15, y, { steps: 12 });
    await page.mouse.up();
  }
  await expect(position(page)).not.toHaveText("Feature 01 of 6");
  const before = await position(page).textContent();
  await page.clock.install();
  await page.clock.runFor(15000);
  await expect(position(page)).toHaveText(before!);
});

test("reduced motion, failed assets and 200% spaced text preserve the full card content", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/\.(woff2?|webp|png)(\?|$)/, (route) => route.abort());
  await ready(page);
  await next(page).click();
  await expect(position(page)).toHaveText("Feature 02 of 6");
  await page.addStyleTag({
    content:
      "html{font-size:200%} [data-home-features] p,[data-home-features] a{line-height:1.8;letter-spacing:.12em;word-spacing:.16em}",
  });
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(
      await section(page)
        .locator("h2,h3,p,a")
        .evaluateAll((nodes) =>
          nodes
            .filter((n) => {
              const bounds = n
                  .closest("[data-home-feature-card]")
                  ?.getBoundingClientRect(),
                b = n.getBoundingClientRect();
              return (
                n.scrollWidth > n.clientWidth + 1 ||
                (bounds &&
                  (b.left < bounds.left - 1 ||
                    b.right > bounds.right + 1 ||
                    b.top < bounds.top - 1 ||
                    b.bottom > bounds.bottom + 1))
              );
            })
            .map((n) => ({
              text: n.textContent,
              width: n.clientWidth,
              scrollWidth: n.scrollWidth,
              bounds: n.getBoundingClientRect().toJSON(),
              card: n
                .closest("[data-home-feature-card]")
                ?.getBoundingClientRect()
                .toJSON(),
            })),
        ),
    ).toEqual([]);
    await section(page).screenshot({
      path: info.outputPath(`features-enlarged-${width}.png`),
    });
  }
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-features]")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("without JavaScript all six CTA links remain usable in a native scrolling row", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await section(page).scrollIntoViewIfNeeded();
    await expect(carousel(page)).toHaveAttribute("data-ready", "false");
    await expect(
      section(page).locator("[data-features-controls]"),
    ).toBeHidden();
    await expect(section(page).locator("[inert]")).toHaveCount(0);
    await expect(section(page).getByRole("link")).toHaveCount(7);
    const viewport = carousel(page).locator('[data-slot="carousel-content"]');
    await expect(viewport).toHaveCSS("overflow-x", "auto");
    await viewport.evaluate((node) => (node.scrollLeft = node.scrollWidth));
    await section(page).screenshot({
      path: info.outputPath("features-no-js.png"),
    });
    await section(page)
      .getByRole("link", { name: "Learn Our Approach", exact: true })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
  } finally {
    await context.close();
  }
});
