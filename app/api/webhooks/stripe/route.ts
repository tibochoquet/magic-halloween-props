import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { company } from "@/lib/companyInfo";
import { renderOrderConfirmation, estimateDeliveryRange } from "@/lib/mailTemplate";
import { FREE_GIFT_SHORT_NAME, FREE_GIFT_THRESHOLD_EUR } from "@/lib/promotions";

/**
 * Stripe webhook endpoint. This is the ONLY place an order is considered
 * paid — never trust the success_url redirect for that, since a customer can
 * land on it without having actually paid (closed tab and reopened it,
 * shared the link, etc). Stripe signs every request with
 * STRIPE_WEBHOOK_SECRET so we can verify it really came from Stripe before
 * acting on it.
 */

// Best-effort idempotency, keyed on the SESSION, not the event.
//
// One order can arrive as two different events: with iDEAL and other
// asynchronous methods Stripe sends checkout.session.completed while the
// payment is still processing, and checkout.session.async_payment_succeeded
// once the bank confirms. Both carry the same session. Deduplicating on the
// event id would let that pair through as two orders — two confirmation mails
// for one purchase. Deduplicating on the session id also still absorbs
// Stripe's retries, which is what the event-id version was for.
//
// In-memory only: resets on a cold start and isn't shared across instances.
// There's no database in this project yet; if duplicates ever show up in
// practice, move this to something like Vercel KV/Upstash.
const fulfilledSessionIds = new Map<string, true>();
const MAX_TRACKED_SESSIONS = 500;

function alreadyFulfilled(sessionId: string): boolean {
  if (fulfilledSessionIds.has(sessionId)) return true;
  fulfilledSessionIds.set(sessionId, true);
  if (fulfilledSessionIds.size > MAX_TRACKED_SESSIONS) {
    const oldest = fulfilledSessionIds.keys().next().value;
    if (oldest) fulfilledSessionIds.delete(oldest);
  }
  return false;
}

/**
 * Sends both order mails. Only ever called for a session Stripe has confirmed
 * as paid, and only once per session.
 */
async function fulfillOrder(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (alreadyFulfilled(session.id)) {
    console.log("Stripe webhook: sessie al afgehandeld, geen tweede mail.", session.id);
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

  // Two separate emails, both best-effort: a failure in one must not block the
  // other, and neither may fail the webhook response (Stripe would keep
  // retrying an already-paid order forever otherwise — the payment itself is
  // already safely recorded on Stripe's side).
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

  switch (event.type) {
    // With a card this fires already paid. With iDEAL and other asynchronous
    // methods it fires while the payment is still processing — fulfilling then
    // would mail a confirmation for money that may never arrive.
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") {
        console.log(
          "Stripe webhook: sessie afgerond maar nog niet betaald, wachten op async_payment_succeeded.",
          { sessionId: session.id, paymentStatus: session.payment_status }
        );
        break;
      }
      await fulfillOrder(stripe, session);
      break;
    }

    // The bank confirmed an asynchronous payment (iDEAL, SEPA). On mobile the
    // customer often never returns to the site, so this event — not the
    // success page — is what turns the payment into an order.
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillOrder(stripe, session);
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

      ${
        session.metadata?.freeGift
          ? `<p style="font-size:14px;color:#FF6B00;margin-top:20px;font-weight:600;">
               &#127875; Gratis ${FREE_GIFT_SHORT_NAME} bijpakken (actie vanaf €${FREE_GIFT_THRESHOLD_EUR})
             </p>`
          : ""
      }
      <p style="font-size:13px;color:#FF6B00;margin-top:20px;">
        Betaling ontvangen via Stripe. Klaar om te verpakken en te verzenden.
      </p>
    </div>
  `;

  await sendEmail({
    from: `${company.tradeName} <${company.mailFrom}>`,
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
    items: lineItems.map((li) => {
      // De cadeauregel zet de checkout op €0; session.metadata.freeGift zegt
      // dat deze bestelling er een heeft (app/api/checkout/route.ts).
      const isGift = Boolean(session.metadata?.freeGift) && (li.amount_total ?? 0) === 0;
      return {
        name: isGift ? `Gratis: ${FREE_GIFT_SHORT_NAME}` : li.description ?? "Product",
        quantity: li.quantity ?? 1,
        amountEur: (li.amount_total ?? 0) / 100,
        gratis: isGift,
      };
    }),
    totaalEur: (session.amount_total ?? 0) / 100,
    verzendadres: formatShippingAddress(session),
  });

  await sendEmail({
    from: `${company.tradeName} <${company.mailFrom}>`,
    to: customerEmail,
    replyTo: company.email,
    subject: `Je bestelling bij ${company.tradeName} — ${orderRef}`,
    html,
  });
}
