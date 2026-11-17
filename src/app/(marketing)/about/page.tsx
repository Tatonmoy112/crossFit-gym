import { aboutPage } from "@/content/about";
import { AboutPage } from "@/features/about/about-page";
import { metadata as makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata(
  aboutPage.seo.title,
  aboutPage.seo.description,
  "/about",
);

export default function Page() {
  return <AboutPage content={aboutPage} />;
}
