"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

function EmberParticle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute w-px h-px rounded-full bg-horror-orange opacity-25 animate-ember"
      style={style}
    />
  );
}

export default function Hero() {
  const t = useTranslation();

  const embers = [
    { left: "60%", bottom: "34%", animationDelay: "0s", animationDuration: "5s" },
    { left: "67%", bottom: "20%", animationDelay: "1.2s", animationDuration: "5.5s" },
    { left: "74%", bottom: "44%", animationDelay: "0.5s", animationDuration: "4.3s" },
    { left: "82%", bottom: "15%", animationDelay: "1.9s", animationDuration: "4.8s" },
    { left: "89%", bottom: "28%", animationDelay: "0.3s", animationDuration: "5.2s" },
    { left: "94%", bottom: "38%", animationDelay: "2.3s", animationDuration: "4s" },
    { left: "71%", bottom: "54%", animationDelay: "1.5s", animationDuration: "6.2s" },
    { left: "78%", bottom: "10%", animationDelay: "0.9s", animationDuration: "4.6s" },
    { left: "14%", bottom: "45%", animationDelay: "2.2s", animationDuration: "7.2s" },
    { left: "32%", bottom: "58%", animationDelay: "0.6s", animationDuration: "6.5s" },
    { left: "48%", bottom: "32%", animationDelay: "1.7s", animationDuration: "5.8s" },
    { left: "42%", bottom: "50%", animationDelay: "0.4s", animationDuration: "6.8s" },
    { left: "55%", bottom: "36%", animationDelay: "2.9s", animationDuration: "5.6s" },
    { left: "38%", bottom: "64%", animationDelay: "1.4s", animationDuration: "7.8s" },
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-horror-black">

      {/* Hero image — natural dark-smoke left, clown emerging right-center */}
      <Image
        src="/hero-clown-cinematic3.png"
        alt=""
        fill
        priority
        quality={90}
        className="object-cover"
        style={{ objectPosition: "center center" }}
      />

      {/* Left overlay — reinforces the natural dark left for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,10,10,0.90) 0%, rgba(10,10,10,0.74) 18%, rgba(10,10,10,0.44) 36%, rgba(10,10,10,0.12) 54%, rgba(10,10,10,0.02) 70%, transparent 84%)",
        }}
      />

      {/* Top seal — merges with header */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-horror-black to-transparent" />

      {/* Atmospheric fire warmth — central, matching image's fire source */}
      <div
        className="absolute bottom-0 right-[5%] w-[60%] h-[55%] pointer-events-none animate-fog-slow"
        style={{
          background:
            "radial-gradient(ellipse at 55% 95%, rgba(140,35,0,0.12) 0%, rgba(255,90,0,0.04) 50%, transparent 72%)",
          filter: "blur(70px)",
        }}
      />

      {/* Left smoke haze — deepens the atmospheric fog in the image's smoke zone */}
      <div
        className="absolute top-[5%] left-[-5%] w-[45%] h-[65%] pointer-events-none animate-fog-medium"
        style={{
          background: "radial-gradient(ellipse at 22% 42%, rgba(22,14,16,0.10) 0%, transparent 58%)",
          filter: "blur(60px)",
        }}
      />

      {/* Emblem zone warmth — faint fire reflection in the left content area */}
      <div
        className="absolute top-[16%] left-[3%] w-[42%] h-[32%] pointer-events-none animate-fog-slow"
        style={{
          background: "radial-gradient(ellipse at 30% 48%, rgba(210,75,8,0.055) 0%, transparent 62%)",
          filter: "blur(55px)",
        }}
      />

      {/* Cinematic bridge — atmospheric haze filling the center gap between content and clown */}
      <div
        className="absolute top-[10%] left-[28%] w-[48%] h-[64%] pointer-events-none animate-fog-medium"
        style={{
          background: "radial-gradient(ellipse at 48% 46%, rgba(14,9,7,0.13) 0%, transparent 58%)",
          filter: "blur(62px)",
        }}
      />

      {/* Fire reach — warm orange bleed leftward from the clown's fire source */}
      <div
        className="absolute top-[18%] right-[8%] w-[54%] h-[52%] pointer-events-none animate-fog-slow"
        style={{
          background: "radial-gradient(ellipse at 80% 44%, rgba(175,52,4,0.08) 0%, transparent 55%)",
          filter: "blur(72px)",
        }}
      />

      {/* ── BOTTOM ATMOSPHERIC DISSOLVE — seamless section transition ─────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary depth fade — very tall, the main graduation into darkness */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[65%]"
          style={{
            background:
              "linear-gradient(to top, rgb(10,10,10) 0%, rgba(10,10,10,0.92) 18%, rgba(10,10,10,0.68) 36%, rgba(10,10,10,0.32) 55%, rgba(10,10,10,0.09) 74%, transparent 100%)",
          }}
        />
        {/* Volumetric ground fog — slow drift, amber warmth */}
        <div
          className="absolute bottom-0 left-[-18%] right-[-18%] h-[32%] animate-fog-slow"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(155,90,40,0.07) 0%, rgba(70,38,16,0.05) 44%, transparent 74%)",
            filter: "blur(48px)",
          }}
        />
        {/* Mid fog bank — counter drift, slightly raised */}
        <div
          className="absolute bottom-[3%] left-[-12%] right-[-12%] h-[22%] animate-fog-medium"
          style={{
            background:
              "radial-gradient(ellipse at 35% 90%, rgba(165,95,45,0.055) 0%, transparent 62%)",
            filter: "blur(32px)",
          }}
        />
        {/* Smoke wisps — upper layer, very faint */}
        <div
          className="absolute bottom-[20%] left-[-8%] right-[-8%] h-[16%] animate-fog-fast"
          style={{
            background:
              "radial-gradient(ellipse at 68% 80%, rgba(110,62,28,0.038) 0%, transparent 58%)",
            filter: "blur(22px)",
          }}
        />
      </div>

      {/* Embers — localised over the fire/clown zone */}
      <div className="absolute inset-0 pointer-events-none">
        {embers.map((e, i) => (
          <EmberParticle key={i} style={e} />
        ))}
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* Text zone — anchored left, constrained to clear of clown area */}
        <div className="flex-1 flex flex-col justify-center pt-28 pb-10 px-6 sm:px-10 lg:pl-[7vw] xl:pl-[9vw] lg:pr-0 w-full lg:max-w-[54vw]">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 mb-10 border border-horror-orange/18 bg-horror-orange/[0.035] px-5 py-2 text-horror-orange/75 text-[11px] font-semibold tracking-[0.24em] uppercase w-fit">
            <span className="w-1 h-1 rounded-full bg-horror-orange/65 animate-pulse" />
            {t.hero.badge}
          </div>

          {/* Brand emblem — premium logo artwork */}
          <div className="relative mb-10 w-fit">
            {/* Ambient warm glow behind the emblem */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: "scale(1.55)",
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,95,15,0.10) 0%, transparent 65%)",
                filter: "blur(22px)",
              }}
            />
            <Image
              src="/magic-halloween-emblem.png"
              alt="Magic Halloween Props"
              width={1536}
              height={1024}
              priority
              className="relative w-[308px] sm:w-[355px] lg:w-[418px] xl:w-[468px] h-auto"
              style={{
                filter: "drop-shadow(0 0 18px rgba(255,90,0,0.15)) drop-shadow(0 8px 36px rgba(0,0,0,0.88))",
              }}
            />
          </div>

          {/* Subtitle */}
          <p className="text-horror-text-secondary/65 text-sm md:text-[0.93rem] max-w-[360px] mb-10 leading-relaxed font-light tracking-wide">
            {t.hero.sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <a href="/shop" className="btn-primary min-w-52">
              {t.hero.cta1}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="/#categories" className="btn-outline min-w-52">
              {t.hero.cta2}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap items-center gap-0 text-horror-text-muted/60">
            {[
              { value: t.hero.stats.propsSoldVal, label: t.hero.stats.propsSold },
              { value: t.hero.stats.ratingVal, label: t.hero.stats.rating },
              { value: t.hero.stats.shipVal, label: t.hero.stats.ship },
              { value: t.hero.stats.warrantyVal, label: t.hero.stats.warranty },
            ].flatMap((stat, i, arr) => {
              const items = [
                <div key={stat.label} className="pr-6">
                  <div className="text-horror-orange/78 font-cinzel font-bold text-sm">{stat.value}</div>
                  <div className="text-[10px] tracking-widest uppercase mt-0.5">{stat.label}</div>
                </div>,
              ];
              if (i < arr.length - 1) {
                items.push(
                  <div key={`sep-${i}`} className="h-6 w-px bg-horror-border/35 mr-6 self-center" />
                );
              }
              return items;
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center pb-8 gap-2 text-horror-text-muted/40 text-[10px] tracking-[0.32em] uppercase">
          <div className="w-px h-8 bg-gradient-to-b from-horror-orange/25 to-transparent animate-pulse" />
          <span>{t.hero.scroll}</span>
        </div>
      </div>
    </section>
  );
}
