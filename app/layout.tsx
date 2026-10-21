import "./globals.css";
import type { Metadata } from "next";
import { EVENT } from "@/lib/config";

export const metadata: Metadata = { title: EVENT.name, description: EVENT.description };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}
