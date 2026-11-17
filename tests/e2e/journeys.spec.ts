import { expect, test } from "@playwright/test";
test("tablet and wide layouts fit the viewport", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  for (const width of [768, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/",
      "/programs/",
      "/contact/",
      "/locations/uttara/",
      "/membership/",
      "/schedule/",
      "/blog/content-preview/",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
  }
});
test("complete route inventory loads without overflow", async ({ page }) => {
  // This checks every planned route plus the Products addition, including hydration and network settling.
  test.setTimeout(120000);
  const paths = [
    "/",
    "/about/",
    "/programs/",
    "/programs/content-preview/",
    "/coaches/",
    "/coaches/content-preview/",
    "/facilities/",
    "/schedule/",
    "/membership/",
    "/gallery/",
    "/faq/",
    "/blog/",
    "/blog/content-preview/",
    "/affiliates/",
    "/locations/",
    "/locations/uttara/",
    "/contact/",
    "/careers/",
    "/careers/content-preview/",
    "/products/",
    "/supplements/",
    "/supplements/content-preview/",
    "/privacy/",
    "/terms/",
  ];
  const errors: string[] = [];
  const origin = new URL(test.info().project.use.baseURL!).origin;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400 && new URL(response.url()).origin === origin)
      errors.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  for (const path of paths) {
    expect((await page.goto(path))?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    if (path === "/programs/") {
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: "Program information is not available yet",
        }),
      ).toBeVisible();
    } else if (["/products/", "/supplements/"].includes(path)) {
      await expect(page.locator("[data-product-catalog]")).toHaveAttribute(
        "data-ready",
        "true",
      );
    } else {
      await expect(
        page.getByText("Page components are awaiting rebuild.", {
          exact: true,
        }),
      ).toBeVisible();
    }
    if (!["/products/", "/supplements/"].includes(path))
      await expect(page.locator("form, input, dialog")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(
      page.getByRole("note", { name: "Website preview" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Crossfit Gym home" }),
    ).toHaveAttribute("href", "/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("temporary page inventory supports navigation and recovery", async ({
  page,
}) => {
  await page.goto("/");
  const inventory = page.getByRole("navigation", { name: "Page inventory" });
  await expect(inventory.getByRole("link")).toHaveCount(24);
  await inventory
    .getByRole("link", { name: "/schedule/", exact: true })
    .click();
  await expect(page).toHaveURL(/\/schedule\//);
  await expect(
    page.getByRole("heading", { name: "Schedule", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to home", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Page inventory" }),
  ).toBeVisible();
});

test("skip link moves keyboard focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("unknown pages and detail slugs use the custom 404", async ({ page }) => {
  for (const path of [
    "/not-a-page/",
    "/programs/missing/",
    "/locations/missing/",
  ]) {
    expect((await page.goto(path))?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "404", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to home" }),
    ).toHaveAttribute("href", "/");
  }
});
