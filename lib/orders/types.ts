/**
 * Order domain model.
 *
 * Deliberately storage-agnostic: the API routes talk to the OrderStore
 * interface (lib/orders/store.ts), never to a concrete backend. Swapping the
 * in-memory dev store for Postgres/Supabase means implementing one interface,
 * with no change to the routes or the UI.
 */

export type OrderStatus =
  | "received"      // Bestelling ontvangen
  | "processing"    // In behandeling
  | "shipped"       // Verzonden
  | "in_transit"    // Onderweg
  | "delivered"     // Afgeleverd
  | "cancelled";    // Geannuleerd

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export type ReturnStatus =
  | "requested"     // Retour aangemeld
  | "in_transit"    // Retour onderweg
  | "received"      // Retour ontvangen
  | "refunded"      // Terugbetaling verwerkt
  | "rejected";     // Retour afgewezen

export type Carrier = "dhl" | "dpd";

export type OrderLine = {
  productId: string;
  /** Denormalised so an order stays readable if the catalogue changes. */
  name: string;
  quantity: number;
  /** Unit price in cents, VAT inclusive. Integers avoid float drift. */
  unitPriceCents: number;
};

export type Address = {
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  country: string;
};

export type Shipment = {
  carrier: Carrier;
  /** Carrier tracking code. null until the parcel is actually handed over. */
  trackingCode: string | null;
  shippedAt: string | null;
};

export type ReturnLine = {
  productId: string;
  quantity: number;
};

export type ReturnReason =
  | "damaged"
  | "not_as_described"
  | "wrong_item"
  | "no_longer_needed"
  | "other";

export type ReturnRequest = {
  id: string;
  orderId: string;
  status: ReturnStatus;
  lines: ReturnLine[];
  reason: ReturnReason;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  orderId: string;
  productId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  displayName: string;
  createdAt: string;
};

export type Order = {
  id: string;
  /** Human-facing order number, e.g. "MHP-2026-0001". */
  orderNumber: string;
  /** Lowercased, used for the order-number + email verification. */
  email: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  lines: OrderLine[];
  /** Shipping cost in cents, VAT inclusive. */
  shippingCents: number;
  shippingAddress: Address;
  shipment: Shipment | null;
};

/** Total in cents, VAT inclusive. */
export function orderTotalCents(order: Order): number {
  return order.lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0) + order.shippingCents;
}

/** An order may be reviewed only once it has actually been delivered. */
export function canReview(order: Order): boolean {
  return order.status === "delivered";
}

/**
 * Returns are only meaningful once goods are with the customer. The statutory
 * withdrawal window is enforced separately against the delivery date.
 */
export function canRequestReturn(order: Order): boolean {
  return order.status === "delivered";
}
