/**
 * Commercial and legal terms shown to the consumer.
 *
 * Statutory values (the 14-day periods) are fixed by Dutch/EU consumer law and
 * are safe to state. Everything marked TODO is business-specific and MUST come
 * from the operator — a wrong figure here is a real financial exposure on an
 * €850 item, so nothing in this file is guessed.
 */

export const TODO = null;

/** Statutory: consumer may withdraw within 14 days of receipt. */
export const WITHDRAWAL_DAYS = 14;
/** Statutory: after notifying, consumer has 14 more days to return the goods. */
export const RETURN_WINDOW_DAYS = 14;
/** Statutory: seller refunds within 14 days of the withdrawal notice. */
export const REFUND_DAYS = 14;

export type ReturnShippingPayer = "customer" | "seller";

export type SizeClassCost = {
  /** Human label, e.g. "Tot 1,20 m". */
  label: string;
  /** Cost in EUR incl. VAT, or null if not yet supplied. */
  costEur: number | null;
};

export const returnPolicy = {
  /**
   * TODO (build-blocking): who pays return shipping?
   * If the customer pays, it MUST be disclosed before the order is placed, or
   * the seller carries the cost by default. For a 213 cm animatronic this is a
   * freight cost, not a €7 parcel.
   */
  paidBy: TODO as ReturnShippingPayer | null,

  /**
   * TODO (build-blocking): actual return shipping cost per size class.
   * Supply real carrier quotes — these appear before checkout.
   */
  costsBySizeClass: [
    { label: "Tot 1,20 m", costEur: TODO },
    { label: "1,20 m – 1,80 m", costEur: TODO },
    { label: "Boven 1,80 m", costEur: TODO },
  ] as SizeClassCost[],

  /**
   * TODO (build-blocking): the address goods must be returned to.
   * Do NOT assume this equals the visiting address.
   */
  returnAddress: TODO as string | null,
};

export const deliveryTerms = {
  /**
   * TODO (build-blocking): delivery term for in-stock items, e.g. "1-3 werkdagen".
   * Shown on every product page before ordering.
   */
  inStock: TODO as string | null,
  /** TODO: term for pickup-by-appointment orders. */
  pickup: TODO as string | null,
  /** Carriers used. Already stated elsewhere on the site. */
  carriers: "DHL / DPD",
};

/** VAT rate applied to consumer prices. Dutch general rate. */
export const VAT_RATE = 0.21;

/**
 * Whether `product.price` in the data files is stored INCLUSIVE of VAT.
 * Verified: the site labels totals "Inclusief btw" and Artikel 4 of the terms
 * states all prices include VAT, so stored prices are gross.
 */
export const PRICES_INCLUDE_VAT = true;

export const missingShopTerms: { field: string; why: string }[] = [
  ...(returnPolicy.paidBy === null
    ? [{ field: "returnPolicy.paidBy", why: "Who pays return shipping must be disclosed before ordering." }]
    : []),
  ...(returnPolicy.costsBySizeClass.some((c) => c.costEur === null)
    ? [{ field: "returnPolicy.costsBySizeClass", why: "Return shipping cost per size class must be disclosed before ordering." }]
    : []),
  ...(returnPolicy.returnAddress === null
    ? [{ field: "returnPolicy.returnAddress", why: "Consumer must be told where to return goods." }]
    : []),
  ...(deliveryTerms.inStock === null
    ? [{ field: "deliveryTerms.inStock", why: "A delivery term must be shown before ordering." }]
    : []),
  ...(deliveryTerms.pickup === null
    ? [{ field: "deliveryTerms.pickup", why: "Pickup term for appointment orders." }]
    : []),
];
