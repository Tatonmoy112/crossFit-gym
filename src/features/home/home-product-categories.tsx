import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { ProductCategoryCard } from "./product-category-card";
import { HomeProductCategoriesCarousel } from "./home-product-categories-carousel";
import type { HomeProductCategoriesPreviewContent } from "@/schemas/content";

const headingId = "home-product-categories-title";

export function HomeProductCategories({
  content,
}: {
  content: HomeProductCategoriesPreviewContent;
}) {
  return (
    <section
      data-home-product-categories
      data-preview="true"
      data-surface="light"
      aria-labelledby={headingId}
      aria-describedby="home-product-categories-notice"
      className="py-12 md:py-16"
    >
      <Container className="grid gap-8 md:gap-10">
        <div className="mx-auto grid w-full max-w-3xl justify-items-center gap-4 text-center">
          <p className="m-0 rounded-full bg-muted px-5 py-2 text-xs font-semibold tracking-[0.16em]">
            {content.eyebrow}
          </p>
          <SectionHeading
            headingId={headingId}
            title={content.heading}
            description={content.description}
            align="center"
          />
          <p
            id="home-product-categories-notice"
            role="note"
            className="m-0 max-w-[65ch] text-sm leading-relaxed text-muted-foreground"
          >
            {content.notice}
          </p>
        </div>
        <HomeProductCategoriesCarousel
          headingId={headingId}
          count={content.categories.length}
          action={
            <Button
              asChild
              variant="ghost"
              className="max-w-full rounded-full px-5 py-3 no-underline"
            >
              <NavigationLink href={content.action.href}>
                {content.action.label}
              </NavigationLink>
            </Button>
          }
        >
          {content.categories.map((category, index) => (
            <CarouselItem
              key={category.id}
              data-category-index={index}
              aria-label={`${category.title}, ${index + 1} of ${content.categories.length}`}
              className="relative flex basis-[88%] pl-0"
            >
              <ProductCategoryCard item={category} />
            </CarouselItem>
          ))}
        </HomeProductCategoriesCarousel>
      </Container>
    </section>
  );
}
