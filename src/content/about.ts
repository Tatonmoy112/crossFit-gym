import { aboutSchema } from "@/schemas/content";

// No story, mission, values or community text has been supplied yet.
export const about = aboutSchema.parse({
  story: null,
  mission: null,
  values: [],
  community: null,
});
