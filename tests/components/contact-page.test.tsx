import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { contactPage } from "@/content/contact-page";
import { ContactPage } from "@/features/contact/contact-page";

function markup(preview: boolean) {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <ContactPage content={contactPage} preview={preview} />,
  );
  return root;
}

it("server-renders six independently named sections, exact paragraphs and one H1", () => {
  const root = markup(true);
  expect(
    [...root.querySelectorAll("[data-contact-section]")].map((section) =>
      section.getAttribute("data-contact-section"),
    ),
  ).toEqual([
    "hero",
    "introduction",
    "methods",
    "location",
    "faq",
    "invitation",
  ]);
  expect(root.querySelectorAll("h1")).toHaveLength(1);
  expect(root.querySelector("h1")).toHaveTextContent(contactPage.hero.heading);
  for (const section of [
    contactPage.hero,
    contactPage.introduction,
    contactPage.location,
    contactPage.invitation,
  ]) {
    section.paragraphs.forEach((text) =>
      expect(root.textContent).toContain(text),
    );
  }
  for (const section of root.querySelectorAll("section")) {
    expect(
      root.querySelector(`#${section.getAttribute("aria-labelledby")}`),
    ).not.toBeNull();
  }
  expect(
    [...root.querySelectorAll("address")].map((address) => address.textContent),
  ).toEqual([contactPage.location.address, contactPage.location.address]);
  expect(root.querySelectorAll("details")).toHaveLength(5);
  expect(root.querySelectorAll("details[open]")).toHaveLength(0);
  contactPage.faq.items.forEach((faq) =>
    expect(root.textContent).toContain(faq.answer),
  );
});

it("renders an explicitly disabled, labelled preview with no form or submit destination", () => {
  const root = markup(true);
  const preview = root.querySelector("[data-contact-message-preview]")!;
  expect(preview).toHaveTextContent(contactPage.message.notice);
  expect(preview.querySelector("fieldset")).toHaveAttribute("disabled");
  const fields = [...preview.querySelectorAll("input, select, textarea")];
  expect(fields).toHaveLength(6);
  fields.forEach((field) => {
    expect(field).toBeDisabled();
    expect(preview.querySelector(`label[for="${field.id}"]`)).not.toBeNull();
  });
  expect(preview.querySelectorAll("[required]")).toHaveLength(4);
  expect(preview.querySelector("button")).toBeDisabled();
  expect(preview.querySelector("button")).toHaveAttribute("type", "button");
  expect(
    root.querySelector(
      "form, iframe, script, [action], [formaction], [type=submit]",
    ),
  ).toBeNull();
});

it("omits the whole message preview outside site preview and keeps every factual section", () => {
  const root = markup(false);
  expect(
    root.querySelector(
      "[data-contact-message-preview], fieldset, input, textarea, select, button",
    ),
  ).toBeNull();
  expect(root.textContent).not.toContain(contactPage.message.notice);
  expect(root.querySelectorAll("[data-contact-section]")).toHaveLength(6);
  expect(root.querySelectorAll(".contact-methods .contact-card")).toHaveLength(
    2,
  );
  expect(
    root.querySelector(".contact-workspace-without-preview"),
  ).not.toBeNull();
});

it("uses native real phone, directions and social actions and only the existing Membership route", () => {
  const root = markup(true);
  const links = [...root.querySelectorAll("a")];
  expect(links).toHaveLength(9);
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    contactPage.hero.call.href,
    contactPage.hero.directions.href,
    contactPage.methods.phone.action.href,
    contactPage.methods.visit.action.href,
    ...contactPage.methods.socials.map((social) => social.href),
    contactPage.location.action.href,
    expect.stringMatching(/^\/membership\/?$/),
    contactPage.invitation.call.href,
  ]);
  root
    .querySelectorAll("svg")
    .forEach((icon) => expect(icon).toHaveAttribute("aria-hidden", "true"));
});
