import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";
import { routes } from "@/config/routes";
import {
  homeHero,
  homeStats,
  homeStory,
  homeWhyChooseUs,
} from "@/content/home";
import { HomeHero } from "@/features/home/home-hero";
import { HomeStats } from "@/features/home/home-stats";
import { HomeStatsPreview } from "@/features/home/home-stats-preview";
import { HomeStory } from "@/features/home/home-story";
import { HomeWhyChooseUs } from "@/features/home/home-why-choose-us";

export const metadata = makeMetadata(
  "One step closer",
  "Find Crossfit Gym in Sector 12, Uttara, Dhaka. Explore the gym and contact the team.",
  "/",
);

export default function Page() {
  return (
    <>
      <HomeHero content={homeHero} />
      {homeStats.items.length > 0 ? (
        <HomeStats content={homeStats} />
      ) : (
        <HomeStatsPreview />
      )}
      <HomeWhyChooseUs content={homeWhyChooseUs} />
      <HomeStory content={homeStory} />
      <section className="layout-container py-8">
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
                  <Link
                    prefetch={false}
                    href={"/" + kind + "/content-preview/"}
                  >
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
    </>
  );
}
