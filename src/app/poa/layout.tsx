import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Power of Attorney Generator Maharashtra | मुखत्यारपत्र",
  description:
    "Generate a legally formatted Maharashtra Power of Attorney online. General, Specific, Property, Financial, or Legal POA. Available in English and Marathi — ₹499.",
  keywords: [
    "power of attorney Maharashtra",
    "मुखत्यारपत्र",
    "POA Maharashtra online",
    "general power of attorney Maharashtra",
    "property POA Maharashtra",
  ],
  openGraph: {
    title: "Power of Attorney Generator Maharashtra | मुखत्यारपत्र",
    description:
      "Generate a legally formatted Maharashtra Power of Attorney online. General, Specific, Property, Financial, or Legal POA. Ready in minutes — ₹499.",
    url: "/poa",
  },
  alternates: { canonical: "/poa" },
};

export default function PoaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
