import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { company, entityLine } from "@/lib/companyInfo";

export type LegalSection = {
  title: string;
  /** Plain text; newlines are preserved. */
  content?: string;
  /** Rich content, when plain text is not enough. */
  body?: ReactNode;
};

/**
 * Shared shell for the legal pages. Keeps a readable measure (max-w-3xl, not
 * full width), renders a lastUpdated date, and keeps the site's own styling.
 */
export default function LegalPageLayout({
  eyebrow = "Legal",
  title,
  titleAccent,
  intro,
  lastUpdated,
  sections,
  children,
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  intro?: ReactNode;
  /** ISO date, e.g. "2026-09-06". Rendered in Dutch long form. */
  lastUpdated: string;
  sections?: LegalSection[];
  children?: ReactNode;
}) {
  const formatted = new Date(lastUpdated).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />

      <section className="relative pt-36 pb-24 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.3), transparent)" }}
        />
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-horror-orange/50" />
            <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">{eyebrow}</span>
            <div className="h-px w-10 bg-horror-orange/50" />
          </div>

          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-horror-text-primary mb-3">
            {title}
            {titleAccent && <span className="text-horror-orange">{titleAccent}</span>}
          </h1>

          <p className="text-horror-text-muted text-sm">
            {company.tradeName} — {entityLine}
          </p>
          <p className="text-horror-text-muted/70 text-xs mt-1 mb-12">
            Laatst bijgewerkt: <time dateTime={lastUpdated}>{formatted}</time>
          </p>

          {intro && <div className="mb-12">{intro}</div>}

          {sections && (
            <div className="space-y-10">
              {sections.map((s) => (
                <div key={s.title} className="border-b border-horror-border pb-10 last:border-0">
                  <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-4">
                    {s.title}
                  </h2>
                  {s.content && (
                    <div className="text-horror-text-secondary text-sm leading-relaxed whitespace-pre-line">
                      {s.content}
                    </div>
                  )}
                  {s.body}
                </div>
              ))}
            </div>
          )}

          {children}
        </div>
      </section>

      <Footer />
    </main>
  );
}
