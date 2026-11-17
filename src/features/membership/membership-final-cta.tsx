import { ArrowUpRight, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { site } from "@/content/site";
import type { MembershipPageContent } from "@/schemas/membership-page";
import { MembershipSectionHeading } from "./membership-section-heading";

export function MembershipFinalCta({
  content,
}: {
  content: MembershipPageContent["cta"];
}) {
  return (
    <section
      className="membership-section membership-final-cta"
      data-membership-section="cta"
      data-surface="yellow"
      aria-labelledby="membership-cta-title"
    >
      <Container className="membership-container grid gap-6">
        <MembershipSectionHeading
          content={content}
          headingId="membership-cta-title"
        />
        <div className="membership-actions">
          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 py-3 no-underline"
          >
            <NavigationLink href={content.action.href}>
              {content.action.label}
              <ArrowUpRight aria-hidden="true" />
            </NavigationLink>
          </Button>
          <NavigationLink
            href={`tel:${site.telephone}`}
            className="rounded-full px-5 py-3"
          >
            <Phone aria-hidden="true" size={18} />
            {content.callLabel}
            <span className="sr-only">: {site.phone}</span>
          </NavigationLink>
        </div>
      </Container>
    </section>
  );
}
