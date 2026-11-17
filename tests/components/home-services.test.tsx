import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeServices } from "@/features/home/home-services";
import { homeServices } from "@/content/home-services";

it("server-renders a named section with eight single card links, placeholders and no active controls", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <HomeServices content={homeServices} />,
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "aria-labelledby",
    "home-services-title",
  );
  expect(root.querySelectorAll("h2")).toHaveLength(1);
  expect(root.querySelector("h2")).toHaveTextContent(homeServices.heading);
  expect(root.querySelectorAll("h3")).toHaveLength(8);
  expect(root.querySelectorAll("a")).toHaveLength(8);
  expect(root.querySelectorAll("img, h1, [inert]")).toHaveLength(0);
  expect(root.querySelector("[data-services-controls]")).toHaveAttribute(
    "hidden",
  );
  homeServices.items.forEach((item, index) => {
    const link = root.querySelectorAll("a")[index];
    expect(link.getAttribute("href")).toMatch(/^\/contact\/?$/);
    expect(link).toHaveAttribute(
      "aria-label",
      `Ask about ${item.title} ${item.subtitle}`,
    );
    expect(link.querySelector("p")).toHaveTextContent(item.subtitle);
    expect(link.textContent).toContain(`${item.title} ${item.subtitle}`);
    expect(link.querySelector("svg")?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(link.closest('[aria-roledescription="slide"]')).toHaveAttribute(
      "aria-label",
      `${item.title}, ${index + 1} of 8`,
    );
  });
});

it("omits an empty services section", () => {
  expect(
    renderToStaticMarkup(
      <HomeServices content={{ ...homeServices, items: [] }} />,
    ),
  ).toBe("");
});
