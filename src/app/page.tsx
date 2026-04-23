"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTENT, type Lang } from "@/lib/content";

const ICONS = [
  /* Stamp Duty Calculator */
  <svg key="calc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <circle cx="8.5" cy="12" r="0.75" fill="currentColor" />
    <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    <circle cx="15.5" cy="12" r="0.75" fill="currentColor" />
    <circle cx="8.5" cy="16" r="0.75" fill="currentColor" />
    <circle cx="12" cy="16" r="0.75" fill="currentColor" />
    <line x1="14" y1="16" x2="17" y2="16" />
  </svg>,
  /* 7/12 OCR Scanner */
  <svg key="scan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="10" x2="10" y2="10" />
  </svg>,
  /* Property Tax Transfer */
  <svg key="house" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>,
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const c = CONTENT[lang];
  const isMr = lang === "mr";
  const textFont = isMr ? "font-devanagari" : "font-sans";
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">

      {/* ── Header ── */}
      <header className="bg-oxblood px-5 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
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

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="flex items-center rounded-full border border-gold/50 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`px-3.5 py-1.5 transition-colors ${
                lang === "en"
                  ? "bg-gold text-oxblood-dark"
                  : "text-gold/70 hover:text-gold"
              }`}
            >
              EN
            </button>
            <span className="w-px h-4 bg-gold/30" />
            <button
              onClick={() => setLang("mr")}
              className={`px-3.5 py-1.5 font-devanagari transition-colors ${
                lang === "mr"
                  ? "bg-gold text-oxblood-dark"
                  : "text-gold/70 hover:text-gold"
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Maharashtra badge */}
          <span className={`hidden sm:inline text-xs text-gold/80 border border-gold/40 rounded-full px-3 py-1 tracking-widest uppercase ${isMr ? "font-devanagari tracking-normal" : ""}`}>
            {c.headerBadge}
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Coming soon badge */}
        <div className={`inline-flex items-center gap-2 bg-oxblood/10 text-oxblood text-xs font-semibold px-4 py-1.5 rounded-full mb-10 tracking-widest uppercase ${textFont}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
          {c.comingSoon}
        </div>

        {/* Headline */}
        <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-oxblood leading-tight mb-4 max-w-3xl ${textFont}`}>
          {c.heroTitle[0]}
          <br />
          {c.heroTitle[1]}
        </h2>

        {/* Description */}
        <p className={`max-w-lg text-ink/55 text-sm sm:text-base leading-relaxed ${textFont}`}>
          {c.heroDesc}
        </p>

        {/* Gold divider */}
        <div className="flex items-center gap-3 my-14">
          <div className="h-px w-14 bg-gold/60" />
          <div className="w-2 h-2 rotate-45 bg-gold" />
          <div className="h-px w-14 bg-gold/60" />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl w-full">
          {c.features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-gold/20 hover:border-gold/55 hover:shadow-lg transition-all duration-200 text-left group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-oxblood/8 flex items-center justify-center text-oxblood group-hover:bg-oxblood/13 transition-colors">
                {ICONS[i]}
              </div>

              {/* Title */}
              <h3 className={`font-semibold text-ink text-base leading-snug ${textFont}`}>
                {f.title}
              </h3>

              {/* Description */}
              <p className={`text-xs text-ink/45 leading-relaxed flex-1 ${textFont}`}>
                {f.desc}
              </p>

              {/* Coming soon pill */}
              <span className={`self-start text-xs font-semibold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full tracking-wide ${textFont}`}>
                {c.comingSoon}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-oxblood px-6 py-8 text-center">
        <p className={`text-gold/80 text-sm ${textFont}`}>
          © {year} {c.footerBrand}. {c.footerRights}
        </p>
        <p className={`text-gold/40 text-xs mt-1.5 ${textFont}`}>
          {c.footerTagline}
        </p>
      </footer>
    </div>
  );
}
