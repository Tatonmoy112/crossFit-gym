import {
  Dumbbell,
  HeartHandshake,
  CalendarDays,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import type {
  MembershipPageContent,
  MembershipPreviewContent,
} from "@/schemas/membership-page";
import { MembershipSectionHeading } from "./membership-section-heading";

const icons: Record<
  MembershipPreviewContent["benefits"][number]["id"],
  LucideIcon
> = {
  environment: Dumbbell,
  support: HeartHandshake,
  lifestyle: CalendarDays,
  community: UsersRound,
};

export function MembershipBenefits({
  content,
  items,
}: {
  content: MembershipPageContent["benefits"];
  items: MembershipPreviewContent["benefits"];
}) {
  if (!items.length) return null;
  return (
    <section
      className="membership-section"
      data-membership-section="benefits"
      data-preview="true"
      aria-labelledby="membership-benefits-title"
    >
      <Container className="membership-container grid gap-8">
        <MembershipSectionHeading
          content={content}
          headingId="membership-benefits-title"
        />
        <div className="membership-benefit-grid">
          {items.map((item, index) => {
            const Icon = icons[item.id];
            return (
              <article key={item.id} className="membership-benefit-item">
                <span className="membership-benefit-icon" aria-hidden="true">
                  <Icon size={24} />
                </span>
                <div className="grid min-w-0 gap-3">
                  <p className="membership-eyebrow m-0" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="m-0 text-xl leading-snug font-semibold">
                    {item.title}
                  </h3>
                  <p className="m-0 text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
