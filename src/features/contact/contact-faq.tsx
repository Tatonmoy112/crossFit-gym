import { Container } from "@/components/shared/container";
import { FaqDisclosures } from "@/features/faq/faq-disclosures";
import { FaqRow } from "@/features/faq/faq-row";
import type { ContactPageContent } from "@/schemas/contact-page";
import { ContactSectionHeading } from "./contact-section-heading";

export function ContactFaq({
  content,
}: {
  content: ContactPageContent["faq"];
}) {
  return (
    <section
      className="contact-section"
      data-contact-section="faq"
      aria-labelledby="contact-faq-title"
    >
      <Container className="contact-container">
        <div className="contact-faq-layout">
          <ContactSectionHeading content={content} id="contact-faq-title" />
          <FaqDisclosures>
            {content.items.map((item, index) => (
              <FaqRow
                key={item.id}
                item={item}
                index={index}
                group="contact-faq"
              />
            ))}
          </FaqDisclosures>
        </div>
      </Container>
    </section>
  );
}
