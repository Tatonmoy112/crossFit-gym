import { CatalogPage } from "@/features/catalog/catalog-page";
import { pageContent } from "@/content/pages";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  pageContent.blog.label,
  pageContent.blog.description,
  "/blog",
);
export default function Page() {
  return <CatalogPage kind="blog" />;
}
