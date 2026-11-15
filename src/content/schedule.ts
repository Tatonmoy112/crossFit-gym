import { z } from "zod";
import { classSchema } from "@/schemas/content";
export const classes = z.array(classSchema).parse([]);
export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
