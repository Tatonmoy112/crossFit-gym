import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { BrandLink } from "@/components/layout/brand-link";
import { site } from "@/content/site";

it("L01-A01: presents the real visible identity as a single Home link", () => {
  render(<BrandLink />);
  const link = screen.getByRole("link", {
    name: `${site.name} home`,
  });
  expect(link).toHaveAttribute("href", "/");
  expect(link).toHaveTextContent(site.name);
  expect(screen.getAllByRole("link")).toHaveLength(1);
  expect(link).not.toHaveAttribute("target");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  expect(screen.queryByRole("banner")).not.toBeInTheDocument();
});

it("L01-A02: reserves a local square image while naming the link only once", () => {
  const { container } = render(<BrandLink />);
  const image = container.querySelector("img");
  expect(image).toHaveAttribute("src", "/images/brand/brand-mark.webp");
  expect(image).toHaveAttribute("alt", "");
  expect(image).toHaveAttribute("width", "192");
  expect(image).toHaveAttribute("height", "192");
  expect(image).toHaveAttribute("loading", "eager");
  expect(image).toHaveAttribute("decoding", "async");
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText(site.name, { exact: true })).toBeVisible();
});
