import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import type { Order } from "./types";

/**
 * Order-access grants.
 *
 * A guest who proves they know order number + email is issued a short-lived,
 * signed, httpOnly cookie scoped to THAT order id. Every subsequent API call
 * re-verifies the grant server-side; the client never states which order it is
 * allowed to see. This is what stops one customer opening another's order.
 *
 * This is deliberately NOT a general login system. When real customer accounts
 * are added (next-auth or similar), `currentCustomerEmail()` below becomes the
 * integration point and the rest of the routes keep working unchanged.
 */

const COOKIE = "mhp_order_grant";
const MAX_AGE_SECONDS = 60 * 60 * 2; // 2 hours

function secret(): string {
  const s = process.env.ORDER_GRANT_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    // Never fall back to a guessable secret in production.
    throw new Error("ORDER_GRANT_SECRET is not set. Order access cannot be secured.");
  }
  // Dev-only, stable for the process so grants survive hot reloads.
  const g = globalThis as unknown as { __devGrantSecret?: string };
  return (g.__devGrantSecret ??= randomBytes(32).toString("hex"));
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

type GrantPayload = { orderIds: string[]; exp: number };

function encode(p: GrantPayload): string {
  const body = Buffer.from(JSON.stringify(p)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): GrantPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (!safeEqual(sig, sign(body))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as GrantPayload;
    if (!Array.isArray(p.orderIds) || typeof p.exp !== "number") return null;
    if (Date.now() > p.exp) return null;
    return p;
  } catch {
    return null;
  }
}

/** Grant access to a specific set of orders, replacing any previous grant. */
export function grantOrderAccess(orderIds: string[]): void {
  const token = encode({ orderIds, exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearOrderAccess(): void {
  cookies().delete(COOKIE);
}

/** Order ids the current visitor has proven access to. */
export function grantedOrderIds(): string[] {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return [];
  return decode(raw)?.orderIds ?? [];
}

export function hasAccessTo(orderId: string): boolean {
  return grantedOrderIds().includes(orderId);
}

/**
 * Authorisation gate used by every order API route.
 * Returns the order only when the caller has proven access to it.
 */
export function authoriseOrder(order: Order | null): Order | null {
  if (!order) return null;
  return hasAccessTo(order.id) ? order : null;
}

/**
 * TODO (integration point): when real customer accounts exist, return the
 * signed-in customer's email here. `listByEmail` then powers the "my orders"
 * overview without the guest lookup. Returns null while there is no auth.
 */
export async function currentCustomerEmail(): Promise<string | null> {
  return null;
}
