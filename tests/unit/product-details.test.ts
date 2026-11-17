import { afterEach, expect, it, vi } from "vitest";
import { previewProducts } from "@/content/previews/products";
import { previewProductDetails } from "@/content/previews/product-details";
import { productSchema, productDetailSchema } from "@/schemas/products";
import {
  findProductDetail,
  productDetailParams,
  relatedProducts,
  validateProductDetails,
} from "@/lib/products/catalog";
import { productDetailHref } from "@/lib/products/links";

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
afterEach(() => {
  flags.preview = true;
});

it("matches every supplied example to its exact detailed copy and missing manufacturer fields", () => {
  expect(previewProductDetails.map((item) => item.productId)).toEqual(
    previewProducts.map((item) => item.id),
  );
  expect(() =>
    validateProductDetails(previewProducts, previewProductDetails),
  ).not.toThrow();
  const whey = findProductDetail("whey-protein-powder")!;
  expect(whey.detail.headline).toBe(
    "Fuel Your Recovery. Support Your Progress.",
  );
  expect(whey.detail.description).toHaveLength(2);
  expect(whey.detail.specifications.map((row) => row.label)).toEqual([
    "Brand",
    "Flavor",
    "Net Weight",
    "Protein per Serving",
    "Ingredients & Allergens",
  ]);
  expect(
    previewProductDetails.every((detail) =>
      detail.specifications.every((row) => row.value === null),
    ),
  ).toBe(true);
  expect(
    findProductDetail("resistance-bands-set")?.detail.guidance?.heading,
  ).toBe("Suggested Exercises");
  expect(findProductDetail("training-gloves")?.detail.guidance).toBeNull();
});

it.each([
  [
    "missing",
    () =>
      validateProductDetails(previewProducts, previewProductDetails.slice(1)),
  ],
  [
    "orphan",
    () =>
      validateProductDetails(previewProducts, [
        { ...previewProductDetails[0], productId: "missing-product" },
        ...previewProductDetails.slice(1),
      ]),
  ],
  [
    "duplicate",
    () =>
      validateProductDetails(previewProducts, [
        ...previewProductDetails,
        previewProductDetails[0],
      ]),
  ],
  [
    "approval mismatch",
    () =>
      validateProductDetails(previewProducts, [
        { ...previewProductDetails[0], status: "approved" },
        ...previewProductDetails.slice(1),
      ]),
  ],
])("rejects %s detail relationships", (_name, validate) =>
  expect(validate).toThrow(),
);

it("rejects reserved IDs, blank copy and repeated specification labels", () => {
  expect(
    productSchema.safeParse({ ...previewProducts[0], id: "content-preview" })
      .success,
  ).toBe(false);
  expect(
    productDetailSchema.safeParse({
      ...previewProductDetails[0],
      headline: " ",
    }).success,
  ).toBe(false);
  expect(
    productDetailSchema.safeParse({
      ...previewProductDetails[0],
      specifications: [
        previewProductDetails[0].specifications[0],
        previewProductDetails[0].specifications[0],
      ],
    }).success,
  ).toBe(false);
  expect(() => productDetailHref("../private")).toThrow();
  expect(() => productDetailHref("content-preview")).toThrow();
});

it("provides ten separate paths plus a neutral export path and reserves unknown IDs for 404", () => {
  expect(productDetailParams()).toHaveLength(11);
  expect(productDetailParams()[0]).toEqual({ slug: "content-preview" });
  expect(productDetailHref(previewProducts[0].id)).toBe(
    "/products/whey-protein-powder/",
  );
  expect(findProductDetail("missing-product")).toBeUndefined();
  expect(findProductDetail("content-preview")).toBeUndefined();
});

it("keeps only the neutral path with no sample records outside preview", () => {
  flags.preview = false;
  expect(productDetailParams()).toEqual([{ slug: "content-preview" }]);
  for (const product of previewProducts)
    expect(findProductDetail(product.id)).toBeUndefined();
});

it("selects other products only from the same category without inventing related items", () => {
  expect(relatedProducts(previewProducts[0]).map((item) => item.id)).toEqual([
    "creatine-monohydrate",
    "pre-workout-formula",
    "mass-gainer-powder",
  ]);
  expect(relatedProducts(previewProducts[4]).map((item) => item.id)).toEqual([
    "resistance-bands-set",
  ]);
});
