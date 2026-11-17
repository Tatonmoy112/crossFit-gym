import { productDetailsSchema } from "@/schemas/products";

// Approved manufacturer and product detail records have not been supplied.
export const productDetails = productDetailsSchema
  .refine(
    (items) => items.every((item) => item.status === "approved"),
    "Actual product details require approval.",
  )
  .parse([]);
