"use client";

import {
  useCallback,
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

export function HomeSuccessStoriesCarousel({
  children,
  action,
  headingId,
  count,
}: {
  children: ReactNode;
  action: ReactNode;
  headingId: string;
  count: number;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const subscribe = useCallback(
    (listener: () => void) => {
      if (!api) return () => {};
      api.on("select", listener).on("reInit", listener);
      return () => {
        api.off("select", listener).off("reInit", listener);
      };
    },
    [api],
  );
  const selected = useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 1,
    () => 1,
  );
  const canPrev = useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  );
  const canNext = useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
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
        slide.toggleAttribute(
          "data-success-active",
          index === api.selectedScrollSnap(),
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
        slide.removeAttribute("data-success-active");
      });
    };
  }, [api]);

  const move = (direction: "previous" | "next") => {
    if (direction === "previous" && api?.canScrollPrev())
      api.scrollPrev(reduced);
    if (direction === "next" && api?.canScrollNext()) api.scrollNext(reduced);
  };

  return (
    <Carousel
      role="group"
      aria-labelledby={headingId}
      data-home-success-stories-carousel
      data-ready={api ? "true" : "false"}
      opts={{
        align: "center",
        startIndex: 1,
        slidesToScroll: 1,
        loop: false,
        containScroll: false,
        watchFocus: revealFocus,
      }}
      setApi={setApi}
      onKeyDownCapture={(event) => {
        // Controls retain focus while the selected story changes.
        if (
          !api ||
          !(event.target as Element).closest("[data-success-controls]")
        )
          return;
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        move(event.key === "ArrowLeft" ? "previous" : "next");
      }}
      className="grid min-w-0 gap-6"
    >
      <CarouselContent
        className="success-stories-track ml-0 gap-4"
        viewportProps={{
          tabIndex: 0,
          role: "group",
          "aria-label": "Member success stories, scroll to read all three",
          onKeyDown: (event) => {
            if (!api) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? "previous" : "next");
            }
          },
        }}
      >
        {children}
      </CarouselContent>
      <div
        data-success-controls
        className="success-stories-controls flex flex-wrap items-center justify-center gap-4"
      >
        <Button
          hidden={!api}
          variant="outline"
          size="icon"
          className="success-stories-control size-11 rounded-full"
          aria-label="Previous success story"
          aria-disabled={!canPrev}
          onClick={() => move("previous")}
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        {action}
        <Button
          hidden={!api}
          variant="outline"
          size="icon"
          className="success-stories-control size-11 rounded-full"
          aria-label="Next success story"
          aria-disabled={!canNext}
          onClick={() => move("next")}
        >
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
      <p
        hidden={!api}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Success story {selected + 1} of {count}
      </p>
    </Carousel>
  );
}
