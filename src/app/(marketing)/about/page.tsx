import { NavigationLink } from "@/components/ui/navigation-link";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  "About the gym",
  "Get to know Crossfit Gym in Uttara, Dhaka, and find the people, place and training information.",
  "/about",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>About</h1>
      <p>Page components are awaiting rebuild.</p>
      <NavigationLink href="/">Back to home</NavigationLink>
    </section>
  );
}
