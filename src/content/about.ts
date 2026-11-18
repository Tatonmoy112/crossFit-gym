import { aboutPageSchema, homeAboutSchema } from "@/schemas/about";
import { homeHero } from "./home";
import { site } from "./site";

// Supplied brand introduction, mission, aspirations and values (2026-11-17).
// This is not a founding history or evidence of achievements or specific services.
// Photography: the existing owner-approved gym image; no member imagery supplied.
export const homeAbout = homeAboutSchema.parse({
  eyebrow: "ABOUT OUR GYM",
  heading: "More Than Fitness. A Way of Life.",
  paragraphs: [
    "We believe fitness is more than just lifting weights or completing workouts. It's about building confidence, developing discipline, and becoming stronger every day.",
    "Our gym is built around a simple purpose: to create a welcoming and motivating space where individuals of all fitness levels can challenge themselves, stay consistent, and work toward their personal goals. Whether you're just starting out or pushing your limits, we're here to be part of your journey.",
  ],
  image: homeHero.image,
  action: { label: "Discover Our Story", href: "/about/" },
});

export const aboutPage = aboutPageSchema.parse({
  seo: {
    title: "About Us | Our Story & Fitness Philosophy",
    description: `Discover the story behind ${site.name}, our mission, values, and commitment to creating a motivating fitness environment for every fitness journey.`,
  },
  hero: {
    eyebrow: "GET TO KNOW US",
    heading: "Built for Strength. Driven by Passion.",
    paragraphs: [
      "Discover a place where dedication meets opportunity, every workout has a purpose, and every fitness journey matters.",
      `At ${site.name}, we believe everyone deserves an environment where they can move, grow, and become a stronger version of themselves.`,
    ],
    image: homeHero.image,
  },
  story: {
    eyebrow: "WHO WE ARE",
    heading: "Your Journey. Our Commitment.",
    paragraphs: [
      "Fitness is personal. Every individual walks into the gym with a different goal, a different story, and a different reason to begin.",
      `At ${site.name}, we understand that meaningful progress is built through consistency, determination, and the right environment. Our aim is to provide a space where beginners feel welcome, experienced members feel challenged, and everyone has an opportunity to improve.`,
      "We believe a gym should be more than a place to exercise. It should be a place that encourages commitment, builds confidence, and helps people develop habits that extend beyond their workouts.",
      "Whether your goal is to build strength, improve endurance, stay active, or simply feel better in your everyday life, we're here to support your fitness journey.",
    ],
  },
  purpose: {
    eyebrow: "WHAT DRIVES US",
    heading: "Our Purpose. Your Progress.",
    mission: {
      title: "Our Mission",
      heading: "Making Fitness Accessible, Motivating, and Meaningful.",
      paragraphs: [
        "Our mission is to inspire individuals to embrace an active lifestyle by creating a supportive fitness environment where people can train confidently, develop healthy routines, and work toward their personal goals.",
        "We aim to encourage sustainable progress through consistency, commitment, and a positive training experience.",
      ],
    },
    vision: {
      title: "Our Vision",
      heading: "Building a Stronger, Healthier Fitness Community.",
      paragraphs: [
        "Our vision is to become a trusted fitness destination where people of all experience levels feel empowered to challenge themselves, discover their potential, and make fitness an essential part of everyday life.",
        "We aspire to build a community that celebrates effort, progress, and long-term well-being.",
      ],
    },
  },
  values: {
    eyebrow: "WHAT WE STAND FOR",
    heading: "The Values Behind Every Rep.",
    paragraphs: [
      "Our values shape the experience we strive to create and the community we want to build.",
    ],
    items: [
      {
        id: "commitment",
        title: "Commitment",
        description:
          "We believe consistent effort creates meaningful progress. Every workout is an opportunity to move forward.",
      },
      {
        id: "inclusivity",
        title: "Inclusivity",
        description:
          "Fitness is for everyone. We strive to create a welcoming environment where all individuals feel respected and encouraged.",
      },
      {
        id: "growth",
        title: "Growth",
        description:
          "Progress takes different forms. We celebrate the determination to learn, improve, and challenge personal limits.",
      },
      {
        id: "community",
        title: "Community",
        description:
          "A supportive environment can make every fitness journey more rewarding. We believe in motivating one another and growing stronger together.",
      },
    ],
  },
  experience: {
    eyebrow: `THE ${site.name.toUpperCase()} EXPERIENCE`,
    heading: "A Better Space to Become Your Best.",
    paragraphs: [
      "The right environment can make a difference in how you train, stay motivated, and approach your fitness goals.",
      `At ${site.name}, our focus is on creating a positive, convenient, and rewarding gym experience.`,
    ],
    items: [
      {
        id: "welcoming",
        icon: "welcome",
        title: "A Welcoming Training Environment",
        description:
          "Feel comfortable taking your first step or continuing your fitness journey in a space designed for people at different experience levels.",
      },
      {
        id: "goals",
        icon: "goals",
        title: "Fitness for Every Goal",
        description:
          "From strength development and endurance to everyday wellness, pursue your goals at a pace that works for you.",
      },
      {
        id: "motivation",
        icon: "motivation",
        title: "Motivation That Matters",
        description:
          "Surround yourself with an environment that encourages consistency, determination, and a positive attitude toward personal progress.",
      },
      {
        id: "community",
        icon: "community",
        title: "A Community That Supports You",
        description:
          "Become part of a fitness-focused community where effort is valued, achievements are celebrated, and every journey matters.",
      },
    ],
  },
  approach: {
    eyebrow: "TRAIN WITH PURPOSE",
    heading: "Every Step Forward Counts.",
    paragraphs: [
      "We believe lasting fitness is built on more than occasional motivation. It comes from developing routines, showing up consistently, and making training part of your lifestyle.",
      "Our approach encourages members to focus on personal progress rather than comparison. Whether you're working toward your first fitness milestone or striving for a new personal best, every improvement is worth celebrating.",
    ],
    philosophy: "Train with purpose. Stay consistent. Celebrate progress.",
  },
  community: {
    eyebrow: "STRONGER TOGETHER",
    heading: "Different Goals. One Fitness Community.",
    paragraphs: [
      "Every member brings a unique journey, but we share a common belief: progress begins with commitment.",
      "We want our gym to be a place where people feel motivated to show up, challenge themselves, and develop lasting fitness habits.",
      "It's not about being the strongest person in the room. It's about becoming stronger than you were yesterday.",
    ],
  },
  membership: {
    eyebrow: "FIND YOUR FIT",
    heading: "Your Goals Deserve the Right Membership.",
    paragraphs: [
      "Whether you're building a new routine or taking your training to the next level, find a membership option that supports your lifestyle and fitness ambitions.",
      "Explore our available membership plans and take the next step toward a more active you.",
    ],
    action: { label: "Explore Membership Plans", href: "/membership/" },
  },
  cta: {
    eyebrow: "START YOUR JOURNEY",
    heading: "Your Stronger Tomorrow Starts Today.",
    paragraphs: [
      "You don't have to be experienced to begin. All you need is the willingness to take that first step.",
      "Join a fitness community built around motivation, commitment, and progress. Your goals are personal, and your journey starts with you.",
    ],
    primary: { label: "Become a Member", href: "/membership/" },
    secondary: { label: "Contact Us", href: "/contact/" },
  },
});
