import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { getStripe } from "@/lib/stripe";
import { Registration } from "@/models/Registration";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // Raw body is required for signature verification.
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();
  const obj = event.data.object as Stripe.Checkout.Session;
  const reference = obj.metadata?.reference;

  if (reference) {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      if (obj.payment_status === "paid") {
        await Registration.updateOne(
          { reference },
          { status: "paid", paidAt: new Date(), paymentIntentId: String(obj.payment_intent ?? "") }
        );
      }
    } else if (event.type === "checkout.session.async_payment_failed") {
      await Registration.updateOne({ reference, status: { $ne: "paid" } }, { status: "failed" });
    } else if (event.type === "checkout.session.expired") {
      await Registration.updateOne({ reference, status: "pending" }, { status: "expired" });
    }
  }
  return NextResponse.json({ received: true });
}
