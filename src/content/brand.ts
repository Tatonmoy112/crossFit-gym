import { z } from "zod";
import { imageSchema } from "@/schemas/content";
import { site } from "./site";

export const brand = z
  .object({
    name: z.string().min(1),
    href: z.literal("/"),
    image: imageSchema,
  })
  .parse({
    name: site.name,
    href: "/",
    image: {
      src: "/images/brand/brand-mark.webp",
      alt: `${site.name} running-figure logo`,
      width: 192,
      height: 192,
    },
  });
