import { gallerySchema } from "@/schemas/content";
import { gymImage } from "./site";
export const gallery = [
  gallerySchema.parse({
    ...gymImage,
    id: "gym-cover",
    category: "The gym",
    caption: "Crossfit Gym · supplied cover image",
  }),
];
