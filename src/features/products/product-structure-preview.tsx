import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { NavigationLink } from "@/components/ui/navigation-link";
import { productDetailCopy } from "@/content/product-detail-copy";

export function ProductStructurePreview() {
  return (
    <section data-product-structure-preview data-surface="light">
      <Container className="grid gap-6 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products/" },
            { label: "Structure preview" },
          ]}
        />
        <h1>{productDetailCopy.structureTitle}</h1>
        <p role="note">{productDetailCopy.structureDescription}</p>
        <div
          className="product-structure-slots"
          aria-label="Product detail structure"
        >
          {[
            "Product gallery",
            "Product summary and inquiry actions",
            "Description and product details",
            "Product reviews",
            "Related products",
          ].map((label) => (
            <div key={label}>
              <h2>{label}</h2>
              <p>Approved content has not been supplied.</p>
            </div>
          ))}
        </div>
        <NavigationLink href="/products/" className="justify-self-start">
          View All Product
        </NavigationLink>
      </Container>
    </section>
  );
}
