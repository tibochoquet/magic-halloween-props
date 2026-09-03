"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import PreOrderModal from "@/components/ui/PreOrderModal";

export default function SoulLedgerHero({
  product,
  underFixedHeader = true,
}: {
  product: Product;
  /** True when this section sits directly beneath the site's fixed header (no other content above it) — adds clearance so the header never overlaps the content. */
  underFixedHeader?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!product.heroImage) return null;

  return (
    <section className={`relative w-full overflow-hidden bg-horror-black ${underFixedHeader ? "min-h-[640px] md:min-h-[600px] lg:min-h-0 lg:aspect-video" : "min-h-[520px] sm:aspect-video"}`}>
      <Image
        src={product.heroImage}
        alt={`${product.name} — cinematische hero-afbeelding`}
        fill
        priority
        quality={90}
        className="object-cover object-[25%_center] lg:object-center"
        sizes="100vw"
      />

      {/* Legibility overlays — weighted right/bottom, keeping the left-side figure clear */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-black/88 via-black/45 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/10" />
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />
      {/* Bottom seam blend into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-horror-black to-transparent" />

      {/* Ambient embers, matching site aesthetic */}
      <div
        className="absolute top-[10%] right-[5%] w-[50%] h-[60%] pointer-events-none motion-safe:animate-fog-slow"
        style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(255,107,0,0.07) 0%, transparent 62%)", filter: "blur(50px)" }}
      />

      {/* Corner badge — cleared below the fixed site header at every breakpoint when this is the page's first section */}
      <div
        className={`absolute z-20 px-3 py-1.5 bg-horror-orange text-black text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase motion-safe:animate-fade-up ${
          underFixedHeader ? "top-20 right-5 sm:top-24 sm:right-7" : "top-5 right-5 sm:top-7 sm:right-7"
        }`}
        style={{ animationDelay: "0.05s" }}
      >
        Pre-order nu
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-center px-5 sm:px-10 lg:pr-[7vw] pb-8 lg:pb-0 ml-auto max-w-[94%] sm:max-w-[52%] lg:max-w-[46%] ${
          underFixedHeader ? "pt-40 sm:pt-24 lg:pt-0" : "pt-16 sm:pt-0"
        }`}
      >
        <span
          className="inline-flex items-center gap-2 text-horror-orange text-[10px] sm:text-xs font-semibold tracking-[0.24em] uppercase mb-3 sm:mb-4 motion-safe:animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="w-1 h-1 rounded-full bg-horror-orange motion-safe:animate-pulse" />
          Binnenkort verkrijgbaar
        </span>

        <h2
          className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black text-horror-text-primary leading-[1.05] mb-3 sm:mb-5 motion-safe:animate-fade-up"
          style={{ animationDelay: "0.28s", textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}
        >
          The Collector of <span className="text-horror-orange">Souls</span>
        </h2>

        <p
          className="text-horror-text-secondary text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-sm motion-safe:animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Een indrukwekkende animatronic voor wie Halloween tot leven wil brengen.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 mb-5 sm:mb-6 motion-safe:animate-fade-up"
          style={{ animationDelay: "0.52s" }}
        >
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            Pre-order
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <Link href={`/products/${product.id}`} className="btn-outline w-full sm:w-auto justify-center">
            Ontdek de animatronic
          </Link>
        </div>

        <p
          className="text-horror-text-muted text-[11px] sm:text-xs tracking-wide motion-safe:animate-fade-up"
          style={{ animationDelay: "0.64s" }}
        >
          Beperkte beschikbaarheid
          {product.availabilityNote ? <> • {product.availabilityNote}</> : null}
          {" • "}€{product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {modalOpen && <PreOrderModal product={product} onClose={() => setModalOpen(false)} />}
    </section>
  );
}
