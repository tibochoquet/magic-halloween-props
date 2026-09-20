"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import {
  FREE_GIFT_SHORT_NAME,
  centsUntilFreeGift,
  getFreeGiftProduct,
  qualifiesForFreeGift,
} from "@/lib/promotions";

const euro = (amount: number) => `€${amount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`;

/**
 * The €300 gift, as the customer sees it in the cart and at checkout: how much
 * is still missing, or the gift itself once it has been earned. Mirrors exactly
 * what app/api/checkout/route.ts will put in the Stripe session.
 */
export default function FreeGiftNotice({ subtotalCents }: { subtotalCents: number }) {
  const { language } = useLanguage();
  const nl = language === "nl";
  const gift = getFreeGiftProduct();
  if (!gift) return null;

  if (!qualifiesForFreeGift(subtotalCents)) {
    const remaining = centsUntilFreeGift(subtotalCents) / 100;
    return (
      <div className="flex items-start gap-2.5 p-3 border border-horror-orange/25 bg-horror-orange/[0.04]">
        <span className="text-sm leading-none mt-0.5">🎃</span>
        <p className="text-horror-text-secondary text-xs leading-relaxed">
          {nl ? (
            <>
              Nog <span className="text-horror-orange font-bold">{euro(remaining)}</span> en je krijgt het{" "}
              {FREE_GIFT_SHORT_NAME} er <span className="text-horror-orange font-bold">gratis</span> bij
              <span className="text-horror-text-muted"> · t.w.v. {euro(gift.price)}</span>
            </>
          ) : (
            <>
              Spend <span className="text-horror-orange font-bold">{euro(remaining)}</span> more and the{" "}
              {FREE_GIFT_SHORT_NAME} is <span className="text-horror-orange font-bold">free</span>
              <span className="text-horror-text-muted"> · worth {euro(gift.price)}</span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 border border-horror-orange/40 bg-horror-orange/[0.07]">
      <div className="relative w-12 h-12 flex-shrink-0 bg-black/40 border border-horror-orange/20">
        {gift.image && <Image src={gift.image} alt="" fill className="object-contain p-1" sizes="48px" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-horror-orange text-[10px] font-bold tracking-[0.15em] uppercase">
          🎃 {nl ? "Gratis cadeau" : "Free gift"}
        </p>
        <p className="font-cinzel text-sm font-bold text-horror-text-primary leading-tight truncate">
          {FREE_GIFT_SHORT_NAME}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-horror-orange font-bold text-sm">{nl ? "GRATIS" : "FREE"}</p>
        <p className="text-horror-text-muted text-xs line-through">{euro(gift.price)}</p>
      </div>
    </div>
  );
}
