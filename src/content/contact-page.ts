import { contactPageSchema } from "@/schemas/contact-page";
import { site } from "./site";

const telephone = `tel:${site.telephone}`;

export const contactPage = contactPageSchema.parse({
  seo: {
    title: "Contact Us | Gym Membership & Fitness Inquiries",
    description:
      "Contact Crossfit Gym in Uttara for membership, training and fitness product enquiries. Call the team, get directions, or connect on social media.",
  },
  hero: {
    eyebrow: "CONTACT US",
    heading: "Let's Connect. Your Fitness Journey Matters.",
    paragraphs: [
      "Have a question about our gym, membership plans, training options, or fitness products? We're here to make getting started simple.",
      "Whether you're exploring your options or ready to take the next step, our team is happy to help you find the information you need.",
    ],
    call: { label: "Call our team", href: telephone },
    directions: { label: "Get directions", href: site.directions },
  },
  introduction: {
    eyebrow: "WE'RE HERE TO HELP",
    heading: "Every Question Deserves an Answer.",
    paragraphs: [
      "Starting a new fitness routine, choosing a membership, or finding the right training program can bring plenty of questions.",
      `At ${site.name}, we want you to feel informed and confident before making a decision. Reach out to our team for membership details, available services, gym facilities, or support with your fitness product inquiries.`,
      "Choose your preferred way to connect, and let's get the conversation started.",
    ],
  },
  methods: {
    eyebrow: "GET IN TOUCH WITH US",
    heading: "Connect with Our Team.",
    phone: {
      heading: "Give Us a Call",
      description:
        "Have questions about memberships, gym access, or training options? Contact our team for assistance.",
      value: site.phone,
      action: { label: "Call Now", href: telephone },
    },
    visit: {
      heading: "Visit Our Gym",
      description:
        "Step inside, explore our fitness environment, and discover where your journey could begin.",
      address: site.address,
      action: { label: "Get Directions", href: site.directions },
      hoursNote: "Call to confirm current opening hours before visiting.",
    },
    socialLabel: "Connect on social media",
    socials: [
      { label: "Facebook", href: site.facebook },
      { label: "Instagram", href: site.instagram },
    ],
  },
  message: {
    eyebrow: "SEND A MESSAGE",
    heading: "Tell Us How We Can Help.",
    notice:
      "Message form preview. Online messaging isn't available yet. Please call the gym or use our social links.",
    fields: {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      topic: "Inquiry Type",
      subject: "Subject",
      message: "Your Message",
    },
    topicPlaceholder: "Select an inquiry type",
    topics: [
      { id: "general", label: "General Inquiry" },
      { id: "membership", label: "Gym Membership" },
      { id: "personal-training", label: "Personal Training" },
      { id: "visit", label: "Gym Facilities & Visit" },
      { id: "products", label: "Supplements & Fitness Products" },
      { id: "partnership", label: "Partnership & Collaboration" },
      { id: "other", label: "Other" },
    ],
    submitLabel: "Send Message",
  },
  location: {
    eyebrow: "FIND OUR GYM",
    heading: "Your Fitness Destination Awaits.",
    paragraphs: [
      "Ready to see our gym for yourself? Find our location, plan your visit, and explore the environment where you can begin working toward your fitness goals.",
      "Whether you're interested in becoming a member or simply want to learn more about our facilities, we look forward to welcoming you.",
    ],
    address: site.address,
    action: { label: "View on Google Maps", href: site.directions },
  },
  faq: {
    eyebrow: "QUICK ANSWERS",
    heading: "Questions? We've Got You Covered.",
    items: [
      {
        id: "contact-memberships",
        question: "How can I inquire about gym memberships?",
        answer: `Call ${site.phone} or contact our team through the official Facebook or Instagram profiles for current plans, benefits, and membership requirements.`,
        category: "Contact",
      },
      {
        id: "contact-visits",
        question: "Can I visit the gym before becoming a member?",
        answer:
          "Please contact our team to ask about arranging a gym visit and confirm opening hours and any appointment requirements.",
        category: "Contact",
      },
      {
        id: "contact-training",
        question: "How can I get information about personal training?",
        answer:
          "Call our team to discuss personal training, current session availability, trainers, and pricing.",
        category: "Contact",
      },
      {
        id: "contact-products",
        question: "Can I contact you about supplements and fitness equipment?",
        answer:
          "Contact our team to confirm product availability, specifications, and ordering options. Online checkout is not available.",
        category: "Contact",
      },
      {
        id: "contact-response",
        question: "How soon will I receive a response?",
        answer:
          "Response times have not been confirmed. Please call the gym for current information.",
        category: "Contact",
      },
    ],
  },
  invitation: {
    eyebrow: "READY TO GET STARTED?",
    heading: "Your Next Step Starts Here.",
    paragraphs: [
      "Every fitness journey begins with a decision. Whether you have a question, need guidance, or are ready to explore your membership options, we're here to help you move forward.",
    ],
    membership: { label: "Explore Membership Plans", href: "/membership/" },
    call: { label: "Contact Our Team", href: telephone },
  },
});
