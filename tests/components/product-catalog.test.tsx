import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ProductCatalog } from "@/features/products/product-catalog";
import { previewProducts } from "@/content/previews/products";
import { productCategories } from "@/content/product-categories";
import { productShopCopy } from "@/content/product-shop";

const route = vi.hoisted(() => ({ search: "" }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/products/",
  useSearchParams: () => new URLSearchParams(route.search),
}));
beforeEach(() => {
  route.search = "";
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => vi.unstubAllGlobals());

it("keeps category controls selected before a delayed URL commit and follows later Back navigation", () => {
  const catalog = (
    <ProductCatalog
      products={previewProducts}
      categories={productCategories}
      copy={productShopCopy}
      initialCategory="all"
      introduction={<h2>Shop All Products</h2>}
    />
  );
  const view = render(catalog);
  const sidebar = within(
    screen.getByRole("complementary", { name: "Product filters" }),
  );
  const supplements = sidebar.getByRole("radio", {
    name: "Supplements",
  });
  fireEvent.click(supplements);
  expect(supplements).toBeChecked();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Showing 1–4 of 4 products",
  );
  expect(window.location.search).toBe("?category=sports-nutrition");
  // The URL hook can commit after the native input's change event finishes.
  route.search = "category=sports-nutrition";
  view.rerender(
    <ProductCatalog
      products={previewProducts}
      categories={productCategories}
      copy={productShopCopy}
      initialCategory="all"
      introduction={<h2>Shop All Products</h2>}
    />,
  );
  expect(supplements).toBeChecked();
  route.search = "";
  view.rerender(
    <ProductCatalog
      products={previewProducts}
      categories={productCategories}
      copy={productShopCopy}
      initialCategory="all"
      introduction={<h2>Shop All Products</h2>}
    />,
  );
  expect(sidebar.getByRole("radio", { name: "All Products" })).toBeChecked();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Showing 1–9 of 10 products",
  );
});
