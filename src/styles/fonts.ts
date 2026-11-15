import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "./fonts/inter/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/inter/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/inter/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: false,
});

export const barlowCondensed = localFont({
  src: [
    {
      path: "./fonts/barlow-condensed/BarlowCondensed-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/barlow-condensed/BarlowCondensed-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: false,
});
