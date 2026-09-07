"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderLookupForm() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        return;
      }
      router.push(`/mijn-bestelling/${data.orderId}`);
    } catch {
      setError("We konden geen verbinding maken. Controleer je internetverbinding en probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="orderNumber" className="text-horror-text-muted text-xs tracking-widest uppercase">
          Bestelnummer
        </label>
        <input
          id="orderNumber"
          name="orderNumber"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          autoComplete="off"
          placeholder="MHP-2026-0001"
          className="input-horror"
          aria-describedby={error ? "lookup-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lookupEmail" className="text-horror-text-muted text-xs tracking-widest uppercase">
          E-mailadres van de bestelling
        </label>
        <input
          id="lookupEmail"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="jouw@email.nl"
          className="input-horror"
          aria-describedby={error ? "lookup-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
        <p className="text-horror-text-muted text-xs">
          We vragen je e-mailadres zodat niemand anders jouw bestelling kan bekijken.
        </p>
      </div>

      {error && (
        <p
          id="lookup-error"
          role="alert"
          className="text-sm text-red-400 bg-red-950/30 border border-red-700/50 px-4 py-3"
        >
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Bezig met zoeken…
          </>
        ) : (
          <>
            Bestelling bekijken
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
