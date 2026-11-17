import type {
  Product,
  ProductCategory,
  ProductShopCopy,
} from "@/schemas/products";
import type { ProductDetailCopy } from "@/content/product-detail-copy";
import { ProductAvailabilityInfo } from "./product-availability-info";
import { ProductInquiryActions } from "./product-inquiry-actions";
import { ProductShare } from "./product-share";

export function ProductSummary({
  product,
  category,
  shopCopy,
  detailCopy,
}: {
  product: Product;
  category: ProductCategory;
  shopCopy: ProductShopCopy;
  detailCopy: ProductDetailCopy;
}) {
  return (
    <div className="product-detail-summary">
      <p className="product-detail-eyebrow">{category.label}</p>
      <h1 id="product-detail-title">{product.name}</h1>
      <p className="product-detail-lead">{product.summary}</p>
      <p className="product-detail-price">
        {product.price === null
          ? shopCopy.pendingPrice
          : `BDT ${product.price.toLocaleString("en-BD")}`}
      </p>
      <p className="m-0 text-sm text-muted-foreground">
        {shopCopy.pendingOptions}
      </p>
      <ProductInquiryActions copy={shopCopy} />
      <ProductAvailabilityInfo items={detailCopy.availability} />
      <ProductShare key={product.id} name={product.name} />
    </div>
  );
}
