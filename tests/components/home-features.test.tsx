import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeFeatures } from "@/features/home/home-features";
import { homeFeatures } from "@/content/home-features";

it("server-renders all six cards with separate real CTA links and an intact native fallback", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <HomeFeatures content={homeFeatures} />,
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "aria-labelledby",
    "home-features-title",
  );
  expect(root.querySelector("h2")).toHaveTextContent(homeFeatures.heading);
  expect(root.querySelectorAll("h3")).toHaveLength(6);
  expect(root.querySelectorAll("a")).toHaveLength(7);
  expect(root.querySelectorAll("img, [inert], h1")).toHaveLength(0);
  expect(root.querySelector("[data-features-controls]")).toHaveAttribute(
    "hidden",
  );
  expect(root.querySelector("[data-features-progress]")).toHaveAttribute(
    "hidden",
  );
  homeFeatures.items.forEach((item, index) => {
    const card = root.querySelectorAll("[data-home-feature-card]")[index];
    expect(card.querySelector("h3")).toHaveTextContent(item.title);
    expect(card.querySelector("p")).toHaveTextContent(item.description);
    const link = card.querySelector("a")!;
    expect(link).toHaveTextContent(item.actionLabel);
    expect(link.getAttribute("href")).toBe(item.href.slice(0, -1));
    expect(link.querySelector("[aria-hidden]")).not.toBeNull();
    expect(card.closest('[aria-roledescription="slide"]')).toHaveAttribute(
      "aria-label",
      `${item.title}, ${index + 1} of 6`,
    );
  });
});

it("omits an empty features section", () => {
  expect(
    renderToStaticMarkup(
      <HomeFeatures content={{ ...homeFeatures, items: [] }} />,
    ),
  ).toBe("");
});
