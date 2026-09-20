"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { isOrderable } from "@/lib/availability";
import { useCardVideo } from "@/hooks/useCardVideo";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { StarRating, BADGE_STYLES } from "@/components/ui/StarRating";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { FREE_GIFT_PRODUCT_ID, FREE_GIFT_THRESHOLD_EUR } from "@/lib/promotions";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const { containerRef, videoProps, showVideo, onPointerEnter, onPointerLeave } =
    useCardVideo(Boolean(product.video));
  const unavailable = !isOrderable(product);
  const unavailableShortLabel = language === "nl" ? "Niet beschikbaar" : "Unavailable";
  const unavailableLabel = product.availabilityNote ?? unavailableShortLabel;

  const unavailableCls = "border border-horror-border text-horror-text-muted cursor-not-allowed";
  const addCls = "bg-horror-orange/10 border border-horror-orange/30 text-horror-orange hover:bg-horror-orange hover:text-black";

  return (
    <article
      ref={containerRef as React.RefObject<HTMLElement>}
      id={`product-${product.id}`} className={`group card-horror flex flex-col overflow-hidden w-full scroll-mt-28 ${unavailable ? "opacity-70" : ""}`}>
      <Link
        href={`/products/${product.id}`}
        className="block"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <div className={`relative h-64 bg-gradient-to-br ${product.bgGradient} overflow-hidden flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(ellipse at 50% 80%, ${product.accentColor} 0%, transparent 65%)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-contain object-center p-4 relative z-10 transition-opacity duration-300 ${showVideo ? "opacity-0" : "opacity-100"}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="relative z-10 text-horror-text-muted/30">
              <CategoryIcon id={product.category} size={96} />
            </div>
          )}
          {product.video && (
            <video
              {...videoProps}
              src={product.video}
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-contain object-center p-4 transition-opacity duration-300 z-10 ${showVideo ? "opacity-100" : "opacity-0"}`}
            />
          )}

          {unavailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 px-4 text-center">
              <span className="border border-white/30 text-white text-xs font-bold tracking-[0.15em] uppercase px-4 py-2">
                {unavailableLabel}
              </span>
            </div>
          )}

          {product.badge && !unavailable && (
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

        {product.id === FREE_GIFT_PRODUCT_ID && !unavailable && (
          <span className="self-start mb-3 px-2 py-1 bg-horror-orange/10 border border-horror-orange/30 text-horror-orange text-[10px] font-bold tracking-[0.12em] uppercase">
            🎃 {language === "nl" ? "Gratis vanaf" : "Free from"} €{FREE_GIFT_THRESHOLD_EUR}
          </span>
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
            onClick={() => !unavailable && addToCart(product)}
            disabled={unavailable}
            className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-3 md:py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${unavailable ? unavailableCls : addCls}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {unavailable ? unavailableShortLabel : (language === "nl" ? "Voeg toe" : "Add")}
          </button>
        </div>
      </div>
    </article>
  );
}
