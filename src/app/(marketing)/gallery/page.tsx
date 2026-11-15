import {
  InquiryCTA,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { GalleryExplorer } from "@/features/gallery/gallery-explorer";
import { gallery } from "@/content/gallery";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Gallery",
  "See the supplied Crossfit Gym photograph and contact the gym to arrange your visit.",
  "/gallery",
);
export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="A LOOK INSIDE"
        title={"SEE THE\nSPACE."}
        description="A first look at Crossfit Gym. More approved photographs of the gym, training and community can be added here."
      />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="THE GALLERY" title="IN THE FRAME." />
          <GalleryExplorer images={gallery} />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
