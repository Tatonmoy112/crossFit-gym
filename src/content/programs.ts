import { z } from "zod";
import { catalogSchema } from "@/schemas/content";
export const programs = z.array(catalogSchema).parse([]);
