import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ProductShare } from "@/features/products/product-share";

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);
const originalShare = Object.getOwnPropertyDescriptor(navigator, "share");
function setClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}
afterEach(() => {
  if (originalClipboard)
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
  if (originalShare) Object.defineProperty(navigator, "share", originalShare);
  else Reflect.deleteProperty(navigator, "share");
});
it("confirms a copied link only when the clipboard promise resolves", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setClipboard(writeText);
  render(<ProductShare name="Fixture product" />);
  fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Link copied."),
  );
  expect(writeText).toHaveBeenCalledWith(window.location.href);
});

it("exposes a selectable manual address after clipboard failure", async () => {
  setClipboard(vi.fn().mockRejectedValue(new Error("Unavailable")));
  render(<ProductShare name="Fixture product" />);
  fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
  expect(
    await screen.findByRole("textbox", { name: "Page address" }),
  ).toHaveValue(window.location.href);
  expect(screen.getByRole("status")).not.toHaveTextContent("Link copied.");
  fireEvent.click(screen.getByRole("button", { name: "Select link" }));
  expect(screen.getByRole("textbox", { name: "Page address" })).toHaveFocus();
});

it("does not claim success after canceled sharing and reports completed native sharing", async () => {
  const share = vi
    .fn()
    .mockRejectedValueOnce(new DOMException("Canceled", "AbortError"))
    .mockResolvedValueOnce(undefined);
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: share,
  });
  render(<ProductShare name="Fixture product" />);
  fireEvent.click(screen.getByRole("button", { name: "Share" }));
  await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
  expect(screen.getByRole("status")).not.toHaveTextContent(
    "Sharing completed.",
  );
  fireEvent.click(screen.getByRole("button", { name: "Share" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Sharing completed."),
  );
  expect(share).toHaveBeenLastCalledWith({
    title: "Fixture product",
    url: window.location.href,
  });
});
