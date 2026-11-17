import type { FAQ } from "@/schemas/content";
import { faqCollectionSchema } from "@/schemas/home-faq";

export function selectFaqs(records: FAQ[], ids: string[]): FAQ[] {
  const items = faqCollectionSchema.parse(records);
  if (new Set(ids).size !== ids.length)
    throw new Error("Duplicate homepage FAQ ID");
  return ids.map((id) => {
    const item = items.find((record) => record.id === id);
    if (!item) throw new Error(`Unknown homepage FAQ: ${id}`);
    return item;
  });
}
