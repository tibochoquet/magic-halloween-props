"use client";

import { useState } from "react";
import { Bell, Tag, Flame } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslation();
  const n = t.newsletter;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  }

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden -mt-px"
      style={{ background: `linear-gradient(rgba(10,10,10,0.58), rgba(10,10,10,0.58)), url('/footer-atmosphere-bg.png') center / cover no-repeat #0A0A0A` }}
    >
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,107,0,0.07) 0%, transparent 60%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-5 md:px-8 text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="h-px w-10 bg-horror-orange/50" />
          <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">{n.eyebrow}</span>
          <div className="h-px w-10 bg-horror-orange/50" />
        </div>

        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-horror-text-primary leading-tight mb-4">
          {n.title}{" "}
          <span className="text-horror-orange text-glow">{n.titleAccent}</span>
        </h2>

        <p className="text-horror-text-secondary text-base leading-relaxed mb-10">{n.body}</p>

        {submitted ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-horror-orange flex items-center justify-center text-horror-orange animate-glow-pulse">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-horror-text-primary font-cinzel font-bold text-xl">{n.successTitle}</p>
            <p className="text-horror-text-muted text-sm">{n.successBody}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={n.placeholder}
              required
              className="input-horror flex-1"
            />
            <button type="submit" disabled={loading} className="btn-primary min-w-44 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  {n.button}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-4 text-horror-text-muted text-xs">{n.nospam}</p>

        {!submitted && (
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { Icon: Bell, text: n.perks.early },
              { Icon: Tag, text: n.perks.discount },
              { Icon: Flame, text: n.perks.deals },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-horror-text-muted text-sm">
                <f.Icon size={14} strokeWidth={1.5} className="text-horror-orange/50 flex-shrink-0" />
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
