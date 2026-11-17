import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeProductCategories } from "@/features/home/home-product-categories";
import { homeProductCategoriesPreview as content } from "@/content/previews/home-product-categories";

it("server-renders the supplied category copy, disclosure and real links before enhancement", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <HomeProductCategories content={content} />,
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "aria-describedby",
    "home-product-categories-notice",
  );
  expect(root.querySelector("h2")).toHaveTextContent(content.heading);
  expect(root.querySelector('[role="note"]')).toHaveTextContent(content.notice);
  expect(root).toHaveTextContent(content.description);
  const cards = root.querySelectorAll("[data-product-category]");
  expect(cards).toHaveLength(4);
  content.categories.forEach((category, index) => {
    const card = cards[index];
    expect(card.querySelector("h3")).toHaveTextContent(category.title);
    expect(card.querySelector("p")).toHaveTextContent(category.description);
    expect(card.querySelector("a")).toHaveTextContent(category.action.label);
    expect(card.closest('[aria-roledescription="slide"]')).toHaveAttribute(
      "aria-label",
      `${category.title}, ${index + 1} of 4`,
    );
  });
  expect(root.querySelectorAll("a")).toHaveLength(5);
  root
    .querySelectorAll("a")
    .forEach((link) =>
      expect(link.getAttribute("href")).toMatch(
        /^\/products\/?(?:\?category=[a-z-]+)?$/,
      ),
    );
  expect(
    root.querySelectorAll("h1,img,form,script,[inert],[data-category-active]"),
  ).toHaveLength(0);
  expect(root.querySelectorAll("button[hidden]")).toHaveLength(2);
  expect(root.querySelector('[data-slot="carousel-content"]')).toHaveAttribute(
    "tabindex",
    "0",
  );
});
