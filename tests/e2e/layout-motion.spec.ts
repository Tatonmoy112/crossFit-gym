import { expect, test, type Page } from "@playwright/test";

const widths = [320, 375, 767, 768, 1023, 1024, 1280, 1920];
const spacing = [
  { className: "py-1", px: 4 },
  { className: "py-2", px: 8 },
  { className: "py-3", px: 12 },
  { className: "py-4", px: 16 },
  { className: "py-6", px: 24 },
  { className: "py-8", px: 32 },
  { className: "py-12", px: 48 },
  { className: "py-16", px: 64 },
  { className: "py-24", px: 96 },
];

async function specimens(page: Page) {
  await page.goto("/about/");
  // The fixtures need to be inside the real main landmark to catch constraints.
  // Wait for hydration before adding DOM that is intentionally outside React.
  await page.waitForLoadState("networkidle");
  await page.evaluate((steps) => {
    const root = document.createElement("div");
    root.id = "layout-fixtures";
    for (const surface of ["light", "yellow", "charcoal"]) {
      const section = document.createElement("section");
      section.id = `layout-${surface}`;
      section.dataset.surface = surface;
      section.className = "py-8";
      section.setAttribute("aria-label", `${surface} layout specimen`);
      const inner = document.createElement("div");
      inner.className = "layout-container";
      const heading = document.createElement("h2");
      heading.textContent = `${surface} section specimen`;
      const text = document.createElement("p");
      text.className = "text-measure";
      text.textContent =
        "Content awaits approval. https://example.invalid/" +
        "unbroken".repeat(24);
      const control = document.createElement("button");
      control.id = `layout-control-${surface}`;
      control.type = "button";
      control.className =
        "touch-target type-control rounded-control motion-control p-2 border border-primary-border bg-primary text-primary-foreground";
      control.textContent =
        surface === "yellow"
          ? "Long control label " + "wrapping".repeat(20)
          : `${surface} control specimen`;
      control.addEventListener(
        "click",
        () => (control.dataset.activated = "true"),
      );
      inner.append(heading, text, control);
      section.append(inner);
      root.append(section);
    }
    const first = root.querySelector(".layout-container")!;
    const overlay = document.createElement("div");
    overlay.id = "motion-overlay";
    overlay.className = "motion-overlay rounded-overlay p-4 border";
    overlay.textContent = "Overlay transition specimen";
    overlay.style.opacity = "0";
    overlay.style.transform = "translateY(8px)";
    overlay.setAttribute("aria-hidden", "true");
    const status = document.createElement("p");
    status.id = "motion-status";
    status.setAttribute("role", "status");
    status.textContent = "Closed";
    const trigger = root.querySelector<HTMLButtonElement>("button")!;
    trigger.setAttribute("aria-controls", overlay.id);
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") !== "true";
      trigger.setAttribute("aria-expanded", String(open));
      trigger.style.backgroundColor = open
        ? "var(--primary-active)"
        : "var(--primary)";
      overlay.style.opacity = open ? "1" : "0";
      overlay.style.transform = open ? "translateY(0px)" : "translateY(8px)";
      overlay.setAttribute("aria-hidden", String(!open));
      status.textContent = open ? "Opened" : "Closed";
    });
    first.append(overlay, status);
    const geometry = document.createElement("div");
    geometry.id = "geometry-fixtures";
    geometry.className = "layout-container";
    const card = document.createElement("div");
    card.id = "radius-card";
    card.className = "rounded-card p-4 border";
    card.textContent = "Card radius specimen";
    geometry.append(card);
    for (const step of steps) {
      const node = document.createElement("div");
      node.id = `space-${step.px}`;
      node.className = step.className;
      node.textContent = "Spacing";
      geometry.append(node);
    }
    const pulse = document.createElement("p");
    pulse.id = "motion-pulse";
    pulse.className = "animate-pulse";
    pulse.textContent = "Animation specimen: status remains readable";
    pulse.style.transform = "translateY(4px)";
    geometry.append(pulse);
    document.querySelector("main")!.append(root, geometry);
    root.getBoundingClientRect();
  }, spacing);
  await page.evaluate(() => document.fonts.ready);
}

async function expectPageFits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const clipped = await page.locator("#layout-fixtures").evaluate((root) =>
    [root, ...root.querySelectorAll<HTMLElement>("*")]
      .filter((node) => {
        const style = getComputedStyle(node);
        return (
          node.scrollWidth > node.clientWidth + 1 ||
          ["hidden", "clip"].includes(style.overflowX) ||
          ["hidden", "clip"].includes(style.overflowY) ||
          style.textOverflow === "ellipsis"
        );
      })
      .map((node) => node.id || node.tagName),
  );
  expect(clipped).toEqual([]);
}

test("F01-D01: full-width sections constrain only their inner content", async ({
  page,
}, info) => {
  await specimens(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const gutter = width >= 1024 ? 32 : width >= 768 ? 24 : 16;
    const expectedWidth = Math.min(1152, width - gutter * 2);
    const geometry = await page.evaluate(() => {
      const rect = (node: Element) => {
        const box = node.getBoundingClientRect();
        return {
          x: box.x,
          width: box.width,
          padding: getComputedStyle(node).paddingInlineStart,
        };
      };
      return {
        main: rect(document.querySelector("main")!),
        shell: rect(document.querySelector("main > section")!),
        sections: [
          ...document.querySelectorAll("#layout-fixtures > section"),
        ].map((node) => ({
          outer: rect(node),
          inner: rect(node.firstElementChild!),
        })),
      };
    });
    expect(geometry.main.x).toBe(0);
    expect(geometry.main.width, `main at ${width}`).toBe(width);
    expect(geometry.main.padding).toBe("0px");
    for (const inner of [
      geometry.shell,
      ...geometry.sections.map((section) => section.inner),
    ]) {
      expect(inner.width).toBeCloseTo(expectedWidth, 1);
      expect(inner.x).toBeCloseTo((width - expectedWidth) / 2, 1);
      expect(inner.padding).toBe("0px");
    }
    for (const section of geometry.sections) {
      expect(section.outer.x).toBe(0);
      expect(section.outer.width).toBe(width);
    }
    await expectPageFits(page);
  }
  await page.setViewportSize({
    width: info.project.name === "mobile" ? 375 : 1920,
    height: 900,
  });
  await page.locator("#layout-fixtures").evaluate((root) => {
    for (const text of root.querySelectorAll(".text-measure"))
      text.textContent =
        "Section content awaits approval. This is an isolated layout specimen.";
    root.querySelector("#layout-control-yellow")!.textContent =
      "Yellow control specimen";
  });
  await page
    .locator("#layout-fixtures")
    .screenshot({ path: info.outputPath("layout-specimens.png") });
});

test("F01-D02: spacing radii and touch targets scale and allow wrapping", async ({
  page,
}) => {
  await specimens(page);
  await page.setViewportSize({ width: 320, height: 900 });
  for (const scale of [1, 2]) {
    if (scale === 2)
      await page.addStyleTag({
        content:
          "html { font-size: 200% !important; } #layout-fixtures * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } #layout-fixtures p { margin-bottom: 2em !important; }",
      });
    for (const [selector, radius] of [
      ["#layout-control-light", 8],
      ["#radius-card", 12],
      ["#motion-overlay", 16],
    ] as const) {
      await expect(page.locator(selector)).toHaveCSS(
        "border-top-left-radius",
        `${radius * scale}px`,
      );
      await expect(page.locator(selector)).toHaveCSS(
        "border-bottom-right-radius",
        `${radius * scale}px`,
      );
    }
    for (const step of spacing) {
      await expect(page.locator(`#space-${step.px}`)).toHaveCSS(
        "padding-top",
        `${step.px * scale}px`,
      );
      await expect(page.locator(`#space-${step.px}`)).toHaveCSS(
        "padding-bottom",
        `${step.px * scale}px`,
      );
    }
    for (const surface of ["light", "yellow", "charcoal"]) {
      const control = page.locator(`#layout-control-${surface}`);
      const box = (await control.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44 * scale);
      expect(box.height).toBeGreaterThanOrEqual(44 * scale);
      if (surface === "yellow") expect(box.height).toBeGreaterThan(44 * scale);
    }
    await expectPageFits(page);
  }
});

test("F01-D03: landmark and surface focus remain visible inside layout edges", async ({
  page,
}) => {
  await specimens(page);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  const skipBox = (await skip.boundingBox())!;
  expect(skipBox.height).toBeGreaterThanOrEqual(44);
  expect(skipBox.x).toBeGreaterThanOrEqual(6);
  expect(skipBox.y).toBeGreaterThanOrEqual(6);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByRole("main")).toHaveCSS("outline-width", "3px");
  await expect(page.getByRole("main")).toHaveCSS("outline-offset", "-3px");
  for (const width of [320, 375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const first = page.locator("#layout-control-light");
    await first.focus();
    for (const surface of ["light", "yellow", "charcoal"]) {
      const control = page.locator(`#layout-control-${surface}`);
      await expect(control).toBeFocused();
      await expect(control).toHaveCSS("outline-style", "solid");
      await expect(control).toHaveCSS("outline-width", "3px");
      await expect(control).toHaveCSS("outline-offset", "3px");
      const inside = await control.evaluate((node) => {
        const box = node.getBoundingClientRect();
        const surface = node.closest("section")!.getBoundingClientRect();
        return (
          box.left - 6 >= surface.left &&
          box.right + 6 <= surface.right &&
          box.top - 6 >= surface.top &&
          box.bottom + 6 <= surface.bottom
        );
      });
      expect(inside).toBe(true);
      if (surface !== "charcoal") await page.keyboard.press("Tab");
    }
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator("#layout-control-yellow")).toBeFocused();
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await page.emulateMedia({ forcedColors: "active" });
  await page.locator("#layout-control-charcoal").focus();
  await expect(page.locator("#layout-control-charcoal")).toHaveCSS(
    "outline-width",
    "3px",
  );
  await expect(page.locator("#layout-control-charcoal")).toHaveCSS(
    "forced-color-adjust",
    "auto",
  );
  const focusFits = await page
    .locator("#layout-control-charcoal")
    .evaluate((node) => {
      const box = node.getBoundingClientRect();
      return (
        box.left - 6 >= 0 &&
        box.right + 6 <= innerWidth &&
        box.top - 6 >= 0 &&
        box.bottom + 6 <= innerHeight
      );
    });
  expect(focusFits).toBe(true);
  await expectPageFits(page);
});

test("F01-D04: motion roles drive actual transitions without delaying state or focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await specimens(page);
  for (const [selector, duration, properties] of [
    [
      "#layout-control-light",
      "0.15s",
      ["background-color", "border-color", "color", "opacity"],
    ],
    ["#motion-overlay", "0.2s", ["opacity", "transform", "translate", "scale"]],
  ] as const) {
    const node = page.locator(selector);
    await expect(node).toHaveCSS("transition-duration", duration);
    await expect(node).toHaveCSS("transition-timing-function", "ease-out");
    await expect(node).toHaveCSS("transition-delay", "0s");
    const actual = await node.evaluate((node) =>
      getComputedStyle(node).transitionProperty.split(", ").sort(),
    );
    expect(actual).toEqual([...properties].sort());
  }
  await page.locator("#layout-control-light").focus();
  const active = await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(
      "#layout-control-light",
    )!;
    const overlay = document.querySelector<HTMLElement>("#motion-overlay")!;
    getComputedStyle(button).getPropertyValue("background-color");
    getComputedStyle(overlay).getPropertyValue("opacity");
    button.click();
    getComputedStyle(overlay).getPropertyValue("opacity");
    const transitions = (node: Element) =>
      node.getAnimations().map((animation) => ({
        duration: animation.effect!.getTiming().duration,
        property: (animation as CSSTransition).transitionProperty,
      }));
    return {
      control: transitions(button),
      overlay: transitions(overlay),
      state: button.getAttribute("aria-expanded"),
      status: document.querySelector("#motion-status")!.textContent,
    };
  });
  expect(active.state).toBe("true");
  expect(active.status).toBe("Opened");
  expect(active.control).toContainEqual({
    duration: 150,
    property: "background-color",
  });
  expect(active.overlay).toContainEqual({ duration: 200, property: "opacity" });
  expect(active.overlay).toContainEqual({
    duration: 200,
    property: "transform",
  });
  await expect(page.locator("#layout-control-light")).toBeFocused();
  await expect(page.locator("#motion-overlay")).toHaveCSS("opacity", "1");
  // The same role must animate exit without deferring semantic state updates.
  const exit = await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>("#layout-control-light")!.click();
    const overlay = document.querySelector("#motion-overlay")!;
    getComputedStyle(overlay).getPropertyValue("opacity");
    return {
      status: document.querySelector("#motion-status")!.textContent,
      transitions: overlay.getAnimations().map((animation) => ({
        duration: animation.effect!.getTiming().duration,
        property: (animation as CSSTransition).transitionProperty,
      })),
    };
  });
  expect(exit.status).toBe("Closed");
  expect(exit.transitions).toContainEqual({
    duration: 200,
    property: "opacity",
  });
  expect(exit.transitions).toContainEqual({
    duration: 200,
    property: "transform",
  });
  await expect(page.locator("#motion-overlay")).toHaveCSS("opacity", "0");
  await expect(page.locator("#layout-control-light")).toBeFocused();
});

test("F01-D05: reduced motion removes movement delays and preserves operation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await specimens(page);
  await page.evaluate(() => {
    for (const id of ["layout-control-light", "motion-overlay"])
      document.getElementById(id)!.style.transitionDelay = "30s";
    document.getElementById("motion-pulse")!.style.animationDelay = "30s";
    document.documentElement.style.scrollBehavior = "smooth";
  });
  for (const id of ["layout-control-light", "motion-overlay"]) {
    const node = page.locator(`#${id}`);
    await expect(node).toHaveCSS("transition-property", "none");
    await expect(node).toHaveCSS("transition-delay", "0s");
  }
  const pulse = page.locator("#motion-pulse");
  await expect(pulse).toHaveCSS("animation-delay", "0s");
  await expect(pulse).toHaveCSS("animation-iteration-count", "1");
  expect(
    await pulse.evaluate((node) =>
      parseFloat(getComputedStyle(node).animationDuration),
    ),
  ).toBeLessThanOrEqual(0.00001);
  await expect(pulse).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 4)");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.locator("#layout-control-light").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#motion-status")).toHaveText("Opened");
  await expect(page.locator("#layout-control-light")).toBeFocused();
  await expect(page.locator("#motion-overlay")).toHaveCSS("opacity", "1");
  const movement = await page
    .locator("#motion-overlay")
    .evaluate(
      (node) =>
        node
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    );
  expect(movement).toBe(0);
  await page.keyboard.press("Enter");
  await expect(page.locator("#motion-status")).toHaveText("Closed");
  await expect(page.locator("#motion-overlay")).toHaveCSS("opacity", "0");
});
