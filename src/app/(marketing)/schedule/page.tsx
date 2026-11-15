import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "Class schedule",
  "Find class information and contact Crossfit Gym for its current weekly schedule. All times are local to Dhaka.",
  "/schedule",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Schedule</h1>
      <p>Page components are awaiting rebuild.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
