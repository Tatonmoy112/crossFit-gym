import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { NavigationLink } from "@/components/ui/navigation-link";

it("preserves root paths query/hash ref and native caller events without button semantics", () => {
  const ref = React.createRef<HTMLAnchorElement>();
  const activate = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) =>
    event.preventDefault(),
  );
  render(
    <NavigationLink
      href="/contact/?topic=specimen#details"
      ref={ref}
      data-purpose="fixture"
      onClick={activate}
    >
      Contact specimen
    </NavigationLink>,
  );
  const link = screen.getByRole("link", { name: "Contact specimen" });
  const destination = new URL(
    link.getAttribute("href")!,
    "https://example.invalid",
  );
  // Next owns slash normalization; destination, query and fragment survive it.
  expect(destination.pathname.replace(/\/$/, "")).toBe("/contact");
  expect(destination.search).toBe("?topic=specimen");
  expect(destination.hash).toBe("#details");
  expect(link).toHaveAttribute("data-purpose", "fixture");
  expect(link).not.toHaveAttribute("type");
  expect(ref.current).toBe(link);
  fireEvent.click(link);
  expect(activate).toHaveBeenCalledOnce();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it.each([
  "https://example.invalid/specimen",
  "http://example.invalid/",
  "mailto:specimen@example.invalid",
  "tel:+12025550123",
  "#specimen-target",
])(
  "preserves supported native destination %s without forcing a new tab",
  (href) => {
    render(<NavigationLink href={href}>Destination specimen</NavigationLink>);
    const link = screen.getByRole("link", { name: "Destination specimen" });
    expect(link).toHaveAttribute("href", href);
    expect(link).not.toHaveAttribute("target");
  },
);

it("preserves explicit current-page semantics without inventing route matching", () => {
  render(
    <>
      <NavigationLink href="/about/" aria-current="page">
        Current specimen
      </NavigationLink>
      <NavigationLink href="/contact/">Other specimen</NavigationLink>
    </>,
  );
  expect(
    screen.getByRole("link", { name: "Current specimen" }),
  ).toHaveAttribute("aria-current", "page");
  expect(
    screen.getByRole("link", { name: "Other specimen" }),
  ).not.toHaveAttribute("aria-current");
});

it("adds visible new-tab copy and secure rel tokens while preserving caller tokens", () => {
  render(
    <NavigationLink
      href="https://example.invalid/"
      target="_blank"
      rel="nofollow opener"
    >
      External specimen
    </NavigationLink>,
  );
  const link = screen.getByRole("link", {
    name: "External specimen (opens in a new tab)",
  });
  expect(link).toHaveTextContent("(opens in a new tab)");
  const tokens = link.getAttribute("rel")!.split(/\s+/);
  expect(tokens).toEqual(
    expect.arrayContaining(["nofollow", "noopener", "noreferrer"]),
  );
  expect(tokens).not.toContain("opener");
});

it("keeps caller accessible names with the new-tab cue and handles target keyword case", () => {
  render(
    <NavigationLink
      href="/contact/"
      target="_BLANK"
      aria-label="Named specimen"
    >
      <svg aria-hidden="true" />
    </NavigationLink>,
  );
  expect(
    screen.getByRole("link", { name: "Named specimen (opens in a new tab)" }),
  ).toHaveAttribute("rel", expect.stringContaining("noopener"));
});

it.each([
  "",
  "#",
  "contact/",
  "//example.invalid/",
  "javascript:alert(1)",
  "data:text/html,specimen",
  "https://",
  "https:example.invalid",
  "http:/example.invalid",
  "/\\example.invalid/",
])("rejects unsupported or missing destination %j", (href) => {
  expect(() =>
    renderToStaticMarkup(
      <NavigationLink href={href}>Unavailable specimen</NavigationLink>,
    ),
  ).toThrow(TypeError);
});
