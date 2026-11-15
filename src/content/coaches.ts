import { z } from "zod";
import { catalogSchema } from "@/schemas/content";
export const coaches = z.array(catalogSchema).parse([]);
