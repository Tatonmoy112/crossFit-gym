import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { FooterContent } from "@/content/footer";

export function FooterCallToAction({
  content,
}: {
  content: FooterContent["cta"];
}) {
  return (
    <section
      data-footer-cta
      data-surface="charcoal"
      aria-labelledby="footer-cta-title"
      className="footer-cta"
    >
      <Container>
        <div className="mx-auto grid max-w-3xl justify-items-center gap-6 text-center">
          <SectionHeading
            headingId="footer-cta-title"
            title={content.heading}
            description={content.description}
            align="center"
          />
          <Button
            asChild
            className="max-w-full rounded-full px-4 py-3 text-primary-foreground no-underline hover:bg-primary-hover hover:text-primary-foreground active:bg-primary-active active:text-primary-foreground sm:px-6"
          >
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
