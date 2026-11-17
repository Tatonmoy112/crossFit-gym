import { productCategoryIds, type ProductCategoryId } from "@/config/products";

export function productDetailHref(id: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id === "content-preview")
    throw new TypeError("Use a validated product ID.");
  return `/products/${id}/`;
}

export function productCategoryHref(category: ProductCategoryId) {
  return `/products/?category=${category}`;
}

export function isProductListingHref(href: string) {
  return (
    href === "/products/" ||
    productCategoryIds.some(
      (category) => href === productCategoryHref(category),
    )
  );
}
