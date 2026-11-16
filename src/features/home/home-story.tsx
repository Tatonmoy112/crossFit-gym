import { Container } from "@/components/shared/container";
import { ContentState } from "@/components/shared/content-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { HomeStoryContent } from "@/schemas/content";

const headingId = "home-story-title";

function HomeStory({ content }: { content: HomeStoryContent }) {
  const paragraphs =
    content.story
      ?.split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  return (
    <section aria-labelledby={headingId} className="py-12 md:py-16">
      <Container>
        {paragraphs.length > 0 ? (
          <div className="grid justify-items-start gap-4">
            <SectionHeading title={content.heading} headingId={headingId} />
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-story-paragraph
                className="text-measure m-0 [overflow-wrap:anywhere]"
              >
                {paragraph}
              </p>
            ))}
            <NavigationLink href={content.link.href} className="-ms-3">
              {content.link.label}
            </NavigationLink>
          </div>
        ) : (
          <ContentState {...content.missing} headingId={headingId} />
        )}
      </Container>
    </section>
  );
}

export { HomeStory };
