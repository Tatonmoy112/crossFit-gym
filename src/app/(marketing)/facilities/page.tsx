import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Facilities",
  "Take a look inside Crossfit Gym and arrange a visit to the Uttara location.",
  "/facilities",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Facilities</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
