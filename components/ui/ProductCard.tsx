"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { StarRating, BADGE_STYLES } from "@/components/ui/StarRating";
import CategoryIcon from "@/components/ui/CategoryIcon";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const soldOutCls = "border border-horror-border text-horror-text-muted cursor-not-allowed";
  const addCls = "bg-horror-orange/10 border border-horror-orange/30 text-horror-orange hover:bg-horror-orange hover:text-black";

  return (
    <article className={`group card-horror flex flex-col overflow-hidden ${product.soldOut ? "opacity-70" : ""}`}>
      <Link href={`/products/${product.id}`} className="block">
        <div className={`relative h-64 bg-gradient-to-br ${product.bgGradient} overflow-hidden flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(ellipse at 50% 80%, ${product.accentColor} 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain object-center p-4 relative z-10"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="relative z-10 text-horror-text-muted/30">
              <CategoryIcon id={product.category} size={96} />
            </div>
          )}

          {product.soldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <span className="border border-white/30 text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-2">
                {language === "nl" ? "Uitverkocht" : "Sold Out"}
              </span>
            </div>
          )}

          {product.badge && !product.soldOut && (
            <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold tracking-widest ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </div>
          )}

          {product.height && (
            <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/60 border border-white/10 text-horror-text-muted text-xs font-mono tracking-wide">
              {product.height}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4 md:p-6">
        <div className="mb-3">
          <span className="text-horror-orange-dark text-xs font-semibold tracking-wider uppercase">{product.category}</span>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-cinzel text-lg font-bold text-horror-text-primary mt-0.5 group-hover:text-horror-orange transition-colors duration-300 hover:text-horror-orange leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {product.features.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4">
            {product.features.map((feat) => (
              <li key={feat} className="flex items-center gap-1.5 text-xs text-horror-text-secondary">
                <div className="w-1 h-1 rounded-full bg-horror-orange flex-shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4 border-t border-horror-border flex items-end justify-between">
          <div>
            {product.rating != null && (
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={product.rating} />
                {product.reviews != null && (
                  <span className="text-horror-text-muted text-xs">({product.reviews})</span>
                )}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-horror-text-primary font-bold text-lg md:text-xl">
                €{product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
              {product.originalPrice && (
                <span className="text-horror-text-muted text-sm line-through">
                  €{product.originalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => !product.soldOut && addToCart(product)}
            disabled={product.soldOut}
            className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-3 md:py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${product.soldOut ? soldOutCls : addCls}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {product.soldOut ? (language === "nl" ? "Uitverkocht" : "Sold out") : (language === "nl" ? "Voeg toe" : "Add")}
          </button>
        </div>
      </div>
    </article>
  );
}
