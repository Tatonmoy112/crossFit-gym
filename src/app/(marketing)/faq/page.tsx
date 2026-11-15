import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Frequently asked questions",
  "Find Crossfit Gym contact and visiting information, and ask about current training and membership options.",
  "/faq",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Frequently asked questions</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
