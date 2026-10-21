import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validators";
import { TICKETS, CURRENCY } from "@/lib/config";
import { Registration } from "@/models/Registration";

export async function POST(req: Request) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;
    await connectDB();

    // Reuse an unpaid registration for the same email + ticket (prevents duplicates on retry)
    const existing = await Registration.findOne({ email: data.email, ticketType: data.ticketType });
    if (existing?.status === "paid") {
      return NextResponse.json({ error: "This email is already registered and paid." }, { status: 409 });
    }
    if (existing) {
      existing.name = data.name;
      existing.phone = data.phone;
      await existing.save();
      return NextResponse.json({ reference: existing.reference });
    }

    // Amount comes from the server config, never from the browser.
    const reference = `EVT-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    await Registration.create({
      ...data,
      reference,
      amount: TICKETS[data.ticketType].amount,
      currency: CURRENCY,
    });
    return NextResponse.json({ reference });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
