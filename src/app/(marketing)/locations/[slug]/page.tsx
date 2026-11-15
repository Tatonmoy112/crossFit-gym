import { SiteLink as Link } from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import {
  GymPhoto,
  InquiryCTA,
  LocationDetails,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { ButtonLink } from "@/components/ui/button";
import { locations } from "@/content/locations";
import { site } from "@/content/site";
import { indexable, siteUrl } from "@/config/site";
import { metadata as makeMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);
  return location
    ? makeMetadata(location.title, location.summary, `/locations/${slug}`)
    : {};
}
export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);
  if (!location) notFound();
  const structured = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: site.name,
    url: new URL(`/locations/${slug}/`, siteUrl).href,
    telephone: site.telephone,
    image: new URL("/images/brand/cover.png", siteUrl).href,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "House 2, Road 2/A, Sector 12, Sonargoan Janapat Road, Uttara",
      addressLocality: "Dhaka",
      postalCode: "1230",
      addressCountry: "BD",
    },
    sameAs: [site.facebook, site.instagram],
  };
  return (
    <>
      {indexable && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <PageHero
        eyebrow="OUR UTTARA LOCATION"
        title={"UTTARA.\nDHAKA."}
        description={location.summary}
      />
      <section className="section">
        <div className="container">
          <div className="location-photo">
            <GymPhoto />
          </div>
          <div className="location-grid">
            <LocationDetails />
            <div className="location-detail-body">
              <p className="eyebrow">PLAN YOUR VISIT</p>
              <h3>We’re a phone call away.</h3>
              <p className="section-description">
                Confirm current opening hours, training options and any access
                requirements before you visit.
              </p>
              <div className="location-hours">
                <p className="eyebrow">OPENING HOURS</p>
                <p className="small-note">
                  Current opening hours have not been supplied. Please contact
                  the gym for confirmation.
                </p>
              </div>
              <div className="button-row" style={{ marginTop: 25 }}>
                <ButtonLink href={site.directions} variant="dark">
                  Open Google Maps
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionHeading
            eyebrow="EXPLORE THIS GYM"
            title="GET TO KNOW THE PLACE."
          />
          <div className="feature-links">
            {[
              { href: "/facilities", title: "Facilities" },
              { href: "/coaches", title: "Coaches" },
              { href: "/programs", title: "Programs" },
              { href: "/schedule", title: "Class schedule" },
              { href: "/gallery", title: "Gallery" },
              { href: "/contact", title: "Get in touch" },
            ].map((item) => (
              <Link key={item.href} className="feature-link" href={item.href}>
                {item.title}
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
