import { z } from "zod";
import { sectionSchema } from "@/schemas/content";
export const facilities = z.array(sectionSchema).parse([]);
