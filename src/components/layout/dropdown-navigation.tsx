"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "cn";
import { NavigationLink } from "@/components/ui/navigation-link";
import { useNavigationFocus } from "@/hooks/use-navigation-focus";
import {
  currentNavigationLink,
  normalizeNavigationPath,
} from "@/lib/navigation";
import type { NavigationGroup } from "@/schemas/navigation";

type DropdownNavigationProps = {
  groups: readonly NavigationGroup[];
  className?: string;
};

const desktopQuery = "(min-width: 64rem)";
const hoverQuery = "(hover: hover) and (pointer: fine)";

export function DropdownNavigation(props: DropdownNavigationProps) {
  const path = normalizeNavigationPath(usePathname());
  return <DropdownGroups key={path} path={path} {...props} />;
}

function DropdownGroups({
  groups,
  className,
  path,
}: DropdownNavigationProps & { path: string | null }) {
  const root = useRef<HTMLElement>(null);
  const disclosures = useRef<(HTMLDetailsElement | null)[]>([]);
  const pinned = useRef<number | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const id = useId();
  const current = currentNavigationLink(groups, path);
  const { onFocusCapture, onBlurCapture, restoreFocus } =
    useNavigationFocus(root);

  function clearTimers() {
    if (openTimer.current !== null) clearTimeout(openTimer.current);
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    openTimer.current = closeTimer.current = null;
  }

  function show(index: number | null) {
    clearTimers();
    disclosures.current.forEach((element, position) => {
      if (element) {
        element.open = position === index;
        element
          .querySelector("summary")
          ?.setAttribute("aria-expanded", String(position === index));
      }
    });
    setOpenGroup(index);
  }

  function dismiss() {
    pinned.current = null;
    show(null);
  }

  useEffect(() => {
    disclosures.current.forEach((element) =>
      element?.querySelector("summary")?.setAttribute("aria-expanded", "false"),
    );
    return () => clearTimers();
  }, []);

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    function onBreakpoint(event: MediaQueryListEvent) {
      if (!event.matches) restoreFocus();
      const focused = root.current?.querySelector("details[open]");
      if (focused?.contains(document.activeElement))
        focused.querySelector("summary")?.focus();
      pinned.current = null;
      clearTimers();
      disclosures.current.forEach((element) => {
        if (element) {
          element.open = false;
          element
            .querySelector("summary")
            ?.setAttribute("aria-expanded", "false");
        }
      });
      setOpenGroup(null);
    }
    media.addEventListener("change", onBreakpoint);
    return () => media.removeEventListener("change", onBreakpoint);
  }, [restoreFocus]);

  useEffect(() => {
    if (openGroup === null) return;
    const element = disclosures.current[openGroup];
    const panel = element?.querySelector<HTMLElement>("[data-dropdown-panel]");
    function position() {
      if (!panel) return;
      panel.style.setProperty("--dropdown-shift", "0px");
      const box = panel.getBoundingClientRect();
      const shift = Math.max(
        16 - box.left,
        Math.min(0, window.innerWidth - 16 - box.right),
      );
      panel.style.setProperty("--dropdown-shift", `${shift}px`);
    }
    function dismissOutside(event: Event) {
      if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      ) {
        pinned.current = null;
        clearTimers();
        disclosures.current.forEach((item) => {
          if (item) {
            item.open = false;
            item
              .querySelector("summary")
              ?.setAttribute("aria-expanded", "false");
          }
        });
        setOpenGroup(null);
      }
    }
    position();
    window.addEventListener("resize", position);
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    return () => {
      window.removeEventListener("resize", position);
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
    };
  }, [openGroup]);

  return (
    <nav
      ref={root}
      aria-label="Primary navigation"
      data-dropdown-navigation="header"
      className={cn("dropdown-navigation hidden lg:block", className)}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          clearTimers();
          if (openGroup === null) return;
          event.preventDefault();
          disclosures.current[openGroup]?.querySelector("summary")?.focus();
          dismiss();
        }
      }}
    >
      <ul className="dropdown-groups">
        {groups.map((group, index) => {
          const isOpen = openGroup === index;
          const isCurrent = group.links.some(
            (link) => link.href === current?.href,
          );
          return (
            <li key={group.label}>
              <details
                ref={(element) => {
                  disclosures.current[index] = element;
                }}
                className="navigation-disclosure"
                name={`${id}-groups`}
                onPointerEnter={(event) => {
                  if (
                    event.pointerType === "touch" ||
                    !window.matchMedia(hoverQuery).matches
                  )
                    return;
                  clearTimers();
                  const focused = root.current?.querySelector(
                    "details[open] [data-dropdown-panel]",
                  );
                  if (focused?.contains(document.activeElement)) return;
                  if (pinned.current === index || isOpen) return;
                  openTimer.current = setTimeout(() => {
                    pinned.current = null;
                    show(index);
                  }, 150);
                }}
                onPointerLeave={() => {
                  clearTimers();
                  if (pinned.current === index) return;
                  closeTimer.current = setTimeout(() => {
                    const element = disclosures.current[index];
                    if (
                      !element?.contains(document.activeElement) &&
                      element?.open
                    )
                      show(null);
                  }, 200);
                }}
              >
                <summary
                  role="button"
                  aria-controls={`${id}-panel-${index}`}
                  aria-describedby={isCurrent ? `${id}-current` : undefined}
                  data-current={isCurrent}
                  data-state={isOpen ? "open" : "closed"}
                  className="dropdown-trigger type-control motion-control"
                  onClick={(event) => {
                    event.preventDefault();
                    if (
                      isOpen &&
                      (pinned.current === index || event.detail === 0)
                    )
                      dismiss();
                    else {
                      pinned.current = index;
                      show(index);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown") return;
                    event.preventDefault();
                    pinned.current = index;
                    show(index);
                    disclosures.current[index]
                      ?.querySelector<HTMLAnchorElement>("a[href]")
                      ?.focus();
                  }}
                >
                  {group.label}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="dropdown-chevron size-4"
                  />
                </summary>
                <div
                  id={`${id}-panel-${index}`}
                  data-dropdown-panel
                  data-desktop-panel
                  className="dropdown-panel"
                >
                  <ul className="dropdown-links">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <NavigationLink
                          href={link.href}
                          aria-current={
                            link.href === current?.href
                              ? path === link.href
                                ? "page"
                                : "location"
                              : undefined
                          }
                          className="dropdown-link flex w-full justify-between gap-4 bg-transparent px-3 py-3 text-popover-foreground no-underline hover:bg-transparent hover:text-popover-foreground hover:underline active:bg-transparent active:text-popover-foreground focus-visible:underline aria-[current=page]:underline aria-[current=location]:underline"
                          onClick={(event) => {
                            if (
                              !event.ctrlKey &&
                              !event.metaKey &&
                              !event.shiftKey &&
                              !event.altKey &&
                              event.button === 0
                            )
                              dismiss();
                          }}
                        >
                          <span>{link.label}</span>
                          <ArrowUpRightIcon
                            aria-hidden="true"
                            className="dropdown-link-arrow size-4"
                          />
                        </NavigationLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
      <span id={`${id}-current`} className="sr-only">
        Current section
      </span>
    </nav>
  );
}
