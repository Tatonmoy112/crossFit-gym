import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { MembershipPlanCard } from "./membership-plan-card";
import { HomeMembershipsCarousel } from "./home-memberships-carousel";
import type { HomeMembershipsPreviewContent } from "@/schemas/content";

const headingId = "home-memberships-title";
export function HomeMemberships({
  content,
}: {
  content: HomeMembershipsPreviewContent;
}) {
  return (
    <section
      data-home-memberships
      data-preview="true"
      data-surface="light"
      aria-labelledby={headingId}
      aria-describedby="home-memberships-notice"
      className="py-12 md:py-16"
    >
      <Container className="grid gap-8">
        <div className="mx-auto grid w-full max-w-4xl gap-3 text-center">
          <p className="m-0 text-xs font-semibold tracking-[0.16em]">
            {content.eyebrow}
          </p>
          <SectionHeading
            headingId={headingId}
            title={content.heading}
            description={content.description}
            align="center"
          />
          <p className="m-0 text-sm font-medium">{content.supportingText}</p>
          <p
            id="home-memberships-notice"
            role="note"
            className="m-0 text-sm leading-relaxed text-muted-foreground"
          >
            {content.notice}
          </p>
        </div>
        <HomeMembershipsCarousel
          headingId={headingId}
          count={content.plans.length}
          action={
            <Button
              asChild
              variant="outline"
              className="max-w-full rounded-full px-5 py-3 no-underline hover:text-accent-foreground active:text-selected-foreground"
            >
              <NavigationLink href={content.action.href}>
                {content.action.label}
              </NavigationLink>
            </Button>
          }
        >
          {content.plans.map((plan, index) => (
            <CarouselItem
              key={plan.id}
              data-membership-index={index}
              aria-label={`${plan.name}, ${index + 1} of ${content.plans.length}`}
              className="relative flex basis-[88%] pl-0"
            >
              <MembershipPlanCard plan={plan} />
            </CarouselItem>
          ))}
        </HomeMembershipsCarousel>
      </Container>
    </section>
  );
}
