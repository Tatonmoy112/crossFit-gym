import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Membership",
  "Speak to Crossfit Gym about current membership options, prices and joining information.",
  "/membership",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Membership</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
