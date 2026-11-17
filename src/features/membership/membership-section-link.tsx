"use client";

import type { ComponentProps } from "react";
import { NavigationLink } from "@/components/ui/navigation-link";
import type { MembershipPageContent } from "@/schemas/membership-page";

type Props = Omit<ComponentProps<typeof NavigationLink>, "href" | "onClick"> & {
  href: MembershipPageContent["navigation"][number]["href"];
};

// Use Next's patched History API to preserve the route snapshot for Back,
// while retaining native fragment URLs and focus without JavaScript.
export function MembershipSectionLink({ href, ...props }: Props) {
  return (
    <NavigationLink
      {...props}
      href={href}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          event.shiftKey ||
          (event.currentTarget.target && event.currentTarget.target !== "_self")
        )
          return;
        const destination = document.getElementById(href.slice(1));
        if (!destination) return;
        event.preventDefault();
        if (window.location.hash !== href)
          window.history.pushState(null, "", href);
        destination.focus({ preventScroll: true });
        destination.scrollIntoView({ behavior: "auto", block: "start" });
      }}
    />
  );
}
