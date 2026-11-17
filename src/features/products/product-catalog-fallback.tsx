import { Container } from "@/components/shared/container";
import { NavigationLink } from "@/components/ui/navigation-link";
import type {
  Product,
  ProductCategory,
  ProductShopCopy,
} from "@/schemas/products";
import { ProductCard } from "./product-card";
import type { ProductCategoryId } from "@/config/products";
import type { ReactNode } from "react";

export function ProductCatalogFallback({
  products,
  categories,
  copy,
  initialCategory,
  introduction,
}: {
  products: Product[];
  categories: ProductCategory[];
  copy: ProductShopCopy;
  initialCategory: ProductCategoryId | "all";
  introduction: ReactNode;
}) {
  const items =
    initialCategory === "all"
      ? products
      : products.filter((product) => product.categoryId === initialCategory);
  return (
    <>
      <div data-surface="charcoal" className="product-sort-bar">
        <Container>
          <p className="m-0 text-sm">Browse product examples</p>
        </Container>
      </div>
      {introduction}
      <Container className="py-8">
        <noscript>
          <p>
            All available examples are shown below. Search, filters and quick
            view require JavaScript. Contact the gym for product inquiries.
          </p>
        </noscript>
        <ul className="product-grid product-static-grid">
          {items.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                categoryLabel={
                  categories.find(
                    (category) => category.id === product.categoryId,
                  )!.label
                }
                copy={copy}
              />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm">
          Showing {items.length} {items.length === 1 ? "product" : "products"}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <NavigationLink href={copy.contact.href}>
            {copy.contact.label}
          </NavigationLink>
          <NavigationLink href={copy.call.href}>
            {copy.call.label}
          </NavigationLink>
        </div>
      </Container>
    </>
  );
}
