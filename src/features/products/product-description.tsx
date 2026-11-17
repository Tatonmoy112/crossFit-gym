import type { ProductDetail } from "@/schemas/products";

export function ProductDescription({
  detail,
  heading,
}: {
  detail: ProductDetail;
  heading: string;
}) {
  return (
    <details open className="product-detail-panel" data-product-description>
      <summary>
        <h2>{heading}</h2>
      </summary>
      <div className="product-detail-panel-body">
        <h3 className="product-detail-headline">{detail.headline}</h3>
        {detail.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
}
