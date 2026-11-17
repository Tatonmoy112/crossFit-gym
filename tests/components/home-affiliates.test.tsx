import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeAffiliates } from "@/features/home/home-affiliates";
import { homeAffiliates } from "@/content/home-affiliates";
import { brand } from "@/content/brand";

it("server-renders an honestly labeled partnership diagram with one native inquiry action", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <HomeAffiliates content={homeAffiliates} />,
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "aria-labelledby",
    "home-affiliates-title",
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "data-surface",
    "charcoal",
  );
  expect(root.querySelector("h2")).toHaveTextContent(homeAffiliates.heading);
  expect(root.querySelector("figcaption")).toHaveTextContent(
    homeAffiliates.diagramLabel,
  );
  expect(
    [...root.querySelectorAll("li h3")].map((node) => node.textContent),
  ).toEqual(homeAffiliates.opportunities.map((item) => item.title));
  expect(root.querySelectorAll("li[data-surface=light]")).toHaveLength(3);
  expect(root.querySelectorAll("img")).toHaveLength(1);
  expect(root.querySelector("img")).toHaveAttribute("src", brand.image.src);
  expect(root.querySelector("img")).toHaveAttribute("alt", "");
  expect(root.querySelector("[data-partnership-hub] p")).toHaveTextContent(
    brand.name,
  );
  expect(root.querySelectorAll("a")).toHaveLength(1);
  expect(root.querySelector("a")).toHaveAttribute("href", "/contact");
  expect(root.querySelector("a")).toHaveTextContent("Become a Partner");
  expect(
    root.querySelector("h1,form,button,[tabindex],[data-preview],[aria-live]"),
  ).toBeNull();
  expect(root.querySelectorAll("svg:not([aria-hidden=true])")).toHaveLength(0);
});

it("renders content as escaped text rather than injected HTML", () => {
  const markup = renderToStaticMarkup(
    <HomeAffiliates
      content={{
        ...homeAffiliates,
        heading: "<em>Fixture heading</em>",
        opportunities: homeAffiliates.opportunities.map((item, i) =>
          i === 0 ? { ...item, title: "<b>Fixture tile</b>" } : item,
        ),
      }}
    />,
  );
  expect(markup).toContain("&lt;em&gt;Fixture heading&lt;/em&gt;");
  expect(markup).toContain("&lt;b&gt;Fixture tile&lt;/b&gt;");
  expect(markup).not.toContain("<em>");
  expect(markup).not.toContain("<b>");
});
