"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONTENT, DISTRICTS, type Lang } from "@/lib/content";

/* ── Types ──────────────────────────────────────────────────────────── */
type AreaType = "corporation" | "council" | "rural";
type Gender = "male" | "female";

interface CalcResult {
  propValue: number;
  isFemale: boolean;
  baseRate: number;
  baseAmt: number;
  metroCessAmt: number | null;
  lbtAmt: number | null;
  totalDutyRate: number;
  totalDutyAmt: number;
  regFeeAmt: number;
  regFeeCapped: boolean;
  grandTotal: number;
}

/* ── Calculation logic ──────────────────────────────────────────────── */
function calculate(value: number, area: AreaType, gender: Gender): CalcResult {
  const isFemale = gender === "female";
  const baseRate = isFemale ? 0.04 : 0.05;
  const metroCessRate = area === "corporation" ? 0.01 : null;
  const lbtRate = area === "corporation" || area === "council" ? 0.01 : null;

  const baseAmt = value * baseRate;
  const metroCessAmt = metroCessRate ? value * metroCessRate : null;
  const lbtAmt = lbtRate ? value * lbtRate : null;
  const totalDutyRate = baseRate + (metroCessRate ?? 0) + (lbtRate ?? 0);
  const totalDutyAmt = baseAmt + (metroCessAmt ?? 0) + (lbtAmt ?? 0);

  const rawReg = value * 0.01;
  const regFeeAmt = Math.min(rawReg, 30000);

  return {
    propValue: value,
    isFemale,
    baseRate,
    baseAmt,
    metroCessAmt,
    lbtAmt,
    totalDutyRate,
    totalDutyAmt,
    regFeeAmt,
    regFeeCapped: rawReg > 30000,
    grandTotal: totalDutyAmt + regFeeAmt,
  };
}

/* ── Formatters ─────────────────────────────────────────────────────── */
function inr(n: number) {
  return (
    "₹" +
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
  );
}

function pct(r: number) {
  return `${(r * 100).toFixed(0)}%`;
}

/* ── Row component ──────────────────────────────────────────────────── */
function Row({
  label,
  value,
  rate,
  bold,
  highlight,
  note,
}: {
  label: string;
  value: string;
  rate?: string;
  bold?: boolean;
  highlight?: boolean;
  note?: string;
}) {
  if (highlight) {
    return (
      <div className="flex items-center justify-between bg-oxblood rounded-lg px-4 py-3 mt-1">
        <span className="text-gold font-bold text-sm">{label}</span>
        <span className="text-gold font-bold text-base">{value}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-start justify-between py-2 ${bold ? "font-semibold" : ""}`}>
      <span className={`text-sm ${bold ? "text-ink" : "text-ink/65"}`}>
        {label}
        {note && <span className="ml-1.5 text-xs text-gold font-normal">{note}</span>}
      </span>
      <span className={`text-sm text-right ml-4 ${bold ? "text-ink" : "text-ink/80"}`}>
        {rate && <span className="text-xs text-ink/40 mr-1.5">({rate})</span>}
        {value}
      </span>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function Calculator() {
  const [lang, setLang] = useState<Lang>("en");
  const c = CONTENT[lang];
  const cc = c.calc;
  const isMr = lang === "mr";
  const hFont = isMr ? "font-devanagari" : "font-sans";

  /* Form state */
  const [rawValue, setRawValue] = useState("");
  const [district, setDistrict] = useState<(typeof DISTRICTS)[0] | null>(null);
  const [distQuery, setDistQuery] = useState("");
  const [distOpen, setDistOpen] = useState(false);
  const [areaType, setAreaType] = useState<AreaType>("corporation");
  const [gender, setGender] = useState<Gender>("male");
  const [surveyNo, setSurveyNo] = useState("");

  /* District dropdown click-outside */
  const distRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (distRef.current && !distRef.current.contains(e.target as Node)) {
        setDistOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* Filtered districts */
  const filteredDist = useMemo(() => {
    const q = distQuery.toLowerCase();
    return DISTRICTS.filter(
      (d) => d.en.toLowerCase().includes(q) || d.mr.includes(distQuery)
    );
  }, [distQuery]);

  /* Parse property value */
  const propValue = useMemo(() => {
    const n = parseFloat(rawValue.replace(/,/g, ""));
    return !isNaN(n) && n > 0 ? n : null;
  }, [rawValue]);

  /* Live calculation */
  const result = useMemo<CalcResult | null>(() => {
    if (!propValue) return null;
    return calculate(propValue, areaType, gender);
  }, [propValue, areaType, gender]);

  /* ── Render ── */
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">

      {/* ── Header ── */}
      <header className="bg-oxblood px-5 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-xl overflow-hidden border border-gold/30 bg-cream px-3 py-1.5 flex-shrink-0"
        >
          <Image
            src="/logo.jpg"
            alt="Mudrankseva"
            width={200}
            height={48}
            priority
            className="h-11 w-auto object-contain"
          />
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
            {c.headerBadge}
          </span>
        </div>
      </header>

      {/* ── Page header ── */}
      <div className="bg-oxblood/[0.04] border-b border-gold/15 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className={`text-xs text-oxblood/60 hover:text-oxblood transition-colors mb-2 inline-block ${hFont}`}
          >
            {cc.backHome}
          </Link>
          <h1 className={`text-2xl sm:text-3xl font-bold text-oxblood ${hFont}`}>
            {cc.pageTitle}
          </h1>
          <p className={`text-ink/50 text-sm mt-1 ${hFont}`}>{cc.subtitle}</p>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8">

          {/* ── Form ── */}
          <div className="space-y-6">

            {/* Property Value */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-1.5 ${hFont}`}>
                {cc.propValue}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">
                  ₹
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rawValue}
                  onChange={(e) =>
                    setRawValue(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder={cc.propValuePlaceholder}
                  className={`w-full pl-8 pr-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`}
                />
              </div>
              {rawValue && !propValue && (
                <p className="text-xs text-red-600 mt-1">Enter a valid amount.</p>
              )}
            </div>

            {/* District */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-1.5 ${hFont}`}>
                {cc.district}
              </label>
              <div className="relative" ref={distRef}>
                <input
                  type="text"
                  value={district && !distOpen ? (isMr ? district.mr : district.en) : distQuery}
                  onFocus={() => {
                    setDistOpen(true);
                    setDistQuery("");
                  }}
                  onChange={(e) => {
                    setDistQuery(e.target.value);
                    setDistrict(null);
                    setDistOpen(true);
                  }}
                  placeholder={cc.districtSearch}
                  className={`w-full px-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${isMr ? "font-devanagari" : "font-sans"}`}
                />
                {/* Chevron */}
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>

                {/* Dropdown list */}
                {distOpen && (
                  <ul className="absolute z-20 mt-1 w-full bg-white border border-gold/30 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {filteredDist.length === 0 ? (
                      <li className={`px-4 py-3 text-sm text-ink/40 ${hFont}`}>
                        {cc.districtNone}
                      </li>
                    ) : (
                      filteredDist.map((d) => (
                        <li
                          key={d.en}
                          onMouseDown={() => {
                            setDistrict(d);
                            setDistQuery("");
                            setDistOpen(false);
                          }}
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-oxblood/5 hover:text-oxblood transition-colors ${isMr ? "font-devanagari" : "font-sans"}`}
                        >
                          {isMr ? d.mr : d.en}
                          {!isMr && (
                            <span className="ml-2 text-xs text-ink/35 font-devanagari">{d.mr}</span>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Area Type */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-2 ${hFont}`}>
                {cc.areaType}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                {(["corporation", "council", "rural"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAreaType(a)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left sm:text-center ${hFont} ${
                      areaType === a
                        ? "bg-oxblood text-gold border-oxblood"
                        : "bg-white text-ink/70 border-gold/30 hover:border-gold/60"
                    }`}
                  >
                    {cc.areaTypes[a]}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-2 ${hFont}`}>
                {cc.gender}
              </label>
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${hFont} ${
                      gender === g
                        ? "bg-oxblood text-gold border-oxblood"
                        : "bg-white text-ink/70 border-gold/30 hover:border-gold/60"
                    }`}
                  >
                    <span>{g === "male" ? "♂" : "♀"}</span>
                    {cc.genders[g]}
                  </button>
                ))}
              </div>
              {gender === "female" && (
                <p className={`mt-2 text-xs text-gold bg-gold/10 border border-gold/25 rounded-lg px-3 py-1.5 ${hFont}`}>
                  {cc.femaleNote}
                </p>
              )}
            </div>

            {/* Survey / Gat Number */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-1.5 ${hFont}`}>
                {cc.surveyNo}
                <span className="ml-1.5 text-xs font-normal text-ink/40">
                  ({cc.surveyPlaceholder})
                </span>
              </label>
              <input
                type="text"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder={cc.surveyPlaceholder}
                className={`w-full px-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`}
              />
            </div>
          </div>

          {/* ── Result card ── */}
          <div className="lg:sticky lg:top-6 self-start">
            <div className="bg-white rounded-2xl border border-gold/30 overflow-hidden shadow-sm">

              {/* Card header */}
              <div className="bg-oxblood px-5 py-4">
                <h2 className={`text-gold font-bold text-base ${hFont}`}>
                  {cc.resultTitle}
                </h2>
              </div>

              <div className="px-5 py-4">
                {!result ? (
                  <p className={`text-sm text-ink/40 py-6 text-center ${hFont}`}>
                    {cc.resultEmpty}
                  </p>
                ) : (
                  <div>
                    {/* Summary */}
                    <div className="space-y-1 pb-3 border-b border-gold/15">
                      <Row
                        label={cc.propValueLabel}
                        value={inr(result.propValue)}
                        bold
                      />
                      {district && (
                        <Row
                          label={isMr ? "जिल्हा" : "District"}
                          value={isMr ? district.mr : district.en}
                        />
                      )}
                      <Row
                        label={cc.areaType}
                        value={cc.areaTypes[areaType]}
                      />
                      {surveyNo && (
                        <Row
                          label={cc.surveyNo}
                          value={surveyNo}
                        />
                      )}
                    </div>

                    {/* Duty breakdown */}
                    <div className="space-y-0.5 py-3 border-b border-gold/15">
                      <Row
                        label={cc.baseStampDuty}
                        value={inr(result.baseAmt)}
                        rate={pct(result.baseRate)}
                      />
                      {result.metroCessAmt !== null && (
                        <Row
                          label={cc.metroCess}
                          value={inr(result.metroCessAmt)}
                          rate="1%"
                        />
                      )}
                      {result.lbtAmt !== null && (
                        <Row
                          label={cc.lbt}
                          value={inr(result.lbtAmt)}
                          rate="1%"
                        />
                      )}
                    </div>

                    {/* Totals */}
                    <div className="space-y-0.5 py-3 border-b border-gold/15">
                      <Row
                        label={cc.stampDutyTotal}
                        value={inr(result.totalDutyAmt)}
                        rate={pct(result.totalDutyRate)}
                        bold
                      />
                      <Row
                        label={cc.regFee}
                        value={inr(result.regFeeAmt)}
                        rate="1%"
                        note={result.regFeeCapped ? cc.regFeeCap : undefined}
                      />
                    </div>

                    {/* Grand total */}
                    <div className="pt-2">
                      <Row
                        label={cc.grandTotal}
                        value={inr(result.grandTotal)}
                        highlight
                      />
                    </div>

                    {/* Notes */}
                    <div className="mt-4 space-y-1.5">
                      <p className={`text-xs text-ink/40 ${hFont}`}>
                        * {cc.rateNote}
                      </p>
                      <p className={`text-xs text-ink/35 ${hFont}`}>
                        {cc.disclaimer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-oxblood px-6 py-6 text-center mt-8">
        <p className={`text-gold/80 text-sm ${hFont}`}>
          © {new Date().getFullYear()} {c.footerBrand}. {c.footerRights}
        </p>
      </footer>
    </div>
  );
}
