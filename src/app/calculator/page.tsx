"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONTENT, DISTRICTS, type Lang } from "@/lib/content";
import { generateStampDutyReport, type CalcResult } from "@/lib/generateReport";
import { Nav } from "@/components/Nav";
import { Header } from "@/components/Header";

/* ── Types ──────────────────────────────────────────────────────────── */
type AreaType = "corporation" | "council" | "rural";
type Gender   = "male" | "female";
type ValMode  = "direct" | "area";
type Unit     = "sqmt" | "sqft" | "guntha" | "acre";

type ReportStep = "locked" | "form" | "ready";


/* ── Unit conversions (everything → Sq. Meter) ──────────────────────
   1 Guntha   = 101.17 Sq. Mt
   1 Sq. Mt   = 10.764 Sq. Ft  →  1 Sq. Ft = 1/10.764 Sq. Mt
   1 Acre     = 4,047 Sq. Mt  (40 Gunthas)
────────────────────────────────────────────────────────────────────── */
const TO_SQM: Record<Unit, number> = {
  sqmt:   1,
  sqft:   1 / 10.764,
  guntha: 101.17,
  acre:   4047,
};

/* ── Avg Ready-Reckoner rates (₹/sqm) for seeded districts ─────────── */
const AVG_RATES_SQM: Partial<Record<string, number>> = {
  Pune:    75_000,
  Solapur: 35_000,
};

/* ── Helpers ────────────────────────────────────────────────────────── */
function fmtArea(n: number, u: Unit): string {
  const d = u === "acre" ? 4 : u === "guntha" ? 3 : 2;
  return parseFloat(n.toFixed(d)).toString();
}

const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const pct = (r: number) => `${(r * 100).toFixed(0)}%`;

/* ── Maharashtra 2026-27 stamp duty logic ───────────────────────────
   Corporation  : 5% base + 1% Metro Cess + 1% LBT = 7%  (6% Female)
   Council/Cant.: 5% base + 1% LBT = 6%               (5% Female)
   Rural / GP   : 5% base = 5%                         (4% Female)
   Registration : 1% capped at ₹30,000
────────────────────────────────────────────────────────────────────── */
function calculate(value: number, area: AreaType, gender: Gender): CalcResult {
  const isFemale       = gender === "female";
  const baseRate       = isFemale ? 0.04 : 0.05;
  const metroCessRate  = area === "corporation" ? 0.01 : null;
  const lbtRate        = area !== "rural" ? 0.01 : null;
  const baseAmt        = value * baseRate;
  const metroCessAmt   = metroCessRate ? value * metroCessRate : null;
  const lbtAmt         = lbtRate ? value * lbtRate : null;
  const totalDutyRate  = baseRate + (metroCessRate ?? 0) + (lbtRate ?? 0);
  const totalDutyAmt   = baseAmt + (metroCessAmt ?? 0) + (lbtAmt ?? 0);
  const rawReg         = value * 0.01;
  const regFeeAmt      = Math.min(rawReg, 30_000);
  return {
    propValue: value, isFemale,
    baseRate, baseAmt, metroCessAmt, lbtAmt,
    totalDutyRate, totalDutyAmt,
    regFeeAmt, regFeeCapped: rawReg > 30_000,
    grandTotal: totalDutyAmt + regFeeAmt,
  };
}

/* ── Result row ─────────────────────────────────────────────────────── */
function Row({
  label, value, rate, bold, highlight, note, font,
}: {
  label: string; value: string; rate?: string;
  bold?: boolean; highlight?: boolean; note?: string; font?: string;
}) {
  const f = font ?? "";
  if (highlight) {
    return (
      <div className="flex items-center justify-between bg-oxblood rounded-xl px-4 py-4 mt-1">
        <span className={`text-gold font-bold text-sm ${f}`}>{label}</span>
        <span className={`text-gold font-black text-xl tracking-tight ${f}`}>{value}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-start justify-between py-2 ${bold ? "font-semibold" : ""}`}>
      <span className={`text-sm ${bold ? "text-ink" : "text-ink/65"} ${f}`}>
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

  /* ── Form ── */
  const [valMode, setValMode]     = useState<ValMode>("direct");
  const [rawValue, setRawValue]   = useState("");
  const [areaStr, setAreaStr]     = useState("");
  const [rateStr, setRateStr]     = useState("");
  const [unit, setUnit]           = useState<Unit>("sqmt");
  const [district, setDistrict]   = useState<(typeof DISTRICTS)[0] | null>(null);
  const [distQuery, setDistQuery] = useState("");
  const [distOpen, setDistOpen]   = useState(false);
  const [areaType, setAreaType]   = useState<AreaType>("corporation");
  const [gender, setGender]       = useState<Gender>("male");
  const [surveyNo, setSurveyNo]   = useState("");

  /* ── Report gate ── */
  const [reportStep, setReportStep] = useState<ReportStep>("locked");
  const [reportName, setReportName] = useState("");
  const [reportPhone, setReportPhone] = useState("");
  const [reportSaving, setReportSaving] = useState(false);
  const [showResult, setShowResult]     = useState(false);

  /* ── Lead ── */
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

  /* ── Pre-fill rate when district with known avg is selected ── */
  useEffect(() => {
    const sqmRate = district ? AVG_RATES_SQM[district.en] : undefined;
    if (sqmRate) {
      setRateStr(String(Math.round(sqmRate * TO_SQM[unit])));
      setValMode("area");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  /* ── Unit change: auto-convert area AND rate ── */
  const handleUnitChange = useCallback((newUnit: Unit) => {
    const ratio = TO_SQM[newUnit] / TO_SQM[unit];
    const a = parseFloat(areaStr);
    if (!isNaN(a) && a > 0) setAreaStr(fmtArea(a / ratio, newUnit));
    const r = parseFloat(rateStr.replace(/,/g, ""));
    if (!isNaN(r) && r > 0) setRateStr(String(Math.round(r * ratio)));
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

  /* ── Reset gate and result visibility when inputs change ── */
  useEffect(() => { setReportStep("locked"); setReportName(""); setReportPhone(""); setShowResult(false); }, [propValue, areaType, gender]);

  /* ── Live calculation ── */
  const result = useMemo<CalcResult | null>(
    () => (propValue ? calculate(propValue, areaType, gender) : null),
    [propValue, areaType, gender]
  );

  /* ── Sq-meter equivalent ── */
  const sqmEquiv = useMemo(() => {
    if (unit === "sqmt") return null;
    const a = parseFloat(areaStr);
    return !isNaN(a) && a > 0 ? a * TO_SQM[unit] : null;
  }, [unit, areaStr]);

  /* ── Dynamic rate label ── */
  const unitName     = cc.units[unit];
  const ratePerLabel = isMr ? `प्रति ${unitName} दर (₹)` : `Rate per ${unitName} (₹)`;

  /* ── Lead capture ── */
  const handleCalculate = useCallback(async () => {
    if (!result || saving) return;
    setShowResult(true);
    setSaving(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: district?.en ?? null,
          areaType, surveyNo: surveyNo || null,
          propValue: result.propValue, gender,
          unit: valMode === "area" ? unit : null,
        }),
      });
      setLeadSaved(true);
      setTimeout(() => setLeadSaved(false), 3000);
    } catch (err) {
      console.error("[Lead]", err);
    } finally {
      setSaving(false);
    }
  }, [result, saving, district, areaType, surveyNo, gender, unit, valMode]);

  /* ── Report lead capture + unlock ── */
  const handleGetReport = useCallback(async () => {
    if (!result || reportSaving) return;
    setReportSaving(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reportName,
          phone: reportPhone,
          district: district?.en ?? null,
          areaType, surveyNo: surveyNo || null,
          propValue: result.propValue, gender,
          unit: valMode === "area" ? unit : null,
          source: "detailed-report",
        }),
      });
    } catch (err) {
      console.error("[Report lead]", err);
    } finally {
      setReportSaving(false);
      setReportStep("ready");
      try {
        await generateStampDutyReport({
          name: reportName,
          phone: reportPhone,
          result: result as CalcResult,
          district: district?.en ?? null,
          areaType,
          gender,
          surveyNo,
          propValue: (result as CalcResult).propValue,
          lang,
        });
      } catch (pdfErr) {
        console.error("[PDF]", pdfErr);
      }
    }
  }, [result, reportSaving, reportName, reportPhone, district, areaType, surveyNo, gender, unit, valMode, lang]);

  /* ─────────────────── RENDER ── */
  return (
    <>
      <style>{`
        #calc-report { display: none; }
        @media print {
          body { background: white !important; }
          #calc-screen { display: none !important; }
          #calc-report { display: block !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>
    <div id="calc-screen" className="min-h-screen flex flex-col bg-cream text-ink">

      <Header />
      <Nav />

      {/* Page title */}
      <div className="border-b border-gold/10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-[11px] text-ink/30 hover:text-oxblood transition-colors mb-4 inline-block uppercase tracking-widest font-sans">{cc.backHome}</Link>
          <h1 className={`text-3xl sm:text-4xl font-bold text-oxblood tracking-tight ${hFont}`}>{cc.pageTitle}</h1>
          <p className={`text-ink/40 text-sm mt-2 ${hFont}`}>{cc.subtitle}</p>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10">

          {/* ── LEFT: Form ── */}
          <div className="space-y-6">

            {/* Marathi Input Mode toggle */}
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gold/15">
              <span className="text-sm font-devanagari text-ink font-medium">{cc.marathiMode}</span>
              <button
                onClick={() => setLang(lang === "en" ? "mr" : "en")}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${lang === "mr" ? "bg-oxblood" : "bg-ink/20"}`}
                aria-label="Toggle Marathi"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${lang === "mr" ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Property Value */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-2 ${hFont}`}>{cc.propValue}</label>
              {/* Mode tabs */}
              <div className="flex rounded-xl border border-gold/30 overflow-hidden mb-3 text-xs font-semibold">
                <button onClick={() => setValMode("direct")}
                  className={`flex-1 py-2.5 transition-colors ${valMode === "direct" ? "bg-oxblood text-gold" : "bg-white text-ink/50 hover:text-ink"}`}>
                  <span className={hFont}>{cc.enterValue}</span>
                </button>
                <span className="w-px bg-gold/25" />
                <button onClick={() => setValMode("area")}
                  className={`flex-1 py-2.5 transition-colors ${valMode === "area" ? "bg-oxblood text-gold" : "bg-white text-ink/50 hover:text-ink"}`}>
                  <span className={hFont}>{cc.fromArea}</span>
                </button>
              </div>

              {valMode === "direct" ? (
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-sm select-none">₹</span>
                  <input type="text" inputMode="numeric" value={rawValue}
                    onChange={(e) => setRawValue(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder={cc.propValuePlaceholder}
                    className={`w-full pl-8 pr-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`} />
                </div>
              ) : (
                /* Area × Rate panel */
                <div className="bg-gold/5 border border-gold/30 rounded-xl p-4 space-y-3">
                  {/* Unit dropdown */}
                  <div>
                    <label className={`text-xs font-semibold text-oxblood mb-1.5 block ${hFont}`}>{cc.unitLabel}</label>
                    <div className="relative">
                      <select
                        value={unit}
                        onChange={(e) => handleUnitChange(e.target.value as Unit)}
                        className={`w-full appearance-none px-4 py-2.5 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink text-sm pr-9 cursor-pointer ${hFont}`}
                      >
                        {(["sqmt", "sqft", "guntha", "acre"] as const).map((u) => (
                          <option key={u} value={u}>{cc.units[u]}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/35">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </div>
                  </div>

                  {/* Area + Rate */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs text-ink/55 mb-1 block ${hFont}`}>{cc.areaLabel}</label>
                      <input type="text" inputMode="decimal" value={areaStr}
                        onChange={(e) => setAreaStr(e.target.value.replace(/[^0-9.]/g, ""))}
                        placeholder={cc.areaPlaceholder}
                        className={`w-full px-3 py-2.5 border border-gold/30 focus:border-gold focus:outline-none rounded-lg bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`} />
                      {sqmEquiv !== null && (
                        <p className="text-xs text-ink/35 mt-1">
                          ≈ {sqmEquiv.toLocaleString("en-IN", { maximumFractionDigits: 2 })} {isMr ? "चौ.मी." : "Sq. Mt"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={`text-xs text-ink/55 mb-1 block ${isMr ? "font-devanagari" : ""}`}>{ratePerLabel}</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-oxblood font-bold text-xs select-none">₹</span>
                        <input type="text" inputMode="numeric" value={rateStr}
                          onChange={(e) => setRateStr(e.target.value.replace(/[^0-9]/g, ""))}
                          className={`w-full pl-6 pr-3 py-2.5 border border-gold/30 focus:border-gold focus:outline-none rounded-lg bg-white text-ink text-sm ${hFont}`} />
                      </div>
                      {district && AVG_RATES_SQM[district.en] && (
                        <p className={`text-xs text-gold mt-1 ${hFont}`}>{isMr ? "अंदाज दर" : "Avg. rate"}: {isMr ? district.mr : district.en}</p>
                      )}
                    </div>
                  </div>

                  {propValue && (
                    <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gold/20">
                      <span className={`text-xs text-ink/50 ${hFont}`}>{isMr ? "गणना केलेले बाजार मूल्य" : "Computed market value"}</span>
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
                <input type="text"
                  value={district && !distOpen ? (isMr ? district.mr : district.en) : distQuery}
                  onFocus={() => { setDistOpen(true); setDistQuery(""); }}
                  onChange={(e) => { setDistQuery(e.target.value); setDistrict(null); setDistOpen(true); }}
                  placeholder={cc.districtSearch}
                  className={`w-full px-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${isMr ? "font-devanagari" : "font-sans"}`} />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
                {distOpen && (
                  <ul className="absolute z-20 mt-1 w-full bg-white border border-gold/30 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {filteredDist.length === 0
                      ? <li className={`px-4 py-3 text-sm text-ink/40 ${hFont}`}>{cc.districtNone}</li>
                      : filteredDist.map((d) => (
                        <li key={d.en} onMouseDown={() => { setDistrict(d); setDistQuery(""); setDistOpen(false); }}
                          className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-oxblood/5 hover:text-oxblood transition-colors flex items-center justify-between ${isMr ? "font-devanagari" : "font-sans"}`}>
                          <span>
                            {isMr ? d.mr : d.en}
                            {!isMr && <span className="ml-2 text-xs text-ink/35 font-devanagari">{d.mr}</span>}
                          </span>
                          {AVG_RATES_SQM[d.en] && (
                            <span className="text-xs text-gold font-semibold ml-2 flex-shrink-0">
                              ₹{((AVG_RATES_SQM[d.en]! * TO_SQM[unit]) / 1000).toFixed(0)}k/{unitName}
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
                    <span>{g === "male" ? "♂" : "♀"}</span>{cc.genders[g]}
                  </button>
                ))}
              </div>
              {gender === "female" && (
                <p className={`mt-2 text-xs text-gold bg-gold/10 border border-gold/25 rounded-lg px-3 py-1.5 ${hFont}`}>{cc.femaleNote}</p>
              )}
            </div>

            {/* Survey / Gat */}
            <div>
              <label className={`block text-sm font-semibold text-oxblood mb-1.5 ${hFont}`}>
                {cc.surveyNo} <span className="text-xs font-normal text-ink/40">({cc.surveyPlaceholder})</span>
              </label>
              <input type="text" value={surveyNo} onChange={(e) => setSurveyNo(e.target.value)}
                placeholder={cc.surveyPlaceholder}
                className={`w-full px-4 py-3 border border-gold/30 focus:border-gold focus:outline-none rounded-xl bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`} />
            </div>

            {/* Calculate + disclaimer */}
            <div className="pt-2 space-y-3">
              <button onClick={handleCalculate} disabled={!result || saving}
                className={`w-full py-4 rounded-xl border font-bold text-sm tracking-wide transition-all ${hFont} ${
                  leadSaved ? "bg-green-700 text-white border-green-700"
                  : "bg-oxblood text-gold border-gold/30 hover:bg-oxblood-dark disabled:opacity-40 disabled:cursor-not-allowed"
                }`}>
                {saving ? "…" : leadSaved ? `✓ ${cc.leadSaved}` : cc.calculateBtn}
              </button>
              <p className={`text-xs text-ink/25 text-center ${hFont}`}>{cc.disclaimer2}</p>
            </div>
          </div>

          {/* ── RIGHT: Result card ── */}
          <div className="lg:sticky lg:top-6 self-start space-y-3">
            <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-gold/50 via-gold to-gold/50" />
              <div className="px-5 py-4 border-b border-gold/10">
                <h2 className={`text-oxblood font-bold text-sm tracking-wide ${hFont}`}>{cc.resultTitle}</h2>
              </div>

              <div className="px-5 py-4">
                {!showResult || !result ? (
                  <p className={`text-sm text-ink/40 py-6 text-center ${hFont}`}>{cc.resultEmpty}</p>
                ) : (
                  <div>
                    {/* Summary rows — always visible */}
                    <div className="space-y-1 pb-3 border-b border-gold/15">
                      <Row label={cc.propValueLabel} value={inr(result.propValue)} bold font={hFont} />
                      {valMode === "area" && areaStr && (
                        <Row label={isMr ? "क्षेत्र" : "Area"} value={`${areaStr} ${unitName}`} font={hFont} />
                      )}
                      {district && <Row label={isMr ? "जिल्हा" : "District"} value={isMr ? district.mr : district.en} font={hFont} />}
                      <Row label={cc.areaType} value={cc.areaTypes[areaType]} font={hFont} />
                      {surveyNo && <Row label={cc.surveyNo} value={surveyNo} font={hFont} />}
                    </div>

                    {/* ── Grand Total — always prominent ── */}
                    <div className="py-3">
                      <Row label={cc.grandTotal} value={inr(result.grandTotal)} highlight font={hFont} />
                    </div>

                    {/* ── Detailed breakdown gate ── */}
                    {reportStep === "locked" && (
                      <button
                        onClick={() => setReportStep("form")}
                        className={`w-full mt-2 py-3 rounded-xl bg-oxblood text-gold border-2 border-gold/60 animate-pulse font-bold text-sm flex items-center justify-center gap-2 hover:bg-oxblood-dark hover:animate-none transition-colors ${hFont}`}
                      >
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        {isMr ? "तपशीलवार PDF अहवाल — मोफत ↓" : "Download Detailed PDF Report — Free ↓"}
                      </button>
                    )}

                    {reportStep === "form" && (
                      <div className="mt-2 rounded-xl border-2 border-gold/40 overflow-hidden">
                        {/* Oxblood header */}
                        <div className="bg-oxblood px-4 py-3">
                          <p className={`text-sm font-bold text-gold ${hFont}`}>
                            {isMr ? "मोफत PDF अहवाल मिळवा" : "Get Your Free PDF Report"}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {(isMr ? [
                              "संपूर्ण stamp duty तपशील व दर",
                              "नोंदणी शुल्क गणना",
                              "मालमत्तेचा सारांश",
                              "बचत टिप्स व अधिकृत 2026-27 दर",
                            ] : [
                              "Full stamp duty breakdown with rates",
                              "Registration fee calculation",
                              "Property details summary",
                              "Savings tips & official 2026-27 rates",
                            ]).map((item) => (
                              <li key={item} className={`text-xs text-gold/70 flex items-center gap-1.5 ${hFont}`}>
                                <span className="text-gold/50 flex-shrink-0 text-[10px]">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Inputs */}
                        <div className="p-4 space-y-3 bg-white">
                          <input
                            type="text"
                            value={reportName}
                            onChange={e => setReportName(e.target.value)}
                            placeholder={isMr ? "पूर्ण नाव" : "Full Name"}
                            className={`w-full px-3 py-2.5 border-2 border-gold/40 focus:border-gold focus:outline-none rounded-lg bg-white text-ink placeholder:text-ink/30 text-sm ${hFont}`}
                          />
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={reportPhone}
                            onChange={e => setReportPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder={isMr ? "मोबाइल नंबर (10 अंक)" : "Mobile Number (10 digits)"}
                            className="w-full px-3 py-2.5 border-2 border-gold/40 focus:border-gold focus:outline-none rounded-lg bg-white text-ink placeholder:text-ink/30 text-sm font-sans"
                          />
                          <button
                            onClick={handleGetReport}
                            disabled={!reportName.trim() || reportPhone.length !== 10 || reportSaving}
                            className={`w-full py-2.5 rounded-lg bg-oxblood text-gold border border-gold/40 text-sm font-bold transition-all hover:bg-oxblood-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${hFont}`}
                          >
                            {reportSaving ? (
                              <>
                                <span className="inline-block w-3.5 h-3.5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                                {isMr ? "तयार होत आहे…" : "Generating…"}
                              </>
                            ) : (
                              isMr ? "माझा मोफत PDF पाठवा" : "Generate My Free PDF"
                            )}
                          </button>
                          <button
                            onClick={() => setReportStep("locked")}
                            className="w-full text-xs text-ink/35 hover:text-ink/55 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {reportStep === "ready" && (
                      <div className="mt-1">
                        <div className="h-px bg-gold/15 mb-3" />

                        {/* Stamp duty + cess + LBT */}
                        <div className="space-y-0.5 pb-3 border-b border-gold/15">
                          <Row label={cc.baseStampDuty} value={inr(result.baseAmt)} rate={pct(result.baseRate)} font={hFont} />
                          {result.metroCessAmt !== null && <Row label={cc.metroCess} value={inr(result.metroCessAmt)} rate="1%" font={hFont} />}
                          {result.lbtAmt !== null && <Row label={cc.lbt} value={inr(result.lbtAmt)} rate="1%" font={hFont} />}
                        </div>

                        {/* Totals */}
                        <div className="space-y-0.5 py-3 border-b border-gold/15">
                          <Row label={cc.stampDutyTotal} value={inr(result.totalDutyAmt)} rate={pct(result.totalDutyRate)} bold font={hFont} />
                          <Row label={cc.regFee} value={inr(result.regFeeAmt)} rate="1%"
                            note={result.regFeeCapped ? cc.regFeeCap : undefined} font={hFont} />
                        </div>

                        {/* Notes */}
                        <div className="mt-4 space-y-1.5">
                          <p className={`text-xs font-medium text-oxblood/60 ${hFont}`}>{cc.rateNote2026}</p>
                          <p className={`text-xs text-ink/40 ${hFont}`}>* {cc.rateNote}</p>
                          <p className={`text-xs text-ink/35 ${hFont}`}>{cc.disclaimer}</p>
                        </div>

                        {/* Download */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                            <span className="text-green-600 flex-shrink-0">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                            <p className={`text-sm font-semibold text-green-700 ${hFont}`}>
                              {isMr ? "PDF डाउनलोड झाले!" : "PDF downloaded!"}
                            </p>
                          </div>
                          <button
                            onClick={() => void generateStampDutyReport({
                              name: reportName,
                              phone: reportPhone,
                              result: result as CalcResult,
                              district: district?.en ?? null,
                              areaType,
                              gender,
                              surveyNo,
                              propValue: (result as CalcResult).propValue,
                              lang,
                            })}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gold/30 text-ink/55 hover:text-oxblood hover:border-gold/50 text-sm font-semibold transition-colors ${hFont}`}
                          >
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            {isMr ? "पुन्हा डाउनलोड करा" : "Download Again"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Verify IGR */}
            <a href="https://igrmaharashtra.gov.in/eASR/eASRCommon.aspx" target="_blank" rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full border border-gold/20 rounded-xl py-2.5 text-xs font-semibold text-gold/60 hover:text-gold hover:border-gold/40 transition-colors ${hFont}`}>
              {cc.verifyBtn}
              <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>

          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How is stamp duty calculated in Maharashtra?',
              a: 'Stamp duty is calculated as a percentage of the property\'s market value or agreement value, whichever is higher. The rate is 5% in municipal areas and 4% in rural areas for sale deeds.',
            },
            {
              q: 'What is the ready reckoner rate?',
              a: 'The ready reckoner rate (also called circle rate) is the minimum value set by the Maharashtra government for property transactions in each area. Stamp duty cannot be calculated on a value lower than this.',
            },
            {
              q: 'Is registration fee separate from stamp duty?',
              a: 'Yes. Registration fee is 1% of the property value (capped at ₹30,000) and is paid separately at the SRO. Stamp duty is paid before registration via franking or online challan.',
            },
            {
              q: 'Does stamp duty apply to rent agreements?',
              a: 'Yes but at a much lower rate. An 11-month rent agreement attracts ₹100 stamp duty in Maharashtra regardless of the rent amount.',
            },
            {
              q: 'Can I pay stamp duty online in Maharashtra?',
              a: 'Yes. Stamp duty can be paid online through the Maharashtra government\'s GRAS portal. Mudrankseva handles this automatically as part of the registration process.',
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

      <footer className="bg-oxblood px-6 py-10 text-center mt-auto">
        <p className="text-gold/60 text-sm font-sans">© {new Date().getFullYear()} {c.footerBrand}. {c.footerRights}</p>
        <p className="text-gold/25 text-xs mt-2 font-sans">Maharashtra Property Services · Digital. Accurate. Compliant.</p>
      </footer>
    </div>

    {/* ── Print-only report (hidden on screen) ── */}
    <div id="calc-report">
      {result && (
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1a0505", fontSize: "12pt", lineHeight: "1.6" }}>

          {/* Header */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #701c1c", paddingBottom: "14px", marginBottom: "20px" }}>
            <div style={{ fontSize: "22pt", fontWeight: "bold", color: "#701c1c", letterSpacing: "0.05em" }}>MUDRANKSEVA</div>
            <div style={{ fontSize: "9pt", color: "#888", marginBottom: "8px" }}>mudrankseva.in · Maharashtra Property Services</div>
            <div style={{ fontSize: "15pt", fontWeight: "bold" }}>Stamp Duty Calculation Report</div>
            <div style={{ fontSize: "9pt", color: "#666", marginTop: "2px" }}>Maharashtra Ready Reckoner 2026-27</div>
          </div>

          {reportName && (
            <div style={{ fontSize: "9pt", color: "#666", marginBottom: "16px" }}>
              Prepared for: <strong>{reportName}</strong>{reportPhone ? ` · +91 ${reportPhone}` : ""}
            </div>
          )}

          {/* Property Details */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "9pt", fontWeight: "bold", color: "#701c1c", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #d4af37", paddingBottom: "3px", marginBottom: "8px" }}>
              Property Details
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11pt" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 0", color: "#555", width: "55%" }}>Property Value</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>{inr(result.propValue)}</td>
                </tr>
                {valMode === "area" && areaStr && (
                  <tr>
                    <td style={{ padding: "3px 0", color: "#555" }}>Area</td>
                    <td style={{ textAlign: "right" }}>{areaStr} {unitName}</td>
                  </tr>
                )}
                {district && (
                  <tr>
                    <td style={{ padding: "3px 0", color: "#555" }}>District</td>
                    <td style={{ textAlign: "right" }}>{district.en}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: "3px 0", color: "#555" }}>Area Type</td>
                  <td style={{ textAlign: "right" }}>
                    {areaType === "corporation" ? "Municipal Corporation" : areaType === "council" ? "Municipal Council / Cantonment" : "Gram Panchayat / Rural"}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 0", color: "#555" }}>Buyer Type</td>
                  <td style={{ textAlign: "right" }}>{result.isFemale ? "Female" : "Male"}</td>
                </tr>
                {surveyNo && (
                  <tr>
                    <td style={{ padding: "3px 0", color: "#555" }}>Survey / Gat No.</td>
                    <td style={{ textAlign: "right" }}>{surveyNo}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Stamp Duty Breakdown */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "9pt", fontWeight: "bold", color: "#701c1c", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #d4af37", paddingBottom: "3px", marginBottom: "8px" }}>
              Stamp Duty Breakdown
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11pt" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 0", color: "#555" }}>Base Stamp Duty ({pct(result.baseRate)})</td>
                  <td style={{ textAlign: "right" }}>{inr(result.baseAmt)}</td>
                </tr>
                {result.metroCessAmt !== null && (
                  <tr>
                    <td style={{ padding: "3px 0", color: "#555" }}>Metro Cess (1%)</td>
                    <td style={{ textAlign: "right" }}>{inr(result.metroCessAmt)}</td>
                  </tr>
                )}
                {result.lbtAmt !== null && (
                  <tr>
                    <td style={{ padding: "3px 0", color: "#555" }}>Local Body Tax / LBT (1%)</td>
                    <td style={{ textAlign: "right" }}>{inr(result.lbtAmt)}</td>
                  </tr>
                )}
                <tr style={{ borderTop: "1px solid #ddd" }}>
                  <td style={{ padding: "6px 0 3px", fontWeight: "bold" }}>Total Stamp Duty ({pct(result.totalDutyRate)})</td>
                  <td style={{ textAlign: "right", fontWeight: "bold", padding: "6px 0 3px" }}>{inr(result.totalDutyAmt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Registration Charges */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "9pt", fontWeight: "bold", color: "#701c1c", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #d4af37", paddingBottom: "3px", marginBottom: "8px" }}>
              Registration Charges
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11pt" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 0", color: "#555" }}>
                    Registration Fee (1%{result.regFeeCapped ? ", capped at ₹30,000" : ""})
                  </td>
                  <td style={{ textAlign: "right" }}>{inr(result.regFeeAmt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div style={{ backgroundColor: "#701c1c", color: "#d4af37", padding: "12px 16px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontWeight: "bold", fontSize: "12pt", letterSpacing: "0.03em" }}>TOTAL AMOUNT PAYABLE</span>
            <span style={{ fontWeight: "900", fontSize: "18pt" }}>{inr(result.grandTotal)}</span>
          </div>

          {/* Notes */}
          <div style={{ fontSize: "8pt", color: "#888", borderTop: "1px solid #eee", paddingTop: "10px", marginBottom: "14px", lineHeight: "1.5" }}>
            <p style={{ margin: "0 0 3px 0" }}>* Rates as per Maharashtra Ready Reckoner 2026-27. Actual rates may vary — verify with the Sub-Registrar&apos;s office before payment.</p>
            <p style={{ margin: "0 0 3px 0" }}>* Female buyers may be eligible for reduced stamp duty in certain municipalities.</p>
            <p style={{ margin: "0" }}>* Registration fee is 1% of property value, capped at ₹30,000.</p>
          </div>

          {/* Upsell */}
          <div style={{ border: "1px solid #d4af37", borderRadius: "5px", padding: "10px 14px", marginBottom: "14px", backgroundColor: "#fdf8f0" }}>
            <div style={{ fontWeight: "bold", color: "#701c1c", fontSize: "10pt", marginBottom: "2px" }}>Need a Rent Agreement?</div>
            <div style={{ fontSize: "9pt", color: "#555" }}>
              Generate your Maharashtra Leave &amp; License Agreement at{" "}
              <strong>mudrankseva.in/rent-agreement</strong> for just ₹299. Ready in 5 minutes.
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", fontSize: "8pt", color: "#aaa", borderTop: "1px solid #eee", paddingTop: "10px" }}>
            Generated by <strong>Mudrankseva</strong> · mudrankseva.in · Maharashtra Property Services
          </div>

        </div>
      )}
    </div>

      {/* SEO Content Section */}
      <section className="max-w-3xl mx-auto px-4 py-14 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Stamp Duty in Maharashtra 2026 — Complete Guide</h2>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What is stamp duty?</h3>
            <p>Stamp duty is a state government tax paid on property transactions in Maharashtra. It is governed by the Maharashtra Stamp Act and must be paid before or at the time of property registration. Failure to pay stamp duty makes a property document inadmissible as evidence in court.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stamp duty rates in Maharashtra 2026</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Area type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Male buyer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Female buyer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Municipal Corporation (e.g. PMC, BMC, PCMC)', '6%', '5%'],
                    ['Municipal Council / Nagar Panchayat', '6%', '5%'],
                    ['Rural / Gram Panchayat area', '5%', '4%'],
                  ].map(([area, male, female]) => (
                    <tr key={area}>
                      <td className="px-4 py-3 text-gray-600">{area}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{male}</td>
                      <td className="px-4 py-3 font-medium text-green-700">{female}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 mt-2">* Additional metro cess of 1% applies in Mumbai, Pune, Nagpur and Thane municipal areas.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Women buyer concession</h3>
            <p>Maharashtra offers a 1% stamp duty concession for female property buyers. If a property is registered solely in a woman&apos;s name, she pays 1% less than a male buyer. On a ₹50 lakh property in Pune, this saves ₹50,000. On a ₹1 crore Mumbai flat, it saves ₹1 lakh. Joint registration with a male buyer does not qualify for this concession.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the ready reckoner rate?</h3>
            <p>The ready reckoner rate (also called circle rate or guidance value) is the minimum property value set by the Maharashtra government for each area. Stamp duty cannot be calculated on a value lower than the ready reckoner value. If you buy a property for ₹40 lakh but the ready reckoner value is ₹50 lakh, stamp duty will be calculated on ₹50 lakh. Ready reckoner rates are revised annually by the state government.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration fee in Maharashtra</h3>
            <p>In addition to stamp duty, a registration fee of 1% of the property value is payable at the Sub-Registrar Office (SRO). Registration fee is capped at ₹30,000 — so for any property above ₹30 lakh, the maximum registration fee is ₹30,000 regardless of the property value.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stamp duty on rent agreements in Maharashtra</h3>
            <p>Rent agreements in Maharashtra attract stamp duty at a much lower rate than property purchases. For an 11-month Leave &amp; License Agreement, stamp duty is a flat ₹100 regardless of rent amount. For agreements of 12 months or more, stamp duty is calculated as a percentage of total consideration (rent × months + 10% of deposit).</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How to pay stamp duty in Maharashtra</h3>
            <p>Stamp duty in Maharashtra can be paid online through the GRAS (Government Receipt Accounting System) portal or through authorised banks and stamp vendors. For property registrations handled through Mudrankseva, stamp duty payment is coordinated as part of the registration process.</p>
          </div>
        </div>

        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-gray-900 mb-2">Need help with property registration?</p>
          <p className="text-sm text-gray-600 mb-4">Our team can handle your complete property registration including stamp duty payment and SRO registration.</p>
          <div className="flex flex-wrap gap-3">
            <a href="https://wa.me/917755984622?text=Hi, I need help with stamp duty and property registration" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              Ask on WhatsApp
            </a>
            <a href="/sales-deed" className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              Sale Deed Registration
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
