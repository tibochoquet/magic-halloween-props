"use client";

import ScareCard from "@/components/ui/ScareCard";
import CollectionHero, { type CollectionHeroSpot } from "@/components/ui/CollectionHero";
import { useTranslation } from "@/hooks/useTranslation";
import { scareEffectProducts } from "@/data/scareEffectProducts";

const HERO_SPOTS: { id: string; xPct: number; yPct: number }[] = [
  { id: "scare-screaming-little-girl", xPct: 15, yPct: 58 },
  { id: "scare-rising-spirit", xPct: 41, yPct: 49 },
  { id: "scare-angel-of-dead", xPct: 66.5, yPct: 58 },
];

export default function ScareEffectCollection({ pageMode = false }: { pageMode?: boolean }) {
  const t = useTranslation();

  const heroSpots: CollectionHeroSpot[] = HERO_SPOTS.flatMap(({ id, xPct, yPct }) => {
    const p = scareEffectProducts.find((pp) => pp.id === id);
    return p ? [{ id, xPct, yPct, name: p.name, price: p.price }] : [];
  });

  return (
    <section
      id="scare-effect"
      className={`relative overflow-hidden ${pageMode ? "pt-28 md:pt-36 pb-16 md:pb-24" : "py-16 md:py-24 lg:py-32 -mt-px"}`}
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0C0814 25%, #0A0910 55%, #0A0A0A 100%)" }}
    >
      {!pageMode && (
        <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />
      )}

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-80 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.10) 0%, transparent 65%)" }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-15%] right-[-15%] h-[38%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 30% 32%, rgba(90,20,120,0.06) 0%, transparent 60%)", filter: "blur(52px)" }} />
        <div className="absolute bottom-0 left-[-10%] right-[-10%] h-[32%] animate-fog-medium" style={{ background: "radial-gradient(ellipse at 68% 88%, rgba(60,15,90,0.05) 0%, transparent 55%)", filter: "blur(42px)" }} />
      </div>

      {heroSpots.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 mb-14 md:mb-20">
          <CollectionHero
            src="/scare%20collection%20hero-screaminggirl-angelofdead-risingspirit.png"
            alt="Scare Effect collectie — Screaming Little Girl, Angel Of Dead en Rising Spirit"
            spots={heroSpots}
            eyebrow="Scare Effect Collection"
            title="Scare Effect"
            titleAccent="Animatronics"
            subtitle="Poppen met een ingebouwd schrikeffect — voor het ultieme jumpscare-moment op je Halloween-feest."
            backLink={{ href: "/shop", label: "Terug naar gehele assortiment" }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {scareEffectProducts.map((product) => (
            <ScareCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <a href="/shop" className="btn-outline">
            {t.featured.viewAll}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
