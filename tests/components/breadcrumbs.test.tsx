import { render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

const nonSeparatorItems = (nav: HTMLElement) =>
  [...nav.querySelectorAll("li")].filter(
    (item) => item.getAttribute("data-slot") === "breadcrumb-item",
  );

it("S02-A01: presents a semantic breadcrumb landmark with ordered ancestor links and current text", () => {
  render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Programs", href: "/programs" },
        { label: "Content preview" },
      ]}
    />,
  );

  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  const list = within(nav).getByRole("list");
  expect(list.tagName).toBe("OL");
  expect(nonSeparatorItems(nav)).toHaveLength(3);
  expect(within(nav).getAllByRole("link")).toHaveLength(2);

  const current = within(nav).getByText("Content preview");
  expect(current).toHaveAttribute("aria-current", "page");
  expect(
    within(nav).queryByRole("link", { name: "Content preview" }),
  ).toBeNull();
});

it("S02-A01: renders the two-item Home > Programs trail", () => {
  render(
    <Breadcrumbs
      items={[{ label: "Home", href: "/" }, { label: "Programs" }]}
    />,
  );

  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(screen.getByText("Programs")).toHaveAttribute("aria-current", "page");
  expect(screen.queryByRole("link", { name: "Programs" })).toBeNull();
});

it("S02-A01: does not own headings, live regions, buttons or forms", () => {
  const { container } = render(
    <Breadcrumbs
      items={[{ label: "Home", href: "/" }, { label: "Programs" }]}
    />,
  );

  expect(
    container.querySelector(
      "h1, h2, h3, h4, h5, h6, [aria-live], button, form",
    ),
  ).toBeNull();
});

it("S02-A02: forwards supplied route destinations exactly", () => {
  render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations" },
        { label: "Uttara" },
      ]}
    />,
  );

  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute(
    "href",
    "/locations",
  );
});

it("S02-A02: forwards className to the navigation landmark", () => {
  render(
    <Breadcrumbs
      className="mb-6"
      items={[{ label: "Home", href: "/" }, { label: "About" }]}
    />,
  );

  expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveClass(
    "mb-6",
  );
});

it("S02-A03: renders one hidden presentational separator between entries", () => {
  const { container } = render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Content preview" },
      ]}
    />,
  );

  const separators = container.querySelectorAll(
    '[data-slot="breadcrumb-separator"]',
  );
  expect(separators).toHaveLength(2);
  separators.forEach((separator) => {
    expect(separator).toHaveAttribute("aria-hidden", "true");
    expect(separator).toHaveAttribute("role", "presentation");
  });
});

it("S02-A06: marks exactly one current page", () => {
  const { container } = render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Careers", href: "/careers" },
        { label: "Content preview" },
      ]}
    />,
  );

  const current = container.querySelectorAll('[aria-current="page"]');
  expect(current).toHaveLength(1);
  expect(current[0]).toHaveTextContent("Content preview");
});

it("S02-A06: renders an unlinked ancestor as plain text without aria-current", () => {
  const { container } = render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Supplements" },
        { label: "Content preview" },
      ]}
    />,
  );

  const ancestor = screen.getByText("Supplements");
  expect(ancestor).not.toHaveAttribute("aria-current");
  expect(ancestor.closest("a")).toBeNull();
  expect(screen.queryByRole("link", { name: "Supplements" })).toBeNull();
  expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
});

it("S02-A06: ignores an href supplied on the current (last) item", () => {
  render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Coaches", href: "/coaches" },
      ]}
    />,
  );

  expect(screen.queryByRole("link", { name: "Coaches" })).toBeNull();
  expect(screen.getByText("Coaches")).toHaveAttribute("aria-current", "page");
});

it("S02-A06: current page is not exposed as a disabled link", () => {
  render(
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />,
  );

  const current = screen.getByText("FAQ");
  expect(current).not.toHaveAttribute("role");
  expect(current).not.toHaveAttribute("aria-disabled");
});

it("S02-A06: renders nothing for an empty trail", () => {
  const { container } = render(<Breadcrumbs items={[]} />);

  expect(container).toBeEmptyDOMElement();
});

it("S02-A06: renders a single current entry without separators or links", () => {
  const { container } = render(<Breadcrumbs items={[{ label: "Gallery" }]} />);

  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  expect(nonSeparatorItems(nav)).toHaveLength(1);
  expect(within(nav).queryAllByRole("link")).toHaveLength(0);
  expect(
    container.querySelectorAll('[data-slot="breadcrumb-separator"]'),
  ).toHaveLength(0);
  expect(screen.getByText("Gallery")).toHaveAttribute("aria-current", "page");
});

it("S02-A06: renders duplicate labels without React key warnings", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});

  render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Programs", href: "/programs" },
        { label: "Programs" },
      ]}
    />,
  );

  expect(screen.getAllByText("Programs")).toHaveLength(2);
  expect(error).not.toHaveBeenCalled();
});

it("S02-A06: escapes markup-like labels as literal text", () => {
  const { container } = render(
    <Breadcrumbs
      items={[{ label: "Home", href: "/" }, { label: "<b>Terms</b>" }]}
    />,
  );

  expect(screen.getByText("<b>Terms</b>")).toBeInTheDocument();
  expect(container.querySelector("b")).toBeNull();
});
