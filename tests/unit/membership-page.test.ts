import { describe, expect, it } from "vitest";
import { membershipPage, membershipPageFaqs } from "@/content/membership-page";
import { membershipPlansPreview } from "@/content/previews/membership-plans";
import { homeMembershipsPreview } from "@/content/previews/home-memberships";
import { memberships } from "@/content/memberships";
import { homeFaqItems } from "@/content/home-faq";
import {
  getMembershipPageData,
  resolveMembershipPreview,
} from "@/lib/membership/page-data";
import {
  membershipPageSchema,
  membershipPreviewSchema,
} from "@/schemas/membership-page";

describe("membership page content and preview relationships", () => {
  it("resolves shared plan identities without altering real inventory or homepage benefits", () => {
    const before = JSON.stringify(homeMembershipsPreview);
    const data = getMembershipPageData(true);
    expect(data.plans.map((plan) => plan.name)).toEqual([
      "Essential",
      "Performance",
      "Elite",
    ]);
    expect(data.plans.map((plan) => plan.benefits.length)).toEqual([5, 5, 5]);
    expect(
      data.plans.filter((plan) => plan.featured).map((plan) => plan.badge),
    ).toEqual(["FEATURED EXAMPLE"]);
    expect(memberships).toEqual([]);
    expect(JSON.stringify(homeMembershipsPreview)).toBe(before);
    expect(homeMembershipsPreview.plans[2].benefits).toContain(
      "Customized workout plan",
    );
  });

  it("removes all illustrative records outside preview mode", () => {
    expect(getMembershipPageData(false)).toEqual({
      plans: [],
      comparison: [],
      benefits: [],
    });
  });

  it("preserves pending information and never treats missing inclusions as unavailable", () => {
    const rows = membershipPlansPreview.comparison;
    expect(rows).toHaveLength(10);
    for (const id of [
      "price",
      "duration",
      "hours",
      "assessment",
      "facilities",
    ]) {
      expect(
        rows
          .find((row) => row.id === id)!
          .values.every(
            (cell) =>
              cell.status === "pending" && cell.text === "To be confirmed",
          ),
      ).toBe(true);
    }
    expect(
      rows
        .find((row) => row.id === "personal-training")!
        .values.map((cell) => cell.status),
    ).toEqual(["unspecified", "unspecified", "proposed"]);
    expect(membershipPage.comparison.help).toContain(
      "does not mean the service is unavailable",
    );
  });

  it("rejects duplicate, missing or unknown plan/comparison relationships", () => {
    expect(() =>
      resolveMembershipPreview(
        membershipPlansPreview,
        homeMembershipsPreview.plans.slice(1),
      ),
    ).toThrow("Unknown membership preview identity");
    expect(() =>
      resolveMembershipPreview(membershipPlansPreview, [
        ...homeMembershipsPreview.plans,
        homeMembershipsPreview.plans[0],
      ]),
    ).toThrow("Duplicate membership identity");
    expect(() =>
      membershipPreviewSchema.parse({
        ...membershipPlansPreview,
        plans: [
          membershipPlansPreview.plans[0],
          membershipPlansPreview.plans[0],
          membershipPlansPreview.plans[2],
        ],
      }),
    ).toThrow();
    const invalid = structuredClone(membershipPlansPreview);
    invalid.comparison[0].values[0].planId = "unknown";
    expect(() => membershipPreviewSchema.parse(invalid)).toThrow(
      "Unknown comparison plan",
    );
    const duplicate = structuredClone(membershipPlansPreview);
    duplicate.comparison[0].values[0].planId = "elite";
    expect(() => membershipPreviewSchema.parse(duplicate)).toThrow(
      "Duplicate comparison plan ID",
    );
    expect(() =>
      membershipPreviewSchema.parse({
        ...membershipPlansPreview,
        comparison: membershipPlansPreview.comparison.slice(1),
      }),
    ).toThrow();
  });

  it("rejects blank content, unsupported destinations and fictional popularity", () => {
    expect(() =>
      membershipPageSchema.parse({
        ...membershipPage,
        hero: { ...membershipPage.hero, heading: " " },
      }),
    ).toThrow();
    expect(() =>
      membershipPageSchema.parse({
        ...membershipPage,
        pricing: {
          ...membershipPage.pricing,
          empty: { title: " ", description: " " },
        },
      }),
    ).toThrow();
    expect(() =>
      membershipPageSchema.parse({
        ...membershipPage,
        cta: {
          ...membershipPage.cta,
          action: { label: "Buy", href: "/checkout/" },
        },
      }),
    ).toThrow();
    expect(() =>
      membershipPreviewSchema.parse({
        ...membershipPlansPreview,
        plans: membershipPlansPreview.plans.map((plan) => ({
          ...plan,
          featured: false,
        })),
      }),
    ).toThrow();
    expect(
      membershipPlansPreview.plans.some((plan) =>
        /most popular/i.test(plan.badge),
      ),
    ).toBe(false);
  });

  it("selects six safe FAQ answers and retains the existing homepage selection", () => {
    expect(membershipPageFaqs.map((item) => item.id)).toEqual(
      membershipPage.faq.questionIds,
    );
    expect(membershipPageFaqs).toHaveLength(6);
    expect(membershipPageFaqs[2].answer).toContain("must be confirmed");
    expect(homeFaqItems.map((item) => item.id)).toEqual([
      "plans",
      "getting-started",
      "personal-training",
      "product-ordering",
      "gym-visit",
      "choosing-supplements",
    ]);
  });
});
