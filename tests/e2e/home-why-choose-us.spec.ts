import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const region = (page: Page) =>
  page.getByRole("region", { name: "Why choose us", exact: true });
const widths = [320, 375, 768, 1024, 1280, 1920];

async function ready(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}

test("H01-D04/D05: real section reuses three cards directly after the counter with responsive columns and supplied copy", async ({
  page,
}, info) => {
  await ready(page);
  await expect(
    page.getByRole("region", { name: "Features and services", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.locator("[data-features-wheel], [data-feature-card]"),
  ).toHaveCount(0);
  const section = region(page);
  await expect(section).toHaveCount(1);
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "Why choose us",
  );
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "Certified Training Team",
    "Your Gym in Uttara",
    "Start With a Conversation",
  ]);
  await expect(
    section.getByText(
      "Train at Crossfit Gym, home to a team of 30+ certified trainers.",
    ),
  ).toBeVisible();
  await expect(
    section.getByText(
      "Have questions before your first visit? Call 01323-275695 to speak directly with the Crossfit Gym team.",
    ),
  ).toBeVisible();
  await expect(
    section.getByText(
      "Make training part of your routine. Visit us at House 2, Road 2/A, Sector 12, Sonargoan Janapat Road, Uttara, Dhaka, Bangladesh, 1230.",
    ),
  ).toBeVisible();
  expect(
    await section.evaluate(
      (node) =>
        node.previousElementSibling?.querySelector(
          "[data-home-stats-preview]",
        ) !== null &&
        node.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-services-title",
    ),
  ).toBe(true);
  const grid = section.locator("[data-why-grid]");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    const columns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
    expect(
      await grid.evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
      ),
    ).toBe(columns);
    await expect(grid).toHaveCSS("column-gap", "24px");
    await expect(grid).toHaveCSS("row-gap", "24px");
    await expect(section).toHaveCSS(
      "padding-top",
      width >= 768 ? "64px" : "48px",
    );
    await expect(section).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const tops = await section
      .getByRole("article")
      .evaluateAll((nodes) =>
        nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
      );
    expect(new Set(tops).size).toBe(Math.ceil(3 / columns));
    expect(
      await section.evaluate((root) =>
        [root, ...root.querySelectorAll("li,h2,h3,p")].every((node) => {
          const box = node.getBoundingClientRect();
          return (
            node.scrollWidth <= node.clientWidth + 1 &&
            box.left >= 0 &&
            box.right <= innerWidth + 1
          );
        }),
      ),
    ).toBe(true);
  }
  await page.setViewportSize({
    width: info.project.name === "mobile" ? 375 : 1280,
    height: 1000,
  });
  await section.scrollIntoViewIfNeeded();
  for (const image of await section.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("naturalWidth", 1672);
  }
  await expect(section.locator("img").nth(0)).toHaveCSS(
    "object-position",
    "0% 50%",
  );
  await expect(section.locator("img").nth(1)).toHaveCSS(
    "object-position",
    "50% 50%",
  );
  await expect(section.locator("img").nth(2)).toHaveCSS(
    "object-position",
    "100% 50%",
  );
  await section.screenshot({
    path: info.outputPath(`why-choose-us-${info.project.name}.png`),
  });
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/$/,
  );
});

test("H01-D05: complete page accessibility and native keyboard order remain intact", async ({
  page,
}) => {
  await ready(page);
  await expect(
    region(page).locator("a,button,[tabindex],[aria-live]"),
  ).toHaveCount(0);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("region", {
        name: "One step closer. Crossfit Gym",
        exact: true,
      })
      .getByRole("link", { name: "Start your journey" }),
  ).toBeFocused();
});

test("H01-D05: enlarged text and failed photos/fonts keep all content readable", async ({
  page,
}) => {
  await page.route(/home-hero\.webp|\.woff2(?:\?|$)/, (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  const section = region(page);
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} #home-why-choose-us-title, [data-why-card] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    expect(
      await section.evaluate((root) =>
        [root, ...root.querySelectorAll("li,h2,h3,p")].every((node) => {
          const box = node.getBoundingClientRect();
          return (
            node.scrollWidth <= node.clientWidth + 1 &&
            box.left >= 0 &&
            box.right <= innerWidth + 1
          );
        }),
      ),
    ).toBe(true);
    for (const article of await section.getByRole("article").all()) {
      const outer = (await article.boundingBox())!;
      for (const text of [article.locator("h3"), article.locator("p")]) {
        const box = (await text.boundingBox())!;
        expect(box.y + box.height).toBeLessThanOrEqual(outer.y + outer.height);
      }
    }
  }
  await page.emulateMedia({ forcedColors: "active" });
  await expect(section.getByRole("heading", { level: 3 })).toHaveCount(3);
  await expect(
    section.getByText(
      "Train at Crossfit Gym, home to a team of 30+ certified trainers.",
    ),
  ).toBeVisible();
});

test("H01-D05: real server section works with JavaScript disabled", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(
      page.getByRole("region", { name: "Features and services", exact: true }),
    ).toHaveCount(0);
    expect(
      await region(page).evaluate((node) =>
        node.nextElementSibling?.getAttribute("aria-labelledby"),
      ),
    ).toBe("home-services-title");
    await expect(region(page).getByRole("article")).toHaveCount(3);
    await expect(
      region(page).getByText(
        "Train at Crossfit Gym, home to a team of 30+ certified trainers.",
      ),
    ).toBeVisible();
    await expect(
      region(page).getByText(
        "Have questions before your first visit? Call 01323-275695 to speak directly with the Crossfit Gym team.",
      ),
    ).toBeVisible();
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Our story", exact: true })
      .click();
    await expect(page).toHaveURL(/\/about\/$/);
  } finally {
    await context.close();
  }
});
