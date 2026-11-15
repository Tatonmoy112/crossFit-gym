import { z } from "zod";
import { navigationSchema } from "@/schemas/navigation";
import { legalDocuments } from "./legal";
import { site } from "./site";

const copy = z.string().trim().min(1);
const channel = z.object({
  label: copy,
  href: z
    .url()
    .refine(
      (href) => new URL(href).protocol === "https:",
      "HTTPS channel required",
    ),
});

export const footerContentSchema = z.object({
  address: copy,
  phone: z.object({
    label: copy,
    href: z.string().regex(/^tel:\+[1-9]\d{7,14}$/),
  }),
  directions: channel,
  hoursNote: copy,
  socials: z
    .array(channel)
    .min(1)
    .superRefine((links, context) => {
      const labels = new Set<string>();
      const hrefs = new Set<string>();
      links.forEach((link, index) => {
        const label = link.label.toLowerCase();
        if (labels.has(label) || hrefs.has(link.href))
          context.addIssue({
            code: "custom",
            message: "Duplicate social channel",
            path: [index],
          });
        labels.add(label);
        hrefs.add(link.href);
      });
    }),
  legal: navigationSchema,
  legalNotice: copy.nullable(),
});

export const footerContent = footerContentSchema.parse({
  address: site.address,
  phone: { label: site.phone, href: `tel:${site.telephone}` },
  directions: { label: "Get directions", href: site.directions },
  hoursNote: "Opening hours have not been supplied. Call to confirm.",
  socials: [
    { label: "Facebook", href: site.facebook },
    { label: "Instagram", href: site.instagram },
  ],
  legal: [
    {
      label: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  legalNotice: Object.values(legalDocuments).some(
    (document) => !document.approved,
  )
    ? "Legal text is awaiting approval."
    : null,
});
