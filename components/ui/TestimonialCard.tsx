"use client";

import type { Testimonial } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

/** Initials from the customer's own name — never a separate invented field. */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { language } = useLanguage();
  const t = useTranslation();
  const formattedDate = new Date(testimonial.date).toLocaleDateString(
    language === "nl" ? "nl-NL" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="card-horror p-8 flex flex-col gap-6 relative overflow-hidden group">
      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: "radial-gradient(circle at 100% 0%, rgba(255,107,0,0.08) 0%, transparent 70%)" }}
      />

      {/* Quote mark */}
      <svg className="w-10 h-10 text-horror-orange/30" fill="currentColor" viewBox="0 0 32 32">
        <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8a8 8 0 007.9-7.2c0-.1.1-.5.1-.8 0-4.4-3.6-8-8-8zm0 13a5 5 0 110-10 5 5 0 010 10zM26 8c-4.4 0-8 3.6-8 8s3.6 8 8 8a8 8 0 007.9-7.2c0-.1.1-.5.1-.8 0-4.4-3.6-8-8-8zm0 13a5 5 0 110-10 5 5 0 010 10z" />
      </svg>

      {/* The review itself */}
      <blockquote className="text-horror-text-secondary text-sm leading-relaxed flex-1 italic">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-horror-orange/20 to-transparent" />

      {/* Who said it, where it came from and when */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-horror-orange/10 border border-horror-orange/25 flex items-center justify-center flex-shrink-0">
          <span className="text-horror-orange text-xs font-bold font-cinzel">{initialsOf(testimonial.name)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-horror-text-primary font-semibold text-sm">
            {testimonial.name}
            {testimonial.place ? <span className="text-horror-text-muted font-normal"> · {testimonial.place}</span> : null}
          </p>
          <p className="text-horror-text-muted text-xs mt-0.5">
            {testimonial.source} · {formattedDate}
          </p>
          {testimonial.verifiedPurchase && (
            <p className="text-horror-orange/80 text-[11px] mt-1 tracking-wide">✓ {t.testimonials.verified}</p>
          )}
        </div>
      </div>
    </div>
  );
}
