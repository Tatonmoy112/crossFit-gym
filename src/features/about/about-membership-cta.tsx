import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { AboutPageContent } from "@/schemas/about";
import { AboutCopy, AboutSectionHeading } from "./about-section-heading";

export function AboutMembershipCta({
  content,
}: {
  content: AboutPageContent["membership"];
}) {
  return (
    <section
      data-about-section="membership"
      className="about-membership"
      aria-labelledby="about-membership-title"
    >
      <Container className="about-container">
        <div className="about-membership-layout">
          <div className="about-membership-copy">
            <AboutSectionHeading
              content={content}
              headingId="about-membership-title"
            />
            <AboutCopy paragraphs={content.paragraphs} />
          </div>
          <Button asChild size="lg" className="about-action">
            <NavigationLink href={content.action.href}>
              {content.action.label}
              <ArrowUpRight aria-hidden="true" />
            </NavigationLink>
          </Button>
        </div>
      </Container>
    </section>
  );
}
