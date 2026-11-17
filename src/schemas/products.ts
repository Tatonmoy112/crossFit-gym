import { z } from "zod";
import { productCategoryIds } from "@/config/products";
import { imageSchema } from "./content";

const text = z.string().trim().min(1);
export const productCategorySchema = z.object({
  id: z.enum(productCategoryIds),
  label: text,
});
export type ProductCategory = z.infer<typeof productCategorySchema>;

export const productSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .refine(
      (id) => id !== "content-preview",
      "Reserved structure-preview path.",
    ),
  name: text,
  summary: text,
  categoryId: z.enum(productCategoryIds),
  status: z.enum(["approved", "preview"]),
  price: z.number().nonnegative().nullable(),
  images: z
    .array(
      imageSchema.extend({
        alt: text,
        src: z
          .string()
          .regex(/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/),
      }),
    )
    .default([]),
});
export type Product = z.infer<typeof productSchema>;

export const productDetailSchema = z.object({
  productId: productSchema.shape.id,
  status: z.enum(["approved", "preview"]),
  headline: text,
  description: z.array(text).min(1),
  highlights: z.array(text).min(1),
  idealFor: text,
  guidance: z
    .object({
      heading: z.enum(["How to Use", "Suggested Exercises"]),
      body: text,
    })
    .nullable(),
  specifications: z
    .array(z.object({ label: text, value: text.nullable() }))
    .min(1)
    .superRefine((rows, context) => {
      const labels = new Set<string>();
      rows.forEach((row, index) => {
        if (labels.has(row.label))
          context.addIssue({
            code: "custom",
            message: "Duplicate specification label",
            path: [index, "label"],
          });
        labels.add(row.label);
      });
    }),
});
export type ProductDetail = z.infer<typeof productDetailSchema>;
export const productDetailsSchema = z.array(productDetailSchema);

export const productsSchema = z
  .array(productSchema)
  .superRefine((items, context) => {
    const ids = new Set<string>();
    items.forEach((item, index) => {
      if (ids.has(item.id))
        context.addIssue({
          code: "custom",
          message: "Duplicate product ID",
          path: [index, "id"],
        });
      ids.add(item.id);
    });
  });

export const productShopCopySchema = z.object({
  eyebrow: text,
  heading: text,
  introduction: text,
  catalogHeading: text,
  previewNotice: text,
  pendingPrice: text,
  pendingPhotography: text,
  pendingOptions: text,
  emptyTitle: text,
  emptyDescription: text,
  noMatchTitle: text,
  noMatchDescription: text,
  contact: z.object({ label: text, href: z.literal("/contact/") }),
  call: z.object({
    label: text,
    href: z.string().regex(/^tel:\+[1-9]\d{7,14}$/),
  }),
});
export type ProductShopCopy = z.infer<typeof productShopCopySchema>;
