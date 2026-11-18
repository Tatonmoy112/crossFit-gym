import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { navigation } from "@/content/navigation";

const route = vi.hoisted(() => ({ pathname: "/" as string | null }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
const breakpointListeners = new Set<(event: MediaQueryListEvent) => void>();
beforeEach(() => {
  vi.stubGlobal("matchMedia", (media: string) => ({
    media,
    matches: true,
    addEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => breakpointListeners.add(listener),
    removeEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => breakpointListeners.delete(listener),
  }));
});
afterEach(() => {
  vi.useRealTimers();
  route.pathname = "/";
  breakpointListeners.clear();
  vi.unstubAllGlobals();
});

it("opens only after 150ms, cancels fleeting hover and allows 200ms to enter the panel", () => {
  vi.useFakeTimers();
  render(<DesktopNavigation />);
  const trigger = screen.getByRole("button", { name: "Training" });
  const details = trigger.closest("details")!;
  fireEvent.pointerEnter(details);
  act(() => vi.advanceTimersByTime(149));
  expect(details.open).toBe(false);
  fireEvent.pointerLeave(details);
  act(() => vi.advanceTimersByTime(200));
  expect(details.open).toBe(false);
  fireEvent.pointerEnter(details);
  act(() => vi.advanceTimersByTime(150));
  expect(details.open).toBe(true);
  fireEvent.pointerLeave(details);
  act(() => vi.advanceTimersByTime(199));
  expect(details.open).toBe(true);
  fireEvent.pointerEnter(details);
  act(() => vi.advanceTimersByTime(200));
  expect(details.open).toBe(true);
  fireEvent.pointerLeave(details);
  act(() => vi.advanceTimersByTime(200));
  expect(details.open).toBe(false);
});

it("pins a hover preview on click and dismisses on the next click", () => {
  vi.useFakeTimers();
  render(<DesktopNavigation />);
  const trigger = screen.getByRole("button", { name: "Training" });
  const details = trigger.closest("details")!;
  fireEvent.pointerEnter(details);
  act(() => vi.advanceTimersByTime(150));
  fireEvent.click(trigger, { detail: 1 });
  fireEvent.pointerLeave(details);
  act(() => vi.advanceTimersByTime(300));
  expect(details.open).toBe(true);
  fireEvent.click(trigger);
  expect(details.open).toBe(false);
});

it("opens from Arrow Down and never replaces a panel containing keyboard focus on hover", () => {
  vi.useFakeTimers();
  render(<DesktopNavigation />);
  const training = screen.getByRole("button", { name: "Training" });
  fireEvent.keyDown(training, { key: "ArrowDown" });
  const membership = screen.getByRole("link", { name: "Membership" });
  expect(membership).toHaveFocus();
  fireEvent.pointerEnter(
    screen.getByRole("button", { name: "About" }).closest("details")!,
  );
  act(() => vi.advanceTimersByTime(300));
  expect(training.closest("details")!.open).toBe(true);
  expect(membership).toHaveFocus();
});

it("ignores hover on coarse pointers", () => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (media: string) => ({
    media,
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  const { unmount } = render(<DesktopNavigation />);
  const details = screen
    .getByRole("button", { name: "Training" })
    .closest("details")!;
  fireEvent.pointerEnter(details);
  act(() => vi.advanceTimersByTime(300));
  expect(details.open).toBe(false);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("cancels pending hover on Escape and unmount", () => {
  vi.useFakeTimers();
  const { unmount } = render(<DesktopNavigation />);
  const trigger = screen.getByRole("button", { name: "Training" });
  const details = trigger.closest("details")!;
  fireEvent.pointerEnter(details);
  fireEvent.keyDown(trigger, { key: "Escape" });
  act(() => vi.advanceTimersByTime(150));
  expect(details.open).toBe(false);
  fireEvent.pointerLeave(details);
  fireEvent.pointerEnter(details);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("L01-B03: hides a stale desktop panel and gives focus a visible fallback when crossing to mobile", () => {
  render(
    <>
      <DesktopNavigation />
      <main id="main" tabIndex={-1}>
        Page content
      </main>
    </>,
  );
  const trigger = screen.getByRole("button", { name: "About" });
  fireEvent.click(trigger);
  screen.getByRole("link", { name: "Our story" }).focus();
  act(() => {
    for (const listener of breakpointListeners)
      listener({ matches: false } as MediaQueryListEvent);
  });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(document.querySelectorAll("details[open] a")).toHaveLength(0);
  expect(screen.getByRole("main")).toHaveFocus();
});

it("L02-A01/A03: exposes genuine disclosure buttons and only the selected group's links", () => {
  render(<DesktopNavigation />);
  const nav = screen.getByRole("navigation", { name: "Primary navigation" });
  expect(
    within(nav)
      .getAllByRole("button")
      .map((button) => button.textContent?.trim()),
  ).toEqual(navigation.map((group) => group.label));
  // JSDOM does not model native details accessibility exclusion.
  expect(nav.querySelectorAll("details[open] a")).toHaveLength(0);
  expect(within(nav).queryByRole("menubar")).not.toBeInTheDocument();
  for (const group of navigation) {
    const trigger = within(nav).getByRole("button", { name: group.label });
    expect(trigger.tagName).toBe("SUMMARY");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      [...nav.querySelectorAll("details[open] a")].map(
        (link) => link.textContent,
      ),
    ).toEqual(group.links.map((link) => link.label));
    for (const item of group.links) {
      const link = within(nav).getByRole("link", { name: item.label });
      expect(
        new URL(
          link.getAttribute("href")!,
          "https://example.invalid",
        ).pathname.replace(/\/$/, ""),
      ).toBe(item.href);
    }
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
});

it.each([
  ["/membership/", "Training", "Membership", "page"],
  ["/products/whey-protein-powder/", "Explore", "Products", "location"],
  ["/contact/", "Visit us", "Contact", "page"],
  ["/contact/details?topic=visit#main", "Visit us", "Contact", "location"],
])(
  "L02-A02: chooses one precise current link for %s",
  (pathname, group, label, current) => {
    route.pathname = pathname;
    render(<DesktopNavigation />);
    const trigger = screen.getByRole("button", { name: group });
    expect(trigger).toHaveAccessibleDescription("Current section");
    fireEvent.click(trigger);
    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "aria-current",
      current,
    );
    expect(
      screen
        .getAllByRole("link")
        .filter((link) => link.hasAttribute("aria-current")),
    ).toHaveLength(1);
  },
);

it.each(["/programs-archive", "/missing", "/", null])(
  "L02-A02: does not invent a current item for %s",
  (pathname) => {
    route.pathname = pathname;
    render(<DesktopNavigation />);
    for (const group of navigation) {
      fireEvent.click(screen.getByRole("button", { name: group.label }));
      for (const link of screen.getAllByRole("link"))
        expect(link).not.toHaveAttribute("aria-current");
    }
  },
);

it("L02-A03: panel entry and Escape return focus to the same disclosure", () => {
  render(<DesktopNavigation />);
  const trigger = screen.getByRole("button", { name: "Training" });
  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  const first = screen.getByRole("link", { name: "Membership" });
  expect(first).toHaveFocus();
  fireEvent.keyDown(first, { key: "Escape" });
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(document.querySelectorAll("details[open] a")).toHaveLength(0);
});

it("L02-A03: outside interaction dismisses the open disclosure", () => {
  render(<DesktopNavigation />);
  const trigger = screen.getByRole("button", { name: "About" });
  fireEvent.click(trigger);
  fireEvent.pointerDown(document.body);
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});

it("L02-A03: normal link selection dismisses before navigation", () => {
  render(<DesktopNavigation />);
  const trigger = screen.getByRole("button", { name: "About" });
  fireEvent.click(trigger);
  // Cancel only the test document's default navigation, after React receives it.
  document.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  fireEvent.click(screen.getByRole("link", { name: "Our story" }));
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});

it("L02-A02/A03: pathname changes reset the open group without losing current semantics", () => {
  const { rerender } = render(<DesktopNavigation />);
  fireEvent.click(screen.getByRole("button", { name: "About" }));
  expect(screen.getByRole("link", { name: "Our story" })).toBeVisible();
  route.pathname = "/membership/";
  rerender(<DesktopNavigation />);
  expect(screen.getByRole("button", { name: "About" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(document.querySelectorAll("details[open] a")).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Training" }));
  expect(screen.getByRole("link", { name: "Membership" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});
