import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Website terms",
  "Terms publication status for the Crossfit Gym website preview.",
  "/terms",
  true,
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Terms</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
