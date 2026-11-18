import type { Product } from "@/schemas/products";

export function ProductDetailHeader({
  product,
  previewNotice,
}: {
  product: Product;
  previewNotice: string;
}) {
  if (product.status !== "preview") return null;
  return (
    <div className="product-detail-header">
      <p
        id="product-detail-preview"
        role="note"
        className="product-detail-notice"
      >
        {previewNotice}
      </p>
    </div>
  );
}
