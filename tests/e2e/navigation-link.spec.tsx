import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { NavigationLink } from "./helpers/navigation-link-server";

const surfaces = ["light", "yellow", "charcoal"] as const;

function Specimens({ newTabHref }: { newTabHref: string }) {
  return (
    <>
      {surfaces.map((surface) => (
        <section
          key={surface}
          id={`links-${surface}`}
          data-surface={surface}
          className="p-4"
          aria-label={`${surface} link specimens`}
        >
          <h2 className="mb-4">{surface} navigation specimens</h2>
          <nav aria-label={`${surface} specimen navigation`}>
            <ul className="m-0 flex list-none flex-wrap gap-4 p-0">
              <li>
                <NavigationLink id={`${surface}-normal`} href="/contact/">
                  Contact specimen
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  id={`${surface}-current`}
                  href="/about/"
                  aria-current="page"
                >
                  Current specimen
                </NavigationLink>
              </li>
              <li>
                <NavigationLink
                  id={`${surface}-new-tab`}
                  href={newTabHref}
                  target="_blank"
                  rel="nofollow opener"
                >
                  New tab specimen
                </NavigationLink>
              </li>
            </ul>
          </nav>
          <NavigationLink
            id={`${surface}-long`}
            className="mt-4"
            href="/about/"
          >
            Long navigation label {"unbroken".repeat(24)}
          </NavigationLink>
        </section>
      ))}
      <section
        className="layout-container py-8"
        aria-label="Destination specimens"
      >
        <div className="flex flex-wrap gap-4">
          <NavigationLink
            id="link-query"
            href="/contact/?topic=specimen#details"
          >
            Query destination
          </NavigationLink>
          <NavigationLink id="link-fragment" href="#link-target">
            Fragment destination
          </NavigationLink>
          <NavigationLink
            id="link-external"
            href="https://example.invalid/specimen"
          >
            External destination
          </NavigationLink>
          <NavigationLink
            id="link-email"
            href="mailto:specimen@example.invalid"
          >
            Email destination
          </NavigationLink>
          <NavigationLink id="link-phone" href="tel:+12025550123">
            Phone destination
          </NavigationLink>
        </div>
        <h2 id="link-target" tabIndex={-1} className="mt-4">
          Fragment target specimen
        </h2>
      </section>
    </>
  );
}

async function mount(page: Page) {
  await page.goto("/about/");
  const newTabHref = new URL("/contact/", page.url()).href;
  await page.evaluate(
    (markup) => {
      const root = document.createElement("div");
      root.id = "navigation-link-fixtures";
      root.innerHTML = markup;
      document.body.append(root);
      root.getBoundingClientRect();
    },
    renderToStaticMarkup(<Specimens newTabHref={newTabHref} />),
  );
  await page.evaluate(() => document.fonts.ready);
}

async function expectReadable(node: Locator) {
  const colors = await node.evaluate((node) => {
    const context = Object.assign(document.createElement("canvas"), {
      width: 1,
      height: 1,
    }).getContext("2d")!;
    const rgba = (color: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    const style = getComputedStyle(node);
    return {
      color: rgba(style.color),
      background: rgba(style.backgroundColor),
      surface: rgba(
        getComputedStyle(node.closest("[data-surface]")!).backgroundColor,
      ),
      opacity: style.opacity,
    };
  });
  expect(colors.opacity).toBe("1");
  expect(colors.color[3]).toBe(255);
  expect(colors.surface[3]).toBe(255);
  const alpha = colors.background[3] / 255;
  const background = colors.background
    .slice(0, 3)
    .map((value, index) => value * alpha + colors.surface[index] * (1 - alpha));
  const luminance = (color: number[]) => {
    const [r, g, b] = color.slice(0, 3).map((channel) => {
      const c = channel / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const first = luminance(colors.color),
    second = luminance(background);
  expect(
    (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05),
  ).toBeGreaterThanOrEqual(4.5);
}

async function settle(node: Locator) {
  await node.evaluate(async (node) => {
    await Promise.allSettled(
      node.getAnimations().map((animation) => animation.finished),
    );
  });
}

async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const clipped = await page
    .locator("#navigation-link-fixtures a")
    .evaluateAll((nodes) =>
      nodes
        .filter((node) => {
          const style = getComputedStyle(node);
          return (
            node.scrollWidth > node.clientWidth + 1 ||
            ["hidden", "clip"].includes(style.overflowX) ||
            ["hidden", "clip"].includes(style.overflowY) ||
            style.textOverflow === "ellipsis"
          );
        })
        .map((node) => node.id),
    );
  expect(clipped).toEqual([]);
}

test("U01-B02: native link states use readable surface roles and current-page cues", async ({
  page,
}) => {
  await mount(page);
  const hover = await page.evaluate(() => matchMedia("(hover: hover)").matches);
  for (const surface of surfaces) {
    const link = page.locator(`#${surface}-normal`);
    const box = (await link.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
    await expect(link).toHaveCSS("font-size", "16px");
    await expect(link).toHaveCSS("font-weight", "500");
    await expect(link).toHaveCSS("line-height", "22.4px");
    await expect(link).toHaveCSS("border-top-left-radius", "8px");
    await expect(link).toHaveCSS("text-decoration-line", "underline");
    await expect(link).toHaveCSS("text-decoration-thickness", "1px");
    await expect(link).toHaveCSS("transition-duration", "0.15s");
    await expectReadable(link);
    const current = page.locator(`#${surface}-current`);
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(current).toHaveCSS("font-weight", "600");
    await expect(current).toHaveCSS("text-decoration-thickness", "2px");
    await expectReadable(current);
    await link.hover();
    if (hover) {
      await settle(link);
      await expectReadable(link);
      await expect(link).toHaveCSS("text-decoration-line", "underline");
    }
    await page.mouse.down();
    try {
      await settle(link);
      await expectReadable(link);
      await expect(link).toHaveCSS("transform", "none");
      await expect(link).toHaveCSS("translate", "none");
    } finally {
      await page.mouse.move(0, 0);
      await page.mouse.up();
    }
  }
});

test("U01-B03: fragment internal destinations and the hydrated recovery link navigate", async ({
  page,
}) => {
  await mount(page);
  await page.locator("#link-fragment").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about\/#link-target$/);
  await expect(page.locator("#link-target")).toBeFocused();
  await page.locator("#link-query").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact\/?\?topic=specimen#details$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await page.goto("/");
  const recovery = page.locator("[data-home-about]").getByRole("link", {
    name: "Discover Our Story",
    exact: true,
  });
  expect((await recovery.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(recovery).toHaveAttribute("href", "/about/");
  await recovery.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Built for Strength. Driven by Passion.",
    }),
  ).toBeVisible();
});

test("U01-B04: explicit new tabs are announced isolated and native external hrefs stay intact", async ({
  page,
}) => {
  await mount(page);
  await expect(page.locator("#link-external")).toHaveAttribute(
    "href",
    "https://example.invalid/specimen",
  );
  await expect(page.locator("#link-external")).not.toHaveAttribute("target");
  await expect(page.locator("#link-email")).toHaveAttribute(
    "href",
    "mailto:specimen@example.invalid",
  );
  await expect(page.locator("#link-phone")).toHaveAttribute(
    "href",
    "tel:+12025550123",
  );
  const link = page.locator("#light-new-tab");
  await expect(link).toHaveAccessibleName(
    "New tab specimen (opens in a new tab)",
  );
  await expect(link).toHaveText("New tab specimen (opens in a new tab)");
  const newPage = page.context().waitForEvent("page");
  await link.click();
  const opened = await newPage;
  try {
    await opened.waitForLoadState("domcontentloaded");
    await expect(opened).toHaveURL(/\/contact\/$/);
    expect(await opened.evaluate(() => window.opener === null)).toBe(true);
    await expect(opened.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  } finally {
    await opened.close();
  }
});

test("U01-B05: responsive labels keyboard focus and sampled accessibility remain usable", async ({
  page,
}, info) => {
  await mount(page);
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
    for (const surface of surfaces) {
      const normal = page.locator(`#${surface}-normal`);
      await normal.focus();
      await page.keyboard.press("Tab");
      await expect(page.locator(`#${surface}-current`)).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(normal).toBeFocused();
      await expect(normal).toHaveCSS("outline-width", "3px");
      await expect(normal).toHaveCSS("outline-offset", "3px");
      const clear = await normal.evaluate((node) => {
        const box = node.getBoundingClientRect(),
          parent = node.closest("section")!.getBoundingClientRect();
        return (
          box.left - 6 >= parent.left &&
          box.right + 6 <= parent.right &&
          box.top - 6 >= parent.top &&
          box.bottom + 6 <= parent.bottom
        );
      });
      expect(clear).toBe(true);
    }
  }
  await page.setViewportSize({
    width: info.project.name === "mobile" ? 375 : 1280,
    height: 900,
  });
  const audit = await new AxeBuilder({ page })
    .include("#navigation-link-fixtures")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.locator("#navigation-link-fixtures").evaluate((root) => {
    for (const node of root.querySelectorAll('a[id$="-long"]'))
      node.textContent =
        "Long navigation labels wrap naturally instead of being truncated";
  });
  await page
    .locator("#navigation-link-fixtures")
    .screenshot({ path: info.outputPath("navigation-link-specimens.png") });
  await page.setViewportSize({ width: 320, height: 900 });
  // Restore every full stress label before testing user text overrides.
  await page
    .locator('#navigation-link-fixtures a[id$="-long"]')
    .evaluateAll((nodes) => {
      for (const node of nodes)
        node.textContent = "Long navigation label " + "unbroken".repeat(24);
    });
  await page.addStyleTag({
    content:
      "html { font-size: 200% !important; } #navigation-link-fixtures * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } #navigation-link-fixtures p { margin-bottom: 2em !important; }",
  });
  await expect(page.locator("#light-normal")).toHaveCSS("font-size", "32px");
  expect(
    (await page.locator("#light-long").boundingBox())!.height,
  ).toBeGreaterThan(88);
  await fits(page);
});

test("U01-B06: fallback reduced motion and system focus preserve link operation", async ({
  page,
}) => {
  let blocked = 0;
  await page.route(/\.woff2(?:\?.*)?$/, (route) => {
    blocked++;
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 900 });
  await mount(page);
  expect(blocked).toBeGreaterThan(0);
  const link = page.locator("#light-normal");
  await expect(link).toHaveCSS("transition-property", "none");
  await fits(page);
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument");
    const { nodeId } = await session.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: "#light-normal",
    });
    const { fonts } = await session.send("CSS.getPlatformFontsForNode", {
      nodeId,
    });
    expect(
      fonts.some((font) => font.glyphCount > 0 && !font.isCustomFont),
    ).toBe(true);
  } finally {
    await session.detach();
  }
  await page.emulateMedia({ forcedColors: "active" });
  await link.focus();
  await expect(link).toHaveCSS("outline-width", "3px");
  await expect(link).toHaveCSS("outline-style", "solid");
  await expect(link).toHaveCSS("forced-color-adjust", "auto");
  await page.keyboard.press("Enter");
  // The isolated Next Link render may omit its build-time trailing slash.
  await expect(page).toHaveURL(/\/contact\/?$/);
});
