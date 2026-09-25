"use client";

import CategoryCard from "@/components/ui/CategoryCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { activeCategories } from "@/lib/catalogue";
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

        {/* Only categories that actually hold a product — see lib/catalogue.ts. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activeCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        {/* The four stat tiles that stood here are gone: two of them ("98%
            klanttevredenheid", "15jr branche-ervaring") were never verified,
            and the two real numbers left over — product count and category
            count — are already on the page, in the hero and on these very
            tiles. See lib/claims.ts before putting anything back. */}
      </div>
    </section>
  );
}
