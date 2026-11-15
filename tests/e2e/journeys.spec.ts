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
    "/supplements/",
    "/supplements/content-preview/",
    "/privacy/",
    "/terms/",
  ];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      response.url().startsWith("http://127.0.0.1:3000/")
    )
      errors.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  for (const path of paths) {
    expect((await page.goto(path))?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("gallery opens and closes with Escape", async ({ page }) => {
  await page.goto("/gallery/");
  await page.getByRole("button", { name: /Enlarge/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Enlarge/ })).toBeFocused();
});
test("FAQ search updates URL and clears", async ({ page }) => {
  await page.goto("/faq/");
  await page.getByRole("searchbox").fill("zzzz");
  await expect(page).toHaveURL(/q=zzzz/);
  await expect(page.getByText("No matching questions.")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".faq-list details")).toHaveCount(4);
});
test("invalid contact details are rejected without network submission", async ({
  page,
}) => {
  await page.goto("/contact/?topic=Membership&interest=Test%20plan");
  await expect(page.getByLabel("I’m interested in")).toHaveValue("Membership");
  await expect(
    page.getByLabel("Program, plan or subject (optional)"),
  ).toHaveValue("Test plan");
  await page.getByRole("button", { name: "Check inquiry details" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
});
test("unknown pages use the custom 404", async ({ page }) => {
  expect((await page.goto("/not-a-page/"))?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "404", exact: true }),
  ).toBeVisible();
});
test("mobile navigation opens, follows links and closes", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Class schedule" })
    .click();
  await expect(page).toHaveURL(/\/schedule\//);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
