import { Container } from "@/components/shared/container";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

export function AboutValues({
  content,
}: {
  content: AboutPageContent["values"];
}) {
  return (
    <section
      data-about-section="values"
      className="about-section"
      aria-labelledby="about-values-title"
    >
      <Container className="about-container">
        <div className="about-section-stack">
          <div className="about-editorial-layout">
            <AboutSectionHeading
              content={content}
              headingId="about-values-title"
            />
            <AboutCopy paragraphs={content.paragraphs} />
          </div>
          <ol className="about-values-grid">
            {content.items.map((item, index) => (
              <li key={item.id}>
                <span className="about-value-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
