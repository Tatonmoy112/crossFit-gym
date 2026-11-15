import { site } from "@/content/site";
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);
export const indexable =
  !site.preview &&
  process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true" &&
  siteUrl.protocol === "https:";
