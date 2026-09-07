import type { Order, ReturnRequest, Review, ReturnStatus } from "./types";

/**
 * Storage boundary for orders, returns and reviews.
 *
 * IMPLEMENT THIS AGAINST A REAL DATABASE BEFORE LAUNCH.
 * The in-memory implementation below exists so the whole flow — API routes,
 * validation, auth guards, UI, error and empty states — is genuinely testable
 * today. It is process-local and resets on every server restart, so it is
 * unusable for real customers and refuses to run in production (see below).
 *
 * To go live: create e.g. lib/orders/store.postgres.ts implementing OrderStore,
 * and swap the export at the bottom of this file. Nothing else changes.
 */
export interface OrderStore {
  /** Look up by order number + email. Both must match; used by guests. */
  findByNumberAndEmail(orderNumber: string, email: string): Promise<Order | null>;
  /** All orders for a signed-in customer. */
  listByEmail(email: string): Promise<Order[]>;
  findById(orderId: string): Promise<Order | null>;

  listReturnsForOrder(orderId: string): Promise<ReturnRequest[]>;
  createReturn(input: Omit<ReturnRequest, "id" | "createdAt" | "updatedAt">): Promise<ReturnRequest>;
  updateReturnStatus(returnId: string, status: ReturnStatus): Promise<ReturnRequest | null>;

  listReviewsForOrder(orderId: string): Promise<Review[]>;
  createReview(input: Omit<Review, "id" | "createdAt">): Promise<Review>;
}

const IS_PROD = process.env.NODE_ENV === "production";

/* ── Development fixture ──────────────────────────────────────────────────
   One order per status the UI must handle, so every state is reachable in
   testing. Emails are example.com addresses; no real customer data.        */
function seedOrders(): Order[] {
  const iso = (daysAgo: number) =>
    new Date(Date.now() - daysAgo * 864e5).toISOString();

  return [
    {
      id: "ord_demo_delivered",
      orderNumber: "MHP-2026-0001",
      email: "demo@example.com",
      createdAt: iso(12),
      status: "delivered",
      paymentStatus: "paid",
      lines: [
        { productId: "halloween-pop-chainsaw-killer", name: "Halloween pop Chainsaw Killer", quantity: 1, unitPriceCents: 13900 },
        { productId: "halloween-pop-evil-witch", name: "Halloween pop Evil Witch", quantity: 2, unitPriceCents: 14900 },
      ],
      shippingCents: 0,
      shippingAddress: {
        firstName: "Demo", lastName: "Klant", street: "Voorbeeldstraat", houseNumber: "12",
        postcode: "1234 AB", city: "Amsterdam", country: "Nederland",
      },
      shipment: { carrier: "dhl", trackingCode: "3SDEMO1234567890", shippedAt: iso(10) },
    },
    {
      id: "ord_demo_transit",
      orderNumber: "MHP-2026-0002",
      email: "demo@example.com",
      createdAt: iso(3),
      status: "in_transit",
      paymentStatus: "paid",
      lines: [
        { productId: "pro-riding-dead", name: "Riding dead Animatronic", quantity: 1, unitPriceCents: 125000 },
      ],
      shippingCents: 0,
      shippingAddress: {
        firstName: "Demo", lastName: "Klant", street: "Voorbeeldstraat", houseNumber: "12",
        postcode: "1234 AB", city: "Amsterdam", country: "Nederland",
      },
      shipment: { carrier: "dpd", trackingCode: "05DEMO9876543210", shippedAt: iso(1) },
    },
    {
      id: "ord_demo_processing",
      orderNumber: "MHP-2026-0003",
      email: "tweede@example.com",
      createdAt: iso(1),
      status: "processing",
      paymentStatus: "paid",
      lines: [
        { productId: "scare-wolf-woman", name: "Wolf Woman", quantity: 1, unitPriceCents: 18995 },
      ],
      shippingCents: 0,
      shippingAddress: {
        firstName: "Tweede", lastName: "Klant", street: "Andereweg", houseNumber: "5",
        postcode: "5678 CD", city: "Eindhoven", country: "Nederland",
      },
      shipment: null,
    },
  ];
}

class InMemoryOrderStore implements OrderStore {
  private orders = seedOrders();
  private returns: ReturnRequest[] = [];
  private reviews: Review[] = [];

  async findByNumberAndEmail(orderNumber: string, email: string) {
    const n = orderNumber.trim().toUpperCase();
    const e = email.trim().toLowerCase();
    return this.orders.find((o) => o.orderNumber.toUpperCase() === n && o.email.toLowerCase() === e) ?? null;
  }
  async listByEmail(email: string) {
    const e = email.trim().toLowerCase();
    return this.orders.filter((o) => o.email.toLowerCase() === e);
  }
  async findById(orderId: string) {
    return this.orders.find((o) => o.id === orderId) ?? null;
  }

  async listReturnsForOrder(orderId: string) {
    return this.returns.filter((r) => r.orderId === orderId);
  }
  async createReturn(input: Omit<ReturnRequest, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const rec: ReturnRequest = { ...input, id: `ret_${Math.random().toString(36).slice(2, 10)}`, createdAt: now, updatedAt: now };
    this.returns.push(rec);
    return rec;
  }
  async updateReturnStatus(returnId: string, status: ReturnStatus) {
    const rec = this.returns.find((r) => r.id === returnId);
    if (!rec) return null;
    rec.status = status;
    rec.updatedAt = new Date().toISOString();
    return rec;
  }

  async listReviewsForOrder(orderId: string) {
    return this.reviews.filter((r) => r.orderId === orderId);
  }
  async createReview(input: Omit<Review, "id" | "createdAt">) {
    const rec: Review = { ...input, id: `rev_${Math.random().toString(36).slice(2, 10)}`, createdAt: new Date().toISOString() };
    this.reviews.push(rec);
    return rec;
  }
}

/**
 * Guard: the in-memory store must never serve real customers. If this throws in
 * production that is the intended behaviour — implement a real store first.
 */
class UnconfiguredOrderStore implements OrderStore {
  private fail(): never {
    throw new Error(
      "No order storage configured. Implement OrderStore against a real database " +
        "(see lib/orders/store.ts) before enabling the order portal in production."
    );
  }
  findByNumberAndEmail() { return this.fail(); }
  listByEmail() { return this.fail(); }
  findById() { return this.fail(); }
  listReturnsForOrder() { return this.fail(); }
  createReturn() { return this.fail(); }
  updateReturnStatus() { return this.fail(); }
  listReviewsForOrder() { return this.fail(); }
  createReview() { return this.fail(); }
}

// Module-level singleton so the fixture survives across requests in dev.
const globalForStore = globalThis as unknown as { __orderStore?: OrderStore };

export const orderStore: OrderStore =
  globalForStore.__orderStore ??
  (globalForStore.__orderStore = IS_PROD ? new UnconfiguredOrderStore() : new InMemoryOrderStore());

/** True when the portal is running on throwaway fixture data. */
export const usingFixtureData = !IS_PROD;

/**
 * True when no real storage is wired. Routes use this to answer with a clear
 * "not available yet" instead of a 500, so a visitor who finds the page while
 * it is unfinished gets an explanation rather than a crash.
 */
export const orderStorageConfigured = !IS_PROD;
