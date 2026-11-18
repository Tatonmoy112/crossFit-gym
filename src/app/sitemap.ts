import type { MetadataRoute } from "next";
import { routes } from "@/config/routes";
import { indexable, siteUrl } from "@/config/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  const paths = routes.filter(
    (path) => !["/products", "/supplements"].includes(path),
  );
  return paths.map((path) => ({
    url: new URL(path === "/" ? "/" : `${path}/`, siteUrl).href,
  }));
}
