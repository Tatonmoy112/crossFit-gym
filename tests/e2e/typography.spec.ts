import { expect, test, type Page } from "@playwright/test";

const widths = [320, 375, 768, 1280, 1920];
const roles = [
  {
    id: "display",
    tag: "p",
    className: "type-display",
    family: "Barlow Condensed",
    weight: 700,
    min: 40,
    base: 24,
    vw: 0.04,
    max: 80,
    leading: 1.05,
  },
  {
    id: "h1",
    tag: "h1",
    className: "",
    family: "Barlow Condensed",
    weight: 700,
    min: 36,
    base: 24,
    vw: 0.03,
    max: 64,
    leading: 1.1,
  },
  {
    id: "h2",
    tag: "h2",
    className: "",
    family: "Barlow Condensed",
    weight: 600,
    min: 28,
    base: 20,
    vw: 0.02,
    max: 48,
    leading: 1.15,
  },
  {
    id: "h3",
    tag: "h3",
    className: "",
    family: "Inter",
    weight: 600,
    min: 22,
    base: 18,
    vw: 0.01,
    max: 32,
    leading: 1.25,
  },
  {
    id: "body",
    tag: "p",
    className: "",
    family: "Inter",
    weight: 400,
    min: 16,
    base: 16,
    vw: 0,
    max: 16,
    leading: 1.6,
  },
  {
    id: "control",
    tag: "button",
    className: "type-control",
    family: "Inter",
    weight: 500,
    min: 16,
    base: 16,
    vw: 0,
    max: 16,
    leading: 1.4,
  },
  {
    id: "strong",
    tag: "button",
    className: "type-control-strong",
    family: "Inter",
    weight: 600,
    min: 16,
    base: 16,
    vw: 0,
    max: 16,
    leading: 1.4,
  },
  {
    id: "hint",
    tag: "p",
    className: "type-hint",
    family: "Inter",
    weight: 400,
    min: 14,
    base: 14,
    vw: 0,
    max: 14,
    leading: 1.5,
  },
];

async function specimen(page: Page) {
  await page.evaluate((items) => {
    const section = document.createElement("section");
    section.id = "typography-specimen";
    section.setAttribute("aria-label", "Typography test fixtures");
    section.style.padding = "1rem";
    const measure = document.createElement("div");
    measure.id = "reading-measure";
    measure.className = "text-measure";
    for (const item of items) {
      const node = document.createElement(item.tag);
      node.id = `type-${item.id}`;
      node.className = item.className;
      node.textContent =
        item.id === "body"
          ? "Content is awaiting approval. https://example.invalid/" +
            "unbroken".repeat(24)
          : "Typography specimen: Readable headings and labels " +
            "longword".repeat(12);
      if (node instanceof HTMLButtonElement) {
        node.type = "button";
        node.addEventListener("click", () =>
          node.setAttribute("data-activated", "true"),
        );
      }
      measure.append(node);
    }
    section.append(measure);
    document.body.append(section);
  }, roles);
  await page.evaluate(() => document.fonts.ready);
}

async function assertReflow(page: Page) {
  const result = await page.locator("#typography-specimen").evaluate((root) => {
    const nodes = [root, ...root.querySelectorAll<HTMLElement>("*")];
    return {
      pageFits: document.documentElement.scrollWidth <= innerWidth + 1,
      clipped: nodes
        .filter((node) => {
          const style = getComputedStyle(node);
          return (
            node.scrollWidth > node.clientWidth + 1 ||
            style.overflowX === "hidden" ||
            style.overflowY === "hidden" ||
            style.overflowX === "clip" ||
            style.overflowY === "clip" ||
            // Tight display leading can leave visible glyph ink outside its
            // line box. Only contained vertical overflow indicates lost text.
            (style.overflowY !== "visible" &&
              node.scrollHeight > node.clientHeight + 1) ||
            style.textOverflow === "ellipsis"
          );
        })
        .map((node) => node.id),
    };
  });
  expect(result.pageFits).toBe(true);
  expect(result.clipped).toEqual([]);
  for (const role of roles)
    await expect(page.locator(`#type-${role.id}`)).toBeVisible();
}

test("F01-C01: fluid hierarchy uses the approved local families and metrics", async ({
  page,
}) => {
  await page.goto("/");
  await specimen(page);
  const session = await page.context().newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const role of roles) {
        const style = await page
          .locator(`#type-${role.id}`)
          .evaluate(async (node) => {
            const s = getComputedStyle(node);
            await document.fonts.load(
              `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`,
            );
            return {
              size: parseFloat(s.fontSize),
              weight: s.fontWeight,
              leading: parseFloat(s.lineHeight),
              spacing: s.letterSpacing,
              transform: s.textTransform,
              synthesis: s.fontSynthesis,
            };
          });
        const size = Math.min(
          role.max,
          Math.max(role.min, role.base + role.vw * width),
        );
        expect(style.size, `${role.id} at ${width}`).toBeCloseTo(size, 1);
        expect(style.weight).toBe(String(role.weight));
        expect(style.leading).toBeCloseTo(size * role.leading, 1);
        expect(style.spacing).toBe("normal");
        expect(style.transform).toBe("none");
        expect(style.synthesis).toBe("none");
      }
    }
    const { root } = await session.send("DOM.getDocument");
    for (const role of roles) {
      const { nodeId } = await session.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector: `#type-${role.id}`,
      });
      const { fonts } = await session.send("CSS.getPlatformFontsForNode", {
        nodeId,
      });
      const used = fonts.filter((font) => font.glyphCount > 0);
      expect(used.length).toBeGreaterThan(0);
      expect(
        used.every(
          (font) =>
            font.isCustomFont && font.familyName.startsWith(role.family),
        ),
        JSON.stringify(used),
      ).toBe(true);
    }
    await expect(page.locator("main h1")).toHaveCount(1);
    expect(
      await page
        .locator("body")
        .evaluate((node) => getComputedStyle(node).fontSize),
    ).toBe("16px");
  } finally {
    await session.detach();
  }
});

test("F01-C02: readable measure and long content reflow at every specified width", async ({
  page,
}, info) => {
  await page.goto("/");
  await specimen(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const measure = await page.locator("#reading-measure").evaluate((node) => {
      const ruler = document.createElement("span");
      ruler.style.display = "block";
      ruler.style.width = "65ch";
      node.append(ruler);
      const expected = ruler.getBoundingClientRect().width;
      ruler.remove();
      return {
        width: node.getBoundingClientRect().width,
        limit: expected,
        available:
          node.parentElement!.clientWidth -
          2 *
            parseFloat(
              getComputedStyle(node.parentElement!).paddingInlineStart,
            ),
      };
    });
    expect(measure.width).toBeCloseTo(
      Math.min(measure.limit, measure.available),
      0,
    );
    await assertReflow(page);
  }
  await page.setViewportSize({
    width: info.project.name === "mobile" ? 375 : 1280,
    height: 900,
  });
  await page.locator("#reading-measure").evaluate((node) => {
    const samples: Record<string, string> = {
      display: "Hero display specimen",
      h1: "Page heading specimen",
      h2: "Major section heading",
      h3: "Small heading in Inter",
      body: "Body text remains readable on small and wide screens. This is isolated test content, with no business claims.",
      control: "Control label",
      strong: "Emphasized control",
      hint: "Supporting text: content awaits approval.",
    };
    for (const [id, text] of Object.entries(samples)) {
      node.querySelector(`#type-${id}`)!.textContent = text;
    }
  });
  await page
    .locator("#typography-specimen")
    .screenshot({ path: info.outputPath("typography-specimens.png") });
});

test("F01-C03: blocked fonts preserve readable hierarchy and keyboard operation", async ({
  page,
}) => {
  await page.route(/\.woff2(?:\?.*)?$/, (route) => route.abort());
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  await specimen(page);
  const session = await page.context().newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  try {
    const { root } = await session.send("DOM.getDocument");
    for (const id of ["h1", "h2", "body"]) {
      const { nodeId } = await session.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector: `#type-${id}`,
      });
      const { fonts } = await session.send("CSS.getPlatformFontsForNode", {
        nodeId,
      });
      expect(
        fonts.some((font) => font.glyphCount > 0 && !font.isCustomFont),
      ).toBe(true);
    }
    expect(
      await page
        .locator("#type-h1")
        .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
    ).toBe(36);
    await assertReflow(page);
    await page.locator("#type-control").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#type-control")).toHaveAttribute(
      "data-activated",
      "true",
    );
  } finally {
    await session.detach();
  }
});

test("F01-C04: user text enlargement and spacing preserve content and controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  await specimen(page);
  await page.addStyleTag({
    content: `html { font-size: 200% !important; } #typography-specimen * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } #typography-specimen p { margin-bottom: 2em !important; }`,
  });
  expect(
    await page
      .locator("#type-control")
      .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
  ).toBe(32);
  expect(
    await page
      .locator("#type-h1")
      .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
  ).toBe(72);
  await assertReflow(page);
  await page.locator("#type-strong").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#type-strong")).toHaveAttribute(
    "data-activated",
    "true",
  );
});
