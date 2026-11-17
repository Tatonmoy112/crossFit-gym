"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(listener: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener?.("change", listener);
  return () => media.removeEventListener?.("change", listener);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;

function revealFocusedService(
  api: NonNullable<CarouselApi>,
  event: FocusEvent,
) {
  const target = event.target as HTMLElement;
  // Keep pointer dragging stationary on focus. Keyboard/programmatic focus
  // reveals its card without relying on Embla's 10ms Tab timing window.
  if (target.matches(":focus-visible")) {
    const index = api.slideNodes().findIndex((slide) => slide.contains(target));
    if (index >= 0) {
      api.rootNode().scrollLeft = 0;
      api.scrollTo(index, true);
    }
  }
  return false;
}

export function HomeServicesCarousel({
  children,
  headingId,
}: {
  children: ReactNode;
  headingId: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const pointerPlaybackAction = useRef<boolean | undefined>(undefined);
  const reduced = useSyncExternalStore(
    subscribeToMotion,
    getReducedMotion,
    getServerMotion,
  );

  useEffect(() => {
    if (!api) return;
    const slides = api.slideNodes();
    const updateSlides = () => {
      const bounds = api.rootNode().getBoundingClientRect();
      slides.forEach((slide) => {
        const box = slide.getBoundingClientRect();
        slide.inert =
          box.right <= bounds.left + 1 || box.left >= bounds.right - 1;
      });
    };
    updateSlides();
    api.on("scroll", updateSlides).on("reInit", updateSlides);
    return () => {
      api.off("scroll", updateSlides).off("reInit", updateSlides);
      slides.forEach((slide) => (slide.inert = false));
    };
  }, [api]);

  useEffect(() => {
    const element = root.current;
    if (!api || !element || reduced || paused) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let inView = false;
    let hovered = element.matches(":hover");
    const clear = () => clearTimeout(timer);
    const schedule = () => {
      clear();
      if (inView && !hovered && document.visibilityState === "visible") {
        timer = setTimeout(() => api.scrollNext(), 5000);
      }
    };
    const enter = () => {
      hovered = true;
      clear();
    };
    const leave = () => {
      hovered = false;
      schedule();
    };
    // Without IntersectionObserver, retain manual operation rather than
    // rotating a section whose visibility cannot be established.
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            schedule();
          })
        : undefined;
    observer?.observe(element);
    element.addEventListener("mouseenter", enter);
    element.addEventListener("mouseleave", leave);
    document.addEventListener("visibilitychange", schedule);
    api.on("select", schedule);
    return () => {
      clear();
      observer?.disconnect();
      element.removeEventListener("mouseenter", enter);
      element.removeEventListener("mouseleave", leave);
      document.removeEventListener("visibilitychange", schedule);
      api.off("select", schedule);
    };
  }, [api, paused, reduced]);

  return (
    <Carousel
      ref={root}
      role="group"
      aria-labelledby={headingId}
      data-home-services-carousel
      data-ready={api ? "true" : "false"}
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
        watchFocus: revealFocusedService,
      }}
      setApi={setApi}
      onFocusCapture={() => setPaused(true)}
      onPointerDownCapture={(event) => {
        if ((event.target as Element).closest("[data-services-rotation]")) {
          pointerPlaybackAction.current = !paused;
        }
        setPaused(true);
      }}
      onKeyDownCapture={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        setPaused(true);
        if (event.key === "ArrowLeft") api?.scrollPrev(reduced);
        else api?.scrollNext(reduced);
      }}
      className="grid min-w-0 gap-8"
    >
      <div
        data-services-controls
        className="flex flex-wrap items-center justify-center gap-2"
        hidden={!api}
      >
        {!reduced && (
          <Button
            variant="outline"
            data-services-rotation
            size="icon"
            className="size-11 rounded-full"
            aria-label={
              paused ? "Play automatic rotation" : "Pause automatic rotation"
            }
            onPointerCancel={() => {
              pointerPlaybackAction.current = undefined;
            }}
            onKeyDown={() => {
              pointerPlaybackAction.current = undefined;
            }}
            onClick={() => {
              setPaused(pointerPlaybackAction.current ?? !paused);
              pointerPlaybackAction.current = undefined;
            }}
          >
            {paused ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause aria-hidden="true" />
            )}
          </Button>
        )}
        <Button
          size="icon"
          className="size-11 rounded-full"
          aria-label="Previous service"
          onClick={() => {
            setPaused(true);
            api?.scrollPrev(reduced);
          }}
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          className="size-11 rounded-full"
          aria-label="Next service"
          onClick={() => {
            setPaused(true);
            api?.scrollNext(reduced);
          }}
        >
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
      <CarouselContent className="ml-0 gap-4">{children}</CarouselContent>
    </Carousel>
  );
}
