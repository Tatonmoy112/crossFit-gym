import { Container } from "@/components/shared/container";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

export function AboutStory({
  content,
}: {
  content: AboutPageContent["story"];
}) {
  return (
    <section
      data-about-section="story"
      className="about-section"
      aria-labelledby="about-story-title"
    >
      <Container className="about-container">
        <div className="about-editorial-layout">
          <AboutSectionHeading
            content={content}
            headingId="about-story-title"
          />
          <AboutCopy paragraphs={content.paragraphs} />
        </div>
      </Container>
    </section>
  );
}
