import { ProductCard } from "./product-card";
import { NavigationLink } from "@/components/ui/navigation-link";
import { productCategoryHref } from "@/lib/products/links";
import type {
  Product,
  ProductCategory,
  ProductShopCopy,
} from "@/schemas/products";

export function RelatedProducts({
  products,
  category,
  copy,
  heading,
}: {
  products: Product[];
  category: ProductCategory;
  copy: ProductShopCopy;
  heading: string;
}) {
  if (!products.length) return null;
  return (
    <section
      className="product-related"
      aria-labelledby="product-related-title"
    >
      <div className="product-related-heading">
        <h2 id="product-related-title">{heading}</h2>
        <NavigationLink href={productCategoryHref(category.id)}>
          Explore {category.label}
        </NavigationLink>
      </div>
      <ul className="product-related-grid">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              categoryLabel={category.label}
              copy={copy}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
