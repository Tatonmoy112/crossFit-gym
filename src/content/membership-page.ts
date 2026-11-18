import { membershipPageSchema } from "@/schemas/membership-page";
import { selectFaqs } from "@/lib/content/faqs";
import { faqs } from "./faqs";

// Owner-approved page plan and inquiry-safe wording, 2026-11-17.
export const membershipPage = membershipPageSchema.parse({
  seo: {
    title: "Gym Membership Plans & Pricing",
    description:
      "Learn about gym membership options at Crossfit Gym. Contact our team to confirm current prices, benefits, access conditions and joining arrangements.",
  },
  hero: {
    eyebrow: "MEMBERSHIP PLANS",
    heading: "Your Fitness. Your Goals. Your Membership.",
    description:
      "Every fitness journey is different, and your membership should fit the way you train. Speak with our team about current membership options, the benefits that matter to you, and the right next step for your goals.",
    explore: { label: "Explore Memberships", href: "#membership-plans" },
    contact: { label: "Contact Our Team", href: "/contact/" },
  },
  navigationLabel: "Membership page sections",
  navigation: [
    { label: "Plans", href: "#membership-plans" },
    { label: "Compare", href: "#membership-comparison" },
    { label: "How to Join", href: "#membership-how-to-join" },
    { label: "FAQ", href: "#membership-faq" },
  ],
  introduction: {
    eyebrow: "FIND YOUR PERFECT FIT",
    heading: "One Goal. Endless Possibilities.",
    description:
      "Whether you're beginning your fitness journey, building strength, or maintaining an active lifestyle, we're here to help you make every workout count.",
    supportingText:
      "Contact our team to discuss your training routine, fitness goals, and level of commitment, and confirm which membership options are currently available.",
  },
  pricing: {
    eyebrow: "CHOOSE YOUR PLAN",
    heading: "Find the Membership That Moves You Forward.",
    description:
      "Consider what matters to your goals, schedule, and lifestyle, then speak with our team about the right membership for you.",
    notice:
      "Illustrative membership plans. Names and suggested benefits are design examples, not confirmed gym offerings. Prices, durations and terms require confirmation.",
    inquiryNotice:
      "Plan buttons open Contact to begin an inquiry. Our team must confirm availability, benefits, fees and registration details before you join.",
    empty: {
      title: "Membership plans are awaiting confirmation",
      description:
        "Approved plans, prices, durations and included services have not been supplied for publication. Contact our team for current membership information.",
    },
  },
  benefits: {
    eyebrow: "MORE THAN A MEMBERSHIP",
    heading: "A Place to Train. A Community to Grow.",
    description:
      "Your membership can be a step toward healthy routines, new challenges, and a community that values progress. These proposed benefits are discussion points; confirm the services included in your membership with our team.",
  },
  comparison: {
    eyebrow: "COMPARE YOUR OPTIONS",
    heading: "Find What Works Best for You.",
    description:
      "Compare the details that matter to your training and ask our team to confirm current plans and inclusions.",
    caption:
      "Illustrative membership comparison. Listed benefits are proposals; availability, inclusions, fees and terms require gym confirmation.",
    help: "Not specified means the supplied example does not establish inclusion. It does not mean the service is unavailable.",
    scrollLabel:
      "Membership comparison table, scroll horizontally to compare all plans",
    action: { label: "Get Membership Assistance", href: "/contact/" },
    empty: {
      title: "Confirmed comparison details are not available yet",
      description:
        "Ask our team for current plan prices, durations, access conditions and included services before comparing memberships.",
    },
  },
  joining: {
    eyebrow: "GET STARTED IN THREE STEPS",
    heading: "Your Fitness Journey Begins Here.",
    description:
      "Getting started should be simple. Explore your priorities, speak with our team, and take your next step toward a more active routine.",
    steps: [
      {
        id: "explore",
        title: "Explore Your Options",
        description:
          "Think about your training goals, preferred schedule, and the support you need. Use the membership information on this page to prepare your questions.",
      },
      {
        id: "confirm",
        title: "Confirm Your Membership",
        description:
          "Contact our team to confirm a suitable membership, its availability, total cost, included services, and registration requirements before you commit.",
      },
      {
        id: "begin",
        title: "Start Your Fitness Journey",
        description:
          "Once your membership is confirmed and activated by the gym, get ready to begin your training experience and work toward your goals.",
      },
    ],
    action: { label: "Join the Gym", href: "/contact/" },
  },
  faq: {
    eyebrow: "FREQUENTLY ASKED QUESTIONS",
    heading: "Everything You Need to Know.",
    description:
      "Find answers to common questions about our memberships and getting started at the gym.",
    questionIds: [
      "choose-membership",
      "getting-started",
      "personal-training-in-membership",
      "membership-upgrades",
      "membership-fees",
      "gym-visit",
    ],
  },
  cta: {
    eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
    heading: "The Best Time to Start Is Now.",
    description:
      "Your goals deserve your commitment. Talk to our team about a membership that fits your routine and take the next step toward building healthy habits.",
    action: { label: "Become a Member", href: "/contact/" },
    callLabel: "Talk to Our Team",
  },
  terms: {
    heading: "Important Membership Information",
    paragraphs: [
      "Membership prices, durations, included services and policies have not been confirmed for publication. Additional services may involve separate charges; ask our team to confirm the total cost before joining.",
      "Before committing, confirm the applicable membership terms, access conditions, renewal policies, cancellation rules, and available facilities with the gym.",
      "For membership-related questions, contact our team for assistance.",
    ],
  },
  labels: {
    pricePending: "Price to be confirmed",
    durationPending: "Duration to be confirmed",
    suggestedBenefits: "Suggested benefits",
    comparisonFeature: "Membership details",
    proposed: "Proposed",
    unspecified: "Not specified",
  },
});

export const membershipPageFaqs = selectFaqs(
  faqs,
  membershipPage.faq.questionIds,
);
