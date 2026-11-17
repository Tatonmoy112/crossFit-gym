import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import { FaqDisclosures } from "@/features/faq/faq-disclosures";
import { FaqRow } from "@/features/faq/faq-row";
import type { HomeFaqContent } from "@/schemas/home-faq";
import type { FAQ } from "@/schemas/content";

export function HomeFaq({
  content,
  items,
}: {
  content: HomeFaqContent;
  items: FAQ[];
}) {
  return (
    <section
      data-home-faq
      data-surface="light"
      aria-labelledby="home-faq-title"
      className="home-faq py-12 md:py-16"
    >
      <Container className="home-faq-container">
        <header className="grid min-w-0 gap-4">
          <p className="faq-eyebrow m-0 text-xs font-semibold tracking-[0.16em]">
            {content.eyebrow}
          </p>
          <SectionHeading
            headingId="home-faq-title"
            title={content.heading}
            description={content.description}
          />
        </header>
        <FaqDisclosures>
          {items.map((item, index) => (
            <FaqRow key={item.id} item={item} index={index} group="home-faq" />
          ))}
        </FaqDisclosures>
        <div className="faq-closing">
          <div className="grid min-w-0 gap-3">
            <h3 className="m-0 font-heading text-3xl font-semibold">
              {content.closing.heading}
            </h3>
            <p className="text-measure m-0 text-base leading-relaxed text-muted-foreground">
              {content.closing.description}
            </p>
          </div>
          <Button
            asChild
            className="max-w-full rounded-full px-6 py-3 no-underline hover:text-primary-foreground active:text-primary-foreground"
          >
            <NavigationLink href={content.closing.action.href}>
              {content.closing.action.label}
              <ArrowUpRight aria-hidden="true" />
            </NavigationLink>
          </Button>
        </div>
      </Container>
    </section>
  );
}
