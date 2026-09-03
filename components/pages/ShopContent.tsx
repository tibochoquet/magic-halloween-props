"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Building2, Package, Star, Mail } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProCard from "@/components/ui/ProCard";
import ScareCard from "@/components/ui/ScareCard";
import SectionHeader from "@/components/ui/SectionHeader";
import CollectionHero, { type CollectionHeroSpot } from "@/components/ui/CollectionHero";
import UpcomingProducts from "@/components/sections/UpcomingProducts";
import { products, categories } from "@/data";
import { professionalProducts } from "@/data/professionalProducts";
import { scareEffectProducts } from "@/data/scareEffectProducts";
import { useTranslation } from "@/hooks/useTranslation";

type ShopVariant = "all" | "standard" | "premium" | "scare";

const allProductsFlat = [...products, ...professionalProducts, ...scareEffectProducts];

const WHOLE_HERO_SPOTS: { id: string; xPct: number; yPct: number }[] = [
  { id: "scare-wolf-woman", xPct: 19.5, yPct: 58 },
  { id: "halloween-pop-terror-clown", xPct: 48.5, yPct: 49 },
  { id: "scare-popping-pumpkin-man", xPct: 72, yPct: 52 },
  { id: "pro-nun-from-hell", xPct: 91.5, yPct: 49 },
];

const STANDARD_HERO_SPOTS: { id: string; xPct: number; yPct: number }[] = [
  { id: "halloween-pop-horrible-pumpkin", xPct: 19, yPct: 49 },
  { id: "halloween-pop-evil-witch", xPct: 38, yPct: 58 },
  { id: "halloween-pop-psycho-clown", xPct: 61.5, yPct: 43 },
];

function resolveHeroSpots(defs: { id: string; xPct: number; yPct: number }[]): CollectionHeroSpot[] {
  return defs.flatMap(({ id, xPct, yPct }) => {
    const p = allProductsFlat.find((pp) => pp.id === id);
    return p ? [{ id, xPct, yPct, name: p.name, price: p.price }] : [];
  });
}

export default function ShopContent({ variant = "all" }: { variant?: ShopVariant }) {
  const t = useTranslation();
  const s = t.shop;
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") ?? "all";

  const filteredStandard = variant !== "all" && variant !== "standard" ? [] : activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const filteredPro = variant !== "all" && variant !== "premium" ? [] : activeCategory === "all"
    ? professionalProducts
    : professionalProducts.filter((p) => p.category === activeCategory);

  const filteredScare = variant !== "all" && variant !== "scare" ? [] : activeCategory === "all"
    ? scareEffectProducts
    : scareEffectProducts.filter((p) => p.category === activeCategory);

  const totalCount = filteredStandard.length + filteredPro.length + filteredScare.length;

  const heroSpots =
    variant === "all"
      ? resolveHeroSpots(WHOLE_HERO_SPOTS)
      : variant === "standard"
        ? resolveHeroSpots(STANDARD_HERO_SPOTS)
        : [];
  const heroSrc =
    variant === "all"
      ? "/whole%20collection%20hero-wolfgirl-terrorclown-nun-poppingpumpkin.png"
      : "/standaard%20collection%20hero-psychoclown-horrible%20pumpkin-evilwitch.png";
  const heroAlt =
    variant === "all"
      ? "Het Gehele Assortiment — Wolf Woman, Halloween pop Terror Clown, Nun From Hell en Popping Pumpkin Man"
      : "Standaard Halloween Props — Halloween pop Horrible Pumpkin, Halloween pop Evil Witch en Halloween pop Psycho Clown";
  const heroTitle =
    variant === "all"
      ? { eyebrow: s.eyebrow, title: s.title, titleAccent: s.titleAccent, subtitle: s.subtitle }
      : {
          eyebrow: "Halloween Collection",
          title: "Standaard",
          titleAccent: "Halloween Props",
          subtitle: "Premium animatronics voor thuisdecoratie, feesten en seizoensevenementen.",
        };
  const heroBackLink = variant === "standard" ? { href: "/shop", label: "Terug naar gehele assortiment" } : undefined;

  function setCategory(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("category");
    } else {
      params.set("category", id);
    }
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  return (
    <>
      {heroSpots.length > 0 ? (
        <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <CollectionHero
              src={heroSrc}
              alt={heroAlt}
              spots={heroSpots}
              eyebrow={heroTitle.eyebrow}
              title={heroTitle.title}
              titleAccent={heroTitle.titleAccent}
              subtitle={heroTitle.subtitle}
              backLink={heroBackLink}
            />
          </div>
        </section>
      ) : (
        <section className="relative pt-28 md:pt-36 pb-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.07) 0%, transparent 60%)" }} />
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionHeader eyebrow={s.eyebrow} title={s.title} titleAccent={s.titleAccent} subtitle={s.subtitle} />
          </div>
        </section>
      )}

      {/* Collection gateway cards — only on the "everything" view; the standalone collection pages link back instead */}
      {variant === "all" && (
      <section className="py-0">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-12 md:pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">

            {/* Standard Halloween Props */}
            <a
              href="/halloween-props"
              className="group relative overflow-hidden block min-h-[240px] md:min-h-[280px]"
              style={{ background: "linear-gradient(135deg, #160C0A 0%, #0E0A14 100%)" }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 18% 78%, rgba(200,60,0,0.20) 0%, transparent 58%)" }} />
                <div className="absolute inset-0 animate-fog-slow" style={{ background: "radial-gradient(ellipse at 35% 62%, rgba(160,50,0,0.07) 0%, transparent 55%)", filter: "blur(32px)" }} />
                <div className="absolute top-4 right-5 w-px h-px rounded-full bg-horror-orange/25 animate-ember" style={{ animationDelay: "0.5s", animationDuration: "5.5s" }} />
                <div className="absolute top-14 right-16 w-px h-px rounded-full bg-horror-orange/18 animate-ember" style={{ animationDelay: "2.1s", animationDuration: "6.2s" }} />
              </div>
              <div className="absolute inset-0 border border-horror-border group-hover:border-horror-orange/35 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col justify-end p-5 md:p-8 h-full">
                <div className="mt-auto">
                  <span className="text-horror-orange/50 text-xs md:text-xs tracking-[0.28em] uppercase block mb-2 md:mb-2">Halloween Collection</span>
                  <h3 className="font-cinzel text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 leading-snug group-hover:text-horror-orange transition-colors duration-300">
                    Standard Halloween Props
                  </h3>
                  <p className="hidden md:block text-horror-text-muted text-sm mb-6 max-w-xs leading-relaxed">
                    Premium animatronics for home decorations, parties and seasonal events.
                  </p>
                  <span className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-horror-orange/35 text-horror-orange text-xs font-bold tracking-wider uppercase group-hover:bg-horror-orange/10 transition-colors duration-300">
                    Browse Collection
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <svg className="md:hidden w-3 h-3 text-horror-orange/50 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Professional Animatronics */}
            <a
              href="/professional-animatronics"
              className="group relative overflow-hidden block min-h-[240px] md:min-h-[280px]"
              style={{ background: "linear-gradient(135deg, #0E0808 0%, #0A0510 100%)" }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 82% 78%, rgba(140,8,0,0.22) 0%, transparent 58%)" }} />
                <div className="absolute inset-0 animate-fog-medium" style={{ background: "radial-gradient(ellipse at 65% 60%, rgba(100,5,0,0.07) 0%, transparent 55%)", filter: "blur(32px)" }} />
                <div className="absolute top-4 right-5 w-px h-px rounded-full animate-ember" style={{ background: "rgba(200,150,30,0.28)", animationDelay: "1.2s", animationDuration: "6s" }} />
                <div className="absolute top-14 right-16 w-px h-px rounded-full animate-ember" style={{ background: "rgba(200,150,30,0.20)", animationDelay: "3s", animationDuration: "7.2s" }} />
              </div>
              <div className="absolute inset-0 border border-[rgba(200,150,30,0.18)] group-hover:border-[rgba(200,150,30,0.42)] transition-colors duration-500" />
              <div className="relative z-10 flex flex-col justify-end p-5 md:p-8 h-full">
                <div className="mt-auto">
                  <span className="text-xs md:text-xs tracking-[0.28em] uppercase block mb-2 md:mb-2" style={{ color: "rgba(200,148,28,0.58)" }}>Professional Grade</span>
                  <h3 className="font-cinzel text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 leading-snug group-hover:text-horror-orange transition-colors duration-300">
                    Professional Animatronics
                  </h3>
                  <p className="hidden md:block text-horror-text-muted text-sm mb-6 max-w-xs leading-relaxed">
                    High-end animatronics for haunted attractions, escape rooms and professional horror experiences.
                  </p>
                  <span className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-horror-orange/10 border border-horror-orange/30 text-horror-orange text-xs font-bold tracking-wider uppercase group-hover:bg-horror-orange/20 transition-colors duration-300">
                    Explore Collection
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <svg className="md:hidden w-3 h-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(200,148,28,0.55)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Scare Effect Animatronics */}
            <a
              href="/scare-effects"
              className="group relative overflow-hidden block min-h-[240px] md:min-h-[280px] col-span-2 lg:col-span-1"
              style={{ background: "linear-gradient(135deg, #0E0812 0%, #0A0714 100%)" }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 78%, rgba(140,60,220,0.18) 0%, transparent 58%)" }} />
                <div className="absolute inset-0 animate-fog-medium" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(100,40,160,0.07) 0%, transparent 55%)", filter: "blur(32px)" }} />
                <div className="absolute top-4 right-5 w-px h-px rounded-full animate-ember" style={{ background: "rgba(192,132,252,0.28)", animationDelay: "0.8s", animationDuration: "5.8s" }} />
                <div className="absolute top-14 right-16 w-px h-px rounded-full animate-ember" style={{ background: "rgba(192,132,252,0.20)", animationDelay: "2.6s", animationDuration: "6.8s" }} />
              </div>
              <div className="absolute inset-0 border border-[rgba(168,85,247,0.18)] group-hover:border-[rgba(168,85,247,0.42)] transition-colors duration-500" />
              <div className="relative z-10 flex flex-col justify-end p-5 md:p-8 h-full">
                <div className="mt-auto">
                  <span className="text-xs md:text-xs tracking-[0.28em] uppercase block mb-2 md:mb-2" style={{ color: "rgba(192,132,252,0.58)" }}>Jumpscare Line</span>
                  <h3 className="font-cinzel text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 leading-snug group-hover:text-horror-orange transition-colors duration-300">
                    Scare Effect Animatronics
                  </h3>
                  <p className="hidden md:block text-horror-text-muted text-sm mb-6 max-w-xs leading-relaxed">
                    Poppen met ingebouwd schrikeffect voor het ultieme jumpscare-moment.
                  </p>
                  <span className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-[rgba(168,85,247,0.35)] text-[rgba(192,132,252,0.9)] text-xs font-bold tracking-wider uppercase group-hover:bg-[rgba(168,85,247,0.1)] transition-colors duration-300">
                    Explore Collection
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <svg className="md:hidden w-3 h-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(192,132,252,0.55)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>
      )}

      {/* Products */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setCategory("all")}
              className={`flex items-center gap-2 px-4 py-2 border text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                activeCategory === "all"
                  ? "border-horror-orange/60 text-horror-orange bg-horror-orange/8"
                  : "border-horror-border text-horror-text-muted hover:border-horror-orange/40 hover:text-horror-orange"
              }`}
            >
              {s.filterAll}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 border text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "border-horror-orange/60 text-horror-orange bg-horror-orange/8"
                    : "border-horror-border text-horror-text-muted hover:border-horror-orange/40 hover:text-horror-orange"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product count */}
          <p className="text-horror-text-muted text-xs tracking-wider mb-6">
            {totalCount} {totalCount === 1 ? "product" : "producten"}
            {(filteredPro.length > 0 || filteredScare.length > 0) && (
              <span className="ml-2 opacity-60">
                (incl.
                {filteredPro.length > 0 && ` ${filteredPro.length} professionele animatronics`}
                {filteredPro.length > 0 && filteredScare.length > 0 && " en"}
                {filteredScare.length > 0 && ` ${filteredScare.length} scare effect animatronics`})
              </span>
            )}
          </p>

          {totalCount > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredStandard.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {filteredPro.map((product) => (
                <ProCard key={product.id} product={product} />
              ))}
              {filteredScare.map((product) => (
                <ScareCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-horror-text-muted">
              <p className="text-sm tracking-wide">Geen producten gevonden in deze categorie.</p>
            </div>
          )}

          {/* Trust strip */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-horror-text-muted text-xs tracking-wide">
            {[
              { Icon: Building2, text: s.stock.warehouse },
              { Icon: Package, text: s.stock.delivery },
              { Icon: Star, text: s.stock.returns },
              { Icon: Mail, text: s.stock.email },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.Icon size={14} strokeWidth={1.5} className="text-horror-orange/65 flex-shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      <UpcomingProducts />
    </>
  );
}
