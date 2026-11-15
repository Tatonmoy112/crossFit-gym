import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Locator } from "@playwright/test";
import { loadServerComponent } from "./helpers/server-component";

const { Container } = loadServerComponent<
  typeof import("@/components/shared/container")
>("src/components/shared/container.tsx");
const widths = [320, 375, 767, 768, 1023, 1024, 1280, 1920];
async function ready(page: Page) {
  await page.goto("/programs/");
  await page.waitForLoadState("networkidle");
}

async function geometry(
  inner: Locator,
  parent: Locator,
  width: number,
  scale = 1,
) {
  const outer = (await parent.boundingBox())!;
  const box = (await inner.boundingBox())!;
  const gutter = (width >= 1024 ? 32 : width >= 768 ? 24 : 16) * scale;
  const expected = Math.min(1152 * scale, outer.width - 2 * gutter);
  expect(box.width).toBeCloseTo(expected, 1);
  expect(box.x).toBeCloseTo(outer.x + (outer.width - expected) / 2, 1);
  await expect(inner).toHaveCSS("padding-inline-start", "0px");
  await expect(inner).toHaveCSS("padding-inline-end", "0px");
  await expect(inner).toHaveCSS("overflow-x", "visible");
  expect(
    await inner.evaluate((node) =>
      [node, ...node.querySelectorAll("*")].every(
        (child) => child.scrollWidth <= child.clientWidth + 1,
      ),
    ),
  ).toBe(true);
}

test("S03-A02/A04: Programs owns a full-width section with one constrained inner wrapper", async ({
  page,
}, info) => {
  await ready(page);
  const section = page.locator("main > section");
  const inner = section.locator(":scope > div");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    expect((await section.boundingBox())!.width).toBe(width);
    await expect(inner).toHaveCount(1);
    await geometry(inner, section, width);
  }
  await expect(
    inner.getByRole("heading", { name: "Programs", level: 1, exact: true }),
  ).toHaveCount(1);
  await expect(
    inner.getByText(
      "No approved program details have been supplied for this website.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/programs\/$/,
  );
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await section.screenshot({
      path: info.outputPath(`container-programs-${width}.png`),
    });
  }
});

test("S03-A01/A02/A03: actual wrapper composes section surfaces, grid parents, RTL and enlarged text", async ({
  page,
}) => {
  await ready(page);
  const markup = renderToStaticMarkup(
    <div id="container-fixtures">
      {(["light", "yellow", "charcoal"] as const).map((surface) => (
        <section
          key={surface}
          data-surface={surface}
          aria-label={`${surface} container specimen`}
        >
          <Container data-container={surface} className="grid gap-4 py-4">
            <h2>{surface} specimen</h2>
            <p>{"UnbrokenContent".repeat(30)}</p>
          </Container>
        </section>
      ))}
      <section
        aria-label="Constrained parent specimen"
        dir="rtl"
        style={{
          width: "min(100%, 30rem)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
      >
        <Container data-container="narrow">
          <p>{"LongContent".repeat(25)}</p>
        </Container>
      </section>
    </div>,
  );
  await page.evaluate(
    (markup) =>
      document.querySelector("main")!.insertAdjacentHTML("beforeend", markup),
    markup,
  );
  const fixtures = page.locator("#container-fixtures");
  await expect(
    fixtures.getByText("light specimen", { exact: true }),
  ).toBeVisible();
  for (const surface of ["light", "yellow", "charcoal"]) {
    const inner = fixtures.locator(`[data-container=${surface}]`);
    await expect(inner).toHaveCSS("display", "grid");
    await expect(inner).toHaveCSS("padding-top", "16px");
    await expect(inner).toHaveCSS("row-gap", "16px");
    await expect(inner).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(inner).toHaveCSS(
      "color",
      surface === "charcoal" ? "rgb(255, 255, 255)" : "rgb(23, 23, 23)",
    );
  }
  for (const scale of [1, 2]) {
    if (scale === 2)
      await page.addStyleTag({
        content:
          "html{font-size:200%!important} #container-fixtures *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
      });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const inner of await fixtures.locator("[data-container]").all())
        await geometry(inner, inner.locator(".."), width, scale);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  }
  await expect(fixtures.locator("[data-container=narrow]")).toHaveCSS(
    "direction",
    "rtl",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("S03-A04: keyboard recovery and static content survive font and preference failures", async ({
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
  await page.setViewportSize({ width: 320, height: 812 });
  const section = page.locator("main > section");
  const inner = section.locator(":scope > div");
  await expect(inner).toHaveCount(1);
  await geometry(inner, section, 320);
  await expect(inner).toHaveCSS("forced-color-adjust", "auto");
  expect(
    await inner.evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
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
  await expect(
    page.getByRole("link", { name: "Back to home", exact: true }),
  ).toBeFocused();
});

test("S03-A04: server-rendered wrapper preserves content and navigation without JavaScript", async ({
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
    const section = page.locator("main > section");
    await geometry(section.locator(":scope > div"), section, 375);
    await expect(
      page.getByRole("heading", { level: 1, name: "Programs", exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to home", exact: true }).click();
    await expect(
      page.getByRole("navigation", { name: "Page inventory" }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
