import type { Product } from "@/types";
import { getProductById } from "./catalogue";
import { isOrderable } from "./availability";

/**
 * "GRATIS bij besteding vanaf €300" — the Grim Portrait is added to the order
 * at no cost once the cart reaches the threshold.
 *
 * Single source of truth for the promotion. The shop UI only ever *shows* what
 * the checkout API will actually do: app/api/checkout/route.ts re-derives the
 * gift server-side from the same helpers, so a tampered cart can't claim it and
 * a qualifying cart can't silently miss it.
 */
export const FREE_GIFT_PRODUCT_ID = "grim-portrait";
/** Short label for tight spots (cart row, badge) where the full name doesn't fit. */
export const FREE_GIFT_SHORT_NAME = "Grim Portrait";
export const FREE_GIFT_THRESHOLD_CENTS = 30_000;
export const FREE_GIFT_THRESHOLD_EUR = FREE_GIFT_THRESHOLD_CENTS / 100;

/**
 * Cents for a catalogue price. Both the cart UI and the checkout API must round
 * per line with this, or the two can disagree by a cent exactly at the
 * threshold — which is the one place a disagreement is visible to the customer.
 */
export function priceToCents(priceEur: number): number {
  return Math.round(priceEur * 100);
}

export function cartSubtotalCents(lines: { price: number; quantity: number }[]): number {
  return lines.reduce((sum, line) => sum + priceToCents(line.price) * line.quantity, 0);
}

/** The gift, or undefined when it isn't sellable — never promise what we can't ship. */
export function getFreeGiftProduct(): Product | undefined {
  const product = getProductById(FREE_GIFT_PRODUCT_ID);
  return product && isOrderable(product) ? product : undefined;
}

export function qualifiesForFreeGift(subtotalCents: number): boolean {
  return Boolean(getFreeGiftProduct()) && subtotalCents >= FREE_GIFT_THRESHOLD_CENTS;
}

/** Cents still to spend before the gift unlocks; 0 once it has. */
export function centsUntilFreeGift(subtotalCents: number): number {
  return Math.max(0, FREE_GIFT_THRESHOLD_CENTS - subtotalCents);
}
