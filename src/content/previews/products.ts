import { productsSchema } from "@/schemas/products";

// Exact names and summaries from section 3 of the owner-supplied Gym Shop
// document (2026-11-17). These are illustrative examples, not gym inventory.
export const previewProducts = productsSchema
  .refine(
    (items) =>
      items.length === 10 &&
      items.every((item) => item.status === "preview" && item.price === null),
    "Keep the ten supplied examples distinct from approved inventory and prices.",
  )
  .parse(
    [
      {
        id: "whey-protein-powder",
        name: "Whey Protein Powder",
        categoryId: "sports-nutrition",
        summary:
          "A convenient protein supplement to complement your daily nutrition and recovery routine.",
      },
      {
        id: "creatine-monohydrate",
        name: "Creatine Monohydrate",
        categoryId: "sports-nutrition",
        summary:
          "A training supplement for supporting performance during repeated high-intensity exercise.",
      },
      {
        id: "pre-workout-formula",
        name: "Pre-Workout Formula",
        categoryId: "sports-nutrition",
        summary:
          "A workout-focused formula designed to complement your pre-training routine.",
      },
      {
        id: "mass-gainer-powder",
        name: "Mass Gainer Powder",
        categoryId: "sports-nutrition",
        summary:
          "A convenient calorie and protein supplement for individuals working toward higher daily nutrition targets.",
      },
      {
        id: "adjustable-dumbbell-set",
        name: "Adjustable Dumbbell Set",
        categoryId: "training-equipment",
        summary:
          "Versatile strength training equipment for a wide range of home workouts.",
      },
      {
        id: "resistance-bands-set",
        name: "Resistance Bands Set",
        categoryId: "training-equipment",
        summary:
          "Lightweight training bands for strength exercises, warm-ups, and mobility work.",
      },
      {
        id: "training-gloves",
        name: "Training Gloves",
        categoryId: "gym-accessories",
        summary:
          "Comfortable workout accessories for lifting and equipment-based training.",
      },
      {
        id: "lifting-straps",
        name: "Lifting Straps",
        categoryId: "gym-accessories",
        summary:
          "Practical grip-support accessories for selected pulling and lifting exercises.",
      },
      {
        id: "protein-shaker-bottle",
        name: "Protein Shaker Bottle",
        categoryId: "gym-accessories",
        summary:
          "A convenient way to mix, carry, and enjoy your favorite supplements.",
      },
      {
        id: "exercise-training-mat",
        name: "Exercise Training Mat",
        categoryId: "gym-accessories",
        summary:
          "A comfortable surface for floor exercises, stretching, and mobility sessions.",
      },
    ].map((product) => ({
      ...product,
      status: "preview",
      price: null,
      images: [],
    })),
  );
