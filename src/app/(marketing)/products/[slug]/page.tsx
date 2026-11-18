import { notFound } from "next/navigation";
import { metadata as makeMetadata } from "@/lib/seo";
import { findProductDetail, productDetailParams } from "@/lib/products/catalog";
import { ProductDetailPage } from "@/features/products/product-detail-page";

export const dynamicParams = false;
export function generateStaticParams() {
  const params = productDetailParams();
  // Next static export requires a parameter even with an empty catalog. This
  // reserved ID has no record, reaches notFound(), and exports no product page.
  return params.length > 0 ? params : [{ slug: "content-preview" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = findProductDetail(slug);
  return record
    ? makeMetadata(
        record.product.name,
        record.product.summary,
        `/products/${slug}`,
        true,
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = findProductDetail(slug);
  if (!record) notFound();
  return <ProductDetailPage {...record} />;
}
