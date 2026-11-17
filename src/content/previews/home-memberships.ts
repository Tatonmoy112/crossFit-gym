import { homeMembershipsPreviewSchema } from "@/schemas/content";

// Owner-supplied design examples, confirmed as previews on 2026-11-17.
// These are not approved gym memberships, fees or benefits. Keep separate
// from memberships.ts and render only while site.preview is enabled.
export const homeMembershipsPreview = homeMembershipsPreviewSchema.parse({
  status: "preview",
  eyebrow: "MEMBERSHIP PLANS",
  heading: "Find Your Fit. Own Your Progress.",
  description:
    "Great results begin with the right environment and a plan that works for you. Explore flexible membership options designed to support your fitness goals, match your lifestyle, and keep you moving forward.",
  supportingText: "Your journey. Your pace. Your membership.",
  notice:
    "Illustrative membership plans. Benefits and prices are not confirmed gym offerings.",
  action: { label: "View Membership Plans", href: "/membership/" },
  plans: [
    {
      id: "essential",
      name: "Essential",
      description: "Everything you need to begin your fitness journey.",
      badge: "GET STARTED",
      featured: false,
      priceLabel: "Price to be confirmed",
      benefits: [
        "Gym floor access",
        "Strength equipment",
        "Cardio equipment",
        "Initial orientation",
      ],
      action: { label: "Choose Essential", href: "/contact/" },
    },
    {
      id: "performance",
      name: "Performance",
      description: "Take your training further with added support.",
      badge: "FEATURED PLAN",
      featured: true,
      priceLabel: "Price to be confirmed",
      benefits: [
        "Everything in Essential",
        "Group fitness classes",
        "Fitness goal review",
        "Training guidance",
      ],
      action: { label: "Choose Performance", href: "/contact/" },
    },
    {
      id: "elite",
      name: "Elite",
      description: "Personalized attention for ambitious fitness goals.",
      badge: "PREMIUM EXPERIENCE",
      featured: false,
      priceLabel: "Price to be confirmed",
      benefits: [
        "Everything in Performance",
        "Personal training sessions",
        "Customized workout plan",
        "Progress consultations",
      ],
      action: { label: "Choose Elite", href: "/contact/" },
    },
  ],
});
