import { ArrowUpRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { MembershipPagePlan } from "@/lib/membership/page-data";
import type { MembershipPageContent } from "@/schemas/membership-page";

export function MembershipTierCard({
  plan,
  labels,
}: {
  plan: MembershipPagePlan;
  labels: MembershipPageContent["labels"];
}) {
  return (
    <article
      className="membership-tier-card"
      data-membership-tier={plan.id}
      data-featured={plan.featured}
      data-preview="true"
      data-surface="light"
      aria-labelledby={`membership-tier-${plan.id}`}
    >
      <div className="grid min-w-0 justify-items-start gap-3">
        <p className="membership-tier-badge m-0">{plan.badge}</p>
        <h3
          id={`membership-tier-${plan.id}`}
          className="membership-tier-name m-0"
        >
          {plan.name}
        </h3>
      </div>
      <div className="grid min-w-0 gap-2">
        <p className="membership-tier-price m-0" data-membership-price>
          {labels.pricePending}
        </p>
        <p className="m-0 text-sm text-muted-foreground">
          {labels.durationPending}
        </p>
      </div>
      <div className="grid min-w-0 gap-3">
        <p className="m-0 text-lg leading-snug font-semibold">
          {plan.headline}
        </p>
        <p className="m-0 text-sm leading-relaxed text-muted-foreground">
          {plan.description}
        </p>
      </div>
      <div className="membership-tier-benefits">
        <p className="membership-eyebrow m-0">{labels.suggestedBenefits}</p>
        <ul className="m-0 grid list-none gap-3 p-0">
          {plan.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex min-w-0 items-start gap-3 text-sm leading-relaxed"
            >
              <Circle aria-hidden="true" className="mt-1.5 size-2 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        asChild
        variant={plan.featured ? "default" : "outline"}
        className="mt-auto w-full rounded-control px-5 py-3 no-underline"
      >
        <NavigationLink href="/contact/">
          {plan.inquiryLabel}
          <ArrowUpRight aria-hidden="true" />
        </NavigationLink>
      </Button>
    </article>
  );
}
