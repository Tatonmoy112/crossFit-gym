import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { navigation } from "@/content/navigation";

const route = vi.hoisted(() => ({ pathname: "/" as string | null }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
// JSDOM has no media-query engine; responsive behavior is checked in Chromium.
beforeEach(() => {
  vi.stubGlobal("matchMedia", (media: string) => ({
    media,
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(async () => {
  cleanup();
  route.pathname = "/";
  // Radix restores focus on the next task after Testing Library unmounts.
  await new Promise((resolve) => setTimeout(resolve, 0));
  vi.unstubAllGlobals();
});

function open() {
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  return screen.getByRole("dialog", { name: "Site navigation" });
}

it("L02-B01: preserves the grouped content only in the open named modal", () => {
  render(<MobileNavigation />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  expect(trigger).toHaveAttribute("type", "button");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  const dialog = open();
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  const nav = within(dialog).getByRole("navigation", {
    name: "Primary navigation",
  });
  expect(
    within(nav)
      .getAllByRole("heading")
      .map((node) => node.textContent),
  ).toEqual(navigation.map((group) => group.label));
  expect(within(nav).getByRole("button", { name: "Training" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  for (const group of navigation) {
    const trigger = within(nav).getByRole("button", { name: group.label });
    if (trigger.getAttribute("aria-expanded") !== "true")
      fireEvent.click(trigger);
    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => ({
          label: link.textContent,
          href: new URL(
            link.getAttribute("href")!,
            "https://example.invalid",
          ).pathname.replace(/\/$/, ""),
        })),
    ).toEqual(group.links);
    expect(
      within(nav)
        .getAllByRole("button")
        .filter((button) => button.getAttribute("aria-expanded") === "true"),
    ).toHaveLength(1);
  }
  expect(dialog).toHaveAttribute("data-surface", "charcoal");
  expect(
    within(dialog).getByRole("link", { name: "Crossfit Gym home" }),
  ).toHaveAttribute("href", "/");
  expect(
    within(dialog)
      .getByRole("link", { name: "Contact the gym" })
      .getAttribute("href"),
  ).toMatch(/^\/contact\/?$/);
  expect(within(dialog).queryByRole("menubar")).not.toBeInTheDocument();
});

it.each([
  ["/membership/", "Membership", "page"],
  ["/products/whey-protein-powder/", "Products", "location"],
  ["/contact/", "Contact", "page"],
  ["/contact/details?topic=visit#main", "Contact", "location"],
])(
  "L02-B02: precise current destination for %s",
  (pathname, label, current) => {
    route.pathname = pathname;
    render(<MobileNavigation />);
    const dialog = open();
    expect(within(dialog).getByRole("link", { name: label })).toHaveAttribute(
      "aria-current",
      current,
    );
    expect(dialog.querySelectorAll("[aria-current]")).toHaveLength(1);
  },
);

it.each(["/programs-archive", "/missing", "/", null])(
  "L02-B02: no invented current link for %s",
  (pathname) => {
    route.pathname = pathname;
    render(<MobileNavigation />);
    expect(open().querySelectorAll("[aria-current]")).toHaveLength(0);
  },
);

it("L02-B03: close restores trigger focus and removes links", async () => {
  render(<MobileNavigation />);
  open();
  const close = screen.getByRole("button", { name: "Close menu" });
  await waitFor(() => expect(close).toHaveFocus());
  fireEvent.click(close);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus(),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryAllByRole("link")).toHaveLength(0);
});

it("L02-B03: modified selection remains open; ordinary selection closes", () => {
  render(<MobileNavigation />);
  open();
  fireEvent.click(screen.getByRole("button", { name: "Visit us" }));
  const link = screen.getByRole("link", { name: "Contact" });
  document.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  fireEvent.click(link, { ctrlKey: true });
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  document.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  fireEvent.click(link);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("L02-B03: pathname changes close the menu and refresh current state", () => {
  const { rerender } = render(<MobileNavigation />);
  open();
  route.pathname = "/membership/";
  rerender(<MobileNavigation />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    within(open()).getByRole("link", { name: "Membership" }),
  ).toHaveAttribute("aria-current", "page");
});

it("resets to the current section on reopening and allows collapsing every group", () => {
  route.pathname = "/membership/";
  render(<MobileNavigation />);
  let dialog = open();
  fireEvent.click(within(dialog).getByRole("button", { name: "Explore" }));
  expect(
    within(dialog).getByRole("button", { name: "Training" }),
  ).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(within(dialog).getByRole("button", { name: "Explore" }));
  expect(
    within(dialog)
      .getByRole("navigation")
      .querySelectorAll('[aria-expanded="true"]'),
  ).toHaveLength(0);
  fireEvent.click(within(dialog).getByRole("button", { name: "Close menu" }));
  dialog = open();
  expect(
    within(dialog).getByRole("button", { name: "Training" }),
  ).toHaveAttribute("aria-expanded", "true");
});

it.each(["Crossfit Gym home", "Contact the gym", "Call 01323-275695"])(
  "ordinary %s activation closes the drawer",
  (name) => {
    render(<MobileNavigation />);
    const dialog = open();
    document.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.click(within(dialog).getByRole("link", { name }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  },
);
