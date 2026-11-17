import { productCategoryIds, type ProductCategoryId } from "@/config/products";
import type { Product } from "@/schemas/products";

export type ProductSort = "featured" | "name-asc" | "name-desc";
export type ProductFilters = {
  q: string;
  category: ProductCategoryId | "all";
  sort: ProductSort;
};

export function readProductFilters(
  params: Pick<URLSearchParams, "get">,
  initialCategory: ProductCategoryId | "all" = "all",
): ProductFilters {
  const category = params.get("category");
  const sort = params.get("sort");
  return {
    q: (params.get("q") ?? "").trim(),
    category:
      category === null
        ? initialCategory
        : (productCategoryIds.find((id) => id === category) ?? "all"),
    sort: sort === "name-asc" || sort === "name-desc" ? sort : "featured",
  };
}

export function filterProducts(
  products: readonly Product[],
  filters: ProductFilters,
) {
  const query = filters.q.toLocaleLowerCase("en");
  const matches = products.filter(
    (product) =>
      (filters.category === "all" || product.categoryId === filters.category) &&
      (!query ||
        `${product.name} ${product.summary}`
          .toLocaleLowerCase("en")
          .includes(query)),
  );
  if (filters.sort !== "featured")
    matches.sort(
      (a, b) =>
        a.name.localeCompare(b.name, "en") *
        (filters.sort === "name-desc" ? -1 : 1),
    );
  return matches;
}

export function productFiltersHref(filters: ProductFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  const query = params.toString();
  return `/products/${query ? `?${query}` : ""}`;
}
