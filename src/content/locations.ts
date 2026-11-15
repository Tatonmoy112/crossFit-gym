import { catalogSchema } from "@/schemas/content";
import { gymImage, site } from "./site";
export const locations = [
  catalogSchema.parse({
    slug: "uttara",
    title: "Uttara, Dhaka",
    summary: site.address,
    category: "Bangladesh",
    image: gymImage,
    status: "approved",
    sections: [
      { heading: "Find us in Uttara", body: site.address },
      {
        heading: "Plan your visit",
        body: "Call the gym to confirm current opening hours and arrange your visit.",
      },
    ],
  }),
];
