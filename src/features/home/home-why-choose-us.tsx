import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { WhyChooseUsCard } from "@/features/home/why-choose-us-card";
import type { HomeWhyChooseUsContent } from "@/schemas/content";

const headingId = "home-why-choose-us-title";

export function HomeWhyChooseUs({
  content,
}: {
  content: HomeWhyChooseUsContent;
}) {
  if (content.items.length === 0) return null;

  return (
    <section
      aria-labelledby={headingId}
      data-surface="light"
      className="py-12 md:py-16"
    >
      <Container className="grid gap-8">
        <SectionHeading
          title={content.heading}
          headingId={headingId}
          align="center"
        />
        <ul
          data-why-grid
          className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
        >
          {content.items.map((item) => (
            <li key={item.id} className="min-w-0">
              <WhyChooseUsCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
