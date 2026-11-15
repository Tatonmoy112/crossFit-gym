"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { NavigationGroup } from "@/schemas/navigation";
import { useNavigationFocus } from "@/hooks/use-navigation-focus";
import {
  currentNavigationLink,
  normalizeNavigationPath,
} from "@/lib/navigation";

type DesktopNavigationProps = {
  groups: readonly NavigationGroup[];
  className?: string;
};

function DesktopNavigationMenu(props: DesktopNavigationProps) {
  const pathname = usePathname();
  const path = normalizeNavigationPath(pathname);
  return <DesktopNavigationGroups key={path} path={path} {...props} />;
}

function DesktopNavigationGroups({
  groups,
  className,
  path,
}: DesktopNavigationProps & { path: string | null }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionId = useId();
  const current = currentNavigationLink(groups, path);
  const { onFocusCapture, onBlurCapture, restoreFocus } =
    useNavigationFocus(root);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    function closeOnMobile(event: MediaQueryListEvent) {
      if (event.matches) return;
      restoreFocus();
      setOpenGroup(null);
    }
    media.addEventListener("change", closeOnMobile);
    return () => media.removeEventListener("change", closeOnMobile);
  }, [restoreFocus]);

  useEffect(() => {
    if (!openGroup) return;
    function dismissOutside(event: Event) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpenGroup(null);
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
    };
  }, [openGroup]);

  return (
    <nav
      ref={root}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      aria-label="Primary navigation"
      className={cn("relative hidden max-w-full lg:block", className)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && openGroup) {
          event.preventDefault();
          triggers.current[
            groups.findIndex((group) => group.label === openGroup)
          ]?.focus();
          setOpenGroup(null);
        }
      }}
    >
      <ul className="relative m-0 flex list-none flex-wrap gap-2 p-2">
        {groups.map((group, index) => {
          const isCurrent = group.links.some(
            (link) => link.href === current?.href,
          );
          return (
            <Collapsible
              key={group.label}
              asChild
              open={openGroup === group.label}
              onOpenChange={(open) => setOpenGroup(open ? group.label : null)}
            >
              <li className="min-w-0 max-w-full">
                <CollapsibleTrigger asChild>
                  <Button
                    ref={(node) => {
                      triggers.current[index] = node;
                    }}
                    variant="ghost"
                    data-current={isCurrent}
                    aria-describedby={isCurrent ? descriptionId : undefined}
                    className="group/desktop-trigger max-w-full px-3 py-2 data-[state=open]:bg-selected data-[state=open]:text-selected-foreground data-[current=true]:font-semibold data-[current=true]:underline data-[current=true]:decoration-2 data-[current=true]:underline-offset-4"
                    onKeyDown={(event) => {
                      if (
                        event.key === "ArrowDown" &&
                        openGroup === group.label
                      ) {
                        event.preventDefault();
                        panels.current[index]
                          ?.querySelector<HTMLAnchorElement>("a[href]")
                          ?.focus();
                      }
                    }}
                  >
                    {group.label}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-none group-data-[state=open]/desktop-trigger:rotate-180"
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent
                  ref={(node) => {
                    panels.current[index] = node;
                  }}
                  data-desktop-panel
                  className="absolute top-full left-0 z-50 mt-2 w-72 max-w-full rounded-overlay border border-input bg-popover p-2 text-popover-foreground shadow-md"
                >
                  <ul className="m-0 list-none p-2">
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
                          className="flex w-full aria-[current=location]:font-semibold aria-[current=location]:decoration-2"
                          onClick={(event) => {
                            if (
                              !event.ctrlKey &&
                              !event.metaKey &&
                              !event.shiftKey &&
                              !event.altKey &&
                              event.button === 0
                            )
                              setOpenGroup(null);
                          }}
                        >
                          {link.label}
                        </NavigationLink>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </li>
            </Collapsible>
          );
        })}
      </ul>
      <span id={descriptionId} className="sr-only">
        Current section
      </span>
    </nav>
  );
}

export { DesktopNavigationMenu };
