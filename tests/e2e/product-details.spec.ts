import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { previewProducts } from "../../src/content/previews/products";
import { previewProductDetails } from "../../src/content/previews/product-details";
import { buildBrowserComponent } from "./helpers/browser-component.mjs";

const master = "/products/whey-protein-powder/";
const detail = (page: Page) => page.locator("[data-product-detail]");
const widths = [320, 375, 768, 1024, 1280, 1920];
async function ready(page: Page, path = master) {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  await expect(detail(page)).toBeVisible();
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await detail(page)
      .locator("h1,h2,h3,p,dd,dt,a,summary")
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

test("Whey master composes the reference layout with brand surfaces, intrinsic panels and honest missing data", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  await ready(page);
  await expect(detail(page).getByRole("heading", { level: 1 })).toHaveText(
    "Whey Protein Powder",
  );
  await expect(detail(page).getByRole("note")).toContainText(
    "Illustrative product detail preview",
  );
  await expect(detail(page).locator(".product-specifications dd")).toHaveText(
    Array(5).fill("To be confirmed"),
  );
  await expect(detail(page).locator("[data-product-card]")).toHaveCount(3);
  await expect(detail(page).locator("img,form,input")).toHaveCount(0);
  await expect(
    detail(page).getByText(
      "Approved product reviews have not been supplied for this website.",
      { exact: true },
    ),
  ).toBeVisible();
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
    const boxes = await detail(page).evaluate((root) => {
      const box = (selector: string) =>
        root.querySelector(selector)!.getBoundingClientRect().toJSON();
      return {
        gallery: box("[data-product-gallery]"),
        summary: box(".product-detail-summary"),
        information: box(".product-detail-information"),
      };
    });
    if (width >= 1024)
      expect(boxes.gallery.right).toBeLessThan(boxes.summary.left);
    else {
      expect(boxes.gallery.bottom).toBeLessThanOrEqual(boxes.summary.top);
      expect(boxes.summary.bottom).toBeLessThanOrEqual(boxes.information.top);
    }
    await page.screenshot({
      path: info.outputPath(`detail-${width}.png`),
      fullPage: true,
    });
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("all ten products have distinct static content and protected metadata while unknown slugs return 404", async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  for (const product of previewProducts) {
    await ready(page, `/products/${product.id}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      product.name,
    );
    await expect(
      detail(page).getByRole("heading", {
        name: previewProductDetails.find(
          (item) => item.productId === product.id,
        )!.headline,
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/products/${product.id}/$`),
    );
    await expect(
      detail(page).locator('script[type="application/ld+json"]'),
    ).toHaveCount(0);
  }
  expect((await request.get("/products/not-a-product/")).status()).toBe(404);
  await page.goto("/products/content-preview/");
  await expect(page.locator("[data-product-structure-preview]")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Product details · structure preview",
  );
  await expect(page.locator("[data-product-card]")).toHaveCount(0);
});

test("listing titles, images and quick view open details while browser Back restores discovery", async ({
  page,
}) => {
  await page.goto(
    "/products/?category=sports-nutrition&q=protein&sort=name-desc",
  );
  await page
    .locator("[data-product-card]")
    .getByRole("link", { name: "Whey Protein Powder", exact: true })
    .press("Enter");
  await expect(page).toHaveURL(new RegExp(`${master}$`));
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goBack();
  await expect(
    page.getByRole("searchbox", { name: "Search products" }),
  ).toHaveValue("protein");
  await expect(page.locator("[data-product-card]")).toHaveCount(2);
  await page
    .getByRole("button", {
      name: "Quick view Whey Protein Powder",
      exact: true,
    })
    .press("Enter");
  await page
    .getByRole("dialog", { name: "Whey Protein Powder" })
    .getByRole("link", { name: "View full details", exact: true })
    .press("Enter");
  await expect(detail(page).getByRole("heading", { level: 1 })).toHaveText(
    "Whey Protein Powder",
  );
  await page.goBack();
  await page
    .locator("[data-product-card]")
    .getByRole("link", { name: /^View Whey Protein Powder\./ })
    .press("Enter");
  await expect(page).toHaveURL(new RegExp(`${master}$`));
});

test("native disclosures, category breadcrumbs, related links and confirmed inquiry actions work", async ({
  page,
}) => {
  await ready(page);
  const description = detail(page).locator("[data-product-description]");
  await description.locator("summary").press("Enter");
  await expect(description).not.toHaveAttribute("open");
  await description.locator("summary").press("Enter");
  await expect(description).toHaveAttribute("open");
  const ideal = detail(page)
    .locator("details")
    .filter({ has: page.locator("summary", { hasText: "Ideal for" }) });
  await ideal.locator("summary").press("Enter");
  await expect(ideal.locator("p")).toContainText("Gym enthusiasts");
  await expect(
    detail(page).getByRole("link", { name: "Call the gym", exact: true }),
  ).toHaveAttribute("href", "tel:+8801323275695");
  await detail(page)
    .locator(".product-related")
    .getByRole("link", { name: "Creatine Monohydrate", exact: true })
    .press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Creatine Monohydrate",
  );
  await detail(page)
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Supplements", exact: true })
    .press("Enter");
  await expect(page).toHaveURL(/category=sports-nutrition/);
  await expect(page.locator("[data-product-card]")).toHaveCount(4);
  await ready(page);
  await detail(page)
    .getByRole("link", { name: "Ask about this product", exact: true })
    .press("Enter");
  await expect(page).toHaveURL(/\/contact\/$/);
});

test("copy sharing reports successful writes and provides a selectable manual fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
  });
  await ready(page);
  await detail(page)
    .getByRole("button", { name: "Copy link", exact: true })
    .press("Enter");
  await expect(detail(page).getByRole("status")).toHaveText("Link copied.");
  await expect(
    detail(page).getByRole("button", { name: "Share", exact: true }),
  ).toHaveCount(0);
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Unavailable");
        },
      },
    }),
  );
  await detail(page)
    .getByRole("button", { name: "Copy link", exact: true })
    .press("Enter");
  await expect(
    detail(page).getByRole("textbox", { name: "Page address" }),
  ).toHaveValue(page.url());
  await detail(page)
    .getByRole("button", { name: "Select link", exact: true })
    .press("Enter");
  await expect(
    detail(page).getByRole("textbox", { name: "Page address" }),
  ).toBeFocused();
});

test("enlarged spaced text, failed photography/fonts and reduced motion retain the entire master page", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  await page.route(/\.(?:woff2|webp|png|jpe?g)(?:\?.*)?$/, (route) =>
    route.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.addStyleTag({
    content:
      "html{font-size:200%} [data-product-detail] p,[data-product-detail] a,[data-product-detail] dd{line-height:1.8;letter-spacing:.12em;word-spacing:.16em}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
  }
  await page.screenshot({
    path: info.outputPath("detail-enlarged.png"),
    fullPage: true,
  });
  expect(
    (await new AxeBuilder({ page }).include("[data-product-detail]").analyze())
      .violations,
  ).toEqual([]);
});

test("detail content, disclosures and related navigation remain usable without JavaScript", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 1000 },
  });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}${master}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Whey Protein Powder",
    );
    await expect(detail(page).locator("button,input,form")).toHaveCount(0);
    const instructions = detail(page)
      .locator("details")
      .filter({ has: page.locator("summary", { hasText: "How to Use" }) });
    await instructions.locator("summary").press("Enter");
    await expect(instructions.locator("p")).toContainText("manufacturer");
    await fits(page);
    await page.screenshot({
      path: info.outputPath("detail-no-js.png"),
      fullPage: true,
    });
    await detail(page)
      .locator(".product-related")
      .getByRole("link", { name: "Creatine Monohydrate", exact: true })
      .press("Enter");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Creatine Monohydrate",
    );
  } finally {
    await context.close();
  }
});

let galleryBundle: string;
test("the real gallery supports approved-image thumbnails, finite keys, touch and zoom in an isolated specimen", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  galleryBundle = await buildBrowserComponent(
    "tests/fixtures/product-gallery.browser.tsx",
  );
  await page.goto("/about/");
  await page.evaluate(() => {
    const root = document.createElement("div");
    root.id = "product-gallery-fixture";
    document.getElementById("main")!.append(root);
  });
  await page.addScriptTag({ content: galleryBundle });
  const gallery = page.locator("#product-gallery-fixture");
  await gallery.scrollIntoViewIfNeeded();
  await expect(
    gallery.getByRole("img", { name: "Gallery fixture image 1", exact: true }),
  ).toBeVisible();
  await gallery
    .getByRole("button", { name: "Previous product image", exact: true })
    .press("Enter");
  await expect(
    gallery.getByRole("button", {
      name: "Previous product image",
      exact: true,
    }),
  ).toHaveAttribute("aria-disabled", "true");
  await gallery
    .getByRole("button", {
      name: "View image 3 of Gallery fixture",
      exact: true,
    })
    .press("Enter");
  await expect(
    gallery.getByRole("img", { name: "Gallery fixture image 3", exact: true }),
  ).toBeVisible();
  await gallery
    .getByRole("group", { name: "Image 3 of 3", exact: true })
    .press("ArrowLeft");
  await expect(
    gallery.getByRole("img", { name: "Gallery fixture image 2", exact: true }),
  ).toBeVisible();
  if (info.project.name === "mobile") {
    const mainImage = gallery.locator(".product-gallery-main");
    await mainImage.scrollIntoViewIfNeeded();
    const box = (await mainImage.boundingBox())!;
    const y = box.y + Math.min(box.height * 0.4, 200);
    const touch = await page.context().newCDPSession(page);
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width * 0.8, y }],
    });
    for (let i = 1; i <= 10; i++)
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: box.x + box.width * (0.8 - i * 0.06), y }],
      });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touch.detach();
    await expect(
      gallery.getByRole("img", {
        name: "Gallery fixture image 3",
        exact: true,
      }),
    ).toBeVisible();
  }
  const zoom = gallery.getByRole("button", {
    name: "Zoom image of Gallery fixture",
    exact: true,
  });
  await zoom.press("Enter");
  const dialog = page.getByRole("dialog", {
    name: "Image of Gallery fixture",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(zoom).toBeFocused();
});
