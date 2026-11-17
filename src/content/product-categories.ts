import { z } from "zod";
import { productCategorySchema } from "@/schemas/products";

export const productCategories = z
  .array(productCategorySchema)
  .length(4)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    "Product categories must have unique IDs.",
  )
  .parse([
    { id: "sports-nutrition", label: "Supplements" },
    { id: "training-equipment", label: "Equipment" },
    { id: "gym-accessories", label: "Accessories" },
    { id: "fitness-apparel", label: "Apparel" },
  ]);
