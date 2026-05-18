"use client";

import { useRef, useEffect, useCallback } from "react";
import { products } from "@/data";
import { professionalProducts } from "@/data/professionalProducts";
import ProductCard from "@/components/ui/ProductCard";
import ProCard from "@/components/ui/ProCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslation } from "@/hooks/useTranslation";
import type { Product } from "@/types";

const FEATURED_PRO_IDS = ["pro-bloodthirsty-werewolf", "pro-riding-dead"];
const SPEED = 0.8; // px per frame ≈ 48 px/s at 60 fps

export default function FeaturedProducts() {
  const t = useTranslation();

  const featuredStandard = products.filter((p) => p.featured);
  const featuredPro = professionalProducts.filter((p) => FEATURED_PRO_IDS.includes(p.id));
  const allFeatured: Product[] = [...featuredStandard, ...featuredPro];

  const containerRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const dragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const rafId = useRef<number>(0);

  const tick = useCallback(() => {
    const el = containerRef.current;
    if (el && !paused.current) {
      el.scrollLeft += SPEED;
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
    }
    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [tick]);

  const onMouseEnter = () => { paused.current = true; };
  const onMouseLeave = () => {
    paused.current = false;
    dragging.current = false;
  };
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    startScroll.current = containerRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const delta = startX.current - e.clientX;
    if (Math.abs(delta) > 5) hasDragged.current = true;
    let next = startScroll.current + delta;
    const half = containerRef.current.scrollWidth / 2;
    if (next < 0) next += half;
    if (next >= half) next -= half;
    containerRef.current.scrollLeft = next;
  };
  const onMouseUp = () => { dragging.current = false; };
  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDragged.current = false;
    }
  };

  return (
    <section
      id="featured"
      className="relative py-24 md:py-32 overflow-hidden -mt-px"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0D0A0C 35%, #0B0B0D 65%, #0A0A0A 100%)" }}
    >
      {/* Top blend */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />
      {/* Orange radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.07) 0%, transparent 68%)" }} />

      {/* Fog layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[8%] left-[-20%] right-[-20%] h-[45%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 30% 38%, rgba(40,20,10,0.07) 0%, transparent 62%)", filter: "blur(48px)" }} />
        <div className="absolute bottom-0 left-[-15%] right-[-15%] h-[38%] animate-fog-medium" style={{ background: "radial-gradient(ellipse at 68% 85%, rgba(28,14,6,0.06) 0%, transparent 58%)", filter: "blur(38px)" }} />
        <div className="absolute top-1/3 right-[-10%] w-[40%] h-[40%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(35,18,8,0.05) 0%, transparent 60%)", filter: "blur(40px)" }} />
      </div>

      {/* Ember particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[7%] left-[18%] w-px h-px rounded-full bg-horror-orange/20 animate-ember" style={{ animationDelay: "0.4s", animationDuration: "5.8s" }} />
        <div className="absolute top-[20%] left-[72%] w-px h-px rounded-full bg-horror-orange/15 animate-ember" style={{ animationDelay: "1.9s", animationDuration: "6.2s" }} />
        <div className="absolute top-[42%] left-[88%] w-px h-px rounded-full bg-horror-orange/18 animate-ember" style={{ animationDelay: "0.8s", animationDuration: "5.2s" }} />
        <div className="absolute top-[63%] left-[33%] w-px h-px rounded-full bg-horror-orange/12 animate-ember" style={{ animationDelay: "2.6s", animationDuration: "6.8s" }} />
        <div className="absolute top-[78%] left-[56%] w-px h-px rounded-full bg-horror-orange/16 animate-ember" style={{ animationDelay: "1.1s", animationDuration: "5s" }} />
        <div className="absolute top-[30%] left-[48%] w-px h-px rounded-full bg-horror-orange/10 animate-ember" style={{ animationDelay: "3.2s", animationDuration: "7.2s" }} />
        <div className="absolute top-[55%] left-[12%] w-px h-px rounded-full bg-horror-orange/13 animate-ember" style={{ animationDelay: "0.6s", animationDuration: "6.5s" }} />
      </div>

      {/* Section header */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeader
          eyebrow={t.featured.eyebrow}
          title={t.featured.title}
          titleAccent={t.featured.titleAccent}
          subtitle={t.featured.subtitle}
        />
      </div>

      {/* Carousel */}
      <div className="relative z-10">
        {/* Edge fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 md:w-48 z-20 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.85) 40%, transparent 100%)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 md:w-48 z-20 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0A0A0A 0%, rgba(10,10,10,0.85) 40%, transparent 100%)" }}
        />

        {/* Scrollable track */}
        <div
          ref={containerRef}
          className="overflow-x-hidden py-6 cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onClickCapture={onClickCapture}
        >
          <div className="flex gap-5" style={{ width: "max-content" }}>
            {[...allFeatured, ...allFeatured].map((product, i) => (
              <div key={`${product.id}-${i}`} className="w-[280px] flex-shrink-0">
                {product.id.startsWith("pro-")
                  ? <ProCard product={product} />
                  : <ProductCard product={product} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 mt-10 text-center">
        <a href="/shop" className="btn-outline">
          {t.featured.viewAll}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
