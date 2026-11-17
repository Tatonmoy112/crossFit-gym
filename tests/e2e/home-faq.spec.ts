import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { homeFaq, homeFaqItems } from "../../src/content/home-faq";

const section = (page: Page) => page.locator("[data-home-faq]");
const rows = (page: Page) => section(page).locator("details");
async function ready(page: Page) {
  await page.goto("/");
  await expect(section(page).locator("[data-faq-list]")).toHaveAttribute(
    "data-ready",
    "true",
  );
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
      .locator("h2,h3,p,summary,a")
      .evaluateAll((nodes) =>
        nodes
          .filter(
            (node) =>
              node.getClientRects().length &&
              node.scrollWidth > node.clientWidth + 1,
          )
          .map((node) => node.textContent),
      ),
  ).toEqual([]);
}

test("six closed questions follow Success Stories and precede Story across responsive layouts", async ({
  page,
}, info) => {
  await ready(page);
  expect(
    await section(page).evaluate(
      (node) =>
        node.previousElementSibling?.hasAttribute(
          "data-home-success-stories",
        ) &&
        node.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-story-title",
    ),
  ).toBe(true);
  await expect(rows(page)).toHaveCount(6);
  await expect(section(page).locator("details[open]")).toHaveCount(0);
  await expect(section(page).locator("summary .faq-question-text")).toHaveText(
    homeFaqItems.map((item) => item.question),
  );
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.mouse.move(0, 0);
    await rows(page).nth(3).locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(rows(page).nth(3)).toHaveAttribute("open", "");
    const geometry = await rows(page)
      .nth(3)
      .evaluate((row) => ({
        question: row
          .querySelector(".faq-question-text")!
          .getBoundingClientRect()
          .toJSON(),
        answer: row
          .querySelector(".faq-answer p")!
          .getBoundingClientRect()
          .toJSON(),
      }));
    if (width >= 1024) {
      expect(geometry.answer.left).toBeGreaterThan(geometry.question.right);
      expect(
        Math.abs(geometry.answer.top - geometry.question.top),
      ).toBeLessThan(2);
    } else
      expect(geometry.answer.top).toBeGreaterThanOrEqual(
        geometry.question.bottom,
      );
    await fits(page);
    await section(page).screenshot({
      path: info.outputPath(`faq-${width}.png`),
    });
    await page.keyboard.press("Escape");
  }
});

test("mouse previews close on exit, clicks persist, another row replaces and Escape dismisses", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "Fine-pointer hover is desktop only; touch has a dedicated case.",
  );
  await ready(page);
  const first = rows(page).nth(0),
    second = rows(page).nth(1);
  await first.locator(".faq-question-text").hover();
  await expect(first).toHaveAttribute("open", "");
  await first.locator(".faq-answer").hover();
  await expect(first).toHaveAttribute("open", "");
  await section(page).locator("h2").hover();
  await expect(first).not.toHaveAttribute("open");
  await first.locator(".faq-question-text").click();
  await section(page).locator("h2").hover();
  await expect(first).toHaveAttribute("open", "");
  await second.locator(".faq-question-text").hover();
  await expect(first).not.toHaveAttribute("open");
  await expect(second).toHaveAttribute("open", "");
  await second.locator(".faq-question-text").click();
  await second.locator("summary").press("Escape");
  await expect(second).not.toHaveAttribute("open");
});

test("keyboard and touch toggle one answer with visible focus and a working Contact action", async ({
  page,
}, info) => {
  await ready(page);
  const first = rows(page).nth(0).locator("summary"),
    second = rows(page).nth(1).locator("summary");
  if (info.project.name === "mobile") {
    await first.tap();
    await expect(rows(page).nth(0)).toHaveAttribute("open", "");
    await second.tap();
  } else {
    await first.focus();
    await expect(first).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(rows(page).nth(0)).toHaveAttribute("open", "");
    await page.keyboard.press("Tab");
    await expect(second).toBeFocused();
    await page.keyboard.press("Space");
  }
  await expect(rows(page).nth(0)).not.toHaveAttribute("open");
  await expect(rows(page).nth(1)).toHaveAttribute("open", "");
  await second.press("Enter");
  await expect(rows(page).nth(1)).not.toHaveAttribute("open");
  await section(page).getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.goBack();
  await expect(
    section(page).getByRole("heading", { name: homeFaq.heading }),
  ).toBeVisible();
});

test("native disclosures and Contact work with JavaScript disabled", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(section(page).locator("details[open]")).toHaveCount(0);
  const first = rows(page).nth(0),
    last = rows(page).nth(5);
  await first.locator("summary").click();
  await expect(first.locator(".faq-answer")).toBeVisible();
  await last.locator("summary").click();
  await expect(last.locator(".faq-answer")).toBeVisible();
  await expect(first).not.toHaveAttribute("open");
  await fits(page);
  await section(page).getByRole("link", { name: "Contact Us" }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await context.close();
});

test("reduced motion, enlarged spaced text, missing assets and long answers remain usable", async ({
  page,
}, info) => {
  await page.route(/\.(?:woff2?|webp|png|jpg)(?:\?|$)/, (route) =>
    route.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.addStyleTag({
    content:
      "html { font-size: 200% !important } [data-home-faq] { letter-spacing: .12em; word-spacing: .16em; line-height: 1.8 }",
  });
  await rows(page).nth(5).locator("summary").focus();
  await page.keyboard.press("Enter");
  await rows(page)
    .nth(5)
    .locator(".faq-answer p")
    .evaluate((node) =>
      node.append(
        " Fixture for layout only: " + "Unbrokenfixtureword".repeat(25),
      ),
    );
  await expect(rows(page).nth(5).locator(".faq-answer")).toBeVisible();
  await fits(page);
  expect(
    parseFloat(
      await rows(page)
        .nth(5)
        .locator(".faq-answer")
        .evaluate((node) => getComputedStyle(node).animationDuration),
    ),
  ).toBeLessThanOrEqual(0.001);
  await section(page).screenshot({ path: info.outputPath("faq-enlarged.png") });
});

test("collapsed and expanded states pass automated accessibility checks", async ({
  page,
}) => {
  await ready(page);
  for (const expanded of [false, true]) {
    if (expanded) {
      await rows(page).nth(0).locator("summary").focus();
      await page.keyboard.press("Enter");
    }
    expect(
      (
        await new AxeBuilder({ page })
          .include("[data-home-faq]")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
});
