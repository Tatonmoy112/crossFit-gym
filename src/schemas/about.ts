import { z } from "zod";
import { routes } from "@/config/routes";
import { imageSchema } from "./content";

const text = z.string().trim().min(1);
const paragraphs = z.array(text).min(1);
const introduction = z.object({ eyebrow: text, heading: text, paragraphs });
const action = z.object({
  label: text,
  href: z
    .string()
    .refine(
      (href) => routes.some((route) => `${route.replace(/\/$/, "")}/` === href),
      "Use an existing page destination with a trailing slash.",
    ),
});
const photo = imageSchema.extend({
  src: z.string().regex(/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/),
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
const value = z.object({
  id: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
  title: text,
  description: text,
});
const values = z
  .array(value)
  .length(4)
  .superRefine((items, context) => {
    if (new Set(items.map((item) => item.id)).size !== items.length)
      context.addIssue({
        code: "custom",
        message: "About item IDs must be unique.",
      });
  });

export const homeAboutSchema = introduction.extend({ image: photo, action });
export type HomeAboutContent = z.infer<typeof homeAboutSchema>;

export const aboutPageSchema = z.object({
  seo: z.object({ title: text, description: text }),
  hero: introduction.extend({ image: photo }),
  story: introduction,
  purpose: z.object({
    eyebrow: text,
    heading: text,
    mission: z.object({ title: text, heading: text, paragraphs }),
    vision: z.object({ title: text, heading: text, paragraphs }),
  }),
  values: introduction.extend({ items: values }),
  experience: introduction.extend({
    items: z
      .array(
        value.extend({
          icon: z.enum(["welcome", "goals", "motivation", "community"]),
        }),
      )
      .length(4)
      .superRefine((items, context) => {
        if (new Set(items.map((item) => item.id)).size !== items.length)
          context.addIssue({
            code: "custom",
            message: "Experience IDs must be unique.",
          });
      }),
  }),
  approach: introduction.extend({ philosophy: text }),
  community: introduction,
  membership: introduction.extend({ action }),
  cta: introduction.extend({ primary: action, secondary: action }),
});
export type AboutPageContent = z.infer<typeof aboutPageSchema>;
