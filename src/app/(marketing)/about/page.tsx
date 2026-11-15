import { SiteLink as Link } from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import {
  GymPhoto,
  InquiryCTA,
  PageHero,
  SectionHeading,
} from "@/components/shared/sections";
import { metadata as makeMetadata } from "@/lib/seo";
import { about } from "@/content/about";
export const metadata = makeMetadata(
  "About the gym",
  "Get to know Crossfit Gym in Uttara, Dhaka, and find the people, place and training information.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR STORY"
        title={"ONE GYM.\nYOUR NEXT STEP."}
        description="Crossfit Gym is in Sector 12, Uttara, Dhaka. Get to know the place, then come say hello."
      />
      <section className="section">
        <div className="container two-column">
          <div>
            <p className="eyebrow">RIGHT HERE IN UTTARA</p>
            <h2>
              GET TO KNOW
              <br />
              THE GYM.
            </h2>
          </div>
          <div className="prose">
            <section>
              <h2>Our story</h2>
              <p>
                {about.story ||
                  "The gym’s approved story and background are being prepared for this page. For now, you can find our supplied address, phone number and social profiles on the Contact page."}
              </p>
            </section>
            <section>
              <h2>Our approach</h2>
              <p>
                {about.mission ||
                  "Training philosophy, mission and values will be published here once supplied by the gym. Speak with the team to learn about its approach and current training options."}
              </p>
            </section>
            {about.values.length > 0 && (
              <section>
                <h2>Our values</h2>
                <ul>
                  {about.values.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </section>
            )}
            {about.community && (
              <section>
                <h2>Our community</h2>
                <p>{about.community}</p>
              </section>
            )}
          </div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionHeading
            eyebrow="THE PEOPLE & THE PLACE"
            title="TAKE A CLOSER LOOK."
          />
          <div className="facility-image">
            <GymPhoto />
          </div>
          <div className="feature-links">
            {[
              { href: "/coaches", title: "Meet the coaches" },
              { href: "/facilities", title: "Explore the facilities" },
              { href: "/gallery", title: "See the gallery" },
            ].map((item) => (
              <Link href={item.href} key={item.href} className="feature-link">
                {item.title}
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
