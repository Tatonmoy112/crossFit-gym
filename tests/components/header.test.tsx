import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/header";
import { navigation } from "@/content/navigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/programs/" }));
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
  await new Promise((resolve) => setTimeout(resolve, 0));
  vi.unstubAllGlobals();
});

it("L01-B01: banner composes the real brand and navigation without taking page heading ownership", () => {
  render(<Header />);
  const banner = screen.getByRole("banner");
  expect(screen.getAllByRole("banner")).toHaveLength(1);
  expect(banner).toHaveAttribute("data-surface", "charcoal");
  expect(
    within(banner).getByRole("link", { name: "Crossfit Gym home" }),
  ).toHaveAttribute("href", "/");
  expect(within(banner).getByRole("presentation")).toHaveAttribute("alt", "");
  expect(within(banner).queryAllByRole("heading")).toHaveLength(0);
});

it("L01-B01: reuses the four desktop groups and closed mobile control", () => {
  render(<Header />);
  const banner = screen.getByRole("banner");
  // JSDOM does not apply CSS breakpoints; actual visibility is a browser contract.
  const desktop = within(banner).getByRole("navigation", {
    name: "Primary navigation",
  });
  expect(
    within(desktop)
      .getAllByRole("button")
      .map((node) => node.textContent),
  ).toEqual(navigation.map((group) => group.label));
  expect(within(banner).getByRole("button", { name: "Menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
