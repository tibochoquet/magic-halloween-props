"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function AboutContent() {
  const t = useTranslation();
  const a = t.about;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.07) 0%, transparent 55%)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.3), transparent)" }} />
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-horror-orange/50" />
            <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">{a.eyebrow}</span>
            <div className="h-px w-10 bg-horror-orange/50" />
          </div>
          <h1 className="font-cinzel text-5xl md:text-6xl font-black text-horror-text-primary mb-6 leading-tight">
            {a.h1a}<br /><span className="text-horror-orange">{a.h1b}</span>
          </h1>
          <p className="text-horror-text-secondary text-lg leading-relaxed max-w-2xl mx-auto mb-10">{a.intro}</p>
          <Link href="/shop" className="btn-primary inline-flex">
            {a.cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 border-t border-horror-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {a.pillars.map((p) => (
              <div key={p.title} className="bg-horror-card border border-horror-border p-8 hover:border-horror-orange/30 transition-colors duration-300">
                <div className="text-3xl mb-5">{p.icon}</div>
                <h3 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-3">{p.title}</h3>
                <p className="text-horror-text-muted text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 overflow-hidden relative" style={{ background: "linear-gradient(to bottom, #0A0A0A, #0D0810, #0A0A0A)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,0,0,0.05) 0%, transparent 65%)" }} />
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-horror-orange/50" />
              <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">{a.howEyebrow}</span>
            </div>
            <h2 className="font-cinzel text-4xl font-bold text-horror-text-primary">
              {a.howTitle} <span className="text-horror-orange">{a.howAccent}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            <div className="hidden md:block absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-horror-border" />
            {a.steps.map((s) => (
              <div key={s.step} className="relative flex flex-col items-center text-center px-8 pb-12 md:pb-0">
                <div className="w-16 h-16 border border-horror-orange/40 bg-horror-black flex items-center justify-center mb-6 relative z-10">
                  <span className="font-cinzel font-black text-horror-orange text-xl">{s.step}</span>
                </div>
                <h3 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-3">{s.title}</h3>
                <p className="text-horror-text-muted text-sm leading-relaxed max-w-xs">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit / Location */}
      <section className="py-20 border-t border-horror-border">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-horror-orange/50" />
                <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">{a.warehouseEyebrow}</span>
              </div>
              <h2 className="font-cinzel text-3xl font-bold text-horror-text-primary mb-5">
                {a.warehouseTitle} <span className="text-horror-orange">{a.warehouseAccent}</span>
              </h2>
              <p className="text-horror-text-secondary text-base leading-relaxed mb-8">{a.warehouseBody}</p>
              <div className="space-y-3 mb-8">
                {a.contactDetails.map(({ label, value }) => (
                  <div key={label} className="flex gap-4 text-sm">
                    <span className="text-horror-text-muted w-20 flex-shrink-0 tracking-wide">{label}</span>
                    <span className="text-horror-text-secondary">{value}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-outline inline-flex">
                {a.appointmentBtn}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="bg-horror-card border border-horror-border p-8">
              <p className="font-cinzel text-xs font-bold tracking-widest uppercase text-horror-text-primary mb-5">{a.companyTitle}</p>
              <dl className="space-y-4 text-sm">
                {a.companyDetails.map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-horror-border pb-3 last:border-0 last:pb-0">
                    <dt className="text-horror-text-muted tracking-wide">{label}</dt>
                    <dd className="text-horror-text-secondary text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
