import { Empty } from "@/components/ui/empty";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ContentStateContent } from "@/content/content-states";

type ContentStateProps = ContentStateContent & {
  /** Lets a parent region name itself with this state's H2. */
  headingId?: string;
};

export function ContentState({
  title,
  description,
  headingId,
}: ContentStateProps) {
  return (
    <Empty className="my-6 rounded-[var(--radius-card)] border border-solid border-border bg-background text-foreground [overflow-wrap:anywhere]">
      <SectionHeading
        title={title}
        description={description}
        headingId={headingId}
        align="center"
      />
    </Empty>
  );
}
