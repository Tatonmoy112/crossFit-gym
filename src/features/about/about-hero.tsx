import Image from "next/image";
import { Container } from "@/components/shared/container";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy } from "./about-section-heading";

export function AboutHero({ content }: { content: AboutPageContent["hero"] }) {
  return (
    <section
      data-about-section="hero"
      data-surface="charcoal"
      className="about-hero"
      aria-labelledby="about-hero-title"
    >
      <Image
        {...content.image}
        alt={content.image.alt}
        unoptimized
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="about-hero-image"
      />
      <Container className="about-hero-content">
        <div className="about-hero-intro">
          <p className="about-eyebrow">{content.eyebrow}</p>
          <h1 id="about-hero-title">{content.heading}</h1>
          <AboutCopy paragraphs={content.paragraphs} />
        </div>
      </Container>
    </section>
  );
}
