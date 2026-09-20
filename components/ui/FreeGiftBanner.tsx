"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  FREE_GIFT_PRODUCT_ID,
  FREE_GIFT_SHORT_NAME,
  FREE_GIFT_THRESHOLD_EUR,
  getFreeGiftProduct,
} from "@/lib/promotions";

const euro = (amount: number) => `€${amount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`;

/** Collection-level promo strip for the €300 gift. Hidden when the gift can't be shipped. */
export default function FreeGiftBanner() {
  const { language } = useLanguage();
  const nl = language === "nl";
  const gift = getFreeGiftProduct();
  if (!gift) return null;

  return (
    <Link
      href={`/products/${FREE_GIFT_PRODUCT_ID}`}
      className="group relative block overflow-hidden border border-horror-orange/25 hover:border-horror-orange/50 transition-colors duration-500"
      style={{ background: "linear-gradient(135deg, #160C0A 0%, #0C0A0E 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 12% 90%, rgba(255,107,0,0.16) 0%, transparent 60%)" }}
        />
        <div
          className="absolute inset-0 animate-fog-slow"
          style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(160,50,0,0.08) 0%, transparent 55%)", filter: "blur(30px)" }}
        />
      </div>

      <div className="relative z-10 flex items-center gap-4 md:gap-6 p-4 md:p-5">
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-black/40 border border-horror-orange/20">
          {gift.image && (
            <Image src={gift.image} alt="" fill className="object-contain p-1.5" sizes="80px" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-horror-orange text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase block mb-1">
            🎃 {nl ? "Gratis cadeau" : "Free gift"}
          </span>
          <h3 className="font-cinzel text-base md:text-xl font-bold text-horror-text-primary leading-snug group-hover:text-horror-orange transition-colors duration-300">
            {nl
              ? `${FREE_GIFT_SHORT_NAME} gratis bij besteding vanaf €${FREE_GIFT_THRESHOLD_EUR}`
              : `${FREE_GIFT_SHORT_NAME} free on orders from €${FREE_GIFT_THRESHOLD_EUR}`}
          </h3>
          <p className="text-horror-text-muted text-xs md:text-sm mt-1 leading-relaxed">
            {nl ? (
              <>
                Ter waarde van {euro(gift.price)} — wordt automatisch aan je bestelling toegevoegd zodra je €
                {FREE_GIFT_THRESHOLD_EUR} bereikt.
              </>
            ) : (
              <>
                Worth {euro(gift.price)} — added to your order automatically once you reach €
                {FREE_GIFT_THRESHOLD_EUR}.
              </>
            )}
          </p>
        </div>

        <svg
          className="hidden sm:block w-4 h-4 flex-shrink-0 text-horror-orange/60 group-hover:text-horror-orange transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
}
