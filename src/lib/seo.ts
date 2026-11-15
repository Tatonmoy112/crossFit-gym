import type { Metadata } from "next";
import { indexable, siteUrl } from "@/config/site";
import { site } from "@/content/site";
export function metadata(
  title: string,
  description: string,
  path: string,
  preview = false,
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: new URL(path === "/" ? "/" : `${path}/`, siteUrl).href,
    },
    robots: { index: indexable && !preview, follow: indexable && !preview },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      type: "website",
      url: new URL(path, siteUrl).href,
      images: [
        {
          url: "/images/brand/cover.png",
          width: 851,
          height: 315,
          alt: site.name,
        },
      ],
    },
  };
}
