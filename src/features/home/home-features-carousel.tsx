"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(listener: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener?.("change", listener);
  return () => media.removeEventListener?.("change", listener);
}
const getMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => true;

function revealFocus(api: NonNullable<CarouselApi>, event: FocusEvent) {
  const target = event.target as HTMLElement;
  if (target.matches(":focus-visible")) {
    const index = api.slideNodes().findIndex((slide) => slide.contains(target));
    if (index >= 0) {
      api.rootNode().scrollLeft = 0;
      api.scrollTo(index, true);
    }
  }
  return false;
}

export function HomeFeaturesCarousel({
  children,
  introduction,
  headingId,
  count,
}: {
  children: ReactNode;
  introduction: ReactNode;
  headingId: string;
  count: number;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const subscribe = (listener: () => void) => {
    if (!api) return () => {};
    api.on("select", listener).on("reInit", listener);
    return () => {
      api.off("select", listener).off("reInit", listener);
    };
  };
  const selected = useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 0,
    () => 0,
  );
  const reduced = useSyncExternalStore(
    subscribeMotion,
    getMotion,
    serverMotion,
  );

  useEffect(() => {
    if (!api) return;
    const slides = api.slideNodes();
    const update = () => {
      const bounds = api.rootNode().getBoundingClientRect();
      slides.forEach((slide, index) => {
        // Keep the trailing visible card shorter as the loop advances,
        // leaving its own space for controls instead of covering a CTA.
        slide.toggleAttribute(
          "data-feature-trailing",
          index === (api.selectedScrollSnap() + 1) % slides.length,
        );
        const box = slide.getBoundingClientRect();
        slide.inert =
          box.right <= bounds.left + 1 || box.left >= bounds.right - 1;
      });
    };
    update();
    api.on("scroll", update).on("select", update).on("reInit", update);
    return () => {
      api.off("scroll", update).off("select", update).off("reInit", update);
      slides.forEach((slide) => {
        slide.inert = false;
        slide.removeAttribute("data-feature-trailing");
      });
    };
  }, [api]);

  return (
    <Carousel
      role="group"
      aria-labelledby={headingId}
      data-home-features-carousel
      data-ready={api ? "true" : "false"}
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
        watchFocus: revealFocus,
      }}
      setApi={setApi}
      onKeyDownCapture={(event) => {
        if (!api || (event.key !== "ArrowLeft" && event.key !== "ArrowRight"))
          return;
        event.preventDefault();
        if (event.key === "ArrowLeft") api.scrollPrev(reduced);
        else api.scrollNext(reduced);
      }}
      className="home-features-layout"
    >
      <div className="home-features-intro flex min-w-0 flex-col gap-6">
        <div
          data-features-progress
          hidden={!api}
          className="flex min-h-11 items-center gap-4"
        >
          <p
            aria-live="polite"
            aria-atomic="true"
            className="m-0 flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            <span className="sr-only">Feature </span>
            {String(selected + 1).padStart(2, "0")}
            <span className="sr-only"> of {count}</span>
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          <span aria-hidden="true" className="text-sm text-muted-foreground">
            {String(count).padStart(2, "0")}
          </span>
        </div>
        {introduction}
      </div>
      <div className="home-features-track grid min-w-0 gap-5">
        <CarouselContent className="ml-0 gap-5">{children}</CarouselContent>
        <div
          data-features-controls
          hidden={!api}
          className="flex items-center justify-end gap-2"
        >
          <Button
            variant="outline"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Previous feature"
            onClick={() => api?.scrollPrev(reduced)}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            className="size-11 rounded-full"
            aria-label="Next feature"
            onClick={() => api?.scrollNext(reduced)}
          >
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Carousel>
  );
}
