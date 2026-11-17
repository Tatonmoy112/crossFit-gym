import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import {
  AboutCopy,
  AboutSectionHeading,
} from "@/features/about/about-section-heading";
import type { HomeAboutContent } from "@/schemas/about";

export function HomeAbout({ content }: { content: HomeAboutContent }) {
  return (
    <section
      data-home-about
      data-surface="light"
      className="about-section home-about"
      aria-labelledby="home-about-title"
    >
      <Container className="about-container">
        <div className="home-about-layout">
          <div className="home-about-photo">
            <Image
              {...content.image}
              alt={content.image.alt}
              unoptimized
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="home-about-content">
            <AboutSectionHeading
              content={content}
              headingId="home-about-title"
            />
            <AboutCopy paragraphs={content.paragraphs} />
            <Button asChild size="lg" className="about-action">
              <NavigationLink href={content.action.href}>
                {content.action.label}
                <ArrowUpRight aria-hidden="true" />
              </NavigationLink>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
