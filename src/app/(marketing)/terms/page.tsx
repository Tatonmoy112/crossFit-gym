import { LegalPage } from "@/features/legal/legal-page";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Website terms",
  "Terms publication status for the Crossfit Gym website preview.",
  "/terms",
  true,
);
export default function TermsPage() {
  return <LegalPage kind="terms" />;
}
