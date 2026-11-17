import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) => page.locator("[data-home-success-stories]");
const carousel = (page: Page) =>
  section(page).locator("[data-home-success-stories-carousel]");
const viewport = (page: Page) =>
  carousel(page).locator('[data-slot="carousel-content"]');
const status = (page: Page) => section(page).locator('[aria-live="polite"]');
const previous = (page: Page) =>
  section(page).getByRole("button", { name: "Previous success story" });
const next = (page: Page) =>
  section(page).getByRole("button", { name: "Next success story" });
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
      .locator("h2,h3,p:not(.sr-only),a,figcaption")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const b = node.getBoundingClientRect(),
              card = node
                .closest("[data-success-story]")
                ?.getBoundingClientRect();
            return (
              node.scrollWidth > node.clientWidth + 1 ||
              (card &&
                (b.left < card.left - 1 ||
                  b.right > card.right + 1 ||
                  b.top < card.top - 1 ||
                  b.bottom > card.bottom + 1))
            );
          })
          .map((node) => ({
            text: node.textContent,
            bounds: node.getBoundingClientRect().toJSON(),
          })),
      ),
  ).toEqual([]);
}
async function accessible(page: Page) {
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-success-stories]")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
}

test("three disclosed stories form a responsive asymmetric section between Memberships and Story", async ({
  page,
}, info) => {
  await ready(page);
  expect(
    await section(page).evaluate(
      (node) =>
        node.previousElementSibling?.hasAttribute("data-home-memberships") &&
        node.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-story-title",
    ),
  ).toBe(true);
  await expect(section(page).getByRole("note")).toHaveText(
    "Fictional sample testimonials for layout preview. Names and quotations are illustrative, not verified member stories.",
  );
  await expect(section(page).locator("figcaption")).toHaveCount(3);
  await expect(section(page).locator("blockquote")).toHaveCount(3);
  await expect(
    section(page).locator(
      "[data-success-story] a,[data-success-story] button,img",
    ),
  ).toHaveCount(0);
  for (const link of await section(page).locator("a").all())
    await expect(link).toHaveAttribute("href", "/contact/");
  await expect(status(page)).toHaveText("Success story 2 of 3");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        carousel(page).evaluate((root) => {
          const v = root
            .querySelector('[data-slot="carousel-content"]')!
            .getBoundingClientRect();
          const c = root
            .querySelector('[data-success-index="1"]')!
            .getBoundingClientRect();
          return Math.abs((c.left + c.right - v.left - v.right) / 2) < 1;
        }),
      )
      .toBe(true);
    const geometry = await section(page)
      .locator("[data-success-story]")
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getBoundingClientRect().toJSON()),
      );
    expect(geometry[1].height).toBeGreaterThanOrEqual(480);
    if (width >= 1280) {
      expect(geometry[0].height).toBeLessThan(geometry[1].height);
      expect(geometry[0].right).toBeLessThan(geometry[1].left);
      expect(geometry[1].right).toBeLessThan(geometry[2].left);
      await expect(section(page).locator("[inert]")).toHaveCount(0);
    }
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath(`stories-${width}.png`),
    });
  }
  for (const control of await section(page).locator("button,a").all()) {
    const box = (await control.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await accessible(page);
});

test("manual finite controls, keyboard viewport and Contact actions retain usable focus", async ({
  page,
}) => {
  await ready(page);
  await previous(page).press("Enter");
  await expect(status(page)).toHaveText("Success story 1 of 3");
  await expect(previous(page)).toBeFocused();
  await expect(previous(page)).toHaveAttribute("aria-disabled", "true");
  await previous(page).press("Enter");
  await expect(status(page)).toHaveText("Success story 1 of 3");
  await previous(page).press("ArrowRight");
  await expect(status(page)).toHaveText("Success story 2 of 3");
  await viewport(page).focus();
  await viewport(page).press("ArrowRight");
  await expect(viewport(page)).toBeFocused();
  await expect(status(page)).toHaveText("Success story 3 of 3");
  await expect(next(page)).toHaveAttribute("aria-disabled", "true");
  await next(page).press("Enter");
  await expect(next(page)).toBeFocused();
  await expect(status(page)).toHaveText("Success story 3 of 3");
  await page.setViewportSize({ width: 375, height: 1000 });
  await expect(section(page).locator("[inert]")).toHaveCount(1);
  await expect(
    section(page).locator('[data-success-index="2"]'),
  ).toHaveAttribute("data-success-active", "");
  for (const name of [
    "Start your journey",
    "Your Story Starts Here — Join Our Community",
  ]) {
    await section(page).getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await page.goBack();
    await expect(carousel(page)).toHaveAttribute("data-ready", "true");
  }
});

test("mouse or touch swipe changes one unique story and never auto rotates", async ({
  page,
}, info) => {
  await ready(page);
  await page.setViewportSize({ width: 375, height: 1000 });
  await viewport(page).scrollIntoViewIfNeeded();
  const b = (await viewport(page).boundingBox())!,
    y = b.y + Math.min(b.height * 0.4, 300);
  if (info.project.name === "mobile") {
    const touch = await page.context().newCDPSession(page);
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: b.x + b.width * 0.8, y }],
    });
    for (let i = 1; i <= 12; i++)
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: b.x + b.width * (0.8 - (0.6 * i) / 12), y }],
      });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touch.detach();
  } else {
    await page.mouse.move(b.x + b.width * 0.8, y);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width * 0.2, y, { steps: 12 });
    await page.mouse.up();
  }
  await expect(status(page)).toHaveText("Success story 3 of 3");
  await page.clock.install();
  await page.clock.runFor(15000);
  await expect(status(page)).toHaveText("Success story 3 of 3");
  await expect(section(page).locator("blockquote")).toHaveCount(3);
});

test("enlarged spaced text, blocked assets and live reduced motion preserve every quotation", async ({
  page,
}, info) => {
  await page.route(/\.(?:woff2|png|webp|jpe?g)(?:\?.*)?$/, (route) =>
    route.abort(),
  );
  await ready(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await previous(page).click();
  await expect(status(page)).toHaveText("Success story 1 of 3");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await next(page).click();
  await expect(status(page)).toHaveText("Success story 2 of 3");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content:
      "html{font-size:200%} [data-home-success-stories] p,[data-home-success-stories] figcaption,[data-home-success-stories] a{line-height:1.8;letter-spacing:.12em;word-spacing:.16em}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath(`stories-enlarged-${width}.png`),
    });
  }
  await accessible(page);
});

test("without JavaScript all three stories and Contact actions remain natively usable", async ({
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
    await expect(section(page).locator("blockquote")).toHaveCount(3);
    await expect(viewport(page)).toHaveCSS("overflow-x", "auto");
    await viewport(page).focus();
    await viewport(page).press("ArrowRight");
    await expect
      .poll(() => viewport(page).evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath("stories-no-js-mobile.png"),
    });
    await page.setViewportSize({ width: 1280, height: 1100 });
    await viewport(page).evaluate((node) => (node.scrollLeft = 0));
    await section(page).scrollIntoViewIfNeeded();
    const boxes = await section(page)
      .locator("[data-success-story]")
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getBoundingClientRect().toJSON()),
      );
    const v = (await viewport(page).boundingBox())!;
    expect(boxes[0].left).toBeGreaterThanOrEqual(v.x - 1);
    expect(boxes[2].right).toBeLessThanOrEqual(v.x + v.width + 1);
    expect(boxes[1].height).toBeGreaterThan(boxes[0].height);
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath("stories-no-js-desktop.png"),
    });
    for (const link of await section(page).locator("a").all())
      await expect(link).toHaveAttribute("href", "/contact/");
    await section(page)
      .getByRole("link", {
        name: "Your Story Starts Here — Join Our Community",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
  } finally {
    await context.close();
  }
});
