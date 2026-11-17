import { homeFaqSchema } from "@/schemas/home-faq";
import { selectFaqs } from "@/lib/content/faqs";
import { faqs } from "./faqs";

// Owner-selected six topics and accuracy adjustments, approved in chat 2026-11-17.
export const homeFaq = homeFaqSchema.parse({
  eyebrow: "FREQUENTLY ASKED QUESTIONS",
  heading: "Got Questions? We've Got Answers.",
  description:
    "Everything you need to know about our gym, training programs, memberships, and fitness essentials. Find the answers you need and take the next step toward your fitness goals.",
  questionIds: [
    "plans",
    "getting-started",
    "personal-training",
    "product-ordering",
    "gym-visit",
    "choosing-supplements",
  ],
  closing: {
    heading: "Still Have Questions?",
    description:
      "We're here to help you get started. Reach out to our team for more information about memberships, training programs, and fitness products.",
    action: { label: "Contact Us", href: "/contact/" },
  },
});

export const homeFaqItems = selectFaqs(faqs, homeFaq.questionIds);
