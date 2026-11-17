import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const shop = (page: Page) => page.locator("[data-products-page]");
const cards = (page: Page) => shop(page).locator("[data-product-card]");
const quick = (page: Page) =>
  page.getByRole("dialog").filter({
    has: page.locator('[data-slot="dialog-title"]', {
      hasText: /Powder|Monohydrate|Formula|Set|Gloves|Straps|Bottle|Mat/,
    }),
  });
const widths = [320, 375, 768, 1024, 1280, 1920];

async function ready(page: Page, path = "/products/") {
  await page.goto(path);
  await expect(page.locator("[data-product-catalog]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
}
async function chooseCategory(page: Page, label: string) {
  if (
    await shop(page)
      .getByRole("button", { name: "Filters", exact: true })
      .isVisible()
  ) {
    await shop(page)
      .getByRole("button", { name: "Filters", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Filter products" });
    await dialog.getByRole("radio", { name: label, exact: true }).check();
    await dialog
      .getByRole("button", { name: "Show products", exact: true })
      .click();
  } else
    await shop(page)
      .getByRole("complementary", { name: "Product filters" })
      .getByRole("radio", { name: label, exact: true })
      .check();
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await shop(page)
      .locator("h1,h2,h3:not(.sr-only),p,a,button,label:not(.sr-only)")
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

test("reference listing keeps the shared shell, sample disclosure and responsive media/card grid", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  await ready(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your Goals. Your Gear. Your Journey.",
  );
  await expect(shop(page).getByRole("note")).toHaveText(
    "Product listing preview. These are illustrative products; availability, prices and options are not confirmed.",
  );
  await expect(cards(page)).toHaveCount(9);
  await expect(shop(page).getByRole("status")).toHaveText(
    "Showing 1–9 of 10 products",
  );
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(shop(page).locator("img")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await shop(page)
      .getByRole("heading", { name: "Shop All Products" })
      .scrollIntoViewIfNeeded();
    await fits(page);
    const columns = await shop(page)
      .locator(".product-grid")
      .evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(width >= 1024 ? 3 : width >= 640 ? 2 : 1);
    await page.screenshot({
      path: info.outputPath(`products-${width}.png`),
      fullPage: true,
    });
  }
  const violations = (await new AxeBuilder({ page }).analyze()).violations;
  expect(violations).toEqual([]);
});

test("search, categories, sorting and history restore matching results without server requests", async ({
  page,
}) => {
  test.setTimeout(120000);
  await ready(page);
  await chooseCategory(page, "Supplements");
  await expect(cards(page)).toHaveCount(4);
  await expect(page).toHaveURL(/category=sports-nutrition/);
  await shop(page)
    .getByRole("searchbox", { name: "Search products" })
    .fill("protein");
  await shop(page).getByRole("button", { name: "Search", exact: true }).click();
  await expect(cards(page)).toHaveCount(2);
  await shop(page)
    .getByRole("combobox", { name: "Sort products" })
    .selectOption("name-asc");
  await expect(cards(page).first().locator("h3")).toHaveText(
    "Mass Gainer Powder",
  );
  await page.reload();
  await expect(cards(page)).toHaveCount(2);
  await expect(cards(page).first().locator("h3")).toHaveText(
    "Mass Gainer Powder",
  );
  await chooseCategory(page, "Apparel");
  await expect(
    shop(page).getByRole("heading", { name: "No matching products" }),
  ).toBeVisible();
  await shop(page)
    .getByRole("button", { name: "Clear all filters", exact: true })
    .click();
  await expect(page).toHaveURL(/\/products\/$/);
  await expect(cards(page)).toHaveCount(9);
  await page.goBack();
  await expect(cards(page)).toHaveCount(0);
  await expect(shop(page).getByRole("searchbox")).toHaveValue("protein");
  await page.goForward();
  await expect(cards(page)).toHaveCount(9);
});

test("Load more reveals the final example and keeps focus when its button disappears", async ({
  page,
}) => {
  await ready(page);
  await shop(page)
    .getByRole("button", { name: "Load more", exact: true })
    .press("Enter");
  await expect(cards(page)).toHaveCount(10);
  await expect(
    shop(page).getByRole("button", {
      name: "Quick view Exercise Training Mat",
      exact: true,
    }),
  ).toBeFocused();
  await expect(shop(page).getByRole("status")).toHaveText(
    "Showing 1–10 of 10 products",
  );
  await expect(
    shop(page).getByRole("button", { name: "Load more", exact: true }),
  ).toHaveCount(0);
  await chooseCategory(page, "Equipment");
  await expect(cards(page)).toHaveCount(2);
});

test("homepage actions reach all products or the matching category and legacy Supplements remains usable", async ({
  page,
}) => {
  await page.goto("/");
  const home = page.locator("[data-home-product-categories]");
  await home
    .getByRole("link", { name: "View All Product", exact: true })
    .click();
  await expect(page).toHaveURL(/\/products\/$/);
  await expect(cards(page)).toHaveCount(9);
  await page.goBack();
  await home
    .getByRole("link", { name: "Explore Equipment", exact: true })
    .click();
  await expect(page).toHaveURL(/category=training-equipment/);
  await expect(cards(page)).toHaveCount(2);
  await ready(page, "/supplements/");
  await expect(cards(page)).toHaveCount(4);
  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) {
    await menu.press("Enter");
    await expect(
      page
        .getByRole("dialog")
        .getByRole("link", { name: "Products", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await page.keyboard.press("Escape");
  } else {
    await header
      .getByRole("button", { name: "Explore", exact: true })
      .press("Enter");
    await expect(
      header.getByRole("link", { name: "Products", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await page.keyboard.press("Escape");
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/products\/$/,
  );
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Products", exact: true }),
  ).toHaveAttribute("href", "/products/");
  await chooseCategory(page, "All Products");
  await expect(page).toHaveURL(/\/products\/$/);
  await expect(cards(page)).toHaveCount(9);
  expect(
    (await page.request.get("/supplements/content-preview/")).status(),
  ).toBe(200);
});

test("hover intent cancels on exit and scroll, opens only once, and touch uses explicit quick view", async ({
  page,
}, info) => {
  await ready(page);
  const first = cards(page).first();
  const trigger = first.getByRole("button", {
    name: "Quick view Whey Protein Powder",
  });
  await first.scrollIntoViewIfNeeded();
  if (info.project.name === "desktop") {
    await page.clock.install();
    await first.locator(".product-media").hover();
    await page.clock.runFor(200);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.mouse.move(1, 1);
    await page.clock.runFor(600);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await first.locator(".product-media").hover();
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await page.clock.runFor(600);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.mouse.move(1, 1);
    await first.locator(".product-media").hover();
    await page.clock.runFor(450);
    await expect(quick(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await page.clock.runFor(800);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.mouse.move(1, 1);
    await first.locator(".product-media").hover();
    await page.clock.runFor(450);
    await expect(quick(page)).toBeVisible();
  } else {
    await first.locator(".product-media").tap();
    await expect(page).toHaveURL(/\/products\/whey-protein-powder\/$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goBack();
    await expect(page.locator("[data-product-catalog]")).toHaveAttribute(
      "data-ready",
      "true",
    );
    await trigger.tap();
    await expect(quick(page)).toBeVisible();
  }
  await page.mouse.click(1, 1);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("keyboard quick view traps focus, exposes honest product information and restores its origin", async ({
  page,
}, info) => {
  await ready(page);
  const trigger = cards(page)
    .first()
    .getByRole("button", { name: "Quick view Whey Protein Powder" });
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Whey Protein Powder" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("Price to be confirmed", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText("Options to be confirmed", { exact: true }),
  ).toBeVisible();
  await expect(dialog.getByRole("note")).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "Ask about this product" }),
  ).toHaveAttribute("href", "/contact/");
  await expect(
    dialog.getByRole("link", { name: "Call the gym" }),
  ).toHaveAttribute("href", "tel:+8801323275695");
  await expect(dialog.locator("img,input,select")).toHaveCount(0);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((node) => node.contains(document.activeElement)),
    ).toBe(true);
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await dialog.screenshot({ path: info.outputPath("product-quick-view.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await cards(page)
    .first()
    .getByRole("button", {
      name: "Quick view Whey Protein Powder",
      exact: true,
    })
    .press("Enter");
  await dialog
    .getByRole("link", { name: "Ask about this product" })
    .press("Enter");
  await expect(page).toHaveURL(/\/contact\/$/);
  await page.goBack();
  await expect(cards(page)).toHaveCount(9);
});

test("mobile filters preserve focus and dismiss safely when the desktop sidebar appears", async ({
  page,
}) => {
  await ready(page);
  await page.setViewportSize({ width: 375, height: 900 });
  const trigger = shop(page).getByRole("button", {
    name: "Filters",
    exact: true,
  });
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Filter products" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("radio", { name: "Accessories", exact: true }).check();
  await dialog
    .getByRole("button", { name: "Show products", exact: true })
    .press("Enter");
  await expect(trigger).toBeFocused();
  await expect(cards(page)).toHaveCount(4);
  await trigger.press("Enter");
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(dialog).toHaveCount(0);
  await expect(shop(page).getByRole("searchbox")).toBeFocused();
  await expect(
    shop(page)
      .getByRole("complementary", { name: "Product filters" })
      .getByRole("radio", { name: "Accessories", exact: true }),
  ).toBeChecked();
});

test("failed assets, enlarged text and reduced motion preserve cards and a scrollable quick view", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  await page.route(/\.(?:woff2|png|webp|jpe?g)(?:\?.*)?$/, (route) =>
    route.abort(),
  );
  await ready(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content:
      "html{font-size:200%} [data-products-page] p,[data-products-page] a{letter-spacing:.12em;word-spacing:.16em;line-height:1.8}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
  }
  await page.setViewportSize({ width: 375, height: 800 });
  await cards(page)
    .first()
    .getByRole("button", { name: "Quick view Whey Protein Powder" })
    .press("Enter");
  const dialog = page.getByRole("dialog", { name: "Whey Protein Powder" });
  await expect(dialog).toBeVisible();
  const box = (await dialog.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(376);
  expect(box.height).toBeLessThanOrEqual(801);
  expect(
    await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
  ).toBe(true);
  await dialog
    .getByRole("button", { name: "Close", exact: true })
    .press("Enter");
  await expect(dialog).toHaveCount(0);
  await page.screenshot({
    path: info.outputPath("products-enlarged-mobile.png"),
  });
});

test("without JavaScript all ten examples and native inquiry links remain available", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/products/`);
    await expect(cards(page)).toHaveCount(10);
    await expect(shop(page).locator("button,input,select")).toHaveCount(0);
    await expect(shop(page).getByRole("note")).toBeVisible();
    await fits(page);
    await page.screenshot({
      path: info.outputPath("products-no-js.png"),
      fullPage: true,
    });
    await shop(page)
      .getByRole("link", { name: "Ask about this product" })
      .click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await page.goto(`${baseURL}/supplements/`);
    await expect(cards(page)).toHaveCount(4);
    await shop(page)
      .getByRole("link", { name: "View All Product", exact: true })
      .click();
    await expect(cards(page)).toHaveCount(10);
  } finally {
    await context.close();
  }
});
