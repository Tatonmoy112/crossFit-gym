import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

export function AboutFinalCta({
  content,
}: {
  content: AboutPageContent["cta"];
}) {
  return (
    <section
      data-about-section="cta"
      className="about-section about-final-cta"
      aria-labelledby="about-cta-title"
    >
      <Container className="about-container">
        <div className="about-final-content">
          <AboutSectionHeading content={content} headingId="about-cta-title" />
          <AboutCopy paragraphs={content.paragraphs} />
          <div className="about-actions">
            <Button asChild size="lg" className="about-action">
              <NavigationLink href={content.primary.href}>
                {content.primary.label}
                <ArrowUpRight aria-hidden="true" />
              </NavigationLink>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="about-action"
            >
              <NavigationLink href={content.secondary.href}>
                {content.secondary.label}
              </NavigationLink>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
