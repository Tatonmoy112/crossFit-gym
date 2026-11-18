import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { ContentState } from "@/components/shared/content-state";
import { NavigationLink } from "@/components/ui/navigation-link";
import { productCategories } from "@/content/product-categories";
import { productShopCopy as copy } from "@/content/product-shop";
import { visibleProducts } from "@/lib/products/catalog";
import { site } from "@/content/site";
import type { ProductCategoryId } from "@/config/products";
import { ProductCatalog } from "./product-catalog";
import { ProductCatalogFallback } from "./product-catalog-fallback";

export function ProductsPage({
  initialCategory = "all",
}: {
  initialCategory?: ProductCategoryId | "all";
}) {
  const records = visibleProducts();
  const introduction = (
    <Container className="grid gap-5 py-8">
      <h2 className="m-0">{copy.catalogHeading}</h2>
      {site.preview && (
        <p
          role="note"
          id="product-preview-notice"
          className="m-0 max-w-[75ch] text-sm leading-relaxed text-muted-foreground"
        >
          {copy.previewNotice}
        </p>
      )}
      {initialCategory !== "all" && (
        <NavigationLink href="/products/" className="justify-self-start">
          View All Product
        </NavigationLink>
      )}
    </Container>
  );
  return (
    <section
      data-products-page
      data-surface="light"
      aria-labelledby="products-page-title"
      {...(site.preview
        ? { "aria-describedby": "product-preview-notice" }
        : {})}
    >
      <div data-surface="charcoal" className="product-shop-hero">
        <Container>
          <p className="m-0 text-xs font-semibold tracking-[0.16em] text-primary">
            {copy.eyebrow}
          </p>
          <h1
            id="products-page-title"
            className="my-5 max-w-[20ch] text-[clamp(2.5rem,5vw,5rem)]"
          >
            {copy.heading}
          </h1>
          <p className="m-0 max-w-[65ch] text-base leading-relaxed">
            {copy.introduction}
          </p>
        </Container>
      </div>
      {records.length ? (
        <Suspense
          fallback={
            <ProductCatalogFallback
              products={records}
              categories={productCategories}
              copy={copy}
              initialCategory={initialCategory}
              introduction={introduction}
            />
          }
        >
          <ProductCatalog
            products={records}
            categories={productCategories}
            copy={copy}
            initialCategory={initialCategory}
            introduction={introduction}
          />
        </Suspense>
      ) : (
        <>
          {introduction}
          <Container className="pb-12">
            <ContentState
              title={copy.emptyTitle}
              description={copy.emptyDescription}
            />
            <div className="product-inquiry-links">
              <NavigationLink href={copy.contact.href}>
                {copy.contact.label}
              </NavigationLink>
              <NavigationLink href={copy.call.href}>
                {copy.call.label}
              </NavigationLink>
            </div>
          </Container>
        </>
      )}
    </section>
  );
}
