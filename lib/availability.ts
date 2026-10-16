import type { Product } from "@/types";

/**
 * Harde bovengrens per regel, los van de voorraad: een bestelling van 50 stuks
 * is in deze winkel vrijwel zeker een fout of misbruik en hoort niet door de
 * geautomatiseerde checkout te lopen. Stond eerder alleen in de checkout-route.
 */
export const MAX_QUANTITY_PER_ITEM = 10;

/** Vanaf hier noemen we de voorraad laag en zeggen we er iets over op de productpagina. */
export const LOW_STOCK_THRESHOLD = 5;

type AvailabilityFields = Pick<Product, "availability" | "notifyOnRestock" | "stock">;

/**
 * The single predicate deciding whether a product may enter the cart and be
 * ordered. Availability was previously enforced only by disabling buttons in
 * the card components — the cart and checkout did no validation at all, so a
 * cart held across an availability change still checked out.
 *
 * Everything that can put an item into an order must go through this.
 */
export function isOrderable(product: AvailabilityFields): boolean {
  if (product.availability !== "in_stock") return false;
  // Products awaiting a restock/arrival are never directly orderable, even if
  // someone flips availability by mistake. Pre-order is a separate build with
  // its own rules (deposit handling, delivery-date commitments) — not this one.
  if (product.notifyOnRestock) return false;
  // Niets meer in het magazijn: dan is het product niet leverbaar, ook al staat
  // availability nog op in_stock.
  if (!(product.stock > 0)) return false;
  return true;
}

/**
 * Het hoogste aantal dat van dit product in één bestelling mag: nooit meer dan
 * er op voorraad ligt, en nooit meer dan de harde bovengrens. 0 wanneer het
 * product helemaal niet besteld kan worden.
 */
export function maxOrderableQuantity(product: AvailabilityFields): number {
  if (!isOrderable(product)) return 0;
  return Math.min(Math.floor(product.stock), MAX_QUANTITY_PER_ITEM);
}

/** Bijna uitverkocht — bedoeld om de laatste exemplaren te kunnen benoemen. */
export function isLowStock(product: AvailabilityFields): boolean {
  return isOrderable(product) && product.stock <= LOW_STOCK_THRESHOLD;
}

/** Human-readable reason a product cannot be ordered, or null when it can. */
export function notOrderableReason(
  product: Pick<Product, "availability" | "availabilityNote" | "notifyOnRestock" | "stock">,
  language: "nl" | "en" = "nl"
): string | null {
  if (isOrderable(product)) return null;
  if (product.availabilityNote) return product.availabilityNote;
  if (product.availability === "in_stock" && !product.notifyOnRestock) {
    return language === "nl" ? "Uitverkocht" : "Sold out";
  }
  return language === "nl" ? "Niet beschikbaar" : "Unavailable";
}
