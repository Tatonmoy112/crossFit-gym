import { z } from "zod";

const requiredText = z.string().trim().min(1);

export const partnershipOpportunitySchema = z.object({
  id: z.enum(["fitness-brands", "industry-professionals", "wellness-partners"]),
  title: requiredText,
});

export const homeAffiliatesSchema = z.object({
  eyebrow: requiredText,
  heading: requiredText,
  description: requiredText,
  diagramLabel: requiredText,
  opportunities: z
    .array(partnershipOpportunitySchema)
    .length(3)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      "Duplicate partnership opportunity ID",
    ),
  action: z.object({ label: requiredText, href: z.literal("/contact/") }),
});

export type PartnershipOpportunity = z.infer<
  typeof partnershipOpportunitySchema
>;
export type HomeAffiliatesContent = z.infer<typeof homeAffiliatesSchema>;
