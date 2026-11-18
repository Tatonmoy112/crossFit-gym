import { z } from "zod";
import { routes } from "@/config/routes";
import { site } from "./site";

export const mobileDrawerContentSchema = z.object({
  title: z.string().trim().min(1),
  contact: z.object({
    label: z.string().trim().min(1),
    href: z
      .literal("/contact/")
      .refine(
        (href) => routes.includes(href.replace(/\/$/, "")),
        "Registered contact destination required",
      ),
  }),
  phone: z.object({
    label: z.string().trim().min(1),
    href: z.string().regex(/^tel:\+[1-9]\d{7,14}$/),
  }),
  location: z.string().trim().min(1),
});

export type MobileDrawerContent = z.infer<typeof mobileDrawerContentSchema>;

export const mobileDrawerContent = mobileDrawerContentSchema.parse({
  title: "Site navigation",
  contact: { label: "Contact the gym", href: "/contact/" },
  phone: { label: `Call ${site.phone}`, href: `tel:${site.telephone}` },
  location: site.shortAddress,
});
