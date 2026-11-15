import {
  InquiryCTA,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { MembershipPlans } from "@/features/membership/membership-plans";
import { FAQExplorer } from "@/features/faq/faq-explorer";
import { memberships } from "@/content/memberships";
import { faqs } from "@/content/faqs";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Membership",
  "Speak to Crossfit Gym about current membership options, prices and joining information.",
  "/membership",
);
export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="TAKE THE NEXT STEP"
        title={"MAKE IT\nYOUR GYM."}
        description="Find out about membership at Crossfit Gym. Talk to the team for current plans and fees."
      />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="MEMBERSHIP OPTIONS" title="FIND YOUR FIT." />
          <MembershipPlans plans={memberships} />
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionHeading
            eyebrow="LET’S GET STARTED"
            title="THREE SIMPLE NEXT STEPS."
          />
          <div className="steps-grid">
            {[
              {
                title: "Get in touch",
                body: "Call the team and ask about current membership and training options.",
              },
              {
                title: "Plan a visit",
                body: "Confirm opening hours and ask about visiting the Uttara gym.",
              },
              {
                title: "Discuss your options",
                body: "Confirm current fees, membership terms and joining requirements directly with the gym.",
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
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="A LITTLE CLARITY" title="YOUR QUESTIONS." />
          <FAQExplorer
            items={faqs.filter(
              (item) =>
                item.category === "Training" || item.category === "Contact",
            )}
          />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
