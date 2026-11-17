import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { HomeAffiliatesContent } from "@/schemas/home-affiliates";
import { PartnershipNetwork } from "./partnership-network";

export function HomeAffiliates({
  content,
}: {
  content: HomeAffiliatesContent;
}) {
  return (
    <section
      className="home-affiliates py-12 md:py-16"
      data-home-affiliates
      data-surface="charcoal"
      aria-labelledby="home-affiliates-title"
    >
      <Container className="home-affiliates-container">
        <div className="home-affiliates-layout">
          <header className="home-affiliates-intro grid min-w-0 gap-5">
            <p className="affiliates-eyebrow m-0 text-xs font-semibold tracking-[0.16em]">
              {content.eyebrow}
            </p>
            <SectionHeading
              headingId="home-affiliates-title"
              title={content.heading}
              description={content.description}
            />
          </header>
          <PartnershipNetwork
            label={content.diagramLabel}
            opportunities={content.opportunities}
          />
          <div className="home-affiliates-action">
            <Button
              asChild
              className="max-w-full rounded-full px-6 py-3 text-primary-foreground no-underline hover:bg-primary-hover hover:text-primary-foreground active:bg-primary-active active:text-primary-foreground"
            >
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
