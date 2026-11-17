import { z } from "zod";
import { faqSchema } from "./content";

const uniqueIds = (ids: string[]) => new Set(ids).size === ids.length;

export const faqCollectionSchema = z
  .array(faqSchema)
  .refine(
    (items) => uniqueIds(items.map((item) => item.id)),
    "Duplicate FAQ ID",
  );

export const homeFaqSchema = z.object({
  eyebrow: z.string().trim().min(1),
  heading: z.string().trim().min(1),
  description: z.string().trim().min(1),
  questionIds: z
    .array(faqSchema.shape.id)
    .min(1)
    .refine(uniqueIds, "Duplicate homepage FAQ ID"),
  closing: z.object({
    heading: z.string().trim().min(1),
    description: z.string().trim().min(1),
    action: z.object({
      label: z.literal("Contact Us"),
      href: z.literal("/contact/"),
    }),
  }),
});

export type HomeFaqContent = z.infer<typeof homeFaqSchema>;
