import { programs } from "@/content/programs";
import { coaches } from "@/content/coaches";
import { articles } from "@/content/articles";
import { vacancies } from "@/content/vacancies";
import { supplements } from "@/content/supplements";
import {
  pageContent,
  previewSections,
  type CatalogKind,
} from "@/content/pages";
import { catalogSchema } from "@/schemas/content";
import { locations } from "@/content/locations";
import { classes } from "@/content/schedule";
import { memberships } from "@/content/memberships";
import { validateContentRelationships } from "./validate";
export const catalogs = {
  programs,
  coaches,
  blog: articles,
  careers: vacancies,
  supplements,
};
validateContentRelationships({ ...catalogs, locations }, classes, memberships);
export function previewItem(kind: CatalogKind) {
  return catalogSchema.parse({
    slug: "content-preview",
    title: `${pageContent[kind].label} · page preview`,
    summary:
      "This is a preview of the page structure. Approved business content is required before publication.",
    category: "Content preview",
    status: "preview",
    sections: previewSections[kind].map((heading) => ({
      heading,
      body: "Approved content for this section has not yet been supplied. This preview does not describe an actual service, person, article, vacancy or product.",
    })),
  });
}
export function findItem(kind: CatalogKind, slug: string) {
  return slug === "content-preview"
    ? previewItem(kind)
    : catalogs[kind].find((item) => item.slug === slug);
}
