import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getStripe } from "@/lib/stripe";
import { TICKETS } from "@/lib/config";
import { Registration } from "@/models/Registration";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();
    await connectDB();
    const reg = await Registration.findOne({ reference });
    if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    if (reg.status === "paid") return NextResponse.json({ error: "Already paid" }, { status: 409 });

    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: reg.email,
      client_reference_id: reg.reference,
      metadata: { reference: reg.reference },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: reg.currency,
          unit_amount: reg.amount,
          product_data: { name: `Event ticket – ${TICKETS[reg.ticketType as keyof typeof TICKETS].label}` },
        },
      }],
      success_url: `${base}/success?ref=${reg.reference}`,
      cancel_url: `${base}/register`,
    });

    reg.stripeSessionId = session.id;
    await reg.save();
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create payment session" }, { status: 500 });
  }
}
