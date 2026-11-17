import type { Product } from "@/schemas/products";
import { ProductMedia } from "./product-media";
import { ProductImageGallery } from "./product-image-gallery";

export function ProductGallery({
  product,
  pendingLabel,
}: {
  product: Product;
  pendingLabel: string;
}) {
  return (
    <div className="product-detail-gallery" data-product-gallery>
      {product.images.length ? (
        <ProductImageGallery
          key={product.id}
          name={product.name}
          images={product.images}
        />
      ) : (
        <ProductMedia product={product} pendingLabel={pendingLabel} />
      )}
    </div>
  );
}
