import { z } from "zod";
import { catalogSchema } from "@/schemas/content";
export const articles = z.array(catalogSchema).parse([]);
