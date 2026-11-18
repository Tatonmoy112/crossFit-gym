import { z } from "zod";
import { routes } from "@/config/routes";

const destinations = new Set(routes);

export const navigationSchema = z
  .array(
    z.object({
      label: z.string().trim().min(1),
      links: z
        .array(
          z.object({
            label: z.string().trim().min(1),
            href: z
              .string()
              .regex(
                /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/,
              )
              .refine(
                (href) => destinations.has(href),
                "Unknown navigation destination",
              ),
          }),
        )
        .min(1),
    }),
  )
  .min(1)
  .superRefine((groups, context) => {
    const labels = new Set<string>();
    const hrefs = new Set<string>();
    groups.forEach((group, groupIndex) => {
      const label = group.label.toLowerCase();
      if (labels.has(label))
        context.addIssue({
          code: "custom",
          message: "Duplicate navigation group",
          path: [groupIndex, "label"],
        });
      labels.add(label);
      group.links.forEach((link, linkIndex) => {
        if (hrefs.has(link.href))
          context.addIssue({
            code: "custom",
            message: "Duplicate navigation destination",
            path: [groupIndex, "links", linkIndex, "href"],
          });
        hrefs.add(link.href);
      });
    });
  });

export type NavigationGroup = z.infer<typeof navigationSchema>[number];
