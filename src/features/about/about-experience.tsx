import { HandHeart, Target, Flame, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

const icons = {
  welcome: HandHeart,
  goals: Target,
  motivation: Flame,
  community: Users,
};

export function AboutExperience({
  content,
}: {
  content: AboutPageContent["experience"];
}) {
  return (
    <section
      data-about-section="experience"
      className="about-section about-experience"
      aria-labelledby="about-experience-title"
    >
      <Container className="about-container">
        <div className="about-section-stack">
          <div className="about-editorial-layout">
            <AboutSectionHeading
              content={content}
              headingId="about-experience-title"
            />
            <AboutCopy paragraphs={content.paragraphs} />
          </div>
          <ul className="about-experience-grid">
            {content.items.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li key={item.id}>
                  <span className="about-feature-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
