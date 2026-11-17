import { createRoot } from "react-dom/client";
import { ProductImageGallery } from "@/features/products/product-image-gallery";

// Owned local assets exercise the gallery only in an injected QA specimen.
// They never populate any product or preview record.
const images = ["home-hero.webp", "cover.webp", "brand-mark.webp"].map(
  (file, index) => ({
    src: `/images/brand/${file}`,
    alt: `Gallery fixture image ${index + 1}`,
    width: 600,
    height: 800,
  }),
);
const element = document.getElementById("product-gallery-fixture")!;
createRoot(element).render(
  <section data-surface="light" className="layout-container py-8">
    <h2>Product gallery specimen</h2>
    <div className="product-detail-gallery">
      <ProductImageGallery name="Gallery fixture" images={images} />
    </div>
  </section>,
);
