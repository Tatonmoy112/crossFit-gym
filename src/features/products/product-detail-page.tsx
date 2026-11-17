import { Container } from "@/components/shared/container";
import { productCategories } from "@/content/product-categories";
import { productShopCopy } from "@/content/product-shop";
import { productDetailCopy } from "@/content/product-detail-copy";
import { relatedProducts } from "@/lib/products/catalog";
import type { Product, ProductDetail } from "@/schemas/products";
import { ProductDetailHeader } from "./product-detail-header";
import { ProductGallery } from "./product-gallery";
import { ProductSummary } from "./product-summary";
import { ProductDescription } from "./product-description";
import { ProductDetails } from "./product-details";
import { ProductReviewsEmpty } from "./product-reviews-empty";
import { RelatedProducts } from "./related-products";

export function ProductDetailPage({
  product,
  detail,
}: {
  product: Product;
  detail: ProductDetail;
}) {
  const category = productCategories.find(
    (item) => item.id === product.categoryId,
  )!;
  return (
    <section
      data-product-detail
      data-surface="light"
      aria-labelledby="product-detail-title"
      {...(product.status === "preview"
        ? { "aria-describedby": "product-detail-preview" }
        : {})}
    >
      <Container className="product-detail-container">
        <ProductDetailHeader
          product={product}
          category={category}
          previewNotice={productDetailCopy.previewNotice}
        />
        <div className="product-detail-layout">
          <ProductGallery
            product={product}
            pendingLabel={productShopCopy.pendingPhotography}
          />
          <ProductSummary
            product={product}
            category={category}
            shopCopy={productShopCopy}
            detailCopy={productDetailCopy}
          />
          <div className="product-detail-information">
            <ProductDescription
              detail={detail}
              heading={productDetailCopy.description}
            />
            <ProductDetails detail={detail} copy={productDetailCopy} />
          </div>
        </div>
        <ProductReviewsEmpty
          heading={productDetailCopy.reviews}
          description={productDetailCopy.reviewsNote}
        />
        <RelatedProducts
          products={relatedProducts(product)}
          category={category}
          copy={productShopCopy}
          heading={productDetailCopy.related}
        />
      </Container>
    </section>
  );
}
