import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Contact",
  "Call Crossfit Gym at 01323-275695 or find the gym at Sector 12, Uttara, Dhaka.",
  "/contact",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Contact</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
