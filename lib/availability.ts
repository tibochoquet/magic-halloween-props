import type { Product } from "@/types";

/**
 * The single predicate deciding whether a product may enter the cart and be
 * ordered. Availability was previously enforced only by disabling buttons in
 * the card components — the cart and checkout did no validation at all, so a
 * cart held across an availability change still checked out.
 *
 * Everything that can put an item into an order must go through this.
 */
export function isOrderable(product: Pick<Product, "availability" | "notifyOnRestock">): boolean {
  if (product.availability !== "in_stock") return false;
  // Products awaiting a restock/arrival are never directly orderable, even if
  // someone flips availability by mistake. Pre-order is a separate build with
  // its own rules (deposit handling, delivery-date commitments) — not this one.
  if (product.notifyOnRestock) return false;
  return true;
}

/** Human-readable reason a product cannot be ordered, or null when it can. */
export function notOrderableReason(
  product: Pick<Product, "availability" | "availabilityNote" | "notifyOnRestock">,
  language: "nl" | "en" = "nl"
): string | null {
  if (isOrderable(product)) return null;
  if (product.availabilityNote) return product.availabilityNote;
  return language === "nl" ? "Niet beschikbaar" : "Unavailable";
}
