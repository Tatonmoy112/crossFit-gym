import { z } from "zod";

const contentStateSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export type ContentStateContent = z.infer<typeof contentStateSchema>;

export const programsContentState = contentStateSchema.parse({
  title: "Program information is not available yet",
  description:
    "No approved program details have been supplied for this website.",
});
