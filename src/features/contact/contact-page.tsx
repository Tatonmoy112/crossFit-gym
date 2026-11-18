import type { ContactPageContent } from "@/schemas/contact-page";
import { ContactHero } from "./contact-hero";
import { ContactIntroduction } from "./contact-introduction";
import { ContactMethods } from "./contact-methods";
import { ContactLocation } from "./contact-location";
import { ContactFaq } from "./contact-faq";
import { ContactInvitation } from "./contact-invitation";

export function ContactPage({
  content,
  preview,
}: {
  content: ContactPageContent;
  preview: boolean;
}) {
  return (
    <div className="contact-page" data-contact-page data-surface="light">
      <ContactHero content={content.hero} />
      <ContactIntroduction content={content.introduction} />
      <ContactMethods
        content={content.methods}
        message={content.message}
        preview={preview}
      />
      <ContactLocation content={content.location} />
      <ContactFaq content={content.faq} />
      <ContactInvitation content={content.invitation} />
    </div>
  );
}
