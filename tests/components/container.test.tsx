import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Container } from "@/components/shared/container";

it("S03-A01: preserves child order and native attributes without adding semantics or content", () => {
  const { container } = render(
    <Container id="content-wrapper" data-owner="specimen" lang="en" dir="rtl">
      <p>First content</p>
      <p>Second content</p>
    </Container>,
  );
  const first = screen.getByText("First content");
  const wrapper = first.parentElement!;
  expect(wrapper.tagName).toBe("DIV");
  expect(container.children).toHaveLength(1);
  expect([...wrapper.children].map((node) => node.textContent)).toEqual([
    "First content",
    "Second content",
  ]);
  expect(wrapper).toHaveAttribute("id", "content-wrapper");
  expect(wrapper).toHaveAttribute("data-owner", "specimen");
  expect(wrapper).toHaveAttribute("lang", "en");
  expect(wrapper).toHaveAttribute("dir", "rtl");
  expect(wrapper).not.toHaveAttribute("role");
  expect(wrapper).not.toHaveAttribute("tabindex");
  expect(wrapper).not.toHaveAttribute("aria-live");
  expect(
    wrapper.querySelector("h1, main, section, header, footer, button, a"),
  ).toBeNull();
});

it("S03-A01: forwards the React 19 div ref and consumer layout classes", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Container
      ref={ref}
      className="grid gap-4 py-4"
      title="Consumer-owned wrapper"
    >
      <p>Ref content</p>
    </Container>,
  );
  expect(ref.current).toBe(screen.getByText("Ref content").parentElement);
  expect(ref.current).toHaveClass("grid", "gap-4", "py-4");
  expect(ref.current).toHaveAttribute("title", "Consumer-owned wrapper");
});
