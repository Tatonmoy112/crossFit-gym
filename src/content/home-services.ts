import { homeServicesSchema } from "@/schemas/content";

// Owner approved all eight homepage services from newsection.md (2026-11-17).
// Detail pages and photography are a later task; current links open Contact.
export const homeServices = homeServicesSchema.parse({
  eyebrow: "OUR SERVICES",
  heading: "Your Goals. Our Expertise. Your Stronger Future.",
  description:
    "Discover training experiences designed around your goals, your abilities, and your lifestyle. From expert-led personal training to high-energy group workouts, find everything you need to move better, build strength, and stay motivated.",
  items: [
    {
      id: "personal-training",
      title: "Personal Training",
      subtitle: "Your goals. Your dedicated coach.",
      href: "/contact/",
    },
    {
      id: "strength-training",
      title: "Strength Training",
      subtitle: "Build strength. Gain confidence.",
      href: "/contact/",
    },
    {
      id: "group-fitness",
      title: "Group Fitness",
      subtitle: "Stronger together, every session.",
      href: "/contact/",
    },
    {
      id: "hiit-conditioning",
      title: "HIIT & Conditioning",
      subtitle: "Bring energy to every workout.",
      href: "/contact/",
    },
    {
      id: "cardio-endurance",
      title: "Cardio & Endurance",
      subtitle: "Go further. Feel stronger.",
      href: "/contact/",
    },
    {
      id: "functional-fitness",
      title: "Functional Fitness",
      subtitle: "Train for everyday strength.",
      href: "/contact/",
    },
    {
      id: "weight-management",
      title: "Weight Management",
      subtitle: "Make progress that lasts.",
      href: "/contact/",
    },
    {
      id: "mobility-recovery",
      title: "Mobility & Recovery",
      subtitle: "Move freely. Recover smarter.",
      href: "/contact/",
    },
  ],
});
