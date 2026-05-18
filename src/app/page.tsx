"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Lang } from "@/lib/content";
import { Header } from "@/components/Header";
import { Nav } from "@/components/Nav";

/* ── Active services ─────────────────────────────────────────────── */
const ACTIVE = [
  {
    href: "/calculator",
    titleEn: "Stamp Duty Calculator",
    titleMr: "मुद्रांक शुल्क कॅल्क्युलेटर",
    descEn: "Calculate stamp duty and registration charges for any Maharashtra property transaction. District-accurate, 2026–27 rates.",
    descMr: "महाराष्ट्रातील मालमत्ता व्यवहारांसाठी मुद्रांक शुल्क व नोंदणी शुल्क मोजा — जिल्हानिहाय.",
    ctaEn: "Open Calculator",
    ctaMr: "कॅल्क्युलेटर उघडा",
    price: null,
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="7" x2="16" y2="7"/>
        <circle cx="8.5" cy="12" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="12" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="8.5" cy="16" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none"/>
        <line x1="14" y1="16" x2="17" y2="16"/>
      </svg>
    ),
  },
  {
    href: "/rent-agreement",
    titleEn: "Rent Agreement Generator",
    titleMr: "भाडेकरार जनरेटर",
    descEn: "Generate a legally formatted Maharashtra Leave & License Agreement in minutes. AI-drafted, print-ready, court compliant.",
    descMr: "AI द्वारे महाराष्ट्र Leave & License करार काही मिनिटांत तयार करा — प्रिंट-रेडी.",
    ctaEn: "Generate Agreement",
    ctaMr: "करार तयार करा",
    price: "from ₹299",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
        <path d="M15 17l1.5 1.5L19 16"/>
      </svg>
    ),
  },
  {
    href: "/sales-deed",
    titleEn: "Sale Deed Generator",
    titleMr: "विक्री खत जनरेटर",
    descEn: "Generate a Maharashtra Sale Deed for property transfers. AI-drafted under Registration Act 1908 and Transfer of Property Act 1882.",
    descMr: "मालमत्ता हस्तांतरणासाठी AI-निर्मित विक्री खत — नोंदणी अधिनियम १९०८ अंतर्गत तयार.",
    ctaEn: "Generate Sale Deed",
    ctaMr: "विक्री खत तयार करा",
    price: "from ₹499",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    href: "/gift-deed",
    titleEn: "Gift Deed Generator",
    titleMr: "भेट खत जनरेटर",
    descEn: "Generate a Maharashtra Gift Deed for property gifted to family members. AI-drafted under Transfer of Property Act 1882 with mandatory registration.",
    descMr: "कुटुंबाला मालमत्ता भेट देण्यासाठी AI-निर्मित भेट खत — हस्तांतरण मालमत्ता अधिनियम १८८२ अंतर्गत.",
    ctaEn: "Generate Gift Deed",
    ctaMr: "भेट खत तयार करा",
    price: "from ₹499",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    href: "/poa",
    titleEn: "Power of Attorney",
    titleMr: "मुखत्यारपत्र",
    descEn: "Generate a Maharashtra Power of Attorney — General, Specific, Property, Financial, or Legal. AI-drafted under Power of Attorney Act 1882.",
    descMr: "सर्वसाधारण, मालमत्ता, आर्थिक किंवा कायदेशीर मुखत्यारपत्र — मुखत्यारनामा अधिनियम १८८२ अंतर्गत.",
    ctaEn: "Generate POA",
    ctaMr: "मुखत्यारपत्र तयार करा",
    price: "from ₹399",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    ),
  },
];

/* ── Coming soon services ─────────────────────────────────────────── */
const COMING = [
  {
    titleEn: "Property Mutation Tracker",
    titleMr: "मालमत्ता फेरफार ट्रॅकर",
    descEn: "Track property mutation status across all Maharashtra districts.",
    descMr: "महाराष्ट्रातील सर्व जिल्ह्यांमध्ये फेरफार स्थिती ट्रॅक करा.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    titleEn: "7/12 Utara Records",
    titleMr: "७/१२ उतारा नोंदी",
    descEn: "Digital access to 7/12 land records from all districts.",
    descMr: "सर्व जिल्ह्यांचे ७/१२ उतारा जमीन अभिलेख.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
      </svg>
    ),
  },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function Home() {
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
  const hFont = isMr ? "font-devanagari" : "font-sans";
  const year = new Date().getFullYear();

  const [waitlistInput, setWaitlistInput] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistInput.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem("mudrankseva_waitlist") ?? "[]") as {input: string; timestamp: string; city: string}[];
      existing.push({ input: waitlistInput.trim(), timestamp: new Date().toISOString(), city: "" });
      localStorage.setItem("mudrankseva_waitlist", JSON.stringify(existing));
    } catch { /* ignore storage errors */ }
    setWaitlistDone(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">

      {/* ── Header ── */}
      <Header />
      <Nav />

      {/* ── Hero ── */}
      <section className="flex flex-col items-center px-6 py-24 sm:py-32 text-center bg-cream">
        <p className="text-[11px] text-gold/60 font-sans uppercase tracking-[0.2em] mb-8">
          {isMr ? "महाराष्ट्र मालमत्ता सेवा" : "Maharashtra Property Services"}
        </p>

        <h1 className={`text-4xl sm:text-5xl font-bold text-oxblood leading-[1.1] tracking-tight mb-6 max-w-xl ${hFont}`}>
          {isMr ? (
            <>महाराष्ट्रासाठी<br />मालमत्ता सेवा.</>
          ) : (
            <>Property Services,<br />Built for Maharashtra.</>
          )}
        </h1>

        <p className={`max-w-sm text-ink/45 text-base leading-relaxed ${hFont}`}>
          {isMr
            ? "मुद्रांक शुल्क, भाडेकरार आणि मालमत्ता अनुपालनासाठी डिजिटल साधने."
            : "Expert digital tools for stamp duty, rent agreements, and property compliance."}
        </p>

        {/* Service pricing strip */}
        <div className="flex items-center gap-x-3 gap-y-2 mt-6 flex-wrap justify-center">
          {[
            { en: "Rent Agreement", mr: "भाडेकरार", price: isMr ? "₹२९९ पासून" : "from ₹299" },
            { en: "POA",            mr: "मुखत्यारपत्र", price: isMr ? "₹३९९ पासून" : "from ₹399" },
            { en: "Sale Deed",      mr: "विक्री खत", price: isMr ? "₹४९९ पासून" : "from ₹499" },
            { en: "Gift Deed",      mr: "भेट खत",    price: isMr ? "₹४९९ पासून" : "from ₹499" },
          ].map((s, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-ink/15 font-sans text-xs select-none">·</span>}
              <span className={`text-xs text-ink/35 ${isMr ? "font-devanagari" : "font-sans"}`}>{isMr ? s.mr : s.en}</span>
              <span className="text-xs font-bold text-oxblood bg-gold/15 border border-gold/20 px-2 py-0.5 rounded-full font-sans tracking-wide">{s.price}</span>
            </span>
          ))}
        </div>

        {/* Bilingual crossover line */}
        <p className={`mt-3 text-xs text-ink/25 ${isMr ? "font-sans" : "font-devanagari"}`}>
          {isMr
            ? "Stamp Duty · Rent Agreement · Property Records"
            : "मुद्रांक शुल्क · भाडेकरार · मालमत्ता नोंदी"}
        </p>
      </section>

      {/* ── Active services ── */}
      <section className="px-6 pb-20 bg-cream">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* ── Featured: Stamp Duty Calculator ── */}
          {(() => {
            const calc = ACTIVE.find(s => s.href === "/calculator")!;
            return (
              <Link
                href={calc.href}
                className="group flex items-center justify-between bg-oxblood rounded-2xl border border-gold/20 hover:border-gold/40 hover:shadow-xl transition-all duration-300 overflow-hidden px-7 py-6 gap-6"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <span className="text-gold flex-shrink-0">{calc.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap mb-1">
                      <h2 className={`text-lg font-bold text-gold leading-snug ${isMr ? "font-devanagari" : "font-sans"}`}>
                        {isMr ? "मोफत मुद्रांक शुल्क कॅल्क्युलेटर" : "Free Stamp Duty Calculator"}
                      </h2>
                      <span className="text-[10px] font-bold font-sans text-oxblood bg-gold px-2.5 py-0.5 rounded-full tracking-wide flex-shrink-0">
                        {isMr ? "मोफत" : "Free"}
                      </span>
                    </div>
                    <p className={`text-sm text-gold/50 leading-snug ${isMr ? "font-devanagari" : "font-sans"}`}>
                      {isMr ? "तुमचे मुद्रांक शुल्क आणि नोंदणी शुल्क त्वरित मोजा" : "Calculate your stamp duty and registration charges instantly"}
                    </p>
                    <p className={`text-xs text-gold/30 mt-0.5 ${isMr ? "font-sans" : "font-devanagari"}`}>
                      {isMr ? calc.titleEn : calc.titleMr}
                    </p>
                  </div>
                </div>
                <span className="text-gold text-xl flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            );
          })()}

          {/* ── Paid service cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ACTIVE.filter(s => s.href !== "/calculator").map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col bg-white rounded-2xl border border-gold/20 hover:border-gold/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-[2px] bg-gradient-to-r from-gold/60 via-gold to-gold/60 flex-shrink-0" />
                <div className="flex flex-col flex-1 p-7 gap-6">
                  <div className="flex items-start justify-between">
                    <span className="text-gold">{s.icon}</span>
                    {s.price && (
                      <span className="text-xs font-bold text-oxblood bg-gold/15 border border-gold/25 px-2.5 py-0.5 rounded-full font-sans tracking-wide">
                        {s.price}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold text-oxblood leading-snug mb-1 ${isMr ? "font-devanagari" : "font-sans"}`}>
                      {isMr ? s.titleMr : s.titleEn}
                    </h2>
                    <p className={`text-xs text-ink/35 ${isMr ? "font-sans" : "font-devanagari"}`}>
                      {isMr ? s.titleEn : s.titleMr}
                    </p>
                  </div>
                  <p className={`text-sm text-ink/50 leading-relaxed flex-1 ${isMr ? "font-devanagari" : "font-sans"}`}>
                    {isMr ? s.descMr : s.descEn}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-oxblood">
                    <span className={hFont}>{isMr ? s.ctaMr : s.ctaEn}</span>
                    <span className="text-gold transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Coming soon ── */}
      <section className="px-6 pt-10 pb-24 border-t border-gold/10 bg-cream">
        <div className="max-w-3xl mx-auto">
          {/* Divider label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gold/15" />
            <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-ink/25">
              {isMr ? "लवकरच येणार" : "Coming Soon"}
            </span>
            <div className="h-px flex-1 bg-gold/15" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COMING.map((s) => (
              <div
                key={s.titleEn}
                className="bg-white/60 rounded-xl border border-gold/10 p-5"
              >
                <span className="text-ink/20 block mb-3.5">{s.icon}</span>

                <h3 className={`text-sm font-semibold text-ink/40 leading-snug mb-1 ${isMr ? "font-devanagari" : "font-sans"}`}>
                  {isMr ? s.titleMr : s.titleEn}
                </h3>

                <p className={`text-xs text-ink/30 leading-relaxed mb-4 ${isMr ? "font-devanagari" : "font-sans"}`}>
                  {isMr ? s.descMr : s.descEn}
                </p>

                <span className="inline-block text-[9px] font-sans uppercase tracking-widest text-ink/20 border border-ink/10 px-2 py-0.5 rounded-full">
                  {isMr ? "लवकरच" : "Coming Soon"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 border-t border-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Trusted by property owners across Maharashtra
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Over 500 agreements processed · 4.8 ★ average rating
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rahul Deshmukh',
                location: 'Pune',
                text: 'Got my rent agreement done in under 2 hours. No SRO visit, no hassle. The PDF was perfectly formatted and my tenant accepted it immediately.',
                service: 'Rent Agreement',
              },
              {
                name: 'Priya Joshi',
                location: 'Mumbai',
                text: 'The stamp duty calculator saved me from overpaying. I had no idea the ready reckoner rate was different for my area. Very transparent pricing.',
                service: 'Stamp Duty Calculator',
              },
              {
                name: 'Santosh Patil',
                location: 'Pune',
                text: 'Doorstep registration was smooth. The executive came on time, collected biometrics, and the registered document was in my email the next day.',
                service: 'Doorstep Registration',
              },
              {
                name: 'Meera Kulkarni',
                location: 'Thane',
                text: 'I needed a gift deed for transferring property to my daughter. The team explained the stamp duty difference for relatives clearly. Highly recommend.',
                service: 'Gift Deed',
              },
              {
                name: 'Vijay Shinde',
                location: 'Pimpri-Chinchwad',
                text: 'Used Mudrankseva for my shop rent agreement. Marathi version was accurate and the landlord was happy with the document quality.',
                service: 'Rent Agreement',
              },
              {
                name: 'Anita Marathe',
                location: 'Aurangabad',
                text: 'POA for my NRI brother was done without any back and forth. Clear instructions, fast turnaround, and the document held up at the bank without any issues.',
                service: 'Power of Attorney',
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {'★★★★★'}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location} · {t.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doorstep Waitlist ── */}
      <section className="px-6 py-20 bg-cream border-t border-gold/10">
        <div className="max-w-lg mx-auto">
          <div className="bg-oxblood rounded-3xl p-8 sm:p-12 text-center border border-gold/15">

            <span className="inline-block text-[10px] font-sans uppercase tracking-[0.18em] text-gold/40 border border-gold/20 px-3 py-1 rounded-full mb-6">
              {isMr ? "लवकरच येत आहे" : "Coming Soon"}
            </span>

            <h2 className={`text-2xl sm:text-3xl font-bold text-gold leading-tight mb-3 ${hFont}`}>
              {isMr ? "घरपोच नोंदणी" : "Doorstep Registration"}
            </h2>

            <p className={`text-gold/55 text-sm leading-relaxed mb-1.5 ${hFont}`}>
              {isMr
                ? "आमचा प्रतिनिधी घरी येतो, बायोमेट्रिक घेतो आणि नोंदणी पूर्ण करतो."
                : "Our agent visits your home, collects biometrics and completes registration."}
            </p>
            <p className={`text-gold/30 text-xs leading-relaxed mb-2 ${isMr ? "font-sans" : "font-devanagari"}`}>
              {isMr
                ? "Available in Pune, Mumbai, Nashik and more cities."
                : "पुणे, मुंबई, नाशिक व इतर शहरांमध्ये उपलब्ध होणार."}
            </p>

            <p className="text-gold/40 text-xs font-sans mb-8 tracking-wide">
              {isMr ? "₹९९९ पासून" : "Starting ₹999"}
            </p>

            {waitlistDone ? (
              <div className="bg-gold/10 border border-gold/25 rounded-xl px-5 py-4 text-gold text-sm font-sans">
                ✓ {isMr ? "धन्यवाद! आम्ही लवकरच संपर्क करू." : "You're on the list. We'll be in touch soon."}
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={waitlistInput}
                  onChange={e => setWaitlistInput(e.target.value)}
                  placeholder={isMr ? "ईमेल किंवा फोन नंबर" : "Email or phone number"}
                  className={`flex-1 px-4 py-3 rounded-xl bg-white/10 border border-gold/25 text-gold placeholder:text-gold/30 text-sm outline-none focus:border-gold/55 transition-colors ${isMr ? "font-devanagari" : "font-sans"}`}
                />
                <button
                  type="submit"
                  disabled={!waitlistInput.trim()}
                  className={`px-6 py-3 rounded-xl bg-gold text-oxblood font-bold text-sm tracking-wide hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap ${isMr ? "font-devanagari" : "font-sans"}`}
                >
                  {isMr ? "प्रतीक्षा यादीत सामील व्हा" : "Join Waitlist"}
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-oxblood px-6 py-10 text-center mt-auto">
        <p className="text-gold/60 text-sm font-sans">
          © {year} Mudrankseva. All rights reserved.
        </p>
        <p className="text-gold/30 text-xs mt-2 font-sans tracking-wide">
          Maharashtra Property Services · Digital. Accurate. Compliant.
        </p>
        <p className="text-gold/20 text-xs mt-1 font-devanagari">
          महाराष्ट्र मालमत्ता सेवा
        </p>
      </footer>

    </div>
  );
}
