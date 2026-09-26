"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { company } from "@/lib/companyInfo";

export default function NotifyForm({ product }: { product: Product }) {
  const { language } = useLanguage();
  const nl = language === "nl";
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackError = nl
    ? `Verzenden is mislukt. Mail ons op ${company.email}.`
    : `Sending failed. Please email us at ${company.email}.`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "notify", language, website, email, productId: product.id }),
      });
      // Success only on a 2xx — a stock alert nobody registered is worse than an error.
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? fallbackError);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(fallbackError);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-horror-orange text-xs text-center py-3">
        {nl
          ? `Bedankt! We laten je weten zodra ${product.name} weer op voorraad is.`
          : `Thanks! We'll let you know as soon as ${product.name} is back in stock.`}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={nl ? "jouw@email.nl" : "you@email.com"}
          className="input-horror flex-1 text-sm"
        />
        {/* Honeypot: hidden from people, filled in by bots. */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex-shrink-0 px-4 py-2 bg-horror-orange/10 border border-horror-orange/30 text-horror-orange text-xs font-bold tracking-wider uppercase hover:bg-horror-orange hover:text-black transition-colors duration-300 disabled:opacity-60"
        >
          {loading ? "..." : nl ? "Laat het weten" : "Notify me"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-red-400 text-xs leading-relaxed">
          {error}
        </p>
      )}
    </form>
  );
}
