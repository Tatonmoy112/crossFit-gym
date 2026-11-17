import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { membershipPage } from "../../src/content/membership-page";

const root = (page: Page) => page.locator("[data-membership-page]");
const pricing = (page: Page) =>
  root(page).locator('[data-membership-section="pricing"]');
const faq = (page: Page) =>
  root(page).locator('[data-membership-section="faq"]');
async function ready(page: Page) {
  await page.goto("/membership/");
  await page.evaluate(() => document.fonts.ready);
  await expect(faq(page).locator("[data-faq-list]")).toHaveAttribute(
    "data-ready",
    "true",
  );
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await root(page)
      .locator("h1,h2,h3,p,a,summary,li")
      .evaluateAll((nodes) =>
        nodes
          .filter(
            (node) =>
              !node.closest("table") &&
              node.getClientRects().length &&
              node.scrollWidth > node.clientWidth + 1,
          )
          .map((node) => node.textContent),
      ),
  ).toEqual([]);
}

test("nine modular sections use the new split hero and equal pricing cards at responsive widths", async ({
  page,
}, info) => {
  await ready(page);
  await expect(root(page).locator("[data-membership-section]")).toHaveCount(9);
  await expect(root(page).getByRole("heading", { level: 1 })).toHaveText(
    membershipPage.hero.heading,
  );
  await expect(pricing(page).getByRole("note")).toContainText(
    "not confirmed gym offerings",
  );
  await expect(root(page).locator("[data-membership-tier] h3")).toHaveText([
    "Essential",
    "Performance",
    "Elite",
  ]);
  await expect(root(page).locator("[data-membership-price]")).toHaveText(
    Array(3).fill("Price to be confirmed"),
  );
  await expect(
    root(page).getByText("FEATURED EXAMPLE", { exact: true }),
  ).toHaveCount(1);
  await expect(root(page).getByText(/MOST POPULAR/)).toHaveCount(0);
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const geometry = await root(page).evaluate((node) => {
      const box = (selector: string) =>
        node.querySelector(selector)!.getBoundingClientRect().toJSON();
      return {
        hero: box(".membership-hero-layout header"),
        photo: box(".membership-hero-photo"),
        cards: [...node.querySelectorAll("[data-membership-tier]")].map(
          (item) => item.getBoundingClientRect().toJSON(),
        ),
      };
    });
    if (width >= 1024) {
      expect(geometry.hero.right).toBeLessThan(geometry.photo.left);
      expect(
        Math.abs(geometry.cards[0].top - geometry.cards[2].top),
      ).toBeLessThan(2);
      expect(
        Math.abs(geometry.cards[0].height - geometry.cards[2].height),
      ).toBeLessThan(2);
    } else {
      expect(geometry.hero.bottom).toBeLessThan(geometry.photo.top);
      expect(geometry.cards[0].bottom).toBeLessThan(geometry.cards[1].top);
    }
    await fits(page);
    if ([375, 1280].includes(width)) {
      await root(page).screenshot({
        path: info.outputPath(`membership-${width}.png`),
      });
      await root(page)
        .locator('[data-membership-section="comparison"]')
        .screenshot({ path: info.outputPath(`comparison-${width}.png`) });
    }
  }
});

test("native section navigation focuses its destination and plan inquiries reach Contact", async ({
  page,
}) => {
  await ready(page);
  const explore = root(page).getByRole("link", { name: "Explore Memberships" });
  await explore.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#membership-plans$/);
  await expect(page.locator("#membership-plans")).toBeFocused();
  await expect(page.locator("#membership-plans")).toHaveCSS(
    "outline-style",
    "solid",
  );
  await pricing(page)
    .getByRole("link", { name: "Ask about Performance" })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Contact", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/membership\/#membership-plans$/);
  await expect(
    pricing(page).getByRole("heading", { name: "Performance", exact: true }),
  ).toBeVisible();
  await root(page)
    .getByRole("navigation", { name: "Membership page sections" })
    .getByRole("link", { name: "Compare", exact: true })
    .click();
  await expect(page).toHaveURL(/#membership-comparison$/);
  await expect(page.locator("#membership-comparison")).toBeFocused();
  await expect(
    root(page).getByRole("link", { name: /Talk to Our Team/ }),
  ).toHaveAttribute("href", "tel:+8801323275695");
});

test("comparison preserves pending versus proposed values and scrolls from the keyboard on narrow screens", async ({
  page,
}) => {
  await ready(page);
  await page.setViewportSize({ width: 375, height: 812 });
  const region = root(page).getByRole("region", {
    name: /Membership comparison table, scroll/,
  });
  const table = region.locator("table");
  await expect(table.locator("thead th[scope=col]")).toHaveText([
    "Membership details",
    "Essential",
    "Performance",
    "Elite",
  ]);
  await expect(table.locator("tbody th[scope=row]")).toHaveCount(10);
  await expect(table.locator('[data-comparison-status="pending"]')).toHaveCount(
    15,
  );
  await expect(
    table.locator('[data-comparison-status="unspecified"]'),
  ).toHaveCount(3);
  await region.focus();
  await expect(region).toHaveCSS("outline-style", "solid");
  for (let i = 0; i < 12; i++) await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => region.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(50);
  await fits(page);
});

test("membership FAQs use the shared mouse, touch and keyboard disclosure behavior", async ({
  page,
}, info) => {
  await ready(page);
  const rows = faq(page).locator("details");
  await expect(rows).toHaveCount(6);
  await expect(faq(page).locator("details[open]")).toHaveCount(0);
  const first = rows.nth(0),
    second = rows.nth(1);
  if (info.project.name === "mobile") {
    await first.locator("summary").tap();
    await expect(first).toHaveAttribute("open", "");
    await second.locator("summary").tap();
  } else {
    await first.locator(".faq-question-text").hover();
    await expect(first).toHaveAttribute("open", "");
    await faq(page).locator("h2").hover();
    await expect(first).not.toHaveAttribute("open");
    await first.locator("summary").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(second.locator("summary")).toBeFocused();
    await page.keyboard.press("Space");
  }
  await expect(first).not.toHaveAttribute("open");
  await expect(second).toHaveAttribute("open", "");
  await second.locator("summary").press("Escape");
  await expect(second).not.toHaveAttribute("open");
});

test("all page content, fragment links and FAQ answers remain usable without JavaScript", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto("/membership/");
  await expect(root(page).locator("[data-membership-tier]")).toHaveCount(3);
  await root(page).getByRole("link", { name: "Explore Memberships" }).click();
  await expect(page).toHaveURL(/#membership-plans$/);
  await faq(page).locator("summary").nth(2).click();
  await expect(
    faq(page).locator("details").nth(2).locator(".faq-answer"),
  ).toBeVisible();
  await expect(root(page).locator("form,input,dialog")).toHaveCount(0);
  await fits(page);
  await pricing(page).getByRole("link", { name: "Ask about Elite" }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await context.close();
});

test("enlarged spaced text, long copy, failed assets and reduced motion preserve all content", async ({
  page,
}, info) => {
  await page.route(/\.(?:woff2?|webp|png|jpg)(?:\?|$)/, (route) =>
    route.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.addStyleTag({
    content:
      "html { font-size: 200% !important } [data-membership-page] { letter-spacing: .12em; word-spacing: .16em; line-height: 1.8 }",
  });
  await pricing(page)
    .locator("article p")
    .nth(4)
    .evaluate((node) =>
      node.append(
        " Fixture for layout only: " + "Unbrokenfixtureword".repeat(15),
      ),
    );
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
  }
  await pricing(page)
    .locator("article")
    .first()
    .screenshot({ path: info.outputPath("membership-enlarged-card.png") });
});

test("page and expanded FAQ pass accessibility checks and retain canonical preview metadata", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/membership\/$/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );
  await faq(page).locator("summary").first().focus();
  await page.keyboard.press("Enter");
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-membership-page]")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
