"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Lang } from "@/lib/content";
import { generatePoaPdf } from "@/lib/generatePoaPdf";
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
  prefill?: { name?: string }; theme?: { color?: string }; modal?: { ondismiss?(): void };
}

type Step     = "form" | "generating" | "done";
type Scope    = "General" | "Specific" | "Property" | "Financial" | "Legal";
type Duration = "One Time" | "1 Year" | "2 Years" | "Permanent";

interface POAFormFields {
  principalName: string; principalAddress: string; principalAadhaar: string;
  agentName: string;     agentAddress: string;     agentAadhaar: string;
  scopeOfAuthority: Scope; specificPowers: string;
  duration: Duration; propertyDetails: string;
}

const INITIAL: POAFormFields = {
  principalName: "", principalAddress: "", principalAadhaar: "",
  agentName: "",     agentAddress: "",     agentAadhaar: "",
  scopeOfAuthority: "General", specificPowers: "",
  duration: "1 Year", propertyDetails: "",
};

const SCOPES: Scope[]    = ["General", "Property", "Financial", "Legal", "Specific"];
const DURATIONS: Duration[] = ["One Time", "1 Year", "2 Years", "Permanent"];

const SCOPE_MR: Record<Scope, string>    = { General: "सर्वसाधारण", Property: "मालमत्ता", Financial: "आर्थिक", Legal: "कायदेशीर", Specific: "विशिष्ट" };
const DURATION_MR: Record<Duration, string> = { "One Time": "एकवेळ", "1 Year": "1 वर्ष", "2 Years": "2 वर्षे", Permanent: "कायमस्वरूपी" };

const PA = {
  en: {
    back: "← Back", badge: "Maharashtra",
    h1: "Power of Attorney Generator", subtitle: "Maharashtra POA — ₹499",
    principalSec: "Principal Details",      principalSub: "मुखत्यारपत्र देणाऱ्याची माहिती",
    agentSec: "Agent (Attorney) Details",   agentSub: "प्रतिनिधीची माहिती",
    authoritySec: "Authority & Scope",      authoritySub: "अधिकार व व्याप्ती",
    fullName: "Full Name", fullNameSub: "पूर्ण नाव", fullNamePh: "e.g. Ramesh Shankar Patil",
    address: "Address", addressSub: "पत्ता", addressPh: "Full residential address",
    aadhaar: "Aadhaar Number", aadhaarSub: "आधार क्रमांक", aadhaarPh: "12-digit Aadhaar",
    scope: "Scope of Authority", scopeSub: "अधिकाराची व्याप्ती",
    specificPowers: "Specific Powers Granted", specificPowersSub: "विशेष अधिकार",
    specificPowersPh: "Describe specific powers in detail (e.g. sell flat no. 5A at XYZ society, operate HDFC account no. xxxxxxxx...)",
    duration: "Duration / Validity", durationSub: "कालावधी",
    propertyDetails: "Property Details", propertyDetailsSub: "मालमत्तेचे तपशील",
    propertyDetailsPh: "Describe the property if this is a Property POA (optional)",
    optional: "optional",
    ctaTitle: "Ready to generate?", ctaOnetime: "one-time",
    ctaTags: ["10 min mein ready", "Maharashtra format", "Print-ready PDF"],
    ctaBtn: "Pay ₹499 and Generate POA", ctaPaying: "Opening payment…",
    ctaWarn: "Fill all required fields to continue",
    genTitle: "Generating your Power of Attorney…", genSub: "तुमचे मुखत्यारपत्र तयार होत आहे, कृपया थांबा",
    genNote: "This usually takes 20–40 seconds",
    dlBtn: "Download PDF", anotherBtn: "Generate Another",
    docTitle: "Power of Attorney Document", docHint: "Scroll to read · Print to save",
    trust: "Secure payment via Razorpay · Your data is not stored",
  },
  mr: {
    back: "← मागे", badge: "महाराष्ट्र",
    h1: "मुखत्यारपत्र जनरेटर", subtitle: "महाराष्ट्र POA — ₹४९९",
    principalSec: "मुखत्यारपत्र देणाऱ्याची माहिती", principalSub: "Principal Details",
    agentSec: "प्रतिनिधीची माहिती",                 agentSub: "Agent (Attorney) Details",
    authoritySec: "अधिकार व व्याप्ती",               authoritySub: "Authority & Scope",
    fullName: "पूर्ण नाव", fullNameSub: "Full Name", fullNamePh: "उदा. रमेश शंकर पाटील",
    address: "पत्ता", addressSub: "Address", addressPh: "पूर्ण निवासी पत्ता",
    aadhaar: "आधार क्रमांक", aadhaarSub: "Aadhaar Number", aadhaarPh: "12 अंकी आधार",
    scope: "अधिकाराची व्याप्ती", scopeSub: "Scope of Authority",
    specificPowers: "विशेष अधिकार", specificPowersSub: "Specific Powers Granted",
    specificPowersPh: "विशेष अधिकारांचे तपशीलवार वर्णन करा...",
    duration: "कालावधी", durationSub: "Duration / Validity",
    propertyDetails: "मालमत्तेचे तपशील", propertyDetailsSub: "Property Details",
    propertyDetailsPh: "मालमत्तेचे तपशील द्या (ऐच्छिक)",
    optional: "ऐच्छिक",
    ctaTitle: "तयार आहात?", ctaOnetime: "एकवेळ",
    ctaTags: ["10 मिनिटात तयार", "महाराष्ट्र फॉर्मॅट", "प्रिंट-रेडी PDF"],
    ctaBtn: "₹499 भरा आणि मुखत्यारपत्र मिळवा", ctaPaying: "पेमेंट उघडत आहे…",
    ctaWarn: "पुढे जाण्यासाठी सर्व आवश्यक माहिती भरा",
    genTitle: "तुमचे मुखत्यारपत्र तयार होत आहे…", genSub: "कृपया थांबा",
    genNote: "साधारणपणे 20–40 सेकंद लागतात",
    dlBtn: "PDF डाउनलोड करा", anotherBtn: "नवीन करार तयार करा",
    docTitle: "मुखत्यारपत्र दस्तऐवज", docHint: "वाचण्यासाठी स्क्रोल करा",
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

const InputStyle = (extra = "") => `w-full px-4 py-3 border border-gold/20 focus:border-gold/60 focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/25 text-sm font-sans ${extra}`;
const SelectStyle = () => "w-full appearance-none px-4 py-3 border border-gold/20 focus:border-gold/60 focus:outline-none rounded-xl bg-white text-ink text-sm font-sans pr-9 cursor-pointer";

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </span>
  );
}

export default function Poa() {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const stored = localStorage.getItem('mudrankseva-lang') as 'en' | 'mr' | null
    if (stored) setLang(stored)

    const handleLangChange = () => {
      const updated = localStorage.getItem('mudrankseva-lang') as 'en' | 'mr' | null
      if (updated) setLang(updated)
    }

    window.addEventListener('mudrankseva-lang-change', handleLangChange)
    return () => window.removeEventListener('mudrankseva-lang-change', handleLangChange)
  }, [])
  const isMr = lang === "mr";
  const c = PA[lang];

  const [step, setStep]             = useState<Step>("form");
  const [form, setForm]             = useState<POAFormFields>(INITIAL);
  const [poa, setPoa]               = useState("");
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

  const set = useCallback(<K extends keyof POAFormFields>(k: K, v: POAFormFields[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  }, []);

  const isValid = useCallback(() =>
    Boolean(
      form.principalName.trim() && form.principalAddress.trim() &&
      form.agentName.trim() && form.agentAddress.trim() &&
      form.scopeOfAuthority
    ), [form]);

  const triggerPdf = useCallback(async (poaText: string, currentLang: string, currentForm: POAFormFields, testMode = false) => {
    await generatePoaPdf({
      poa: poaText, lang: currentLang,
      principalName: currentForm.principalName, agentName: currentForm.agentName,
      scopeOfAuthority: currentForm.scopeOfAuthority, duration: currentForm.duration,
      isTest: testMode,
    });
  }, []);

  const callApi = useCallback(async (orderId: string, paymentId: string, signature: string) => {
    const res = await fetch("/api/generate-poa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData: form, lang, razorpayOrderId: orderId, razorpayPaymentId: paymentId, razorpaySignature: signature }),
    });
    const json = await res.json() as { poa?: string; disclaimer?: string; error?: string };
    console.log("[poa] API status:", res.status, json);
    if (!res.ok) throw new Error(json.error ?? "Generation failed");
    return json;
  }, [form, lang]);

  const handlePayAndGenerate = useCallback(async () => {
    if (!isValid() || paying) return;
    setError(""); setPaying(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 49900, product: "poa" }),
      });
      const orderJson = await orderRes.json() as { orderId?: string; amount?: number; currency?: string; keyId?: string; error?: string };
      if (!orderRes.ok) throw new Error(orderJson.error ?? "Failed to create order");
      const { orderId, amount, currency, keyId } = orderJson as Required<typeof orderJson>;
      new window.Razorpay({
        key: keyId, amount, currency, name: "Mudrankseva", description: "Maharashtra Power of Attorney", order_id: orderId,
        handler: async (r) => {
          setPaying(false); setStep("generating");
          try {
            const json = await callApi(r.razorpay_order_id, r.razorpay_payment_id, r.razorpay_signature);
            const text = json.poa ?? "";
            setPoa(text); setDisclaimer(json.disclaimer ?? ""); setStep("done");
            void triggerPdf(text, lang, form, false);
          } catch (err) { setError(err instanceof Error ? err.message : "Failed. Please contact support."); setStep("form"); }
        },
        prefill: { name: form.principalName }, theme: { color: "#701c1c" }, modal: { ondismiss: () => setPaying(false) },
      }).open();
    } catch (err) { setPaying(false); setError(err instanceof Error ? err.message : "Payment failed. Please try again."); }
  }, [form, lang, isValid, paying, triggerPdf, callApi]);

  const handleTestGenerate = useCallback(async () => {
    console.log("[TEST/poa] called, isValid:", isValid());
    if (!isValid()) return;
    setError(""); setStep("generating");
    try {
      const json = await callApi("order_test_mdev", "test_mdev", "test_sig");
      const text = "*** TEST - NOT FOR USE ***\n\n" + (json.poa ?? "");
      setPoa(text); setDisclaimer(json.disclaimer ?? ""); setStep("done");
      void triggerPdf(text, lang, form, true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      console.error("[TEST/poa]", msg); setError(msg); setStep("form");
    }
  }, [form, lang, isValid, triggerPdf, callApi]);

  const handleDownloadPdf = useCallback(() => {
    if (!poa) return;
    void triggerPdf(poa, lang, form, isTestMode);
  }, [poa, lang, form, triggerPdf, isTestMode]);

  const year = new Date().getFullYear();

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; } @page { margin: 2cm; size: A4; } }`}</style>
      <div className="min-h-screen flex flex-col bg-cream text-ink">

        <Header />
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

                {/* Principal */}
                <SectionCard title={c.principalSec} sub={c.principalSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.principalName} onChange={e => set("principalName", e.target.value)} placeholder={c.fullNamePh} className={InputStyle()} />
                  </Field>
                  <Field label={c.address} sub={c.addressSub} isMr={isMr}>
                    <textarea value={form.principalAddress} onChange={e => set("principalAddress", e.target.value)} placeholder={c.addressPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12} value={form.principalAadhaar} onChange={e => set("principalAadhaar", e.target.value.replace(/\D/g, ""))} placeholder={c.aadhaarPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Agent */}
                <SectionCard title={c.agentSec} sub={c.agentSub} isMr={isMr}>
                  <Field label={c.fullName} sub={c.fullNameSub} isMr={isMr}>
                    <input type="text" value={form.agentName} onChange={e => set("agentName", e.target.value)} placeholder={isMr ? "उदा. सुरेश कुमार शर्मा" : "e.g. Suresh Kumar Sharma"} className={InputStyle()} />
                  </Field>
                  <Field label={c.address} sub={c.addressSub} isMr={isMr}>
                    <textarea value={form.agentAddress} onChange={e => set("agentAddress", e.target.value)} placeholder={c.addressPh} rows={2} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.aadhaar} sub={c.aadhaarSub} isMr={isMr} optional>
                    <input type="text" inputMode="numeric" maxLength={12} value={form.agentAadhaar} onChange={e => set("agentAadhaar", e.target.value.replace(/\D/g, ""))} placeholder={c.aadhaarPh} className={InputStyle()} />
                  </Field>
                </SectionCard>

                {/* Authority */}
                <SectionCard title={c.authoritySec} sub={c.authoritySub} isMr={isMr}>
                  <Field label={c.scope} sub={c.scopeSub} isMr={isMr}>
                    <div className="relative">
                      <select value={form.scopeOfAuthority} onChange={e => set("scopeOfAuthority", e.target.value as Scope)} className={SelectStyle()}>
                        {SCOPES.map(s => (
                          <option key={s} value={s}>{isMr ? `${SCOPE_MR[s]} (${s})` : s}</option>
                        ))}
                      </select>
                      <ChevronDown />
                    </div>
                  </Field>
                  <Field label={c.specificPowers} sub={c.specificPowersSub} isMr={isMr} optional>
                    <textarea value={form.specificPowers} onChange={e => set("specificPowers", e.target.value)} placeholder={c.specificPowersPh} rows={4} className={InputStyle("resize-none")} />
                  </Field>
                  <Field label={c.duration} sub={c.durationSub} isMr={isMr}>
                    <div className="flex rounded-xl border border-gold/20 overflow-hidden text-xs font-semibold">
                      {DURATIONS.map((d, i) => (
                        <button key={d} type="button" onClick={() => set("duration", d)}
                          className={`flex-1 py-2.5 transition-colors ${i > 0 ? "border-l border-gold/25" : ""} ${form.duration === d ? "bg-oxblood text-gold" : "bg-white text-ink/55 hover:text-ink"} font-sans`}>
                          {isMr ? DURATION_MR[d] : d}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label={c.propertyDetails} sub={c.propertyDetailsSub} isMr={isMr} optional>
                    <textarea value={form.propertyDetails} onChange={e => set("propertyDetails", e.target.value)} placeholder={c.propertyDetailsPh} rows={3} className={InputStyle("resize-none")} />
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
                      <p className="text-gold/50 text-xs font-devanagari mt-1">AI द्वारे Maharashtra मुखत्यारपत्र तयार होईल</p>
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
                        Generate Test POA (No Payment)
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
                    <button onClick={() => { setStep("form"); setPoa(""); setDisclaimer(""); }}
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
                      <div className="whitespace-pre-wrap text-sm text-ink leading-relaxed font-sans">{poa}</div>
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
              q: 'What is a Power of Attorney in Maharashtra?',
              a: 'A Power of Attorney (POA) is a legal document authorising a person (the agent) to act on behalf of another (the principal) for specific or general purposes including property transactions.',
            },
            {
              q: 'What is the difference between a general and specific POA?',
              a: 'A general POA grants broad authority to the agent to handle multiple matters. A specific POA limits authority to a single defined transaction, such as selling a particular property.',
            },
            {
              q: 'Does a POA need to be registered?',
              a: 'A POA used for immovable property transactions must be registered at the SRO under the Registration Act, 1908. A notarised POA is sufficient for most other purposes.',
            },
            {
              q: 'Can a POA be revoked?',
              a: 'Yes. A POA can be revoked at any time by the principal by executing a revocation deed, unless it is an irrevocable POA granted for consideration.',
            },
            {
              q: 'What documents are needed for a POA?',
              a: 'Aadhaar and PAN of both principal and agent, passport photos, and details of the specific property or transaction if it is a specific POA.',
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
