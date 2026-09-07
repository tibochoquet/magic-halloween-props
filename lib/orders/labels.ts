import type { OrderStatus, PaymentStatus, ReturnStatus } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Bestelling ontvangen",
  processing: "In behandeling",
  shipped: "Verzonden",
  in_transit: "Onderweg",
  delivered: "Afgeleverd",
  cancelled: "Geannuleerd",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Betaling in afwachting",
  paid: "Betaald",
  refunded: "Terugbetaald",
  failed: "Betaling mislukt",
};

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  requested: "Retour aangemeld",
  in_transit: "Retour onderweg",
  received: "Retour ontvangen",
  refunded: "Terugbetaling verwerkt",
  rejected: "Retour afgewezen",
};

/** Ordered steps for the return progress indicator. */
export const RETURN_STATUS_FLOW: ReturnStatus[] = ["requested", "in_transit", "received", "refunded"];

type Tone = "neutral" | "progress" | "success" | "warning";

export const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
  received: "neutral",
  processing: "progress",
  shipped: "progress",
  in_transit: "progress",
  delivered: "success",
  cancelled: "warning",
};

export const RETURN_STATUS_TONE: Record<ReturnStatus, Tone> = {
  requested: "neutral",
  in_transit: "progress",
  received: "progress",
  refunded: "success",
  rejected: "warning",
};

export const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-horror-card border-horror-border text-horror-text-secondary",
  progress: "bg-horror-orange/10 border-horror-orange/40 text-horror-orange",
  success: "bg-emerald-950/40 border-emerald-700/50 text-emerald-400",
  warning: "bg-red-950/30 border-red-700/50 text-red-400",
};

export function formatCents(cents: number): string {
  return `€${(cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}
