import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sale Deed Generator Maharashtra | खरेदी-विक्री दस्तऐवज",
  description:
    "Generate a legally-formatted Maharashtra Sale Deed online. Available in English and Marathi. Covers Transfer of Property Act 1882 and Registration Act 1908. Ready in minutes — ₹499.",
  keywords: [
    "sale deed Maharashtra",
    "खरेदी विक्री दस्तऐवज",
    "sale deed generator online",
    "Maharashtra property sale deed",
    "विक्री करारनामा",
  ],
  openGraph: {
    title: "Sale Deed Generator Maharashtra | खरेदी-विक्री दस्तऐवज",
    description:
      "Generate a legally-formatted Maharashtra Sale Deed online. Available in English and Marathi. Ready in minutes — ₹499.",
    url: "/sales-deed",
  },
  alternates: {
    canonical: "/sales-deed",
  },
};

export default function SalesDeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
