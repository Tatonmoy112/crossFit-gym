import { Container } from "@/components/shared/container";
import type { ContactPageContent } from "@/schemas/contact-page";
import { ContactAction } from "./contact-action";
import { ContactCopy } from "./contact-section-heading";

export function ContactHero({
  content,
}: {
  content: ContactPageContent["hero"];
}) {
  return (
    <section data-contact-section="hero" aria-labelledby="contact-title">
      <Container className="contact-container">
        <div className="contact-editorial">
          <header className="contact-heading">
            <p className="contact-eyebrow">{content.eyebrow}</p>
            <h1 id="contact-title">{content.heading}</h1>
          </header>
          <div className="contact-copy">
            <ContactCopy paragraphs={content.paragraphs} />
            <div className="contact-actions">
              <ContactAction action={content.call} />
              <ContactAction action={content.directions} appearance="outline" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
