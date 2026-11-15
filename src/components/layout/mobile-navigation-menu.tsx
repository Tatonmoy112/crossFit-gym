"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { NavigationLink } from "@/components/ui/navigation-link";
import {
  Dialog,
  DialogClose,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  currentNavigationLink,
  normalizeNavigationPath,
} from "@/lib/navigation";
import type { NavigationGroup } from "@/schemas/navigation";
import { useNavigationFocus } from "@/hooks/use-navigation-focus";

type MobileNavigationProps = {
  groups: readonly NavigationGroup[];
  className?: string;
};
const desktopQuery = "(min-width: 64rem)";

function MobileNavigationMenu(props: MobileNavigationProps) {
  const path = normalizeNavigationPath(usePathname());
  return <MobileNavigationGroups key={path} path={path} {...props} />;
}

function MobileNavigationGroups({
  groups,
  className,
  path,
}: MobileNavigationProps & { path: string | null }) {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const { onFocusCapture, onBlurCapture, restoreFocus } =
    useNavigationFocus(root);
  const current = currentNavigationLink(groups, path);

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) {
        restoreFocus();
        setOpen(false);
      }
    }
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, [restoreFocus]);

  return (
    <div
      ref={root}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      className={cn("min-w-0 max-w-full lg:hidden", className)}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <MenuIcon aria-hidden="true" />
            Menu
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogPrimitive.Overlay
            data-mobile-backdrop
            className="fixed inset-0 z-50 bg-black/50"
          />
          <DialogPrimitive.Content
            data-mobile-panel
            data-surface="light"
            aria-describedby={undefined}
            className="fixed top-4 right-4 z-50 flex h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-96 flex-col rounded-overlay border border-input bg-background text-foreground shadow-xl"
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              closeButton.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              if (window.matchMedia(desktopQuery).matches) {
                event.preventDefault();
                document.getElementById("main")?.focus();
              }
            }}
          >
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-input p-4">
              <DialogPrimitive.Title className="type-control-strong min-w-0 [overflow-wrap:anywhere]">
                Site navigation
              </DialogPrimitive.Title>
              <DialogClose asChild>
                <Button
                  ref={closeButton}
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                >
                  <XIcon aria-hidden="true" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </DialogClose>
            </div>
            <nav
              aria-label="Primary navigation"
              className="min-h-0 overflow-y-auto overscroll-contain p-4"
            >
              {groups.map((group) => (
                <section key={group.label} className="mb-6 last:mb-0">
                  <h3 className="type-control-strong mb-2">{group.label}</h3>
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
                              setOpen(false);
                          }}
                        >
                          {link.label}
                        </NavigationLink>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </nav>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}

export { MobileNavigationMenu };
