import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Deed Generator Maharashtra | भेट खत दस्तऐवज",
  description:
    "Generate a legally formatted Maharashtra Gift Deed online. Covers Transfer of Property Act 1882 and Registration Act 1908. Available in English and Marathi. Ready in minutes — ₹499.",
  keywords: [
    "gift deed Maharashtra",
    "भेट खत",
    "gift deed generator online",
    "Maharashtra property gift deed",
    "दान पत्र महाराष्ट्र",
  ],
  openGraph: {
    title: "Gift Deed Generator Maharashtra | भेट खत दस्तऐवज",
    description:
      "Generate a legally formatted Maharashtra Gift Deed online. Available in English and Marathi. Ready in minutes — ₹499.",
    url: "/gift-deed",
  },
  alternates: { canonical: "/gift-deed" },
};

export default function GiftDeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
