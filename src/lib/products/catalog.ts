import type { Product, ProductDetail } from "@/schemas/products";
import { products } from "@/content/products";
import { productDetails } from "@/content/product-details";
import { previewProducts } from "@/content/previews/products";
import { previewProductDetails } from "@/content/previews/product-details";
import { site } from "@/content/site";

export function validateProductDetails(
  records: readonly Product[],
  details: readonly ProductDetail[],
) {
  const byId = new Map(records.map((product) => [product.id, product]));
  const seen = new Set<string>();
  for (const detail of details) {
    const product = byId.get(detail.productId);
    if (!product || product.status !== detail.status)
      throw new Error(
        `Unknown or mismatched product detail: ${detail.productId}`,
      );
    if (seen.has(detail.productId))
      throw new Error(`Duplicate product detail: ${detail.productId}`);
    seen.add(detail.productId);
  }
  for (const product of records)
    if (!seen.has(product.id))
      throw new Error(`Missing product detail: ${product.id}`);
}
validateProductDetails(products, productDetails);
validateProductDetails(previewProducts, previewProductDetails);

export function visibleProducts() {
  return site.preview ? previewProducts : products;
}
export function findProductDetail(id: string) {
  const product = visibleProducts().find((item) => item.id === id);
  if (!product) return undefined;
  const detail = (site.preview ? previewProductDetails : productDetails).find(
    (item) => item.productId === id,
  )!;
  return { product, detail };
}
export function productDetailParams() {
  return [
    { slug: "content-preview" },
    ...visibleProducts().map((product) => ({ slug: product.id })),
  ];
}
export function relatedProducts(product: Product) {
  return visibleProducts()
    .filter(
      (item) =>
        item.id !== product.id && item.categoryId === product.categoryId,
    )
    .slice(0, 4);
}
