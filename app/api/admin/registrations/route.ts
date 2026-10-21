import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Registration } from "@/models/Registration";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const status = url.searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (status && ["pending", "paid", "failed", "expired"].includes(status)) filter.status = status;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { reference: rx }];
  }
  await connectDB();
  const items = await Registration.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json({ items });
}
