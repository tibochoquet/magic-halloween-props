import type { Order, ReturnReason, ReturnLine } from "./types";

/**
 * Server-side validation. The UI validates too, but nothing here trusts it —
 * every API route re-validates from scratch against these functions.
 */

export type Validated<T> = { ok: true; value: T } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** MHP-2026-0001 and similar. Kept permissive but bounded. */
const ORDER_NUMBER_RE = /^[A-Z0-9][A-Z0-9-]{3,31}$/i;

export function validateLookup(body: unknown): Validated<{ orderNumber: string; email: string }> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Ongeldige aanvraag." };
  const { orderNumber, email } = body as Record<string, unknown>;

  if (typeof orderNumber !== "string" || !ORDER_NUMBER_RE.test(orderNumber.trim()))
    return { ok: false, error: "Vul een geldig bestelnummer in." };
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim()))
    return { ok: false, error: "Vul een geldig e-mailadres in." };

  return { ok: true, value: { orderNumber: orderNumber.trim(), email: email.trim().toLowerCase() } };
}

const REASONS: ReturnReason[] = ["damaged", "not_as_described", "wrong_item", "no_longer_needed", "other"];

export function validateReturn(
  body: unknown,
  order: Order
): Validated<{ lines: ReturnLine[]; reason: ReturnReason; note: string | null }> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Ongeldige aanvraag." };
  const { lines, reason, note } = body as Record<string, unknown>;

  if (!Array.isArray(lines) || lines.length === 0)
    return { ok: false, error: "Selecteer minstens één product om te retourneren." };

  const clean: ReturnLine[] = [];
  for (const raw of lines) {
    if (typeof raw !== "object" || raw === null) return { ok: false, error: "Ongeldige productselectie." };
    const { productId, quantity } = raw as Record<string, unknown>;
    if (typeof productId !== "string") return { ok: false, error: "Ongeldige productselectie." };

    // The product must actually be on this order — never trust the client.
    const orderLine = order.lines.find((l) => l.productId === productId);
    if (!orderLine) return { ok: false, error: "Dit product hoort niet bij deze bestelling." };

    const q = typeof quantity === "number" ? Math.floor(quantity) : NaN;
    if (!Number.isFinite(q) || q < 1) return { ok: false, error: "Ongeldig aantal." };
    if (q > orderLine.quantity)
      return { ok: false, error: `Je kunt maximaal ${orderLine.quantity}× ${orderLine.name} retourneren.` };

    clean.push({ productId, quantity: q });
  }

  if (typeof reason !== "string" || !REASONS.includes(reason as ReturnReason))
    return { ok: false, error: "Kies een reden voor de retour." };

  if (note !== undefined && note !== null && typeof note !== "string")
    return { ok: false, error: "Ongeldige toelichting." };
  const cleanNote = typeof note === "string" && note.trim() ? note.trim().slice(0, 2000) : null;

  return { ok: true, value: { lines: clean, reason: reason as ReturnReason, note: cleanNote } };
}

export function validateReview(
  body: unknown,
  order: Order
): Validated<{ productId: string; rating: 1 | 2 | 3 | 4 | 5; title: string; body: string; displayName: string }> {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Ongeldige aanvraag." };
  const b = body as Record<string, unknown>;

  if (typeof b.productId !== "string" || !order.lines.some((l) => l.productId === b.productId))
    return { ok: false, error: "Je kunt alleen een review schrijven voor een product uit deze bestelling." };

  const rating = typeof b.rating === "number" ? Math.floor(b.rating) : NaN;
  if (![1, 2, 3, 4, 5].includes(rating)) return { ok: false, error: "Geef een beoordeling van 1 tot 5 sterren." };

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (title.length < 3 || title.length > 100) return { ok: false, error: "Geef je review een titel van 3 tot 100 tekens." };

  const text = typeof b.body === "string" ? b.body.trim() : "";
  if (text.length < 10 || text.length > 4000) return { ok: false, error: "Schrijf een review van minimaal 10 tekens." };

  const displayName = typeof b.displayName === "string" ? b.displayName.trim() : "";
  if (displayName.length < 2 || displayName.length > 60) return { ok: false, error: "Vul een weergavenaam in." };

  return {
    ok: true,
    value: { productId: b.productId, rating: rating as 1 | 2 | 3 | 4 | 5, title, body: text, displayName },
  };
}

export const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
  damaged: "Beschadigd aangekomen",
  not_as_described: "Anders dan omschreven",
  wrong_item: "Verkeerd product ontvangen",
  no_longer_needed: "Niet meer nodig / bedenktijd",
  other: "Anders",
};
