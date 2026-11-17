import { Container } from "@/components/shared/container";
import { FaqDisclosures } from "@/features/faq/faq-disclosures";
import { FaqRow } from "@/features/faq/faq-row";
import type { FAQ } from "@/schemas/content";
import type { MembershipPageContent } from "@/schemas/membership-page";
import { MembershipSectionHeading } from "./membership-section-heading";

export function MembershipFaq({
  content,
  items,
}: {
  content: MembershipPageContent["faq"];
  items: FAQ[];
}) {
  return (
    <section
      id="membership-faq"
      tabIndex={-1}
      className="membership-section membership-fragment membership-faq"
      data-membership-section="faq"
      aria-labelledby="membership-faq-title"
    >
      <Container className="membership-faq-container grid gap-8">
        <MembershipSectionHeading
          content={content}
          headingId="membership-faq-title"
        />
        <FaqDisclosures>
          {items.map((item, index) => (
            <FaqRow
              key={item.id}
              item={item}
              index={index}
              group="membership-faq"
            />
          ))}
        </FaqDisclosures>
      </Container>
    </section>
  );
}
