import { z } from "zod";
import { catalogSchema } from "@/schemas/content";
export const supplements = z.array(catalogSchema).parse([]);
