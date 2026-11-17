import { faqCollectionSchema } from "@/schemas/home-faq";
import { site } from "./site";
export const faqs = faqCollectionSchema.parse([
  {
    id: "location",
    question: "Where can I find Crossfit Gym?",
    answer: site.address,
    category: "Visiting",
  },
  {
    id: "contact",
    question: "How can I contact the gym?",
    answer: `Call ${site.phone}, find us on Facebook at crossfitbangladesh, or on Instagram at crossfit_gym_uttara.`,
    category: "Contact",
  },
  {
    id: "hours",
    question: "How can I confirm opening hours?",
    answer:
      "Please call the gym before visiting to confirm its current opening hours.",
    category: "Visiting",
  },
  {
    id: "plans",
    question: "What types of gym memberships are available?",
    answer:
      "Contact our team to explore current membership options, benefits, and pricing, and discuss what suits your fitness goals and schedule.",
    category: "Training",
  },
  {
    id: "getting-started",
    question: "Do I need prior gym experience to join?",
    answer:
      "New to training? Contact our team to discuss getting started, equipment guidance, and the support available for your fitness level.",
    category: "Training",
  },
  {
    id: "personal-training",
    question: "Do you offer personal training sessions?",
    answer:
      "Yes! Personal training is one of our gym services. Contact our team to discuss your goals, current session availability, and pricing.",
    category: "Training",
  },
  {
    id: "product-ordering",
    question: "Can I purchase supplements and gym equipment from your website?",
    answer:
      "Browse our fitness shop and contact our team to confirm product availability, prices, and ordering options. Online checkout is not currently available.",
    category: "Products",
  },
  {
    id: "gym-visit",
    question: "Can I visit the gym before purchasing a membership?",
    answer:
      "Contact our team to ask about arranging a visit and confirm current opening hours before coming to the gym.",
    category: "Visiting",
  },
  {
    id: "choosing-supplements",
    question: "How do I choose the right supplements for my fitness goals?",
    answer:
      "The right supplement depends on your dietary needs, training routine, and personal goals. Ask for confirmed product ingredients and usage information, and consult a qualified healthcare or nutrition professional for personalized advice.",
    category: "Products",
  },
  {
    id: "choose-membership",
    question: "How do I choose the right membership plan?",
    answer:
      "The right membership depends on your training goals, preferred workout schedule, budget, and the services you need. Speak with our team to confirm available plans and find an option that suits you.",
    category: "Membership",
  },
  {
    id: "personal-training-in-membership",
    question: "Is personal training included in every membership?",
    answer:
      "Personal training is one of our gym services. Membership inclusion, session availability, and any additional cost must be confirmed with our team before you join.",
    category: "Membership",
  },
  {
    id: "membership-upgrades",
    question: "Can I upgrade my membership later?",
    answer:
      "Contact our team to confirm whether membership upgrades are available under current policies and ask about any applicable charges before making a change.",
    category: "Membership",
  },
  {
    id: "membership-fees",
    question: "Are there any additional membership fees?",
    answer:
      "Ask our team to confirm registration fees, service charges, and the total cost of your membership before committing. Approved fee details have not yet been supplied for publication.",
    category: "Membership",
  },
]);
