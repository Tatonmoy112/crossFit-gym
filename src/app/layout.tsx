import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { siteUrl } from "@/config/site";
import { site } from "@/content/site";
import "@/styles/globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Crossfit Gym | Uttara, Dhaka",
    template: "%s | Crossfit Gym",
  },
  description:
    "Crossfit Gym in Sector 12, Uttara, Dhaka. Find the gym, explore the website and contact the team.",
  robots: { index: false, follow: false },
  icons: { icon: "/images/brand/logo.jpg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {site.preview && (
          <div className="preview-bar">
            WEBSITE PREVIEW{" "}
            <span>Some business information is awaiting approval.</span>
          </div>
        )}
        <Suspense>
          <SiteHeader />
        </Suspense>
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
