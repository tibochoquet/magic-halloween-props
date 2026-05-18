"use client";

import { useTranslation } from "@/hooks/useTranslation";
import ContactForm from "@/components/sections/ContactForm";

export default function ContactPageContent() {
  const t = useTranslation();
  const c = t.contact;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.07) 0%, transparent 55%)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.3), transparent)" }} />
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-horror-orange/50" />
            <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">{c.eyebrow}</span>
            <div className="h-px w-10 bg-horror-orange/50" />
          </div>
          <h1 className="font-cinzel text-5xl md:text-6xl font-black text-horror-text-primary mb-5">
            {c.h1a} <span className="text-horror-orange">{c.h1b}</span>{c.h1c && ` ${c.h1c}`}
          </h1>
          <p className="text-horror-text-secondary text-lg max-w-xl mx-auto">{c.intro}</p>
        </div>
      </section>

      {/* Contact blocks */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {c.blocks.map((block) => (
              <div key={block.id} id={block.id} className="bg-horror-card border border-horror-border p-8 hover:border-horror-orange/30 transition-colors duration-300">
                <div className="text-horror-orange text-2xl mb-4">{block.icon}</div>
                <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-4">{block.title}</h2>
                <div className="space-y-1 mb-4">
                  {block.lines.map((line) => (
                    <p key={line} className="text-horror-text-secondary text-sm">{line}</p>
                  ))}
                </div>
                <p className="text-horror-text-muted text-xs tracking-wide border-t border-horror-border pt-4">{block.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h2 className="font-cinzel text-2xl font-bold text-horror-text-primary mb-2">
                {c.formTitle} <span className="text-horror-orange">{c.formAccent}</span>
              </h2>
              <p className="text-horror-text-muted text-sm mb-8">
                {c.formIntro}{" "}
                <a href="mailto:info@allseasontoys.nl" className="text-horror-orange hover:underline">info@allseasontoys.nl</a>
              </p>
              <ContactForm />
            </div>

            <div id="faq">
              <h2 className="font-cinzel text-2xl font-bold text-horror-text-primary mb-8">
                {c.faqTitle} <span className="text-horror-orange">{c.faqAccent}</span>
              </h2>
              <div className="space-y-0">
                {c.faq.map((item) => (
                  <div key={item.id} id={item.id} className="border-b border-horror-border py-5 first:border-t first:border-horror-border">
                    <h3 className="font-cinzel text-sm font-bold text-horror-text-primary mb-2 tracking-wide">{item.q}</h3>
                    <p className="text-horror-text-muted text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company strip */}
      <section className="border-t border-horror-border bg-[#070707]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-cinzel text-xs font-bold tracking-widest uppercase text-horror-text-primary mb-1">{c.companyTitle}</p>
              <p className="text-horror-text-muted text-sm">{c.companyLine}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 text-xs text-horror-text-muted">
              <span>{c.kvk} <span className="text-horror-text-secondary">64942708</span></span>
              <span>{c.btw} <span className="text-horror-text-secondary">NL855913770B01</span></span>
              <a href="mailto:info@allseasontoys.nl" className="text-horror-orange hover:underline">info@allseasontoys.nl</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
