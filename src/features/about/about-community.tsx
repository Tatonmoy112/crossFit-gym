import { Container } from "@/components/shared/container";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

export function AboutCommunity({
  content,
}: {
  content: AboutPageContent["community"];
}) {
  return (
    <section
      data-about-section="community"
      className="about-section about-community"
      aria-labelledby="about-community-title"
    >
      <Container className="about-container">
        <div className="about-editorial-layout">
          <AboutSectionHeading
            content={content}
            headingId="about-community-title"
          />
          <AboutCopy paragraphs={content.paragraphs} />
        </div>
      </Container>
    </section>
  );
}
