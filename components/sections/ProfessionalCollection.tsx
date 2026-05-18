"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import ProCard from "@/components/ui/ProCard";
import { useTranslation } from "@/hooks/useTranslation";
import { professionalProducts } from "@/data/professionalProducts";

export default function ProfessionalCollection({ pageMode = false }: { pageMode?: boolean }) {
  const t = useTranslation();

  return (
    <section
      id="professional"
      className={`relative overflow-hidden ${pageMode ? "pt-28 md:pt-36 pb-16 md:pb-24" : "py-16 md:py-24 lg:py-32 -mt-px"}`}
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0E0808 25%, #0C0910 55%, #0A0A0A 100%)" }}
    >
      {!pageMode && (
        <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />
      )}

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-80 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(160,15,0,0.10) 0%, transparent 65%)" }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-15%] right-[-15%] h-[38%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 30% 32%, rgba(35,12,6,0.07) 0%, transparent 60%)", filter: "blur(52px)" }} />
        <div className="absolute bottom-0 left-[-10%] right-[-10%] h-[32%] animate-fog-medium" style={{ background: "radial-gradient(ellipse at 68% 88%, rgba(25,8,4,0.06) 0%, transparent 55%)", filter: "blur(42px)" }} />
        <div className="absolute top-[40%] right-[-8%] w-[35%] h-[38%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 85% 50%, rgba(30,10,5,0.05) 0%, transparent 58%)", filter: "blur(38px)" }} />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[4%] left-[20%] w-px h-px rounded-full bg-horror-orange/15 animate-ember" style={{ animationDelay: "0.6s", animationDuration: "6.2s" }} />
        <div className="absolute top-[16%] left-[75%] w-px h-px rounded-full bg-horror-orange/12 animate-ember" style={{ animationDelay: "2.2s", animationDuration: "7.1s" }} />
        <div className="absolute top-[38%] left-[88%] w-px h-px rounded-full bg-horror-orange/10 animate-ember" style={{ animationDelay: "1.3s", animationDuration: "5.8s" }} />
        <div className="absolute top-[55%] left-[10%] w-px h-px rounded-full bg-horror-orange/13 animate-ember" style={{ animationDelay: "3.1s", animationDuration: "6.8s" }} />
        <div className="absolute top-[72%] left-[52%] w-px h-px rounded-full bg-horror-orange/11 animate-ember" style={{ animationDelay: "0.8s", animationDuration: "7.5s" }} />
        <div className="absolute top-[88%] left-[33%] w-px h-px rounded-full bg-horror-orange/10 animate-ember" style={{ animationDelay: "1.9s", animationDuration: "6.5s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeader
          eyebrow="Professional Collection"
          title="Professional"
          titleAccent="Animatronics"
          subtitle="High-end cinematic animatronics for haunted attractions, escape rooms and professional horror experiences."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {professionalProducts.map((product) => (
            <ProCard key={product.id} product={product} />
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
