import { describe, expect, it } from "vitest";
import { homeAffiliates } from "@/content/home-affiliates";
import { affiliateOffering } from "@/content/affiliates";
import { homeAffiliatesSchema } from "@/schemas/home-affiliates";

describe("homepage partnership invitation", () => {
  it("contains the approved invitation and three opportunity categories without creating an offering", () => {
    expect(homeAffiliates.heading).toBe(
      "Stronger Together. Greater Every Day.",
    );
    expect(homeAffiliates.description).toContain(
      "We welcome opportunities to collaborate",
    );
    expect(homeAffiliates.diagramLabel).toBe("Partnership opportunities");
    expect(homeAffiliates.opportunities.map((item) => item.title)).toEqual([
      "Fitness Brands",
      "Industry Professionals",
      "Wellness Partners",
    ]);
    expect(homeAffiliates.action).toEqual({
      label: "Become a Partner",
      href: "/contact/",
    });
    expect(affiliateOffering).toBeNull();
  });

  it("rejects missing/duplicate opportunity identities and unknown icon relationships", () => {
    expect(() =>
      homeAffiliatesSchema.parse({
        ...homeAffiliates,
        opportunities: homeAffiliates.opportunities.slice(1),
      }),
    ).toThrow();
    expect(() =>
      homeAffiliatesSchema.parse({
        ...homeAffiliates,
        opportunities: [
          homeAffiliates.opportunities[0],
          homeAffiliates.opportunities[0],
          homeAffiliates.opportunities[2],
        ],
      }),
    ).toThrow("Duplicate partnership opportunity ID");
    expect(() =>
      homeAffiliatesSchema.parse({
        ...homeAffiliates,
        opportunities: [
          { id: "unknown", title: "Fixture" },
          ...homeAffiliates.opportunities.slice(1),
        ],
      }),
    ).toThrow();
  });

  it("rejects blank headings, descriptions, labels and tile titles", () => {
    for (const field of ["eyebrow", "heading", "description", "diagramLabel"]) {
      expect(() =>
        homeAffiliatesSchema.parse({ ...homeAffiliates, [field]: " " }),
      ).toThrow();
    }
    expect(() =>
      homeAffiliatesSchema.parse({
        ...homeAffiliates,
        opportunities: homeAffiliates.opportunities.map((item, i) =>
          i === 0 ? { ...item, title: " " } : item,
        ),
      }),
    ).toThrow();
    expect(() =>
      homeAffiliatesSchema.parse({
        ...homeAffiliates,
        action: { label: " ", href: "/contact/" },
      }),
    ).toThrow();
  });

  it("keeps the CTA on the confirmed inquiry route", () => {
    for (const href of [
      "/affiliates/",
      "javascript:alert(1)",
      "https://example.com/",
    ]) {
      expect(() =>
        homeAffiliatesSchema.parse({
          ...homeAffiliates,
          action: { ...homeAffiliates.action, href },
        }),
      ).toThrow();
    }
  });
});
