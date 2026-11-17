import type { ReactNode } from "react";
import type { Product, ProductShopCopy } from "@/schemas/products";
import { ProductMedia } from "./product-media";
import { NavigationLink } from "@/components/ui/navigation-link";
import { productDetailHref } from "@/lib/products/links";

export function ProductCard({
  product,
  categoryLabel,
  copy,
  action,
}: {
  product: Product;
  categoryLabel: string;
  copy: ProductShopCopy;
  action?: ReactNode;
}) {
  return (
    <article data-product-card={product.id} className="product-card">
      <NavigationLink
        href={productDetailHref(product.id)}
        aria-label={`View ${product.name}${product.images.length ? "" : `. ${copy.pendingPhotography}`}`}
        className="product-media-link"
      >
        <ProductMedia
          product={product}
          pendingLabel={copy.pendingPhotography}
        />
      </NavigationLink>
      <div className="product-card-copy">
        <p className="product-category-label">{categoryLabel}</p>
        <h3 className="product-name">
          <NavigationLink
            href={productDetailHref(product.id)}
            className="product-title-link"
          >
            {product.name}
          </NavigationLink>
        </h3>
        <p className="product-summary">{product.summary}</p>
        <p className="product-price">
          {product.price === null
            ? copy.pendingPrice
            : `BDT ${product.price.toLocaleString("en-BD")}`}
        </p>
        {action}
      </div>
    </article>
  );
}
