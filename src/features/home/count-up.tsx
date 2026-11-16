"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1500;

export function formatStat(value: number, decimals: number) {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Renders the final value on the server (and without JavaScript), then counts
 * up once from zero when first scrolled into view. Screen readers only ever get
 * the final value; reduced-motion users never see the animation.
 */
export function CountUp({
  value,
  decimals,
}: {
  value: number;
  decimals: number;
}) {
  const final = formatStat(value, decimals);
  const ref = useRef<HTMLSpanElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const visual = visualRef.current;
    if (visual) visual.textContent = final;
    if (
      !element ||
      !visual ||
      typeof IntersectionObserver !== "function" ||
      typeof matchMedia !== "function"
    )
      return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let frame = 0;
    let started = false;
    let start: number | undefined;
    let stopped = false;
    visual.textContent = formatStat(0, decimals);

    const step = (time: number) => {
      if (stopped) return;
      start ??= time;
      const progress = Math.min((time - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      visual.textContent = formatStat(
        progress === 1 ? value : value * eased,
        decimals,
      );
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver((entries) => {
      if (stopped || started || !entries.some((entry) => entry.isIntersecting))
        return;
      started = true;
      observer.disconnect();
      frame = requestAnimationFrame(step);
    });
    const stop = () => {
      stopped = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      visual.textContent = final;
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) stop();
    };
    motion.addEventListener("change", onMotionChange);
    observer.observe(element);

    return () => {
      stop();
      motion.removeEventListener("change", onMotionChange);
    };
  }, [value, decimals, final]);

  return (
    <>
      {/* The invisible final value alone sizes the box; the count is an overlay,
          end-aligned so a suffix stays attached and layout never shifts. */}
      <span
        ref={ref}
        aria-hidden="true"
        className="relative inline-block tabular-nums"
      >
        <span data-count-reserve className="invisible">
          {final}
        </span>
        <span
          ref={visualRef}
          aria-hidden="true"
          data-count-visual
          className="absolute inset-y-0 end-0 text-end whitespace-nowrap tabular-nums"
        >
          {final}
        </span>
      </span>
      <span className="sr-only">{final}</span>
    </>
  );
}
