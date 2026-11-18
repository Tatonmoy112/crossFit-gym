import { navigationSchema } from "@/schemas/navigation";

export const navigation = navigationSchema.parse([
  { label: "About", links: [{ label: "Our story", href: "/about" }] },
  { label: "Training", links: [{ label: "Membership", href: "/membership" }] },
  { label: "Explore", links: [{ label: "Products", href: "/products" }] },
  { label: "Visit us", links: [{ label: "Contact", href: "/contact" }] },
]);
