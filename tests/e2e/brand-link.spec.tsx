import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Locator } from "@playwright/test";
import { loadServerComponent } from "./helpers/server-component";

const { BrandLink } = loadServerComponent<
  typeof import("@/components/layout/brand-link")
>("src/components/layout/brand-link.tsx");
const surfaces = ["light", "yellow", "charcoal"] as const;

async function mount(page: Page) {
  await page.goto("/about/");
  const markup = renderToStaticMarkup(
    <div id="brand-link-fixtures">
      {surfaces.map((surface) => (
        <section
          key={surface}
          data-surface={surface}
          className="p-4"
          aria-label={`${surface} brand specimen`}
        >
          <h2>{surface} brand specimen</h2>
          <BrandLink className="mt-4" />
        </section>
      ))}
    </div>,
  );
  await page.evaluate((markup) => {
    document.body.insertAdjacentHTML("beforeend", markup);
  }, markup);
  await page.evaluate(() => document.fonts.ready);
}

function brand(page: Page, surface = "light") {
  return page
    .locator(`#brand-link-fixtures [data-surface="${surface}"]`)
    .getByRole("link");
}

async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  for (const link of await page.locator("#brand-link-fixtures a").all()) {
    const metrics = await link.evaluate((node) => {
      const style = getComputedStyle(node);
      const range = document.createRange();
      const label = node.querySelector("[data-brand-name]")!;
      range.selectNodeContents(label);
      const text = range.getBoundingClientRect(),
        box = node.getBoundingClientRect();
      return {
        fits:
          node.scrollWidth <= node.clientWidth + 1 &&
          text.left >= box.left &&
          text.right <= box.right + 1,
        overflow: [style.overflowX, style.overflowY],
        ellipsis: style.textOverflow,
      };
    });
    expect(metrics.fits).toBe(true);
    expect(metrics.overflow).not.toContain("hidden");
    expect(metrics.overflow).not.toContain("clip");
    expect(metrics.ellipsis).not.toBe("ellipsis");
  }
}

async function readable(link: Locator) {
  const paints = await link.evaluate((node) => {
    const style = getComputedStyle(node),
      surface = getComputedStyle(node.closest("section")!);
    const rgb = (value: string) => {
      const context = document.createElement("canvas").getContext("2d")!;
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    return {
      foreground: rgb(style.color),
      background: rgb(style.backgroundColor),
      surface: rgb(surface.backgroundColor),
    };
  });
  const luminance = (values: number[]) => {
    const [r, g, b] = values.slice(0, 3).map((c) => {
      const v = c / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const alpha = paints.background[3] / 255;
  const background = paints.background
    .slice(0, 3)
    .map((v, i) => v * alpha + paints.surface[i] * (1 - alpha));
  const a = luminance(paints.foreground),
    b = luminance(background);
  expect(
    (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
  ).toBeGreaterThanOrEqual(4.5);
}

async function settle(link: Locator) {
  await link.evaluate(async (node) => {
    await Promise.allSettled(node.getAnimations().map((a) => a.finished));
  });
}

test("L01-A01/A02: identity navigates Home and delivers a small local mark with preserved provenance", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await mount(page);
  const link = brand(page);
  await expect(link).toHaveAccessibleName("Crossfit Gym home");
  await expect(link).toHaveAttribute("href", "/");
  await expect(link).not.toHaveAttribute("target");
  const image = link.locator("img");
  await expect(image).toHaveAttribute("alt", "");
  await expect(image).toHaveAttribute("src", "/images/brand/brand-mark.webp");
  expect(
    await image.evaluate(async (node: HTMLImageElement) => {
      await node.decode();
      return [node.naturalWidth, node.naturalHeight];
    }),
  ).toEqual([192, 192]);
  const response = await page.request.get("/images/brand/brand-mark.webp");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/webp");
  const bytes = await response.body();
  expect(bytes.length).toBeLessThanOrEqual(20 * 1024);
  expect(
    bytes.equals(readFileSync("public/images/brand/brand-mark.webp")),
  ).toBe(true);
  const manifest = JSON.parse(
    readFileSync("public/images/brand/brand-mark-source.json", "utf8"),
  );
  for (const record of [manifest.source, manifest.output]) {
    expect(
      createHash("sha256").update(readFileSync(record.path)).digest("hex"),
    ).toBe(record.sha256);
    expect(statSync(record.path).size).toBe(record.bytes);
  }
  expect(manifest.source.path).toBe("public/images/brand/logo_with-bg.png");
  expect(manifest.output.width).toBe(192);
  expect(manifest.output.height).toBe(192);
  expect(
    requests.every((url) => new URL(url).origin === new URL(page.url()).origin),
  ).toBe(true);
  expect(requests.some((url) => url.includes("/_next/image"))).toBe(false);
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("navigation", { name: "Page inventory" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("L01-A03: surface states target geometry and keyboard focus remain readable", async ({
  page,
}, info) => {
  await mount(page);
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    // Name-based lookup also catches a missing identity before geometry checks.
    await expect(brand(page)).toHaveAccessibleName("Crossfit Gym home");
    await fits(page);
  }
  await page.setViewportSize({
    width: info.project.name === "mobile" ? 375 : 1280,
    height: 900,
  });
  for (const surface of surfaces) {
    const link = brand(page, surface);
    await expect(link).toHaveCSS("font-size", "16px");
    await expect(link).toHaveCSS("font-family", /inter/i);
    await expect(link).toHaveCSS("font-weight", "600");
    await expect(link).toHaveCSS("line-height", "22.4px");
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await expect(link).toHaveCSS("border-radius", "8px");
    await expect(link).toHaveCSS("transition-duration", "0.15s");
    const image = link.locator("img");
    await expect(image).toHaveCSS("object-fit", "contain");
    const box = (await link.boundingBox())!,
      imageBox = (await image.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(60);
    expect(imageBox.width).toBe(44);
    expect(imageBox.height).toBe(44);
    await readable(link);
    if (await page.evaluate(() => matchMedia("(hover: hover)").matches)) {
      await link.hover();
      await settle(link);
      await expect(link).toHaveCSS(
        "background-color",
        surface === "charcoal" ? "rgb(23, 23, 23)" : "rgb(245, 245, 245)",
      );
      await readable(link);
    }
    await link.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-width", "3px");
    await expect(link).toHaveCSS("outline-offset", "3px");
    await link.scrollIntoViewIfNeeded();
    const focused = (await link.boundingBox())!,
      parent = (await link.locator("..").boundingBox())!;
    expect(focused.x - 6).toBeGreaterThanOrEqual(parent.x);
    expect(focused.x + focused.width + 6).toBeLessThanOrEqual(
      parent.x + parent.width,
    );
    expect(focused.y - 6).toBeGreaterThanOrEqual(parent.y);
    expect(focused.y + focused.height + 6).toBeLessThanOrEqual(
      parent.y + parent.height,
    );
    await page.mouse.move(
      focused.x + focused.width / 2,
      focused.y + focused.height / 2,
    );
    await page.mouse.down();
    await settle(link);
    await expect(link).toHaveCSS(
      "background-color",
      surface === "charcoal" ? "rgb(23, 23, 23)" : "rgb(245, 245, 245)",
    );
    await readable(link);
    expect(await link.boundingBox()).toEqual(focused);
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
  const axe = await new AxeBuilder({ page })
    .include("#brand-link-fixtures")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page
    .locator("#brand-link-fixtures")
    .screenshot({ path: info.outputPath("brand-link-specimens.png") });
});

test("L01-A04: reflow image and font failures and user preferences preserve identity", async ({
  page,
}) => {
  let blockedImages = 0,
    blockedFonts = 0;
  await page.route("**/brand-mark.webp", (route) => {
    blockedImages++;
    return route.abort();
  });
  await page.route(/\.woff2(?:\?.*)?$/, (route) => {
    blockedFonts++;
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mount(page);
  const link = brand(page);
  await expect(link).toHaveAccessibleName("Crossfit Gym home");
  await expect(link.locator("[data-brand-name]")).toBeVisible();
  await expect(link).toHaveCSS("transition-property", "none");
  expect(blockedImages).toBeGreaterThan(0);
  expect(blockedFonts).toBeGreaterThan(0);
  await expect
    .poll(() =>
      link
        .locator("img")
        .evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth === 0,
        ),
    )
    .toBe(true);
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument");
    const { nodeId } = await session.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: '#brand-link-fixtures [data-surface="light"] [data-brand-name]',
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
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await fits(page);
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({
    content:
      "html {font-size:200% !important} #brand-link-fixtures * {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important}",
  });
  await expect(link).toHaveCSS("font-size", "32px");
  await fits(page);
  await page.emulateMedia({ forcedColors: "active" });
  await link.focus();
  await expect(link).toHaveCSS("outline-width", "3px");
  await expect(link).toHaveCSS("forced-color-adjust", "auto");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
});
