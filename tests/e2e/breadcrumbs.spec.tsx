import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { loadServerComponent } from "./helpers/server-component";

const { Breadcrumbs } = loadServerComponent<
  typeof import("@/components/shared/breadcrumbs")
>("src/components/shared/breadcrumbs.tsx");
const widths = [320, 375, 768, 1280];

async function ready(page: Page) {
  await page.goto("/programs/");
  await page.waitForLoadState("networkidle");
}

async function mount(page: Page, current = "Content preview") {
  await ready(page);
  const markup = renderToStaticMarkup(
    <div id="breadcrumb-fixtures" className="p-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Programs", href: "/programs" },
          { label: current },
        ]}
      />
    </div>,
  );
  await page.evaluate(
    (markup) =>
      document.querySelector("main")!.insertAdjacentHTML("beforeend", markup),
    markup,
  );
  await page.evaluate(() => document.fonts.ready);
  return page.locator("#breadcrumb-fixtures");
}

async function fits(page: Page) {
  expect(
    await page.evaluate(() =>
      document.documentElement.scrollWidth <= innerWidth + 1
        ? []
        : [...document.body.querySelectorAll("*")]
            .filter(
              (node) => node.getBoundingClientRect().right > innerWidth + 1,
            )
            .map(
              (node) =>
                `${innerWidth}: ${node.tagName.toLowerCase()}.${node.className}`,
            ),
    ),
  ).toEqual([]);
  expect(
    await page.locator("#breadcrumb-fixtures").evaluate((root) =>
      [root, ...root.querySelectorAll("*")]
        .filter((node) => {
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          return !(
            node.scrollWidth <= node.clientWidth + 1 &&
            box.left >= 0 &&
            box.right <= innerWidth + 1 &&
            // UA styles give every <svg> overflow:hidden; icons are checked by bounds.
            (node instanceof SVGElement ||
              !["hidden", "clip"].includes(style.overflowX)) &&
            style.textOverflow !== "ellipsis"
          );
        })
        .map(
          (node) =>
            `${node.tagName.toLowerCase()}[${node.getAttribute("data-slot") ?? ""}] scroll=${node.scrollWidth} client=${node.clientWidth} right=${Math.round(node.getBoundingClientRect().right)}`,
        ),
    ),
  ).toEqual([]);
}

test("S02-A03: typography, link cue, current-page color, hidden separators and axe", async ({
  page,
}) => {
  const fixtures = await mount(page);
  const nav = fixtures.getByRole("navigation", { name: "Breadcrumb" });

  for (const name of ["Home", "Programs"]) {
    const link = nav.getByRole("link", { name, exact: true });
    await expect(link).toHaveCSS("font-family", /inter/i);
    await expect(link).toHaveCSS("font-size", "14px");
    await expect(link).toHaveCSS("color", "rgb(82, 82, 82)");
    await expect(link).toHaveCSS("text-decoration-line", "underline");
  }
  const current = nav.getByText("Content preview", { exact: true });
  await expect(current).toHaveAttribute("aria-current", "page");
  await expect(current).toHaveCSS("color", "rgb(23, 23, 23)");
  await expect(current).toHaveCSS("text-decoration-line", "none");

  const separators = nav.locator('[data-slot="breadcrumb-separator"]');
  await expect(separators).toHaveCount(2);
  await expect(separators.first().locator("svg")).toBeVisible();
  const snapshot = await nav.ariaSnapshot();
  expect(snapshot.match(/- listitem/g)).toHaveLength(3);
  expect(snapshot).not.toMatch(/presentation|img/);

  expect(
    (
      await new AxeBuilder({ page })
        .include("#breadcrumb-fixtures")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("S02-A03: long labels reflow without overflow at each width", async ({
  page,
}) => {
  await mount(page, `Content preview ${"UnbrokenBreadcrumbLabel".repeat(8)}`);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
  }
});

test("S02-A03/A04: keyboard reaches Home with the visible global focus ring", async ({
  page,
}) => {
  await ready(page);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  const home = page
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Home", exact: true });
  await expect(home).toBeFocused();
  await expect(home).toHaveCSS("outline-style", "solid");
  await expect(home).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("navigation", { name: "Page inventory" }),
  ).toBeVisible();
});

test("S02-A04: Programs integration precedes the single H1 and preserves page contracts", async ({
  page,
}) => {
  await ready(page);
  const nav = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(nav).toHaveCount(1);
  await expect(nav.getByRole("link")).toHaveCount(1);
  await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(nav.getByText("Programs", { exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    nav.locator("xpath=ancestor::div[contains(@class,'layout-container')]"),
  ).toHaveCount(1);

  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("Programs");
  expect(
    await nav.evaluate(
      (node, heading) =>
        Boolean(
          node.compareDocumentPosition(heading!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      await h1.elementHandle(),
    ),
  ).toBe(true);

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Program information is not available yet",
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/programs/i);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );

  await nav.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("S02-A04: breadcrumb renders and navigates without JavaScript", async ({
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
    await page.goto("/programs/");
    const nav = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(nav).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await nav.getByRole("link", { name: "Home" }).click();
    await expect(
      page.getByRole("navigation", { name: "Page inventory" }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
