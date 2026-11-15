import { expect, it } from "vitest";
import { footerContent, footerContentSchema } from "@/content/footer";
import { site } from "@/content/site";

it("L03-A02/A03: footer content preserves supplied values and registered legal destinations", () => {
  const content = footerContentSchema.parse(footerContent);
  expect(content).toMatchObject({
    address: site.address,
    phone: { label: site.phone, href: `tel:${site.telephone}` },
    directions: { label: "Get directions", href: site.directions },
    socials: [
      { label: "Facebook", href: site.facebook },
      { label: "Instagram", href: site.instagram },
    ],
    legal: [
      {
        label: "Legal",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
    legalNotice: "Legal text is awaiting approval.",
  });
});

it.each([
  { address: "" },
  { phone: { label: "Phone", href: "tel:not-a-number" } },
  { directions: { label: "Map", href: "javascript:alert(1)" } },
  { socials: [{ label: "Facebook", href: "http://example.invalid" }] },
  {
    socials: [
      { label: "Facebook", href: site.facebook },
      { label: "Facebook", href: site.facebook },
    ],
  },
  {
    legal: [
      { label: "Legal", links: [{ label: "Missing", href: "/missing" }] },
    ],
  },
  {
    legal: [
      {
        label: "Legal",
        links: [{ label: "Preview", href: "/programs/content-preview" }],
      },
    ],
  },
])(
  "L03-A02/A03: rejects invalid contact/channel/route content %#",
  (change) => {
    expect(() =>
      footerContentSchema.parse({ ...footerContent, ...change }),
    ).toThrow();
  },
);
