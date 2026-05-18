"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Building2, Package, RotateCcw, Mail } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProCard from "@/components/ui/ProCard";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { products, categories } from "@/data";
import { professionalProducts } from "@/data/professionalProducts";
import { useTranslation } from "@/hooks/useTranslation";

export default function ShopContent() {
  const t = useTranslation();
  const s = t.shop;
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") ?? "all";

  const filteredStandard = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  // Professional products appear when browsing by category (theme-based browsing)
  const filteredPro = activeCategory === "all"
    ? []
    : professionalProducts.filter((p) => p.category === activeCategory);

  const totalCount = filteredStandard.length + filteredPro.length;

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
      {/* Page header */}
      <section className="relative pt-28 md:pt-36 pb-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.07) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeader eyebrow={s.eyebrow} title={s.title} titleAccent={s.titleAccent} subtitle={s.subtitle} />
        </div>
      </section>

      {/* Collection gateway cards */}
      <section className="py-0">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Standard Halloween Props */}
            <a
              href="/halloween-props"
              className="group relative overflow-hidden block"
              style={{ minHeight: "280px", background: "linear-gradient(135deg, #160C0A 0%, #0E0A14 100%)" }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 18% 78%, rgba(200,60,0,0.20) 0%, transparent 58%)" }} />
                <div className="absolute inset-0 animate-fog-slow" style={{ background: "radial-gradient(ellipse at 35% 62%, rgba(160,50,0,0.07) 0%, transparent 55%)", filter: "blur(32px)" }} />
                <div className="absolute top-4 right-5 w-px h-px rounded-full bg-horror-orange/25 animate-ember" style={{ animationDelay: "0.5s", animationDuration: "5.5s" }} />
                <div className="absolute top-14 right-16 w-px h-px rounded-full bg-horror-orange/18 animate-ember" style={{ animationDelay: "2.1s", animationDuration: "6.2s" }} />
              </div>
              <div className="absolute inset-0 border border-horror-border group-hover:border-horror-orange/35 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col justify-end p-8 h-full" style={{ minHeight: "280px" }}>
                <div className="mt-auto">
                  <span className="text-horror-orange/50 text-xs tracking-[0.28em] uppercase block mb-2">Halloween Collection</span>
                  <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-horror-orange transition-colors duration-300">
                    Standard Halloween Props
                  </h3>
                  <p className="text-horror-text-muted text-sm mb-6 max-w-xs leading-relaxed">
                    Premium animatronics for home decorations, parties and seasonal events.
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-horror-orange/35 text-horror-orange text-xs font-bold tracking-wider uppercase group-hover:bg-horror-orange/10 transition-colors duration-300">
                    Browse Collection
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Professional Animatronics */}
            <a
              href="/professional-animatronics"
              className="group relative overflow-hidden block"
              style={{ minHeight: "280px", background: "linear-gradient(135deg, #0E0808 0%, #0A0510 100%)" }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 82% 78%, rgba(140,8,0,0.22) 0%, transparent 58%)" }} />
                <div className="absolute inset-0 animate-fog-medium" style={{ background: "radial-gradient(ellipse at 65% 60%, rgba(100,5,0,0.07) 0%, transparent 55%)", filter: "blur(32px)" }} />
                <div className="absolute top-4 right-5 w-px h-px rounded-full animate-ember" style={{ background: "rgba(200,150,30,0.28)", animationDelay: "1.2s", animationDuration: "6s" }} />
                <div className="absolute top-14 right-16 w-px h-px rounded-full animate-ember" style={{ background: "rgba(200,150,30,0.20)", animationDelay: "3s", animationDuration: "7.2s" }} />
              </div>
              <div className="absolute inset-0 border border-[rgba(200,150,30,0.18)] group-hover:border-[rgba(200,150,30,0.42)] transition-colors duration-500" />
              <div className="relative z-10 flex flex-col justify-end p-8 h-full" style={{ minHeight: "280px" }}>
                <div className="mt-auto">
                  <span className="text-xs tracking-[0.28em] uppercase block mb-2" style={{ color: "rgba(200,148,28,0.58)" }}>Professional Grade</span>
                  <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-horror-orange transition-colors duration-300">
                    Professional Animatronics
                  </h3>
                  <p className="text-horror-text-muted text-sm mb-6 max-w-xs leading-relaxed">
                    High-end animatronics for haunted attractions, escape rooms and professional horror experiences.
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-horror-orange/10 border border-horror-orange/30 text-horror-orange text-xs font-bold tracking-wider uppercase group-hover:bg-horror-orange/20 transition-colors duration-300">
                    Explore Collection
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>

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
                className={`flex items-center gap-2 px-4 py-2 border text-xs font-semibold tracking-widest uppercase transition-all duration-200 group ${
                  activeCategory === cat.id
                    ? "border-horror-orange/60 text-horror-orange bg-horror-orange/8"
                    : "border-horror-border text-horror-text-muted hover:border-horror-orange/40 hover:text-horror-orange"
                }`}
              >
                <span className={`transition-all duration-200 ${activeCategory === cat.id ? "drop-shadow-[0_0_6px_rgba(255,107,0,0.6)]" : "group-hover:drop-shadow-[0_0_6px_rgba(255,107,0,0.4)]"}`}>
                  <CategoryIcon id={cat.id} size={14} />
                </span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product count */}
          <p className="text-horror-text-muted text-xs tracking-wider mb-6">
            {totalCount} {totalCount === 1 ? "product" : "producten"}
            {filteredPro.length > 0 && (
              <span className="ml-2 opacity-60">— incl. {filteredPro.length} professionele animatronics</span>
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
              { Icon: RotateCcw, text: s.stock.returns },
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
    </>
  );
}
