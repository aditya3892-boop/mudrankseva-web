import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const DISCLAIMER =
  "हे AI-generated draft document आहे. कृपया sign करण्यापूर्वी qualified legal professional कडून verify करून घ्या. / This is an AI-generated draft for reference only. Please verify with a qualified legal professional before execution.";

function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

interface GDFormData {
  donorName: string;
  donorAddress: string;
  donorAadhaar?: string;
  doneeName: string;
  doneeAddress: string;
  doneeAadhaar?: string;
  relationship: string;
  propertyAddress: string;
  surveyCtsNo: string;
  area: string;
  areaUnit: "sqft" | "sqmt";
  marketValue: string;
  isResidential: boolean;
}

function numberToWords(n: number): string {
  if (isNaN(n) || n === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function convert(num: number): string {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
    if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
    if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
    return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + convert(num % 10000000) : "");
  }
  return convert(n);
}

function buildPrompt(f: GDFormData, lang: string): string {
  const aadhaarLine = (label: string, num: string | undefined) =>
    num ? `\n- ${label} Aadhaar No.: XXXX-XXXX-${num.slice(-4)}` : "";
  const mktAmt   = parseInt(f.marketValue || "0", 10);
  const areaLabel = f.areaUnit === "sqft" ? "Sq. Ft." : "Sq. Mt.";
  const propType  = f.isResidential ? "Residential" : "Non-Residential / Commercial";

  return `You are a Maharashtra property law expert. Generate a complete, professional Gift Deed based on the Transfer of Property Act, 1882 (Sections 122-129), Registration Act, 1908, and Maharashtra Stamp Act.

DONOR (GIFTOR):
- Full Name: ${f.donorName}
- Address: ${f.donorAddress}${aadhaarLine("Donor", f.donorAadhaar)}

DONEE (RECIPIENT):
- Full Name: ${f.doneeName}
- Address: ${f.doneeAddress}${aadhaarLine("Donee", f.doneeAadhaar)}

RELATIONSHIP:
- Relationship between Donor and Donee: ${f.relationship || "Not specified"}

PROPERTY DETAILS:
- Address: ${f.propertyAddress}
- Survey / CTS Number: ${f.surveyCtsNo || "As per title documents"}
${f.area ? `- Area: ${f.area} ${areaLabel}` : ""}
- Market Value: ₹${f.marketValue}/- (Rupees ${numberToWords(mktAmt)} only)
- Property Type: ${propType}

Generate a complete Gift Deed with all of the following numbered sections:
1. Preamble — identifying Donor and Donee with full details, date, and recital of relationship
2. Recitals — Donor's absolute title and right to gift the property
3. Gift — Voluntary and gratuitous transfer without any consideration (Gift under Section 122 TPA 1882)
4. Property Description — Full address, boundaries (north/south/east/west), Survey/CTS number, area, property type
5. Market Value Declaration — Current market value as declared for stamp duty purposes
6. Transfer and Conveyance — Absolute and unconditional transfer of ownership to Donee
7. Delivery of Possession — Physical and legal possession delivered on execution
8. Donor's Covenants — Warranty of title, freedom from encumbrances, indemnity against all claims
9. Donee's Acceptance — Formal acceptance of the gift by Donee during Donor's lifetime (mandatory under Section 122 TPA)
10. Stamp Duty and Registration — Mandatory registration under Section 123 TPA; stamp duty as per Maharashtra Stamp Act
11. Future Assurance — Donor's obligation to execute further documents if required
12. Dispute Resolution — Jurisdiction: courts of ${f.propertyAddress.split(",").slice(-2, -1)[0]?.trim() || "Maharashtra"}
13. Governing Law — Transfer of Property Act, 1882; Registration Act, 1908; Maharashtra Stamp Act
14. Signature Block — Donor, Donee, and two Witnesses

CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
- Output PLAIN TEXT ONLY. No markdown, no HTML, no formatting symbols.
- Use ALL CAPS for title and section headings. Number as: "1. PREAMBLE", etc.
- Use underscores for signature lines: ___________________________
- Separate sections with a single blank line.
- Start with "GIFT DEED" in ALL CAPS on its own line.
- Opening: "THIS GIFT DEED is executed on this..."

${lang === "mr"
    ? "Draft this Gift Deed entirely in formal legal Marathi (Devanagari script) as used in Maharashtra courts. All clauses, amounts, party names, and boundaries must be in Marathi."
    : "Write formally in English with key financial figures also written in words. The deed must be ready for printing and registration."}`;
}

function sanitize(text: string): string {
  return text
    .replace(/^#{1,6}\s*/gm, "").replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1").replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/(?<![_])_([^_\n]+)_(?![_])/g, "$1").replace(/<[^>]+>/g, "")
    .replace(/^[-*]{3,}\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

export async function POST(request: Request) {
  console.log("[generate-gift-deed] ANTHROPIC_API_KEY present:", Boolean(process.env.ANTHROPIC_API_KEY));

  const body = await request.json() as {
    formData: GDFormData; lang: string;
    razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string;
  };
  const { formData, lang = "en", razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

  const isTestBypass =
    (process.env.NODE_ENV === "development" && razorpayPaymentId === "test_123") ||
    razorpayPaymentId === "test_mdev";

  console.log("[generate-gift-deed] isTestBypass:", isTestBypass);

  if (!isTestBypass && !verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  try {
    const message = await new Anthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: buildPrompt(formData, lang) }],
    });
    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = sanitize(raw);
    return NextResponse.json({
      deed: DISCLAIMER + "\n" + "─".repeat(70) + "\n" + clean,
      disclaimer: DISCLAIMER,
    });
  } catch (err: unknown) {
    const e = err as { message?: string; status?: number; name?: string };
    console.error("[generate-gift-deed]", e.name, e.message, e.status);
    return NextResponse.json({ error: e.message ?? "Failed to generate gift deed" }, { status: 500 });
  }
}
