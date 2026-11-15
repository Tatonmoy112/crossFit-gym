import Link from "next/link";
import { notFound } from "next/navigation";
import { locations } from "@/content/locations";
import { metadata as makeMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);
  return location
    ? makeMetadata(location.title, location.summary, `/locations/${slug}`)
    : {};
}
export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);
  if (!location) notFound();
  return (
    <section className="layout-container py-8">
      <h1>{location.title}</h1>
      <p>Page components are awaiting rebuild.</p>
      <p>
        <Link prefetch={false} href="/locations/">
          Back to locations
        </Link>
      </p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
