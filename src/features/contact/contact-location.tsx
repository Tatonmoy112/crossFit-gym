import { MapPin } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { ContactPageContent } from "@/schemas/contact-page";
import { ContactAction } from "./contact-action";
import { ContactCopy, ContactSectionHeading } from "./contact-section-heading";

export function ContactLocation({
  content,
}: {
  content: ContactPageContent["location"];
}) {
  return (
    <section
      className="contact-section"
      data-contact-section="location"
      aria-labelledby="contact-location-title"
    >
      <Container className="contact-container">
        <div className="contact-intro-layout">
          <ContactSectionHeading
            content={content}
            id="contact-location-title"
          />
          <ContactCopy paragraphs={content.paragraphs} />
        </div>
        <div className="contact-visit-panel">
          <MapPin className="contact-icon" aria-hidden="true" />
          <address>{content.address}</address>
          <div className="contact-actions">
            <ContactAction action={content.action} appearance="outline" />
          </div>
        </div>
      </Container>
    </section>
  );
}
