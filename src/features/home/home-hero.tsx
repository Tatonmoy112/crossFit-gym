import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { HomeHeroContent } from "@/schemas/content";

type HomeHeroProps = { content: HomeHeroContent; stats?: ReactNode };

function HomeHero({ content, stats }: HomeHeroProps) {
  return (
    <section
      aria-labelledby="home-hero-title"
      data-home-hero
      data-surface="charcoal"
      className="home-hero relative isolate flex min-h-[min(100svh,56rem)] flex-col justify-center"
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
      {/* Local gradients protect text while keeping the right-side photo visible. */}
      <div
        data-hero-overlay
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-background/25"
      />
      <div
        data-hero-gradient
        aria-hidden="true"
        className="home-hero-gradient absolute inset-0 -z-10"
      />
      <div
        data-hero-bottom-gradient
        aria-hidden="true"
        className="home-hero-bottom-gradient absolute inset-0 -z-10"
      />
      <Container className="home-hero-content grid gap-12 pb-10 md:gap-16 md:pb-12">
        <div className="grid max-w-[40rem] justify-items-start gap-6 text-start">
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
          <ul
            data-hero-actions
            className="m-0 mt-2 flex w-full list-none flex-col gap-3 p-0 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
          >
            {content.actions.map((action, index) => {
              const kind = index === 0 ? "primary" : "secondary";
              return (
                <li key={action.href} className="min-w-0">
                  <Button
                    asChild
                    variant={kind === "primary" ? "default" : "outline"}
                    size="lg"
                    className="w-full text-sm no-underline data-[slot=button]:rounded-[0.875rem] data-[variant=outline]:border-foreground/60 data-[variant=outline]:bg-transparent data-[variant=outline]:hover:bg-accent data-[variant=outline]:active:bg-selected"
                  >
                    <NavigationLink href={action.href} data-action={kind}>
                      {action.label}
                      {kind === "primary" ? (
                        <ArrowRightIcon aria-hidden="true" />
                      ) : null}
                    </NavigationLink>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
        {stats ? (
          <div data-hero-stats className="w-full max-w-[52rem]">
            {stats}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export { HomeHero };
