import { Catalog } from "@/components/shared/catalog";
import {
  InquiryCTA,
  PageHero,
  PendingContent,
  SectionHeading,
} from "@/components/shared/sections";
import { pageContent, type CatalogKind } from "@/content/pages";
import { catalogs } from "@/lib/content/catalogs";
export function CatalogPage({ kind }: { kind: CatalogKind }) {
  const content = pageContent[kind];
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="EXPLORE CROSSFIT GYM"
            title={content.label.toUpperCase()}
          />
          <Catalog
            items={catalogs[kind]}
            base={kind}
            empty={
              <PendingContent
                title={content.pending}
                description={content.detail}
                previewHref={`/${kind}/content-preview`}
              />
            }
          />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
