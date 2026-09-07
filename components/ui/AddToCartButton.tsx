"use client";

import type { Product } from "@/types";
import { isOrderable } from "@/lib/availability";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = useTranslation();
  const unavailable = !isOrderable(product);
  const unavailableLabel = product.availabilityNote ?? (language === "nl" ? "Niet beschikbaar" : "Unavailable");

  return (
    <button
      onClick={() => !unavailable && addToCart(product)}
      disabled={unavailable}
      className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-bold tracking-widest uppercase text-sm transition-colors duration-300 ${
        unavailable
          ? "bg-horror-card border border-horror-border text-horror-text-muted cursor-not-allowed"
          : "bg-horror-orange text-black hover:bg-horror-orange-light"
      }`}
    >
      {!unavailable && (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )}
      {unavailable ? unavailableLabel : t.product.addToCart}
    </button>
  );
}
