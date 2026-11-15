import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogs, findItem } from "@/lib/content/catalogs";
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
  return (
    <section className="layout-container py-8">
      <h1>{item.title}</h1>
      <p>Page components are awaiting rebuild.</p>
      {item.status === "preview" && (
        <p>
          Structure preview only. No approved business record is represented.
        </p>
      )}
      <p>
        <Link prefetch={false} href="/blog/">
          Back to blog
        </Link>
      </p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
