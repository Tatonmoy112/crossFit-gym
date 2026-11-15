import {
  InquiryCTA,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { FAQExplorer } from "@/features/faq/faq-explorer";
import { faqs } from "@/content/faqs";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Frequently asked questions",
  "Find Crossfit Gym contact and visiting information, and ask about current training and membership options.",
  "/faq",
);
export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="A LITTLE CLARITY"
        title={"GOOD\nQUESTIONS."}
        description="Find the information we have, or get in touch for a conversation with the gym."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="FREQUENTLY ASKED"
            title="LET’S CLEAR THINGS UP."
          />
          <FAQExplorer items={faqs} />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
