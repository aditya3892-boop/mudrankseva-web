"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Lang } from "@/lib/content";
import { generateGiftDeedPdf } from "@/lib/generateGiftDeedPdf";
import { Nav } from "@/components/Nav";

declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => { open(): void };
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string;
  name: string; description: string; order_id: string;
  handler(r: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }): void;
  prefill?: { name?: string }; theme?: { color?: string }; modal?: { ondismiss?(): void };
}

type Step     = "form" | "generating" | "done";
type AreaUnit = "sqft" | "sqmt";

interface GDFormFields {
  donorName: string; donorAddress: string; donorAadhaar: string;
  doneeName: string; doneeAddress: string; doneeAadhaar: string;
  relationship: string;
  propertyAddress: string; surveyCtsNo: string;
  area: string; areaUnit: AreaUnit;
  marketValue: string; isResidential: boolean;
}

const INITIAL: GDFormFields = {
  donorName: "", donorAddress: "", donorAadhaar: "",
  doneeName: "", doneeAddress: "", doneeAadhaar: "",
  relationship: "",
  propertyAddress: "", surveyCtsNo: "",
  area: "", areaUnit: "sqft",
  marketValue: "", isResidential: true,
};

const GD = {
  en: {
    back: "← Back", badge: "Maharashtra",
    h1: "Gift Deed Generator", subtitle: "Maharashtra Gift Deed — ₹499",
    donorSec: "Donor Details",    donorSub: "दात्याची माहिती",
    doneeSec: "Donee Details",    doneeSub: "प्राप्तकर्त्याची माहिती",
    propertySec: "Property Details", propertySub: "मालमत्तेची माहिती",
    fullName: "Full Name", fullNameSub: "पूर्ण नाव", fullNamePh: "e.g. Ramesh Shankar Patil",
    address: "Address", addressSub: "पत्ता", addressPh: "Full residential address",
    aadhaar: "Aadhaar Number", aadhaarSub: "आधार क्रमांक", aadhaarPh: "12-digit Aadhaar",
    relationship: "Relationship between Donor and Donee", relationshipSub: "दाता आणि प्राप्तकर्ता यांचे नाते",
    relationshipPh: "e.g. Father and Son, Husband and Wife",
    propAddr: "Property Address", propAddrSub: "मालमत्तेचा पत्ता", propAddrPh: "Full address of the property",
    surveyCts: "Survey / CTS Number", surveyCtsub: "सर्वे/CTS क्रमांक", surveCtsPh: "e.g. 123/4A or CTS 567",
    areaLabel: "Area", areaSub: "क्षेत्रफळ", areaPh: "e.g. 1200",
    marketValue: "Market Value of Property (₹)", marketValueSub: "बाजारमूल्य", marketValuePh: "e.g. 5000000",
    isResidential: "Is it a Residential Property?", isResidentialSub: "निवासी मालमत्ता?",
    sqftLabel: "Sq. Ft", sqmtLabel: "Sq. Mt", yes: "Yes ✓", no: "No",
    optional: "optional",
    ctaTitle: "Ready to generate?", ctaOnetime: "one-time",
    ctaTags: ["10 min mein ready", "Maharashtra format", "Print-ready PDF"],
    ctaBtn: "Pay ₹499 and Generate Gift Deed", ctaPaying: "Opening payment…",
    ctaWarn: "Fill all required fields to continue",
    genTitle: "Generating your gift deed…", genSub: "तुमचे gift deed तयार होत आहे, कृपया थांबा",
    genNote: "This usually takes 20–40 seconds",
    dlBtn: "Download PDF", anotherBtn: "Generate Another",
    docTitle: "Gift Deed Document", docHint: "Scroll to read · Print to save",
    trust: "Secure payment via Razorpay · Your data is not stored",
  },
  mr: {
    back: "← मागे", badge: "महाराष्ट्र",
    h1: "भेट खत जनरेटर", subtitle: "महाराष्ट्र Gift Deed — ₹४९९",
    donorSec: "दात्याची माहिती",         donorSub: "Donor Details",
    doneeSec: "प्राप्तकर्त्याची माहिती", doneeSub: "Donee Details",
    propertySec: "मालमत्तेची माहिती",    propertySub: "Property Details",
    fullName: "पूर्ण नाव", fullNameSub: "Full Name", fullNamePh: "उदा. रमेश शंकर पाटील",
    address: "पत्ता", addressSub: "Address", addressPh: "पूर्ण निवासी पत्ता",
    aadhaar: "आधार क्रमांक", aadhaarSub: "Aadhaar Number", aadhaarPh: "12 अंकी आधार",
    relationship: "दाता आणि प्राप्तकर्ता यांचे नाते", relationshipSub: "Relationship",
    relationshipPh: "उदा. वडील-मुलगा, पती-पत्नी",
    propAddr: "मालमत्तेचा पत्ता", propAddrSub: "Property Address", propAddrPh: "मालमत्तेचा पूर्ण पत्ता",
    surveyCts: "सर्वे / CTS क्रमांक", surveyCtsub: "Survey / CTS No.", surveCtsPh: "उदा. 123/4A किंवा CTS 567",
    areaLabel: "क्षेत्रफळ", areaSub: "Area", areaPh: "उदा. 1200",
    marketValue: "मालमत्तेचे बाजारमूल्य (₹)", marketValueSub: "Market Value", marketValuePh: "उदा. 5000000",
    isResidential: "निवासी मालमत्ता आहे का?", isResidentialSub: "Residential Property?",
    sqftLabel: "चौ.फू.", sqmtLabel: "चौ.मी.", yes: "होय ✓", no: "नाही",
    optional: "ऐच्छिक",
    ctaTitle: "तयार आहात?", ctaOnetime: "एकवेळ",
    ctaTags: ["10 मिनिटात तयार", "महाराष्ट्र फॉर्मॅट", "प्रिंट-रेडी PDF"],
    ctaBtn: "₹499 भरा आणि Gift Deed मिळवा", ctaPaying: "पेमेंट उघडत आहे…",
    ctaWarn: "पुढे जाण्यासाठी सर्व आवश्यक माहिती भरा",
    genTitle: "तुमचे gift deed तयार होत आहे…", genSub: "कृपया थांबा",
    genNote: "साधारणपणे 20–40 सेकंद लागतात",
    dlBtn: "PDF डाउनलोड करा", anotherBtn: "नवीन करार तयार करा",
    docTitle: "Gift Deed दस्तऐवज", docHint: "वाचण्यासाठी स्क्रोल करा",
    trust: "Razorpay द्वारे सुरक्षित पेमेंट · डेटा साठवला जात नाही",
  },
} as const;

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

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </span>
  );
}

export default function GiftDeed() {
  const [lang, setLang] = useState<Lang>("en");
  const isMr = lang === "mr";
  const c = GD[lang];

  const [step, setStep]             = useState<Step>("form");
  const [form, setForm]             = useState<GDFormFields>(INITIAL);
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

  const set = useCallback(<K extends keyof GDFormFields>(k: K, v: GDFormFields[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  }, []);

  const isValid = useCallback(() =>
    Boolean(
      form.donorName.trim() && form.donorAddress.trim() &&
      form.doneeName.trim() && form.doneeAddress.trim() &&
      form.propertyAddress.trim() && form.marketValue
    ), [form]);

  const triggerPdf = useCallback(async (deedText: string, currentLang: string, currentForm: GDFormFields, testMode = false) => {
    await generateGiftDeedPdf({
      deed: deedText, lang: currentLang,
      donorName: currentForm.donorName, doneeName: currentForm.doneeName,
      relationship: currentForm.relationship, propertyAddress: currentForm.propertyAddress,
      marketValue: currentForm.marketValue, isTest: testMode,
    });
  }, []);

  const callApi = useCallback(async (orderId: string, paymentId: string, signature: string) => {
    const res = await fetch("/api/generate-gift-deed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData: form, lang, razorpayOrderId: orderId, razorpayPaymentId: paymentId, razorpaySignature: signature }),
    });
    const json = await res.json() as { deed?: string; disclaimer?: string; error?: string };
    console.log("[gift-deed] API status:", res.status, json);
    if (!res.ok) throw new Error(json.error ?? "Generation failed");
    return json;
  }, [form, lang]);

  const handlePayAndGenerate = useCallback(async () => {
    if (!isValid() || paying) return;
    setError(""); setPaying(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 49900, product: "gd" }),
      });
      const orderJson = await orderRes.json() as { orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string };
      if (!orderRes.ok) throw new Error(orderJson.error ?? "Failed to create order");
      const { orderId, amount, currency, keyId } = orderJson as Required<typeof orderJson>;
      new window.Razorpay({
        key: keyId, amount, currency, name: "Mudrankseva", description: "Maharashtra Gift Deed", order_id: orderId,
        handler: async (r) => {
          setPaying(false); setStep("generating");
          try {
            const json = await callApi(r.razorpay_order_id, r.razorpay_payment_id, r.razorpay_signature);
            const text = json.deed ?? "";
            setDeed(text); setDisclaimer(json.disclaimer ?? ""); setStep("done");
            void triggerPdf(text, lang, form, false);
          } catch (err) { setError(err instanceof Error ? err.message : "Failed. Please contact support."); setStep("form"); }
        },
        prefill: { name: form.donorName }, theme: { color: "#701c1c" }, modal: { ondismiss: () => setPaying(false) },
      }).open();
    } catch (err) { setPaying(false); setError(err instanceof Error ? err.message : "Payment failed. Please try again."); }
  }, [form, lang, isValid, paying, triggerPdf, callApi]);

  const handleTestGenerate = useCallback(async () => {
    console.log("[TEST/gift-deed] called, isValid:", isValid());
    if (!isValid()) return;
    setError(""); setStep("generating");
    try {
      const json = await callApi("order_test_mdev", "test_mdev", "test_sig");
      const text = "*** TEST - NOT FOR USE ***\n\n" + (json.deed ?? "");
      setDeed(text); setDisclaimer(json.disclaimer ?? ""); setStep("done");
      void triggerPdf(text, lang, form, true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      console.error("[TEST/gift-deed]", msg); setError(msg); setStep("form");
    }
  }, [form, lang, isValid, triggerPdf, callApi]);

  const handleDownloadPdf = useCallback(() => {
    if (!deed) return;
    void triggerPdf(deed, lang, form, isTestMode);
  }, [deed, lang, form, triggerPdf, isTestMode]);

  const year = new Date().getFullYear();

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; } @page { margin: 2cm; size: A4; } }`}</style>
      <div className="min-h-screen flex flex-col bg-cream text-ink">

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
            <span className={`hidden sm:inline text-xs text-gold/80 border border-gold/40 rounded-full px-3 py-1 tracking-widest uppercase ${isMr ? "font-devanagari tracking-normal" : ""}`}>{c.badge}</span>
          </div>
        </header>
        <Nav />

        <div className="no-print border-b border-gold/10 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="text-[11px] text-ink/30 hover:text-oxblood transition-colors mb-4 inline-block uppercase tracking-widest font-sans">{c.back}</Link>
            <h1 className={`text-3xl sm:text-4xl font-bold text-oxblood tracking-tight ${isMr ? "font-devanagari" : "font-sans"}`}>{c.h1}</h1>
            <p className={`text-ink/40 text-sm mt-2 ${isMr ? "font-devanagari" : "font-sans"}`}>{c.subtitle}</p>
          </div>
        </div>

        <main className="flex-1 px-4 sm:px-6 py-10">
          <div className="max-w-3xl mx-auto">

            {step === "form" && (
              <div className="space-y-6">

                {/* Donor */}
                <SectionCard title={c.donorSec} sub={c.donorSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.donorName} onChange={e => set("donorName", e.target.value)} placeholder={c.fullNamePh} className={InputStyle()} />
                  </Field>
                  <Field label={c.address} sub={c.addressSub} isMr={isMr}>
                    <textarea value={form.donorAddress} onChange={e => set("donorAddress", e.target.value)} placeholder={c.addressPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12} value={form.donorAadhaar} onChange={e => set("donorAadhaar", e.target.value.replace(/\D/g, ""))} placeholder={c.aadhaarPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Donee */}
                <SectionCard title={c.doneeSec} sub={c.doneeSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.doneeName} onChange={e => set("doneeName", e.target.value)} placeholder={isMr ? "उदा. सुरेश रमेश पाटील" : "e.g. Suresh Ramesh Patil"} className={InputStyle()} />
                  </Field>
                  <Field label={c.address} sub={c.addressSub} isMr={isMr}>
                    <textarea value={form.doneeAddress} onChange={e => set("doneeAddress", e.target.value)} placeholder={c.addressPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12} value={form.doneeAadhaar} onChange={e => set("doneeAadhaar", e.target.value.replace(/\D/g, ""))} placeholder={c.aadhaarPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Property */}
                <SectionCard title={c.propertySec} sub={c.propertySub} isMr={isMr}>
                  <Field label={c.relationship} sub={c.relationshipSub} isMr={isMr}>
                    <input type="text" value={form.relationship} onChange={e => set("relationship", e.target.value)} placeholder={c.relationshipPh} className={InputStyle()} />
                  </Field>
                  <Field label={c.propAddr} sub={c.propAddrSub} isMr={isMr}>
                    <textarea value={form.propertyAddress} onChange={e => set("propertyAddress", e.target.value)} placeholder={c.propAddrPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.surveyCts} sub={c.surveyCtsub} isMr={isMr} optional>
                    <input type="text" value={form.surveyCtsNo} onChange={e => set("surveyCtsNo", e.target.value)} placeholder={c.surveCtsPh} className={InputStyle()} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={c.areaLabel} sub={c.areaSub} isMr={isMr} optional>
                      <input type="text" inputMode="decimal" value={form.area} onChange={e => set("area", e.target.value.replace(/[^0-9.]/g, ""))} placeholder={c.areaPh} className={InputStyle()} />
                    </Field>
                    <Field label={isMr ? "एकक" : "Unit"} sub={isMr ? "Unit" : "एकक"} isMr={isMr}>
                      <div className="flex rounded-xl border border-gold/20 overflow-hidden text-xs font-semibold mt-0.5">
                        {(["sqft", "sqmt"] as AreaUnit[]).map((u, i) => (
                          <button key={u} type="button" onClick={() => set("areaUnit", u)}
                            className={`flex-1 py-3 transition-colors ${i > 0 ? "border-l border-gold/25" : ""} ${form.areaUnit === u ? "bg-oxblood text-gold" : "bg-white text-ink/55 hover:text-ink"} font-sans`}>
                            {u === "sqft" ? c.sqftLabel : c.sqmtLabel}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <Field label={c.marketValue} sub={c.marketValueSub} isMr={isMr}>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                      <input type="text" inputMode="numeric" value={form.marketValue} onChange={e => set("marketValue", e.target.value.replace(/\D/g, ""))} placeholder={c.marketValuePh} className={InputStyle("pl-8")} />
                    </div>
                  </Field>
                  <Field label={c.isResidential} sub={c.isResidentialSub} isMr={isMr}>
                    <div className="flex rounded-xl border border-gold/20 overflow-hidden text-sm font-semibold">
                      <button type="button" onClick={() => set("isResidential", true)}
                        className={`flex-1 py-3 transition-colors font-sans ${form.isResidential ? "bg-oxblood text-gold" : "bg-white text-ink/55 hover:text-ink"}`}>{c.yes}</button>
                      <span className="w-px bg-gold/25" />
                      <button type="button" onClick={() => set("isResidential", false)}
                        className={`flex-1 py-3 transition-colors font-sans ${!form.isResidential ? "bg-oxblood text-gold" : "bg-white text-ink/55 hover:text-ink"}`}>{c.no}</button>
                    </div>
                  </Field>
                </SectionCard>

                {error && <div className="bg-oxblood/5 border border-oxblood/15 rounded-xl px-4 py-3 text-sm text-oxblood font-sans">{error}</div>}

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
                      <p className="text-gold/50 text-xs font-devanagari mt-1">AI द्वारे Maharashtra Gift Deed तयार होईल</p>
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
                      <button onClick={handleTestGenerate} disabled={!isValid()}
                        className="w-full py-4 rounded-xl bg-red-700 text-yellow-200 font-bold text-sm tracking-wide transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-sans">
                        Generate Test Gift Deed (No Payment)
                      </button>
                      {error && (
                        <div className="mt-3 bg-black/40 border border-red-500/70 rounded-xl px-4 py-3 text-sm text-red-300 font-sans break-words">
                          <span className="font-bold">Error:</span> {error}
                        </div>
                      )}
                    </>
                  ) : (
                    <button onClick={handlePayAndGenerate} disabled={!isValid() || paying}
                      className={`w-full py-4 rounded-xl bg-gold text-oxblood-dark font-bold text-sm tracking-wide transition-all hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isMr ? "font-devanagari" : "font-sans"}`}>
                      {paying ? (<><span className="inline-block w-4 h-4 border-2 border-oxblood/30 border-t-oxblood rounded-full animate-spin" />{c.ctaPaying}</>) : c.ctaBtn}
                    </button>
                  )}
                  {!isValid() && <p className={`text-gold/50 text-xs text-center mt-2 ${isMr ? "font-devanagari" : "font-sans"}`}>{c.ctaWarn}</p>}
                  {process.env.NODE_ENV === "development" && !isTestMode && (
                    <button onClick={handleTestGenerate} disabled={!isValid()}
                      className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-gold/40 text-gold/60 hover:text-gold hover:border-gold/70 text-xs font-semibold transition-colors disabled:opacity-40 font-sans">
                      [DEV] Test Generate — skip payment
                    </button>
                  )}
                </div>
                <p className={`text-center text-xs text-ink/25 ${isMr ? "font-devanagari" : "font-sans"}`}>{c.trust}</p>
              </div>
            )}

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
                    <button onClick={handleDownloadPdf}
                      className={`flex-1 flex items-center justify-center gap-2 bg-oxblood text-gold border border-gold/25 py-3.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-oxblood-dark transition-colors ${isMr ? "font-devanagari" : "font-sans"}`}>
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      {c.dlBtn}
                    </button>
                    <button onClick={() => { setStep("form"); setDeed(""); setDisclaimer(""); }}
                      className={`sm:flex-none flex items-center justify-center border border-gold/15 text-ink/50 hover:text-oxblood hover:border-gold/40 py-3.5 px-5 rounded-xl text-sm font-semibold transition-colors ${isMr ? "font-devanagari" : "font-sans"}`}>
                      {c.anotherBtn}
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden">
                  <div className="no-print">
                    <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40" />
                    <div className="px-5 py-4 border-b border-gold/10 flex items-center justify-between">
                      <h2 className={`text-oxblood font-bold text-sm tracking-wide ${isMr ? "font-devanagari" : "font-sans"}`}>{c.docTitle}</h2>
                      <span className={`text-ink/25 text-xs ${isMr ? "font-devanagari" : "font-sans"}`}>{c.docHint}</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="max-h-[60vh] overflow-y-auto">
                      <div className="whitespace-pre-wrap text-sm text-ink leading-relaxed font-sans">{deed}</div>
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
              q: 'What is a gift deed in Maharashtra?',
              a: 'A gift deed is a legal document through which a property owner voluntarily transfers ownership to another person without any monetary exchange. It must be registered to be valid.',
            },
            {
              q: 'Is stamp duty applicable on gift deeds?',
              a: 'Stamp duty on gift deeds in Maharashtra is 2% of the property value if gifted to a blood relative, and 5% if gifted to a non-relative.',
            },
            {
              q: 'Can a gift deed be cancelled?',
              a: 'A registered gift deed is generally irrevocable. It can only be cancelled by mutual consent of both parties or through a court order in cases of fraud or undue influence.',
            },
            {
              q: 'What documents are needed for a gift deed?',
              a: 'Aadhaar and PAN of both donor and donee, property documents (7/12, property card), relationship proof if claiming concessional stamp duty, and passport photos.',
            },
            {
              q: 'How long does gift deed registration take?',
              a: 'Drafting is completed within 24 hours. SRO registration is typically done within 3–5 working days after document verification.',
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
