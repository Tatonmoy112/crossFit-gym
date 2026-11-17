import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { MembershipPageContent } from "@/schemas/membership-page";
import { MembershipSectionHeading } from "./membership-section-heading";

export function MembershipJoiningSteps({
  content,
}: {
  content: MembershipPageContent["joining"];
}) {
  return (
    <section
      id="membership-how-to-join"
      tabIndex={-1}
      className="membership-section membership-fragment"
      data-membership-section="joining"
      aria-labelledby="membership-joining-title"
    >
      <Container className="membership-container grid gap-8">
        <MembershipSectionHeading
          content={content}
          headingId="membership-joining-title"
          align="center"
        />
        <ol className="membership-steps">
          {content.steps.map((step, index) => (
            <li key={step.id} className="membership-step">
              <span className="membership-step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 text-xl leading-snug font-semibold">
                {step.title}
              </h3>
              <p className="m-0 text-base leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <div className="text-center">
          <Button asChild className="rounded-full px-6 py-3 no-underline">
            <NavigationLink href={content.action.href}>
              {content.action.label}
            </NavigationLink>
          </Button>
        </div>
      </Container>
    </section>
  );
}
