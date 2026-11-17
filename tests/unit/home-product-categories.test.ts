import { expect, it } from "vitest";
import { homeProductCategoriesPreview as content } from "@/content/previews/home-product-categories";
import { supplements } from "@/content/supplements";
import { homeProductCategoriesPreviewSchema as schema } from "@/schemas/content";

it("keeps the four proposed categories separate from actual products", () => {
  expect(supplements).toEqual([]);
  expect(content.status).toBe("preview");
  expect(content.heading).toBe("Everything You Need. All in One Place.");
  expect(content.categories.map((category) => category.title)).toEqual([
    "Sports Nutrition",
    "Training Equipment",
    "Gym Accessories",
    "Fitness Apparel",
  ]);
  expect(content.notice).toContain(
    "availability and prices are not confirmed.",
  );
  expect(content.action).toEqual({
    label: "View All Product",
    href: "/products/",
  });
  expect(
    content.categories.every(
      (category) =>
        category.action.href === `/products/?category=${category.id}`,
    ),
  ).toBe(true);
});

it.each([
  [
    "approved status",
    (copy: typeof content) => Object.assign(copy, { status: "approved" }),
  ],
  [
    "duplicate ID",
    (copy: typeof content) => (copy.categories[1].id = copy.categories[0].id),
  ],
  ["missing category", (copy: typeof content) => copy.categories.pop()],
  ["blank title", (copy: typeof content) => (copy.categories[0].title = " ")],
  [
    "blank description",
    (copy: typeof content) => (copy.categories[0].description = " "),
  ],
  ["blank disclosure", (copy: typeof content) => (copy.notice = " ")],
  [
    "blank action",
    (copy: typeof content) => (copy.categories[0].action.label = " "),
  ],
  [
    "missing page",
    (copy: typeof content) => (copy.categories[0].action.href = "/shop/"),
  ],
  [
    "external action",
    (copy: typeof content) =>
      Object.assign(copy.action, { href: "https://example.com/" }),
  ],
])("rejects %s", (_name, mutate) => {
  const copy = structuredClone(content);
  mutate(copy);
  expect(schema.safeParse(copy).success).toBe(false);
});
