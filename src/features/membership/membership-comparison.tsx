import { Container } from "@/components/shared/container";
import { ContentState } from "@/components/shared/content-state";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { MembershipPagePlan } from "@/lib/membership/page-data";
import type {
  MembershipPageContent,
  MembershipComparisonRow,
} from "@/schemas/membership-page";
import { MembershipSectionHeading } from "./membership-section-heading";

export function MembershipComparison({
  content,
  labels,
  plans,
  rows,
}: {
  content: MembershipPageContent["comparison"];
  labels: MembershipPageContent["labels"];
  plans: MembershipPagePlan[];
  rows: MembershipComparisonRow[];
}) {
  return (
    <section
      id="membership-comparison"
      tabIndex={-1}
      className="membership-section membership-fragment membership-comparison"
      data-membership-section="comparison"
      aria-labelledby="membership-comparison-title"
    >
      <Container className="membership-container grid gap-6">
        <MembershipSectionHeading
          content={content}
          headingId="membership-comparison-title"
        />
        {plans.length ? (
          <>
            <p className="text-measure m-0 text-sm leading-relaxed text-muted-foreground">
              {content.caption}
            </p>
            <div
              className="membership-comparison-scroll"
              role="region"
              aria-label={content.scrollLabel}
              tabIndex={0}
            >
              <table
                className="membership-comparison-table"
                data-membership-comparison-table
              >
                <caption className="sr-only">{content.caption}</caption>
                <thead>
                  <tr>
                    <th scope="col">{labels.comparisonFeature}</th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        scope="col"
                        data-featured={plan.featured}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} data-comparison-row={row.id}>
                      <th scope="row">{row.label}</th>
                      {plans.map((plan) => {
                        const cell = row.values.find(
                          (value) => value.planId === plan.id,
                        )!;
                        return (
                          <td
                            key={plan.id}
                            data-comparison-status={cell.status}
                          >
                            <span>{cell.text}</span>
                            {cell.status === "proposed" && (
                              <span className="membership-comparison-status">
                                {labels.proposed}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-measure m-0 text-sm leading-relaxed text-muted-foreground">
              {content.help}
            </p>
          </>
        ) : (
          <ContentState {...content.empty} />
        )}
        <div>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-5 py-3 no-underline"
          >
            <NavigationLink href={content.action.href}>
              {content.action.label}
            </NavigationLink>
          </Button>
        </div>
      </Container>
    </section>
  );
}
