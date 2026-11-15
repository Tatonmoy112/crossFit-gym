import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { Button } from "@/components/ui/button";

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;
const sizes = [
  "default",
  "xs",
  "sm",
  "lg",
  "icon",
  "icon-xs",
  "icon-sm",
  "icon-lg",
] as const;
const surfaces = ["light", "yellow", "charcoal"] as const;

function Icon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M5 12h14M12 5v14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function Specimens() {
  return (
    <>
      {surfaces.map((surface) => (
        <section
          key={surface}
          id={`button-${surface}`}
          data-surface={surface}
          className="p-4"
          aria-label={`${surface} button specimens`}
        >
          <h2>{surface} action specimens</h2>
          <div className="flex flex-wrap items-start gap-4">
            {variants.map((variant) => (
              <Button
                key={variant}
                id={`${surface}-${variant}`}
                variant={variant}
              >
                {variant} action
              </Button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-start gap-4">
            {variants.map((variant) => (
              <Button
                key={variant}
                id={`${surface}-${variant}-disabled`}
                variant={variant}
                disabled
              >
                Unavailable {variant}
              </Button>
            ))}
          </div>
          <Button
            id={`${surface}-icon`}
            size="icon"
            aria-label={`${surface} icon action`}
            className="mt-4"
          >
            <Icon />
          </Button>
        </section>
      ))}
      <section
        id="button-sizes"
        className="layout-container py-8"
        aria-label="Button size specimens"
      >
        <h2>Size specimens</h2>
        <div className="flex flex-wrap items-start gap-4">
          {sizes.map((size) => (
            <Button
              key={size}
              id={`button-size-${size}`}
              size={size}
              aria-label={`${size} size specimen`}
            >
              {size.startsWith("icon") ? <Icon /> : `${size} size`}
            </Button>
          ))}
        </div>
        <Button id="button-long" className="mt-4">
          Long action label {"unbroken".repeat(30)}
        </Button>
      </section>
      <section
        className="layout-container py-8"
        aria-label="Native button form specimen"
      >
        <form
          id="button-form"
          className="flex flex-wrap items-start gap-4"
          data-actions="0"
          data-submits="0"
          data-resets="0"
        >
          <Button id="button-action">Native action specimen</Button>
          <Button id="button-disabled" disabled>
            Unavailable action specimen
          </Button>
          <Button id="button-submit" type="submit">
            Submit specimen
          </Button>
          <Button id="button-reset" type="reset">
            Reset specimen
          </Button>
          <label className="min-w-0 w-full">
            Specimen value
            <input
              className="min-w-0 w-full"
              name="specimen"
              defaultValue="Initial specimen"
            />
          </label>
        </form>
      </section>
    </>
  );
}

async function mount(page: Page) {
  await page.goto("/about/");
  await page.evaluate(
    (markup) => {
      const root = document.createElement("div");
      root.id = "button-fixtures";
      root.innerHTML = markup;
      document.body.append(root);
      const form = root.querySelector<HTMLFormElement>("#button-form")!;
      root
        .querySelector("#button-action")!
        .addEventListener(
          "click",
          () =>
            (form.dataset.actions = String(Number(form.dataset.actions) + 1)),
        );
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.dataset.submits = String(Number(form.dataset.submits) + 1);
      });
      form.addEventListener(
        "reset",
        () => (form.dataset.resets = String(Number(form.dataset.resets) + 1)),
      );
      root.getBoundingClientRect();
    },
    renderToStaticMarkup(<Specimens />),
  );
  await page.evaluate(() => document.fonts.ready);
}

async function paints(node: Locator) {
  return node.evaluate((node) => {
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
      border: rgba(style.borderTopColor),
      surface: rgba(
        getComputedStyle(node.closest("[data-surface]")!).backgroundColor,
      ),
      opacity: style.opacity,
    };
  });
}

function contrast(a: number[], b: number[]) {
  const luminance = (color: number[]) => {
    const [r, g, b] = color.slice(0, 3).map((channel) => {
      const c = channel / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  return (
    (Math.max(luminance(a), luminance(b)) + 0.05) /
    (Math.min(luminance(a), luminance(b)) + 0.05)
  );
}

async function readable(node: Locator, essentialBoundary: boolean) {
  const actual = await paints(node);
  expect(actual.opacity).toBe("1");
  expect(actual.color[3]).toBe(255);
  expect(actual.surface[3]).toBe(255);
  const alpha = actual.background[3] / 255;
  const background = actual.background
    .slice(0, 3)
    .map((value, index) => value * alpha + actual.surface[index] * (1 - alpha));
  expect(contrast(actual.color, background)).toBeGreaterThanOrEqual(4.5);
  if (essentialBoundary) {
    expect(actual.border[3]).toBe(255);
    // Yellow fill already identifies a primary action on charcoal. On light
    // and yellow surfaces its opaque dark border supplies the boundary.
    expect(
      Math.max(
        contrast(actual.border, actual.surface),
        contrast(background, actual.surface),
      ),
    ).toBeGreaterThanOrEqual(3);
  }
}

async function settle(node: Locator) {
  await node.evaluate(async (node) => {
    await Promise.allSettled(
      node.getAnimations().map((animation) => animation.finished),
    );
  });
}

async function fits(page: Page) {
  const overflow = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll<HTMLElement>("#button-fixtures *")]
      .filter((node) => node.getBoundingClientRect().right > innerWidth + 1)
      .map((node) => ({
        tag: node.tagName,
        id: node.id,
        width: node.getBoundingClientRect().width,
      })),
  }));
  expect(overflow.scrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(
    overflow.width + 1,
  );
  const clipped = await page
    .locator("#button-fixtures button")
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

test("U01-A02: actual button variants keep readable opaque states on all surfaces", async ({
  page,
}) => {
  test.setTimeout(120000);
  await mount(page);
  const hover = await page.evaluate(() => matchMedia("(hover: hover)").matches);
  for (const surface of surfaces) {
    for (const variant of variants) {
      const node = page.locator(`#${surface}-${variant}`);
      await page.mouse.move(0, 0);
      await settle(node);
      await readable(node, !["ghost", "link"].includes(variant));
      if (variant === "default") {
        await expect(node).toHaveCSS("background-color", "rgb(255, 204, 0)");
        await expect(node).toHaveCSS("border-top-color", "rgb(32, 32, 32)");
        await expect(node).toHaveCSS("transition-duration", "0.15s");
        await expect(node).toHaveCSS("transition-timing-function", "ease-out");
      }
      if (variant === "link")
        await expect(node).toHaveCSS("text-decoration-line", "underline");
      await node.hover();
      if (hover) {
        await settle(node);
        if (variant === "default")
          await expect(node).toHaveCSS("background-color", "rgb(230, 184, 0)");
        await readable(node, !["ghost", "link"].includes(variant));
      }
      await page.mouse.down();
      try {
        await settle(node);
        if (variant === "default")
          await expect(node).toHaveCSS("background-color", "rgb(204, 163, 0)");
        await readable(node, !["ghost", "link"].includes(variant));
        await expect(node).toHaveCSS("transform", "none");
        await expect(node).toHaveCSS("translate", "none");
      } finally {
        await page.mouse.up();
      }
      const disabled = page.locator(`#${surface}-${variant}-disabled`);
      await expect(disabled).toBeDisabled();
      await disabled.hover();
      await settle(disabled);
      await readable(disabled, true);
      await expect(disabled).toHaveCSS("cursor", "not-allowed");
      expect((await paints(disabled)).background[3]).toBe(255);
    }
  }
});

test("U01-A03: actual size aliases and long labels preserve type targets and reflow", async ({
  page,
}) => {
  await mount(page);
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const size of sizes) {
      const node = page.locator(`#button-size-${size}`);
      const box = (await node.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(size === "icon-lg" ? 48 : 44);
      expect(box.height).toBeGreaterThanOrEqual(
        ["lg", "icon-lg"].includes(size) ? 48 : 44,
      );
      await expect(node).toHaveCSS("font-size", "16px");
      await expect(node).toHaveCSS("font-weight", "500");
      await expect(node).toHaveCSS("line-height", "22.4px");
      await expect(node).toHaveCSS("border-top-left-radius", "8px");
      const family = await node.evaluate(
        (node) =>
          getComputedStyle(node).fontFamily ===
          getComputedStyle(document.body).fontFamily,
      );
      expect(family).toBe(true);
    }
    await fits(page);
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({
    content:
      "html { font-size: 200% !important; } #button-fixtures * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } #button-fixtures p { margin-bottom: 2em !important; }",
  });
  const long = page.locator("#button-long");
  await expect(long).toHaveCSS("font-size", "32px");
  await expect(long).toHaveCSS("border-top-left-radius", "16px");
  expect((await long.boundingBox())!.height).toBeGreaterThan(88);
  await fits(page);
});

test("U01-A04: component focus and icon names survive keyboard and accessibility review", async ({
  page,
}, info) => {
  await mount(page);
  for (const surface of surfaces) {
    const node = page.locator(`#${surface}-default`);
    await node.focus();
    await page.keyboard.press("Tab");
    await expect(page.locator(`#${surface}-secondary`)).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(node).toBeFocused();
    await expect(node).toHaveCSS("outline-width", "3px");
    await expect(node).toHaveCSS("outline-offset", "3px");
    await expect(node).toHaveCSS("outline-style", "solid");
    const clear = await node.evaluate((node) => {
      const box = node.getBoundingClientRect(),
        section = node.closest("section")!.getBoundingClientRect();
      return (
        box.left - 6 >= section.left &&
        box.right + 6 <= section.right &&
        box.top - 6 >= section.top &&
        box.bottom + 6 <= section.bottom
      );
    });
    expect(clear).toBe(true);
    await expect(
      page.getByRole("button", { name: `${surface} icon action`, exact: true }),
    ).toHaveAccessibleName(`${surface} icon action`);
  }
  const audit = await new AxeBuilder({ page })
    .include("#button-fixtures")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page
    .locator("#button-long")
    .evaluate(
      (node) =>
        (node.textContent =
          "Long action labels wrap instead of being truncated"),
    );
  await page
    .locator("#button-fixtures")
    .screenshot({ path: info.outputPath("button-specimens.png") });
});

test("U01-A05: native keyboard actions do not submit until explicitly requested", async ({
  page,
}) => {
  await mount(page);
  const form = page.locator("#button-form");
  await page.locator("#button-action").focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await expect(form).toHaveAttribute("data-actions", "2");
  await expect(form).toHaveAttribute("data-submits", "0");
  await page.keyboard.press("Tab");
  await expect(page.locator("#button-submit")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(form).toHaveAttribute("data-submits", "1");
  await page
    .getByRole("textbox", { name: "Specimen value" })
    .fill("Changed specimen");
  await page.locator("#button-reset").click();
  await expect(form).toHaveAttribute("data-resets", "1");
  await expect(
    page.getByRole("textbox", { name: "Specimen value" }),
  ).toHaveValue("Initial specimen");
});

test("U01-A06: blocked fonts reduced motion and forced colors preserve operation", async ({
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
  const button = page.locator("#button-action");
  await expect(button).toHaveCSS("transition-property", "none");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#button-form")).toHaveAttribute(
    "data-actions",
    "1",
  );
  await expect(button).toBeFocused();
  await fits(page);
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument");
    const { nodeId } = await session.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: "#button-action",
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
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("outline-width", "3px");
  await expect(button).toHaveCSS("forced-color-adjust", "auto");
  await expect(button).toBeVisible();
});
