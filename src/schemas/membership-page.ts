import { z } from "zod";
import { faqSchema } from "./content";

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const unique = (values: string[]) => new Set(values).size === values.length;
export const membershipSectionSchema = z.object({
  eyebrow: text,
  heading: text,
  description: text,
});
const contactAction = z.object({ label: text, href: z.literal("/contact/") });
const emptyState = z.object({ title: text, description: text });

export const membershipPageSchema = z.object({
  seo: z.object({ title: text, description: text }),
  breadcrumb: z.object({ home: text, current: text }),
  hero: membershipSectionSchema.extend({
    explore: z.object({ label: text, href: z.literal("#membership-plans") }),
    contact: contactAction,
  }),
  navigationLabel: text,
  navigation: z
    .array(
      z.object({
        label: text,
        href: z.enum([
          "#membership-plans",
          "#membership-comparison",
          "#membership-how-to-join",
          "#membership-faq",
        ]),
      }),
    )
    .length(4)
    .refine(
      (links) => unique(links.map((link) => link.href)),
      "Duplicate membership fragment",
    ),
  introduction: membershipSectionSchema.extend({ supportingText: text }),
  pricing: membershipSectionSchema.extend({
    notice: text,
    inquiryNotice: text,
    empty: emptyState,
  }),
  benefits: membershipSectionSchema,
  comparison: membershipSectionSchema.extend({
    caption: text,
    help: text,
    scrollLabel: text,
    action: contactAction,
    empty: emptyState,
  }),
  joining: membershipSectionSchema.extend({
    steps: z
      .array(z.object({ id, title: text, description: text }))
      .length(3)
      .refine(
        (items) => unique(items.map((item) => item.id)),
        "Duplicate joining step",
      ),
    action: contactAction,
  }),
  faq: membershipSectionSchema.extend({
    questionIds: z
      .array(faqSchema.shape.id)
      .length(6)
      .refine(unique, "Duplicate membership FAQ ID"),
  }),
  cta: membershipSectionSchema.extend({
    action: contactAction,
    callLabel: text,
  }),
  terms: z.object({ heading: text, paragraphs: z.array(text).min(1) }),
  labels: z.object({
    pricePending: text,
    durationPending: text,
    suggestedBenefits: text,
    comparisonFeature: text,
    proposed: text,
    unspecified: text,
  }),
});

export const membershipPlanPreviewSchema = z.object({
  id,
  headline: text,
  description: text,
  badge: text,
  featured: z.boolean(),
  benefits: z.array(text).min(1),
  inquiryLabel: text,
});
export const membershipComparisonRowSchema = z.object({
  id,
  label: text,
  values: z
    .array(
      z.object({
        planId: id,
        text,
        status: z.enum(["proposed", "pending", "unspecified"]),
      }),
    )
    .length(3)
    .refine(
      (cells) => unique(cells.map((cell) => cell.planId)),
      "Duplicate comparison plan ID",
    ),
});
export const membershipPreviewSchema = z
  .object({
    status: z.literal("preview"),
    plans: z.array(membershipPlanPreviewSchema).length(3),
    comparison: z.array(membershipComparisonRowSchema).length(10),
    benefits: z
      .array(
        z.object({
          id: z.enum(["environment", "support", "lifestyle", "community"]),
          title: text,
          description: text,
        }),
      )
      .length(4),
  })
  .superRefine((value, ctx) => {
    for (const field of ["plans", "comparison", "benefits"] as const) {
      if (!unique(value[field].map((item) => item.id)))
        ctx.addIssue({
          code: "custom",
          message: `Duplicate membership ${field} ID`,
          path: [field],
        });
    }
    if (
      value.plans.filter((plan) => plan.featured).length !== 1 ||
      !value.plans.find((plan) => plan.id === "performance")?.featured
    )
      ctx.addIssue({
        code: "custom",
        message: "Feature only the Performance example",
        path: ["plans"],
      });
    const planIds = new Set(value.plans.map((plan) => plan.id));
    value.comparison.forEach((row, index) => {
      if (row.values.some((cell) => !planIds.has(cell.planId)))
        ctx.addIssue({
          code: "custom",
          message: "Unknown comparison plan",
          path: ["comparison", index],
        });
    });
  });

export type MembershipPageContent = z.infer<typeof membershipPageSchema>;
export type MembershipSectionContent = z.infer<typeof membershipSectionSchema>;
export type MembershipPlanPreview = z.infer<typeof membershipPlanPreviewSchema>;
export type MembershipComparisonRow = z.infer<
  typeof membershipComparisonRowSchema
>;
export type MembershipPreviewContent = z.infer<typeof membershipPreviewSchema>;
