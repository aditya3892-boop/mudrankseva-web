"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Lang } from "@/lib/content";
import { generateSalesDeedPdf } from "@/lib/generateSalesDeedPdf";
import { Nav } from "@/components/Nav";
import { Header } from "@/components/Header";

declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => { open(): void };
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string;
  name: string; description: string; order_id: string;
  handler(r: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }): void;
  prefill?: { name?: string };
  theme?: { color?: string };
  modal?: { ondismiss?(): void };
}

type Step     = "form" | "generating" | "done";
type PayMode  = "Cash" | "Cheque" | "NEFT" | "RTGS";
type AreaUnit = "sqft" | "sqmt";

interface SDFormFields {
  sellerName: string; sellerAddress: string; sellerAadhaar: string;
  buyerName: string;  buyerAddress: string;  buyerAadhaar: string;
  propertyAddress: string; surveyCtsNo: string;
  area: string; areaUnit: AreaUnit;
  saleConsideration: string; tokenAmountPaid: string;
  paymentMode: PayMode; registrationDistrict: string;
}

const INITIAL: SDFormFields = {
  sellerName: "", sellerAddress: "", sellerAadhaar: "",
  buyerName: "",  buyerAddress: "",  buyerAadhaar: "",
  propertyAddress: "", surveyCtsNo: "",
  area: "", areaUnit: "sqft",
  saleConsideration: "", tokenAmountPaid: "",
  paymentMode: "NEFT", registrationDistrict: "",
};

const PAY_MODES: PayMode[] = ["Cash", "Cheque", "NEFT", "RTGS"];

const SD = {
  en: {
    back: "← Back", badge: "Maharashtra",
    h1: "Sale Deed Generator",
    subtitle: "Maharashtra Sale Deed — ₹499",
    sellerSec: "Seller Details",      sellerSub: "विक्रेत्याची माहिती",
    buyerSec: "Buyer Details",        buyerSub: "खरेदीदाराची माहिती",
    propertySec: "Property Details",  propertySub: "मालमत्तेची माहिती",
    financialSec: "Financial Terms",  financialSub: "आर्थिक अटी",
    fullName: "Full Name",            fullNameSub: "पूर्ण नाव",           fullNamePh: "e.g. Ramesh Shankar Patil",
    address: "Address",               addressSub: "पत्ता",                 addressPh: "Full residential address",
    aadhaar: "Aadhaar Number",        aadhaarSub: "आधार क्रमांक",          aadhaarPh: "12-digit Aadhaar",
    propAddr: "Property Address",     propAddrSub: "मालमत्तेचा पत्ता",    propAddrPh: "Full address of the property",
    surveyCts: "Survey / CTS Number", surveyCtsub: "सर्वे/CTS क्रमांक",   surveCtsPh: "e.g. 123/4A or CTS 567",
    areaLabel: "Area",                areaSub: "क्षेत्रफळ",                areaPh: "e.g. 1200",
    regDistrict: "Registration District", regDistrictSub: "नोंदणी जिल्हा", regDistrictPh: "e.g. Pune",
    saleAmt: "Sale Consideration (₹)", saleAmtSub: "विक्री मूल्य",        saleAmtPh: "5000000",
    tokenAmt: "Token Amount Paid (₹)", tokenAmtSub: "आगाऊ रक्कम",         tokenAmtPh: "100000",
    payMode: "Payment Mode",          payModeSub: "भुगतानाची पद्धत",
    sqftLabel: "Sq. Ft", sqmtLabel: "Sq. Mt",
    optional: "optional",
    ctaTitle: "Ready to generate?", ctaOnetime: "one-time",
    ctaTags: ["10 min mein ready", "Maharashtra format", "Print-ready PDF"],
    ctaBtn: "Pay ₹499 and Generate Sale Deed",
    ctaPaying: "Opening payment…",
    ctaWarn: "Fill all required fields to continue",
    genTitle: "Generating your sale deed…",
    genSub: "तुमचे sale deed तयार होत आहे, कृपया थांबा",
    genNote: "This usually takes 20–40 seconds",
    dlBtn: "Download PDF", anotherBtn: "Generate Another",
    docTitle: "Sale Deed Document", docHint: "Scroll to read · Print to save",
    trust: "Secure payment via Razorpay · Your data is not stored",
  },
  mr: {
    back: "← मागे", badge: "महाराष्ट्र",
    h1: "खरेदी-विक्री दस्तऐवज जनरेटर",
    subtitle: "महाराष्ट्र Sale Deed — ₹४९९",
    sellerSec: "विक्रेत्याची माहिती",    sellerSub: "Seller Details",
    buyerSec: "खरेदीदाराची माहिती",      buyerSub: "Buyer Details",
    propertySec: "मालमत्तेची माहिती",     propertySub: "Property Details",
    financialSec: "आर्थिक अटी",           financialSub: "Financial Terms",
    fullName: "पूर्ण नाव",               fullNameSub: "Full Name",          fullNamePh: "उदा. रमेश शंकर पाटील",
    address: "पत्ता",                    addressSub: "Address",             addressPh: "पूर्ण निवासी पत्ता",
    aadhaar: "आधार क्रमांक",             aadhaarSub: "Aadhaar Number",      aadhaarPh: "12 अंकी आधार",
    propAddr: "मालमत्तेचा पत्ता",        propAddrSub: "Property Address",   propAddrPh: "मालमत्तेचा पूर्ण पत्ता",
    surveyCts: "सर्वे / CTS क्रमांक",    surveyCtsub: "Survey / CTS No.",   surveCtsPh: "उदा. 123/4A किंवा CTS 567",
    areaLabel: "क्षेत्रफळ",              areaSub: "Area",                   areaPh: "उदा. 1200",
    regDistrict: "नोंदणी जिल्हा",        regDistrictSub: "Registration District", regDistrictPh: "उदा. पुणे",
    saleAmt: "विक्री मूल्य (₹)",         saleAmtSub: "Sale Consideration",  saleAmtPh: "5000000",
    tokenAmt: "आगाऊ रक्कम (₹)",          tokenAmtSub: "Token Amount Paid",  tokenAmtPh: "100000",
    payMode: "भुगतानाची पद्धत",          payModeSub: "Payment Mode",
    sqftLabel: "चौ.फू.", sqmtLabel: "चौ.मी.",
    optional: "ऐच्छिक",
    ctaTitle: "तयार आहात?", ctaOnetime: "एकवेळ",
    ctaTags: ["10 मिनिटात तयार", "महाराष्ट्र फॉर्मॅट", "प्रिंट-रेडी PDF"],
    ctaBtn: "₹499 भरा आणि Sale Deed मिळवा",
    ctaPaying: "पेमेंट उघडत आहे…",
    ctaWarn: "पुढे जाण्यासाठी सर्व आवश्यक माहिती भरा",
    genTitle: "तुमचे sale deed तयार होत आहे…",
    genSub: "कृपया थांबा",
    genNote: "साधारणपणे 20–40 सेकंद लागतात",
    dlBtn: "PDF डाउनलोड करा", anotherBtn: "नवीन करार तयार करा",
    docTitle: "Sale Deed दस्तऐवज", docHint: "वाचण्यासाठी स्क्रोल करा",
    trust: "Razorpay द्वारे सुरक्षित पेमेंट · डेटा साठवला जात नाही",
  },
} as const;

/* ── Helper components ── */
function Field({ label, sub, children, optional, isMr = false }: {
  label: string; sub: string; children: React.ReactNode; optional?: boolean; isMr?: boolean;
}) {
  return (
    <div>
      <label className="block mb-2">
        <span className={`text-sm font-semibold text-oxblood tracking-tight ${isMr ? "font-devanagari" : "font-sans"}`}>{label}</span>
        {optional && <span className="ml-1.5 text-xs text-ink/30 font-sans">({isMr ? "ऐच्छिक" : "optional"})</span>}
        <span className={`block text-[11px] text-ink/30 mt-0.5 ${isMr ? "font-sans" : "font-devanagari"}`}>{sub}</span>
      </label>
      {children}
    </div>
  );
}

function SectionCard({ title, sub, children, isMr = false }: {
  title: string; sub: string; children: React.ReactNode; isMr?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40" />
      <div className="px-6 py-4 border-b border-gold/10 flex items-center gap-2.5">
        <span className={`font-semibold text-oxblood text-sm tracking-tight ${isMr ? "font-devanagari" : "font-sans"}`}>{title}</span>
        <span className={`text-ink/25 text-xs ${isMr ? "font-sans" : "font-devanagari"}`}>{sub}</span>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

const InputStyle  = (extra = "") => `w-full px-4 py-3 border border-gold/20 focus:border-gold/60 focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/25 text-sm font-sans ${extra}`;
const SelectStyle = () => "w-full appearance-none px-4 py-3 border border-gold/20 focus:border-gold/60 focus:outline-none rounded-xl bg-white text-ink text-sm font-sans pr-9 cursor-pointer";

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </span>
  );
}

/* ── Page ── */
export default function SalesDeed() {
  const [lang, setLang] = useState<Lang>("en");
  const isMr = lang === "mr";
  const c = SD[lang];

  const [step, setStep]             = useState<Step>("form");
  const [form, setForm]             = useState<SDFormFields>(INITIAL);
  const [deed, setDeed]             = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [error, setError]           = useState("");
  const [paying, setPaying]         = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsTestMode(params.get("test") === "mdev");
  }, []);

  const set = useCallback(<K extends keyof SDFormFields>(k: K, v: SDFormFields[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  }, []);

  const isValid = useCallback(() =>
    Boolean(
      form.sellerName.trim() && form.sellerAddress.trim() &&
      form.buyerName.trim()  && form.buyerAddress.trim() &&
      form.propertyAddress.trim() && form.saleConsideration &&
      form.registrationDistrict.trim()
    ), [form]);

  const triggerPdf = useCallback(async (deedText: string, currentLang: string, currentForm: SDFormFields, testMode = false) => {
    await generateSalesDeedPdf({
      deed: deedText,
      lang: currentLang,
      sellerName: currentForm.sellerName,
      buyerName: currentForm.buyerName,
      propertyAddress: currentForm.propertyAddress,
      saleConsideration: currentForm.saleConsideration,
      registrationDistrict: currentForm.registrationDistrict,
      isTest: testMode,
    });
  }, []);

  const callGenerateApi = useCallback(async (orderId: string, paymentId: string, signature: string) => {
    const res = await fetch("/api/generate-sales-deed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData: form,
        lang,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      }),
    });
    const json = await res.json() as { deed?: string; disclaimer?: string; error?: string };
    console.log("[sales-deed] API status:", res.status, "body:", json);
    if (!res.ok) throw new Error(json.error ?? "Generation failed");
    return json;
  }, [form, lang]);

  const handlePayAndGenerate = useCallback(async () => {
    if (!isValid() || paying) return;
    setError("");
    setPaying(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 49900, product: "sd" }),
      });
      const orderJson = await orderRes.json() as { orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string };
      if (!orderRes.ok) throw new Error(orderJson.error ?? "Failed to create order");

      const { orderId, amount, currency, keyId } = orderJson as Required<typeof orderJson>;

      const rzp = new window.Razorpay({
        key: keyId, amount, currency,
        name: "Mudrankseva",
        description: "Maharashtra Sale Deed",
        order_id: orderId,
        handler: async (response) => {
          setPaying(false);
          setStep("generating");
          try {
            const json = await callGenerateApi(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
            );
            const text = json.deed ?? "";
            setDeed(text);
            setDisclaimer(json.disclaimer ?? "");
            setStep("done");
            void triggerPdf(text, lang, form, false);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate deed. Please contact support.");
            setStep("form");
          }
        },
        prefill: { name: form.sellerName },
        theme: { color: "#701c1c" },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch (err) {
      setPaying(false);
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    }
  }, [form, lang, isValid, paying, triggerPdf, callGenerateApi]);

  const handleTestGenerate = useCallback(async () => {
    console.log("[TEST MODE/sales-deed] handleTestGenerate called");
    console.log("[TEST MODE/sales-deed] isValid:", isValid(), "form:", { ...form });
    if (!isValid()) { console.log("[TEST MODE/sales-deed] Blocked — form invalid"); return; }
    setError("");
    setStep("generating");
    try {
      const json = await callGenerateApi("order_test_mdev", "test_mdev", "test_sig");
      const rawText = json.deed ?? "";
      const text = "*** TEST - NOT FOR USE ***\n\n" + rawText;
      setDeed(text);
      setDisclaimer(json.disclaimer ?? "");
      setStep("done");
      void triggerPdf(text, lang, form, true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      console.error("[TEST MODE/sales-deed] Error:", msg);
      setError(msg);
      setStep("form");
    }
  }, [form, lang, isValid, triggerPdf, callGenerateApi]);

  const handleDownloadPdf = useCallback(() => {
    if (!deed) return;
    void triggerPdf(deed, lang, form, isTestMode);
  }, [deed, lang, form, triggerPdf, isTestMode]);

  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #deed-print-area { border: none !important; box-shadow: none !important; border-radius: 0 !important; }
          #deed-scroll { max-height: none !important; overflow: visible !important; }
          #deed-text { font-family: var(--font-geist), var(--font-noto-devanagari), sans-serif !important; font-size: 12pt !important; line-height: 1.7 !important; }
          @page { margin: 2cm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-cream text-ink">

        <Header />
        <Nav />

        {/* ── Page title ── */}
        <div className="no-print border-b border-gold/10 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="text-[11px] text-ink/30 hover:text-oxblood transition-colors mb-4 inline-block uppercase tracking-widest font-sans">
              {c.back}
            </Link>
            <h1 className={`text-3xl sm:text-4xl font-bold text-oxblood tracking-tight ${isMr ? "font-devanagari" : "font-sans"}`}>
              {c.h1}
            </h1>
            <p className={`text-ink/40 text-sm mt-2 ${isMr ? "font-devanagari" : "font-sans"}`}>
              {c.subtitle}
            </p>
          </div>
        </div>

        {/* ── Main ── */}
        <main className="flex-1 px-4 sm:px-6 py-10">
          <div className="max-w-3xl mx-auto">

            {/* ── FORM STEP ── */}
            {step === "form" && (
              <div className="space-y-6">

                {/* Seller */}
                <SectionCard title={c.sellerSec} sub={c.sellerSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.sellerName}
                      onChange={e => set("sellerName", e.target.value)}
                      placeholder={c.fullNamePh} className={InputStyle()} />
                  </Field>
                  <Field label={c.address} sub={c.addressSub} isMr={isMr}>
                    <textarea value={form.sellerAddress}
                      onChange={e => set("sellerAddress", e.target.value)}
                      placeholder={c.addressPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12}
                      value={form.sellerAadhaar}
                      onChange={e => set("sellerAadhaar", e.target.value.replace(/\D/g, ""))}
                      placeholder={c.aadhaarPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Buyer */}
                <SectionCard title={c.buyerSec} sub={c.buyerSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.buyerName}
                      onChange={e => set("buyerName", e.target.value)}
                      placeholder={isMr ? "उदा. सुरेश कुमार शर्मा" : "e.g. Suresh Kumar Sharma"}
                      className={InputStyle()} />
                  </Field>
                  <Field label={c.address} sub={c.addressSub} isMr={isMr}>
                    <textarea value={form.buyerAddress}
                      onChange={e => set("buyerAddress", e.target.value)}
                      placeholder={c.addressPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12}
                      value={form.buyerAadhaar}
                      onChange={e => set("buyerAadhaar", e.target.value.replace(/\D/g, ""))}
                      placeholder={c.aadhaarPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Property */}
                <SectionCard title={c.propertySec} sub={c.propertySub} isMr={isMr}>
                  <Field label={c.propAddr} sub={c.propAddrSub} isMr={isMr}>
                    <textarea value={form.propertyAddress}
                      onChange={e => set("propertyAddress", e.target.value)}
                      placeholder={c.propAddrPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.surveyCts} sub={c.surveyCtsub} isMr={isMr} optional>
                    <input type="text" value={form.surveyCtsNo}
                      onChange={e => set("surveyCtsNo", e.target.value)}
                      placeholder={c.surveCtsPh} className={InputStyle()} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={c.areaLabel} sub={c.areaSub} isMr={isMr} optional>
                      <input type="text" inputMode="decimal" value={form.area}
                        onChange={e => set("area", e.target.value.replace(/[^0-9.]/g, ""))}
                        placeholder={c.areaPh} className={InputStyle()} />
                    </Field>
                    <Field label={isMr ? "एकक" : "Unit"} sub={isMr ? "Unit" : "एकक"} isMr={isMr}>
                      <div className="flex rounded-xl border border-gold/20 overflow-hidden text-xs font-semibold mt-0.5">
                        {(["sqft", "sqmt"] as AreaUnit[]).map((u, i) => (
                          <button key={u} type="button"
                            onClick={() => set("areaUnit", u)}
                            className={`flex-1 py-3 transition-colors ${i > 0 ? "border-l border-gold/25" : ""} ${form.areaUnit === u ? "bg-oxblood text-gold" : "bg-white text-ink/55 hover:text-ink"}`}>
                            {u === "sqft" ? c.sqftLabel : c.sqmtLabel}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <Field label={c.regDistrict} sub={c.regDistrictSub} isMr={isMr}>
                    <input type="text" value={form.registrationDistrict}
                      onChange={e => set("registrationDistrict", e.target.value)}
                      placeholder={c.regDistrictPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Financial */}
                <SectionCard title={c.financialSec} sub={c.financialSub} isMr={isMr}>
                  <Field label={c.saleAmt} sub={c.saleAmtSub} isMr={isMr}>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                      <input type="text" inputMode="numeric" value={form.saleConsideration}
                        onChange={e => set("saleConsideration", e.target.value.replace(/\D/g, ""))}
                        placeholder={c.saleAmtPh} className={InputStyle("pl-8")} />
                    </div>
                  </Field>
                  <Field label={c.tokenAmt} sub={c.tokenAmtSub} isMr={isMr} optional>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                      <input type="text" inputMode="numeric" value={form.tokenAmountPaid}
                        onChange={e => set("tokenAmountPaid", e.target.value.replace(/\D/g, ""))}
                        placeholder={c.tokenAmtPh} className={InputStyle("pl-8")} />
                    </div>
                  </Field>
                  <Field label={c.payMode} sub={c.payModeSub} isMr={isMr}>
                    <div className="flex rounded-xl border border-gold/20 overflow-hidden text-xs font-semibold">
                      {PAY_MODES.map((m, i) => (
                        <button key={m} type="button"
                          onClick={() => set("paymentMode", m)}
                          className={`flex-1 py-2.5 transition-colors ${i > 0 ? "border-l border-gold/25" : ""} ${form.paymentMode === m ? "bg-oxblood text-gold" : "bg-white text-ink/55 hover:text-ink"} font-sans`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </Field>
                </SectionCard>

                {/* Error */}
                {error && (
                  <div className="bg-oxblood/5 border border-oxblood/15 rounded-xl px-4 py-3 text-sm text-oxblood font-sans">
                    {error}
                  </div>
                )}

                {/* CTA */}
                <div className={`rounded-2xl p-7 border ${isTestMode ? "bg-[#2a0a0a] border-red-700/60" : "bg-oxblood border-gold/20"}`}>

                  {isTestMode && (
                    <div className="mb-4 bg-red-900/60 border border-red-500/50 rounded-xl px-4 py-2.5 text-center">
                      <span className="text-red-300 font-bold text-xs font-sans tracking-widest uppercase">Test Mode Active — Payment Bypassed</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className={`text-gold font-bold text-base tracking-tight ${isMr ? "font-devanagari" : "font-sans"}`}>{c.ctaTitle}</h3>
                      <p className="text-gold/50 text-xs font-devanagari mt-1">AI द्वारे Maharashtra Sale Deed तयार होईल</p>
                    </div>
                    {!isTestMode && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-gold font-bold text-2xl font-sans tracking-tight">₹499</div>
                        <div className={`text-gold/40 text-xs ${isMr ? "font-devanagari" : "font-sans"}`}>{c.ctaOnetime}</div>
                      </div>
                    )}
                  </div>

                  {!isTestMode && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {c.ctaTags.map(tag => (
                        <span key={tag} className={`bg-gold/10 text-gold/70 text-xs px-2.5 py-1 rounded-full border border-gold/15 ${isMr ? "font-devanagari" : "font-sans"}`}>{tag}</span>
                      ))}
                    </div>
                  )}

                  {isTestMode ? (
                    <>
                      <button
                        onClick={handleTestGenerate}
                        disabled={!isValid()}
                        className="w-full py-4 rounded-xl bg-red-700 text-yellow-200 font-bold text-sm tracking-wide transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                      >
                        Generate Test Sale Deed (No Payment)
                      </button>
                      {error && (
                        <div className="mt-3 bg-black/40 border border-red-500/70 rounded-xl px-4 py-3 text-sm text-red-300 font-sans break-words">
                          <span className="font-bold">Error:</span> {error}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handlePayAndGenerate}
                      disabled={!isValid() || paying}
                      className={`w-full py-4 rounded-xl bg-gold text-oxblood-dark font-bold text-sm tracking-wide transition-all hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isMr ? "font-devanagari" : "font-sans"}`}
                    >
                      {paying ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-oxblood/30 border-t-oxblood rounded-full animate-spin" />
                          <span className={isMr ? "font-devanagari" : "font-sans"}>{c.ctaPaying}</span>
                        </>
                      ) : c.ctaBtn}
                    </button>
                  )}

                  {!isValid() && (
                    <p className={`text-gold/50 text-xs text-center mt-2 ${isMr ? "font-devanagari" : "font-sans"}`}>
                      {c.ctaWarn}
                    </p>
                  )}

                  {process.env.NODE_ENV === "development" && !isTestMode && (
                    <button
                      onClick={handleTestGenerate}
                      disabled={!isValid()}
                      className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-gold/40 text-gold/60 hover:text-gold hover:border-gold/70 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
                    >
                      [DEV] Test Generate — skip payment
                    </button>
                  )}
                </div>

                <p className={`text-center text-xs text-ink/25 ${isMr ? "font-devanagari" : "font-sans"}`}>
                  {c.trust}
                </p>
              </div>
            )}

            {/* ── GENERATING ── */}
            {step === "generating" && (
              <div className="flex flex-col items-center justify-center py-24 gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
                <div className="text-center">
                  <h2 className={`text-xl font-bold text-oxblood mb-1 ${isMr ? "font-devanagari" : "font-sans"}`}>{c.genTitle}</h2>
                  <p className={`text-ink/50 text-sm ${isMr ? "font-sans" : "font-devanagari"}`}>{c.genSub}</p>
                  <p className={`text-ink/35 text-xs mt-3 ${isMr ? "font-devanagari" : "font-sans"}`}>{c.genNote}</p>
                </div>
              </div>
            )}

            {/* ── DONE ── */}
            {step === "done" && (
              <div>
                <div className="no-print space-y-4 mb-6">
                  {disclaimer && (
                    <div className="bg-gold/8 border border-gold/20 rounded-xl px-4 py-3.5 flex gap-3">
                      <span className="text-gold/60 flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </span>
                      <p className="text-ink/55 text-xs leading-relaxed">
                        <span className="font-devanagari">{disclaimer.split(" / ")[0]}</span>
                        <span className="block font-sans mt-0.5">{disclaimer.split(" / ")[1]}</span>
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleDownloadPdf}
                      className={`flex-1 flex items-center justify-center gap-2 bg-oxblood text-gold border border-gold/25 py-3.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-oxblood-dark transition-colors ${isMr ? "font-devanagari" : "font-sans"}`}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      {c.dlBtn}
                    </button>
                    <button
                      onClick={() => { setStep("form"); setDeed(""); setDisclaimer(""); }}
                      className={`sm:flex-none flex items-center justify-center gap-2 border border-gold/15 text-ink/50 hover:text-oxblood hover:border-gold/40 py-3.5 px-5 rounded-xl text-sm font-semibold transition-colors ${isMr ? "font-devanagari" : "font-sans"}`}
                    >
                      {c.anotherBtn}
                    </button>
                  </div>
                </div>

                <div id="deed-print-area" className="bg-white rounded-2xl border border-gold/15 overflow-hidden">
                  <div className="no-print">
                    <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40" />
                    <div className="px-5 py-4 border-b border-gold/10 flex items-center justify-between">
                      <h2 className={`text-oxblood font-bold text-sm tracking-wide ${isMr ? "font-devanagari" : "font-sans"}`}>{c.docTitle}</h2>
                      <span className={`text-ink/25 text-xs ${isMr ? "font-devanagari" : "font-sans"}`}>{c.docHint}</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div id="deed-scroll" className="max-h-[60vh] overflow-y-auto">
                      <div id="deed-text" className="whitespace-pre-wrap text-sm text-ink leading-relaxed font-sans">
                        {deed}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What is a sale deed in Maharashtra?',
              a: 'A sale deed is the primary legal document that transfers ownership of a property from seller to buyer. It must be registered at the Sub-Registrar Office (SRO) to be legally valid.',
            },
            {
              q: 'What stamp duty applies to a sale deed in Maharashtra?',
              a: 'Stamp duty is 5% of the property value in municipal areas and 4% in rural areas. An additional 1% local body tax may apply. Mudrankseva calculates this automatically.',
            },
            {
              q: 'What documents are needed for sale deed registration?',
              a: 'PAN card, Aadhaar card, property card or 7/12 extract, NOC from society, recent property tax receipt, and passport photos of both buyer and seller.',
            },
            {
              q: 'How long does sale deed registration take?',
              a: 'With our service, the drafting is done within 24 hours. SRO registration appointment is typically within 3–5 working days.',
            },
            {
              q: 'Can I register a sale deed without visiting the SRO?',
              a: 'For sale deeds, physical presence at the SRO is required by law for biometric verification. Our doorstep service coordinates the appointment and handles all paperwork.',
            },
          ].map((faq, i) => (
            <details key={i} className="border border-gray-200 rounded-xl group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 list-none">
                {faq.q}
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

        <footer className="no-print bg-oxblood px-6 py-10 text-center mt-auto">
          <p className="text-gold/60 text-sm font-sans">© {year} Mudrankseva. All rights reserved.</p>
          <p className="text-gold/25 text-xs mt-2 font-sans">Maharashtra Property Services · AI-Powered Legal Documents</p>
        </footer>

      </div>
    </>
  );
}
