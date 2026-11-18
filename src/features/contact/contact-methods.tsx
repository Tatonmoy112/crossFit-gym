import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Card } from "@/components/ui/card";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { ContactPageContent } from "@/schemas/contact-page";
import { ContactAction } from "./contact-action";
import { ContactSectionHeading } from "./contact-section-heading";
import { ContactMessagePreview } from "./contact-message-preview";

export function ContactMethods({
  content,
  message,
  preview,
}: {
  content: ContactPageContent["methods"];
  message: ContactPageContent["message"];
  preview: boolean;
}) {
  return (
    <section
      className="contact-section contact-methods-section"
      data-contact-section="methods"
      aria-labelledby="contact-methods-title"
    >
      <Container className="contact-container">
        <ContactSectionHeading content={content} id="contact-methods-title" />
        <div
          className={`contact-workspace ${preview ? "" : "contact-workspace-without-preview"}`}
        >
          <div className="contact-methods">
            <Card className="contact-card" data-surface="yellow">
              <Phone className="contact-icon" aria-hidden="true" />
              <h3>{content.phone.heading}</h3>
              <p>{content.phone.description}</p>
              <p className="contact-phone-number">{content.phone.value}</p>
              <div className="contact-actions">
                <ContactAction
                  action={content.phone.action}
                  appearance="dark"
                />
              </div>
            </Card>
            <Card className="contact-card" data-surface="charcoal">
              <MapPin className="contact-icon" aria-hidden="true" />
              <h3>{content.visit.heading}</h3>
              <p>{content.visit.description}</p>
              <address>{content.visit.address}</address>
              <p>{content.visit.hoursNote}</p>
              <div className="contact-actions">
                <ContactAction action={content.visit.action} />
              </div>
            </Card>
            <nav className="contact-socials" aria-label={content.socialLabel}>
              {content.socials.map((action) => (
                <NavigationLink key={action.href} href={action.href}>
                  {action.label}
                </NavigationLink>
              ))}
            </nav>
          </div>
          {preview && <ContactMessagePreview content={message} />}
        </div>
      </Container>
    </section>
  );
}
