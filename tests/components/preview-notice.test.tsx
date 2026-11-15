import { render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PreviewNotice } from "@/components/shared/preview-notice";

const configuration = vi.hoisted(() => ({ preview: true }));
vi.mock("@/content/site", () => ({
  site: {
    get preview() {
      return configuration.preview;
    },
  },
}));
afterEach(() => {
  configuration.preview = true;
  vi.unstubAllEnvs();
});

it("S01-A01/A02: preview renders one accurately named static note without taking focus or heading ownership", () => {
  render(<PreviewNotice />);
  const note = screen.getByRole("note", { name: "Website preview" });
  expect(screen.getAllByRole("note")).toHaveLength(1);
  expect(within(note).getByText("Website preview")).toBeInTheDocument();
  expect(
    within(note).getByText(
      "This website is being rebuilt. Content is incomplete and awaiting approval.",
    ),
  ).toBeInTheDocument();
  expect(
    note.querySelector("h1, h2, button, a, input, [tabindex], [aria-live]"),
  ).toBeNull();
  expect(note).not.toHaveAttribute("aria-live");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("S01-A01/A04: preview off renders nothing even with indexing still disabled", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_INDEXABLE", "false");
  configuration.preview = false;
  const { container } = render(<PreviewNotice />);
  expect(container).toBeEmptyDOMElement();
});

it("S01-A01: configuration changes are reflected on the next server render without local dismissal state", () => {
  const { rerender } = render(<PreviewNotice />);
  expect(screen.getByRole("note")).toBeInTheDocument();
  configuration.preview = false;
  rerender(<PreviewNotice />);
  expect(screen.queryByRole("note")).not.toBeInTheDocument();
  configuration.preview = true;
  rerender(<PreviewNotice />);
  expect(screen.getByRole("note")).toHaveAccessibleName("Website preview");
});
