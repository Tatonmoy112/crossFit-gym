import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { Footer } from "@/components/layout/footer";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";
import { footerContent } from "@/content/footer";

it("L03-A01: footer owns its landmark and exposes all original groups and destinations", () => {
  render(<Footer />);
  const footer = screen.getByRole("contentinfo");
  expect(footer).toHaveAttribute("data-surface", "light");
  expect(
    within(footer).getByRole("link", { name: "Crossfit Gym home" }),
  ).toHaveAttribute("href", "/");
  const logo = within(footer)
    .getByRole("link", { name: "Crossfit Gym home" })
    .querySelector("img");
  expect(logo).toHaveAttribute("src", "/images/brand/logo_without-bg.png");
  expect(logo).toHaveAttribute("width", "1254");
  expect(logo).toHaveAttribute("height", "1254");
  expect(logo).toHaveAttribute("alt", "");
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
  expect(
    nav.querySelectorAll("details, summary, button, [data-dropdown-panel]"),
  ).toHaveLength(0);
  expect(within(nav).getAllByRole("link")).toHaveLength(14);
});

it("L03-B: server-composes the approved CTA, light panel and decorative wordmark", () => {
  render(<Footer />);
  const footer = screen.getByRole("contentinfo");
  const cta = within(footer).getByRole("region", {
    name: footerContent.cta.heading,
  });
  expect(cta).toHaveAttribute("data-surface", "charcoal");
  expect(cta).toHaveTextContent(footerContent.cta.description);
  const action = within(cta).getByRole("link", {
    name: "Start your journey",
  });
  expect(action.getAttribute("href")).toMatch(/^\/contact\/?$/);
  expect(within(footer).getAllByRole("link")[0]).toBe(action);
  expect(footer.querySelectorAll(".layout-container")).toHaveLength(2);
  expect(footer.querySelector(".footer-panel")).toHaveAttribute(
    "data-slot",
    "card",
  );
  expect(within(footer).getByText(site.tagline)).toBeInTheDocument();
  const wordmark = footer.querySelector(".footer-wordmark-frame")!;
  expect(wordmark).toHaveAttribute("aria-hidden", "true");
  expect(wordmark).toHaveAttribute("inert");
  expect(wordmark).toHaveTextContent("CROSSFIT GYM");
  expect(wordmark.querySelector("a,button,[tabindex]")).toBeNull();
  expect(footer.querySelectorAll("a")).toHaveLength(20);
  expect(footer.textContent).not.toMatch(
    /Nexiron|Nexion|copyright|all rights reserved|newsletter|©/i,
  );
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

it("L03-A03: unwritten legal routes stay hidden with an explicit approval limitation", () => {
  render(<Footer />);
  expect(
    screen.queryByRole("navigation", { name: "Legal" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /^(Privacy|Terms)$/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("Legal text is awaiting approval."),
  ).toBeInTheDocument();
});
