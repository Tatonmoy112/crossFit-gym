import {
  InquiryCTA,
  PageHero,
  PendingContent,
  SectionHeading,
} from "@/components/shared/sections";
import { metadata as makeMetadata } from "@/lib/seo";
import { affiliateOffering } from "@/content/affiliates";
import { coaches } from "@/content/coaches";
import { ContentCard } from "@/components/shared/content-card";
import { ButtonLink } from "@/components/ui/button";
export const metadata = makeMetadata(
  "Affiliates",
  "Contact Crossfit Gym about affiliate and partnership inquiries. No affiliate offering has been confirmed for publication.",
  "/affiliates",
);
export default function AffiliatesPage() {
  const offering = affiliateOffering;
  return (
    <>
      <PageHero
        eyebrow="CONNECTIONS & COLLABORATION"
        title={"LET’S TALK\nPARTNERSHIPS."}
        description="For affiliate and partnership inquiries, speak directly with Crossfit Gym."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="AFFILIATE INFORMATION"
            title="BUILD THE RIGHT CONNECTION."
          />
          {offering ? (
            <div className="prose">
              <h2>{offering.title}</h2>
              <p>{offering.description}</p>
              <div className="steps-grid">
                {offering.tracks.map((track) => (
                  <section key={track.heading}>
                    <h3>{track.heading}</h3>
                    <p>{track.body}</p>
                    <ul>
                      {track.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
              <h2>What’s included</h2>
              <ul>
                {offering.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
              <div className="button-row">
                {offering.providers.map((provider) => (
                  <ButtonLink key={provider.href} href={provider.href}>
                    {provider.label}
                  </ButtonLink>
                ))}
              </div>
              <div className="catalog-grid">
                {coaches
                  .filter((coach) => offering.coachSlugs.includes(coach.slug))
                  .map((coach) => (
                    <ContentCard key={coach.slug} item={coach} base="coaches" />
                  ))}
              </div>
            </div>
          ) : (
            <PendingContent
              title="Affiliate information awaits confirmation."
              description="An affiliate offering, training tracks, benefits, participating coaches and provider destinations have not been supplied for this gym. The reference’s Invictus affiliate program is not represented as a Crossfit Gym service."
            />
          )}
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionHeading
            eyebrow="THE AFFILIATE GUIDE"
            title="WHAT THIS PAGE WILL COVER."
          />
          <div className="steps-grid">
            {[
              {
                title: "Program & tracks",
                body: "Approved program overview, eligibility and training-track descriptions.",
              },
              {
                title: "Benefits & coaches",
                body: "Confirmed inclusions, coaching information and associated profiles.",
              },
              {
                title: "Getting started",
                body: "Verified provider destinations, signup instructions and common questions.",
              },
            ].map((item, i) => (
              <div key={item.title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
