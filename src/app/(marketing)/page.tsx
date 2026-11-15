import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";
import { routes } from "@/config/routes";

export const metadata = makeMetadata(
  "One step closer",
  "Find Crossfit Gym in Sector 12, Uttara, Dhaka. Explore the gym and contact the team.",
  "/",
);

export default function Page() {
  return (
    <section className="layout-container py-8">
      <h1>Home</h1>
      <p>Page components are awaiting rebuild.</p>
      <nav aria-label="Page inventory">
        <ul>
          {routes
            .filter((path) => path !== "/")
            .map((path) => (
              <li key={path}>
                <Link prefetch={false} href={path + "/"}>
                  {path}/
                </Link>
              </li>
            ))}
          {["programs", "coaches", "blog", "careers", "supplements"].map(
            (kind) => (
              <li key={kind}>
                <Link prefetch={false} href={"/" + kind + "/content-preview/"}>
                  {"/" + kind + "/content-preview/"}
                </Link>
              </li>
            ),
          )}
          <li>
            <Link prefetch={false} href="/locations/uttara/">
              /locations/uttara/
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
