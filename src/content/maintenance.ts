import { z } from "zod";

export const maintenancePageSchema = z.object({
  title: z.string().trim().min(1),
  path: z.string().regex(/^\/[a-z]+$/),
});

export const maintenancePages = z
  .array(maintenancePageSchema)
  .superRefine((pages, context) => {
    const paths = new Set<string>();
    pages.forEach((page, index) => {
      if (paths.has(page.path))
        context.addIssue({
          code: "custom",
          message: "Duplicate maintenance route",
          path: [index, "path"],
        });
      paths.add(page.path);
    });
  })
  .parse([
    { title: "Programs", path: "/programs" },
    { title: "Coaches", path: "/coaches" },
    { title: "Facilities", path: "/facilities" },
    { title: "Schedule", path: "/schedule" },
    { title: "Gallery", path: "/gallery" },
    { title: "FAQ", path: "/faq" },
    { title: "Blog", path: "/blog" },
    { title: "Affiliates", path: "/affiliates" },
    { title: "Locations", path: "/locations" },
    { title: "Careers", path: "/careers" },
  ]);

export type MaintenancePageContent = z.infer<typeof maintenancePageSchema>;

export const maintenanceCopy = z
  .object({
    status: z.string().min(1),
    description: z.string().min(1),
    home: z.string().min(1),
    contact: z.string().min(1),
  })
  .parse({
    status: "Under maintenance",
    description:
      "This page is being prepared. Please contact the gym for current information.",
    home: "Back to home",
    contact: "Contact the gym",
  });

export function maintenancePage(path: string): MaintenancePageContent {
  const page = maintenancePages.find((entry) => entry.path === path);
  if (!page) throw new Error(`Unknown maintenance page: ${path}`);
  return page;
}
