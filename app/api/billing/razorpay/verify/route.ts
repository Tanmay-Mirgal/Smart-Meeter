import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";

async function getConvexToken() {
  const clerkAuth = await auth();
  if (!clerkAuth.userId) return null;
  if (clerkAuth.sessionClaims?.aud === "convex") return await clerkAuth.getToken();
  return await clerkAuth.getToken({ template: "convex" });
}

export async function POST(request: Request) {
  const clerkAuth = await auth();
  if (!clerkAuth.userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    orgId?: string;
  } | null;

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orgId } = payload ?? {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orgId) {
    return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
  }

  if (clerkAuth.orgId !== orgId) {
    return NextResponse.json({ error: "Organization mismatch" }, { status: 403 });
  }

  // ── Verify HMAC-SHA256 signature ──────────────────────────────────────────
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payment verification unavailable" }, { status: 500 });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Payment signature verification failed. Do not retry." },
      { status: 400 },
    );
  }

  // ── Sync Pro plan to Convex ───────────────────────────────────────────────
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexToken = await getConvexToken();

  if (!convexUrl || !convexToken) {
    return NextResponse.json({ error: "Billing sync unavailable" }, { status: 500 });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    convex.setAuth(convexToken);

    await convex.mutation(api.billing.index.syncOrganizationBillingSnapshot, {
      orgId,
      planKey: "pro",
      planName: "Pro Plan",
      maxMeetings: null, // unlimited
      features: {
        unlimitedMeetings: true,
        aiSummary: true,
        notionExport: true,
        recording: true,
        googleCalendarSync: true,
      },
    });

    return NextResponse.json({
      ok: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      plan: "pro",
    });
  } catch (err) {
    console.error("[razorpay/verify] Convex sync failed:", err);
    // Payment was real but sync failed — log and return partial success
    return NextResponse.json(
      {
        ok: false,
        paymentId: razorpay_payment_id,
        error: "Payment successful but plan sync failed. Contact support with your payment ID.",
      },
      { status: 500 },
    );
  }
}
