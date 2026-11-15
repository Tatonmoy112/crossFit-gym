import Image from "next/image";
import { SiteLink as Link } from "@/components/ui/site-link";
import { ArrowLeft } from "lucide-react";
import type { CatalogItem } from "@/schemas/content";
import { catalogs } from "@/lib/content/catalogs";
import type { CatalogKind } from "@/content/pages";
import { ButtonLink } from "@/components/ui/button";
import {
  InquiryCTA,
  PageHero,
  PreviewNotice,
  SectionHeading,
} from "@/components/shared/sections";
import { ReadingProgress, VariantSelector } from "./detail-controls";
import { ShareLinks } from "@/components/shared/share-links";
import { memberships } from "@/content/memberships";
import { indexable, siteUrl } from "@/config/site";
export function DetailPage({
  kind,
  item,
}: {
  kind: CatalogKind;
  item: CatalogItem;
}) {
  const related = catalogs[kind]
    .filter(
      (other) =>
        other.slug !== item.slug &&
        (item.relatedIds.length === 0 || item.relatedIds.includes(other.slug)),
    )
    .slice(0, 3);
  const articleIndex = catalogs.blog.findIndex(
    (article) => article.slug === item.slug,
  );
  const neighbors =
    kind === "blog" && articleIndex >= 0
      ? [
          catalogs.blog[articleIndex - 1],
          catalogs.blog[articleIndex + 1],
        ].filter(Boolean)
      : [];
  const associations = [
    ...catalogs.programs
      .filter((record) => item.programIds.includes(record.slug))
      .map((record) => ({
        title: record.title,
        href: `/programs/${record.slug}`,
      })),
    ...catalogs.coaches
      .filter((record) => item.coachIds.includes(record.slug))
      .map((record) => ({
        title: record.title,
        href: `/coaches/${record.slug}`,
      })),
    ...memberships
      .filter((record) => item.membershipIds.includes(record.id))
      .map((record) => ({
        title: record.name,
        href: `/membership#${record.id}`,
      })),
  ];
  const articleData =
    kind === "blog" && item.status === "approved" && item.author && item.date
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.summary,
          author: { "@type": "Person", name: item.author },
          datePublished: item.date,
          url: new URL(`/blog/${item.slug}/`, siteUrl).href,
        }
      : null;
  return (
    <>
      {indexable && articleData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleData).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {item.status === "preview" && (
        <div className="container">
          <PreviewNotice />
        </div>
      )}
      <PageHero
        eyebrow={item.category}
        title={item.title}
        description={item.summary}
      />
      <section className="section">
        <div className="container">
          <Link href={`/${kind}`} className="back-link">
            <ArrowLeft size={15} /> Back to {kind === "blog" ? "journal" : kind}
          </Link>
          {item.image && (
            <div className="detail-image">
              <Image {...item.image} alt={item.image.alt} sizes="100vw" />
            </div>
          )}
          {item.author && (
            <p className="article-meta">
              By {item.author} {item.date && ` · ${item.date}`} ·{" "}
              {Math.max(
                1,
                Math.ceil(
                  item.sections
                    .map((s) => s.body)
                    .join(" ")
                    .split(/\s+/).length / 200,
                ),
              )}{" "}
              min read
            </p>
          )}
          <div className="detail-layout">
            <article id="article-body" className="prose">
              {item.sections.map((section, index) => (
                <section id={`section-${index}`} key={section.heading}>
                  <p className="eyebrow">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                  {section.bullets.length > 0 && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>
            <aside className="detail-sidebar">
              {kind === "blog" && <ReadingProgress />}
              <p className="eyebrow">ON THIS PAGE</p>
              <nav aria-label="Page sections">
                {item.sections.map((section, i) => (
                  <a key={section.heading} href={`#section-${i}`}>
                    {section.heading}
                  </a>
                ))}
              </nav>
              {item.variants.length > 0 && (
                <VariantSelector variants={item.variants} />
              )}
              {item.priceLabel && (
                <p className="large-copy">{item.priceLabel}</p>
              )}
              <h3>Let’s talk.</h3>
              <p>Contact the gym for current information.</p>
              <ButtonLink
                href={`/contact?topic=${kind === "careers" ? "Careers" : kind === "supplements" ? "Supplements" : "Training"}&interest=${encodeURIComponent(item.status === "preview" ? "" : item.title)}`}
              >
                Make an inquiry
              </ButtonLink>
              {item.destination && item.status === "approved" && (
                <ButtonLink href={item.destination} variant="outline">
                  {kind === "careers"
                    ? "Apply externally"
                    : kind === "supplements"
                      ? "View supplier"
                      : "Visit provider"}
                </ButtonLink>
              )}
            </aside>
          </div>
          {kind === "blog" && <ShareLinks title={item.title} />}
          {associations.length > 0 && (
            <div className="related-links">
              {associations.map((association) => (
                <ButtonLink
                  key={association.href}
                  href={association.href}
                  variant="outline"
                >
                  {association.title}
                </ButtonLink>
              ))}
            </div>
          )}
          {neighbors.length > 0 && (
            <nav
              className="article-neighbors"
              aria-label="Previous and next articles"
            >
              {neighbors.map((neighbor) => (
                <ButtonLink
                  key={neighbor.slug}
                  href={`/blog/${neighbor.slug}`}
                  variant="text"
                >
                  {neighbor.title}
                </ButtonLink>
              ))}
            </nav>
          )}
          {kind === "blog" && (
            <div className="content-notice">
              <p>
                Article comments are unavailable. No comment service is
                connected.
              </p>
            </div>
          )}
          {related.length > 0 && (
            <section className="related-section">
              <SectionHeading
                eyebrow="KEEP EXPLORING"
                title="RELATED READING & DISCOVERIES"
              />
              <div className="related-links">
                {related.map((other) => (
                  <ButtonLink
                    key={other.slug}
                    href={`/${kind}/${other.slug}`}
                    variant="outline"
                  >
                    {other.title}
                  </ButtonLink>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
