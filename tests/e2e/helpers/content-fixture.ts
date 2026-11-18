import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Page } from "@playwright/test";
import { loadServerComponent } from "./server-component";

const { ContentState } = loadServerComponent<
  typeof import("@/components/shared/content-state")
>("src/components/shared/content-state.tsx");
const { Container } = loadServerComponent<
  typeof import("@/components/shared/container")
>("src/components/shared/container.tsx");

// Static component specimen in a real stylesheet host, never an application route.
// Playwright evaluation also works when application JavaScript is disabled.
export async function mountContentFixture(page: Page) {
  await page.goto("/about/");
  await page.waitForLoadState("networkidle");
  const markup = renderToStaticMarkup(
    React.createElement(
      "section",
      { className: "py-8" },
      React.createElement(
        Container,
        null,
        React.createElement("h1", null, "Component specimen"),
        React.createElement(ContentState, {
          title: "Program information is not available yet",
          description:
            "No approved program details have been supplied for this website.",
        }),
        React.createElement("a", { href: "/" }, "Back to home"),
      ),
    ),
  );
  await page.evaluate((markup) => {
    document.querySelector("main")!.innerHTML = markup;
  }, markup);
}
