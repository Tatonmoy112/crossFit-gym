import { navigationSchema } from "@/schemas/navigation";

export const navigation = navigationSchema.parse([
  {
    label: "About",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Coaches", href: "/coaches" },
      { label: "Facilities", href: "/facilities" },
      { label: "Gallery", href: "/gallery" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Training",
    links: [
      { label: "Programs", href: "/programs" },
      { label: "Class schedule", href: "/schedule" },
      { label: "Membership", href: "/membership" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    label: "Explore",
    links: [
      { label: "Journal", href: "/blog" },
      { label: "Affiliates", href: "/affiliates" },
      { label: "Products", href: "/products" },
    ],
  },
  {
    label: "Visit us",
    links: [
      { label: "Locations", href: "/locations" },
      { label: "Uttara, Dhaka", href: "/locations/uttara" },
      { label: "Contact", href: "/contact" },
    ],
  },
]);
