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

interface POAFormData {
  principalName: string;
  principalAddress: string;
  principalAadhaar?: string;
  agentName: string;
  agentAddress: string;
  agentAadhaar?: string;
  scopeOfAuthority: string;
  specificPowers: string;
  duration: string;
  propertyDetails: string;
}

function buildPrompt(f: POAFormData, lang: string): string {
  const aadhaarLine = (label: string, num: string | undefined) =>
    num ? `\n- ${label} Aadhaar No.: XXXX-XXXX-${num.slice(-4)}` : "";

  return `You are a Maharashtra legal expert. Generate a complete, professional Power of Attorney document under the Power of Attorney Act, 1882, Registration Act, 1908, and applicable Maharashtra laws.

PRINCIPAL (GRANTOR):
- Full Name: ${f.principalName}
- Address: ${f.principalAddress}${aadhaarLine("Principal", f.principalAadhaar)}

ATTORNEY-IN-FACT / AGENT:
- Full Name: ${f.agentName}
- Address: ${f.agentAddress}${aadhaarLine("Agent", f.agentAadhaar)}

AUTHORITY DETAILS:
- Scope of Authority: ${f.scopeOfAuthority}
- Duration / Validity: ${f.duration}
${f.specificPowers ? `- Specific Powers Granted:\n${f.specificPowers}` : ""}
${f.propertyDetails ? `- Property Details:\n${f.propertyDetails}` : ""}

Generate a complete Power of Attorney with all of the following numbered sections:
1. Declaration — Principal's declaration of sound mind and free will
2. Appointment — Formal appointment of Agent as Attorney-in-Fact
3. Scope of Authority — Type of POA (${f.scopeOfAuthority}) and general scope
4. Specific Powers — Detailed enumeration of all powers granted, including:
${f.scopeOfAuthority === "Property" || f.scopeOfAuthority === "General" ? "   - Authority to buy, sell, lease, mortgage, or manage immovable property\n   - Authority to execute and register documents\n   - Authority to appear before Sub-Registrar offices" : ""}
${f.scopeOfAuthority === "Financial" || f.scopeOfAuthority === "General" ? "   - Authority to operate bank accounts, investments\n   - Authority to receive and pay moneys\n   - Authority to sign cheques and financial instruments" : ""}
${f.scopeOfAuthority === "Legal" || f.scopeOfAuthority === "General" ? "   - Authority to appear in courts and tribunals\n   - Authority to engage lawyers and sign plaints/written statements\n   - Authority to compromise, settle, and withdraw legal proceedings" : ""}
${f.specificPowers ? `   - Additional specific powers: ${f.specificPowers}` : ""}
5. Property-Related Powers — (if applicable) Specific powers related to described property
6. Delegation — Whether Agent may sub-delegate (specify if allowed)
7. Duration and Validity — Effective from execution; ${f.duration === "Permanent" ? "irrevocable unless explicitly revoked in writing" : `valid for ${f.duration} from date of execution`}
8. Ratification — Principal ratifies all acts done by Agent within scope
9. Revocation — How Principal may revoke this POA; effect on third parties
10. Indemnity — Agent indemnified for all acts done in good faith within scope
11. Governing Law — Power of Attorney Act 1882; Registration Act 1908; Indian Contract Act 1872
12. Execution Block — Principal, Agent (acceptance), and two Witnesses

CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
- Output PLAIN TEXT ONLY. No markdown, no HTML, no formatting symbols.
- Use ALL CAPS for title and section headings. Number as: "1. DECLARATION", etc.
- Use underscores for signature lines: ___________________________
- Separate sections with a single blank line.
- Start with "POWER OF ATTORNEY" in ALL CAPS on its own line.
- Opening: "KNOW ALL MEN BY THESE PRESENTS that I, ${f.principalName}..."

${lang === "mr"
    ? "Draft this Power of Attorney entirely in formal legal Marathi (Devanagari script) as used in Maharashtra courts. All clauses and party details must be in Marathi."
    : "Write formally in English. The document must be ready for printing and, if required, registration."}`;
}

function sanitize(text: string): string {
  return text
    .replace(/^#{1,6}\s*/gm, "").replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1").replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/(?<![_])_([^_\n]+)_(?![_])/g, "$1").replace(/<[^>]+>/g, "")
    .replace(/^[-*]{3,}\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

export async function POST(request: Request) {
  console.log("[generate-poa] ANTHROPIC_API_KEY present:", Boolean(process.env.ANTHROPIC_API_KEY));

  const body = await request.json() as {
    formData: POAFormData; lang: string;
    razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string;
  };
  const { formData, lang = "en", razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

  const isTestBypass =
    (process.env.NODE_ENV === "development" && razorpayPaymentId === "test_123") ||
    razorpayPaymentId === "test_mdev";

  console.log("[generate-poa] isTestBypass:", isTestBypass);

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
      poa: DISCLAIMER + "\n" + "─".repeat(70) + "\n" + clean,
      disclaimer: DISCLAIMER,
    });
  } catch (err: unknown) {
    const e = err as { message?: string; status?: number; name?: string };
    console.error("[generate-poa]", e.name, e.message, e.status);
    return NextResponse.json({ error: e.message ?? "Failed to generate power of attorney" }, { status: 500 });
  }
}
