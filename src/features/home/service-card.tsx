import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { HomeService } from "@/schemas/content";

export function ServiceCard({ item }: { item: HomeService }) {
  return (
    <Card
      data-surface="charcoal"
      data-service-card={item.id}
      className="service-card relative isolate h-full min-h-88 gap-0 rounded-card border-0 p-0 shadow-none ring-0"
    >
      {item.image && (
        <>
          <Image
            {...item.image}
            alt={item.image.alt}
            loading="lazy"
            decoding="async"
            unoptimized
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-background/80"
          />
        </>
      )}
      <NavigationLink
        href={item.href}
        aria-label={`Ask about ${item.title} ${item.subtitle}`}
        className="grid aspect-[3/4] min-h-min flex-1 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-card p-5 text-foreground no-underline hover:bg-transparent hover:text-foreground active:bg-transparent focus-visible:[outline-offset:-6px]"
      >
        <div className="grid min-w-0 gap-2">
          <h3 className="m-0 text-[1.375rem] leading-tight">{item.title}</h3>{" "}
          <p className="m-0 text-sm leading-relaxed font-normal text-foreground">
            {item.subtitle}
          </p>
        </div>
        <span
          aria-hidden="true"
          data-service-arrow
          data-surface="light"
          className="flex size-11 shrink-0 items-center justify-center rounded-full"
        >
          <ArrowRight className="size-5" />
        </span>
      </NavigationLink>
    </Card>
  );
}
