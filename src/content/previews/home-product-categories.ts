import { productCategoryHref } from "@/lib/products/links";
import { homeProductCategoriesPreviewSchema } from "@/schemas/content";

// Owner-selected section 2 of the supplied Gym Shop content (2026-11-17).
// These proposed categories are not approved inventory or catalog records.
export const homeProductCategoriesPreview =
  homeProductCategoriesPreviewSchema.parse({
    status: "preview",
    eyebrow: "SHOP BY CATEGORY",
    heading: "Everything You Need. All in One Place.",
    description:
      "From everyday training essentials to performance-focused nutrition, find the right products to complement your active lifestyle.",
    notice:
      "Product category layout preview. Example products are illustrative; availability and prices are not confirmed.",
    action: { label: "View All Product", href: "/products/" },
    categories: [
      {
        id: "sports-nutrition",
        title: "Sports Nutrition",
        description:
          "Fuel your workouts and complement your nutrition goals with our range of fitness supplements.",
        action: {
          label: "Explore Supplements",
          href: productCategoryHref("sports-nutrition"),
        },
      },
      {
        id: "training-equipment",
        title: "Training Equipment",
        description:
          "Build your workout space with practical equipment for strength, conditioning, and flexibility.",
        action: {
          label: "Explore Equipment",
          href: productCategoryHref("training-equipment"),
        },
      },
      {
        id: "gym-accessories",
        title: "Gym Accessories",
        description:
          "Make every workout more convenient with reliable fitness accessories and everyday gym essentials.",
        action: {
          label: "Explore Accessories",
          href: productCategoryHref("gym-accessories"),
        },
      },
      {
        id: "fitness-apparel",
        title: "Fitness Apparel",
        description:
          "Train comfortably with activewear designed for movement and everyday versatility.",
        action: {
          label: "Explore Apparel",
          href: productCategoryHref("fitness-apparel"),
        },
      },
    ],
  });
