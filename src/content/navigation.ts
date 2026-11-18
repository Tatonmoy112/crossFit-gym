import { navigationSchema } from "@/schemas/navigation";

export const navigation = navigationSchema.parse([
  {
    label: "About",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Coaches", href: "/coaches" },
      { label: "Facilities", href: "/facilities" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Training",
    links: [
      { label: "Membership", href: "/membership" },
      { label: "Programs", href: "/programs" },
      { label: "Schedule", href: "/schedule" },
    ],
  },
  {
    label: "Explore",
    links: [
      { label: "Products", href: "/products" },
      { label: "Gallery", href: "/gallery" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Affiliates", href: "/affiliates" },
    ],
  },
  {
    label: "Visit us",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Locations", href: "/locations" },
    ],
  },
]);
