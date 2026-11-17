import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { loadServerComponent } from "./helpers/server-component";

const { HomeStory } = loadServerComponent<
  typeof import("@/features/home/home-story")
>("src/features/home/home-story.tsx");
const { homeStory } = loadServerComponent<typeof import("@/content/home")>(
  "src/content/home.ts",
);
const widths = [320, 375, 768, 1280, 1920];
const missingTitle = "Our story has not been supplied yet";
const axe = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

async function ready(page: Page, path = "/") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}

async function overflow(page: Page) {
  return page.evaluate(() =>
    document.documentElement.scrollWidth <= innerWidth + 1
      ? []
      : [...document.body.querySelectorAll("*")]
          .filter((node) => node.getBoundingClientRect().right > innerWidth + 1)
          .map((node) => `${innerWidth}: ${node.tagName}.${node.className}`),
  );
}

// Fictitious fixture text injected into another page; never part of the site.
async function mountFixture(page: Page) {
  await ready(page, "/programs/");
  const markup = renderToStaticMarkup(
    <div id="story-fixture">
      <HomeStory
        content={{
          ...homeStory,
          story: `Fixture paragraph one is long enough to show the reading measure across wide layouts without implying any real history of the gym.\n\nFixture paragraph two ${"Unbrokenfixtureword".repeat(12)}.`,
        }}
      />
    </div>,
  );
  await page.evaluate(
    (markup) =>
      document.querySelector("main")!.insertAdjacentHTML("beforeend", markup),
    markup,
  );
  return page.locator("#story-fixture");
}

test("H01-B01/B05: Home shows the missing story state after the counter and Why choose us", async ({
  page,
}) => {
  await ready(page);
  const story = page.getByRole("region", { name: missingTitle });
  await expect(story).toBeVisible();
  await expect(
    story.getByText(
      "Approved story text for Crossfit Gym has not been provided for this website.",
    ),
  ).toBeVisible();
  await expect(story.getByRole("link")).toHaveCount(0);

  expect(
    await page.evaluate(() => {
      const hero = document.querySelector(
        '[aria-labelledby="home-hero-title"]',
      )!;
      const story = document.querySelector(
        '[aria-labelledby="home-story-title"]',
      )!;
      const inventory = document.querySelector(
        'nav[aria-label="Page inventory"]',
      )!;
      const counter = document.querySelector("[data-home-stats-preview]")!;
      const why = document.querySelector(
        '[aria-labelledby="home-why-choose-us-title"]',
      )!;
      return (
        hero.contains(counter) &&
        hero.nextElementSibling === why &&
        why.nextElementSibling?.getAttribute("aria-labelledby") ===
          "home-services-title" &&
        why.nextElementSibling.nextElementSibling?.getAttribute(
          "aria-labelledby",
        ) === "home-features-title" &&
        why.nextElementSibling.nextElementSibling.nextElementSibling?.getAttribute(
          "aria-labelledby",
        ) === "home-memberships-title" &&
        why.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling?.getAttribute(
          "aria-labelledby",
        ) === "home-success-stories-title" &&
        story.previousElementSibling?.hasAttribute(
          "data-home-success-stories",
        ) &&
        Boolean(
          story.compareDocumentPosition(inventory) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        )
      );
    }),
  ).toBe(true);

  const heading = story.getByRole("heading", { level: 2 });
  await expect(heading).toHaveCSS("font-family", /barlow/i);
  await expect(heading).toHaveCSS("color", "rgb(23, 23, 23)");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  expect(
    await story.evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  expect((await axe(page)).violations).toEqual([]);
});

test("H01-B05: missing story reflows at each width", async ({ page }) => {
  await ready(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    expect(await overflow(page)).toEqual([]);
  }
});

test("H01-B05: missing story is present without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(
      page.getByRole("region", { name: missingTitle }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("H01-B06: supplied-story fixture keeps the reading measure, reflows and links to About", async ({
  page,
}) => {
  const fixture = await mountFixture(page);
  const region = fixture.getByRole("region", { name: "Our story" });
  await expect(region).toBeVisible();
  const paragraphs = region.locator("[data-story-paragraph]");
  await expect(paragraphs).toHaveCount(2);
  expect(
    await paragraphs.first().evaluate((node) => {
      const probe = document.createElement("div");
      probe.style.width = "65ch";
      node.append(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return (
        Math.abs(parseFloat(getComputedStyle(node).maxInlineSize) - width) < 1
      );
    }),
  ).toBe(true);

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    expect(await overflow(page)).toEqual([]);
  }
  expect((await axe(page)).violations).toEqual([]);

  const link = region.getByRole("link", { name: "More about Crossfit Gym" });
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
  await expect(link).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter");
  // Static markup outside the app keeps "/about"; the export serves it directly.
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "About" }),
  ).toBeVisible();
});
