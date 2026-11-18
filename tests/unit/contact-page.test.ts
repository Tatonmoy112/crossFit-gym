import { expect, it } from "vitest";
import { contactPage } from "@/content/contact-page";
import { site } from "@/content/site";
import { contactPageSchema } from "@/schemas/contact-page";

it("validates the supplied Contact copy and derives every business value from site content", () => {
  expect(contactPageSchema.parse(contactPage)).toEqual(contactPage);
  expect(contactPage.hero.heading).toBe(
    "Let's Connect. Your Fitness Journey Matters.",
  );
  expect(contactPage.methods.phone.value).toBe(site.phone);
  expect(contactPage.methods.phone.action.href).toBe(`tel:${site.telephone}`);
  expect(contactPage.hero.call.href).toBe(`tel:${site.telephone}`);
  expect(contactPage.invitation.call.href).toBe(`tel:${site.telephone}`);
  expect(contactPage.methods.visit.address).toBe(site.address);
  expect(contactPage.location.address).toBe(site.address);
  expect([
    contactPage.hero.directions.href,
    contactPage.methods.visit.action.href,
    contactPage.location.action.href,
  ]).toEqual(Array(3).fill(site.directions));
  expect(contactPage.methods.socials.map((social) => social.href)).toEqual([
    site.facebook,
    site.instagram,
  ]);
  expect(contactPage.invitation.membership.href).toBe("/membership/");
  expect(contactPage.message.topics.map((topic) => topic.label)).toEqual([
    "General Inquiry",
    "Gym Membership",
    "Personal Training",
    "Gym Facilities & Visit",
    "Supplements & Fitness Products",
    "Partnership & Collaboration",
    "Other",
  ]);
  expect(contactPage.faq.items.at(-1)?.answer).toBe(
    "Response times have not been confirmed. Please call the gym for current information.",
  );
});

it.each([
  "",
  "javascript:alert(1)",
  "mailto:unconfirmed@example.com",
  "/contact-us/",
  "https://example.com/",
  "tel:+8801111111111",
])("rejects unknown or unavailable destinations: %s", (href) => {
  const candidate = structuredClone(contactPage);
  candidate.hero.call.href = href;
  expect(contactPageSchema.safeParse(candidate).success).toBe(false);
});

it("rejects blank content and duplicate or malformed identifiers", () => {
  const blank = structuredClone(contactPage);
  blank.introduction.paragraphs[0] = "  ";
  expect(contactPageSchema.safeParse(blank).success).toBe(false);
  const topics = structuredClone(contactPage);
  topics.message.topics[1].id = topics.message.topics[0].id;
  expect(contactPageSchema.safeParse(topics).success).toBe(false);
  const faqs = structuredClone(contactPage);
  faqs.faq.items[1].id = faqs.faq.items[0].id;
  expect(contactPageSchema.safeParse(faqs).success).toBe(false);
  faqs.faq.items[1].id = "Invalid ID";
  expect(contactPageSchema.safeParse(faqs).success).toBe(false);
});
