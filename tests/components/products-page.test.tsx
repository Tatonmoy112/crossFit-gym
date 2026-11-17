import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { ProductsPage } from "@/features/products/products-page";
import { ProductCatalogFallback } from "@/features/products/product-catalog-fallback";
import { previewProducts } from "@/content/previews/products";
import { productCategories } from "@/content/product-categories";
import { productShopCopy } from "@/content/product-shop";
import type { Product } from "@/schemas/products";

const flags = vi.hoisted(() => ({ preview: true }));
vi.mock("@/content/site", async () => {
  const actual =
    await vi.importActual<typeof import("@/content/site")>("@/content/site");
  return {
    ...actual,
    site: {
      ...actual.site,
      get preview() {
        return flags.preview;
      },
    },
  };
});
vi.mock("@/features/products/product-catalog", () => ({
  ProductCatalog: ({
    products,
    introduction,
  }: {
    products: Product[];
    introduction: React.ReactNode;
  }) => (
    <>
      {introduction}
      <div data-client-products={products.length}>
        {products.map((product) => (
          <p key={product.id}>{product.name}</p>
        ))}
      </div>
    </>
  ),
}));
afterEach(() => {
  flags.preview = true;
});

it("composes the Products heading, breadcrumb, supplied introduction and explicit preview content", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(<ProductsPage />);
  expect(root.querySelectorAll("h1")).toHaveLength(1);
  expect(root.querySelector("h1")).toHaveTextContent(productShopCopy.heading);
  expect(root.querySelector('[role="note"]')).toHaveTextContent(
    productShopCopy.previewNotice,
  );
  expect(root.querySelector("[data-client-products]")).toHaveAttribute(
    "data-client-products",
    "10",
  );
  expect(root.querySelector('[aria-current="page"]')).toHaveTextContent(
    "Products",
  );
});

it("omits all examples and interactive product data when site preview is disabled", () => {
  flags.preview = false;
  const html = renderToStaticMarkup(<ProductsPage />);
  expect(html).toContain(productShopCopy.emptyTitle);
  expect(html).not.toContain("data-client-products");
  expect(html).not.toContain(productShopCopy.previewNotice);
  for (const product of previewProducts)
    expect(html).not.toContain(product.name);
});

it("keeps every example readable without enhancement and limits the legacy fallback to Supplements", () => {
  const root = document.createElement("div");
  const props = {
    products: previewProducts,
    categories: productCategories,
    copy: productShopCopy,
    introduction: <p>Introduction</p>,
  };
  root.innerHTML = renderToStaticMarkup(
    <ProductCatalogFallback {...props} initialCategory="all" />,
  );
  expect(root.querySelectorAll("[data-product-card]")).toHaveLength(10);
  expect(root.querySelectorAll("button,input,select,img")).toHaveLength(0);
  expect(
    root.querySelectorAll('a[href="/contact"],a[href="/contact/"]'),
  ).toHaveLength(1);
  expect(root.querySelector('a[href^="tel:"]')).toHaveAttribute(
    "href",
    "tel:+8801323275695",
  );
  root.innerHTML = renderToStaticMarkup(
    <ProductCatalogFallback {...props} initialCategory="sports-nutrition" />,
  );
  expect(root.querySelectorAll("[data-product-card]")).toHaveLength(4);
});
