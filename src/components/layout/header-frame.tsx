"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

// Keep navigation/content on the server; only placement depends on the route.
export function HeaderFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const header = headerRef.current;
    if (!isHome || !header || typeof ResizeObserver === "undefined") return;

    function measure() {
      if (!header) return;
      document.documentElement.style.setProperty(
        "--home-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
      header.setAttribute("data-overlay", "");
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => {
      observer.disconnect();
      header.removeAttribute("data-overlay");
      document.documentElement.style.removeProperty("--home-header-height");
    };
  }, [isHome]);

  return (
    <header
      ref={headerRef}
      data-site-header
      data-home={isHome}
      data-surface="charcoal"
    >
      {children}
    </header>
  );
}
