import { metadata as makeMetadata } from "@/lib/seo";
import { ProductsPage } from "@/features/products/products-page";

export const metadata = makeMetadata(
  "Products · Supplements",
  "Browse the Supplements category in the Crossfit Gym product listing preview.",
  "/products",
  true,
);

export default function Page() {
  return <ProductsPage initialCategory="sports-nutrition" />;
}
