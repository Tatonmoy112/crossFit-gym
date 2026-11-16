import { z } from "zod";
import { homeStatsSchema } from "@/schemas/content";

// Owner requested random sample values for layout review (2026-11-16).
// Keep these separate from approved statistics; render only in site preview.
export const homeStatsPreview = z
  .object({
    notice: z.string().trim().min(1),
    content: homeStatsSchema,
  })
  .parse({
    notice:
      "Example figures for layout preview only. These are not verified gym statistics.",
    content: {
      heading: "Example counter figures",
      items: [
        {
          value: 1200,
          decimals: 0,
          suffix: "+",
          label: "Example clients",
          source: "Illustrative layout preview; not a business statistic",
        },
        {
          value: 4.8,
          decimals: 1,
          suffix: "★",
          suffixLabel: "out of 5",
          label: "Example rating",
          source: "Illustrative layout preview; not a business statistic",
        },
        {
          value: 5,
          decimals: 0,
          suffix: "+",
          label: "Example years",
          source: "Illustrative layout preview; not a business statistic",
        },
        {
          value: 30,
          decimals: 0,
          suffix: "+",
          label: "Certified Trainers",
          source:
            "Owner supplied: 30+ Certified Trainers (2026-11-16); preview display",
        },
      ],
    },
  });
