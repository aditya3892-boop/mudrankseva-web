import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();

  // Always log — works in all environments
  console.log("[Lead captured]", JSON.stringify(body));

  // Write to leads.json (works locally; skipped on read-only Vercel FS)
  try {
    const filePath = path.join(process.cwd(), "leads.json");
    let leads: unknown[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      leads = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — start fresh
    }
    leads.push({ ...body, ts: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(leads, null, 2), "utf-8");
  } catch {
    // Silently skip on read-only filesystems (production)
  }

  return NextResponse.json({ ok: true });
}
