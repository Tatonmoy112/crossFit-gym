import Image from "next/image";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { HomeMembershipPlan } from "@/schemas/content";

export function MembershipPlanCard({ plan }: { plan: HomeMembershipPlan }) {
  return (
    <Card
      data-surface="charcoal"
      data-membership-plan={plan.id}
      data-featured={plan.featured}
      className="membership-plan-card relative isolate flex min-w-0 flex-1 flex-col gap-6 overflow-hidden rounded-[1.75rem] border p-6 shadow-none ring-0"
    >
      {plan.image && (
        <>
          <Image
            {...plan.image}
            alt={plan.image.alt}
            loading="lazy"
            decoding="async"
            unoptimized
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-background/80"
          />
        </>
      )}
      <p className="m-0 text-xs font-semibold tracking-[0.12em] text-primary">
        {plan.badge}
      </p>
      <div className="grid min-w-0 gap-3">
        <h3 className="m-0 font-heading text-4xl leading-tight">{plan.name}</h3>
        <p className="m-0 text-sm leading-relaxed text-foreground">
          {plan.description}
        </p>
      </div>
      <p
        data-membership-price
        className="m-0 text-2xl leading-tight font-semibold"
      >
        {plan.priceLabel}
      </p>
      <ul className="m-0 grid min-w-0 list-none gap-3 p-0">
        {plan.benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex min-w-0 items-start gap-3 text-sm leading-relaxed"
          >
            <Check
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary"
            />
            <span className="min-w-0">{benefit}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        variant={plan.featured ? "default" : "outline"}
        className={`membership-plan-action mt-auto w-full rounded-full py-3 no-underline ${plan.featured ? "text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground active:bg-primary-active active:text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-selected active:text-selected-foreground"}`}
      >
        <NavigationLink href={plan.action.href} data-surface="light">
          {plan.action.label}
        </NavigationLink>
      </Button>
    </Card>
  );
}
