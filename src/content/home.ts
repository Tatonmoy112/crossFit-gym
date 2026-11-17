import {
  homeHeroSchema,
  homeStatsSchema,
  homeWhyChooseUsSchema,
} from "@/schemas/content";
import { site } from "./site";

// Owner decisions: approved site text/photo (2026-11-16), Contact and Membership actions (2026-11-17).
export const homeHero = homeHeroSchema.parse({
  title: site.name,
  tagline: site.tagline,
  location: site.shortAddress,
  image: {
    src: "/images/brand/home-hero.webp",
    alt: "Crossfit Gym training floor with treadmills, cross-trainers and strength racks",
    width: 1672,
    height: 941,
  },
  actions: [
    { label: "Start your journey", href: "/contact/" },
    { label: "View memberships", href: "/membership/" },
  ],
});

// Owner decision (2026-11-16): no statistics are published until real numbers
// with a verifiable source are supplied. HomeStats renders nothing while empty.
export const homeStats = homeStatsSchema.parse({
  heading: `${site.name} in numbers`,
  items: [],
});

// Owner-selected supplied facts and approved local photo (2026-11-16).
// The trainer statement is owner supplied, not a verified credential directory.
export const homeWhyChooseUs = homeWhyChooseUsSchema.parse({
  heading: "Why choose us",
  items: [
    {
      id: "certified-trainers",
      title: "Certified Training Team",
      description:
        "Train at Crossfit Gym, home to a team of 30+ certified trainers.",
      image: homeHero.image,
      imagePosition: "left",
      source: "Owner supplied: 30+ Certified Trainers (2026-11-16)",
    },
    {
      id: "uttara-location",
      title: "Your Gym in Uttara",
      description: `Make training part of your routine. Visit us at ${site.address}.`,
      image: homeHero.image,
      imagePosition: "center",
      source: "Supplied business address in info/Crossfit Gym_info.md",
    },
    {
      id: "talk-to-our-team",
      title: "Start With a Conversation",
      description: `Have questions before your first visit? Call ${site.phone} to speak directly with the Crossfit Gym team.`,
      image: homeHero.image,
      imagePosition: "right",
      source: "Supplied business telephone in info/Crossfit Gym_info.md",
    },
  ],
});
