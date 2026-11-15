import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Affiliates",
  "Contact Crossfit Gym about affiliate and partnership inquiries. No affiliate offering has been confirmed for publication.",
  "/affiliates",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Affiliates</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
