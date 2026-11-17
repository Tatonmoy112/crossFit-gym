import { metadata as makeMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { membershipPage, membershipPageFaqs } from "@/content/membership-page";
import { getMembershipPageData } from "@/lib/membership/page-data";
import { MembershipPage } from "@/features/membership/membership-page";

export const metadata = makeMetadata(
  membershipPage.seo.title,
  membershipPage.seo.description,
  "/membership",
  site.preview,
);

export default function Page() {
  return (
    <MembershipPage
      content={membershipPage}
      data={getMembershipPageData(site.preview)}
      faqs={membershipPageFaqs}
    />
  );
}
