import { metadata as makeMetadata } from "@/lib/seo";
import { contactPage } from "@/content/contact-page";
import { site } from "@/content/site";
import { ContactPage } from "@/features/contact/contact-page";

export const metadata = makeMetadata(
  contactPage.seo.title,
  contactPage.seo.description,
  "/contact",
  site.preview,
);

export default function Page() {
  return <ContactPage content={contactPage} preview={site.preview} />;
}
