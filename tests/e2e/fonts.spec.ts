import { expect, test, type CDPSession, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const roles = [
  { id: "body-400", className: "font-sans", family: "Inter", weight: 400 },
  { id: "body-500", className: "font-sans", family: "Inter", weight: 500 },
  { id: "body-600", className: "font-sans", family: "Inter", weight: 600 },
  {
    id: "heading-600",
    className: "font-heading",
    family: "Barlow Condensed",
    weight: 600,
  },
  {
    id: "heading-700",
    className: "font-heading",
    family: "Barlow Condensed",
    weight: 700,
  },
];

async function addRoleProbes(page: Page) {
  await page.evaluate((items) => {
    const section = document.createElement("section");
    section.setAttribute("aria-label", "Font test fixtures");
    for (const item of items) {
      const probe = document.createElement("p");
      probe.id = item.id;
      probe.className = item.className;
      probe.style.fontWeight = String(item.weight);
      probe.textContent =
        "Crossfit Gym: font fallback and wrapping 0123456789 " +
        "word".repeat(40);
      section.append(probe);
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "font-sans";
    button.textContent = "Check font fixture";
    button.addEventListener("click", () => {
      button.textContent = "Font fixture checked";
    });
    section.append(button);
    document.body.append(section);
  }, roles);
}

async function inspectFonts(page: Page) {
  const session = await page.context().newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  return session;
}

async function renderedFonts(session: CDPSession, selector: string) {
  const { root } = await session.send("DOM.getDocument");
  const { nodeId } = await session.send("DOM.querySelector", {
    nodeId: root.nodeId,
    selector,
  });
  const { fonts } = await session.send("CSS.getPlatformFontsForNode", {
    nodeId,
  });
  return fonts.filter((font) => font.glyphCount > 0);
}

async function assertLoadedRoles(page: Page, session: CDPSession) {
  for (const role of roles) {
    const loaded = await page.locator(`#${role.id}`).evaluate(async (node) => {
      const style = getComputedStyle(node);
      const faces = await document.fonts.load(
        `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
      );
      // Next also registers a local system fallback face; inspect the primary
      // web face here and verify the font actually used through Chromium below.
      const primary = style.fontFamily
        .split(",")[0]
        .replace(/["']/g, "")
        .trim();
      return {
        synthesis: style.fontSynthesis,
        faces: faces
          .filter((face) => face.family.replace(/["']/g, "") === primary)
          .map((face) => ({
            status: face.status,
            display: face.display,
            style: face.style,
            weight: face.weight,
          })),
      };
    });
    expect(loaded.faces, role.id).not.toHaveLength(0);
    expect(loaded.synthesis, role.id).toBe("none");
    for (const face of loaded.faces) {
      expect(face.status).toBe("loaded");
      expect(face.display).toBe("swap");
      expect(face.style).toBe("normal");
      const weights = face.weight.split(/\s+/).map(Number);
      expect(role.weight).toBeGreaterThanOrEqual(weights[0]);
      expect(role.weight).toBeLessThanOrEqual(weights.at(-1)!);
    }
    const actual = await renderedFonts(session, `#${role.id}`);
    expect(actual.length, role.id).toBeGreaterThan(0);
    expect(
      actual.every(
        (font) => font.isCustomFont && font.familyName.startsWith(role.family),
      ),
      `${role.id}: ${JSON.stringify(actual)}`,
    ).toBe(true);
  }
  const body = await renderedFonts(session, "[data-home-about] .about-copy p");
  expect(
    body.some((font) => font.isCustomFont && font.familyName === "Inter"),
  ).toBe(true);
}

test("F01-A01: selected font roles render from licensed local WOFF2 assets", async ({
  page,
  request,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "font") requests.push(request.url());
  });
  const responses: { url: string; status: number; type: string }[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "font") {
      responses.push({
        url: response.url(),
        status: response.status(),
        type: response.headers()["content-type"],
      });
    }
  });
  await page.goto("/");
  await addRoleProbes(page);
  const session = await inspectFonts(page);
  try {
    await assertLoadedRoles(page, session);
    expect(requests.length).toBeGreaterThan(0);
    for (const url of requests) {
      expect(new URL(url).origin).toBe(new URL(page.url()).origin);
    }
    expect(responses.length).toBeGreaterThan(0);
    for (const response of responses) {
      expect(new URL(response.url).origin).toBe(new URL(page.url()).origin);
      expect(response.status).toBe(200);
      expect(response.type).toContain("font/woff2");
    }
    for (const license of [
      {
        url: "/fonts/licenses/barlow-OFL.txt",
        file: "barlow-condensed/OFL.txt",
      },
      { url: "/fonts/licenses/inter-LICENSE.txt", file: "inter/LICENSE.txt" },
    ]) {
      const response = await request.get(license.url);
      expect(response.status()).toBe(200);
      expect(await response.body()).toEqual(
        await readFile(`src/styles/fonts/${license.file}`),
      );
    }
  } finally {
    await session.detach();
  }
});

test("F01-A02: delayed fonts keep fallback readable then swap to local faces", async ({
  page,
}) => {
  let releaseFonts!: () => void;
  const pending = new Promise<void>((resolve) => {
    releaseFonts = resolve;
  });
  let requests = 0;
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() === "font") {
      requests++;
      await pending;
    }
    await route.continue();
  });
  let session: CDPSession | undefined;
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await addRoleProbes(page);
    await expect.poll(() => requests).toBeGreaterThan(0);
    session = await inspectFonts(page);
    for (const role of roles) {
      await expect(page.locator(`#${role.id}`)).toBeVisible();
      const fonts = await renderedFonts(session, `#${role.id}`);
      expect(fonts.length).toBeGreaterThan(0);
      expect(fonts.every((font) => !font.isCustomFont)).toBe(true);
    }
    await page.getByRole("button", { name: "Check font fixture" }).click();
    await expect(
      page.getByRole("button", { name: "Font fixture checked" }),
    ).toBeVisible();
    releaseFonts();
    await assertLoadedRoles(page, session);
  } finally {
    releaseFonts();
    await session?.detach();
  }
});

test("F01-A03: blocked fonts preserve fallback, wrapping, focus and navigation", async ({
  page,
}) => {
  let blocked = 0;
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() === "font") {
      blocked++;
      await route.abort("failed");
    } else {
      await route.continue();
    }
  });
  await page.goto("/");
  await addRoleProbes(page);
  await expect.poll(() => blocked).toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const session = await inspectFonts(page);
  try {
    for (const role of roles) {
      const fonts = await renderedFonts(session, `#${role.id}`);
      expect(fonts.length).toBeGreaterThan(0);
      expect(fonts.every((font) => !font.isCustomFont)).toBe(true);
    }
    const currentWidth = page.viewportSize()!.width;
    for (const width of [currentWidth, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const role of roles) {
        await expect(page.locator(`#${role.id}`)).toBeVisible();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      ).toBe(true);
    }
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    await page.getByRole("button", { name: "Check font fixture" }).click();
    await expect(
      page.getByRole("button", { name: "Font fixture checked" }),
    ).toBeVisible();
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Membership", exact: true })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "Your Fitness. Your Goals. Your Membership.",
        exact: true,
      }),
    ).toBeVisible();
  } finally {
    await session.detach();
  }
});

test("F01-A04: font integration preserves preview metadata and indexing safeguards", async ({
  page,
  request,
}) => {
  await page.goto("/products/whey-protein-powder/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/products\/whey-protein-powder\/$/,
  );
  await expect(page.getByRole("main")).toHaveCount(1);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("content-preview");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /");
});
