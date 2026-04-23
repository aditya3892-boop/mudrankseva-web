"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTENT, FEATURES, type Lang } from "@/lib/content";

/* ── Icons (gold-coloured via text-gold on parent) ─────────────────── */
const ICONS = [
  /* 1 Stamp Duty Calculator */
  <svg key="0" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="7" x2="16" y2="7"/>
    <circle cx="8.5" cy="12" r="0.7" fill="currentColor"/>
    <circle cx="12" cy="12" r="0.7" fill="currentColor"/>
    <circle cx="15.5" cy="12" r="0.7" fill="currentColor"/>
    <circle cx="8.5" cy="16" r="0.7" fill="currentColor"/>
    <circle cx="12" cy="16" r="0.7" fill="currentColor"/>
    <line x1="14" y1="16" x2="17" y2="16"/>
  </svg>,

  /* 2 Market Value Finder */
  <svg key="1" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <path d="M11 7a4 4 0 0 1 4 4"/>
  </svg>,

  /* 3 7/12 Health Check */
  <svg key="2" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L4 5v5c0 4.5 3.5 8.7 8 10 4.5-1.3 8-5.5 8-10V5l-8-3z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>,

  /* 4 Gazette Name Change */
  <svg key="3" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>,

  /* 5 Automated Deed Drafting */
  <svg key="4" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="13" y2="17"/>
    <path d="M15 16l1.5 1.5L19 15"/>
  </svg>,

  /* 6 Digital Rent Agreement */
  <svg key="5" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </svg>,

  /* 7 Vertical Property Card */
  <svg key="6" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/>
    <rect x="7" y="3" width="10" height="18" rx="1"/>
    <line x1="10" y1="9" x2="14" y2="9"/>
    <line x1="10" y1="13" x2="14" y2="13"/>
    <line x1="10" y1="17" x2="14" y2="17"/>
  </svg>,

  /* 8 Mutation (Ferfar) Alerts */
  <svg key="7" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    <circle cx="19" cy="4" r="2.5" fill="currentColor" stroke="none"/>
  </svg>,

  /* 9 Property Tax Transfer */
  <svg key="8" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
    <path d="M0 12l2-2m20 2l-2-2"/>
  </svg>,

  /* 10 Public Notice AI */
  <svg key="9" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    <circle cx="19" cy="5" r="2" fill="currentColor" stroke="none"/>
  </svg>,

  /* 11 Certified Valuation */
  <svg key="10" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    <polyline points="10 8 11.5 9.5 14 7"/>
  </svg>,

  /* 12 Index-II Retrieval */
  <svg key="11" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
  </svg>,

  /* 13 Society NOC Portal */
  <svg key="12" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <polyline points="16 11 18 13 22 9"/>
  </svg>,

  /* 14 Heirship Assistant */
  <svg key="13" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="3" r="2"/>
    <path d="M12 5v5"/>
    <path d="M9 10h6"/>
    <path d="M9 10v3"/>
    <path d="M15 10v3"/>
    <circle cx="6" cy="17" r="2"/>
    <circle cx="18" cy="17" r="2"/>
  </svg>,

  /* 15 Adjudication Tracker */
  <svg key="14" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>,
];

/* ── Page ───────────────────────────────────────────────────────────── */
export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const c = CONTENT[lang];
  const isMr = lang === "mr";
  const hFont = isMr ? "font-devanagari" : "font-sans";
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">

      {/* ── Header ── */}
      <header className="bg-oxblood px-5 py-3 flex items-center justify-between gap-4">
        <div className="rounded-xl overflow-hidden border border-gold/30 bg-cream px-3 py-1.5 flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="Mudrankseva — मुद्रांकसेवा"
            width={200}
            height={48}
            priority
            className="h-11 w-auto object-contain"
          />
        </div>

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
            {c.headerBadge}
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center px-6 py-16 text-center bg-cream">
        <div className={`inline-flex items-center gap-2 bg-oxblood/10 text-oxblood text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase ${hFont}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
          {c.comingSoon}
        </div>

        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-oxblood leading-tight mb-4 max-w-3xl ${hFont}`}>
          {c.heroTitle[0]}<br />{c.heroTitle[1]}
        </h1>

        <p className={`max-w-lg text-ink/55 text-sm sm:text-base leading-relaxed ${hFont}`}>
          {c.heroDesc}
        </p>
      </section>

      {/* ── Services grid ── */}
      <section className="px-6 py-14 bg-oxblood/[0.04]">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className={`text-2xl font-bold text-oxblood mb-1.5 ${hFont}`}>
              {c.servicesTitle}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-gold/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-gold" />
              <div className="h-px w-10 bg-gold/50" />
            </div>
            <p className={`text-ink/40 text-sm ${hFont}`}>{c.servicesSubtitle}</p>
          </div>

          {/* 15-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 flex flex-col gap-2.5 border border-gold/15 hover:border-gold/50 hover:shadow-md transition-all duration-200 group"
              >
                {/* Icon — gold */}
                <div className="text-gold mb-0.5">{ICONS[i]}</div>

                {/* Title — oxblood, switches with lang */}
                <h3 className={`font-bold text-oxblood text-sm leading-snug ${isMr ? "font-devanagari" : "font-sans"}`}>
                  {isMr ? f.titleMr : f.titleEn}
                </h3>

                {/* English description — always visible */}
                <p className="text-xs text-ink/55 leading-relaxed font-sans">
                  {f.descEn}
                </p>

                {/* Thin gold rule */}
                <div className="h-px bg-gold/20 my-0.5" />

                {/* Marathi description — always visible */}
                <p className="text-xs text-oxblood/50 font-devanagari leading-relaxed flex-1">
                  {f.descMr}
                </p>

                {/* Coming soon pill */}
                <span className={`self-start mt-1 text-xs font-semibold text-gold border border-gold/40 px-2.5 py-0.5 rounded-full ${hFont}`}>
                  {c.comingSoon}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-oxblood px-6 py-8 text-center">
        <p className={`text-gold/80 text-sm ${hFont}`}>
          © {year} {c.footerBrand}. {c.footerRights}
        </p>
        <p className={`text-gold/40 text-xs mt-1.5 ${hFont}`}>
          {c.footerTagline}
        </p>
      </footer>
    </div>
  );
}
