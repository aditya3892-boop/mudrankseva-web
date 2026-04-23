"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONTENT, DISTRICTS, type Lang } from "@/lib/content";

/* ── Types ──────────────────────────────────────────────────────────── */
type AreaType = "corporation" | "council" | "rural";
type Gender   = "male" | "female";
type ValMode  = "direct" | "area";
type Unit     = "sqmt" | "sqft" | "guntha" | "acre";

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

/* ── Unit conversion (to Sq. Meter) ────────────────────────────────── */
//  1 Guntha = 101.17 Sq. Mt
//  1 Sq. Ft = 1/10.76 Sq. Mt  →  1 Sq. Mt = 10.76 Sq. Ft
//  1 Acre   = 40 Gunthas = 40 × 101.17 = 4046.8 Sq. Mt
const TO_SQM: Record<Unit, number> = {
  sqmt:   1,
  sqft:   1 / 10.76,      // ≈ 0.092937
  guntha: 101.17,
  acre:   40 * 101.17,    // 4046.8
};

/* ── Average rates ₹/sqm for known districts ───────────────────────── */
const AVG_RATES_SQM: Partial<Record<string, number>> = {
  Pune:    75_000,
  Solapur: 35_000,
};

/* ── Format area number based on unit ──────────────────────────────── */
function fmtArea(n: number, u: Unit): string {
  const decimals = u === "acre" ? 4 : u === "guntha" ? 3 : 2;
  return parseFloat(n.toFixed(decimals)).toString();
}

/* ── Stamp duty logic ───────────────────────────────────────────────── */
function calculate(value: number, area: AreaType, gender: Gender): CalcResult {
  const isFemale       = gender === "female";
  const baseRate       = isFemale ? 0.04 : 0.05;
  const metroCessRate  = area === "corporation" ? 0.01 : null;
  const lbtRate        = area === "corporation" || area === "council" ? 0.01 : null;

  const baseAmt       = value * baseRate;
  const metroCessAmt  = metroCessRate ? value * metroCessRate : null;
  const lbtAmt        = lbtRate ? value * lbtRate : null;
  const totalDutyRate = baseRate + (metroCessRate ?? 0) + (lbtRate ?? 0);
  const totalDutyAmt  = baseAmt + (metroCessAmt ?? 0) + (lbtAmt ?? 0);
  const rawReg        = value * 0.01;
  const regFeeAmt     = Math.min(rawReg, 30_000);

  return {
    propValue: value, isFemale,
    baseRate, baseAmt, metroCessAmt, lbtAmt,
    totalDutyRate, totalDutyAmt,
    regFeeAmt, regFeeCapped: rawReg > 30_000,
    grandTotal: totalDutyAmt + regFeeAmt,
  };
}

/* ── Formatters ─────────────────────────────────────────────────────── */
const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const pct = (r: number) => `${(r * 100).toFixed(0)}%`;

/* ── Result row ─────────────────────────────────────────────────────── */
function Row({
  label, value, rate, bold, highlight, note,
}: {
  label: string; value: string; rate?: string;
  bold?: boolean; highlight?: boolean; note?: string;
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
  const [lang, setLang]           = useState<Lang>("en");
  const c  = CONTENT[lang];
  const cc = c.calc;
  const isMr  = lang === "mr";
  const hFont = isMr ? "font-devanagari" : "font-sans";

  /* ── Form state ── */
  const [valMode, setValMode]     = useState<ValMode>("direct");
  const [rawValue, setRawValue]   = useState("");       // direct mode
  const [areaStr, setAreaStr]     = useState("");       // area mode
  const [rateStr, setRateStr]     = useState("");       // area mode
  const [unit, setUnit]           = useState<Unit>("sqmt");

  const [district, setDistrict]   = useState<(typeof DISTRICTS)[0] | null>(null);
  const [distQuery, setDistQuery] = useState("");
  const [distOpen, setDistOpen]   = useState(false);
  const [areaType, setAreaType]   = useState<AreaType>("corporation");
  const [gender, setGender]       = useState<Gender>("male");
  const [surveyNo, setSurveyNo]   = useState("");

  /* ── Lead state ── */
  const [saving, setSaving]       = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  /* ── District dropdown click-outside ── */
  const distRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (distRef.current && !distRef.current.contains(e.target as Node))
        setDistOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── When district changes: pre-fill rate for known districts ── */
  useEffect(() => {
    const sqmRate = district ? AVG_RATES_SQM[district.en] : undefined;
    if (sqmRate) {
      setRateStr(String(Math.round(sqmRate * TO_SQM[unit])));
      setValMode("area");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]); // intentionally exclude `unit` — rate is re-derived on unit change

  /* ── Unit change: auto-convert area AND rate ── */
  const handleUnitChange = useCallback((newUnit: Unit) => {
    const ratio = TO_SQM[newUnit] / TO_SQM[unit]; // scale factor old→new

    // Convert area
    const a = parseFloat(areaStr);
    if (!isNaN(a) && a > 0) {
      setAreaStr(fmtArea(a / ratio, newUnit));
    }

    // Convert rate (₹/oldUnit → ₹/newUnit)
    const r = parseFloat(rateStr.replace(/,/g, ""));
    if (!isNaN(r) && r > 0) {
      setRateStr(String(Math.round(r * ratio)));
    }

    setUnit(newUnit);
  }, [unit, areaStr, rateStr]);

  /* ── Filtered districts ── */
  const filteredDist = useMemo(() => {
    const q = distQuery.toLowerCase();
    return DISTRICTS.filter(
      (d) => d.en.toLowerCase().includes(q) || d.mr.includes(distQuery)
    );
  }, [distQuery]);

  /* ── Effective property value ── */
  const propValue = useMemo<number | null>(() => {
    if (valMode === "area") {
      const a = parseFloat(areaStr);
      const r = parseFloat(rateStr.replace(/,/g, ""));
      return (!isNaN(a) && a > 0 && !isNaN(r) && r > 0) ? a * r : null;
    }
    const n = parseFloat(rawValue.replace(/,/g, ""));
    return !isNaN(n) && n > 0 ? n : null;
  }, [valMode, areaStr, rateStr, rawValue]);

  /* ── Live duty calculation ── */
  const result = useMemo<CalcResult | null>(
    () => (propValue ? calculate(propValue, areaType, gender) : null),
    [propValue, areaType, gender]
  );

  /* ── Sq-meter equivalent for display ── */
  const sqmEquiv = useMemo(() => {
    if (unit === "sqmt") return null;
    const a = parseFloat(areaStr);
    if (isNaN(a) || a <= 0) return null;
    return a * TO_SQM[unit];
  }, [unit, areaStr]);

  /* ── Rate-per-unit label ── */
  const unitName = cc.units[unit];
  const ratePerLabel = isMr
    ? `प्रति ${unitName} दर (₹)`
    : `Rate per ${unitName} (₹)`;

  /* ── Lead capture ── */
  const handleCalculate = useCallback(async () => {
    if (!result || saving) return;
    setSaving(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: district?.en ?? null,
          areaType,
          surveyNo: surveyNo || null,
          propValue: result.propValue,
          gender,
          unit: valMode === "area" ? unit : null,
        }),
      });
      setLeadSaved(true);
      setTimeout(() => setLeadSaved(false), 3000);
    } catch (err) {
      console.error("[Lead capture]", err);
    } finally {
      setSaving(false);
    }
  }, [result, saving, district, areaType, surveyNo, gender, unit, valMode]);

  /* ─────────────────────────────────────── RENDER ── */
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">

      {/* Header */}
      <header className="bg-oxblood px-5 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="rounded-xl overflow-hidden border border-gold/30 bg-cream px-3 py-1.5 flex-shrink-0">
          <Image src="/logo.jpg" alt="Mudrankseva" width={200} height={48} priority className="h-11 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-gold/50 overflow-hidden text-xs font-semibold">
            <button onClick={() => setLang("en")} className={`px-3.5 py-1.5 transition-colors ${lang === "en" ? "bg-gold text-oxblood-dark" : "text-gold/70 hover:text-gold"}`}>EN</button>
            <span className="w-px h-4 bg-gold/30" />
            <button onClick={() => setLang("mr")} className={`px-3.5 py-1.5 font-devanagari transition-colors ${lang === "mr" ? "bg-gold text-oxblood-dark" : "text-gold/70 hover:text-gold"}`}>मराठी</button>
          </div>
          <span className={`hidden sm:inline text-xs text-gold/80 border border-gold/40 rounded-full px-3 py-1 tracking-widest uppercase ${isMr ? "font-devanagari tracking-normal" : ""}`}>{c.headerBadge}</span>
        </div>
      </header>

      {/* Page title bar */}
      <div className="bg-oxblood/[0.04] border-b border-gold/15 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className={`text-xs text-oxblood/60 hover:text-oxblood transition-colors mb-2 inline-block ${hFont}`}>{cc.backHome}</Link>
          <h1 className={`text-2xl sm:text-3xl font-bold text-oxblood ${hFont}`}>{cc.pageTitle}</h1>
          <p className={`text-ink/50 text-sm mt-1 ${hFont}`}>{cc.subtitle}</p>
        </div>
      </div>

      {/* Main two-column layout */}
      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8">

          {/* ── LEFT: Form ── */}
          <div className="space-y-6">

            {/* ── Property Value section ── */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-2 ${hFont}`}>
                {cc.propValue}
              </label>

              {/* Mode tabs */}
              <div className="flex rounded-xl border border-gold/30 overflow-hidden mb-4 text-xs font-semibold">
                <button
                  onClick={() => setValMode("direct")}
                  className={`flex-1 py-2.5 transition-colors ${valMode === "direct" ? "bg-oxblood text-gold" : "bg-white text-ink/50 hover:text-ink"}`}
                >
                  <span className={hFont}>{cc.enterValue}</span>
                </button>
                <span className="w-px bg-gold/25" />
                <button
                  onClick={() => setValMode("area")}
                  className={`flex-1 py-2.5 transition-colors ${valMode === "area" ? "bg-oxblood text-gold" : "bg-white text-ink/50 hover:text-ink"}`}
                >
                  <span className={hFont}>{cc.fromArea}</span>
                </button>
              </div>

              {valMode === "direct" ? (
                /* Direct market value entry */
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={rawValue}
                    onChange={(e) => setRawValue(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder={cc.propValuePlaceholder}
                    className={`w-full pl-8 pr-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`}
                  />
                </div>
              ) : (
                /* Area × Rate panel */
                <div className="bg-gold/5 border border-gold/30 rounded-xl p-4 space-y-4">

                  {/* Unit selector */}
                  <div>
                    <p className={`text-xs font-semibold text-oxblood mb-2 ${hFont}`}>{cc.unitLabel}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {(["sqmt", "sqft", "guntha", "acre"] as const).map((u) => (
                        <button
                          key={u}
                          onClick={() => handleUnitChange(u)}
                          className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                            unit === u
                              ? "bg-oxblood text-gold border-oxblood"
                              : "bg-white text-ink/65 border-gold/25 hover:border-gold/55"
                          } ${isMr ? "font-devanagari" : ""}`}
                        >
                          {cc.units[u]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Area + Rate inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs text-ink/55 mb-1 block ${hFont}`}>{cc.areaLabel}</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={areaStr}
                        onChange={(e) => setAreaStr(e.target.value.replace(/[^0-9.]/g, ""))}
                        placeholder={cc.areaPlaceholder}
                        className={`w-full px-3 py-2.5 border border-gold/30 focus:border-gold focus:outline-none rounded-lg bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`}
                      />
                      {/* Sq-meter equivalent */}
                      {sqmEquiv !== null && (
                        <p className="text-xs text-ink/35 mt-1">
                          ≈ {sqmEquiv.toLocaleString("en-IN", { maximumFractionDigits: 2 })} {isMr ? "चौ. मीटर" : "Sq. Mt"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={`text-xs text-ink/55 mb-1 block ${isMr ? "font-devanagari" : ""}`}>
                        {ratePerLabel}
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-xs select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={rateStr}
                          onChange={(e) => setRateStr(e.target.value.replace(/[^0-9]/g, ""))}
                          className={`w-full pl-6 pr-3 py-2.5 border border-gold/30 focus:border-gold focus:outline-none rounded-lg bg-white text-ink text-sm ${hFont}`}
                        />
                      </div>
                      {district && AVG_RATES_SQM[district.en] && (
                        <p className={`text-xs text-gold mt-1 ${hFont}`}>
                          {isMr ? "अंदाज दर" : "Avg. rate"}: {isMr ? district.mr : district.en}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Computed market value */}
                  {propValue && (
                    <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gold/20">
                      <span className={`text-xs text-ink/50 ${hFont}`}>
                        {isMr ? "गणना केलेले बाजार मूल्य" : "Computed market value"}
                      </span>
                      <span className="font-bold text-oxblood text-sm">{inr(propValue)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* District */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-1.5 ${hFont}`}>{cc.district}</label>
              <div className="relative" ref={distRef}>
                <input
                  type="text"
                  value={district && !distOpen ? (isMr ? district.mr : district.en) : distQuery}
                  onFocus={() => { setDistOpen(true); setDistQuery(""); }}
                  onChange={(e) => { setDistQuery(e.target.value); setDistrict(null); setDistOpen(true); }}
                  placeholder={cc.districtSearch}
                  className={`w-full px-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${isMr ? "font-devanagari" : "font-sans"}`}
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
                {distOpen && (
                  <ul className="absolute z-20 mt-1 w-full bg-white border border-gold/30 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {filteredDist.length === 0 ? (
                      <li className={`px-4 py-3 text-sm text-ink/40 ${hFont}`}>{cc.districtNone}</li>
                    ) : filteredDist.map((d) => (
                      <li
                        key={d.en}
                        onMouseDown={() => { setDistrict(d); setDistQuery(""); setDistOpen(false); }}
                        className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-oxblood/5 hover:text-oxblood transition-colors flex items-center justify-between ${isMr ? "font-devanagari" : "font-sans"}`}
                      >
                        <span>
                          {isMr ? d.mr : d.en}
                          {!isMr && <span className="ml-2 text-xs text-ink/35 font-devanagari">{d.mr}</span>}
                        </span>
                        {AVG_RATES_SQM[d.en] && (
                          <span className="text-xs text-gold font-semibold ml-2 flex-shrink-0">
                            ₹{((AVG_RATES_SQM[d.en]! * TO_SQM[unit]) / 1000).toFixed(0)}k/{isMr ? cc.units[unit] : cc.units[unit]}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Area Type */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-2 ${hFont}`}>{cc.areaType}</label>
              <div className="flex flex-col sm:flex-row gap-2">
                {(["corporation", "council", "rural"] as const).map((a) => (
                  <button key={a} onClick={() => setAreaType(a)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left sm:text-center ${hFont} ${areaType === a ? "bg-oxblood text-gold border-oxblood" : "bg-white text-ink/70 border-gold/30 hover:border-gold/60"}`}>
                    {cc.areaTypes[a]}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-2 ${hFont}`}>{cc.gender}</label>
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${hFont} ${gender === g ? "bg-oxblood text-gold border-oxblood" : "bg-white text-ink/70 border-gold/30 hover:border-gold/60"}`}>
                    <span>{g === "male" ? "♂" : "♀"}</span>
                    {cc.genders[g]}
                  </button>
                ))}
              </div>
              {gender === "female" && (
                <p className={`mt-2 text-xs text-gold bg-gold/10 border border-gold/25 rounded-lg px-3 py-1.5 ${hFont}`}>{cc.femaleNote}</p>
              )}
            </div>

            {/* Survey / Gat Number */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-1.5 ${hFont}`}>
                {cc.surveyNo}
                <span className="ml-1.5 text-xs font-normal text-ink/40">({cc.surveyPlaceholder})</span>
              </label>
              <input
                type="text"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder={cc.surveyPlaceholder}
                className={`w-full px-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`}
              />
            </div>

            {/* Calculate button + disclaimer */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleCalculate}
                disabled={!result || saving}
                className={`w-full py-3.5 rounded-xl border font-bold text-sm transition-all ${hFont} ${
                  leadSaved
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-oxblood text-gold border-gold/50 hover:bg-oxblood-dark disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {saving ? "…" : leadSaved ? `✓ ${cc.leadSaved}` : cc.calculateBtn}
              </button>
              <p className={`text-xs text-ink/35 text-center ${hFont}`}>{cc.disclaimer2}</p>
            </div>
          </div>

          {/* ── RIGHT: Result card ── */}
          <div className="lg:sticky lg:top-6 self-start space-y-3">
            <div className="bg-white rounded-2xl border border-gold/30 overflow-hidden shadow-sm">
              <div className="bg-oxblood px-5 py-4">
                <h2 className={`text-gold font-bold text-base ${hFont}`}>{cc.resultTitle}</h2>
              </div>

              <div className="px-5 py-4">
                {!result ? (
                  <p className={`text-sm text-ink/40 py-6 text-center ${hFont}`}>{cc.resultEmpty}</p>
                ) : (
                  <div>
                    {/* Summary */}
                    <div className="space-y-1 pb-3 border-b border-gold/15">
                      <Row label={cc.propValueLabel} value={inr(result.propValue)} bold />
                      {valMode === "area" && areaStr && (
                        <Row
                          label={isMr ? "क्षेत्र" : "Area"}
                          value={`${areaStr} ${unitName}`}
                        />
                      )}
                      {district && <Row label={isMr ? "जिल्हा" : "District"} value={isMr ? district.mr : district.en} />}
                      <Row label={cc.areaType} value={cc.areaTypes[areaType]} />
                      {surveyNo && <Row label={cc.surveyNo} value={surveyNo} />}
                    </div>

                    {/* Duty lines */}
                    <div className="space-y-0.5 py-3 border-b border-gold/15">
                      <Row label={cc.baseStampDuty} value={inr(result.baseAmt)} rate={pct(result.baseRate)} />
                      {result.metroCessAmt !== null && <Row label={cc.metroCess} value={inr(result.metroCessAmt)} rate="1%" />}
                      {result.lbtAmt !== null && <Row label={cc.lbt} value={inr(result.lbtAmt)} rate="1%" />}
                    </div>

                    {/* Totals */}
                    <div className="space-y-0.5 py-3 border-b border-gold/15">
                      <Row label={cc.stampDutyTotal} value={inr(result.totalDutyAmt)} rate={pct(result.totalDutyRate)} bold />
                      <Row label={cc.regFee} value={inr(result.regFeeAmt)} rate="1%" note={result.regFeeCapped ? cc.regFeeCap : undefined} />
                    </div>

                    {/* Grand total */}
                    <div className="pt-2">
                      <Row label={cc.grandTotal} value={inr(result.grandTotal)} highlight />
                    </div>

                    {/* Notes */}
                    <div className="mt-4 space-y-1.5">
                      <p className={`text-xs font-medium text-oxblood/60 ${hFont}`}>{cc.rateNote2026}</p>
                      <p className={`text-xs text-ink/40 ${hFont}`}>* {cc.rateNote}</p>
                      <p className={`text-xs text-ink/35 ${hFont}`}>{cc.disclaimer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Verify IGR link */}
            <a
              href="https://igrmaharashtra.gov.in/eASR/eASRCommon.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full border border-gold/40 rounded-xl py-2.5 text-xs font-semibold text-gold hover:bg-gold/8 transition-colors ${hFont}`}
            >
              {cc.verifyBtn}
              <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-oxblood px-6 py-6 text-center mt-8">
        <p className={`text-gold/80 text-sm ${hFont}`}>
          © {new Date().getFullYear()} {c.footerBrand}. {c.footerRights}
        </p>
      </footer>
    </div>
  );
}
