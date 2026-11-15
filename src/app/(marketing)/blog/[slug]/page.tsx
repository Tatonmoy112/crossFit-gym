import { notFound } from "next/navigation";
import { catalogs, findItem } from "@/lib/content/catalogs";
import { DetailPage } from "@/features/catalog/detail-page";
import { metadata as makeMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...catalogs.blog.map((item) => ({ slug: item.slug })),
    { slug: "content-preview" },
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem("blog", slug);
  return item
    ? makeMetadata(
        item.title,
        item.summary,
        "/blog/" + slug,
        item.status === "preview",
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem("blog", slug);
  if (!item) notFound();
  return <DetailPage kind="blog" item={item} />;
}
