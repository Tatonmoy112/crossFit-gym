import { z } from "zod";
import { sectionSchema } from "@/schemas/content";
const offeringSchema = z.object({
  title: z.string(),
  description: z.string(),
  tracks: z.array(sectionSchema),
  benefits: z.array(z.string()),
  coachSlugs: z.array(z.string()),
  providers: z.array(
    z.object({
      label: z.string(),
      href: z.url().refine((value) => /^https?:\/\//.test(value)),
    }),
  ),
});
export const affiliateOffering: z.infer<typeof offeringSchema> | null =
  offeringSchema.nullable().parse(null);
