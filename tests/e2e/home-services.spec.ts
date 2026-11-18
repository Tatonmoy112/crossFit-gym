import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const section = (page: Page) => page.locator("[data-home-services]");
const carousel = (page: Page) => page.locator("[data-home-services-carousel]");
const titles = [
  "Personal Training",
  "Strength Training",
  "Group Fitness",
  "HIIT & Conditioning",
  "Cardio & Endurance",
  "Functional Fitness",
  "Weight Management",
  "Mobility & Recovery",
];
const ids = [
  "personal-training",
  "strength-training",
  "group-fitness",
  "hiit-conditioning",
  "cardio-endurance",
  "functional-fitness",
  "weight-management",
  "mobility-recovery",
];

async function ready(page: Page) {
  await page.goto("/");
  await expect(carousel(page)).toHaveAttribute("data-ready", "true");
  await page.evaluate(() => document.fonts.ready);
  await section(page).scrollIntoViewIfNeeded();
}
async function current(page: Page) {
  return carousel(page).evaluate((root) => {
    const left = root
      .querySelector('[data-slot="carousel-content"]')!
      .getBoundingClientRect().left;
    return [...root.querySelectorAll<HTMLElement>("[data-service-card]")].sort(
      (a, b) =>
        Math.abs(a.getBoundingClientRect().left - left) -
        Math.abs(b.getBoundingClientRect().left - left),
    )[0].dataset.serviceCard;
  });
}

test("services use approved copy, responsive card counts and the reference composition", async ({
  page,
}, info) => {
  await ready(page);
  await section(page).getByRole("button", { name: "Next service" }).focus();
  await section(page).getByRole("button", { name: "Next service" }).blur();
  await expect(section(page).locator("h3")).toHaveText(titles);
  await expect(section(page).locator("a")).toHaveCount(8);
  await expect(section(page).locator("img")).toHaveCount(0);
  for (const link of await section(page).locator("a").all()) {
    await expect(link).toHaveAttribute("href", "/contact/");
  }
  expect(
    await section(page).evaluate(
      (root) =>
        root.previousElementSibling?.getAttribute("aria-labelledby") ===
          "home-why-choose-us-title" &&
        root.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-memberships-title",
    ),
  ).toBe(true);
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await section(page).scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        section(page).evaluate((root) => {
          const viewport = root
            .querySelector('[data-slot="carousel-content"]')!
            .getBoundingClientRect();
          const cards = [...root.querySelectorAll("[data-service-card]")].map(
            (node) => node.getBoundingClientRect(),
          );
          const ratio = cards[0].width / viewport.width;
          return Math.round(ratio * 100);
        }),
      )
      .toBe(
        width >= 1024
          ? Math.round(
              ((Math.min(1550, width - 64) - 48) /
                4 /
                Math.min(1550, width - 64)) *
                100,
            )
          : width >= 768
            ? Math.round(((width - 48 - 16) / 2 / (width - 48)) * 100)
            : 85,
      );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await section(page).screenshot({
      path: info.outputPath(`services-${width}.png`),
    });
  }
  await expect(section(page)).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  const controls = section(page).getByRole("button");
  for (const control of await controls.all()) {
    const box = (await control.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await expect(controls.first()).toHaveAccessibleName(
    "Play automatic rotation",
  );
});

test("manual controls loop through eight services, keep focus, and link to Contact", async ({
  page,
}) => {
  await ready(page);
  const next = section(page).getByRole("button", { name: "Next service" });
  for (let index = 1; index <= 8; index++) {
    await next.click();
    await expect.poll(() => current(page)).toBe(ids[index % 8]);
    await expect(next).toBeFocused();
  }
  await next.press("ArrowLeft");
  await expect.poll(() => current(page)).toBe("mobility-recovery");
  const offscreen = await section(page)
    .locator('[data-slot="carousel-item"][inert]')
    .count();
  expect(offscreen).toBeGreaterThan(0);
  const card = section(page).getByRole("link", {
    name: "Ask about Mobility & Recovery",
  });
  await card.click();
  await expect(page).toHaveURL(/\/contact\/$/);
});

test("automatic rotation respects visibility, hover, focus, explicit play and pause", async ({
  page,
}) => {
  await page.clock.install();
  await ready(page);
  await page.mouse.move(0, 0);
  await page.clock.runFor(5100);
  await expect.poll(() => current(page)).toBe("strength-training");
  await carousel(page).hover();
  await page.clock.runFor(10000);
  expect(await current(page)).toBe("strength-training");
  await page.mouse.move(0, 0);
  await page.clock.runFor(5100);
  await expect.poll(() => current(page)).toBe("group-fitness");
  await section(page).getByRole("button", { name: "Next service" }).focus();
  await page.locator("main").focus();
  await page.clock.runFor(10000);
  expect(await current(page)).toBe("group-fitness");
  const rotation = section(page).locator("[data-services-rotation]");
  await rotation.click();
  await expect(rotation).toHaveAccessibleName("Pause automatic rotation");
  await page.mouse.move(0, 0);
  await page.clock.runFor(5100);
  await expect.poll(() => current(page)).toBe("hiit-conditioning");
  await rotation.click();
  await expect(rotation).toHaveAccessibleName("Play automatic rotation");
  await page.mouse.move(0, 0);
  await page.clock.runFor(10000);
  expect(await current(page)).toBe("hiit-conditioning");
  await rotation.click();
  await page.locator("[data-home-hero]").scrollIntoViewIfNeeded();
  await expect(carousel(page)).not.toBeInViewport();
  await page.clock.runFor(10000);
  expect(await current(page)).toBe("hiit-conditioning");
});

test("dragging stops autoplay and a partially visible card reveals on keyboard focus", async ({
  page,
}, info) => {
  await ready(page);
  const viewport = carousel(page).locator('[data-slot="carousel-content"]');
  const box = (await viewport.boundingBox())!;
  const y = box.y + box.height * 0.7;
  if (info.project.name === "mobile") {
    const touch = await page.context().newCDPSession(page);
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width * 0.8, y }],
    });
    for (let step = 1; step <= 12; step++) {
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: box.x + box.width * (0.8 - (0.6 * step) / 12), y }],
      });
    }
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
  await expect.poll(() => current(page)).not.toBe("personal-training");
  await expect(
    section(page).getByRole("button", { name: "Play automatic rotation" }),
  ).toBeVisible();
  const visibleLinks = section(page).locator(
    '[data-slot="carousel-item"]:not([inert]) a',
  );
  const name = await visibleLinks.last().getAttribute("aria-label");
  const last = section(page).getByRole("link", { name: name!, exact: true });
  await page.keyboard.press("Tab");
  await last.focus();
  await expect(last).toBeFocused();
  await expect
    .poll(async () => {
      const linkBox = (await last.boundingBox())!;
      const bounds = (await viewport.boundingBox())!;
      return (
        linkBox.x >= bounds.x - 1 &&
        linkBox.x + linkBox.width <= bounds.x + bounds.width + 1
      );
    })
    .toBe(true);
});

test("reduced motion, enlarged text, blocked fonts and accessibility preserve operation", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/\.(woff2?|png|webp)(\?|$)/, (route) => route.abort());
  await ready(page);
  await expect(
    section(page).getByRole("button", { name: /automatic rotation/ }),
  ).toHaveCount(0);
  await section(page).getByRole("button", { name: "Next service" }).click();
  await expect.poll(() => current(page)).toBe("strength-training");
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.addStyleTag({
      content:
        "html {font-size: 200%} [data-home-services] p {line-height: 1.8; letter-spacing: .12em; word-spacing: .16em}",
    });
    await section(page).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(
      await section(page)
        .locator("h2,h3,p")
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => {
              const card = node.closest("[data-service-card]");
              const box = node.getBoundingClientRect();
              const bounds = card?.getBoundingClientRect();
              // Fallback glyph ink can extend beyond its line box without
              // clipping. Check the actual card clipping boundary instead.
              return (
                node.scrollWidth > node.clientWidth + 1 ||
                (bounds &&
                  (box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1))
              );
            })
            .map((node) => ({
              text: node.textContent,
              width: node.clientWidth,
              scrollWidth: node.scrollWidth,
              height: node.clientHeight,
              scrollHeight: node.scrollHeight,
            })),
        ),
    ).toEqual([]);
    await section(page).screenshot({
      path: info.outputPath(`services-enlarged-${width}.png`),
    });
  }
  const results = await new AxeBuilder({ page })
    .include("[data-home-services]")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("no JavaScript retains native scrolling and all eight real Contact links", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await section(page).scrollIntoViewIfNeeded();
  await expect(carousel(page)).toHaveAttribute("data-ready", "false");
  await expect(section(page).locator("[data-services-controls]")).toBeHidden();
  await expect(section(page).locator("[inert]")).toHaveCount(0);
  await expect(section(page).getByRole("link")).toHaveCount(8);
  const viewport = carousel(page).locator('[data-slot="carousel-content"]');
  await expect(viewport).toHaveCSS("overflow-x", "auto");
  await viewport.evaluate((node) => {
    node.scrollLeft = node.scrollWidth;
  });
  await section(page).screenshot({
    path: info.outputPath("services-no-js.png"),
  });
  await section(page)
    .getByRole("link", { name: "Ask about Mobility & Recovery" })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await context.close();
});
