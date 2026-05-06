import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Rent Agreement Pune & Maharashtra | भाडे करार ऑनलाइन",
  description:
    "Get a legally valid rent agreement drafted online for Maharashtra. Available in English and Marathi. Instant delivery, Razorpay payment, only ₹299.",
  keywords: [
    "rent agreement Pune",
    "भाडे करार",
    "online rent agreement Maharashtra",
    "भाडे करार ऑनलाइन",
    "leave and license agreement Maharashtra",
  ],
  openGraph: {
    title: "Online Rent Agreement Pune & Maharashtra | भाडे करार ऑनलाइन",
    description:
      "Get a legally valid rent agreement drafted online for Maharashtra. Available in English and Marathi. Instant delivery, Razorpay payment, only ₹299.",
    url: "/rent-agreement",
  },
  alternates: {
    canonical: "/rent-agreement",
  },
};

export default function RentAgreementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
