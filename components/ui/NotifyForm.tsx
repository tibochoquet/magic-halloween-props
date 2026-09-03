"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotifyForm({ productName }: { productName: string }) {
  const { language } = useLanguage();
  const nl = language === "nl";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  }

  if (submitted) {
    return (
      <p className="text-horror-orange text-xs text-center py-3">
        {nl
          ? `Bedankt! We laten je weten zodra ${productName} weer op voorraad is.`
          : `Thanks! We'll let you know as soon as ${productName} is back in stock.`}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={nl ? "jouw@email.nl" : "you@email.com"}
        className="input-horror flex-1 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex-shrink-0 px-4 py-2 bg-horror-orange/10 border border-horror-orange/30 text-horror-orange text-xs font-bold tracking-wider uppercase hover:bg-horror-orange hover:text-black transition-colors duration-300 disabled:opacity-60"
      >
        {loading ? "..." : (nl ? "Laat het weten" : "Notify me")}
      </button>
    </form>
  );
}
