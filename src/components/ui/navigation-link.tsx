import * as React from "react";
import NextLink from "next/link";
import { cn } from "cn";

type NavigationLinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  href: string;
};

const newTabCue = "(opens in a new tab)";

function invalidDestination(): never {
  throw new TypeError(
    "NavigationLink requires a root-relative path, named fragment, HTTP(S), mailto or tel destination.",
  );
}

function isInternalDestination(href: string): boolean {
  if (
    typeof href !== "string" ||
    !href ||
    /[\s\\]/.test(href) ||
    [...href].some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  ) {
    return invalidDestination();
  }

  if (href.startsWith("/")) {
    if (href.startsWith("//")) return invalidDestination();
    return true;
  }
  if (href.startsWith("#")) {
    if (href.length === 1) return invalidDestination();
    return false;
  }

  let destination: URL;
  try {
    destination = new URL(href);
  } catch {
    return invalidDestination();
  }
  if (
    (/^https?:\/\//i.test(href) && destination.hostname) ||
    (["mailto:", "tel:"].includes(destination.protocol) && destination.pathname)
  ) {
    return false;
  }
  return invalidDestination();
}

function NavigationLink({
  href,
  children,
  className,
  target,
  rel,
  "aria-label": ariaLabel,
  ...props
}: NavigationLinkProps) {
  const internal = isInternalDestination(href);
  const newTab = target?.toLowerCase() === "_blank";
  const linkRel = newTab
    ? [
        ...new Set([
          ...(rel
            ?.split(/\s+/)
            .filter((token) => token && token.toLowerCase() !== "opener") ??
            []),
          "noopener",
          "noreferrer",
        ]),
      ].join(" ")
    : rel;
  const linkProps = {
    ...props,
    href,
    target,
    rel: linkRel,
    "aria-label": newTab && ariaLabel ? `${ariaLabel} ${newTabCue}` : ariaLabel,
    className: cn(
      "inline-flex items-center gap-2 touch-target rounded-control type-control motion-control px-3 py-2 text-link underline decoration-1 underline-offset-4 whitespace-normal [overflow-wrap:anywhere] hover:bg-accent hover:text-accent-foreground active:bg-selected active:text-selected-foreground aria-[current=page]:font-semibold aria-[current=page]:decoration-2",
      className,
    ),
  };
  const content = (
    <>
      {children}
      {newTab && (
        <>
          {" "}
          <span className="type-hint">{newTabCue}</span>
        </>
      )}
    </>
  );

  return internal ? (
    <NextLink {...linkProps} prefetch={false}>
      {content}
    </NextLink>
  ) : (
    <a {...linkProps}>{content}</a>
  );
}

export { NavigationLink, type NavigationLinkProps };
