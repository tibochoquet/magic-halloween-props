"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import ProCard from "@/components/ui/ProCard";
import { previewProProducts } from "@/data/professionalProducts";

export default function ProCollectionPreview() {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden -mt-px"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #100808 28%, #0E090E 58%, #0A0A0A 100%)" }}
    >
      {/* Top blend */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />

      {/* Deep crimson header glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-96 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(150,10,0,0.12) 0%, transparent 62%)" }}
      />

      {/* Atmospheric depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[8%] left-[-18%] right-[-18%] h-[40%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 28% 35%, rgba(38,14,6,0.08) 0%, transparent 60%)", filter: "blur(55px)" }} />
        <div className="absolute bottom-0 left-[-12%] right-[-12%] h-[35%] animate-fog-medium" style={{ background: "radial-gradient(ellipse at 70% 90%, rgba(28,10,4,0.07) 0%, transparent 55%)", filter: "blur(45px)" }} />
        <div className="absolute top-1/3 right-[-5%] w-[30%] h-[40%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 88% 50%, rgba(100,8,0,0.05) 0%, transparent 58%)", filter: "blur(40px)" }} />
      </div>

      {/* Ember particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[6%] left-[16%] w-px h-px rounded-full bg-horror-orange/15 animate-ember" style={{ animationDelay: "0.5s", animationDuration: "6.5s" }} />
        <div className="absolute top-[22%] left-[82%] w-px h-px rounded-full bg-horror-orange/12 animate-ember" style={{ animationDelay: "2.4s", animationDuration: "7.2s" }} />
        <div className="absolute top-[55%] left-[90%] w-px h-px rounded-full bg-horror-orange/10 animate-ember" style={{ animationDelay: "1.1s", animationDuration: "5.8s" }} />
        <div className="absolute top-[70%] left-[8%] w-px h-px rounded-full bg-horror-orange/13 animate-ember" style={{ animationDelay: "3.4s", animationDuration: "6.8s" }} />
        <div className="absolute top-[40%] left-[55%] w-px h-px rounded-full bg-horror-orange/10 animate-ember" style={{ animationDelay: "0.9s", animationDuration: "7.8s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeader
          eyebrow="Professional Collection"
          title="Professional"
          titleAccent="Animatronics"
          subtitle="High-end cinematic animatronics for haunted attractions, escape rooms and professional horror experiences."
        />

        {/* 3 curated preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {previewProProducts.map((product) => (
            <ProCard key={product.id} product={product} />
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <Link
            href="/professional-animatronics"
            className="btn-primary px-10 py-4 text-sm tracking-[0.18em]"
          >
            Explore Professional Animatronics
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-horror-text-muted/50 text-xs tracking-widest uppercase">
            23 professional animatronics available
          </p>
        </div>
      </div>
    </section>
  );
}
