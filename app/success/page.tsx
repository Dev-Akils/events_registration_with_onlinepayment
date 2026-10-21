"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function Status() {
  const ref = useSearchParams().get("ref");
  const [status, setStatus] = useState<string>("checking");

  // The webhook is the source of truth; this page only reads the saved status.
  useEffect(() => {
    if (!ref) return;
    let tries = 0;
    const timer = setInterval(async () => {
      const r = await fetch(`/api/status?ref=${ref}`, { cache: "no-store" });
      const d = await r.json();
      setStatus(d.status ?? "unknown");
      if (d.status === "paid" || ++tries >= 10) clearInterval(timer);
    }, 2000);
    return () => clearInterval(timer);
  }, [ref]);

  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      {status === "paid" ? (
        <>
          <h1 className="text-3xl font-bold text-green-600">You&apos;re registered!</h1>
          <p className="mt-4">Your reference number:</p>
          <p className="mt-1 text-2xl font-mono font-bold">{ref}</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Confirming your payment…</h1>
          <p className="mt-4 text-slate-600">This usually takes a few seconds. Reference: {ref}</p>
          {status !== "checking" && status !== "pending" && <p className="mt-2 text-sm">Status: {status}</p>}
        </>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return <Suspense><Status /></Suspense>;
}
