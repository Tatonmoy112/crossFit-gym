import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { contactPage } from "../../src/content/contact-page";
import { site } from "../../src/content/site";

const contact = (page: Page) => page.locator("[data-contact-page]");
async function ready(page: Page) {
  await page.goto("/contact/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}
async function fits(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

test("Contact has six server-owned sections, native destinations and protected metadata", async ({
  page,
}) => {
  await ready(page);
  await expect(page.locator("h1")).toHaveText(contactPage.hero.heading);
  await expect(contact(page).locator("[data-contact-section]")).toHaveCount(6);
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/contact\/$/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page).toHaveTitle(`${contactPage.seo.title} | Crossfit Gym`);
  await expect(contact(page).locator("address")).toHaveText([
    site.address,
    site.address,
  ]);
  for (const action of [
    contactPage.hero.call,
    contactPage.hero.directions,
    contactPage.methods.phone.action,
    contactPage.methods.visit.action,
    contactPage.location.action,
    ...contactPage.methods.socials,
  ]) {
    await expect(
      contact(page).getByRole("link", { name: action.label, exact: true }),
    ).toHaveAttribute("href", action.href);
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("responsive Contact cards and fields respect usable width and keep all actions clear", async ({
  page,
}, info) => {
  await ready(page);
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
    const boxes = await contact(page).evaluate((node) => {
      const box = (selector: string) =>
        node.querySelector(selector)!.getBoundingClientRect().toJSON();
      const preview = node.querySelector(".contact-form-preview")!;
      const style = getComputedStyle(preview);
      return {
        methods: box(".contact-methods"),
        form: box(".contact-form-preview"),
        workspace: box(".contact-workspace"),
        name: box("#contact-name"),
        email: box("#contact-email"),
        inner:
          preview.clientWidth -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight),
      };
    });
    if (boxes.workspace.width >= 960)
      expect(boxes.form.left).toBeGreaterThan(boxes.methods.right);
    else expect(boxes.form.top).toBeGreaterThan(boxes.methods.bottom);
    if (boxes.inner >= 512)
      expect(boxes.name.top).toBeCloseTo(boxes.email.top, 0);
    else expect(boxes.email.top).toBeGreaterThan(boxes.name.bottom);
    for (const link of await contact(page).getByRole("link").all()) {
      const box = await link.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
    if (info.project.name === "desktop")
      await page.screenshot({
        path: info.outputPath(`contact-${width}.png`),
        fullPage: true,
      });
  }
});

test("preview controls cannot accept input, focus or send a request", async ({
  page,
}) => {
  await ready(page);
  const outgoing: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET")
      outgoing.push(`${request.method()} ${request.url()}`);
  });
  const preview = contact(page).locator("[data-contact-message-preview]");
  await expect(preview).toContainText(contactPage.message.notice);
  for (const input of await preview
    .locator("input, select, textarea, button")
    .all())
    await expect(input).toBeDisabled();
  await expect(preview.locator("fieldset")).toHaveAttribute("disabled");
  await expect(preview.locator("option")).toHaveCount(8);
  await expect(
    contact(page).locator(
      "form, iframe, [action], [formaction], [type=submit]",
    ),
  ).toHaveCount(0);
  await preview
    .locator("#contact-name")
    .evaluate((node: HTMLInputElement) => node.focus());
  await page.keyboard.type("Private information");
  await expect(preview.locator("#contact-name")).not.toBeFocused();
  await expect(preview.locator("#contact-name")).toHaveValue("");
  expect(outgoing).toEqual([]);
});

test("keyboard FAQ activation and Membership navigation retain focus and browser history", async ({
  page,
}) => {
  await ready(page);
  const summaries = contact(page).locator("summary");
  await expect(contact(page).locator("[data-faq-list]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await summaries.first().focus();
  await expect(summaries.first()).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(contact(page).locator("details[open]")).toHaveCount(1);
  await expect(summaries.first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(contact(page).locator("details[open]")).toHaveCount(0);
  await summaries.last().focus();
  await page.keyboard.press("Space");
  await expect(
    contact(page).getByText(contactPage.faq.items[4].answer),
  ).toBeVisible();
  const link = contact(page).getByRole("link", {
    name: "Explore Membership Plans",
  });
  await link.focus();
  await expect(link).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/membership\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator("h1")).toHaveText(contactPage.hero.heading);
  await page.goForward();
  await expect(page).toHaveURL(/\/membership\/$/);
});

test("without JavaScript all contact information and native FAQ answers remain usable", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/contact/");
    await expect(contact(page).locator("[data-contact-section]")).toHaveCount(
      6,
    );
    await expect(contact(page).locator("fieldset")).toHaveAttribute("disabled");
    const summary = contact(page).locator("summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(
      contact(page).getByText(contactPage.faq.items[0].answer),
    ).toBeVisible();
    await fits(page);
    await page.screenshot({
      path: info.outputPath("contact-no-js.png"),
      fullPage: true,
    });
    await contact(page)
      .getByRole("link", { name: "Explore Membership Plans" })
      .click();
    await expect(page).toHaveURL(/\/membership\/$/);
  } finally {
    await context.close();
  }
});

test("enlarged spaced text and failed assets reflow without hiding content", async ({
  page,
}, info) => {
  await page.route("**/*.{webp,png,woff2}", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} [data-contact-page] p,[data-contact-page] label,[data-contact-page] address{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}",
  });
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
    await expect(contact(page).locator("h1")).toBeVisible();
    const positions = await contact(page).evaluate((node) => ({
      methods: node
        .querySelector(".contact-methods")!
        .getBoundingClientRect()
        .toJSON(),
      form: node
        .querySelector(".contact-form-preview")!
        .getBoundingClientRect()
        .toJSON(),
    }));
    expect(positions.form.top).toBeGreaterThan(positions.methods.bottom);
    if (info.project.name === "desktop")
      await page.screenshot({
        path: info.outputPath(`contact-enlarged-${width}.png`),
        fullPage: true,
      });
  }
  expect(
    await contact(page).evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await page.emulateMedia({ forcedColors: "active" });
  const action = contact(page).getByRole("link", {
    name: "Call Now",
    exact: true,
  });
  await action.focus();
  await expect(action).toHaveCSS("outline-style", "solid");
  await expect(contact(page).locator("fieldset")).toHaveAttribute("disabled");
});

test("the mobile navigation isolates Contact content and restores focus on dismissal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await ready(page);
  const menu = page
    .getByRole("banner")
    .getByRole("button", { name: "Menu", exact: true });
  await menu.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(0);
  await expect(page.getByRole("contentinfo")).toHaveCount(0);
  for (let index = 0; index < 20; index++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((node) => node.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(menu).toBeFocused();
  await expect(contact(page).locator("h1")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
});
