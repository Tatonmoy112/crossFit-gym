import { Container } from "@/components/shared/container";
import { ContentState } from "@/components/shared/content-state";
import type { MembershipPagePlan } from "@/lib/membership/page-data";
import type { MembershipPageContent } from "@/schemas/membership-page";
import { MembershipSectionHeading } from "./membership-section-heading";
import { MembershipTierCard } from "./membership-tier-card";

export function MembershipPricing({
  content,
  labels,
  plans,
}: {
  content: MembershipPageContent["pricing"];
  labels: MembershipPageContent["labels"];
  plans: MembershipPagePlan[];
}) {
  return (
    <section
      id="membership-plans"
      tabIndex={-1}
      className="membership-section membership-fragment membership-pricing"
      data-membership-section="pricing"
      aria-labelledby="membership-pricing-title"
    >
      <Container className="membership-container grid gap-8">
        <MembershipSectionHeading
          content={content}
          headingId="membership-pricing-title"
          align="center"
        />
        {plans.length ? (
          <>
            <p
              role="note"
              id="membership-pricing-notice"
              className="membership-preview-notice m-0"
            >
              {content.notice}
            </p>
            <div
              className="membership-tier-grid"
              aria-describedby="membership-pricing-notice"
            >
              {plans.map((plan) => (
                <MembershipTierCard key={plan.id} plan={plan} labels={labels} />
              ))}
            </div>
          </>
        ) : (
          <ContentState {...content.empty} />
        )}
        <p className="text-measure mx-auto mb-0 text-center text-sm leading-relaxed text-muted-foreground">
          {content.inquiryNotice}
        </p>
      </Container>
    </section>
  );
}
