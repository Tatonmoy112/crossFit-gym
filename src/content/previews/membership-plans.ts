import {
  membershipPreviewSchema,
  type MembershipComparisonRow,
} from "@/schemas/membership-page";

const ids = ["essential", "performance", "elite"] as const;
const cells = (
  texts: [string, string, string],
  statuses: [
    "proposed" | "pending" | "unspecified",
    "proposed" | "pending" | "unspecified",
    "proposed" | "pending" | "unspecified",
  ],
): MembershipComparisonRow["values"] =>
  ids.map((planId, index) => ({
    planId,
    text: texts[index],
    status: statuses[index],
  }));
const pending = () =>
  cells(
    ["To be confirmed", "To be confirmed", "To be confirmed"],
    ["pending", "pending", "pending"],
  );

// Supplied page examples only. Real memberships.ts and homepage copy stay intact.
export const membershipPlansPreview = membershipPreviewSchema.parse({
  status: "preview",
  plans: [
    {
      id: "essential",
      headline: "Your Fitness Journey Starts Here.",
      description:
        "A simple way to make fitness part of your everyday routine. Perfect for individuals looking to build consistency, improve their fitness, and develop healthy habits.",
      badge: "GET STARTED",
      featured: false,
      benefits: [
        "Gym floor and equipment access",
        "Standard workout facilities",
        "Initial gym orientation",
        "General fitness assistance",
        "Access according to membership hours",
      ],
      inquiryLabel: "Ask about Essential",
    },
    {
      id: "performance",
      headline: "Take Your Training Further.",
      description:
        "For those ready to bring more structure and variety to their workouts. Build momentum with a membership designed to help you stay committed to your routine.",
      badge: "FEATURED EXAMPLE",
      featured: true,
      benefits: [
        "Everything included in Essential",
        "Eligible group fitness classes",
        "Periodic fitness progress check-ins",
        "Additional training guidance",
        "Extended facility access, where available",
      ],
      inquiryLabel: "Ask about Performance",
    },
    {
      id: "elite",
      headline: "A More Personalized Way to Train.",
      description:
        "Enjoy an enhanced gym experience with additional support and services. Designed for individuals who value personalized guidance and a more comprehensive approach to fitness.",
      badge: "PREMIUM EXPERIENCE",
      featured: false,
      benefits: [
        "Everything included in Performance",
        "Selected personal training sessions",
        "Individual fitness consultations",
        "Priority class reservations, where available",
        "Additional premium membership privileges",
      ],
      inquiryLabel: "Ask about Elite",
    },
  ],
  comparison: [
    { id: "price", label: "Membership Price", values: pending() },
    { id: "duration", label: "Membership Duration", values: pending() },
    {
      id: "access",
      label: "Gym Access",
      values: cells(
        [
          "Gym floor and equipment",
          "Same proposed access",
          "Same proposed access",
        ],
        ["proposed", "proposed", "proposed"],
      ),
    },
    { id: "hours", label: "Access Hours", values: pending() },
    { id: "assessment", label: "Fitness Assessment", values: pending() },
    {
      id: "assistance",
      label: "Trainer Assistance",
      values: cells(
        [
          "General assistance",
          "Additional guidance",
          "Guidance and individual consultations",
        ],
        ["proposed", "proposed", "proposed"],
      ),
    },
    {
      id: "classes",
      label: "Group Fitness Classes",
      values: cells(
        ["Not specified", "Eligible classes", "Eligible classes"],
        ["unspecified", "proposed", "proposed"],
      ),
    },
    {
      id: "personal-training",
      label: "Personal Training Sessions",
      values: cells(
        ["Not specified", "Not specified", "Selected sessions"],
        ["unspecified", "unspecified", "proposed"],
      ),
    },
    { id: "facilities", label: "Additional Facilities", values: pending() },
    {
      id: "privileges",
      label: "Membership Privileges",
      values: cells(
        [
          "Initial orientation",
          "Progress check-ins",
          "Priority reservations, where available",
        ],
        ["proposed", "proposed", "proposed"],
      ),
    },
  ],
  benefits: [
    {
      id: "environment",
      title: "Quality Training Environment",
      description:
        "Enjoy a dedicated fitness space designed to make your workouts comfortable, focused, and productive.",
    },
    {
      id: "support",
      title: "Support at Every Level",
      description:
        "Whether you're a beginner or a regular gym-goer, find encouragement and guidance to help you approach your fitness journey with confidence.",
    },
    {
      id: "lifestyle",
      title: "Memberships That Fit Your Lifestyle",
      description:
        "Choose from available membership options that complement your training frequency, schedule, and personal preferences.",
    },
    {
      id: "community",
      title: "A Motivating Fitness Community",
      description:
        "Surround yourself with people who share your interest in fitness, personal improvement, and healthier living.",
    },
  ],
});
