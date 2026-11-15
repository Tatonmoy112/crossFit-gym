import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";
import { pageContent } from "@/content/pages";

export const metadata = makeMetadata(
  pageContent.supplements.label,
  pageContent.supplements.description,
  "/supplements",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Supplements</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
