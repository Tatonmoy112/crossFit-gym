import {
  homeHeroSchema,
  homeStatsSchema,
  homeStorySchema,
  homeWhyChooseUsSchema,
} from "@/schemas/content";
import { about } from "./about";
import { site } from "./site";

// Owner decisions (2026-11-16): approved site text only; supplied hero image.
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
    { label: `Call ${site.phone}`, href: `tel:${site.telephone}` },
    { label: "Get directions", href: site.directions },
  ],
});

export const homeStory = homeStorySchema.parse({
  heading: "Our story",
  story: about.story,
  link: { label: `More about ${site.name}`, href: "/about" },
  missing: {
    title: "Our story has not been supplied yet",
    description: `Approved story text for ${site.name} has not been provided for this website.`,
  },
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
