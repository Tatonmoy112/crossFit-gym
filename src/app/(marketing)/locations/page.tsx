import {
  GymPhoto,
  InquiryCTA,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { ButtonLink } from "@/components/ui/button";
import { locations } from "@/content/locations";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Locations",
  "Find Crossfit Gym in Uttara, Dhaka. View the supplied address and get directions.",
  "/locations",
);
export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="FIND YOUR WAY HERE"
        title={"YOUR GYM.\nRIGHT HERE."}
        description="Find Crossfit Gym in Sector 12, Uttara, Dhaka."
      />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="OUR LOCATION" title="COME SAY HELLO." />
          <div className="locations-grid">
            {locations.map((location) => (
              <article className="location-card" key={location.slug}>
                <GymPhoto />
                <div className="location-card-copy">
                  <p className="eyebrow">{location.category}</p>
                  <h2>{location.title}</h2>
                  <p>{location.summary}</p>
                  <ButtonLink
                    href={`/locations/${location.slug}`}
                    variant="dark"
                  >
                    Explore this location
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
