import Image from "next/image";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { HomeHeroContent } from "@/schemas/content";

const actionKinds = {
  primary: { variant: "default", Icon: ArrowRightIcon },
  secondary: { variant: "outline", Icon: MapPinIcon },
} as const;

// Reference: left-aligned two-tone display headline, letter-spaced CTAs and a
// V-cut bottom edge, mapped to the yellow/charcoal brand.
function HomeHero({ content }: { content: HomeHeroContent }) {
  return (
    <section
      aria-labelledby="home-hero-title"
      data-surface="charcoal"
      className="relative isolate flex min-h-[min(88svh,56rem)] items-center overflow-hidden [clip-path:polygon(0_0,100%_0,100%_calc(100%-1.5rem),50%_100%,0_calc(100%-1.5rem))] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-3rem),50%_100%,0_calc(100%-3rem))]"
    >
      <Image
        src={content.image.src}
        alt={content.image.alt}
        width={content.image.width}
        height={content.image.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        unoptimized
        className="absolute inset-0 -z-30 size-full object-cover"
      />
      {/* Uniform scrim guarantees text contrast over any image pixel. */}
      <div
        data-hero-overlay
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-background/70"
      />
      {/* Decorative depth only: darkens the text side further. */}
      <div
        data-hero-gradient
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-background/70 via-background/25 to-transparent"
      />
      <span
        data-hero-vertical
        aria-hidden="true"
        className="absolute top-1/2 left-2 hidden -translate-y-1/2 rotate-180 text-xs font-semibold tracking-[0.5em] text-primary uppercase [writing-mode:vertical-rl] xl:block"
      >
        {content.title}
      </span>
      <Container className="pt-16 pb-20 md:pb-24">
        <div className="grid max-w-3xl justify-items-start gap-5 text-start">
          <h1
            id="home-hero-title"
            className="type-display m-0 max-w-full tracking-[0.02em] text-foreground uppercase"
          >
            <span data-hero-tagline className="block text-foreground">
              {content.tagline}
            </span>{" "}
            <span data-hero-name className="block text-primary">
              {content.title}
            </span>
          </h1>
          <p
            data-hero-location
            className="m-0 inline-flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <MapPinIcon aria-hidden="true" className="size-5 shrink-0" />
            <span>{content.location}</span>
          </p>
          <ul className="m-0 mt-2 flex list-none flex-wrap gap-4 p-0">
            {content.actions.map((action, index) => {
              const kind = index === 0 ? "primary" : "secondary";
              const { variant, Icon } = actionKinds[kind];
              return (
                <li key={action.href}>
                  <Button
                    asChild
                    variant={variant}
                    size="lg"
                    // Attribute selectors outrank the shared rounded-control and outline fill.
                    className="data-[slot=button]:rounded-[2px] text-sm font-bold tracking-[0.12em] no-underline uppercase data-[variant=outline]:border-foreground data-[variant=outline]:bg-transparent"
                  >
                    <NavigationLink href={action.href} data-action={kind}>
                      {action.label}
                      <Icon aria-hidden="true" />
                    </NavigationLink>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export { HomeHero };
