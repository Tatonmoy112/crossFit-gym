import { Container } from "@/components/shared/container";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

export function AboutApproach({
  content,
}: {
  content: AboutPageContent["approach"];
}) {
  return (
    <section
      data-about-section="approach"
      data-surface="charcoal"
      className="about-section about-approach"
      aria-labelledby="about-approach-title"
    >
      <Container className="about-container">
        <div className="about-section-stack">
          <div className="about-editorial-layout">
            <AboutSectionHeading
              content={content}
              headingId="about-approach-title"
            />
            <AboutCopy paragraphs={content.paragraphs} />
          </div>
          <p className="about-philosophy">{content.philosophy}</p>
        </div>
      </Container>
    </section>
  );
}
