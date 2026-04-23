import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const notoDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mudrankseva — Maharashtra Property Services",
  description:
    "Stamp Duty Calculator, 7/12 OCR Scanner & Property Tax Transfer for Maharashtra. Coming Soon.",
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
    </html>
  );
}
