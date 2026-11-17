import { ArrowUpRight, Focus } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

export function AboutPurpose({
  content,
}: {
  content: AboutPageContent["purpose"];
}) {
  return (
    <section
      data-about-section="purpose"
      className="about-section about-purpose"
      aria-labelledby="about-purpose-title"
    >
      <Container className="about-container">
        <div className="about-section-stack">
          <AboutSectionHeading
            content={content}
            headingId="about-purpose-title"
          />
          <div className="about-purpose-grid">
            <article
              data-surface="charcoal"
              className="about-purpose-panel"
              aria-labelledby="about-mission-title"
            >
              <div className="about-panel-label">
                <p>{content.mission.title}</p>
                <Focus aria-hidden="true" />
              </div>
              <h3 id="about-mission-title">{content.mission.heading}</h3>
              <AboutCopy paragraphs={content.mission.paragraphs} />
            </article>
            <article
              data-surface="light"
              className="about-purpose-panel about-vision"
              aria-labelledby="about-vision-title"
            >
              <div className="about-panel-label">
                <p>{content.vision.title}</p>
                <ArrowUpRight aria-hidden="true" />
              </div>
              <h3 id="about-vision-title">{content.vision.heading}</h3>
              <AboutCopy paragraphs={content.vision.paragraphs} />
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
}
