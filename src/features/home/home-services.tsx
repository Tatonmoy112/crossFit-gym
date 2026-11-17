import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CarouselItem } from "@/components/ui/carousel";
import { HomeServicesCarousel } from "./home-services-carousel";
import { ServiceCard } from "./service-card";
import type { HomeServicesContent } from "@/schemas/content";

const headingId = "home-services-title";

export function HomeServices({ content }: { content: HomeServicesContent }) {
  if (content.items.length === 0) return null;

  return (
    <section
      data-home-services
      aria-labelledby={headingId}
      data-surface="light"
      className="py-12 md:py-16"
    >
      <Container className="grid gap-8">
        <div className="mx-auto grid w-full max-w-3xl gap-3 text-center">
          <p className="m-0 text-xs font-semibold tracking-[0.16em]">
            {content.eyebrow}
          </p>
          <SectionHeading
            title={content.heading}
            headingId={headingId}
            description={content.description}
            align="center"
          />
        </div>
        <HomeServicesCarousel headingId={headingId}>
          {content.items.map((item, index) => (
            <CarouselItem
              key={item.id}
              aria-label={`${item.title}, ${index + 1} of ${content.items.length}`}
              className="basis-[85%] pl-0"
            >
              <ServiceCard item={item} />
            </CarouselItem>
          ))}
        </HomeServicesCarousel>
      </Container>
    </section>
  );
}
