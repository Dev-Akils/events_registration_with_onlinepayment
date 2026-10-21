import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Registration } from "@/models/Registration";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const ref = new URL(req.url).searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  await connectDB();
  const reg = await Registration.findOne({ reference: ref }).lean();
  if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reference: reg.reference, status: reg.status, name: reg.name });
}
