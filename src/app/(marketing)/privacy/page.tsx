import { LegalPage } from "@/features/legal/legal-page";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Privacy information",
  "Privacy information and publication status for the Crossfit Gym website preview.",
  "/privacy",
  true,
);
export default function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
