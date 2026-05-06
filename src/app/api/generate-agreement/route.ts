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

interface FormData {
  landlordName: string;
  landlordAddress: string;
  landlordAadhaar?: string;
  tenantName: string;
  tenantAddress: string;
  tenantAadhaar?: string;
  propertyAddress: string;
  propertyType: string;
  furnishedStatus: string;
  monthlyRent: string;
  securityDeposit: string;
  startDate: string;
  duration: string;
  lockInPeriod: string;
  maintenancePaidBy: string;
  electricityPaidBy: string;
  waterPaidBy: string;
}

function buildPrompt(f: FormData, lang: string): string {
  const aadhaarLine = (label: string, num: string | undefined) =>
    num ? `\n- ${label} Aadhaar No.: XXXX-XXXX-${num.slice(-4)}` : "";

  return `You are a Maharashtra property law expert. Generate a complete, professional Maharashtra Leave and License Agreement based on the Maharashtra Rent Control Act, 1999, and the Registration Act, 1908.

Use the following details:

LICENSOR (LANDLORD):
- Full Name: ${f.landlordName}
- Address: ${f.landlordAddress}${aadhaarLine("Licensor", f.landlordAadhaar)}

LICENSEE (TENANT):
- Full Name: ${f.tenantName}
- Address: ${f.tenantAddress}${aadhaarLine("Licensee", f.tenantAadhaar)}

LICENSED PREMISES:
- Address: ${f.propertyAddress}
- Type: ${f.propertyType}
- Furnished Status: ${f.furnishedStatus}

FINANCIAL TERMS:
- Monthly License Fee: ₹${f.monthlyRent}/- (Rupees ${numberToWords(parseInt(f.monthlyRent, 10))} only)
- Security Deposit (Refundable): ₹${f.securityDeposit}/- (Rupees ${numberToWords(parseInt(f.securityDeposit, 10))} only)

AGREEMENT TERMS:
- Commencement Date: ${f.startDate}
- Duration: ${f.duration} months
- Lock-in Period: ${f.lockInPeriod} months

UTILITY RESPONSIBILITIES:
- Maintenance Charges: Paid by ${f.maintenancePaidBy}
- Electricity Charges: Paid by ${f.electricityPaidBy}
- Water Charges: Paid by ${f.waterPaidBy}

Generate a complete Leave and License Agreement with all of the following numbered clauses:
1. Preamble identifying both parties with full details
2. Description of the licensed premises
3. Duration of license and commencement date
4. Lock-in period terms
5. License fee amount, due date (1st of each month), and late payment penalty
6. Security deposit terms, interest-free refund on vacation subject to deductions
7. Purpose of use (residential/commercial as applicable)
8. Furnished items list if applicable
9. Utility payments responsibility as specified above
10. Licensee obligations (maintenance, no structural changes, no subletting)
11. Licensor's right of inspection with 24-hour notice
12. Termination clause with notice period (one month for either party)
13. Early termination and lock-in penalty clause
14. Renewal terms (mutual written consent, 10% increment on renewal)
15. Dispute resolution (jurisdiction: courts of ${extractCity(f.propertyAddress)})
16. General covenants and governing law (Maharashtra Rent Control Act, 1999)

CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
- Output PLAIN TEXT ONLY. This document will be printed directly; any formatting symbols will appear as literal characters on paper.
- Do NOT use markdown syntax of any kind: no #, ##, ###, **, *, _, \`, ---, >, or any other markdown markers.
- Do NOT use HTML tags of any kind: no <div>, <p>, <br>, <strong>, <em>, or any other HTML.
- Use ALL CAPS for the document title and for each clause heading.
- Number clauses as: "1. PREAMBLE", "2. DURATION OF LICENSE", etc.
- For the signature block, use plain underscores for blank lines: ___________________________
- Separate sections with a single blank line.

Format the document with:
- The title "LEAVE AND LICENSE AGREEMENT" in ALL CAPS on its own line
- "THIS LEAVE AND LICENSE AGREEMENT is entered into on this..." opening paragraph
- Numbered clauses with ALL CAPS headings
- A signature block for Licensor, Licensee, and two witnesses
- A "IN WITNESS WHEREOF" closing clause

${lang === "mr"
    ? "Draft this Leave and License Agreement entirely in formal legal Marathi (Devanagari script) as used in Maharashtra courts. Use proper legal Marathi terminology. All clauses, dates, amounts, and party names must be in Marathi."
    : "Write formally in English with key financial figures also written in words. The agreement must be ready for printing and notarization."}`;
}

function extractCity(address: string): string {
  const parts = address.split(",");
  return parts[parts.length - 2]?.trim() ?? "Maharashtra";
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

function sanitizeAgreement(text: string): string {
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
  console.log("ANTHROPIC_API_KEY present:", !!process.env.ANTHROPIC_API_KEY);
  console.log("KEY starts with:", process.env.ANTHROPIC_API_KEY?.substring(0, 10));
  const body = await request.json() as {
    formData: FormData;
    lang: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  const { formData, lang = "en", razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

  const isTestBypass =
    (process.env.NODE_ENV === "development" && razorpayPaymentId === "test_123") ||
    razorpayPaymentId === "test_mdev";

  console.log("[generate-agreement] isTestBypass:", isTestBypass, "| paymentId:", razorpayPaymentId);
  console.log("[generate-agreement] ANTHROPIC_API_KEY present:", Boolean(process.env.ANTHROPIC_API_KEY));

  if (!isTestBypass && !verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    console.error("[generate-agreement] Signature verification FAILED");
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
    const clean = sanitizeAgreement(raw);
    const divider = "\n" + "─".repeat(70) + "\n";

    return NextResponse.json({
      agreement: DISCLAIMER + divider + clean,
      disclaimer: DISCLAIMER,
    });
  } catch (err: unknown) {
    const e = err as { message?: string; status?: number; error?: unknown; name?: string };
    console.error("[generate-agreement] FULL ERROR:");
    console.error("  name   :", e.name);
    console.error("  message:", e.message);
    console.error("  status :", e.status);
    console.error("  error  :", JSON.stringify(e.error ?? null));
    return NextResponse.json(
      { error: e.message ?? "Failed to generate agreement" },
      { status: 500 },
    );
  }
}
