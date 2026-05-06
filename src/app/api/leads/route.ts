import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL ?? "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Lead captured]", JSON.stringify({ ...body, ts: new Date().toISOString() }));

    if (!WEBHOOK_URL) {
      console.warn("[Lead] GOOGLE_SHEET_WEBHOOK_URL not set — lead logged to console only");
      return NextResponse.json({ ok: true, saved: false, reason: "no webhook configured" });
    }

    const sheetRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!sheetRes.ok) {
      console.error("[Lead] Sheet webhook returned", sheetRes.status);
      return NextResponse.json({ ok: true, saved: false, reason: "webhook error" });
    }

    return NextResponse.json({ ok: true, saved: true });
  } catch (err) {
    console.error("[Lead] Error:", err);
    return NextResponse.json({ ok: true, saved: false, reason: "exception" });
  }
}
