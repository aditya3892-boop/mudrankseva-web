import { jsPDF } from "jspdf";

export interface AgreementPdfInput {
  agreement: string;
  lang: string;
  landlordName: string;
  tenantName: string;
  propertyAddress: string;
  rent: string;
  startDate: string;
  isTest?: boolean;
}

const OXBLOOD    = [74,  18,  18]  as const;
const GOLD       = [212, 175, 55]  as const;
const GOLD_MUT   = [180, 148, 40]  as const;
const INK        = [26,  5,   5]   as const;
const GREY       = [100, 80,  80]  as const;
const LIGHT_GREY = [220, 210, 210] as const;
const TEST_RED   = [160, 20,  20]  as const;

const W        = 210;
const M        = 16;
const CW       = W - 2 * M;
const FOOTER_Y = 284;
const BOTTOM   = 274;

// Direct TTF from googlefonts/noto-fonts — hinted, static weight, CORS-safe via jsDelivr
const NOTO_TTF_URL =
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf";

let _cachedFontBase64: string | null = null;

async function loadNotoFont(): Promise<string | null> {
  if (_cachedFontBase64) {
    console.log("[Noto] Using cached font base64");
    return _cachedFontBase64;
  }
  console.log("[Noto] Fetching font from:", NOTO_TTF_URL);
  try {
    const res = await fetch(NOTO_TTF_URL);
    console.log("[Noto] Fetch response status:", res.status, res.ok);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    console.log("[Noto] ArrayBuffer size (bytes):", buf.byteLength);
    const bytes = new Uint8Array(buf);
    let binary = "";
    const CHUNK = 8192;
    for (let i = 0; i < bytes.byteLength; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    _cachedFontBase64 = btoa(binary);
    console.log("[Noto] base64 first 50 chars:", _cachedFontBase64.substring(0, 50));
    console.log("[Noto] Font loaded successfully, base64 length:", _cachedFontBase64.length);
    return _cachedFontBase64;
  } catch (e) {
    console.error("[Noto] Font fetch FAILED:", e);
    return null;
  }
}

export async function generateAgreementPdf(input: AgreementPdfInput): Promise<void> {
  const { agreement, lang, landlordName, tenantName, propertyAddress, rent, startDate, isTest = false } = input;
  const isMr = lang === "mr";

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // Embed Noto Sans Devanagari (covers Devanagari + Latin + ₹ symbol)
  const fontBase64 = await loadNotoFont();
  let notoReady = false;
  if (fontBase64) {
    try {
      doc.addFileToVFS("NotoSansDevanagari-Regular.ttf", fontBase64);
      doc.addFont("NotoSansDevanagari-Regular.ttf", "NotoSansDevanagari", "normal");
      notoReady = true;
      console.log("[Noto] Font embedded in jsPDF successfully");
    } catch (e) {
      console.error("[Noto] jsPDF addFont failed:", e);
    }
  } else if (isMr) {
    console.warn("[Noto] Font unavailable — Marathi PDF will show fallback message");
  }

  const fill = (...c: readonly [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const tc   = (...c: readonly [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const draw = (...c: readonly [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  // Helvetica for headings/labels; Noto for Devanagari body and ₹ symbol
  const useHelv  = (bold = false) => doc.setFont("helvetica", bold ? "bold" : "normal");
  const useNoto  = () => { if (notoReady) doc.setFont("NotoSansDevanagari", "normal"); else doc.setFont("helvetica", "normal"); };
  const useBody  = () => (isMr && notoReady) ? useNoto() : useHelv(false);

  function addFooter(pageNum: number) {
    fill(...OXBLOOD);
    doc.rect(0, FOOTER_Y, W, 13, "F");
    fill(...GOLD);
    doc.rect(0, FOOTER_Y, W, 0.8, "F");
    tc(...GOLD_MUT);
    useHelv(false);
    doc.setFontSize(7.5);
    if (isTest) {
      doc.text(
        `TEST DOCUMENT - NOT FOR LEGAL USE  \xB7  Page ${pageNum}`,
        W / 2, FOOTER_Y + 8, { align: "center" },
      );
    } else {
      doc.text(
        `Mudrankseva  \xB7  mudrankseva.in  \xB7  Maharashtra Property Services  \xB7  Page ${pageNum}`,
        W / 2, FOOTER_Y + 8, { align: "center" },
      );
    }
  }

  /* ── PAGE 1 HEADER ── */
  fill(...OXBLOOD);
  doc.rect(0, 0, W, 42, "F");
  fill(...GOLD);
  doc.rect(0, 42, W, 1.2, "F");

  tc(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MUDRANKSEVA", M, 16);

  tc(...GOLD_MUT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("mudrankseva.in  \xB7  Maharashtra Property Services", M, 23);

  tc(255, 255, 255);
  useHelv(true);
  doc.setFontSize(13);
  doc.text("Leave and License Agreement", M, 34);

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  tc(...GOLD_MUT);
  useHelv(false);
  doc.setFontSize(8);
  doc.text(isTest ? "TEST MODE" : dateStr, W - M, 34, { align: "right" });

  let y = 50;

  /* ── TEST WATERMARK BANNER ── */
  if (isTest) {
    fill(...TEST_RED);
    doc.rect(M, y, CW, 9, "F");
    tc(255, 240, 180);
    useHelv(true);
    doc.setFontSize(9);
    doc.text("*** TEST DOCUMENT - NOT FOR LEGAL USE ***", W / 2, y + 6, { align: "center" });
    y += 13;
  }

  /* ── SUMMARY BOX ── */
  fill(...OXBLOOD);
  doc.rect(M, y, CW, 7, "F");
  tc(...GOLD);
  useHelv(true);
  doc.setFontSize(7.5);
  doc.text("PARTIES & PROPERTY DETAILS", M + 3, y + 5);
  y += 11;

  const propShort = propertyAddress.length > 60
    ? propertyAddress.slice(0, 57) + "..."
    : propertyAddress;

  const rentAmt = parseInt(rent || "0", 10).toLocaleString("en-IN");

  const rows: [string, string][] = [
    ["Licensor (Landlord)", landlordName],
    ["Licensee (Tenant)",   tenantName],
    ["Licensed Premises",   propShort],
    ["Monthly License Fee", `₹${rentAmt}`],   // ₹ rendered via Noto
    ["Commencement Date",   startDate],
  ];

  rows.forEach(([label, value], i) => {
    if (i % 2 === 1) {
      fill(245, 240, 235);
      doc.rect(M, y - 3, CW, 7, "F");
    }

    useHelv(false);
    doc.setFontSize(9);
    tc(...GREY);
    doc.text(label, M + 3, y + 1);

    // Use Noto for the value column so ₹ renders correctly
    if (notoReady) useNoto(); else useHelv(true);
    doc.setFontSize(9);
    tc(...INK);
    doc.text(value, W - M - 3, y + 1, { align: "right" });
    y += 7;
  });

  y += 5;

  /* ── MARATHI NOTE ── */
  if (isMr) {
    draw(...GOLD);
    doc.setLineWidth(0.35);
    doc.roundedRect(M, y, CW, 13, 2, 2, "S");
    tc(120, 80, 80);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const noteLines = doc.splitTextToSize(
      "Note: This agreement was drafted in Marathi. Please print for the Marathi version.",
      CW - 6,
    );
    doc.text(noteLines, M + 3, y + 5);
    y += 17;
  }

  y += 3;

  /* ── DIVIDER ── */
  draw(...LIGHT_GREY);
  doc.setLineWidth(0.2);
  doc.line(M, y, W - M, y);
  y += 7;

  /* ── AGREEMENT BODY ── */
  // If Marathi mode but font failed, show a clear fallback notice instead of garbled text
  if (isMr && !notoReady) {
    useHelv(false);
    doc.setFontSize(10);
    tc(...OXBLOOD);
    const msg = [
      "Marathi text rendering requires the Noto Sans Devanagari font.",
      "The font could not be downloaded at this time.",
      "",
      "Please use the Print button in the browser for the Marathi version,",
      "or switch to English language and download the PDF again.",
    ];
    msg.forEach(line => { doc.text(line, M, y); y += 7; });
    addFooter(1);
    const safeName = landlordName.replace(/[^\w\s]/g, "").replace(/\s+/g, "_").toLowerCase() || "landlord";
    doc.save(`mudrankseva_rent_agreement_${safeName}_marathi_fallback.pdf`);
    return;
  }

  // Strip box-drawing chars that Helvetica cannot render
  const cleanText = agreement.replace(/[─-╿]/g, "-");

  useBody();
  doc.setFontSize(9.5);
  tc(...INK);

  const lines = doc.splitTextToSize(cleanText, CW);
  let pageNum = 1;

  for (const line of lines) {
    if (y > BOTTOM) {
      addFooter(pageNum);
      pageNum++;
      doc.addPage();

      fill(...OXBLOOD);
      doc.rect(0, 0, W, 12, "F");
      tc(...GOLD);
      useHelv(true);
      doc.setFontSize(8);
      doc.text(
        isTest
          ? "TEST DOCUMENT  \xB7  NOT FOR LEGAL USE"
          : "MUDRANKSEVA  \xB7  Leave and License Agreement (continued)",
        M, 8,
      );

      y = 20;
      useBody();
      doc.setFontSize(9.5);
      tc(...INK);
    }
    doc.text(line, M, y);
    y += 5;
  }

  addFooter(pageNum);

  /* ── SAVE ── */
  const prefix = isTest ? "TEST_" : "";
  const safeName = landlordName
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase() || "landlord";
  doc.save(`${prefix}mudrankseva_rent_agreement_${safeName}.pdf`);
}
