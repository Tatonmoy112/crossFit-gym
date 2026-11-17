import { SectionHeading } from "@/components/shared/section-heading";
import type { MembershipSectionContent } from "@/schemas/membership-page";

export function MembershipSectionHeading({
  content,
  headingId,
  align = "start",
}: {
  content: MembershipSectionContent;
  headingId: string;
  align?: "start" | "center";
}) {
  return (
    <header
      className={`membership-section-heading grid min-w-0 gap-3 ${align === "center" ? "justify-items-center text-center" : ""}`}
    >
      <p className="membership-eyebrow m-0">{content.eyebrow}</p>
      <SectionHeading
        headingId={headingId}
        title={content.heading}
        description={content.description}
        align={align}
      />
    </header>
  );
}
