import type { Carrier, Shipment } from "./types";

/**
 * Carrier tracking.
 *
 * There is no DHL or DPD API integration on this project. Rather than invent
 * tracking data, this builds the public consumer tracking URL from the carrier
 * and the tracking code that the operator enters — which is what a customer
 * actually needs — and leaves a clearly marked seam for a real API later.
 */

export const CARRIER_LABELS: Record<Carrier, string> = {
  dhl: "DHL",
  dpd: "DPD",
};

/**
 * Public "track your parcel" URL. These are the carriers' own consumer
 * tracking pages; no API key or integration is required for them.
 */
export function trackingUrl(carrier: Carrier, code: string): string {
  const c = encodeURIComponent(code.trim());
  switch (carrier) {
    case "dhl":
      return `https://my.dhlecommerce.nl/home/tracktrace/${c}`;
    case "dpd":
      return `https://tracking.dpd.de/status/nl_NL/parcel/${c}`;
  }
}

/** Everything the UI needs to render the tracking block, or null if not shippable yet. */
export function trackingView(shipment: Shipment | null): {
  carrierLabel: string;
  code: string;
  url: string;
  shippedAt: string | null;
} | null {
  if (!shipment || !shipment.trackingCode) return null;
  return {
    carrierLabel: CARRIER_LABELS[shipment.carrier],
    code: shipment.trackingCode,
    url: trackingUrl(shipment.carrier, shipment.trackingCode),
    shippedAt: shipment.shippedAt,
  };
}

/**
 * TODO (external integration): live carrier status.
 *
 * When a DHL Parcel or DPD business account exists, implement this to fetch the
 * real scan history and surface it under the tracking button. Until then the
 * order's own `status` field is the source of truth and the customer follows
 * the carrier link for live detail. Do NOT synthesise scan events.
 */
export async function fetchLiveCarrierStatus(): Promise<null> {
  return null;
}
