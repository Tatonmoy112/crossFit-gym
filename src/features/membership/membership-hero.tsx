import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { homeHero } from "@/content/home";
import type { MembershipPageContent } from "@/schemas/membership-page";
import { MembershipSectionLink } from "./membership-section-link";

export function MembershipHero({
  content,
}: {
  content: MembershipPageContent;
}) {
  return (
    <section
      className="membership-hero"
      data-membership-section="hero"
      data-surface="charcoal"
      aria-labelledby="membership-title"
    >
      <Container className="membership-container py-8 md:py-12">
        <div className="membership-hero-layout">
          <header className="grid min-w-0 content-center gap-5">
            <p className="membership-eyebrow m-0">{content.hero.eyebrow}</p>
            <h1 id="membership-title" className="m-0">
              {content.hero.heading}
            </h1>
            <p className="text-measure m-0 text-base leading-relaxed text-muted-foreground">
              {content.hero.description}
            </p>
            <div className="membership-actions">
              <Button
                asChild
                className="rounded-full px-5 py-3 text-primary-foreground no-underline hover:text-primary-foreground active:text-primary-foreground"
              >
                <MembershipSectionLink href={content.hero.explore.href}>
                  {content.hero.explore.label}
                  <ArrowDown aria-hidden="true" />
                </MembershipSectionLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-5 py-3 no-underline"
              >
                <NavigationLink href={content.hero.contact.href}>
                  {content.hero.contact.label}
                  <ArrowUpRight aria-hidden="true" />
                </NavigationLink>
              </Button>
            </div>
          </header>
          <div className="membership-hero-photo">
            <Image
              {...homeHero.image}
              alt={homeHero.image.alt}
              loading="eager"
              decoding="async"
              unoptimized
            />
          </div>
        </div>
        <nav
          aria-label={content.navigationLabel}
          className="membership-page-navigation"
        >
          {content.navigation.map((link) => (
            <MembershipSectionLink key={link.href} href={link.href}>
              {link.label}
            </MembershipSectionLink>
          ))}
        </nav>
      </Container>
    </section>
  );
}
