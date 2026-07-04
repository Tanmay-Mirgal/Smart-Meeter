import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Pro plan price in paise (₹849 = 84900 paise)
export const PRO_PLAN_AMOUNT_PAISE = 84900;
export const PRO_PLAN_AMOUNT_USD = 10;

export function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay API keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(request: Request) {
  const clerkAuth = await auth();
  if (!clerkAuth.userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { orgId?: string } | null;
  const orgId = payload?.orgId?.trim();

  if (!orgId) {
    return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
  }

  if (clerkAuth.orgId !== orgId) {
    return NextResponse.json(
      { error: "Switch to the target organization before upgrading." },
      { status: 403 },
    );
  }

  try {
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: PRO_PLAN_AMOUNT_PAISE,
      currency: "INR",
      receipt: `smartmeet_pro_${orgId}_${Date.now()}`,
      notes: {
        orgId,
        userId: clerkAuth.userId,
        plan: "pro",
        product: "Smart Meet Pro",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[razorpay/create-order]", err);
    return NextResponse.json(
      { error: "Failed to create payment order. Please try again." },
      { status: 500 },
    );
  }
}
