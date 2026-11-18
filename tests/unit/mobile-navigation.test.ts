import { expect, it } from "vitest";
import {
  mobileDrawerContent,
  mobileDrawerContentSchema,
} from "@/content/mobile-navigation";
import { site } from "@/content/site";
import { routes } from "@/config/routes";

it("uses supplied gym contacts and an existing contact destination", () => {
  expect(mobileDrawerContent.phone).toEqual({
    label: `Call ${site.phone}`,
    href: `tel:${site.telephone}`,
  });
  expect(mobileDrawerContent.location).toBe(site.shortAddress);
  expect(routes).toContain(mobileDrawerContent.contact.href.replace(/\/$/, ""));
});

it("rejects unsafe phone links and unregistered contact destinations", () => {
  expect(
    mobileDrawerContentSchema.safeParse({
      ...mobileDrawerContent,
      phone: { label: "Call", href: "javascript:alert(1)" },
    }).success,
  ).toBe(false);
  expect(
    mobileDrawerContentSchema.safeParse({
      ...mobileDrawerContent,
      contact: { label: "Contact", href: "/missing/" },
    }).success,
  ).toBe(false);
});
