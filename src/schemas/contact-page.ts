import { z } from "zod";
import { routes } from "@/config/routes";
import { site } from "@/content/site";
import { faqSchema } from "./content";

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const unique = (ids: string[]) => new Set(ids).size === ids.length;
const destination = z
  .string()
  .refine(
    (href) =>
      routes.some((route) => href === `${route.replace(/\/$/, "")}/`) ||
      [
        `tel:${site.telephone}`,
        site.directions,
        site.facebook,
        site.instagram,
      ].includes(href),
    "Use a registered route or an existing gym contact channel",
  );
const action = z.object({ label: text, href: destination });
const heading = z.object({ eyebrow: text, heading: text });
const editorial = heading.extend({ paragraphs: z.array(text).min(1) });

export const contactPageSchema = z.object({
  seo: z.object({ title: text, description: text }),
  hero: editorial.extend({ call: action, directions: action }),
  introduction: editorial,
  methods: heading.extend({
    phone: z.object({ heading: text, description: text, value: text, action }),
    visit: z.object({
      heading: text,
      description: text,
      address: text,
      action,
      hoursNote: text,
    }),
    socialLabel: text,
    socials: z
      .array(action)
      .length(2)
      .refine(
        (items) => unique(items.map((item) => item.href)),
        "Duplicate social channel",
      ),
  }),
  message: heading.extend({
    notice: text,
    fields: z.object({
      name: text,
      email: text,
      phone: text,
      topic: text,
      subject: text,
      message: text,
    }),
    topicPlaceholder: text,
    topics: z
      .array(z.object({ id, label: text }))
      .length(7)
      .refine(
        (items) => unique(items.map((item) => item.id)),
        "Duplicate inquiry topic ID",
      ),
    submitLabel: text,
  }),
  location: editorial.extend({ address: text, action }),
  faq: heading.extend({
    items: z
      .array(faqSchema)
      .length(5)
      .refine(
        (items) => unique(items.map((item) => item.id)),
        "Duplicate Contact FAQ ID",
      ),
  }),
  invitation: editorial.extend({ membership: action, call: action }),
});

export type ContactPageContent = z.infer<typeof contactPageSchema>;
export type ContactHeadingContent = z.infer<typeof heading>;
export type ContactActionContent = z.infer<typeof action>;
