import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProductDetailPage } from "@/features/products/product-detail-page";
import { ProductStructurePreview } from "@/features/products/product-structure-preview";
import { findProductDetail } from "@/lib/products/catalog";

it("renders the complete master page with semantic sections, true links and honest missing data", () => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(
    <ProductDetailPage {...findProductDetail("whey-protein-powder")!} />,
  );
  expect(root.querySelectorAll("h1")).toHaveLength(1);
  expect(root.querySelector("h1")).toHaveTextContent("Whey Protein Powder");
  expect(root.querySelector('[role="note"]')).toHaveTextContent(
    "Illustrative product detail preview",
  );
  expect(root.querySelector("[data-product-description]")).toHaveAttribute(
    "open",
  );
  expect(root.querySelectorAll(".product-specifications dd")).toHaveLength(5);
  root
    .querySelectorAll(".product-specifications dd")
    .forEach((row) => expect(row).toHaveTextContent("To be confirmed"));
  expect(root.querySelectorAll("[data-product-card]")).toHaveLength(3);
  expect(root).toHaveTextContent(
    "Approved product reviews have not been supplied",
  );
  expect(
    root.querySelector('a[href="/contact"],a[href="/contact/"]'),
  ).not.toBeNull();
  expect(root.querySelector('a[href="tel:+8801323275695"]')).not.toBeNull();
  expect(root.querySelectorAll("img,input,form,button,script")).toHaveLength(0);
  expect(root).not.toHaveTextContent("[Brand Name]");
  expect(root).not.toHaveTextContent("Add to Bag");
});

it("keeps the structure preview neutral instead of making a sample catalog record", () => {
  const html = renderToStaticMarkup(<ProductStructurePreview />);
  expect(html).toContain("Product details");
  expect(html).toContain("does not represent an actual product");
  expect(html).not.toContain("Whey Protein");
  expect(html).not.toContain("data-product-card");
});
