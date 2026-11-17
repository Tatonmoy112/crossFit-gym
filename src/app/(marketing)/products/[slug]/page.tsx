import { notFound } from "next/navigation";
import { metadata as makeMetadata } from "@/lib/seo";
import { findProductDetail, productDetailParams } from "@/lib/products/catalog";
import { productDetailCopy } from "@/content/product-detail-copy";
import { ProductDetailPage } from "@/features/products/product-detail-page";
import { ProductStructurePreview } from "@/features/products/product-structure-preview";

export const dynamicParams = false;
export function generateStaticParams() {
  return productDetailParams();
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "content-preview")
    return makeMetadata(
      productDetailCopy.structureTitle,
      productDetailCopy.structureDescription,
      "/products/content-preview",
      true,
    );
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
  if (slug === "content-preview") return <ProductStructurePreview />;
  const record = findProductDetail(slug);
  if (!record) notFound();
  return <ProductDetailPage {...record} />;
}
