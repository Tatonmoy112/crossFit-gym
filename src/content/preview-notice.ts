import { z } from "zod";

export const previewNoticeContent = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
  })
  .parse({
    title: "Website preview",
    description:
      "This website is being rebuilt. Content is incomplete and awaiting approval.",
  });
