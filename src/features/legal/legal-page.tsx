import { SiteLink as Link } from "@/components/ui/site-link";
import { PageHero } from "@/components/shared/sections";
import { legalDocuments } from "@/content/legal";
export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  const document = legalDocuments[kind];
  if (document.approved)
    return (
      <>
        <PageHero
          eyebrow="WEBSITE INFORMATION"
          title={privacy ? "PRIVACY\nPOLICY." : "WEBSITE\nTERMS."}
          description={
            document.effectiveDate
              ? `Effective ${document.effectiveDate}`
              : "Approved website information."
          }
        />
        <section className="section">
          <div className="container legal-content">
            {document.sections.map((section) => (
              <section key={section.heading}>
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
          </div>
        </section>
      </>
    );
  return (
    <>
      <PageHero
        eyebrow="WEBSITE INFORMATION"
        title={privacy ? "PRIVACY\nINFORMATION." : "WEBSITE\nTERMS."}
        description={
          privacy
            ? "Information about this website preview and its contact functionality."
            : "Publication status of the website’s terms and business information."
        }
      />
      <section className="section">
        <div className="container legal-content">
          <aside className="content-notice">
            <p>
              <strong>Approved legal text is required.</strong> This page is an
              implementation notice, not the gym’s approved{" "}
              {privacy ? "privacy policy" : "terms and conditions"}.
            </p>
          </aside>
          <h2>{privacy ? "Inquiry information" : "Business information"}</h2>
          <p>
            {privacy
              ? "The inquiry form currently validates details in your browser only. It does not send your message to the gym or save it to a database. Use the telephone or supplied social links to contact the gym."
              : "Training, membership, affiliate, recruitment and product details must be confirmed directly with the gym. Unapproved content is marked as unavailable or shown as a page-structure preview."}
          </p>
          <h2>{privacy ? "External destinations" : "External services"}</h2>
          <p>
            Telephone, social and map links open services outside this website.
            Their own terms and privacy information apply when you use them.
          </p>
          <h2>Before publication</h2>
          <p>
            {privacy
              ? "The gym must supply and approve a privacy notice covering the selected host, contact providers, retention arrangements and any analytics before enabling data collection or public indexing."
              : "The gym must supply and approve its applicable website terms, membership terms, product information and any service-specific conditions before publication."}
          </p>
          <h2>Questions</h2>
          <p>
            Visit the{" "}
            <Link className="preview-link" href="/contact">
              Contact page
            </Link>{" "}
            for the supplied gym contact details.
          </p>
        </div>
      </section>
    </>
  );
}
