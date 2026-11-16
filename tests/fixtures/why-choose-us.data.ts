import type { WhyChooseUsItem } from "@/schemas/content";

// Isolated card specimen, never a catalog record or public demonstration route.
export const whyCardFixture: WhyChooseUsItem = {
  id: "trainer-fixture",
  title: "Certified Trainers",
  description: "30+ certified trainers.",
  image: {
    src: "/images/brand/home-hero.webp",
    alt: "Crossfit Gym training floor with treadmills, cross-trainers and strength racks",
    width: 1672,
    height: 941,
  },
  imagePosition: "left",
  source: "Isolated specimen using the owner-supplied trainer statement",
};
