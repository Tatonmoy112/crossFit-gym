import Image from "next/image";
import { Card } from "@/components/ui/card";
import { FeatureAction } from "./feature-action";
import type { HomeFeature } from "@/schemas/content";

export function FeatureCard({
  item,
  position,
}: {
  item: HomeFeature;
  position: number;
}) {
  return (
    <Card
      data-surface="charcoal"
      data-home-feature-card={item.id}
      className="home-feature-card relative isolate flex min-w-0 flex-1 flex-col justify-between gap-16 overflow-hidden rounded-[1.75rem] border-0 p-6 shadow-none ring-0"
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
      <h3 className="m-0 max-w-[12ch] text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight">
        {item.title}
      </h3>
      <div className="relative z-10 grid min-w-0 justify-items-start gap-6">
        <p className="m-0 max-w-[30ch] text-sm leading-relaxed text-foreground">
          {item.description}
        </p>
        <FeatureAction href={item.href} label={item.actionLabel} />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-0 -z-10 font-heading text-[8rem] leading-none text-foreground/10 italic select-none"
      >
        {String(position).padStart(2, "0")}
      </span>
    </Card>
  );
}
