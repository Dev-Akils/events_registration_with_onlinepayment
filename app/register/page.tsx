// "use client";
// import { useState } from "react";
// import { TICKETS, CURRENCY } from "@/lib/config";

// export default function RegisterPage() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (loading) return; // blocks double submits
//     setLoading(true);
//     setError("");
//     const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
//     try {
//       const r = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const reg = await r.json();
//       if (!r.ok) throw new Error(reg.error || "Registration failed");

//       const c = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reference: reg.reference }),
//       });
//       const chk = await c.json();
//       if (!c.ok) throw new Error(chk.error || "Could not start payment");
//       window.location.href = chk.url; // Stripe Checkout
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong");
//       setLoading(false);
//     }
//   }

//   const input = "mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";
//   return (
//     <main className="mx-auto max-w-md px-6 py-16">
//       <h1 className="text-3xl font-bold">Register</h1>
//       <form onSubmit={onSubmit} className="mt-6 space-y-4">
//         <label className="block text-sm font-medium">Full name
//           <input name="name" required minLength={2} className={input} />
//         </label>
//         <label className="block text-sm font-medium">Email
//           <input name="email" type="email" required className={input} />
//         </label>
//         <label className="block text-sm font-medium">Phone
//           <input name="phone" type="tel" required minLength={6} className={input} />
//         </label>
//         <label className="block text-sm font-medium">Ticket type
//           <select name="ticketType" className={input} defaultValue="general">
//             {Object.entries(TICKETS).map(([k, t]) => (
//               <option key={k} value={k}>{t.label} – {CURRENCY.toUpperCase()} {(t.amount / 100).toFixed(2)}</option>
//             ))}
//           </select>
//         </label>
//         {error && <p className="text-sm text-red-600">{error}</p>}
//         <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
//           {loading ? "Please wait…" : "Continue to payment"}
//         </button>
//       </form>
//     </main>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { Anton, Archivo, Caveat } from "next/font/google";
import { TICKETS, CURRENCY } from "@/lib/config";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Archivo({ subsets: ["latin"], variable: "--font-body" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });
const D = "font-[family-name:var(--font-display)]";
const H = "font-[family-name:var(--font-hand)]";

const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.022' numOctaves='4' seed='7'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.8 -0.6'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // blocks double submits
    setLoading(true);
    setError("");
    const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const reg = await r.json();
      if (!r.ok) throw new Error(reg.error || "Registration failed");

      const c = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reg.reference }),
      });
      const chk = await c.json();
      if (!c.ok) throw new Error(chk.error || "Could not start payment");
      window.location.href = chk.url; // Stripe Checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const label = `${D} block text-sm uppercase tracking-wider text-[#0b0b0b]`;
  const input =
    "mt-1 w-full border-2 border-[#0b0b0b] bg-white px-3 py-2 font-[family-name:var(--font-body)] text-base font-semibold text-[#0b0b0b] placeholder:text-black/30 focus:border-[#e0141c] focus:outline-none focus:ring-4 focus:ring-[#e0141c]/25";

  return (
    <main className={`${display.variable} ${body.variable} ${hand.variable} relative min-h-screen overflow-hidden bg-gradient-to-b from-[#e3151c] via-[#b30f14] to-[#3d0205] px-6 py-3 font-[family-name:var(--font-body)] text-white`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-90 mix-blend-soft-light" style={{ backgroundImage: NOISE, backgroundSize: "500px 500px" }} />

      <div className="relative mx-auto max-w-md">
        <Link href="/" className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white">← Back</Link>

        <h1 className={`${D} mt-2 text-6xl uppercase leading-[0.9] md:leading-[0.5] text-white/90 md:text-7xl`}>
          Get your<br />ticket
        </h1>
        <p className={`${H} mt-2 -rotate-2 text-3xl text-white`}>no cap, it takes 1 minute</p>

        <form onSubmit={onSubmit} className="mt-5 md:mt-2.5 rotate-[0.6deg] space-y-4 bg-[#ecebe8] p-6 text-[#0b0b0b] shadow-2xl">
          <label className={label}>Full name
            <input name="name" required minLength={2} placeholder="Your name" className={input} />
          </label>
          <label className={label}>Email
            <input name="email" type="email" required placeholder="you@example.com" className={input} />
          </label>
          <label className={label}>Phone
            <input name="phone" type="tel" required minLength={6} placeholder="+65 ..." className={input} />
          </label>
          <label className={label}>Ticket type
            <select name="ticketType" className={input} defaultValue="general">
              {Object.entries(TICKETS).map(([k, t]) => (
                <option key={k} value={k}>{t.label} – {CURRENCY.toUpperCase()} {(t.amount / 100).toFixed(2)}</option>
              ))}
            </select>
          </label>

          {error && <p className="border-l-4 border-[#e0141c] bg-[#e0141c]/10 px-3 py-2 text-sm font-bold text-[#b30f14]">{error}</p>}

          <button
            disabled={loading}
            className={`${D} w-full bg-[#e0141c] py-4 text-2xl uppercase tracking-wide text-white transition hover:bg-[#0b0b0b] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {loading ? "Please wait…" : "Continue to payment →"}
          </button>
          <p className="text-center text-xs font-semibold text-black/50">Secure payment by Stripe. We never see your card details.</p>
        </form>
      </div>
    </main>
  );
}

