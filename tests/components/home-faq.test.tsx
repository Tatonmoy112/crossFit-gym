import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeFaq } from "@/features/home/home-faq";
import { homeFaq, homeFaqItems } from "@/content/home-faq";

it("exports six closed native disclosures with all answer text and the real Contact destination", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <HomeFaq content={homeFaq} items={homeFaqItems} />,
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "aria-labelledby",
    "home-faq-title",
  );
  expect(root.querySelector("h2")).toHaveTextContent(homeFaq.heading);
  expect(root.querySelectorAll("details")).toHaveLength(6);
  expect(root.querySelectorAll("details[open]")).toHaveLength(0);
  expect(
    [...root.querySelectorAll("summary .faq-question-text")].map(
      (node) => node.textContent,
    ),
  ).toEqual(homeFaqItems.map((item) => item.question));
  expect(
    [...root.querySelectorAll("[data-faq-answer]")].map(
      (node) => node.textContent,
    ),
  ).toEqual(homeFaqItems.map((item) => item.answer));
  expect(root.querySelector("a")).toHaveAttribute("href", "/contact");
  expect(root.querySelectorAll("a")).toHaveLength(1);
  expect(
    root.querySelector("[data-preview],h1,[aria-live],form,img"),
  ).toBeNull();
  expect(root.querySelector("[data-ready]")).toBeNull();
});
