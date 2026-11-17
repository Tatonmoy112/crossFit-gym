import { Container } from "@/components/shared/container";
import type { MembershipPageContent } from "@/schemas/membership-page";

export function MembershipInformation({
  content,
}: {
  content: MembershipPageContent["terms"];
}) {
  return (
    <section
      className="membership-section membership-information"
      data-membership-section="information"
      aria-labelledby="membership-information-title"
    >
      <Container>
        <div className="membership-information-panel">
          <h2 id="membership-information-title" className="m-0 text-2xl">
            {content.heading}
          </h2>
          {content.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-measure m-0 text-sm leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
