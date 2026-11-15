import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogs, findItem } from "@/lib/content/catalogs";
import { metadata as makeMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...catalogs.careers.map((item) => ({ slug: item.slug })),
    { slug: "content-preview" },
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem("careers", slug);
  return item
    ? makeMetadata(
        item.title,
        item.summary,
        "/careers/" + slug,
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
  const item = findItem("careers", slug);
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
        <Link prefetch={false} href="/careers/">
          Back to careers
        </Link>
      </p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
