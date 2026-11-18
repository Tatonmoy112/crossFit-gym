import { SectionHeading } from "@/components/shared/section-heading";
import type { ContactHeadingContent } from "@/schemas/contact-page";

export function ContactSectionHeading({
  content,
  id,
}: {
  content: ContactHeadingContent;
  id: string;
}) {
  return (
    <header className="contact-heading">
      <p className="contact-eyebrow">{content.eyebrow}</p>
      <SectionHeading title={content.heading} headingId={id} />
    </header>
  );
}

export function ContactCopy({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="contact-copy">
      {paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}
