import { expect, it } from "vitest";
import { homeMembershipsPreview } from "@/content/previews/home-memberships";
import { memberships } from "@/content/memberships";
import { homeMembershipsPreviewSchema } from "@/schemas/content";

it("keeps the supplied three plan examples separate from real memberships and prices", () => {
  expect(memberships).toEqual([]);
  expect(homeMembershipsPreview.status).toBe("preview");
  expect(homeMembershipsPreview.heading).toBe(
    "Find Your Fit. Own Your Progress.",
  );
  expect(homeMembershipsPreview.description).toBe(
    "Great results begin with the right environment and a plan that works for you. Explore flexible membership options designed to support your fitness goals, match your lifestyle, and keep you moving forward.",
  );
  expect(homeMembershipsPreview.supportingText).toBe(
    "Your journey. Your pace. Your membership.",
  );
  expect(
    homeMembershipsPreview.plans.map((plan) => [
      plan.name,
      plan.description,
      plan.benefits,
    ]),
  ).toEqual([
    [
      "Essential",
      "Everything you need to begin your fitness journey.",
      [
        "Gym floor access",
        "Strength equipment",
        "Cardio equipment",
        "Initial orientation",
      ],
    ],
    [
      "Performance",
      "Take your training further with added support.",
      [
        "Everything in Essential",
        "Group fitness classes",
        "Fitness goal review",
        "Training guidance",
      ],
    ],
    [
      "Elite",
      "Personalized attention for ambitious fitness goals.",
      [
        "Everything in Performance",
        "Personal training sessions",
        "Customized workout plan",
        "Progress consultations",
      ],
    ],
  ]);
  expect(homeMembershipsPreview.notice).toBe(
    "Illustrative membership plans. Benefits and prices are not confirmed gym offerings.",
  );
  expect(homeMembershipsPreview.action).toEqual({
    label: "View Membership Plans",
    href: "/membership/",
  });
  homeMembershipsPreview.plans.forEach((plan) => {
    expect(plan.priceLabel).toBe("Price to be confirmed");
    expect(plan.action).toEqual({
      label: `Choose ${plan.name}`,
      href: "/contact/",
    });
    expect(plan.image).toBeUndefined();
  });
  expect(homeMembershipsPreview.plans[1]).toMatchObject({
    featured: true,
    badge: "FEATURED PLAN",
  });
});

it.each([
  [
    "approved status",
    (c: typeof homeMembershipsPreview) =>
      Object.assign(c, { status: "approved" }),
  ],
  [
    "duplicate ID",
    (c: typeof homeMembershipsPreview) => (c.plans[1].id = c.plans[0].id),
  ],
  [
    "missing page",
    (c: typeof homeMembershipsPreview) =>
      (c.plans[0].action.href = "/membership-plans/essential/"),
  ],
  [
    "external action",
    (c: typeof homeMembershipsPreview) =>
      (c.action.href = "https://example.com/"),
  ],
  [
    "blank benefit",
    (c: typeof homeMembershipsPreview) => (c.plans[0].benefits[0] = " "),
  ],
  ["blank notice", (c: typeof homeMembershipsPreview) => (c.notice = " ")],
  [
    "extra featured plan",
    (c: typeof homeMembershipsPreview) => (c.plans[0].featured = true),
  ],
  [
    "wrong featured position",
    (c: typeof homeMembershipsPreview) => {
      c.plans[1].featured = false;
      c.plans[2].featured = true;
    },
  ],
  [
    "extra plan",
    (c: typeof homeMembershipsPreview) => c.plans.push(c.plans[0]),
  ],
  [
    "remote image",
    (c: typeof homeMembershipsPreview) =>
      (c.plans[0].image = {
        src: "https://example.com/image.webp",
        alt: "Photo",
        width: 600,
        height: 800,
      }),
  ],
])("rejects %s", (_name, mutate) => {
  const content = structuredClone(homeMembershipsPreview);
  mutate(content);
  expect(homeMembershipsPreviewSchema.safeParse(content).success).toBe(false);
});

it("accepts future local photography metadata without populating a real catalog", () => {
  const content = structuredClone(homeMembershipsPreview);
  content.plans[0].image = {
    src: "/images/membership.webp",
    alt: "Owner-approved gym photograph",
    width: 600,
    height: 800,
  };
  expect(homeMembershipsPreviewSchema.safeParse(content).success).toBe(true);
  expect(memberships).toEqual([]);
});
