import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Locations",
  "Find Crossfit Gym in Uttara, Dhaka. View the supplied address and get directions.",
  "/locations",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Locations</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
