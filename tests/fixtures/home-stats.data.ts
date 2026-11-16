import type { HomeStatsContent } from "@/schemas/content";

// Clearly fictitious fixture numbers: they exercise layout and counting only
// and must never be copied into src/content.
export const fixture: HomeStatsContent = {
  heading: "Crossfit Gym in numbers",
  items: [
    {
      value: 10,
      decimals: 0,
      suffix: "K+",
      label: "Fixture members transformed",
      source: "Test fixture",
    },
    {
      value: 4.9,
      decimals: 1,
      suffix: "★",
      suffixLabel: "out of 5",
      label: "Fixture average rating",
      source: "Test fixture",
    },
    {
      value: 5,
      decimals: 0,
      suffix: "+",
      label: "Fixture years stronger together",
      source: "Test fixture",
    },
  ],
};
