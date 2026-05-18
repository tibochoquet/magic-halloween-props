"use client";

import Link from "next/link";
import type { Category } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import CategoryIcon from "@/components/ui/CategoryIcon";

type CategoryId = "zombie" | "witch" | "clown" | "ghost" | "monster" | "reaper" | "skeleton" | "wizard" | "mummy";

export default function CategoryCard({ category }: { category: Category }) {
  const t = useTranslation();
  const data = t.categoryData[category.id as CategoryId];
  const name = data?.name ?? category.name;
  const description = data?.description ?? category.description;

  return (
    <Link
      href={`/shop?category=${category.id}`}
      className="group relative block overflow-hidden bg-horror-card border border-horror-border transition-all duration-500 ease-out hover:border-horror-orange/35 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-60 transition-opacity duration-500 group-hover:opacity-80`} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${category.accentColor}22 0%, transparent 70%)` }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: category.accentColor }}
      />

      <div className="relative z-10 p-6 flex flex-col min-h-[180px] md:min-h-[200px]">
        {/* Lucide icon */}
        <div
          className="mb-auto text-horror-text-muted/50 group-hover:text-horror-orange transition-all duration-500 group-hover:drop-shadow-[0_0_10px_rgba(255,107,0,0.5)]"
        >
          <CategoryIcon id={category.id} size={40} />
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-horror-text-primary group-hover:text-white transition-colors duration-300">
                {name}
              </h3>
              <p className="text-horror-text-muted text-xs mt-0.5">{description}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-horror-text-muted text-xs">{category.itemCount} props</span>
              <div className="w-7 h-7 rounded-full border border-horror-border flex items-center justify-center group-hover:border-horror-orange/50 group-hover:bg-horror-orange/10 transition-all duration-300">
                <svg className="w-3 h-3 text-horror-text-muted group-hover:text-horror-orange transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
