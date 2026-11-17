import { Separator } from "@/components/ui/separator";
import { CountUp } from "@/features/home/count-up";
import type { HomeStatsContent } from "@/schemas/content";

// Embedded in the hero: inherit its surface without adding an opaque band.
function HomeStats({ content }: { content: HomeStatsContent }) {
  if (content.items.length === 0) return null;

  return (
    <section aria-labelledby="home-stats-title" className="home-stats">
      <h2 id="home-stats-title" className="sr-only">
        {content.heading}
      </h2>
      <ul className="home-stats-grid m-0 grid list-none p-0">
        {content.items.map((item, index) => (
          <li key={index} className="home-stat relative min-w-0">
            {index > 0 && (
              <>
                <Separator
                  orientation="horizontal"
                  className="home-stat-horizontal absolute inset-x-0 top-0 h-px w-full bg-foreground/30"
                />
                <Separator
                  orientation="vertical"
                  className="home-stat-vertical absolute inset-y-0 start-0 w-px bg-foreground/30"
                />
              </>
            )}
            <div className="grid min-w-0 gap-2 [overflow-wrap:anywhere]">
              <p
                data-stat-value
                className="m-0 font-heading text-[clamp(1.75rem,1.5rem+1vw,2.25rem)] leading-none font-bold text-foreground"
              >
                <CountUp value={item.value} decimals={item.decimals} />
                {item.suffix ? (
                  <span aria-hidden={item.suffixLabel ? true : undefined}>
                    {item.suffix}
                  </span>
                ) : null}
                {item.suffixLabel ? (
                  <span className="sr-only">{` ${item.suffixLabel}`}</span>
                ) : null}
              </p>
              <p
                data-stat-label
                className="m-0 text-xs tracking-[0.08em] text-muted-foreground uppercase"
              >
                {item.label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { HomeStats };
