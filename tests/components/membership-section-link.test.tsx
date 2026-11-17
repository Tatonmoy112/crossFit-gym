import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { MembershipSectionLink } from "@/features/membership/membership-section-link";

it("focuses the section and records one URL entry without duplicate repeated activation", () => {
  const scroll = vi.fn();
  const { container } = render(
    <>
      <MembershipSectionLink href="#membership-plans">
        Explore Memberships
      </MembershipSectionLink>
      <section id="membership-plans" tabIndex={-1}>
        Fixture target
      </section>
    </>,
  );
  const target = container.querySelector("section")!;
  target.scrollIntoView = scroll;
  const push = vi.spyOn(window.history, "pushState");
  fireEvent.click(screen.getByRole("link"));
  expect(window.location.hash).toBe("#membership-plans");
  expect(target).toHaveFocus();
  expect(scroll).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
  fireEvent.click(screen.getByRole("link"));
  expect(push).toHaveBeenCalledTimes(1);
});
