import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Noto_Sans_Devanagari } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mudrankseva.in"),
  title: {
    default: "Mudrankseva – Maharashtra Property Legal Services",
    template: "%s | Mudrankseva",
  },
  description:
    "Maharashtra's trusted platform for stamp duty calculator, rent agreements, and property registration. Serving Pune, Mumbai, Nashik and all of Maharashtra.",
  keywords: [
    "stamp duty calculator Maharashtra",
    "rent agreement Pune",
    "भाडे करार",
    "मुद्रांक शुल्क",
    "property registration Maharashtra",
    "मालमत्ता नोंदणी",
  ],
  openGraph: {
    siteName: "Mudrankseva",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    languages: {
      "en-IN": "https://mudrankseva.in",
      "mr-IN": "https://mudrankseva.in",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="mr"
      className={`${geist.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-N1SDG0DZGR" />
      )}
    </html>
  );
}
