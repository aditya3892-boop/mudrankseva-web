import { jsPDF } from "jspdf";

export interface AgreementPdfInput {
  agreement: string;
  lang: string;
  landlordName: string;
  tenantName: string;
  propertyAddress: string;
  rent: string;
  startDate: string;
}

const OXBLOOD    = [74,  18,  18]  as const;
const GOLD       = [212, 175, 55]  as const;
const GOLD_MUT   = [180, 148, 40]  as const;
const INK        = [26,  5,   5]   as const;
const GREY       = [100, 80,  80]  as const;
const LIGHT_GREY = [220, 210, 210] as const;

const W        = 210;
const M        = 16;
const CW       = W - 2 * M;
const FOOTER_Y = 284;
const BOTTOM   = 274;

export function generateAgreementPdf(input: AgreementPdfInput): void {
  const { agreement, lang, landlordName, tenantName, propertyAddress, rent, startDate } = input;
  const isMr = lang === "mr";

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const fill = (...c: readonly [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const tc   = (...c: readonly [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const draw = (...c: readonly [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const sf   = (bold = false) => doc.setFont("helvetica", bold ? "bold" : "normal");

  function addFooter(pageNum: number) {
    fill(...OXBLOOD);
    doc.rect(0, FOOTER_Y, W, 13, "F");
    fill(...GOLD);
    doc.rect(0, FOOTER_Y, W, 0.8, "F");
    tc(...GOLD_MUT);
    sf(false);
    doc.setFontSize(7.5);
    doc.text(
      `Mudrankseva  \xB7  mudrankseva.in  \xB7  Maharashtra Property Services  \xB7  Page ${pageNum}`,
      W / 2, FOOTER_Y + 8,
      { align: "center" },
    );
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
  sf(true);
  doc.setFontSize(13);
  doc.text("Leave and License Agreement", M, 34);

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  tc(...GOLD_MUT);
  sf(false);
  doc.setFontSize(8);
  doc.text(dateStr, W - M, 34, { align: "right" });

  let y = 50;

  /* ── SUMMARY BOX ── */
  fill(...OXBLOOD);
  doc.rect(M, y, CW, 7, "F");
  tc(...GOLD);
  sf(true);
  doc.setFontSize(7.5);
  doc.text("PARTIES & PROPERTY DETAILS", M + 3, y + 5);
  y += 11;

  const propShort = propertyAddress.length > 60
    ? propertyAddress.slice(0, 57) + "..."
    : propertyAddress;

  const rows: [string, string][] = [
    ["Licensor (Landlord)", landlordName],
    ["Licensee (Tenant)",   tenantName],
    ["Licensed Premises",   propShort],
    ["Monthly License Fee", `Rs. ${parseInt(rent || "0", 10).toLocaleString("en-IN")}`],
    ["Commencement Date",   startDate],
  ];

  rows.forEach(([label, value], i) => {
    if (i % 2 === 1) {
      fill(245, 240, 235);
      doc.rect(M, y - 3, CW, 7, "F");
    }
    sf(false);
    doc.setFontSize(9);
    tc(...GREY);
    doc.text(label, M + 3, y + 1);
    doc.setFont("helvetica", "bold");
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

  /* ── AGREEMENT TEXT ── */
  // Replace Unicode box-drawing chars (─) that Helvetica cannot render
  const cleanText = agreement.replace(/[─-╿]/g, "-");

  sf(false);
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
      sf(true);
      doc.setFontSize(8);
      doc.text("MUDRANKSEVA  \xB7  Leave and License Agreement (continued)", M, 8);

      y = 20;
      sf(false);
      doc.setFontSize(9.5);
      tc(...INK);
    }
    doc.text(line, M, y);
    y += 5;
  }

  addFooter(pageNum);

  /* ── SAVE ── */
  const safeName = landlordName
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase() || "landlord";
  doc.save(`mudrankseva_rent_agreement_${safeName}.pdf`);
}
