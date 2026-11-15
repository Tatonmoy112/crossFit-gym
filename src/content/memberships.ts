import { z } from "zod";
import { membershipSchema } from "@/schemas/content";
export const memberships = z.array(membershipSchema).parse([]);
