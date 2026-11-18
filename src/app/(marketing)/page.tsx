import { metadata as makeMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { homeHero, homeStats, homeWhyChooseUs } from "@/content/home";
import { HomeHero } from "@/features/home/home-hero";
import { HomeStats } from "@/features/home/home-stats";
import { HomeStatsPreview } from "@/features/home/home-stats-preview";
import { homeAbout } from "@/content/about";
import { HomeAbout } from "@/features/home/home-about";
import { HomeWhyChooseUs } from "@/features/home/home-why-choose-us";
import { homeServices } from "@/content/home-services";
import { HomeServices } from "@/features/home/home-services";
import { homeFeatures } from "@/content/home-features";
import { HomeFeatures } from "@/features/home/home-features";
import { homeMembershipsPreview } from "@/content/previews/home-memberships";
import { HomeMemberships } from "@/features/home/home-memberships";
import { homeSuccessStoriesPreview } from "@/content/previews/home-success-stories";
import { HomeSuccessStories } from "@/features/home/home-success-stories";
import { homeProductCategoriesPreview } from "@/content/previews/home-product-categories";
import { HomeProductCategories } from "@/features/home/home-product-categories";
import { homeFaq, homeFaqItems } from "@/content/home-faq";
import { HomeFaq } from "@/features/home/home-faq";
import { homeAffiliates } from "@/content/home-affiliates";
import { HomeAffiliates } from "@/features/home/home-affiliates";

export const metadata = makeMetadata(
  "One step closer",
  "Find Crossfit Gym in Sector 12, Uttara, Dhaka. Explore the gym and contact the team.",
  "/",
);

export default function Page() {
  return (
    <>
      <HomeHero
        content={homeHero}
        stats={
          homeStats.items.length > 0 ? (
            <HomeStats content={homeStats} />
          ) : site.preview ? (
            <HomeStatsPreview />
          ) : undefined
        }
      />
      <HomeAbout content={homeAbout} />
      <HomeWhyChooseUs content={homeWhyChooseUs} />
      <HomeServices content={homeServices} />
      {site.preview && <HomeMemberships content={homeMembershipsPreview} />}
      <HomeFeatures content={homeFeatures} />
      {site.preview && (
        <HomeProductCategories content={homeProductCategoriesPreview} />
      )}
      <HomeAffiliates content={homeAffiliates} />
      {site.preview && (
        <HomeSuccessStories content={homeSuccessStoriesPreview} />
      )}
      <HomeFaq content={homeFaq} items={homeFaqItems} />
    </>
  );
}
