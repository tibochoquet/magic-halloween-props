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
   * Confirmed by the operator: the customer arranges and pays for the
   * return shipment themselves (no seller-quoted freight fee).
   */
  paidBy: "customer" as ReturnShippingPayer | null,

  /**
   * Deliberately empty: the operator does not quote a fixed return-shipping
   * fee per size class (see `paidBy` above — the customer arranges their own
   * carrier), so there is no figure to disclose here.
   */
  costsBySizeClass: [
    { label: "Tot 1,20 m", costEur: TODO },
    { label: "1,20 m – 1,80 m", costEur: TODO },
    { label: "Boven 1,80 m", costEur: TODO },
  ] as SizeClassCost[],

  /**
   * Return address. Confirmed by the operator. Deliberately NOT shown on the
   * public returns page — it is revealed only after a return is registered.
   */
  returnAddress: "Pannenweg 306\n6031 RK Nederweert\nNederland" as string | null,
};

export const deliveryTerms = {
  /** Delivery term for in-stock items. Shown before ordering. */
  inStock: "1-3 werkdagen" as string | null,
  /** Term for pickup-by-appointment orders. */
  pickup: "Op afspraak, meestal binnen 1-2 werkdagen" as string | null,
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
