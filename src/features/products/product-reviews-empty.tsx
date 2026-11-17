export function ProductReviewsEmpty({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return (
    <section
      className="product-reviews-empty"
      aria-labelledby="product-reviews-title"
    >
      <h2 id="product-reviews-title">{heading}</h2>
      <p>{description}</p>
    </section>
  );
}
