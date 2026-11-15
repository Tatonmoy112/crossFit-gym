import {
  GymPhoto,
  InquiryCTA,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { ButtonLink } from "@/components/ui/button";
import { metadata as makeMetadata } from "@/lib/seo";
import { facilities } from "@/content/facilities";
export const metadata = makeMetadata(
  "Facilities",
  "Take a look inside Crossfit Gym and arrange a visit to the Uttara location.",
  "/facilities",
);
export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="THE SPACE"
        title={"ROOM FOR\nYOUR NEXT MOVE."}
        description="Take a first look inside Crossfit Gym, using the gym’s supplied cover photograph."
      />
      <section className="section">
        <div className="container">
          <div className="location-photo">
            <GymPhoto />
          </div>
          <div className="two-column">
            <div>
              <p className="eyebrow">EXPLORE THE GYM</p>
              <h2>A LOOK INSIDE.</h2>
            </div>
            <div>
              <p>
                The supplied photograph offers a first look at the gym. Contact
                the team to confirm its current equipment, amenities and
                accessibility provisions before visiting.
              </p>
              <div className="button-row" style={{ marginTop: 25 }}>
                <ButtonLink href="/gallery" variant="dark">
                  View gallery
                </ButtonLink>
                <ButtonLink href="/locations/uttara" variant="text">
                  Plan a visit
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionHeading eyebrow="FACILITIES GUIDE" title="GET THE DETAILS." />
          <div className="steps-grid">
            {(facilities.length > 0
              ? facilities.map((area) => ({
                  title: area.heading,
                  body: area.body,
                }))
              : [
                  {
                    title: "Training zones",
                    body: "The current layout and training-area descriptions are awaiting confirmation.",
                  },
                  {
                    title: "Equipment & amenities",
                    body: "An approved equipment and amenities inventory is needed before publication.",
                  },
                  {
                    title: "Access & visiting",
                    body: "Call ahead to confirm access arrangements and opening hours.",
                  },
                ]
            ).map((item, i) => (
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
