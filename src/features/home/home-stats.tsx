import { Container } from "@/components/shared/container";
import { Separator } from "@/components/ui/separator";
import { CountUp } from "@/features/home/count-up";
import type { HomeStatsContent } from "@/schemas/content";

// Reference: a dark band of value/label pairs split by thin dividers. It pulls
// up under the hero's V-cut (1.5rem, 3rem from md) so the cut shows charcoal.
function HomeStats({ content }: { content: HomeStatsContent }) {
  if (content.items.length === 0) return null;

  return (
    <section
      aria-labelledby="home-stats-title"
      data-surface="charcoal"
      className="-mt-6 pt-6 md:-mt-12 md:pt-12"
    >
      <Container className="py-10 md:py-12">
        <h2 id="home-stats-title" className="sr-only">
          {content.heading}
        </h2>
        <ul className="m-0 grid list-none gap-6 p-0 sm:flex sm:gap-0">
          {content.items.map((item, index) => (
            <li
              key={index}
              className="flex min-w-0 flex-col gap-6 sm:flex-1 sm:flex-row sm:gap-0"
            >
              {index > 0 && (
                <>
                  <Separator
                    orientation="horizontal"
                    className="h-px w-full bg-border sm:hidden"
                  />
                  <Separator
                    orientation="vertical"
                    className="hidden w-px self-stretch bg-border sm:mx-6 sm:block lg:mx-12"
                  />
                </>
              )}
              <div className="grid min-w-0 gap-2 [overflow-wrap:anywhere]">
                <p
                  data-stat-value
                  className="m-0 font-heading text-[clamp(2.25rem,1.75rem+1.5vw,3rem)] leading-none font-bold text-foreground"
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
                  className="m-0 text-sm tracking-[0.08em] text-muted-foreground uppercase"
                >
                  {item.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export { HomeStats };
