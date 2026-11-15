import { z } from "zod";

export const imageSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
});
export const sectionSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  bullets: z.array(z.string()).default([]),
});
export const catalogSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  image: imageSchema.optional(),
  sections: z.array(sectionSchema),
  relatedIds: z.array(z.string()).default([]),
  programIds: z.array(z.string()).default([]),
  coachIds: z.array(z.string()).default([]),
  locationIds: z.array(z.string()).default([]),
  membershipIds: z.array(z.string()).default([]),
  status: z.enum(["approved", "preview"]),
  author: z.string().optional(),
  date: z.iso.date().optional(),
  destination: z
    .url()
    .refine(
      (value) => /^https?:\/\//.test(value),
      "Only HTTP(S) destinations are allowed.",
    )
    .optional(),
  variants: z.array(z.string()).default([]),
  priceLabel: z.string().optional(),
  role: z.string().optional(),
});
export type CatalogItem = z.infer<typeof catalogSchema>;
export type ImageAsset = z.infer<typeof imageSchema>;
export const faqSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string(),
});
export type FAQ = z.infer<typeof faqSchema>;
export const classSchema = z.object({
  id: z.string(),
  name: z.string(),
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  duration: z.number().positive(),
  programId: z.string(),
  coachId: z.string(),
  locationId: z.string(),
  description: z.string(),
});
export type ClassSession = z.infer<typeof classSchema>;
export const membershipSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  monthly: z.string().optional(),
  annual: z.string().optional(),
  features: z.array(z.string()),
  highlighted: z.boolean().default(false),
});
export type Membership = z.infer<typeof membershipSchema>;
export const gallerySchema = imageSchema.extend({
  id: z.string(),
  category: z.string(),
  caption: z.string(),
});
export type GalleryImage = z.infer<typeof gallerySchema>;
export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^[+\d\s()-]{7,20}$/.test(value),
      "Enter a valid phone number.",
    ),
  topic: z.string().min(1, "Choose an inquiry topic."),
  interest: z.string().optional(),
  message: z.string().trim().min(10, "Please include at least 10 characters."),
  consent: z
    .boolean()
    .refine(Boolean, "Please acknowledge the privacy notice."),
});
export type Inquiry = z.infer<typeof inquirySchema>;
