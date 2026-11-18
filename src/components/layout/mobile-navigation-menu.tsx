"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  XIcon,
} from "lucide-react";
import {
  Accordion as AccordionPrimitive,
  Dialog as DialogPrimitive,
} from "radix-ui";
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
import type { MobileDrawerContent } from "@/content/mobile-navigation";

type MobileNavigationProps = {
  groups: readonly NavigationGroup[];
  brand: ReactNode;
  content: MobileDrawerContent;
  className?: string;
};
const desktopQuery = "(min-width: 64rem)";

function MobileNavigationMenu(props: MobileNavigationProps) {
  const path = normalizeNavigationPath(usePathname());
  return <MobileNavigationGroups key={path} path={path} {...props} />;
}

function MobileNavigationGroups({
  groups,
  brand,
  content,
  className,
  path,
}: MobileNavigationProps & { path: string | null }) {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const { onFocusCapture, onBlurCapture, restoreFocus } =
    useNavigationFocus(root);
  const current = currentNavigationLink(groups, path);
  const initialGroup =
    groups.find((group) =>
      group.links.some((link) => link.href === current?.href),
    )?.label ??
    groups.find((group) => group.label === "Training")?.label ??
    groups[0]?.label ??
    "";
  const [expandedGroup, setExpandedGroup] = useState(initialGroup);

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
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setExpandedGroup(initialGroup);
          setOpen(nextOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="not-disabled:hover:bg-transparent not-disabled:hover:text-foreground not-disabled:active:bg-transparent not-disabled:active:text-foreground hover:underline focus-visible:underline"
          >
            <MenuIcon aria-hidden="true" />
            Menu
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogPrimitive.Overlay
            data-mobile-backdrop
            className="mobile-drawer-backdrop"
          />
          <DialogPrimitive.Content
            data-mobile-panel
            data-surface="charcoal"
            aria-describedby={undefined}
            className="mobile-drawer"
            onClick={(event) => {
              if (
                event.target instanceof Element &&
                event.target.closest("a[href]") &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.shiftKey &&
                !event.altKey &&
                event.button === 0
              )
                setOpen(false);
            }}
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
            <DialogPrimitive.Title className="sr-only">
              {content.title}
            </DialogPrimitive.Title>
            <div className="mobile-drawer-header">
              {brand}
              <DialogClose asChild>
                <Button
                  ref={closeButton}
                  variant="ghost"
                  size="icon"
                  className="mobile-drawer-close shrink-0 not-disabled:hover:bg-transparent not-disabled:hover:text-foreground not-disabled:active:bg-transparent not-disabled:active:text-foreground"
                >
                  <XIcon aria-hidden="true" className="size-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </DialogClose>
            </div>
            <div className="mobile-drawer-scroll">
              <div className="mobile-drawer-body">
                <nav aria-label="Primary navigation">
                  <AccordionPrimitive.Root
                    type="single"
                    collapsible
                    value={expandedGroup}
                    onValueChange={setExpandedGroup}
                  >
                    {groups.map((group) => (
                      <AccordionPrimitive.Item
                        key={group.label}
                        value={group.label}
                        className="mobile-drawer-group"
                      >
                        <AccordionPrimitive.Header asChild>
                          <h3 className="mobile-drawer-group-heading">
                            <AccordionPrimitive.Trigger
                              className="mobile-drawer-group-trigger"
                              data-current={group.links.some(
                                (link) => link.href === current?.href,
                              )}
                            >
                              <span>{group.label}</span>
                              <ChevronDownIcon
                                className="mobile-drawer-chevron size-5"
                                aria-hidden="true"
                              />
                            </AccordionPrimitive.Trigger>
                          </h3>
                        </AccordionPrimitive.Header>
                        <AccordionPrimitive.Content className="mobile-drawer-group-content">
                          <ul className="mobile-drawer-links">
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
                                  className="mobile-drawer-link flex w-full bg-transparent px-4 py-3 text-foreground no-underline hover:bg-transparent hover:text-foreground hover:underline active:bg-transparent active:text-foreground focus-visible:underline aria-[current=page]:text-primary aria-[current=page]:underline aria-[current=location]:font-semibold aria-[current=location]:text-primary aria-[current=location]:underline aria-[current=location]:decoration-2"
                                >
                                  {link.label}
                                </NavigationLink>
                              </li>
                            ))}
                          </ul>
                        </AccordionPrimitive.Content>
                      </AccordionPrimitive.Item>
                    ))}
                  </AccordionPrimitive.Root>
                </nav>
                <div className="mobile-drawer-contact-area">
                  <Button
                    asChild
                    className="mobile-drawer-contact w-full rounded-full px-5 py-3 text-primary-foreground no-underline hover:bg-primary-hover hover:text-primary-foreground active:bg-primary-active active:text-primary-foreground"
                  >
                    <NavigationLink href={content.contact.href}>
                      {content.contact.label}
                      <ArrowUpRightIcon aria-hidden="true" />
                    </NavigationLink>
                  </Button>
                  <NavigationLink
                    href={content.phone.href}
                    className="mobile-drawer-call flex w-full justify-center bg-transparent px-2 py-3 text-foreground no-underline hover:bg-transparent hover:text-foreground hover:underline active:bg-transparent active:text-foreground focus-visible:underline"
                  >
                    <PhoneIcon aria-hidden="true" className="size-4" />
                    <span>{content.phone.label}</span>
                  </NavigationLink>
                  <p className="mobile-drawer-location">
                    <MapPinIcon aria-hidden="true" className="size-4" />
                    <span>{content.location}</span>
                  </p>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}

export { MobileNavigationMenu };
