// "use client";
// import { useState } from "react";

// type Row = { _id: string; reference: string; name: string; email: string; phone: string; ticketType: string; amount: number; currency: string; status: string; createdAt: string };

// export default function AdminPage() {
//   const [token, setToken] = useState("");
//   const [q, setQ] = useState("");
//   const [status, setStatus] = useState("");
//   const [rows, setRows] = useState<Row[] | null>(null);
//   const [error, setError] = useState("");

//   async function load() {
//     setError("");
//     const p = new URLSearchParams();
//     if (q) p.set("q", q);
//     if (status) p.set("status", status);
//     const r = await fetch(`/api/admin/registrations?${p}`, { headers: { "x-admin-token": token } });
//     if (!r.ok) { setRows(null); setError(r.status === 401 ? "Wrong token" : "Failed to load"); return; }
//     setRows((await r.json()).items);
//   }

//   const field = "rounded-lg border px-3 py-2";
//   return (
//     <main className="mx-auto max-w-5xl px-6 py-10">
//       <h1 className="text-2xl font-bold">Registrations</h1>
//       <div className="mt-4 flex flex-wrap gap-2">
//         <input type="password" placeholder="Admin token" value={token} onChange={(e) => setToken(e.target.value)} className={field} />
//         <input placeholder="Search name / email / ref" value={q} onChange={(e) => setQ(e.target.value)} className={field} />
//         <select value={status} onChange={(e) => setStatus(e.target.value)} className={field}>
//           <option value="">All</option><option value="paid">Paid</option><option value="pending">Pending</option>
//           <option value="failed">Failed</option><option value="expired">Expired</option>
//         </select>
//         <button onClick={load} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Load</button>
//       </div>
//       {error && <p className="mt-3 text-red-600">{error}</p>}
//       {rows && (
//         <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
//           <table className="w-full text-left text-sm">
//             <thead className="bg-slate-100"><tr>
//               {["Reference", "Name", "Email", "Phone", "Ticket", "Amount", "Status", "Created"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
//             </tr></thead>
//             <tbody>
//               {rows.map((r) => (
//                 <tr key={r._id} className="border-t">
//                   <td className="px-3 py-2 font-mono">{r.reference}</td><td className="px-3 py-2">{r.name}</td>
//                   <td className="px-3 py-2">{r.email}</td><td className="px-3 py-2">{r.phone}</td>
//                   <td className="px-3 py-2">{r.ticketType}</td>
//                   <td className="px-3 py-2">{r.currency.toUpperCase()} {(r.amount / 100).toFixed(2)}</td>
//                   <td className="px-3 py-2 font-semibold">{r.status}</td>
//                   <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//               {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-slate-500">No registrations</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </main>
//   );
// }

"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Anton, Archivo } from "next/font/google";
import { CURRENCY } from "@/lib/config";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Archivo({ subsets: ["latin"], variable: "--font-body" });
const D = "font-[family-name:var(--font-display)]";

const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.022' numOctaves='4' seed='7'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.8 -0.6'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;

type Row = {
  _id: string; reference: string; name: string; email: string; phone: string;
  ticketType: string; amount: number; currency: string; status: string; createdAt: string;
};

const STATUSES = ["", "paid", "pending", "failed", "expired"];
const BADGE: Record<string, string> = {
  paid: "bg-green-600 text-white",
  pending: "bg-yellow-400 text-black",
  failed: "bg-[#e0141c] text-white",
  expired: "bg-zinc-500 text-white",
};

export default function AdminPage() {
  const [token, setToken] = useState("");       // what the person types
  const [authed, setAuthed] = useState("");     // token that worked (kept for this browser tab)
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (tk: string, query: string, st: string) => {
    setBusy(true);
    setError("");
    try {
      const p = new URLSearchParams();
      if (query.trim()) p.set("q", query.trim());
      if (st) p.set("status", st);
      const r = await fetch(`/api/admin/registrations?${p}`, { headers: { "x-admin-token": tk } });
      if (r.status === 401) {
        sessionStorage.removeItem("admin-token");
        setAuthed("");
        setRows(null);
        setError(
          tk
            ? "Wrong token. Use the value after ADMIN_TOKEN= in .env.local (no quotes or spaces). If you just edited that file, restart npm run dev."
            : "Please enter the admin token."
        );
        return;
      }
      if (!r.ok) throw new Error();
      setRows((await r.json()).items);
      setAuthed(tk);
      sessionStorage.setItem("admin-token", tk);
    } catch {
      setError("Could not load registrations. Is the server running?");
    } finally {
      setBusy(false);
    }
  }, []);

  // Reuse the token from earlier in this browser tab, so refreshing doesn't log you out.
  useEffect(() => {
    const saved = sessionStorage.getItem("admin-token");
    if (saved) { setToken(saved); load(saved, "", ""); }
  }, [load]);

  function logout() {
    sessionStorage.removeItem("admin-token");
    setAuthed(""); setToken(""); setRows(null); setQ(""); setStatus(""); setError("");
  }

  function exportCsv() {
    if (!rows) return;
    const head = ["Reference", "Name", "Email", "Phone", "Ticket", "Amount", "Currency", "Status", "Created"];
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = rows.map((r) =>
      [r.reference, r.name, r.email, r.phone, r.ticketType, (r.amount / 100).toFixed(2), r.currency.toUpperCase(), r.status, new Date(r.createdAt).toISOString()].map(esc).join(",")
    );
    const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "registrations.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const paid = rows?.filter((r) => r.status === "paid") ?? [];
  const pending = rows?.filter((r) => r.status === "pending").length ?? 0;
  const revenue = paid.reduce((s, r) => s + r.amount, 0);

  const field = "border-2 border-[#0b0b0b] bg-white px-3 py-2.5 text-base font-semibold text-[#0b0b0b] placeholder:text-black/30 focus:border-[#e0141c] focus:outline-none focus:ring-4 focus:ring-[#e0141c]/25";

  return (
    <main className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-gradient-to-b from-[#e3151c] via-[#b30f14] to-[#3d0205] px-4 py-10 font-[family-name:var(--font-body)] text-white md:px-8`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-90 mix-blend-soft-light" style={{ backgroundImage: NOISE, backgroundSize: "500px 500px" }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white">← Site</Link>
          {authed && <button onClick={logout} className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white">Log out</button>}
        </div>
        <h1 className={`${D} mt-4 text-6xl uppercase leading-[0.9] text-white/90 md:text-7xl`}>Registrations</h1>

        {/* LOGIN */}
        {!authed && (
          <form
            onSubmit={(e) => { e.preventDefault(); load(token.trim(), "", ""); }}
            className="mt-8 max-w-md rotate-[0.5deg] space-y-4 bg-[#ecebe8] p-6 text-[#0b0b0b] shadow-2xl"
          >
            <label className={`${D} block text-sm uppercase tracking-wider`}>Admin token
              <input type="password" autoFocus value={token} onChange={(e) => setToken(e.target.value)}
                     placeholder="Paste your ADMIN_TOKEN" className={`${field} mt-1 w-full`} />
            </label>
            {error && <p className="border-l-4 border-[#e0141c] bg-[#e0141c]/10 px-3 py-2 text-sm font-bold text-[#b30f14]">{error}</p>}
            <button disabled={busy} className={`${D} w-full bg-[#e0141c] py-3 text-xl uppercase tracking-wide text-white transition hover:bg-[#0b0b0b] disabled:opacity-50`}>
              {busy ? "Checking…" : "Enter →"}
            </button>
          </form>
        )}

        {/* DASHBOARD */}
        {authed && rows && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { l: "Shown", v: String(rows.length) },
                { l: "Paid", v: String(paid.length) },
                { l: "Pending", v: String(pending) },
                { l: "Paid total", v: `${CURRENCY.toUpperCase()} ${(revenue / 100).toFixed(2)}` },
              ].map((s) => (
                <div key={s.l} className="-rotate-[0.5deg] bg-[#ecebe8] p-4 text-[#0b0b0b] shadow-xl">
                  <p className="text-xs font-bold uppercase tracking-wider text-black/50">{s.l}</p>
                  <p className={`${D} text-3xl`}>{s.v}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); load(authed, q, status); }}
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / email / ref" className={`${field} min-w-[16rem] flex-1`} />
              <select value={status} onChange={(e) => { setStatus(e.target.value); load(authed, q, e.target.value); }} className={field}>
                {STATUSES.map((s) => <option key={s} value={s}>{s ? s[0].toUpperCase() + s.slice(1) : "All statuses"}</option>)}
              </select>
              <button className={`${D} bg-[#0b0b0b] px-5 py-2.5 text-lg uppercase tracking-wide text-white hover:bg-white hover:text-[#e0141c]`}>{busy ? "…" : "Search"}</button>
              <button type="button" onClick={() => load(authed, q, status)} className={`${D} border-2 border-white px-5 py-2 text-lg uppercase tracking-wide hover:bg-white hover:text-[#e0141c]`}>Refresh</button>
              <button type="button" onClick={exportCsv} className={`${D} border-2 border-white px-5 py-2 text-lg uppercase tracking-wide hover:bg-white hover:text-[#e0141c]`}>Export CSV</button>
            </form>

            <div className="mt-6 overflow-x-auto bg-[#ecebe8] text-[#0b0b0b] shadow-2xl">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead className="bg-[#0b0b0b] text-white">
                  <tr>
                    {["Reference", "Name", "Email", "Phone", "Ticket", "Amount", "Status", "Created"].map((h) => (
                      <th key={h} className={`${D} px-3 py-3 text-base font-normal uppercase tracking-wide`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-t border-black/15 odd:bg-white/50">
                      <td className="px-3 py-2.5 font-mono font-bold">{r.reference}</td>
                      <td className="px-3 py-2.5 font-semibold">{r.name}</td>
                      <td className="px-3 py-2.5">{r.email}</td>
                      <td className="px-3 py-2.5">{r.phone}</td>
                      <td className="px-3 py-2.5 capitalize">{r.ticketType}</td>
                      <td className="px-3 py-2.5 font-semibold">{r.currency.toUpperCase()} {(r.amount / 100).toFixed(2)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${BADGE[r.status] ?? "bg-zinc-300"}`}>{r.status}</span>
                      </td>
                      <td className="px-3 py-2.5 text-black/60">{new Date(r.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={8} className="px-3 py-10 text-center font-semibold text-black/50">No registrations found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {error && <p className="mt-3 font-bold text-white">{error}</p>}
          </>
        )}
      </div>
    </main>
  );
}

