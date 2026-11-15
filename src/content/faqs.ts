import { faqSchema } from "@/schemas/content";
import { site } from "./site";
export const faqs = [
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
    question: "Where can I find current membership and class information?",
    answer:
      "Contact the gym directly for current membership prices, programs, and class times. These details have not yet been supplied for publication on this website.",
    category: "Training",
  },
].map((faq) => faqSchema.parse(faq));
