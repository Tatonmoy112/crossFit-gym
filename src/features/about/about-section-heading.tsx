import { SectionHeading } from "@/components/shared/section-heading";

export function AboutSectionHeading({
  content,
  headingId,
}: {
  content: { eyebrow: string; heading: string };
  headingId: string;
}) {
  return (
    <div className="about-heading">
      <p className="about-eyebrow">{content.eyebrow}</p>
      <SectionHeading title={content.heading} headingId={headingId} />
    </div>
  );
}

export function AboutCopy({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="about-copy">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
