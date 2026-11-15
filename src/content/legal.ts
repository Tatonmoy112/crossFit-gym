import { z } from "zod";
import { sectionSchema } from "@/schemas/content";
const legalSchema = z.object({
  approved: z.boolean(),
  effectiveDate: z.iso.date().optional(),
  sections: z.array(sectionSchema),
});
export const legalDocuments = {
  privacy: legalSchema.parse({ approved: false, sections: [] }),
  terms: legalSchema.parse({ approved: false, sections: [] }),
};
