import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  }

  // Accept optional amount (paise) and product tag; default to ₹299 rent agreement
  const body = await request.json().catch(() => ({})) as { amount?: number; product?: string };
  const amount  = body.amount  ?? 29900;
  const product = body.product ?? "ra";

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `${product}_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error("[create-order]", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
