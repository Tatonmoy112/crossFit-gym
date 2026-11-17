import { productsSchema } from "@/schemas/products";

// Actual inventory has not been supplied. Illustrative examples live separately.
export const products = productsSchema
  .refine(
    (items) => items.every((item) => item.status === "approved"),
    "The real product collection must contain only approved records.",
  )
  .parse([]);
