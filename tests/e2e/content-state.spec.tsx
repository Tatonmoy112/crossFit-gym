import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { loadServerComponent } from "./helpers/server-component";

const { ContentState } = loadServerComponent<
  typeof import("@/components/shared/content-state")
>("src/components/shared/content-state.tsx");
const title = "Program information is not available yet";
const description =
  "No approved program details have been supplied for this website.";
const state = (page: Page) =>
  page
    .getByRole("heading", { level: 2, name: title })
    .locator("..")
    .locator("..");

async function ready(page: Page) {
  await page.goto("/programs/");
  await page.waitForLoadState("networkidle");
}

async function fits(page: Page, selector = "main [data-slot=empty]") {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  for (const node of await page.locator(selector).all()) {
    expect(
      await node.evaluate((root) =>
        [root, ...root.querySelectorAll("*")].every((element) => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return (
            element.scrollWidth <= element.clientWidth + 1 &&
            box.left >= 0 &&
            box.right <= innerWidth + 1 &&
            !["hidden", "clip"].includes(style.overflowX) &&
            style.textOverflow !== "ellipsis"
          );
        }),
      ),
    ).toBe(true);
  }
}

test("S01-B02/B04/B05: real catalog state, keyboard recovery and preview protections", async ({
  page,
}) => {
  await ready(page);
  await expect(state(page)).toContainText(description);
  await expect(
    page.getByRole("heading", { level: 1, name: "Programs", exact: true }),
  ).toHaveCount(1);
  await expect(
    page.getByText("Page components are awaiting rebuild.", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("note", { name: "Website preview" })).toHaveCount(
    1,
  );
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/programs\/$/,
  );
  await expect(
    state(page).locator("[role], [aria-live], [tabindex], a, button, input"),
  ).toHaveCount(0);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", {
      name: "Home",
      exact: true,
    }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  const recovery = page.getByRole("link", {
    name: "Back to home",
    exact: true,
  });
  await expect(recovery).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("navigation", { name: "Page inventory" }),
  ).toBeVisible();
});

test("S01-B03: actual composition has semantic styling and reflows on all surfaces", async ({
  page,
}, info) => {
  await ready(page);
  await page.evaluate(() => document.fonts.ready);
  const root = state(page);
  await expect(root).toHaveCSS("border-radius", "12px");
  await expect(root).toHaveCSS("padding", "24px");
  await expect(root).toHaveCSS("background-color", "rgb(255, 255, 255)");
  const heading = root.getByRole("heading", { level: 2 });
  await expect(heading).toHaveCSS("font-family", /barlow/i);
  await expect(heading).toHaveCSS("font-weight", "600");
  const body = root.locator("p");
  await expect(body).toHaveCSS("font-family", /inter/i);
  await expect(body).toHaveCSS("font-size", "16px");
  await expect(body).toHaveCSS("font-weight", "400");
  await expect(body).toHaveCSS("line-height", "25.6px");
  await expect(body).toHaveCSS("color", "rgb(82, 82, 82)");
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
    const box = (await root.boundingBox())!;
    expect(box.width).toBe(
      Math.min(1152, width - (width >= 1024 ? 64 : width >= 768 ? 48 : 32)),
    );
  }
  await root.screenshot({ path: info.outputPath("content-state-desktop.png") });
  await page.setViewportSize({ width: 375, height: 812 });
  await root.screenshot({ path: info.outputPath("content-state-mobile.png") });

  const markup = renderToStaticMarkup(
    <div id="content-state-fixtures">
      {(["light", "yellow", "charcoal"] as const).map((surface) => (
        <section
          key={surface}
          data-surface={surface}
          className="p-4"
          aria-label={`${surface} state specimen`}
        >
          <ContentState
            title={`Unavailable content on ${surface}`}
            description={`Approved information is missing. ${"VeryLongContentWithoutBreaks".repeat(12)}`}
          />
        </section>
      ))}
    </div>,
  );
  await page.evaluate(
    (markup) =>
      document.querySelector("main")!.insertAdjacentHTML("beforeend", markup),
    markup,
  );
  const specimens = page.locator("#content-state-fixtures");
  for (const surface of ["light", "yellow", "charcoal"]) {
    const specimen = specimens.locator(
      `[data-surface=${surface}] [data-slot=empty]`,
    );
    await expect(specimen.getByRole("heading")).toHaveCSS(
      "color",
      surface === "charcoal" ? "rgb(255, 255, 255)" : "rgb(23, 23, 23)",
    );
    await expect(specimen.locator("p")).toHaveCSS(
      "color",
      surface === "charcoal" ? "rgb(245, 245, 245)" : "rgb(82, 82, 82)",
    );
    await expect(specimen).toHaveCSS(
      "background-color",
      surface === "charcoal"
        ? "rgb(32, 32, 32)"
        : surface === "yellow"
          ? "rgb(255, 204, 0)"
          : "rgb(255, 255, 255)",
    );
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} [data-slot=empty] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
  }
});

test("S01-B04: static state survives font failure, reduced motion and forced colors", async ({
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
  await expect(state(page)).toContainText(description);
  await expect(state(page)).toHaveCSS("forced-color-adjust", "auto");
  expect(
    await state(page).evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await page.setViewportSize({ width: 320, height: 812 });
  await fits(page);
});

test("S01-B04: explanation and recovery work without JavaScript", async ({
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
    await page.goto("/programs/");
    await expect(state(page)).toContainText(description);
    await fits(page);
    await page.getByRole("link", { name: "Back to home", exact: true }).click();
    await expect(
      page.getByRole("navigation", { name: "Page inventory" }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
