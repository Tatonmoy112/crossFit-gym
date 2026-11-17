import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CarouselItem } from "@/components/ui/carousel";
import { FeatureCard } from "./feature-card";
import { FeatureAction } from "./feature-action";
import { HomeFeaturesCarousel } from "./home-features-carousel";
import type { HomeFeaturesContent } from "@/schemas/content";

const headingId = "home-features-title";

export function HomeFeatures({ content }: { content: HomeFeaturesContent }) {
  if (!content.items.length) return null;
  return (
    <section
      data-home-features
      aria-labelledby={headingId}
      data-surface="light"
      className="py-12 md:py-16"
    >
      <Container>
        <HomeFeaturesCarousel
          headingId={headingId}
          count={content.items.length}
          introduction={
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-8">
              <p className="m-0 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                {content.description}
              </p>
              <div className="grid justify-items-start gap-6">
                <div className="grid gap-3">
                  <p className="m-0 text-xs font-semibold tracking-[0.16em]">
                    {content.eyebrow}
                  </p>
                  <SectionHeading
                    title={content.heading}
                    headingId={headingId}
                  />
                </div>
                <FeatureAction
                  href={content.action.href}
                  label={content.action.label}
                />
              </div>
            </div>
          }
        >
          {content.items.map((item, index) => (
            <CarouselItem
              key={item.id}
              aria-label={`${item.title}, ${index + 1} of ${content.items.length}`}
              className="flex basis-[88%] pl-0"
            >
              <FeatureCard item={item} position={index + 1} />
            </CarouselItem>
          ))}
        </HomeFeaturesCarousel>
      </Container>
    </section>
  );
}
