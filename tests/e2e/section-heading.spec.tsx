import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { loadServerComponent } from "./helpers/server-component";

const { SectionHeading } = loadServerComponent<
  typeof import("@/components/shared/section-heading")
>("src/components/shared/section-heading.tsx");
const widths = [320, 375, 768, 1280, 1920];
async function ready(page: Page) {
  await page.goto("/programs/");
  await page.waitForLoadState("networkidle");
}
async function mount(page: Page) {
  await ready(page);
  const markup = renderToStaticMarkup(
    <div id="section-heading-fixtures">
      {(["light", "yellow", "charcoal"] as const).map((surface) => (
        <section
          key={surface}
          data-surface={surface}
          className="p-4"
          aria-labelledby={`heading-${surface}`}
        >
          <SectionHeading
            title={`${surface} heading specimen`}
            description="Supplied descriptive text for reviewing heading rhythm, color and readable measure."
            headingId={`heading-${surface}`}
          />
        </section>
      ))}
      <section className="p-4" aria-labelledby="heading-center">
        <SectionHeading
          title="Centered heading specimen"
          description="A centered description keeps a readable measure across wider layouts."
          headingId="heading-center"
          align="center"
        />
      </section>
      <section className="p-4" dir="rtl" aria-labelledby="heading-rtl">
        <SectionHeading
          title="RTL heading specimen"
          description="RTL alignment specimen."
          headingId="heading-rtl"
        />
      </section>
      <section className="p-4" aria-labelledby="heading-title-only">
        <SectionHeading
          title="Title-only specimen"
          headingId="heading-title-only"
        />
      </section>
    </div>,
  );
  await page.evaluate(
    (markup) =>
      document.querySelector("main")!.insertAdjacentHTML("beforeend", markup),
    markup,
  );
  await page.evaluate(() => document.fonts.ready);
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(
    await page.locator("#section-heading-fixtures").evaluate((root) =>
      [root, ...root.querySelectorAll("*")].every((node) => {
        const style = getComputedStyle(node);
        const box = node.getBoundingClientRect();
        return (
          node.scrollWidth <= node.clientWidth + 1 &&
          box.left >= 0 &&
          box.right <= innerWidth + 1 &&
          !["hidden", "clip"].includes(style.overflowX) &&
          style.textOverflow !== "ellipsis"
        );
      }),
    ),
  ).toBe(true);
}

test("S03-B01/B02/B03: actual heading forms, typography, alignment and surface composition", async ({
  page,
}, info) => {
  await mount(page);
  const fixtures = page.locator("#section-heading-fixtures");
  await expect(fixtures.getByRole("heading", { level: 2 })).toHaveCount(6);
  for (const surface of ["light", "yellow", "charcoal"]) {
    const region = fixtures.getByRole("region", {
      name: `${surface} heading specimen`,
    });
    const heading = region.getByRole("heading");
    const body = region.locator("p");
    await expect(heading).toHaveAttribute("id", `heading-${surface}`);
    await expect(heading).toHaveCSS("font-family", /barlow/i);
    await expect(heading).toHaveCSS("font-weight", "600");
    await expect(heading).toHaveCSS(
      "color",
      surface === "charcoal" ? "rgb(255, 255, 255)" : "rgb(23, 23, 23)",
    );
    await expect(body).toHaveCSS("font-family", /inter/i);
    await expect(body).toHaveCSS("font-size", "16px");
    await expect(body).toHaveCSS("font-weight", "400");
    await expect(body).toHaveCSS("line-height", "25.6px");
    await expect(body).toHaveCSS(
      "color",
      surface === "charcoal" ? "rgb(245, 245, 245)" : "rgb(82, 82, 82)",
    );
    await expect(heading.locator("..")).toHaveCSS("row-gap", "8px");
    await expect(heading.locator("..")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    const h = (await heading.boundingBox())!,
      p = (await body.boundingBox())!;
    expect(p.y - h.y - h.height).toBeCloseTo(8, 1);
    expect(h.x).toBeCloseTo(p.x, 1);
    expect(
      await body.evaluate((node) => {
        const max = getComputedStyle(node).maxInlineSize;
        const probe = document.createElement("div");
        probe.style.width = "65ch";
        node.append(probe);
        const width = probe.getBoundingClientRect().width;
        probe.remove();
        return Math.abs(parseFloat(max) - width) < 1;
      }),
    ).toBe(true);
  }
  const center = fixtures.getByRole("region", {
    name: "Centered heading specimen",
  });
  const centerBox = (await center.boundingBox())!;
  for (const node of [center.getByRole("heading"), center.locator("p")]) {
    const box = (await node.boundingBox())!;
    expect(box.x + box.width / 2).toBeCloseTo(
      centerBox.x + centerBox.width / 2,
      1,
    );
    await expect(node).toHaveCSS("text-align", "center");
  }
  const rtl = fixtures.getByRole("region", { name: "RTL heading specimen" });
  const rtlBox = (await rtl.boundingBox())!;
  for (const node of [rtl.getByRole("heading"), rtl.locator("p")]) {
    const box = (await node.boundingBox())!;
    expect(box.x + box.width).toBeCloseTo(rtlBox.x + rtlBox.width - 16, 1);
  }
  await expect(
    fixtures.getByRole("region", { name: "Title-only specimen" }).locator("p"),
  ).toHaveCount(0);
  await expect(
    fixtures.locator("[role], [aria-live], [tabindex], a, button"),
  ).toHaveCount(0);
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await fixtures.screenshot({
      path: info.outputPath(`section-heading-${width}.png`),
    });
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("S03-B03: long headings and descriptions reflow at each width and with enlarged text", async ({
  page,
}) => {
  await mount(page);
  await page
    .locator("#section-heading-fixtures h2")
    .evaluateAll((nodes) =>
      nodes.forEach(
        (node) =>
          (node.textContent += " UnbrokenHeading"
            .repeat(15)
            .replaceAll(" ", "")),
      ),
    );
  await page
    .locator("#section-heading-fixtures p")
    .evaluateAll((nodes) =>
      nodes.forEach(
        (node) => (node.textContent += "UnbrokenDescription".repeat(25)),
      ),
    );
  for (const scale of [1, 2]) {
    if (scale === 2)
      await page.addStyleTag({
        content:
          "html{font-size:200%!important} #section-heading-fixtures *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
      });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await fits(page);
      if (scale === 1) {
        const size = Math.min(48, Math.max(28, 20 + width * 0.02));
        await expect(page.locator("#heading-light")).toHaveCSS(
          "font-size",
          `${size}px`,
        );
      }
    }
  }
});

test("S03-B04: integrated heading preserves page semantics and keyboard access under failure preferences", async ({
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
  await expect(
    page.getByRole("heading", { level: 1, name: "Programs", exact: true }),
  ).toHaveCount(1);
  const heading = page.getByRole("heading", {
    level: 2,
    name: "Program information is not available yet",
  });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("text-align", "center");
  await expect(
    page.getByText(
      "No approved program details have been supplied for this website.",
    ),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.getByRole("main")).toHaveCount(1);
  expect(
    await heading.evaluate(
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

test("S03-B04: heading and recovery remain available without JavaScript", async ({
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
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Program information is not available yet",
      }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to home", exact: true }).click();
    await expect(
      page.getByRole("navigation", { name: "Page inventory" }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
