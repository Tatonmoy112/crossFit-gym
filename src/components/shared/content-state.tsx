import { Empty } from "@/components/ui/empty";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ContentStateContent } from "@/content/content-states";

export function ContentState({ title, description }: ContentStateContent) {
  return (
    <Empty className="my-6 rounded-[var(--radius-card)] border border-solid border-border bg-background text-foreground [overflow-wrap:anywhere]">
      <SectionHeading title={title} description={description} align="center" />
    </Empty>
  );
}
