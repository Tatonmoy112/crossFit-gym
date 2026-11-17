import type { MetadataRoute } from "next";
import { routes } from "@/config/routes";
import { indexable, siteUrl } from "@/config/site";
import { catalogs } from "@/lib/content/catalogs";
import { locations } from "@/content/locations";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  const paths = [
    ...routes.filter(
      (path) =>
        !["/privacy", "/terms", "/products", "/supplements"].includes(path),
    ),
    ...Object.entries(catalogs).flatMap(([kind, items]) =>
      items
        .filter((item) => item.status === "approved")
        .map((item) => `/${kind}/${item.slug}`),
    ),
    ...locations.map((item) => `/locations/${item.slug}`),
  ];
  return paths.map((path) => ({
    url: new URL(path === "/" ? "/" : `${path}/`, siteUrl).href,
  }));
}
