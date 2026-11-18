import type { AboutPageContent } from "@/schemas/about";
import { AboutHero } from "./about-hero";
import { AboutStory } from "./about-story";
import { AboutPurpose } from "./about-purpose";
import { AboutValues } from "./about-values";
import { AboutExperience } from "./about-experience";
import { AboutApproach } from "./about-approach";
import { AboutCommunity } from "./about-community";
import { AboutMembershipCta } from "./about-membership-cta";
import { AboutFinalCta } from "./about-final-cta";

export function AboutPage({ content }: { content: AboutPageContent }) {
  return (
    <div data-about-page data-surface="light">
      <AboutHero content={content.hero} />
      <AboutStory content={content.story} />
      <AboutPurpose content={content.purpose} />
      <AboutValues content={content.values} />
      <AboutExperience content={content.experience} />
      <AboutApproach content={content.approach} />
      <AboutCommunity content={content.community} />
      <AboutMembershipCta content={content.membership} />
      <AboutFinalCta content={content.cta} />
    </div>
  );
}
