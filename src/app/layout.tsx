import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { barlowCondensed, inter } from "@/styles/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body>
        <a href="#main" className="skip-link touch-target z-[60]">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
