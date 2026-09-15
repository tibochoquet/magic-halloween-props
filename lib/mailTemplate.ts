import { readFileSync } from "fs";
import path from "path";
import { company, entityLine, addressLineFull } from "./companyInfo";
import { SITE_URL } from "./site";
import { WITHDRAWAL_DAYS, deliveryTerms } from "./shopTerms";

const TEMPLATE_PATH = path.join(process.cwd(), "emails", "order-confirmation.html");

export type OrderConfirmationLine = {
  name: string;
  quantity: number;
  /** Line total in EUR, VAT-inclusive. */
  amountEur: number;
};

interface OrderConfirmationValues {
  voornaam: string;
  bestelnummer: string;
  leverdatum: string;
  items: OrderConfirmationLine[];
  totaalEur: number;
  /** Multi-line shipping address, already formatted. */
  verzendadres: string;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function euro(amount: number): string {
  return `€${amount.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`;
}

function itemsRowsHtml(items: OrderConfirmationLine[]): string {
  return items
    .map(
      (item) => `
          <tr>
            <td style="padding:12px 0; font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#E8E8E8; border-bottom:1px solid rgba(255,107,0,0.18);">${escapeHtml(item.name)}</td>
            <td align="center" style="padding:12px 0; font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#9CA3AF; border-bottom:1px solid rgba(255,107,0,0.18);">${item.quantity}</td>
            <td align="right" style="padding:12px 0; font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#E8E8E8; border-bottom:1px solid rgba(255,107,0,0.18);">${euro(item.amountEur)}</td>
          </tr>`
    )
    .join("");
}

/**
 * Renders emails/order-confirmation.html with real order data. Every
 * customer-supplied field (name, shipping address) is HTML-escaped before
 * being spliced in — this is the one email a paying stranger can steer the
 * content of (via their Stripe Checkout shipping name/address).
 */
export function renderOrderConfirmation(values: OrderConfirmationValues): string {
  let html = readFileSync(TEMPLATE_PATH, "utf8");

  const retourneringUrl = `${SITE_URL}/retourneren`;
  const retourneringHost = SITE_URL.replace(/^https?:\/\//, "");

  const replacements: Record<string, string> = {
    "{{voornaam}}": escapeHtml(values.voornaam),
    "{{bestelnummer}}": escapeHtml(values.bestelnummer),
    "{{leverdatum}}": escapeHtml(values.leverdatum),
    "{{items_rows}}": itemsRowsHtml(values.items),
    "{{totaal}}": euro(values.totaalEur),
    "{{verzendadres}}": escapeHtml(values.verzendadres),
    "{{contact_email}}": escapeHtml(company.email),
    "{{herroepingsrecht_dagen}}": String(WITHDRAWAL_DAYS),
    "{{retourneren_url}}": retourneringUrl,
    "{{retourneren_host}}": escapeHtml(retourneringHost),
    "{{site_url}}": SITE_URL,
    "{{entiteit}}": escapeHtml(entityLine),
    "{{adres}}": escapeHtml(addressLineFull),
    "{{kvk}}": escapeHtml(company.kvk),
    "{{btw}}": escapeHtml(company.vatId ?? "n.v.t."),
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.split(placeholder).join(value);
  }

  return html;
}

/** The site's own stated delivery term for in-stock items (see /verzending). */
export function estimateDeliveryRange(): string {
  return deliveryTerms.inStock ?? "op aanvraag";
}
