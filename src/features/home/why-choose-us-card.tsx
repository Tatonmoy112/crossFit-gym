import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "cn";
import type { WhyChooseUsItem } from "@/schemas/content";

const imagePositions = {
  left: "object-left",
  center: "object-center",
  right: "object-right",
} as const;

// Adapted from the requested ReUI radix-nova/c-card-8 registry pattern.
// Keep the installed Card primitive; all gym-specific behavior lives here.
export function WhyChooseUsCard({ item }: { item: WhyChooseUsItem }) {
  const headingId = `why-card-${item.id}`;

  return (
    <article
      aria-labelledby={headingId}
      data-why-card={item.id}
      className="h-full min-w-0"
    >
      <Card
        data-surface="charcoal"
        className="group/why relative isolate h-full min-h-96 w-full gap-0 overflow-hidden border-0 p-0 shadow-none ring-0 data-[slot=card]:rounded-[var(--radius-card)]"
      >
        <Image
          {...item.image}
          alt={item.image.alt}
          loading="lazy"
          decoding="async"
          unoptimized
          data-why-image
          className={cn(
            "absolute inset-0 -z-20 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover/why:scale-110",
            imagePositions[item.imagePosition],
          )}
        />
        <div
          data-why-scrim
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-background/70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-background/50 to-transparent"
        />
        <div className="relative flex min-w-0 flex-1 flex-col justify-end gap-3 p-6 [overflow-wrap:anywhere]">
          <h3 id={headingId} className="m-0 text-foreground">
            {item.title}
          </h3>
          <p className="m-0 text-base leading-[1.6] font-normal text-foreground">
            {item.description}
          </p>
        </div>
      </Card>
    </article>
  );
}
