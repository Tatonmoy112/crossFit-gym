import { expect, it } from "vitest";
import { previewProducts } from "@/content/previews/products";
import { products } from "@/content/products";
import { supplements } from "@/content/supplements";
import { productCategories } from "@/content/product-categories";
import { productSchema, productsSchema } from "@/schemas/products";
import {
  filterProducts,
  productFiltersHref,
  readProductFilters,
} from "@/lib/products/discovery";
import {
  isProductListingHref,
  productCategoryHref,
} from "@/lib/products/links";
import { normalizeNavigationPath } from "@/lib/navigation";

it("keeps ten supplied examples separate from real products and unsupported category claims", () => {
  expect(products).toEqual([]);
  expect(supplements).toEqual([]);
  expect(previewProducts).toHaveLength(10);
  expect(previewProducts.map((product) => product.name)).toEqual([
    "Whey Protein Powder",
    "Creatine Monohydrate",
    "Pre-Workout Formula",
    "Mass Gainer Powder",
    "Adjustable Dumbbell Set",
    "Resistance Bands Set",
    "Training Gloves",
    "Lifting Straps",
    "Protein Shaker Bottle",
    "Exercise Training Mat",
  ]);
  expect(
    previewProducts.every(
      (product) =>
        product.status === "preview" &&
        product.price === null &&
        product.images.length === 0,
    ),
  ).toBe(true);
  expect(
    productCategories.map(
      (category) =>
        previewProducts.filter((product) => product.categoryId === category.id)
          .length,
    ),
  ).toEqual([4, 2, 4, 0]);
});

it.each([
  [
    "duplicate products",
    () =>
      productsSchema.safeParse([previewProducts[0], previewProducts[0]])
        .success,
  ],
  [
    "unknown category",
    () =>
      productSchema.safeParse({ ...previewProducts[0], categoryId: "footwear" })
        .success,
  ],
  [
    "blank name",
    () => productSchema.safeParse({ ...previewProducts[0], name: " " }).success,
  ],
  [
    "negative price",
    () => productSchema.safeParse({ ...previewProducts[0], price: -1 }).success,
  ],
  [
    "remote photograph",
    () =>
      productSchema.safeParse({
        ...previewProducts[0],
        images: [
          {
            src: "https://example.com/photo.jpg",
            alt: "Product",
            width: 300,
            height: 400,
          },
        ],
      }).success,
  ],
])("rejects %s", (_name, parse) => expect(parse()).toBe(false));

it("reads category links, ignores invalid discovery values and supports the legacy default", () => {
  expect(readProductFilters(new URLSearchParams())).toEqual({
    q: "",
    category: "all",
    sort: "featured",
  });
  expect(
    readProductFilters(new URLSearchParams(), "sports-nutrition").category,
  ).toBe("sports-nutrition");
  expect(
    readProductFilters(
      new URLSearchParams("q= bands &category=unknown&sort=price"),
    ),
  ).toEqual({ q: "bands", category: "all", sort: "featured" });
  const filters = {
    q: "protein & recovery",
    category: "sports-nutrition",
    sort: "name-desc",
  } as const;
  expect(
    readProductFilters(
      new URL(productFiltersHref(filters), "https://example.invalid")
        .searchParams,
    ),
  ).toEqual(filters);
});

it("combines search and category, keeps featured order and sorts without mutating the input", () => {
  const original = [...previewProducts];
  expect(
    filterProducts(previewProducts, {
      q: "PROTEIN",
      category: "sports-nutrition",
      sort: "featured",
    }).map((product) => product.id),
  ).toEqual(["whey-protein-powder", "mass-gainer-powder"]);
  expect(
    filterProducts(previewProducts, {
      q: "",
      category: "fitness-apparel",
      sort: "featured",
    }),
  ).toEqual([]);
  const sorted = filterProducts(previewProducts, {
    q: "",
    category: "all",
    sort: "name-asc",
  });
  expect(sorted[0].name).toBe("Adjustable Dumbbell Set");
  expect(
    filterProducts(previewProducts, {
      q: "",
      category: "all",
      sort: "name-desc",
    })[0].name,
  ).toBe("Whey Protein Powder");
  expect(previewProducts).toEqual(original);
});

it("restricts homepage product destinations and highlights Products for legacy supplement paths", () => {
  for (const category of productCategories)
    expect(isProductListingHref(productCategoryHref(category.id))).toBe(true);
  expect(isProductListingHref("/products/")).toBe(true);
  for (const href of [
    "/products/?category=unknown",
    "/products/?category=sports-nutrition&redirect=https://example.com",
    "https://example.com/products/",
    "/contact/",
  ])
    expect(isProductListingHref(href)).toBe(false);
  expect(normalizeNavigationPath("/supplements/")).toBe("/products");
  expect(normalizeNavigationPath("/supplements/content-preview/")).toBe(
    "/products",
  );
  expect(normalizeNavigationPath("/supplements-extra/")).toBe(
    "/supplements-extra",
  );
});
