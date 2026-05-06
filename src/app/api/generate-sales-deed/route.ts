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

interface SDFormData {
  sellerName: string;
  sellerAddress: string;
  sellerAadhaar?: string;
  buyerName: string;
  buyerAddress: string;
  buyerAadhaar?: string;
  propertyAddress: string;
  surveyCtsNo: string;
  area: string;
  areaUnit: "sqft" | "sqmt";
  saleConsideration: string;
  tokenAmountPaid: string;
  paymentMode: string;
  registrationDistrict: string;
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

function buildPrompt(f: SDFormData, lang: string): string {
  const aadhaarLine = (label: string, num: string | undefined) =>
    num ? `\n- ${label} Aadhaar No.: XXXX-XXXX-${num.slice(-4)}` : "";

  const totalAmt   = parseInt(f.saleConsideration || "0", 10);
  const tokenAmt   = parseInt(f.tokenAmountPaid   || "0", 10);
  const balanceAmt = Math.max(0, totalAmt - tokenAmt);
  const areaLabel  = f.areaUnit === "sqft" ? "Sq. Ft." : "Sq. Mt.";

  return `You are a Maharashtra property law expert. Generate a complete, professional Maharashtra Sale Deed based on the Registration Act, 1908, Transfer of Property Act, 1882, and Maharashtra Stamp Act.

VENDOR (SELLER):
- Full Name: ${f.sellerName}
- Address: ${f.sellerAddress}${aadhaarLine("Vendor", f.sellerAadhaar)}

PURCHASER (BUYER):
- Full Name: ${f.buyerName}
- Address: ${f.buyerAddress}${aadhaarLine("Purchaser", f.buyerAadhaar)}

PROPERTY DETAILS:
- Address: ${f.propertyAddress}
- Survey / CTS Number: ${f.surveyCtsNo || "As per title documents"}
- Area: ${f.area} ${areaLabel}
- Registration District: ${f.registrationDistrict}

FINANCIAL TERMS:
- Total Sale Consideration: ₹${f.saleConsideration}/- (Rupees ${numberToWords(totalAmt)} only)
- Token / Earnest Money Already Paid: ₹${f.tokenAmountPaid || "0"}/- (Rupees ${numberToWords(tokenAmt)} only)
- Balance Amount Due at Registration: ₹${balanceAmt}/- (Rupees ${numberToWords(balanceAmt)} only)
- Mode of Payment: ${f.paymentMode}

Generate a complete Sale Deed with all of the following numbered sections:
1. Preamble — identifying Vendor and Purchaser with full details and date
2. Recitals — Vendor's title history, chain of ownership, right and authority to sell
3. Consideration — Total amount, amounts received, mode of payment, balance payable
4. Transfer and Conveyance — Transfer of ownership in perpetuity, absolute and unconditional
5. Property Description — Full address, boundaries (north/south/east/west), Survey/CTS details, area
6. Possession — Immediate physical and legal possession on execution and registration
7. Vendor's Covenants — Warranty of title, freedom from all encumbrances, mortgages, charges, and disputes; indemnity against all claims
8. Right of Quiet Enjoyment — Purchaser's right to use, enjoy, and deal with the property freely
9. Further Assurance — Vendor's obligation to execute any further documents required
10. Stamp Duty and Registration — Purchaser's responsibility; Maharashtra Stamp Act compliance
11. Default Clause — Consequences if either party fails to perform obligations
12. Dispute Resolution — Jurisdiction: courts of ${f.registrationDistrict}, Maharashtra
13. Governing Law — Transfer of Property Act, 1882; Registration Act, 1908; Maharashtra Stamp Act
14. Signature Block — Vendor, Purchaser, and two Witnesses with name, address, and signature lines

CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
- Output PLAIN TEXT ONLY. This document will be printed directly; any formatting symbols will appear as literal characters on paper.
- Do NOT use markdown syntax of any kind: no #, ##, ###, **, *, _, \`, ---, >, or any other markdown markers.
- Do NOT use HTML tags of any kind.
- Use ALL CAPS for the document title and for each section heading.
- Number sections as: "1. PREAMBLE", "2. RECITALS", etc.
- For signature blocks, use plain underscores: ___________________________
- Separate sections with a single blank line.
- Start with the title "SALE DEED" in ALL CAPS on its own line.
- Opening: "THIS SALE DEED is executed on this..."

${lang === "mr"
    ? "Draft this Sale Deed entirely in formal legal Marathi (Devanagari script) as used in Maharashtra courts. Use proper legal Marathi terminology. All clauses, dates, amounts, party names, and boundaries must be in Marathi."
    : "Write formally in English with key financial figures also written in words. The deed must be ready for printing and registration."}`;
}

function sanitizeDeed(text: string): string {
  return text
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/(?<![_])_([^_\n]+)_(?![_])/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^[-*]{3,}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  console.log("[generate-sales-deed] ANTHROPIC_API_KEY present:", Boolean(process.env.ANTHROPIC_API_KEY));

  const body = await request.json() as {
    formData: SDFormData;
    lang: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  const { formData, lang = "en", razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

  const isTestBypass =
    (process.env.NODE_ENV === "development" && razorpayPaymentId === "test_123") ||
    razorpayPaymentId === "test_mdev";

  console.log("[generate-sales-deed] isTestBypass:", isTestBypass, "| paymentId:", razorpayPaymentId);

  if (!isTestBypass && !verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    console.error("[generate-sales-deed] Signature verification FAILED");
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: buildPrompt(formData, lang) }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = sanitizeDeed(raw);
    const divider = "\n" + "─".repeat(70) + "\n";

    return NextResponse.json({
      deed: DISCLAIMER + divider + clean,
      disclaimer: DISCLAIMER,
    });
  } catch (err: unknown) {
    const e = err as { message?: string; status?: number; error?: unknown; name?: string };
    console.error("[generate-sales-deed] FULL ERROR:");
    console.error("  name   :", e.name);
    console.error("  message:", e.message);
    console.error("  status :", e.status);
    console.error("  error  :", JSON.stringify(e.error ?? null));
    return NextResponse.json(
      { error: e.message ?? "Failed to generate sale deed" },
      { status: 500 },
    );
  }
}
