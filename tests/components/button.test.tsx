import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";

it("defaults to a non-submitting native action inside a form", () => {
  const activate = vi.fn();
  const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <Button onClick={activate}>Action specimen</Button>
    </form>,
  );
  const button = screen.getByRole("button", { name: "Action specimen" });
  expect(button).toHaveAttribute("type", "button");
  fireEvent.click(button);
  expect(activate).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
});

it.each(["submit", "reset"] as const)(
  "preserves explicit native %s behavior",
  (type) => {
    const event = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={event} onReset={event}>
        <Button type={type}>{type} specimen</Button>
      </form>,
    );
    const button = screen.getByRole("button", { name: `${type} specimen` });
    expect(button).toHaveAttribute("type", type);
    fireEvent.click(button);
    expect(event).toHaveBeenCalledOnce();
  },
);

it("keeps an unavailable action natively disabled and prevents activation", () => {
  const activate = vi.fn();
  render(
    <Button disabled onClick={activate}>
      Unavailable specimen
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Unavailable specimen" });
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(activate).not.toHaveBeenCalled();
});

it("forwards a React 19 ref and caller-supplied accessible state and attributes", () => {
  const ref = React.createRef<HTMLButtonElement>();
  const activate = vi.fn();
  render(
    <Button
      ref={ref}
      aria-label="Open specimen"
      aria-expanded="false"
      aria-controls="specimen-panel"
      data-purpose="fixture"
      onClick={activate}
    >
      <svg aria-hidden="true">
        <path d="M0 0h10" />
      </svg>
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Open specimen" });
  expect(ref.current).toBe(button);
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(button).toHaveAttribute("aria-controls", "specimen-panel");
  expect(button).toHaveAttribute("data-purpose", "fixture");
  fireEvent.click(button);
  expect(activate).toHaveBeenCalledOnce();
});

it("preserves slotted element semantics without injecting a button type", () => {
  render(
    <Button asChild>
      <a href="#specimen">Slotted specimen</a>
    </Button>,
  );
  const link = screen.getByRole("link", { name: "Slotted specimen" });
  expect(link).toHaveAttribute("href", "#specimen");
  expect(link).not.toHaveAttribute("type");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
