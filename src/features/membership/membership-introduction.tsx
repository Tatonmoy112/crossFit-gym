import { Container } from "@/components/shared/container";
import type { MembershipPageContent } from "@/schemas/membership-page";
import { MembershipSectionHeading } from "./membership-section-heading";

export function MembershipIntroduction({
  content,
}: {
  content: MembershipPageContent["introduction"];
}) {
  return (
    <section
      className="membership-section"
      data-membership-section="introduction"
      aria-labelledby="membership-introduction-title"
    >
      <Container className="membership-container grid justify-items-center gap-4 text-center">
        <MembershipSectionHeading
          content={content}
          headingId="membership-introduction-title"
          align="center"
        />
        <p className="text-measure m-0 text-base leading-relaxed text-muted-foreground">
          {content.supportingText}
        </p>
      </Container>
    </section>
  );
}
