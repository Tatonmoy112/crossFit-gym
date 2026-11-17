import { homeAffiliatesSchema } from "@/schemas/home-affiliates";

// Owner-approved invitation and diagram, 2026-11-17. These are opportunity
// categories, not confirmed partners or an affiliate/referral offering.
export const homeAffiliates = homeAffiliatesSchema.parse({
  eyebrow: "OUR AFFILIATES",
  heading: "Stronger Together. Greater Every Day.",
  description:
    "We believe great fitness journeys are built through strong connections. We welcome opportunities to collaborate with fitness brands, industry professionals, and wellness partners, and aim to bring more value, better experiences, and exciting opportunities to our growing fitness community.",
  diagramLabel: "Partnership opportunities",
  opportunities: [
    { id: "fitness-brands", title: "Fitness Brands" },
    { id: "industry-professionals", title: "Industry Professionals" },
    { id: "wellness-partners", title: "Wellness Partners" },
  ],
  action: { label: "Become a Partner", href: "/contact/" },
});
