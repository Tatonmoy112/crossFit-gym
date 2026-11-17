import { homeFeaturesSchema } from "@/schemas/content";

// Owner-supplied homepage copy: newsection.md, section 03.
// Homepage implementation requested 2026-11-17. Photography and detail pages
// remain pending; existing destination pages retain their current content state.
export const homeFeatures = homeFeaturesSchema.parse({
  eyebrow: "WHY CHOOSE US",
  heading: "Everything You Need. Nothing Holding You Back.",
  description:
    "From the equipment you train with to the people who support you, every detail of your fitness experience matters. Discover a space designed to make working out comfortable, motivating, and rewarding.",
  action: { label: "Start your journey", href: "/contact/" },
  items: [
    {
      id: "modern-equipment",
      title: "Modern Equipment",
      description:
        "Train with quality equipment designed for a wide range of fitness goals.",
      actionLabel: "Explore Equipment",
      href: "/facilities/",
    },
    {
      id: "expert-guidance",
      title: "Expert Guidance",
      description:
        "Get the direction and encouragement to train with purpose and confidence.",
      actionLabel: "Meet Our Coaches",
      href: "/coaches/",
    },
    {
      id: "dedicated-training-zones",
      title: "Dedicated Training Zones",
      description:
        "Find the right space for strength, cardio, and movement-based workouts.",
      actionLabel: "Explore Our Facilities",
      href: "/facilities/",
    },
    {
      id: "supportive-community",
      title: "Supportive Community",
      description:
        "Stay inspired in an environment where every fitness journey is welcome.",
      actionLabel: "Discover Our Community",
      href: "/membership/",
    },
    {
      id: "clean-comfortable-space",
      title: "Clean & Comfortable Space",
      description:
        "Feel at ease in a welcoming and thoughtfully maintained training environment.",
      actionLabel: "View Our Space",
      href: "/facilities/",
    },
    {
      id: "progress-focused-training",
      title: "Progress-Focused Training",
      description:
        "Make your workouts meaningful with clear goals and consistent progress.",
      actionLabel: "Learn Our Approach",
      href: "/contact/",
    },
  ],
});
