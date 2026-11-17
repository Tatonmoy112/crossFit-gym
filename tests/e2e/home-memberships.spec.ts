import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) => page.locator("[data-home-memberships]");
const carousel = (page: Page) =>
  page.locator("[data-home-memberships-carousel]");
const previous = (page: Page) =>
  section(page).getByRole("button", { name: "Previous membership plan" });
const next = (page: Page) =>
  section(page).getByRole("button", { name: "Next membership plan" });
const status = (page: Page) => section(page).locator('[aria-live="polite"]');
const widths = [320, 375, 768, 1024, 1280, 1920];
async function ready(page: Page) {
  await page.goto("/");
  await expect(carousel(page)).toHaveAttribute("data-ready", "true");
  await page.evaluate(() => document.fonts.ready);
  await section(page).scrollIntoViewIfNeeded();
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await section(page)
      .locator("h2,h3,p:not(.sr-only),li,a")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const b = node.getBoundingClientRect(),
              card = node
                .closest("[data-membership-plan]")
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
            card: node
              .closest("[data-membership-plan]")
              ?.getBoundingClientRect()
              .toJSON(),
          })),
      ),
  ).toEqual([]);
}

test("disclosed preview plans follow Services with responsive centered layering and real Contact links", async ({
  page,
}, info) => {
  await ready(page);
  expect(
    await section(page).evaluate(
      (node) =>
        node.previousElementSibling?.hasAttribute("data-home-services") &&
        node.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-features-title",
    ),
  ).toBe(true);
  await expect(section(page).locator("h3")).toHaveText([
    "Essential",
    "Performance",
    "Elite",
  ]);
  await expect(section(page).getByRole("note")).toHaveText(
    "Illustrative membership plans. Benefits and prices are not confirmed gym offerings.",
  );
  await expect(section(page).locator("[data-membership-price]")).toHaveText(
    Array(3).fill("Price to be confirmed"),
  );
  await expect(section(page).locator("img")).toHaveCount(0);
  await expect(section(page).locator("a")).toHaveCount(4);
  for (const link of await section(page)
    .getByRole("link", { name: /^Choose / })
    .all())
    await expect(link).toHaveAttribute("href", "/contact/");
  await expect(
    section(page).getByRole("link", {
      name: "View Membership Plans",
      exact: true,
    }),
  ).toHaveAttribute("href", "/membership/");
  await expect(status(page)).toHaveText("Membership plan 2 of 3");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        carousel(page).evaluate((root) => {
          const v = root
              .querySelector('[data-slot="carousel-content"]')!
              .getBoundingClientRect(),
            s = root
              .querySelector('[data-slot="carousel-item"]')!
              .getBoundingClientRect();
          return Math.round((s.width / v.width) * 100);
        }),
      )
      .toBe(width >= 1024 ? 34 : width >= 768 ? 70 : 88);
    await expect
      .poll(() =>
        carousel(page).evaluate((root) => {
          const v = root
              .querySelector('[data-slot="carousel-content"]')!
              .getBoundingClientRect(),
            card = root
              .querySelector('[data-membership-plan="performance"]')!
              .getBoundingClientRect();
          return Math.abs((card.left + card.right - v.left - v.right) / 2) < 1;
        }),
      )
      .toBe(true);
    if (width >= 1024) {
      const geometry = await section(page)
        .locator("[data-membership-plan]")
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getBoundingClientRect().toJSON()),
        );
      expect(geometry[0].right - geometry[1].left).toBeCloseTo(16, 0);
      expect(geometry[0].top - geometry[1].top).toBeCloseTo(32, 0);
      // Layering covers frame edges only. Every button's center remains hit-testable.
      await section(page)
        .getByRole("link", { name: "Choose Performance", exact: true })
        .scrollIntoViewIfNeeded();
      expect(
        await section(page)
          .locator("[data-membership-plan] a")
          .evaluateAll((links) =>
            links.every((link) => {
              const b = link.getBoundingClientRect(),
                hit = document.elementFromPoint(
                  b.x + b.width / 2,
                  b.y + b.height / 2,
                );
              return !!hit && link.contains(hit);
            }),
          ),
      ).toBe(true);
    }
    await noOverflow(page);
    await section(page).screenshot({
      path: info.outputPath(`memberships-${width}.png`),
    });
  }
  for (const button of await section(page).getByRole("button").all()) {
    const b = (await button.boundingBox())!;
    expect(b.width).toBeGreaterThanOrEqual(44);
    expect(b.height).toBeGreaterThanOrEqual(44);
  }
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-memberships]")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("finite boundaries retain keyboard focus and each plan opens Contact", async ({
  page,
}) => {
  await ready(page);
  await previous(page).press("Enter");
  await expect(status(page)).toHaveText("Membership plan 1 of 3");
  await expect(previous(page)).toHaveAttribute("aria-disabled", "true");
  await expect(previous(page)).toBeFocused();
  await previous(page).press("Enter");
  await expect(status(page)).toHaveText("Membership plan 1 of 3");
  await previous(page).press("ArrowRight");
  await expect(status(page)).toHaveText("Membership plan 2 of 3");
  await next(page).click();
  await expect(status(page)).toHaveText("Membership plan 3 of 3");
  await expect(next(page)).toHaveAttribute("aria-disabled", "true");
  await expect(next(page)).toBeFocused();
  await next(page).press("Enter");
  await expect(status(page)).toHaveText("Membership plan 3 of 3");
  for (const [name, index] of [
    ["Essential", 0],
    ["Performance", 1],
    ["Elite", 2],
  ] as const) {
    await ready(page);
    if (index === 0) await previous(page).click();
    if (index === 2) await next(page).click();
    await section(page)
      .getByRole("link", { name: `Choose ${name}`, exact: true })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await page.goBack();
    await expect(carousel(page)).toHaveAttribute("data-ready", "true");
  }
  await section(page)
    .getByRole("link", { name: "View Membership Plans", exact: true })
    .click();
  await expect(page).toHaveURL(/\/membership\/$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your Fitness. Your Goals. Your Membership.",
    }),
  ).toBeVisible();
});

test("real mouse/touch drag moves one plan and never starts automatic rotation", async ({
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
      touchPoints: [{ x: b.x + b.width * 0.75, y }],
    });
    for (let step = 1; step <= 12; step++)
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: b.x + b.width * (0.75 - (0.55 * step) / 12), y }],
      });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touch.detach();
  } else {
    await page.mouse.move(b.x + b.width * 0.7, y);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width * 0.2, y, { steps: 12 });
    await page.mouse.up();
  }
  await expect(status(page)).toHaveText("Membership plan 3 of 3");
  await page.clock.install();
  await page.clock.runFor(15000);
  await expect(status(page)).toHaveText("Membership plan 3 of 3");
});

test("keyboard focus reveals a partially visible plan without clipping its link", async ({
  page,
}) => {
  await ready(page);
  await page.setViewportSize({ width: 375, height: 1100 });
  await expect(
    section(page).locator('[data-slot="carousel-item"][inert]'),
  ).toHaveCount(0);
  await page.keyboard.press("Tab");
  const essential = section(page).getByRole("link", {
    name: "Choose Essential",
    exact: true,
  });
  await essential.focus();
  await expect(essential).toBeFocused();
  await expect(status(page)).toHaveText("Membership plan 1 of 3");
  const a = (await essential.boundingBox())!,
    v = (await carousel(page)
      .locator('[data-slot="carousel-content"]')
      .boundingBox())!;
  expect(a.x).toBeGreaterThanOrEqual(v.x);
  expect(a.x + a.width).toBeLessThanOrEqual(v.x + v.width);
  await expect(
    section(page).locator('[data-slot="carousel-item"][inert]'),
  ).toHaveCount(1);
});

test("200% spaced text, blocked fonts/images and reduced motion retain all content", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/\.(woff2?|webp|png)(\?|$)/, (route) => route.abort());
  await ready(page);
  await next(page).click();
  await expect(status(page)).toHaveText("Membership plan 3 of 3");
  await page.addStyleTag({
    content:
      "html{font-size:200%} [data-home-memberships] p,[data-home-memberships] li,[data-home-memberships] a{line-height:1.8;letter-spacing:.12em;word-spacing:.16em}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    await noOverflow(page);
    await section(page).screenshot({
      path: info.outputPath(`memberships-enlarged-${width}.png`),
    });
  }
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-home-memberships]")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("without JavaScript all preview disclosures and Contact actions remain available", async ({
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
    await expect(section(page).getByRole("link")).toHaveCount(4);
    const viewport = carousel(page).locator('[data-slot="carousel-content"]');
    await expect(viewport).toHaveCSS("overflow-x", "auto");
    await viewport.evaluate((node) => (node.scrollLeft = node.scrollWidth));
    await section(page).screenshot({
      path: info.outputPath("memberships-no-js.png"),
    });
    await page.setViewportSize({ width: 1280, height: 1100 });
    await section(page).scrollIntoViewIfNeeded();
    expect(
      await carousel(page).evaluate((root) => {
        const viewport = root
          .querySelector('[data-slot="carousel-content"]')!
          .getBoundingClientRect();
        const cards = [...root.querySelectorAll("[data-membership-plan]")].map(
          (node) => node.getBoundingClientRect(),
        );
        return (
          cards[0].left >= viewport.left - 1 &&
          cards[2].right <= viewport.right + 1 &&
          cards[0].right < cards[1].left &&
          cards[1].right < cards[2].left
        );
      }),
    ).toBe(true);
    await section(page).screenshot({
      path: info.outputPath("memberships-no-js-desktop.png"),
    });
    await section(page)
      .getByRole("link", { name: "Choose Elite", exact: true })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await page.goBack();
    await section(page)
      .getByRole("link", { name: "View Membership Plans", exact: true })
      .click();
    await expect(page).toHaveURL(/\/membership\/$/);
  } finally {
    await context.close();
  }
});
