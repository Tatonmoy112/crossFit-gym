import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Gallery",
  "See the supplied Crossfit Gym photograph and contact the gym to arrange your visit.",
  "/gallery",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Gallery</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
