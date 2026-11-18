import { Container } from "@/components/shared/container";
import type { ContactPageContent } from "@/schemas/contact-page";
import { ContactCopy, ContactSectionHeading } from "./contact-section-heading";

export function ContactIntroduction({
  content,
}: {
  content: ContactPageContent["introduction"];
}) {
  return (
    <section
      className="contact-section"
      data-contact-section="introduction"
      aria-labelledby="contact-introduction-title"
    >
      <Container className="contact-container">
        <div className="contact-intro-layout">
          <ContactSectionHeading
            content={content}
            id="contact-introduction-title"
          />
          <ContactCopy paragraphs={content.paragraphs} />
        </div>
      </Container>
    </section>
  );
}
