import { z } from "zod";
import { catalogSchema } from "@/schemas/content";
export const vacancies = z.array(catalogSchema).parse([]);
