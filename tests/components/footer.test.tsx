import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { Footer } from "@/components/layout/footer";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";

it("L03-A01: footer owns its landmark and exposes all original groups and destinations", () => {
  render(<Footer />);
  const footer = screen.getByRole("contentinfo");
  expect(footer).toHaveAttribute("data-surface", "charcoal");
  expect(
    within(footer).getByRole("link", { name: "Crossfit Gym home" }),
  ).toHaveAttribute("href", "/");
  const nav = within(footer).getByRole("navigation", {
    name: "Footer navigation",
  });
  expect(
    within(nav)
      .getAllByRole("heading", { level: 2 })
      .map((node) => node.textContent),
  ).toEqual(navigation.map((group) => group.label));
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
  ).toEqual(navigation.flatMap((group) => group.links));
  expect(
    within(footer).queryByRole("heading", { level: 1 }),
  ).not.toBeInTheDocument();
  expect(within(footer).queryByRole("button")).not.toBeInTheDocument();
});

it("L03-A02: supplied contacts and social links stay native and missing hours stay explicit", () => {
  render(<Footer />);
  const footer = screen.getByRole("contentinfo");
  expect(footer.querySelector("address")).toHaveTextContent(site.address);
  for (const [label, href] of [
    [site.phone, `tel:${site.telephone}`],
    ["Get directions", site.directions],
    ["Facebook", site.facebook],
    ["Instagram", site.instagram],
  ]) {
    const link = within(footer).getByRole("link", { name: label });
    expect(link).toHaveAttribute("href", href);
    expect(link).not.toHaveAttribute("target");
  }
  expect(
    within(footer).getByText(
      "Opening hours have not been supplied. Call to confirm.",
    ),
  ).toBeInTheDocument();
  expect(footer.querySelector("form, input, [href^='mailto:']")).toBeNull();
});

it("L03-A03: legal routes are discoverable with an explicit approval limitation", () => {
  render(<Footer />);
  const legal = screen.getByRole("navigation", { name: "Legal" });
  expect(within(legal).getAllByRole("link")).toHaveLength(2);
  expect(within(legal).getByRole("link", { name: "Privacy" })).toHaveAttribute(
    "href",
    expect.stringMatching(/^\/privacy\/?$/),
  );
  expect(within(legal).getByRole("link", { name: "Terms" })).toHaveAttribute(
    "href",
    expect.stringMatching(/^\/terms\/?$/),
  );
  expect(
    screen.getByText("Legal text is awaiting approval."),
  ).toBeInTheDocument();
});
