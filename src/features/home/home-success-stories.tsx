import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { SuccessStoryCard } from "./success-story-card";
import { HomeSuccessStoriesCarousel } from "./home-success-stories-carousel";
import type { HomeSuccessStoriesPreviewContent } from "@/schemas/content";

const headingId = "home-success-stories-title";
export function HomeSuccessStories({
  content,
}: {
  content: HomeSuccessStoriesPreviewContent;
}) {
  return (
    <section
      data-home-success-stories
      data-preview="true"
      data-surface="light"
      aria-labelledby={headingId}
      aria-describedby="home-success-stories-notice"
      className="py-12 md:py-16"
    >
      <Container>
        <div className="success-stories-panel grid min-w-0 gap-8 rounded-[2rem]">
          <header className="success-stories-intro grid min-w-0 gap-5">
            <div className="grid content-start gap-3">
              <p className="m-0 text-xs font-semibold tracking-[0.16em]">
                {content.eyebrow}
              </p>
              <SectionHeading headingId={headingId} title={content.heading} />
            </div>
            <div className="grid content-end gap-3">
              <p className="text-measure m-0 text-base leading-relaxed text-muted-foreground">
                {content.description}
              </p>
              <p className="m-0 text-sm font-medium">
                {content.supportingText}
              </p>
              <p
                id="home-success-stories-notice"
                role="note"
                className="m-0 text-sm leading-relaxed text-muted-foreground"
              >
                {content.notice}
              </p>
            </div>
          </header>
          <HomeSuccessStoriesCarousel
            headingId={headingId}
            count={content.stories.length}
            action={
              <Button
                asChild
                className="max-w-full rounded-full px-5 py-3 no-underline hover:text-primary-foreground active:text-primary-foreground"
              >
                <NavigationLink href={content.action.href}>
                  {content.action.label}
                  <ArrowUpRight aria-hidden="true" />
                </NavigationLink>
              </Button>
            }
          >
            {content.stories.map((story, index) => (
              <CarouselItem
                key={story.id}
                aria-label={`${story.name}, ${index + 1} of ${content.stories.length}`}
                data-success-index={index}
                className="flex basis-[88%] items-center pl-0"
              >
                <SuccessStoryCard story={story} />
              </CarouselItem>
            ))}
          </HomeSuccessStoriesCarousel>
          <div className="mx-auto grid w-full max-w-3xl justify-items-center gap-4 border-t border-border pt-8 text-center">
            <p className="m-0 text-xs font-semibold tracking-[0.16em]">
              {content.closing.eyebrow}
            </p>
            <h3 className="m-0 font-heading text-3xl font-semibold">
              {content.closing.heading}
            </h3>
            <p className="text-measure m-0 text-base leading-relaxed text-muted-foreground">
              {content.closing.description}
            </p>
            <Button
              asChild
              variant="outline"
              className="max-w-full rounded-full px-5 py-3 no-underline hover:text-accent-foreground active:text-selected-foreground"
            >
              <NavigationLink href={content.closing.action.href}>
                {content.closing.action.label}
                <ArrowUpRight aria-hidden="true" />
              </NavigationLink>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
