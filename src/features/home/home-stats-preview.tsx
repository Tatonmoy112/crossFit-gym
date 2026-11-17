import { homeStatsPreview } from "@/content/previews/home-stats";
import { site } from "@/content/site";
import { HomeStats } from "@/features/home/home-stats";

export function HomeStatsPreview() {
  if (!site.preview) return null;

  return (
    <div data-home-stats-preview className="grid gap-5">
      <HomeStats content={homeStatsPreview.content} />
      <p
        role="note"
        className="type-hint m-0 text-muted-foreground [overflow-wrap:anywhere]"
      >
        {homeStatsPreview.notice}
      </p>
    </div>
  );
}
