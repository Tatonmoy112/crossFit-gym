import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo";
import { pageContent } from "@/content/pages";
import { programsContentState } from "@/content/content-states";
import { catalogs } from "@/lib/content/catalogs";
import { ContentState } from "@/components/shared/content-state";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata = makeMetadata(
  pageContent.programs.label,
  pageContent.programs.description,
  "/programs",
);

export default function Page() {
  return (
    <section className="py-8">
      <Container>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Programs" }]}
        />
        <h1>Programs</h1>
        {catalogs.programs.length === 0 ? (
          <ContentState {...programsContentState} />
        ) : (
          <p>Page components are awaiting rebuild.</p>
        )}
        <Link prefetch={false} href="/">
          Back to home
        </Link>
      </Container>
    </section>
  );
}
