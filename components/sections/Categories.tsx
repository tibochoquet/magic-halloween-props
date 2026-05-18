"use client";

import { categories } from "@/data";
import CategoryCard from "@/components/ui/CategoryCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Package2, LayoutGrid, Star, Shield } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Categories() {
  const t = useTranslation();
  const s = t.categories;

  return (
    <section
      id="categories"
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden -mt-px"
      style={{ background: `linear-gradient(rgba(10,10,10,0.78), rgba(10,10,10,0.78)), url('/chains-divider-bg.png') center bottom / cover no-repeat #0A0A0A` }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,0,0,0.07) 0%, transparent 65%)" }} />
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeader
          eyebrow={s.eyebrow}
          title={s.title}
          titleAccent={s.titleAccent}
          subtitle={s.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: s.stats.propsVal, label: s.stats.props, Icon: Package2 },
            { value: s.stats.catsVal, label: s.stats.cats, Icon: LayoutGrid },
            { value: s.stats.satVal, label: s.stats.sat, Icon: Star },
            { value: s.stats.expVal, label: s.stats.exp, Icon: Shield },
          ].map((stat) => (
            <div key={stat.label} className="bg-horror-card border border-horror-border p-6 text-center hover:border-horror-orange/30 transition-colors duration-300">
              <stat.Icon size={26} strokeWidth={1.25} className="mx-auto mb-3 text-horror-orange/60" />
              <div className="font-cinzel text-2xl font-bold text-horror-orange mb-1">{stat.value}</div>
              <div className="text-horror-text-muted text-xs tracking-wider uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
