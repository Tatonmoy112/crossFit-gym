import { homeSuccessStoriesPreviewSchema } from "@/schemas/content";

// Owner-supplied fictional examples, not approved member testimonials.
// Render only in site preview; never merge into the real testimonial catalog.
export const homeSuccessStoriesPreview = homeSuccessStoriesPreviewSchema.parse({
  status: "preview",
  eyebrow: "SUCCESS STORIES",
  heading: "Real People. Real Progress. Real Inspiration.",
  description:
    "Every fitness journey begins with a decision to become better. Discover the stories, dedication, and personal achievements of our members who continue to push their limits, build confidence, and make progress every day.",
  supportingText:
    "Different journeys. Shared determination. Endless possibilities.",
  notice:
    "Fictional sample testimonials for layout preview. Names and quotations are illustrative, not verified member stories.",
  action: { label: "Start your journey", href: "/contact/" },
  stories: [
    {
      id: "arif-rahman",
      name: "Arif Rahman",
      focus: "Strength & Confidence",
      quote:
        "I started with very little experience. Over time, I found a routine that helped me grow stronger and feel more confident in every workout.",
    },
    {
      id: "nadia-ahmed",
      name: "Nadia Ahmed",
      focus: "Fitness & Consistency",
      quote:
        "Finding the motivation to stay active wasn't always easy. Having a routine I genuinely enjoy has made fitness a meaningful part of my life.",
    },
    {
      id: "tanvir-hasan",
      name: "Tanvir Hasan",
      focus: "Endurance & Lifestyle",
      quote:
        "My goal was to become more active and improve my stamina. With regular training, I've learned to enjoy the process instead of chasing quick results.",
    },
  ],
  closing: {
    eyebrow: "MORE THAN JUST RESULTS",
    heading: "Every Journey Has a Story Worth Sharing.",
    description:
      "Behind every achievement is a story of consistency, commitment, and determination. From first-time gym members discovering their strength to experienced fitness enthusiasts reaching new milestones, every journey reflects the power of showing up and moving forward.",
    action: {
      label: "Your Story Starts Here — Join Our Community",
      href: "/contact/",
    },
  },
});
