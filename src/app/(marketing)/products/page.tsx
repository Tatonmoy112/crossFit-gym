import { metadata as makeMetadata } from "@/lib/seo";
import { ProductsPage } from "@/features/products/products-page";

export const metadata = makeMetadata(
  "Products",
  "Explore the Crossfit Gym product listing preview and contact the gym for availability.",
  "/products",
  true,
);

export default function Page() {
  return <ProductsPage />;
}
