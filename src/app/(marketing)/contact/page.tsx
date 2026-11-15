import { Suspense } from "react";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { LocationDetails, PageHero } from "@/components/shared/sections";
import { InquiryForm } from "@/features/contact/inquiry-form";
import { site } from "@/content/site";
import { metadata as makeMetadata } from "@/lib/seo";
export const metadata = makeMetadata(
  "Contact",
  "Call Crossfit Gym at 01323-275695 or find the gym at Sector 12, Uttara, Dhaka.",
  "/contact",
);
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="WE’D LIKE TO HEAR FROM YOU"
        title={"LET’S\nCONNECT."}
        description="A question, a visit, a new beginning. Get in touch with Crossfit Gym in Uttara."
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <LocationDetails />
            <div className="contact-channels">
              <p className="eyebrow">FIND US ONLINE</p>
              <a
                className="contact-channel"
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
                @crossfit_gym_uttara
                <ArrowUpRight size={17} />
                <span className="sr-only">opens in a new tab</span>
              </a>
              <a
                className="contact-channel"
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={18} />
                Crossfit Bangladesh
                <ArrowUpRight size={17} />
                <span className="sr-only">opens in a new tab</span>
              </a>
            </div>
          </div>
          <Suspense fallback={<p>Loading inquiry form…</p>}>
            <InquiryForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
