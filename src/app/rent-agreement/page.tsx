"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Lang } from "@/lib/content";
import { generateAgreementPdf } from "@/lib/generateAgreementPdf";

/* ── Razorpay global types ──────────────────────────────────────────── */
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

/* ── Types ──────────────────────────────────────────────────────────── */
type Step  = "form" | "generating" | "done";
type Payer = "Landlord" | "Tenant" | "Split equally";

interface FormFields {
  landlordName: string; landlordAddress: string; landlordAadhaar: string;
  tenantName: string;   tenantAddress: string;   tenantAadhaar: string;
  propertyAddress: string; propertyType: string; furnishedStatus: string;
  monthlyRent: string; securityDeposit: string; startDate: string;
  duration: string; lockInPeriod: string;
  maintenancePaidBy: Payer; electricityPaidBy: Payer; waterPaidBy: Payer;
}

const INITIAL: FormFields = {
  landlordName: "", landlordAddress: "", landlordAadhaar: "",
  tenantName: "",   tenantAddress: "",   tenantAadhaar: "",
  propertyAddress: "", propertyType: "2BHK", furnishedStatus: "Semi-Furnished",
  monthlyRent: "", securityDeposit: "", startDate: "",
  duration: "11", lockInPeriod: "0",
  maintenancePaidBy: "Tenant", electricityPaidBy: "Tenant", waterPaidBy: "Tenant",
};

const PAYERS: Payer[] = ["Landlord", "Tenant", "Split equally"];
const PAYER_MR: Record<Payer, string> = {
  Landlord: "मालक", Tenant: "भाडेकरू", "Split equally": "समान वाटप",
};

/* ── Bilingual content ──────────────────────────────────────────────── */
const RA = {
  en: {
    back: "← Back", badge: "Maharashtra",
    h1: "Rent Agreement Generator",
    subtitle: "Maharashtra Leave & License Agreement — ₹299",
    landlordSec: "Landlord Details",          landlordSub: "मालकाची माहिती",
    tenantSec: "Tenant Details",              tenantSub: "भाडेकरूची माहिती",
    propertySec: "Property Details",          propertySub: "मालमत्तेची माहिती",
    financialSec: "Financial Terms",          financialSub: "आर्थिक अटी",
    termsSec: "Agreement Terms",              termsSub: "करार अटी",
    utilitiesSec: "Utility Responsibilities", utilitiesSub: "देखभाल जबाबदारी",
    fullName: "Full Name",           fullNameSub: "पूर्ण नाव",           fullNamePh: "e.g. Ramesh Shankar Patil",
    address: "Address",              addressSub: "पत्ता",                 addressPh: "Full residential address",
    permAddr: "Permanent Address",   permAddrSub: "कायमचा पत्ता",        permAddrPh: "Full permanent address",
    aadhaar: "Aadhaar Number",       aadhaarSub: "आधार क्रमांक",          aadhaarPh: "12-digit Aadhaar",
    propAddr: "Property Address",    propAddrSub: "मालमत्तेचा पत्ता",    propAddrPh: "Full address of the rented property",
    propType: "Property Type",       propTypeSub: "मालमत्तेचा प्रकार",
    furnished: "Furnished Status",   furnishedSub: "फर्निशिंग",
    furnishedOpt: (s: string) => s,
    rentLabel: "Monthly Rent (₹)",   rentSub: "मासिक भाडे",               rentPh: "15000",
    deposit: "Security Deposit (₹)", depositSub: "सिक्युरिटी ठेव",       depositPh: "30000",
    startDate: "Agreement Start Date", startDateSub: "प्रारंभ तारीख",
    duration: "Duration (months)",   durationSub: "कालावधी (महिने)",
    durationOpt: (d: string) => `${d} months`,
    lockIn: "Lock-in Period (months)", lockInSub: "लॉक-इन कालावधी",
    lockInOpt: (m: string) => m === "0" ? "No lock-in" : `${m} month${m === "1" ? "" : "s"}`,
    maintenance: "Maintenance Charges", maintenanceSub: "देखरेखीचा खर्च",
    electricity: "Electricity Bill",    electricitySub: "वीज बिल",
    water: "Water Bill",                waterSub: "पाण्याचे बिल",
    optional: "optional",
    ctaTitle: "Ready to generate?",
    ctaOnetime: "one-time",
    ctaTags: ["5 min mein ready", "Maharashtra format", "Print-ready PDF"],
    ctaBtn: "Pay ₹299 and Generate Agreement",
    ctaPaying: "Opening payment…",
    ctaWarn: "Fill all required fields to continue",
    genTitle: "Generating your agreement…",
    genSub: "तुमचा करार तयार होत आहे, कृपया थांबा",
    genNote: "This usually takes 20–40 seconds",
    dlBtn: "Download PDF",
    anotherBtn: "Generate Another",
    docTitle: "Agreement Document",
    docHint: "Scroll to read · Print to save",
    trust: "Secure payment via Razorpay · Your data is not stored · 10,000+ agreements generated",
  },
  mr: {
    back: "← मागे", badge: "महाराष्ट्र",
    h1: "भाडेकरार जनरेटर",
    subtitle: "महाराष्ट्र Leave & License करार — ₹२९९",
    landlordSec: "मालकाची माहिती",    landlordSub: "Landlord Details",
    tenantSec: "भाडेकरूची माहिती",   tenantSub: "Tenant Details",
    propertySec: "मालमत्तेची माहिती", propertySub: "Property Details",
    financialSec: "आर्थिक अटी",       financialSub: "Financial Terms",
    termsSec: "करार अटी",             termsSub: "Agreement Terms",
    utilitiesSec: "देखभाल जबाबदारी", utilitiesSub: "Utility Responsibilities",
    fullName: "पूर्ण नाव",            fullNameSub: "Full Name",          fullNamePh: "उदा. रमेश शंकर पाटील",
    address: "पत्ता",                 addressSub: "Address",             addressPh: "पूर्ण निवासी पत्ता",
    permAddr: "कायमचा पत्ता",         permAddrSub: "Permanent Address",  permAddrPh: "पूर्ण कायमचा पत्ता",
    aadhaar: "आधार क्रमांक",          aadhaarSub: "Aadhaar Number",      aadhaarPh: "12 अंकी आधार",
    propAddr: "मालमत्तेचा पत्ता",    propAddrSub: "Property Address",   propAddrPh: "भाड्याच्या मालमत्तेचा पूर्ण पत्ता",
    propType: "मालमत्तेचा प्रकार",    propTypeSub: "Property Type",
    furnished: "फर्निशिंग",            furnishedSub: "Furnished Status",
    furnishedOpt: (s: string) =>
      ({"Fully Furnished": "पूर्ण फर्निश", "Semi-Furnished": "अर्ध फर्निश", "Unfurnished": "फर्निश नाही"} as Record<string, string>)[s] ?? s,
    rentLabel: "मासिक भाडे (₹)",     rentSub: "Monthly Rent",          rentPh: "15000",
    deposit: "सिक्युरिटी ठेव (₹)",   depositSub: "Security Deposit",   depositPh: "30000",
    startDate: "प्रारंभ तारीख",       startDateSub: "Agreement Start Date",
    duration: "कालावधी (महिने)",      durationSub: "Duration (months)",
    durationOpt: (d: string) => `${d} महिने`,
    lockIn: "लॉक-इन कालावधी",         lockInSub: "Lock-in Period (months)",
    lockInOpt: (m: string) => m === "0" ? "लॉक-इन नाही" : (m === "1" ? "1 महिना" : `${m} महिने`),
    maintenance: "देखरेखीचा खर्च",    maintenanceSub: "Maintenance Charges",
    electricity: "वीज बिल",            electricitySub: "Electricity Bill",
    water: "पाण्याचे बिल",             waterSub: "Water Bill",
    optional: "ऐच्छिक",
    ctaTitle: "तयार आहात?",
    ctaOnetime: "एकवेळ",
    ctaTags: ["5 मिनिटात तयार", "महाराष्ट्र फॉर्मॅट", "प्रिंट-रेडी PDF"],
    ctaBtn: "₹299 भरा आणि करार मिळवा",
    ctaPaying: "पेमेंट उघडत आहे…",
    ctaWarn: "पुढे जाण्यासाठी सर्व आवश्यक माहिती भरा",
    genTitle: "तुमचा करार तयार होत आहे…",
    genSub: "कृपया थांबा",
    genNote: "साधारणपणे 20–40 सेकंद लागतात",
    dlBtn: "PDF डाउनलोड करा",
    anotherBtn: "नवीन करार तयार करा",
    docTitle: "करार दस्तऐवज",
    docHint: "वाचण्यासाठी स्क्रोल करा",
    trust: "Razorpay द्वारे सुरक्षित पेमेंट · डेटा साठवला जात नाही",
  },
};

/* ── Helper components ──────────────────────────────────────────────── */
function Field({
  label, sub, children, optional, isMr = false,
}: {
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

function SectionCard({
  title, sub, children, isMr = false,
}: {
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

function InputStyle(extra = "") {
  return `w-full px-4 py-3 border border-gold/20 focus:border-gold/60 focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/25 text-sm font-sans ${extra}`;
}

function SelectStyle() {
  return "w-full appearance-none px-4 py-3 border border-gold/20 focus:border-gold/60 focus:outline-none rounded-xl bg-white text-ink text-sm font-sans pr-9 cursor-pointer";
}

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  );
}

function PayerToggle({
  value, onChange, isMr = false,
}: {
  value: Payer; onChange(v: Payer): void; isMr?: boolean;
}) {
  return (
    <div className="flex rounded-xl border border-gold/20 overflow-hidden text-xs font-semibold">
      {PAYERS.map((p, i) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex-1 py-2.5 transition-colors flex flex-col items-center gap-0.5 ${i > 0 ? "border-l border-gold/25" : ""} ${value === p ? "bg-oxblood text-gold" : "bg-white text-ink/55 hover:text-ink"}`}
        >
          <span className={isMr ? "font-devanagari" : "font-sans"}>{isMr ? PAYER_MR[p] : p}</span>
          <span className={`text-[10px] opacity-70 ${isMr ? "font-sans" : "font-devanagari"}`}>{isMr ? p : PAYER_MR[p]}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function RentAgreement() {
  const [lang, setLang] = useState<Lang>("en");
  const isMr = lang === "mr";
  const c = RA[lang];

  const [step, setStep]           = useState<Step>("form");
  const [form, setForm]           = useState<FormFields>(INITIAL);
  const [agreement, setAgreement] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [error, setError]         = useState("");
  const [paying, setPaying]       = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm(prev => ({ ...prev, startDate: today }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsTestMode(params.get("test") === "mdev");
  }, []);

  const set = useCallback(<K extends keyof FormFields>(k: K, v: FormFields[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  }, []);

  const isValid = useCallback(() =>
    Boolean(
      form.landlordName.trim() && form.landlordAddress.trim() &&
      form.tenantName.trim()   && form.tenantAddress.trim() &&
      form.propertyAddress.trim() && form.monthlyRent &&
      form.securityDeposit && form.startDate
    ), [form]);

  const triggerPdf = useCallback(async (agreementText: string, currentLang: string, currentForm: FormFields, testMode = false) => {
    await generateAgreementPdf({
      agreement: agreementText,
      lang: currentLang,
      landlordName: currentForm.landlordName,
      tenantName: currentForm.tenantName,
      propertyAddress: currentForm.propertyAddress,
      rent: currentForm.monthlyRent,
      startDate: currentForm.startDate,
      isTest: testMode,
    });
  }, []);

  const handlePayAndGenerate = useCallback(async () => {
    if (!isValid() || paying) return;
    setError("");
    setPaying(true);

    try {
      const orderRes = await fetch("/api/create-order", { method: "POST" });
      const orderJson = await orderRes.json() as { orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string };
      if (!orderRes.ok) throw new Error(orderJson.error ?? "Failed to create order");

      const { orderId, amount, currency, keyId } = orderJson as Required<typeof orderJson>;

      const rzp = new window.Razorpay({
        key: keyId, amount, currency,
        name: "Mudrankseva",
        description: "Maharashtra Rent Agreement",
        order_id: orderId,
        handler: async (response) => {
          setPaying(false);
          setStep("generating");
          try {
            const genRes = await fetch("/api/generate-agreement", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                formData: form,
                lang,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const genJson = await genRes.json() as { agreement?: string; disclaimer?: string; error?: string };
            if (!genRes.ok) throw new Error(genJson.error ?? "Generation failed");
            const text = genJson.agreement ?? "";
            setAgreement(text);
            setDisclaimer(genJson.disclaimer ?? "");
            setStep("done");
            void triggerPdf(text, lang, form, false);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate agreement. Please contact support.");
            setStep("form");
          }
        },
        prefill: { name: form.landlordName },
        theme: { color: "#701c1c" },
        modal: { ondismiss: () => setPaying(false) },
      });

      rzp.open();
    } catch (err) {
      setPaying(false);
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    }
  }, [form, lang, isValid, paying, triggerPdf]);

  const handleTestGenerate = useCallback(async () => {
    console.log("[TEST MODE] handleTestGenerate called");
    console.log("[TEST MODE] isValid:", isValid(), "form snapshot:", { ...form });
    if (!isValid()) {
      console.log("[TEST MODE] Blocked — form invalid");
      return;
    }
    setError("");
    setStep("generating");
    try {
      const genRes = await fetch("/api/generate-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: form,
          lang,
          razorpayOrderId: "order_test_mdev",
          razorpayPaymentId: "test_mdev",
          razorpaySignature: "test_sig",
        }),
      });
      const genJson = await genRes.json() as { agreement?: string; disclaimer?: string; error?: string };
      console.log("[TEST MODE] API status:", genRes.status, "body:", genJson);
      if (!genRes.ok) throw new Error(genJson.error ?? "Generation failed");
      const rawText = genJson.agreement ?? "";
      const text = "*** TEST - NOT FOR USE ***\n\n" + rawText;
      setAgreement(text);
      setDisclaimer(genJson.disclaimer ?? "");
      setStep("done");
      void triggerPdf(text, lang, form, true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      console.error("[TEST MODE] Error:", msg);
      setError(msg);
      setStep("form");
    }
  }, [form, lang, isValid, triggerPdf]);

  const handleDownloadPdf = useCallback(() => {
    if (!agreement) return;
    void triggerPdf(agreement, lang, form, isTestMode);
  }, [agreement, lang, form, triggerPdf, isTestMode]);

  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #agreement-print-area { border: none !important; box-shadow: none !important; border-radius: 0 !important; }
          #agreement-scroll { max-height: none !important; overflow: visible !important; }
          #agreement-text { font-family: var(--font-geist), var(--font-noto-devanagari), sans-serif !important; font-size: 12pt !important; line-height: 1.7 !important; }
          @page { margin: 2cm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-cream text-ink">

        {/* ── Header ── */}
        <header className="no-print bg-oxblood px-5 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="rounded-xl overflow-hidden border border-gold/30 bg-cream px-3 py-1.5 flex-shrink-0">
            <Image src="/logo.jpg" alt="Mudrankseva" width={200} height={48} priority className="h-11 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-gold/50 overflow-hidden text-xs font-semibold">
              <button onClick={() => setLang("en")} className={`px-3.5 py-1.5 transition-colors ${lang === "en" ? "bg-gold text-oxblood-dark" : "text-gold/70 hover:text-gold"}`}>EN</button>
              <span className="w-px h-4 bg-gold/30" />
              <button onClick={() => setLang("mr")} className={`px-3.5 py-1.5 font-devanagari transition-colors ${lang === "mr" ? "bg-gold text-oxblood-dark" : "text-gold/70 hover:text-gold"}`}>मराठी</button>
            </div>
            <span className={`hidden sm:inline text-xs text-gold/80 border border-gold/40 rounded-full px-3 py-1 tracking-widest uppercase ${isMr ? "font-devanagari tracking-normal" : ""}`}>
              {c.badge}
            </span>
          </div>
        </header>

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

                {/* Landlord */}
                <SectionCard title={c.landlordSec} sub={c.landlordSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.landlordName}
                      onChange={e => set("landlordName", e.target.value)}
                      placeholder={c.fullNamePh} className={InputStyle()} />
                  </Field>
                  <Field label={c.address} sub={c.addressSub} isMr={isMr}>
                    <textarea value={form.landlordAddress}
                      onChange={e => set("landlordAddress", e.target.value)}
                      placeholder={c.addressPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12}
                      value={form.landlordAadhaar}
                      onChange={e => set("landlordAadhaar", e.target.value.replace(/\D/g, ""))}
                      placeholder={c.aadhaarPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Tenant */}
                <SectionCard title={c.tenantSec} sub={c.tenantSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.tenantName}
                      onChange={e => set("tenantName", e.target.value)}
                      placeholder={isMr ? "उदा. सुरेश कुमार शर्मा" : "e.g. Suresh Kumar Sharma"}
                      className={InputStyle()} />
                  </Field>
                  <Field label={c.permAddr} sub={c.permAddrSub} isMr={isMr}>
                    <textarea value={form.tenantAddress}
                      onChange={e => set("tenantAddress", e.target.value)}
                      placeholder={c.permAddrPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12}
                      value={form.tenantAadhaar}
                      onChange={e => set("tenantAadhaar", e.target.value.replace(/\D/g, ""))}
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
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={c.propType} sub={c.propTypeSub} isMr={isMr}>
                      <div className="relative">
                        <select value={form.propertyType}
                          onChange={e => set("propertyType", e.target.value)}
                          className={SelectStyle()}>
                          {["1BHK", "2BHK", "3BHK", "3BHK+", "Commercial"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                    <Field label={c.furnished} sub={c.furnishedSub} isMr={isMr}>
                      <div className="relative">
                        <select value={form.furnishedStatus}
                          onChange={e => set("furnishedStatus", e.target.value)}
                          className={SelectStyle()}>
                          {["Fully Furnished", "Semi-Furnished", "Unfurnished"].map(s => (
                            <option key={s} value={s}>{c.furnishedOpt(s)}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                  </div>
                </SectionCard>

                {/* Financial */}
                <SectionCard title={c.financialSec} sub={c.financialSub} isMr={isMr}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={c.rentLabel} sub={c.rentSub} isMr={isMr}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                        <input type="text" inputMode="numeric" value={form.monthlyRent}
                          onChange={e => set("monthlyRent", e.target.value.replace(/\D/g, ""))}
                          placeholder={c.rentPh} className={InputStyle("pl-8")} />
                      </div>
                    </Field>
                    <Field label={c.deposit} sub={c.depositSub} isMr={isMr}>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                        <input type="text" inputMode="numeric" value={form.securityDeposit}
                          onChange={e => set("securityDeposit", e.target.value.replace(/\D/g, ""))}
                          placeholder={c.depositPh} className={InputStyle("pl-8")} />
                      </div>
                    </Field>
                  </div>
                </SectionCard>

                {/* Agreement Terms */}
                <SectionCard title={c.termsSec} sub={c.termsSub} isMr={isMr}>
                  <Field label={c.startDate} sub={c.startDateSub} isMr={isMr}>
                    <input type="date" value={form.startDate}
                      onChange={e => set("startDate", e.target.value)}
                      className={InputStyle()} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={c.duration} sub={c.durationSub} isMr={isMr}>
                      <div className="relative">
                        <select value={form.duration}
                          onChange={e => set("duration", e.target.value)}
                          className={SelectStyle()}>
                          {["6", "11", "12", "24", "36"].map(d => (
                            <option key={d} value={d}>{c.durationOpt(d)}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                    <Field label={c.lockIn} sub={c.lockInSub} isMr={isMr}>
                      <div className="relative">
                        <select value={form.lockInPeriod}
                          onChange={e => set("lockInPeriod", e.target.value)}
                          className={SelectStyle()}>
                          {["0", "1", "2", "3", "6"].map(m => (
                            <option key={m} value={m}>{c.lockInOpt(m)}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                  </div>
                </SectionCard>

                {/* Utilities */}
                <SectionCard title={c.utilitiesSec} sub={c.utilitiesSub} isMr={isMr}>
                  <Field label={c.maintenance} sub={c.maintenanceSub} isMr={isMr}>
                    <PayerToggle value={form.maintenancePaidBy} onChange={v => set("maintenancePaidBy", v)} isMr={isMr} />
                  </Field>
                  <Field label={c.electricity} sub={c.electricitySub} isMr={isMr}>
                    <PayerToggle value={form.electricityPaidBy} onChange={v => set("electricityPaidBy", v)} isMr={isMr} />
                  </Field>
                  <Field label={c.water} sub={c.waterSub} isMr={isMr}>
                    <PayerToggle value={form.waterPaidBy} onChange={v => set("waterPaidBy", v)} isMr={isMr} />
                  </Field>
                </SectionCard>

                {/* Error */}
                {error && (
                  <div className="bg-oxblood/5 border border-oxblood/15 rounded-xl px-4 py-3 text-sm text-oxblood font-sans">
                    {error}
                  </div>
                )}

                {/* Price + CTA */}
                <div className={`rounded-2xl p-7 border ${isTestMode ? "bg-[#2a0a0a] border-red-700/60" : "bg-oxblood border-gold/20"}`}>

                  {isTestMode && (
                    <div className="mb-4 bg-red-900/60 border border-red-500/50 rounded-xl px-4 py-2.5 text-center">
                      <span className="text-red-300 font-bold text-xs font-sans tracking-widest uppercase">Test Mode Active — Payment Bypassed</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className={`text-gold font-bold text-base tracking-tight ${isMr ? "font-devanagari" : "font-sans"}`}>{c.ctaTitle}</h3>
                      <p className="text-gold/50 text-xs font-devanagari mt-1">AI द्वारे Maharashtra करार तयार होईल</p>
                    </div>
                    {!isTestMode && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-gold font-bold text-2xl font-sans tracking-tight">₹299</div>
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
                        Generate Test Agreement (No Payment)
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

            {/* ── GENERATING STEP ── */}
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

            {/* ── DONE STEP ── */}
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
                      onClick={() => { setStep("form"); setAgreement(""); setDisclaimer(""); }}
                      className={`sm:flex-none flex items-center justify-center gap-2 border border-gold/15 text-ink/50 hover:text-oxblood hover:border-gold/40 py-3.5 px-5 rounded-xl text-sm font-semibold transition-colors ${isMr ? "font-devanagari" : "font-sans"}`}
                    >
                      {c.anotherBtn}
                    </button>
                  </div>
                </div>

                <div id="agreement-print-area" className="bg-white rounded-2xl border border-gold/15 overflow-hidden">
                  <div className="no-print">
                    <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40" />
                    <div className="px-5 py-4 border-b border-gold/10 flex items-center justify-between">
                      <h2 className={`text-oxblood font-bold text-sm tracking-wide ${isMr ? "font-devanagari" : "font-sans"}`}>{c.docTitle}</h2>
                      <span className={`text-ink/25 text-xs ${isMr ? "font-devanagari" : "font-sans"}`}>{c.docHint}</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div id="agreement-scroll" className="max-h-[60vh] overflow-y-auto">
                      <div id="agreement-text" className="whitespace-pre-wrap text-sm text-ink leading-relaxed font-agreement">
                        {agreement}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        <footer className="no-print bg-oxblood px-6 py-10 text-center mt-auto">
          <p className="text-gold/60 text-sm font-sans">© {year} Mudrankseva. All rights reserved.</p>
          <p className="text-gold/25 text-xs mt-2 font-sans">Maharashtra Property Services · AI-Powered Legal Documents</p>
        </footer>

      </div>
    </>
  );
}
