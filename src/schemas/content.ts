import { z } from "zod";
import { routes } from "@/config/routes";

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

const heroText = z.string().trim().min(1);
const heroDestination = z
  .string()
  .refine(
    (href) =>
      /^tel:\+[1-9]\d{7,14}$/.test(href) ||
      /^https:\/\/[^\s/]+/.test(href) ||
      /^\/(?!\/)\S*$/.test(href),
    "Use a tel:+ number, an https URL or a root-relative path.",
  );
export const homeHeroSchema = z.object({
  title: heroText,
  tagline: heroText,
  location: heroText,
  image: imageSchema,
  actions: z
    .array(z.object({ label: heroText, href: heroDestination }))
    .min(1)
    .max(3),
});
export type HomeHeroContent = z.infer<typeof homeHeroSchema>;

const optionalCopy = z.string().trim().min(1).nullable();
export const aboutSchema = z.object({
  story: optionalCopy,
  mission: optionalCopy,
  values: z.array(z.string().trim().min(1)),
  community: optionalCopy,
});
export type AboutContent = z.infer<typeof aboutSchema>;

export const homeStorySchema = z.object({
  heading: heroText,
  story: optionalCopy,
  link: z.object({
    label: heroText,
    href: z.string().regex(/^\/(?!\/)\S*$/),
  }),
  missing: z.object({ title: heroText, description: heroText }),
});
export type HomeStoryContent = z.infer<typeof homeStorySchema>;

export const homeStatSchema = z.object({
  value: z.number().finite().nonnegative(),
  decimals: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  suffix: z.string(),
  suffixLabel: heroText.optional(),
  label: heroText,
  // Provenance for every published number; required, never displayed.
  source: heroText,
});
export const homeStatsSchema = z.object({
  heading: heroText,
  items: z.array(homeStatSchema).max(4),
});
export type HomeStatsContent = z.infer<typeof homeStatsSchema>;

export const whyChooseUsItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: heroText,
  description: heroText,
  image: imageSchema.extend({
    src: z
      .string()
      .regex(/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/),
    alt: heroText,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  imagePosition: z.enum(["left", "center", "right"]),
  source: heroText,
});
export type WhyChooseUsItem = z.infer<typeof whyChooseUsItemSchema>;

export const homeWhyChooseUsSchema = z.object({
  heading: heroText,
  items: z.array(whyChooseUsItemSchema).superRefine((items, context) => {
    const ids = new Set<string>();
    items.forEach((item, index) => {
      if (ids.has(item.id))
        context.addIssue({
          code: "custom",
          message: "Duplicate Why choose us card ID",
          path: [index, "id"],
        });
      ids.add(item.id);
    });
  }),
});
export type HomeWhyChooseUsContent = z.infer<typeof homeWhyChooseUsSchema>;

export const homeServiceSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: heroText,
  subtitle: heroText,
  href: z
    .string()
    .refine(
      (href) => routes.some((route) => href === `${route.replace(/\/$/, "")}/`),
      "Use an existing page destination with a trailing slash.",
    ),
  image: imageSchema
    .extend({
      src: z
        .string()
        .regex(/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/),
    })
    .optional(),
});
export type HomeService = z.infer<typeof homeServiceSchema>;

export const homeServicesSchema = z.object({
  eyebrow: heroText,
  heading: heroText,
  description: heroText,
  items: z.array(homeServiceSchema).superRefine((items, context) => {
    const ids = new Set<string>();
    items.forEach((item, index) => {
      if (ids.has(item.id))
        context.addIssue({
          code: "custom",
          message: "Duplicate homepage service ID",
          path: [index, "id"],
        });
      ids.add(item.id);
    });
  }),
});
export type HomeServicesContent = z.infer<typeof homeServicesSchema>;

export const homeFeatureSchema = homeServiceSchema
  .omit({ subtitle: true })
  .extend({
    description: heroText,
    actionLabel: heroText,
  });
export type HomeFeature = z.infer<typeof homeFeatureSchema>;

export const homeFeaturesSchema = z.object({
  eyebrow: heroText,
  heading: heroText,
  description: heroText,
  action: z.object({ label: heroText, href: homeFeatureSchema.shape.href }),
  items: z.array(homeFeatureSchema).superRefine((items, context) => {
    const ids = new Set<string>();
    items.forEach((item, index) => {
      if (ids.has(item.id))
        context.addIssue({
          code: "custom",
          message: "Duplicate homepage feature ID",
          path: [index, "id"],
        });
      ids.add(item.id);
    });
  }),
});
export type HomeFeaturesContent = z.infer<typeof homeFeaturesSchema>;

export const homeMembershipPlanSchema = z.object({
  id: homeServiceSchema.shape.id,
  name: heroText,
  description: heroText,
  badge: heroText,
  featured: z.boolean(),
  priceLabel: heroText,
  benefits: z.array(heroText).min(1),
  action: z.object({ label: heroText, href: homeServiceSchema.shape.href }),
  image: homeServiceSchema.shape.image,
});
export type HomeMembershipPlan = z.infer<typeof homeMembershipPlanSchema>;

export const homeMembershipsPreviewSchema = z.object({
  status: z.literal("preview"),
  eyebrow: heroText,
  heading: heroText,
  description: heroText,
  supportingText: heroText,
  notice: heroText,
  action: z.object({ label: heroText, href: homeServiceSchema.shape.href }),
  plans: z
    .array(homeMembershipPlanSchema)
    .length(3)
    .superRefine((plans, context) => {
      const ids = new Set<string>();
      plans.forEach((plan, index) => {
        if (ids.has(plan.id))
          context.addIssue({
            code: "custom",
            message: "Duplicate homepage membership ID",
            path: [index, "id"],
          });
        ids.add(plan.id);
      });
      if (
        plans.filter((plan) => plan.featured).length !== 1 ||
        !plans[1]?.featured
      ) {
        context.addIssue({
          code: "custom",
          message: "Feature the middle preview plan.",
        });
      }
    }),
});
export type HomeMembershipsPreviewContent = z.infer<
  typeof homeMembershipsPreviewSchema
>;

export const homeSuccessStorySchema = z.object({
  id: homeServiceSchema.shape.id,
  name: heroText,
  focus: heroText,
  quote: heroText,
  image: homeServiceSchema.shape.image,
});
export type HomeSuccessStory = z.infer<typeof homeSuccessStorySchema>;

export const homeSuccessStoriesPreviewSchema = z.object({
  status: z.literal("preview"),
  eyebrow: heroText,
  heading: heroText,
  description: heroText,
  supportingText: heroText,
  notice: heroText,
  action: z.object({ label: heroText, href: homeServiceSchema.shape.href }),
  closing: z.object({
    eyebrow: heroText,
    heading: heroText,
    description: heroText,
    action: z.object({ label: heroText, href: homeServiceSchema.shape.href }),
  }),
  stories: z
    .array(homeSuccessStorySchema)
    .length(3)
    .superRefine((stories, context) => {
      const ids = new Set<string>();
      stories.forEach((story, index) => {
        if (ids.has(story.id))
          context.addIssue({
            code: "custom",
            message: "Duplicate homepage success story ID",
            path: [index, "id"],
          });
        ids.add(story.id);
      });
    }),
});
export type HomeSuccessStoriesPreviewContent = z.infer<
  typeof homeSuccessStoriesPreviewSchema
>;
