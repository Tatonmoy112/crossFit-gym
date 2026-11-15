import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const surfaces = ["light", "charcoal", "yellow"] as const;
const palette = {
  light: {
    background: [255, 255, 255],
    foreground: [23, 23, 23],
    link: [23, 23, 23],
    error: [185, 28, 28],
  },
  charcoal: {
    background: [32, 32, 32],
    foreground: [255, 255, 255],
    link: [255, 204, 0],
    error: [252, 165, 165],
  },
  yellow: {
    background: [255, 204, 0],
    foreground: [23, 23, 23],
    link: [23, 23, 23],
    error: [153, 27, 27],
  },
};

async function addSpecimens(page: Page) {
  await page.evaluate((contexts) => {
    const fixture = document.createElement("div");
    fixture.id = "color-fixtures";
    for (const context of contexts) {
      const section = document.createElement("section");
      section.id = `surface-${context}`;
      section.dataset.surface = context;
      section.setAttribute("aria-label", `${context} color specimens`);
      section.className = "p-4";
      const text = document.createElement("p");
      text.textContent = `${context} color specimen`;
      section.append(text);
      for (const role of ["card", "popover", "secondary", "muted", "accent"]) {
        const swatch = document.createElement("p");
        swatch.dataset.role = role;
        // Literal class candidates let Tailwind build the real consumer API.
        const classes: Record<string, string> = {
          card: "bg-card text-card-foreground",
          popover: "bg-popover text-popover-foreground",
          secondary: "bg-secondary text-secondary-foreground",
          muted: "bg-muted text-muted-foreground",
          accent: "bg-accent text-accent-foreground",
        };
        swatch.className = classes[role];
        swatch.textContent = `${role} text`;
        section.append(swatch);
      }
      const primary = document.createElement("button");
      primary.type = "button";
      primary.dataset.role = "primary";
      primary.className =
        "border border-primary-border bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active outline-none";
      primary.textContent = "Primary specimen";
      section.append(primary);
      const disabled = document.createElement("button");
      disabled.type = "button";
      disabled.disabled = true;
      disabled.dataset.role = "disabled";
      disabled.className =
        "disabled:bg-disabled disabled:text-disabled-foreground disabled:opacity-100";
      disabled.textContent = "Unavailable specimen";
      section.append(disabled);
      const selected = document.createElement("button");
      selected.type = "button";
      selected.dataset.role = "selected";
      selected.setAttribute("aria-pressed", "true");
      selected.className =
        "border-2 aria-pressed:bg-selected aria-pressed:text-selected-foreground aria-pressed:border-selected-border";
      selected.textContent = "Selected specimen";
      section.append(selected);
      const label = document.createElement("label");
      label.htmlFor = `${context}-field`;
      label.textContent = "Specimen name";
      const input = document.createElement("input");
      input.id = label.htmlFor;
      input.dataset.role = "input";
      input.className =
        "border border-input bg-background text-foreground outline-none";
      section.append(label, input);
      const invalidLabel = document.createElement("label");
      invalidLabel.htmlFor = `${context}-invalid`;
      invalidLabel.textContent = "Invalid specimen";
      const invalid = document.createElement("input");
      invalid.id = invalidLabel.htmlFor;
      invalid.dataset.role = "invalid";
      invalid.setAttribute("aria-invalid", "true");
      invalid.setAttribute("aria-describedby", `${context}-error`);
      invalid.className =
        "border bg-background text-foreground aria-invalid:border-destructive";
      const error = document.createElement("p");
      error.id = `${context}-error`;
      error.dataset.role = "error";
      error.className = "text-destructive";
      error.textContent = "Enter a specimen value.";
      section.append(invalidLabel, invalid, error);
      const link = document.createElement("a");
      link.href = "#main";
      link.dataset.role = "link";
      link.textContent = "Return to content";
      section.append(link);
      fixture.append(section);
    }
    document.body.append(fixture);
  }, surfaces);
}

async function paint(locator: Locator, property: string) {
  return locator.evaluate((node, key) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    context.fillStyle = getComputedStyle(node).getPropertyValue(key);
    context.fillRect(0, 0, 1, 1);
    return Array.from(context.getImageData(0, 0, 1, 1).data);
  }, property);
}

function contrast(first: number[], second: number[]) {
  expect(first[3], "foreground must be opaque").toBe(255);
  expect(second[3], "background must be opaque").toBe(255);
  const luminance = (color: number[]) => {
    const [r, g, b] = color.slice(0, 3).map((channel) => {
      const value = channel / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = luminance(first),
    b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

async function assertTextContrast(node: Locator, background = node) {
  expect(
    contrast(
      await paint(node, "color"),
      await paint(background, "background-color"),
    ),
  ).toBeGreaterThanOrEqual(4.5);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await addSpecimens(page);
});

test("F01-B01: semantic paints match approved surfaces and contrast thresholds", async ({
  page,
}) => {
  for (const mode of surfaces) {
    const section = page.locator(`#surface-${mode}`);
    const expected = palette[mode];
    expect(await paint(section, "background-color")).toEqual([
      ...expected.background,
      255,
    ]);
    expect(await paint(section, "color")).toEqual([
      ...expected.foreground,
      255,
    ]);
    await assertTextContrast(section);
    for (const role of ["card", "popover", "secondary", "muted", "accent"]) {
      await assertTextContrast(section.locator(`[data-role="${role}"]`));
    }
    const primary = section.locator('[data-role="primary"]');
    expect(await paint(primary, "background-color")).toEqual([
      255, 204, 0, 255,
    ]);
    await assertTextContrast(primary);
    expect(
      contrast(
        await paint(primary, "border-top-color"),
        await paint(primary, "background-color"),
      ),
    ).toBeGreaterThanOrEqual(3);
    const input = section.locator('[data-role="input"]');
    expect(
      contrast(
        await paint(input, "border-top-color"),
        await paint(section, "background-color"),
      ),
    ).toBeGreaterThanOrEqual(3);
    const link = section.locator('[data-role="link"]');
    expect(await paint(link, "color")).toEqual([...expected.link, 255]);
    await expect(link).toHaveCSS("text-decoration-line", "underline");
    await assertTextContrast(link, section);
    const error = section.locator('[data-role="error"]');
    expect(await paint(error, "color")).toEqual([...expected.error, 255]);
    await assertTextContrast(error, section);
  }
});

test("F01-B02: state roles stay opaque and preserve non-color cues", async ({
  page,
}) => {
  const canHover = await page.evaluate(
    () => matchMedia("(hover: hover)").matches,
  );
  for (const mode of surfaces) {
    const section = page.locator(`#surface-${mode}`);
    const primary = section.locator('[data-role="primary"]');
    await primary.hover();
    expect(await paint(primary, "background-color")).toEqual(
      canHover ? [230, 184, 0, 255] : [255, 204, 0, 255],
    );
    await assertTextContrast(primary);
    await page.mouse.down();
    try {
      expect(await paint(primary, "background-color")).toEqual([
        204, 163, 0, 255,
      ]);
      await assertTextContrast(primary);
    } finally {
      await page.mouse.up();
    }
    const disabled = section.locator('[data-role="disabled"]');
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveCSS("opacity", "1");
    await assertTextContrast(disabled);
    const selected = section.locator('[data-role="selected"]');
    await expect(selected).toHaveAttribute("aria-pressed", "true");
    await expect(selected).toContainText("Selected");
    expect(
      contrast(
        await paint(selected, "border-top-color"),
        await paint(section, "background-color"),
      ),
    ).toBeGreaterThanOrEqual(3);
    await assertTextContrast(selected);
    const invalid = section.locator('[data-role="invalid"]');
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAccessibleDescription(
      "Enter a specimen value.",
    );
    expect(
      contrast(
        await paint(invalid, "border-top-color"),
        await paint(invalid, "background-color"),
      ),
    ).toBeGreaterThanOrEqual(3);
  }
});

test("F01-B03: nearest surface boundaries contain dark utilities and OS preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  expect(await paint(page.locator("body"), "background-color")).toEqual([
    255, 255, 255, 255,
  ]);
  await page.evaluate(() => {
    const outer = document.querySelector("#surface-charcoal")!;
    let parent = outer;
    for (const [id, surface] of [
      ["nested-light", "light"],
      ["nested-dark", "charcoal"],
      ["nested-yellow", "yellow"],
    ]) {
      const boundary = document.createElement("div");
      boundary.dataset.surface = surface;
      const probe = document.createElement("p");
      probe.id = id;
      probe.className = "text-foreground dark:text-primary";
      probe.textContent = id;
      boundary.append(probe);
      parent.append(boundary);
      parent = boundary;
    }
    for (const [id, className] of [
      ["class-dark", "dark"],
      ["class-light", "light"],
    ]) {
      const boundary = document.createElement("div");
      boundary.className = className;
      const probe = document.createElement("p");
      probe.className = "text-foreground dark:text-primary";
      probe.id = id;
      probe.textContent = id;
      boundary.append(probe);
      outer.append(boundary);
    }
    const separate = document.createElement("div");
    separate.dataset.surface = "light";
    separate.className = "bg-popover text-popover-foreground";
    separate.id = "separate-light-surface";
    separate.textContent = "Separate light overlay surface";
    document.body.append(separate);
  });
  for (const id of ["nested-light", "nested-yellow", "class-light"]) {
    expect(await paint(page.locator(`#${id}`), "color")).toEqual([
      23, 23, 23, 255,
    ]);
  }
  for (const id of ["nested-dark", "class-dark"]) {
    expect(await paint(page.locator(`#${id}`), "color")).toEqual([
      255, 204, 0, 255,
    ]);
  }
  expect(
    await paint(page.locator("#separate-light-surface"), "background-color"),
  ).toEqual([255, 255, 255, 255]);
  expect(await paint(page.locator("#separate-light-surface"), "color")).toEqual(
    [23, 23, 23, 255],
  );
});

test("F01-B04: keyboard and forced-colors focus survives utility resets", async ({
  page,
}) => {
  for (const mode of surfaces) {
    const section = page.locator(`#surface-${mode}`);
    await section.locator('[data-role="selected"]').focus();
    await page.keyboard.press("Tab");
    const input = section.locator('[data-role="input"]');
    await expect(input).toBeFocused();
    await expect(input).toHaveCSS("outline-style", "solid");
    await expect(input).toHaveCSS("outline-width", "3px");
    await expect(input).toHaveCSS("outline-offset", "3px");
    expect(await paint(input, "outline-color")).toEqual([
      ...palette[mode].link,
      255,
    ]);
    expect(
      contrast(
        await paint(input, "outline-color"),
        await paint(section, "background-color"),
      ),
    ).toBeGreaterThanOrEqual(3);
  }
  await page.emulateMedia({ forcedColors: "active" });
  const input = page.locator('#surface-charcoal [data-role="input"]');
  await input.focus();
  await expect(input).toHaveCSS("outline-style", "solid");
  await expect(input).toHaveCSS("outline-width", "3px");
  const systemColor = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.color = "Highlight";
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  await expect(input).toHaveCSS("outline-color", systemColor);
  await expect(input).toHaveCSS("forced-color-adjust", "auto");
});

test("F01-B05: native color specimens pass sampled accessibility and reflow", async ({
  page,
}) => {
  const result = await new AxeBuilder({ page })
    .include("#color-fixtures")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({
    path: test.info().outputPath("color-specimens.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 320, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});
