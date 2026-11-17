import type { FAQ } from "@/schemas/content";
import type { MembershipPageContent } from "@/schemas/membership-page";
import type { MembershipPageData } from "@/lib/membership/page-data";
import { MembershipHero } from "./membership-hero";
import { MembershipIntroduction } from "./membership-introduction";
import { MembershipPricing } from "./membership-pricing";
import { MembershipBenefits } from "./membership-benefits";
import { MembershipComparison } from "./membership-comparison";
import { MembershipJoiningSteps } from "./membership-joining-steps";
import { MembershipFaq } from "./membership-faq";
import { MembershipFinalCta } from "./membership-final-cta";
import { MembershipInformation } from "./membership-information";

export function MembershipPage({
  content,
  data,
  faqs,
}: {
  content: MembershipPageContent;
  data: MembershipPageData;
  faqs: FAQ[];
}) {
  return (
    <div data-membership-page data-surface="light">
      <MembershipHero content={content} />
      <MembershipIntroduction content={content.introduction} />
      <MembershipPricing
        content={content.pricing}
        labels={content.labels}
        plans={data.plans}
      />
      <MembershipBenefits content={content.benefits} items={data.benefits} />
      <MembershipComparison
        content={content.comparison}
        labels={content.labels}
        plans={data.plans}
        rows={data.comparison}
      />
      <MembershipJoiningSteps content={content.joining} />
      <MembershipFaq content={content.faq} items={faqs} />
      <MembershipFinalCta content={content.cta} />
      <MembershipInformation content={content.terms} />
    </div>
  );
}
