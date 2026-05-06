import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stamp Duty Calculator Maharashtra 2026 | मुद्रांक शुल्क कॅल्क्युलेटर",
  description:
    "Calculate exact stamp duty and registration charges for any property in Maharashtra. Covers all 36 districts, corporation vs rural rates, male/female buyer rates. Free instant calculation.",
  keywords: [
    "stamp duty calculator Maharashtra 2026",
    "मुद्रांक शुल्क कॅल्क्युलेटर",
    "stamp duty Pune",
    "property registration charges Maharashtra",
  ],
  openGraph: {
    title: "Stamp Duty Calculator Maharashtra 2026 | मुद्रांक शुल्क कॅल्क्युलेटर",
    description:
      "Calculate exact stamp duty and registration charges for any property in Maharashtra. Covers all 36 districts, corporation vs rural rates, male/female buyer rates. Free instant calculation.",
    url: "/calculator",
  },
  alternates: {
    canonical: "/calculator",
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
