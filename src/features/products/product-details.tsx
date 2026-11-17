import type { ProductDetail } from "@/schemas/products";
import type { ProductDetailCopy } from "@/content/product-detail-copy";

export function ProductDetails({
  detail,
  copy,
}: {
  detail: ProductDetail;
  copy: ProductDetailCopy;
}) {
  return (
    <section
      className="product-detail-panel"
      aria-labelledby="product-information-title"
      data-product-information
    >
      <h2 id="product-information-title">{copy.details}</h2>
      <details open className="product-information-disclosure">
        <summary>{copy.highlights}</summary>
        <ul>
          {detail.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
      <details className="product-information-disclosure">
        <summary>{copy.idealFor}</summary>
        <p>{detail.idealFor}</p>
      </details>
      {detail.guidance && (
        <details className="product-information-disclosure">
          <summary>{detail.guidance.heading}</summary>
          <p>{detail.guidance.body}</p>
        </details>
      )}
      <details open className="product-information-disclosure">
        <summary>{copy.specifications}</summary>
        <dl className="product-specifications">
          {detail.specifications.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value ?? copy.pendingValue}</dd>
            </div>
          ))}
        </dl>
      </details>
      <details className="product-information-disclosure">
        <summary>{copy.delivery}</summary>
        <p>{copy.deliveryNote}</p>
      </details>
    </section>
  );
}
