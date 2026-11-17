import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HomeSuccessStories } from "@/features/home/home-success-stories";
import { homeSuccessStoriesPreview as content } from "@/content/previews/home-success-stories";

it("server-renders all quotes, the disclosure and two real actions before carousel initialization", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <HomeSuccessStories content={content} />,
  );
  expect(root.querySelector("section")).toHaveAttribute(
    "aria-describedby",
    "home-success-stories-notice",
  );
  expect(root.querySelector("h2")).toHaveTextContent(content.heading);
  expect(root.querySelector('[role="note"]')).toHaveTextContent(content.notice);
  expect(root).toHaveTextContent(content.description);
  expect(root).toHaveTextContent(content.supportingText);
  expect(root).toHaveTextContent(content.closing.heading);
  expect(root).toHaveTextContent(content.closing.description);
  expect(root.querySelectorAll("blockquote")).toHaveLength(3);
  content.stories.forEach((story, index) => {
    const card = root.querySelectorAll("[data-success-story]")[index];
    expect(card.querySelector("blockquote")).toHaveTextContent(story.quote);
    expect(card.querySelector("figcaption")).toHaveTextContent(story.name);
    expect(card.closest('[aria-roledescription="slide"]')).toHaveAttribute(
      "aria-label",
      `${story.name}, ${index + 1} of 3`,
    );
    expect(card.querySelector("a,button,[tabindex]")).toBeNull();
  });
  expect(
    root.querySelectorAll("h1,img,form,script,[inert],[data-success-active]"),
  ).toHaveLength(0);
  expect(root.querySelectorAll("a")).toHaveLength(2);
  root
    .querySelectorAll("a")
    .forEach((link) =>
      expect(link.getAttribute("href")).toMatch(/^\/contact\/?$/),
    );
  expect(root.querySelectorAll("button[hidden]")).toHaveLength(2);
  expect(root.querySelector('[data-slot="carousel-content"]')).toHaveAttribute(
    "tabindex",
    "0",
  );
});
