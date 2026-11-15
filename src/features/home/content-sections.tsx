import { catalogs } from "@/lib/content/catalogs";
import { SectionHeading } from "@/components/shared/sections";
import { ContentCard } from "@/components/shared/content-card";
import { testimonials } from "@/content/testimonials";
import { memberships } from "@/content/memberships";
import { MembershipPlans } from "@/features/membership/membership-plans";
const highlights = [
  {
    kind: "programs",
    title: "FIND YOUR TRAINING.",
    eyebrow: "FEATURED PROGRAMS",
  },
  { kind: "coaches", title: "MEET THE TEAM.", eyebrow: "COACH HIGHLIGHTS" },
  { kind: "blog", title: "FROM THE JOURNAL.", eyebrow: "LATEST STORIES" },
  {
    kind: "supplements",
    title: "THE PRODUCT GUIDE.",
    eyebrow: "FEATURED SUPPLEMENTS",
  },
] as const;
export function HomeContentSections() {
  return (
    <>
      {highlights.map(
        ({ kind, title, eyebrow }) =>
          catalogs[kind].length > 0 && (
            <section className="section" key={kind}>
              <div className="container">
                <SectionHeading
                  title={title}
                  eyebrow={eyebrow}
                  href={`/${kind}`}
                  linkLabel="View all"
                />
                <div className="catalog-grid">
                  {catalogs[kind].slice(0, 3).map((item, index) => (
                    <ContentCard
                      item={item}
                      base={kind}
                      index={index}
                      key={item.slug}
                    />
                  ))}
                </div>
              </div>
            </section>
          ),
      )}
      {memberships.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              title="MAKE IT YOUR GYM."
              eyebrow="MEMBERSHIP OPTIONS"
              href="/membership"
            />
            <MembershipPlans plans={memberships} />
          </div>
        </section>
      )}
      {testimonials.length > 0 && (
        <section className="section section-tint">
          <div className="container">
            <SectionHeading
              title="IN THEIR OWN WORDS."
              eyebrow="MEMBER STORIES"
            />
            <div className="testimonial-grid">
              {testimonials.map((item) => (
                <figure key={item.id}>
                  <blockquote>{item.quote}</blockquote>
                  <figcaption>{item.attribution}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
