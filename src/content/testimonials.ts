import { z } from "zod";
const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string().min(1),
  attribution: z.string().min(1),
});
export const testimonials = z.array(testimonialSchema).parse([]);
