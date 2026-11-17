import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { productCategoryHref } from "@/lib/products/links";
import type { Product, ProductCategory } from "@/schemas/products";

export function ProductDetailHeader({
  product,
  category,
  previewNotice,
}: {
  product: Product;
  category: ProductCategory;
  previewNotice: string;
}) {
  return (
    <div className="product-detail-header">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products/" },
          { label: category.label, href: productCategoryHref(category.id) },
          { label: product.name },
        ]}
      />
      {product.status === "preview" && (
        <p
          id="product-detail-preview"
          role="note"
          className="product-detail-notice"
        >
          {previewNotice}
        </p>
      )}
    </div>
  );
}
