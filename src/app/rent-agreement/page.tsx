"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { type Lang } from "@/lib/content";

/* ── Razorpay global types ──────────────────────────────────────────── */
declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => { open(): void };
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler(r: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }): void;
  prefill?: { name?: string };
  theme?: { color?: string };
  modal?: { ondismiss?(): void };
}

/* ── Types ──────────────────────────────────────────────────────────── */
type Step = "form" | "generating" | "done";
type Payer = "Landlord" | "Tenant" | "Split equally";

interface FormFields {
  landlordName: string;
  landlordAddress: string;
  landlordAadhaar: string;
  tenantName: string;
  tenantAddress: string;
  tenantAadhaar: string;
  propertyAddress: string;
  propertyType: string;
  furnishedStatus: string;
  monthlyRent: string;
  securityDeposit: string;
  startDate: string;
  duration: string;
  lockInPeriod: string;
  maintenancePaidBy: Payer;
  electricityPaidBy: Payer;
  waterPaidBy: Payer;
}

const INITIAL: FormFields = {
  landlordName: "",
  landlordAddress: "",
  landlordAadhaar: "",
  tenantName: "",
  tenantAddress: "",
  tenantAadhaar: "",
  propertyAddress: "",
  propertyType: "2BHK",
  furnishedStatus: "Semi-Furnished",
  monthlyRent: "",
  securityDeposit: "",
  startDate: "",
  duration: "11",
  lockInPeriod: "0",
  maintenancePaidBy: "Tenant",
  electricityPaidBy: "Tenant",
  waterPaidBy: "Tenant",
};

const PAYERS: Payer[] = ["Landlord", "Tenant", "Split equally"];
const PAYER_MR: Record<Payer, string> = {
  Landlord: "मालक",
  Tenant: "भाडेकरू",
  "Split equally": "समान वाटप",
};

/* ── Helpers ────────────────────────────────────────────────────────── */
function Field({
  label, mr, children, optional,
}: {
  label: string; mr: string; children: React.ReactNode; optional?: boolean;
}) {
  return (
    <div>
      <label className="block mb-2">
        <span className="text-sm font-semibold text-oxblood font-sans tracking-tight">{label}</span>
        {optional && <span className="ml-1.5 text-xs text-ink/30 font-sans">(optional)</span>}
        <span className="block text-[11px] text-ink/30 font-devanagari mt-0.5">{mr}</span>
      </label>
      {children}
    </div>
  );
}

function SectionCard({
  title, mr, children,
}: {
  title: string; mr: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40" />
      <div className="px-6 py-4 border-b border-gold/10 flex items-center gap-2.5">
        <span className="font-semibold text-oxblood text-sm font-sans tracking-tight">{title}</span>
        <span className="text-ink/25 text-xs font-devanagari">{mr}</span>
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
  value, onChange,
}: {
  value: Payer; onChange(v: Payer): void;
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
          <span className="font-sans">{p}</span>
          <span className="font-devanagari text-[10px] opacity-70">{PAYER_MR[p]}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function RentAgreement() {
  const [lang, setLang] = useState<Lang>("en");
  const isMr = lang === "mr";

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormFields>(INITIAL);
  const [agreement, setAgreement] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  /* Load Razorpay checkout script once */
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  /* Set today as default start date */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm(prev => ({ ...prev, startDate: today }));
  }, []);

  const set = useCallback(<K extends keyof FormFields>(k: K, v: FormFields[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  }, []);

  const isValid = useCallback(() =>
    Boolean(
      form.landlordName.trim() &&
      form.landlordAddress.trim() &&
      form.tenantName.trim() &&
      form.tenantAddress.trim() &&
      form.propertyAddress.trim() &&
      form.monthlyRent &&
      form.securityDeposit &&
      form.startDate
    ), [form]);

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
        key: keyId,
        amount,
        currency,
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
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const genJson = await genRes.json() as { agreement?: string; disclaimer?: string; error?: string };
            if (!genRes.ok) throw new Error(genJson.error ?? "Generation failed");

            setAgreement(genJson.agreement ?? "");
            setDisclaimer(genJson.disclaimer ?? "");
            setStep("done");
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
  }, [form, isValid, paying]);

  const handleTestGenerate = useCallback(async () => {
    if (!isValid()) return;
    setError("");
    setStep("generating");
    try {
      const genRes = await fetch("/api/generate-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: form,
          razorpayOrderId: "order_test",
          razorpayPaymentId: "test_123",
          razorpaySignature: "test_sig",
        }),
      });
      const genJson = await genRes.json() as { agreement?: string; disclaimer?: string; error?: string };
      if (!genRes.ok) throw new Error(genJson.error ?? "Generation failed");
      setAgreement(genJson.agreement ?? "");
      setDisclaimer(genJson.disclaimer ?? "");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStep("form");
    }
  }, [form, isValid]);

  const handleDownloadPDF = () => window.print();

  const year = new Date().getFullYear();

  /* ── Render ── */
  return (
    <>
      {/* Print-specific styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #agreement-print-area {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          #agreement-scroll {
            max-height: none !important;
            overflow: visible !important;
          }
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
              <button
                onClick={() => setLang("en")}
                className={`px-3.5 py-1.5 transition-colors ${lang === "en" ? "bg-gold text-oxblood-dark" : "text-gold/70 hover:text-gold"}`}
              >
                EN
              </button>
              <span className="w-px h-4 bg-gold/30" />
              <button
                onClick={() => setLang("mr")}
                className={`px-3.5 py-1.5 font-devanagari transition-colors ${lang === "mr" ? "bg-gold text-oxblood-dark" : "text-gold/70 hover:text-gold"}`}
              >
                मराठी
              </button>
            </div>
            <span className={`hidden sm:inline text-xs text-gold/80 border border-gold/40 rounded-full px-3 py-1 tracking-widest uppercase ${isMr ? "font-devanagari tracking-normal" : ""}`}>
              {isMr ? "महाराष्ट्र" : "Maharashtra"}
            </span>
          </div>
        </header>

        {/* ── Page title ── */}
        <div className="no-print border-b border-gold/10 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="text-[11px] text-ink/30 hover:text-oxblood transition-colors mb-4 inline-block uppercase tracking-widest font-sans">
              {isMr ? "← मुख्यपृष्ठ" : "← Back"}
            </Link>
            <h1 className={`text-3xl sm:text-4xl font-bold text-oxblood tracking-tight ${isMr ? "font-devanagari" : "font-sans"}`}>
              {isMr ? "भाडेकरार जनरेटर" : "Rent Agreement Generator"}
            </h1>
            <p className="text-ink/40 text-sm mt-2 font-sans">
              {isMr ? "महाराष्ट्र Leave and License Agreement — ₹२९९" : "Maharashtra Leave & License Agreement — ₹299"}
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
                <SectionCard title="Landlord Details" mr="मालकाची माहिती">
                  <Field label="Full Name" mr="पूर्ण नाव">
                    <input
                      type="text"
                      value={form.landlordName}
                      onChange={e => set("landlordName", e.target.value)}
                      placeholder="e.g. Ramesh Shankar Patil"
                      className={InputStyle()}
                    />
                  </Field>
                  <Field label="Address" mr="पत्ता">
                    <textarea
                      value={form.landlordAddress}
                      onChange={e => set("landlordAddress", e.target.value)}
                      placeholder="Full residential address"
                      rows={2}
                      className={InputStyle("resize-none")}
                    />
                  </Field>
                  <Field label="Aadhaar Number" mr="आधार क्रमांक" optional>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={12}
                      value={form.landlordAadhaar}
                      onChange={e => set("landlordAadhaar", e.target.value.replace(/\D/g, ""))}
                      placeholder="12-digit Aadhaar"
                      className={InputStyle()}
                    />
                  </Field>
                </SectionCard>

                {/* Tenant */}
                <SectionCard title="Tenant Details" mr="भाडेकरूची माहिती">
                  <Field label="Full Name" mr="पूर्ण नाव">
                    <input
                      type="text"
                      value={form.tenantName}
                      onChange={e => set("tenantName", e.target.value)}
                      placeholder="e.g. Suresh Kumar Sharma"
                      className={InputStyle()}
                    />
                  </Field>
                  <Field label="Permanent Address" mr="कायमचा पत्ता">
                    <textarea
                      value={form.tenantAddress}
                      onChange={e => set("tenantAddress", e.target.value)}
                      placeholder="Full permanent address"
                      rows={2}
                      className={InputStyle("resize-none")}
                    />
                  </Field>
                  <Field label="Aadhaar Number" mr="आधार क्रमांक" optional>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={12}
                      value={form.tenantAadhaar}
                      onChange={e => set("tenantAadhaar", e.target.value.replace(/\D/g, ""))}
                      placeholder="12-digit Aadhaar"
                      className={InputStyle()}
                    />
                  </Field>
                </SectionCard>

                {/* Property */}
                <SectionCard title="Property Details" mr="मालमत्तेची माहिती">
                  <Field label="Property Address" mr="मालमत्तेचा पत्ता">
                    <textarea
                      value={form.propertyAddress}
                      onChange={e => set("propertyAddress", e.target.value)}
                      placeholder="Full address of the rented property"
                      rows={2}
                      className={InputStyle("resize-none")}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Property Type" mr="मालमत्तेचा प्रकार">
                      <div className="relative">
                        <select
                          value={form.propertyType}
                          onChange={e => set("propertyType", e.target.value)}
                          className={SelectStyle()}
                        >
                          {["1BHK", "2BHK", "3BHK", "3BHK+", "Commercial"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                    <Field label="Furnished Status" mr="फर्निशिंग">
                      <div className="relative">
                        <select
                          value={form.furnishedStatus}
                          onChange={e => set("furnishedStatus", e.target.value)}
                          className={SelectStyle()}
                        >
                          {["Fully Furnished", "Semi-Furnished", "Unfurnished"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                  </div>
                </SectionCard>

                {/* Financial */}
                <SectionCard title="Financial Terms" mr="आर्थिक अटी">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Monthly Rent (₹)" mr="मासिक भाडे">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={form.monthlyRent}
                          onChange={e => set("monthlyRent", e.target.value.replace(/\D/g, ""))}
                          placeholder="15000"
                          className={InputStyle("pl-8")}
                        />
                      </div>
                    </Field>
                    <Field label="Security Deposit (₹)" mr="सिक्युरिटी ठेव">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={form.securityDeposit}
                          onChange={e => set("securityDeposit", e.target.value.replace(/\D/g, ""))}
                          placeholder="30000"
                          className={InputStyle("pl-8")}
                        />
                      </div>
                    </Field>
                  </div>
                </SectionCard>

                {/* Agreement Terms */}
                <SectionCard title="Agreement Terms" mr="करार अटी">
                  <Field label="Agreement Start Date" mr="प्रारंभ तारीख">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => set("startDate", e.target.value)}
                      className={InputStyle()}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Duration (months)" mr="कालावधी (महिने)">
                      <div className="relative">
                        <select
                          value={form.duration}
                          onChange={e => set("duration", e.target.value)}
                          className={SelectStyle()}
                        >
                          {["6", "11", "12", "24", "36"].map(d => (
                            <option key={d} value={d}>{d} months</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                    <Field label="Lock-in Period (months)" mr="लॉक-इन कालावधी">
                      <div className="relative">
                        <select
                          value={form.lockInPeriod}
                          onChange={e => set("lockInPeriod", e.target.value)}
                          className={SelectStyle()}
                        >
                          {["0", "1", "2", "3", "6"].map(m => (
                            <option key={m} value={m}>{m === "0" ? "No lock-in" : `${m} month${m === "1" ? "" : "s"}`}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                  </div>
                </SectionCard>

                {/* Utilities */}
                <SectionCard title="Utility Responsibilities" mr="देखभाल जबाबदारी">
                  <Field label="Maintenance Charges" mr="देखरेखीचा खर्च">
                    <PayerToggle value={form.maintenancePaidBy} onChange={v => set("maintenancePaidBy", v)} />
                  </Field>
                  <Field label="Electricity Bill" mr="वीज बिल">
                    <PayerToggle value={form.electricityPaidBy} onChange={v => set("electricityPaidBy", v)} />
                  </Field>
                  <Field label="Water Bill" mr="पाण्याचे बिल">
                    <PayerToggle value={form.waterPaidBy} onChange={v => set("waterPaidBy", v)} />
                  </Field>
                </SectionCard>

                {/* Error */}
                {error && (
                  <div className="bg-oxblood/5 border border-oxblood/15 rounded-xl px-4 py-3 text-sm text-oxblood font-sans">
                    {error}
                  </div>
                )}

                {/* Price + CTA */}
                <div className="bg-oxblood rounded-2xl p-7 border border-gold/20">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-gold font-bold text-base font-sans tracking-tight">Ready to generate?</h3>
                      <p className="text-gold/50 text-xs font-devanagari mt-1">AI द्वारे Maharashtra करार तयार होईल</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-gold font-bold text-2xl font-sans tracking-tight">₹299</div>
                      <div className="text-gold/40 text-xs font-sans">one-time</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {["5 min mein ready", "Maharashtra format", "Print-ready PDF"].map(tag => (
                      <span key={tag} className="bg-gold/10 text-gold/70 text-xs px-2.5 py-1 rounded-full font-sans border border-gold/15">{tag}</span>
                    ))}
                  </div>

                  <button
                    onClick={handlePayAndGenerate}
                    disabled={!isValid() || paying}
                    className="w-full py-4 rounded-xl bg-gold text-oxblood-dark font-bold text-sm tracking-wide transition-all hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed font-sans flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-oxblood/30 border-t-oxblood rounded-full animate-spin" />
                        Opening payment…
                      </>
                    ) : (
                      "Pay ₹299 and Generate Agreement"
                    )}
                  </button>

                  {!isValid() && (
                    <p className="text-gold/50 text-xs text-center mt-2 font-sans">
                      Fill all required fields to continue
                    </p>
                  )}

                  {process.env.NODE_ENV === "development" && (
                    <button
                      onClick={handleTestGenerate}
                      disabled={!isValid()}
                      className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-gold/40 text-gold/60 hover:text-gold hover:border-gold/70 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
                    >
                      [DEV] Test Generate — skip payment
                    </button>
                  )}
                </div>

                {/* Trust note */}
                <p className="text-center text-xs text-ink/25 font-sans">
                  Secure payment via Razorpay · Your data is not stored · 10,000+ agreements generated
                </p>

              </div>
            )}

            {/* ── GENERATING STEP ── */}
            {step === "generating" && (
              <div className="flex flex-col items-center justify-center py-24 gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
                <div className="text-center">
                  <h2 className="text-xl font-bold text-oxblood font-sans mb-1">Generating your agreement…</h2>
                  <p className="text-ink/50 text-sm font-devanagari">तुमचा करार तयार होत आहे, कृपया थांबा</p>
                  <p className="text-ink/35 text-xs font-sans mt-3">This usually takes 20–40 seconds</p>
                </div>
              </div>
            )}

            {/* ── DONE STEP ── */}
            {step === "done" && (
              <div>
                {/* Actions bar (hidden in print) */}
                <div className="no-print space-y-4 mb-6">

                  {/* Disclaimer banner */}
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

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleDownloadPDF}
                      className="flex-1 flex items-center justify-center gap-2 bg-oxblood text-gold border border-gold/25 py-3.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-oxblood-dark transition-colors font-sans"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF
                    </button>
                    <button
                      onClick={() => { setStep("form"); setAgreement(""); setDisclaimer(""); }}
                      className="sm:flex-none flex items-center justify-center gap-2 border border-gold/15 text-ink/50 hover:text-oxblood hover:border-gold/40 py-3.5 px-5 rounded-xl text-sm font-semibold transition-colors font-sans"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>

                {/* Agreement document */}
                <div
                  id="agreement-print-area"
                  className="bg-white rounded-2xl border border-gold/15 overflow-hidden"
                >
                  <div className="no-print">
                    <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40" />
                    <div className="px-5 py-4 border-b border-gold/10 flex items-center justify-between">
                      <h2 className="text-oxblood font-bold text-sm font-sans tracking-wide">Agreement Document</h2>
                      <span className="text-ink/25 text-xs font-sans">Scroll to read · Print to save</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div id="agreement-scroll" className="max-h-[60vh] overflow-y-auto">
                      <div className="whitespace-pre-wrap text-sm text-ink leading-relaxed font-sans">
                        {agreement}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="no-print bg-oxblood px-6 py-10 text-center mt-auto">
          <p className="text-gold/60 text-sm font-sans">
            © {year} Mudrankseva. All rights reserved.
          </p>
          <p className="text-gold/25 text-xs mt-2 font-sans">
            Maharashtra Property Services · AI-Powered Legal Documents
          </p>
        </footer>

      </div>
    </>
  );
}
