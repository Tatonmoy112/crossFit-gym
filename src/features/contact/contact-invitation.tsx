import { Container } from "@/components/shared/container";
import type { ContactPageContent } from "@/schemas/contact-page";
import { ContactAction } from "./contact-action";
import { ContactCopy, ContactSectionHeading } from "./contact-section-heading";

export function ContactInvitation({
  content,
}: {
  content: ContactPageContent["invitation"];
}) {
  return (
    <section
      className="contact-section"
      data-contact-section="invitation"
      aria-labelledby="contact-invitation-title"
    >
      <Container className="contact-container">
        <div className="contact-invitation">
          <div className="contact-heading">
            <ContactSectionHeading
              content={content}
              id="contact-invitation-title"
            />
            <ContactCopy paragraphs={content.paragraphs} />
          </div>
          <div className="contact-actions">
            <ContactAction action={content.membership} />
            <ContactAction action={content.call} appearance="outline" />
          </div>
        </div>
      </Container>
    </section>
  );
}
