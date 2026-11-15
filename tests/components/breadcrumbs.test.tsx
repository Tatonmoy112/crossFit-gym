import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

it("S02-A01: presents a semantic breadcrumb navigation landmark and ordered list", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Programs", href: "/programs" },
    { label: "CrossFit Core" },
  ];

  render(<Breadcrumbs items={items} />);

  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  expect(nav).toBeInTheDocument();

  const list = within(nav).getByRole("list");
  expect(list.tagName).toBe("OL");

  const listItems = within(list).getAllByRole("listitem");
  expect(listItems.length).toBeGreaterThanOrEqual(3);

  const homeLink = within(nav).getByRole("link", { name: "Home" });
  expect(homeLink).toHaveAttribute("href", "/");

  const programsLink = within(nav).getByRole("link", { name: "Programs" });
  expect(programsLink).toHaveAttribute("href", "/programs");

  const currentPage = within(nav).getByText("CrossFit Core");
  expect(currentPage).toHaveAttribute("aria-current", "page");
  expect(within(nav).queryByRole("link", { name: "CrossFit Core" })).toBeNull();
});

it("S02-A01: does not own page headings or live regions", () => {
  const { container } = render(
    <Breadcrumbs
      items={[{ label: "Home", href: "/" }, { label: "Programs" }]}
    />,
  );

  expect(
    container.querySelector("h1, h2, h3, [aria-live], button, form"),
  ).toBeNull();
});

it("S02-A02: handles two-item breadcrumb trail for interior listing pages", () => {
  render(
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />,
  );

  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  const current = screen.getByText("About");
  expect(current).toHaveAttribute("aria-current", "page");
  expect(screen.queryByRole("link", { name: "About" })).toBeNull();
});

it("S02-A03: marks separators as presentation / aria-hidden", () => {
  const { container } = render(
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Training", href: "/training" },
        { label: "Schedule" },
      ]}
    />,
  );

  const separators = container.querySelectorAll(
    '[data-slot="breadcrumb-separator"]',
  );
  expect(separators.length).toBe(2);
  separators.forEach((sep) => {
    expect(sep).toHaveAttribute("aria-hidden", "true");
  });
});
