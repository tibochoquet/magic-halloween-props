import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";
import { company } from "@/lib/companyInfo";
import { renderOrderConfirmation, estimateDeliveryRange } from "@/lib/mailTemplate";

/**
 * Stripe webhook endpoint. This is the ONLY place an order is considered
 * paid — never trust the success_url redirect for that, since a customer can
 * land on it without having actually paid (closed tab and reopened it,
 * shared the link, etc). Stripe signs every request with
 * STRIPE_WEBHOOK_SECRET so we can verify it really came from Stripe before
 * acting on it.
 */

// Best-effort idempotency: skip an event id we've already processed, so a
// duplicate webhook delivery (Stripe retries on anything but a fast 2xx, and
// can occasionally double-deliver even on success) doesn't send two order
// emails. In-memory only — resets on a cold start and isn't shared across
// instances. There's no database in this project yet; if that becomes a
// problem, move this to something like Vercel KV/Upstash.
const processedEventIds = new Map<string, true>();
const MAX_TRACKED_EVENTS = 500;

function alreadyProcessed(eventId: string): boolean {
  if (processedEventIds.has(eventId)) return true;
  processedEventIds.set(eventId, true);
  if (processedEventIds.size > MAX_TRACKED_EVENTS) {
    const oldest = processedEventIds.keys().next().value;
    if (oldest) processedEventIds.delete(oldest);
  }
  return false;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe webhook: STRIPE_WEBHOOK_SECRET ontbreekt.");
    return NextResponse.json({ error: "Niet geconfigureerd" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Ontbrekende handtekening" }, { status: 400 });
  }

  // Raw text, NOT req.json() — signature verification is over the exact
  // bytes Stripe sent, and JSON.parse -> re-stringify would not reproduce
  // that byte-for-byte.
  const rawBody = await req.text();

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook: handtekening ongeldig:", err);
    return NextResponse.json({ error: "Ongeldige handtekening" }, { status: 400 });
  }

  if (alreadyProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      // Two separate emails, both best-effort: a failure in one must not
      // block the other, and neither may fail the webhook response (Stripe
      // would keep retrying an already-paid order forever otherwise — the
      // payment itself is already safely recorded on Stripe's side).
      try {
        await sendOwnerNotificationEmail(session, lineItems.data);
      } catch (err) {
        console.error("Stripe webhook: interne orderbevestiging versturen mislukt:", err);
      }
      try {
        await sendCustomerConfirmationEmail(session, lineItems.data);
      } catch (err) {
        console.error("Stripe webhook: klantbevestiging versturen mislukt:", err);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error("Stripe: betaling mislukt", {
        paymentIntentId: paymentIntent.id,
        reason: paymentIntent.last_payment_error?.message,
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function sendResendEmail(payload: Parameters<Resend["emails"]["send"]>[0]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Stripe webhook: RESEND_API_KEY ontbreekt, e-mail niet verstuurd.");
    return;
  }
  const resend = new Resend(apiKey);
  // resend.emails.send() does NOT throw on failure — it resolves with
  // { data: null, error } (e.g. an invalid API key just comes back as a
  // normal, non-throwing response). A try/catch around the call alone
  // would silently miss that, so the error has to be checked explicitly.
  const { error } = await resend.emails.send(payload);
  if (error) {
    throw new Error(`Resend gaf een fout terug: ${error.message}`);
  }
}

function formatShippingAddress(session: Stripe.Checkout.Session): string {
  const shipping = session.collected_information?.shipping_details;
  if (!shipping?.address) return "Geen verzendadres ontvangen";
  const { line1, line2, postal_code, city, country } = shipping.address;
  return [shipping.name, [line1, line2].filter(Boolean).join(" "), [postal_code, city].filter(Boolean).join(" "), country]
    .filter(Boolean)
    .join("\n");
}

function itemRowsHtml(lineItems: Stripe.LineItem[]): string {
  return lineItems
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #333;font-size:13px;color:#E8E8E8;">${item.description}</td>
          <td style="padding:8px 0;border-bottom:1px solid #333;font-size:13px;color:#9CA3AF;text-align:center;">×${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #333;font-size:13px;color:#E8E8E8;text-align:right;">€${((item.amount_total ?? 0) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join("");
}

/** Internal notification to the shop owner. */
async function sendOwnerNotificationEmail(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
  const orderRef = session.metadata?.orderRef ?? session.id;
  const total = (session.amount_total ?? 0) / 100;
  const customer = session.customer_details;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0A0A;color:#E8E8E8;padding:24px;">
      <h2 style="color:#FF6B00;margin-bottom:4px;">Betaalde bestelling ${orderRef}</h2>
      <p style="color:#9CA3AF;margin-top:0;font-size:14px;">${company.tradeName} — via Stripe Checkout</p>

      <h3 style="font-size:14px;color:#E8E8E8;margin-bottom:8px;">Klant</h3>
      <p style="font-size:14px;color:#9CA3AF;margin:0;">
        ${customer?.name ?? "Onbekend"}<br/>
        ${customer?.email ? `<a href="mailto:${customer.email}" style="color:#FF6B00;">${customer.email}</a>` : ""}
        ${customer?.phone ? `<br/>${customer.phone}` : ""}
      </p>

      <h3 style="font-size:14px;color:#E8E8E8;margin-top:20px;margin-bottom:8px;">Verzendadres</h3>
      <p style="font-size:14px;color:#9CA3AF;margin:0;white-space:pre-line;">${formatShippingAddress(session)}</p>

      <h3 style="font-size:14px;color:#E8E8E8;margin-top:20px;margin-bottom:8px;">Producten</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${itemRowsHtml(lineItems)}</tbody>
      </table>

      <table style="width:100%;margin-top:12px;">
        <tr>
          <td style="font-size:15px;font-weight:600;padding-top:8px;color:#E8E8E8;">Totaal</td>
          <td style="font-size:15px;font-weight:600;text-align:right;padding-top:8px;color:#E8E8E8;">€${total.toFixed(2)}</td>
        </tr>
      </table>

      <p style="font-size:13px;color:#FF6B00;margin-top:20px;">
        Betaling ontvangen via Stripe. Klaar om te verpakken en te verzenden.
      </p>
    </div>
  `;

  await sendResendEmail({
    from: `${company.tradeName} <${company.orderConfirmationFrom}>`,
    // company.email is the legal/customer-facing contact; the second address
    // is the operator's own inbox, added purely so they get notified that an
    // order came in.
    to: [company.email, "lifegoods.daily@gmail.com"],
    replyTo: customer?.email ?? undefined,
    subject: `Betaalde bestelling ${orderRef}, €${total.toFixed(2)}`,
    html,
  });
}

/**
 * Customer-facing order confirmation, rendered from
 * emails/order-confirmation.html. Includes the herroepingsrecht (14-day
 * withdrawal right) and business-identity footer required by art. 6:230v
 * BW. Nothing else in this codebase emails the customer after a Stripe
 * payment — the on-site /checkout/succes page alone is not a substitute.
 */
async function sendCustomerConfirmationEmail(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
  const customerEmail = session.customer_details?.email;
  if (!customerEmail) return;

  const orderRef = session.metadata?.orderRef ?? session.id;
  const firstName = session.customer_details?.name?.trim().split(/\s+/)[0] || "daar";

  const html = renderOrderConfirmation({
    voornaam: firstName,
    bestelnummer: orderRef,
    leverdatum: estimateDeliveryRange(),
    items: lineItems.map((li) => ({
      name: li.description ?? "Product",
      quantity: li.quantity ?? 1,
      amountEur: (li.amount_total ?? 0) / 100,
    })),
    totaalEur: (session.amount_total ?? 0) / 100,
    verzendadres: formatShippingAddress(session),
  });

  await sendResendEmail({
    from: `${company.tradeName} <${company.orderConfirmationFrom}>`,
    to: customerEmail,
    replyTo: company.email,
    subject: `Je bestelling bij ${company.tradeName} — ${orderRef}`,
    html,
  });
}
