"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/types";

export default function ProCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();

  return (
    <article className={`group card-horror flex flex-col overflow-hidden${product.soldOut ? " opacity-60" : ""}`}>
      <div className="relative h-64 bg-gradient-to-br from-[#1c0e0a] to-[#0a0505] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(180,55,0,0.28) 0%, transparent 65%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

        <Image
          src={product.image!}
          alt={product.name}
          fill
          className="object-contain object-center p-4 relative z-10 transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {product.soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="border border-white/25 text-white text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-2 bg-black/30">
              {language === "nl" ? "Uitverkocht" : "Sold Out"}
            </span>
          </div>
        )}

        {product.originalPrice && !product.soldOut && (
          <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-horror-orange text-black text-[11px] font-black tracking-widest uppercase z-10">
            SALE
          </div>
        )}

        {/* Professional collection indicator — subtle gold badge */}
        <div className="absolute top-3 right-3 z-10 px-1.5 py-0.5 bg-black/75 border border-[rgba(200,150,30,0.38)]">
          <span className="text-[8px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(200,148,28,0.78)" }}>PRO</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 md:p-5">
        <h3 className="font-cinzel text-sm font-bold text-horror-text-primary group-hover:text-horror-orange transition-colors duration-300 leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="mt-4 pt-4 border-t border-horror-border flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-base md:text-lg text-horror-text-primary whitespace-nowrap">
                € {product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
              {product.originalPrice && (
                <span className="text-horror-text-muted text-sm line-through whitespace-nowrap">
                  € {product.originalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => !product.soldOut && addToCart(product)}
            disabled={product.soldOut}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 md:py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
              product.soldOut
                ? "border border-horror-border text-horror-text-muted cursor-not-allowed"
                : "bg-horror-orange/10 border border-horror-orange/30 text-horror-orange hover:bg-horror-orange hover:text-black"
            }`}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {product.soldOut
              ? (language === "nl" ? "Uitverkocht" : "Sold out")
              : (language === "nl" ? "Voeg toe" : "Add")}
          </button>
        </div>
      </div>
    </article>
  );
}
