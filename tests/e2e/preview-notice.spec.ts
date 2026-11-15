import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const note = (page: Page) =>
  page.getByRole("note", { name: "Website preview" });
async function ready(page: Page, path = "/about/") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const box = (await note(page).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(
    (await page.viewportSize())!.width,
  );
  expect(
    await note(page).evaluate((node) =>
      [node, ...node.querySelectorAll("*")].every(
        (node) => node.scrollWidth <= node.clientWidth + 1,
      ),
    ),
  ).toBe(true);
}

test("S01-A01/A02/A04: actual preview note, page order, skip behavior and indexing protections", async ({
  page,
  request,
}) => {
  for (const path of ["/", "/programs/content-preview/", "/not-a-page/"]) {
    await ready(page, path);
    await expect(note(page)).toHaveCount(1);
    expect(
      await note(page).evaluate(
        (node) =>
          node.closest("main")?.id === "main" &&
          !!(
            node.compareDocumentPosition(document.querySelector("h1")!) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
      ),
    ).toBe(true);
    await expect(note(page)).toContainText(
      "Content is incomplete and awaiting approval.",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(
      note(page).locator("a, button, [tabindex], [aria-live]"),
    ).toHaveCount(0);
  }
  await ready(page);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Back to home", exact: true }),
  ).toBeFocused();
  await page.setViewportSize({ width: 375, height: 812 });
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Menu", exact: true })
    .click();
  await expect(note(page)).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(note(page)).toHaveCount(1);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "<loc>",
  );
});

test("S01-A03: yellow semantic styling, responsive text, contrast and accessibility", async ({
  page,
}, info) => {
  await ready(page);
  await expect(note(page)).toHaveCSS("background-color", "rgb(255, 204, 0)");
  await expect(note(page)).toHaveCSS("color", "rgb(23, 23, 23)");
  await expect(note(page)).toHaveCSS("border-color", "rgb(32, 32, 32)");
  await expect(note(page)).toHaveCSS("border-radius", "8px");
  await expect(
    note(page).getByText("Website preview", { exact: true }),
  ).toHaveCSS("font-weight", "600");
  const body = note(page).locator("p");
  await expect(body).toHaveCSS("font-family", /inter/i);
  await expect(body).toHaveCSS("font-size", "16px");
  await expect(body).toHaveCSS("font-weight", "400");
  await expect(body).toHaveCSS("line-height", "25.6px");
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
    const gutter = width >= 1024 ? 32 : width >= 768 ? 24 : 16;
    expect((await note(page).boundingBox())!.width).toBe(
      Math.min(1152, width - gutter * 2),
    );
  }
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await note(page).screenshot({
    path: info.outputPath("preview-notice-desktop.png"),
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await note(page).screenshot({
    path: info.outputPath("preview-notice-mobile.png"),
  });
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} [role=note] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
  }
});

test("S01-A03: font failure and system preferences keep a readable static note", async ({
  page,
}) => {
  let blocked = 0;
  await page.route(/\.woff2(?:\?.*)?$/, (route) => {
    blocked++;
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await ready(page);
  expect(blocked).toBeGreaterThan(0);
  await expect(note(page)).toBeVisible();
  await fits(page);
  await expect(note(page)).toHaveCSS("forced-color-adjust", "auto");
  expect(
    await note(page).evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(note(page).locator('[role="alert"], [aria-live]')).toHaveCount(
    0,
  );
});

test("S01-A02/A03: preview message remains available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(note(page)).toBeVisible();
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Our story", exact: true })
      .click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(note(page)).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  } finally {
    await context.close();
  }
});
