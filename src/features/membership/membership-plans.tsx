"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import type { Membership } from "@/schemas/content";
import { PendingContent } from "@/components/shared/sections";
import { ButtonLink } from "@/components/ui/button";
export function MembershipPlans({ plans }: { plans: Membership[] }) {
  const [billing, setBilling] = useState<"monthly" | "annual">(
    plans.some((plan) => plan.monthly) ? "monthly" : "annual",
  );
  const periods = (["monthly", "annual"] as const).filter((period) =>
    plans.some((plan) => plan[period]),
  );
  return (
    <>
      {periods.length > 1 && (
        <div className="billing-toggle" aria-label="Billing period">
          {periods.map((value) => (
            <button
              key={value}
              aria-pressed={billing === value}
              className={billing === value ? "selected" : ""}
              onClick={() => setBilling(value)}
            >
              {value === "monthly" ? "Monthly" : "Annual"}
            </button>
          ))}
        </div>
      )}
      {plans.length === 0 ? (
        <PendingContent
          title="A membership starts with a conversation."
          description="Approved membership plans and prices have not yet been supplied. Get in touch for current options, fees and joining information."
        />
      ) : (
        <>
          <div className="plan-grid">
            {plans.map((plan) => (
              <article
                key={plan.id}
                id={plan.id}
                className={`plan-card ${plan.highlighted ? "highlighted" : ""}`}
              >
                <p className="eyebrow">
                  {plan.highlighted ? "FEATURED PLAN" : "MEMBERSHIP"}
                </p>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <p className="plan-price">
                  {plan[billing] || "Contact for this billing period"}
                </p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/contact?topic=Membership&interest=${encodeURIComponent(plan.name)}`}
                >
                  Ask about this plan
                </ButtonLink>
              </article>
            ))}
          </div>
          <div className="comparison-wrap">
            <table>
              <caption>Membership benefits comparison</caption>
              <thead>
                <tr>
                  <th scope="col">Benefit</th>
                  {plans.map((plan) => (
                    <th scope="col" key={plan.id}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...new Set(plans.flatMap((plan) => plan.features))].map(
                  (feature) => (
                    <tr key={feature}>
                      <th scope="row">{feature}</th>
                      {plans.map((plan) => (
                        <td key={plan.id}>
                          {plan.features.includes(feature)
                            ? "Included"
                            : "Not listed"}
                        </td>
                      ))}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
