"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CollectionHeroSpot {
  id: string;
  name: string;
  price: number;
  /** Horizontal position, 0-100 (% from left). */
  xPct: number;
  /** Vertical position, 0-100 (% from top). */
  yPct: number;
}

export interface CollectionHeroBackLink {
  href: string;
  label: string;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CollectionHero({
  src,
  alt,
  spots,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  backLink,
}: {
  src: string;
  alt: string;
  spots: CollectionHeroSpot[];
  /** Overlaid section title, rendered on top of the image instead of in a separate block. */
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  backLink?: CollectionHeroBackLink;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenId(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(`product-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    el.classList.add("ring-2", "ring-horror-orange", "ring-offset-2", "ring-offset-horror-black");
    window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-horror-orange", "ring-offset-2", "ring-offset-horror-black");
    }, 1800);
    setOpenId(null);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden bg-horror-black ${title ? "min-h-screen" : "aspect-video"}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Legibility fades, blending into the page's dark background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-horror-black via-transparent to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/25 via-transparent to-black/25" />
      {/* Bottom seam blend into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-t from-horror-black to-transparent" />

      {backLink && (
        <Link
          href={backLink.href}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/60 border border-white/15 text-horror-text-secondary text-[10px] sm:text-xs font-semibold tracking-wide uppercase hover:text-horror-orange hover:border-horror-orange/40 transition-colors duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {backLink.label}
        </Link>
      )}

      {title && (
        <div className="absolute inset-x-0 top-0 z-10 pt-16 sm:pt-20 md:pt-24 px-5 text-center pointer-events-none">
          <div className="max-w-3xl mx-auto">
            {eyebrow && (
              <div className="inline-flex items-center gap-3 mb-3 sm:mb-4 justify-center">
                <div className="h-px w-8 sm:w-10 bg-horror-orange/60" />
                <span className="text-horror-orange text-[10px] sm:text-sm font-semibold tracking-[0.25em] uppercase" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                  {eyebrow}
                </span>
                <div className="h-px w-8 sm:w-10 bg-horror-orange/60" />
              </div>
            )}
            <h2
              className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              style={{ textShadow: "0 4px 22px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)" }}
            >
              {title} {titleAccent && <span className="text-horror-orange">{titleAccent}</span>}
            </h2>
            {subtitle && (
              <p
                className="hidden sm:block mt-4 sm:mt-5 text-white/85 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {spots.map((spot) => {
        const isOpen = openId === spot.id;
        return (
          <div
            key={spot.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
          >
            <button
              type="button"
              aria-label={`${spot.name} — €${spot.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} — bekijk product`}
              aria-expanded={isOpen}
              onMouseEnter={() => setOpenId(spot.id)}
              onFocus={() => setOpenId(spot.id)}
              onClick={(e) => {
                e.stopPropagation();
                if (isOpen) goTo(spot.id);
                else setOpenId(spot.id);
              }}
              className="group/spot relative flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full focus:outline-none"
            >
              <span
                className="absolute inset-0 rounded-full bg-horror-orange/70 motion-safe:animate-ping"
                style={{ animationDuration: "2.6s" }}
              />
              <span
                className={`relative w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-horror-orange border-2 border-white/85 shadow-[0_0_0_4px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
                  isOpen ? "scale-125" : "group-hover/spot:scale-125"
                }`}
              />
            </button>

            <div
              role="tooltip"
              className={`absolute left-1/2 bottom-full mb-2.5 -translate-x-1/2 w-max max-w-[11rem] transition-opacity duration-200 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(spot.id);
                }}
                className="block w-full px-3.5 py-2.5 bg-black/92 border border-horror-orange/35 text-center hover:border-horror-orange/70 transition-colors duration-200"
              >
                <p className="text-white text-xs font-bold leading-snug font-cinzel">{spot.name}</p>
                <p className="text-horror-orange text-xs font-semibold mt-1">
                  €{spot.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-horror-text-muted text-[10px] tracking-wider uppercase mt-1.5">Bekijk product →</p>
              </button>
              <div className="w-2 h-2 bg-black/92 border-b border-r border-horror-orange/35 rotate-45 mx-auto -mt-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
