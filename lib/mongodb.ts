import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("MONGODB_URI is not set");

const g = global as unknown as { _mongoose?: { conn: typeof mongoose | null; p: Promise<typeof mongoose> | null } };
const cached = (g._mongoose ??= { conn: null, p: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.p ??= mongoose.connect(uri);
  cached.conn = await cached.p;
  return cached.conn;
}
