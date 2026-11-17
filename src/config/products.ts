export const productCategoryIds = [
  "sports-nutrition",
  "training-equipment",
  "gym-accessories",
  "fitness-apparel",
] as const;

export type ProductCategoryId = (typeof productCategoryIds)[number];
