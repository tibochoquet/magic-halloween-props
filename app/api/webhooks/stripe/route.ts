import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe webhook endpoint. This is the ONLY place an order is considered
 * paid — never trust the success_url redirect for that, since a customer can
 * land on it without having actually paid (closed tab and reopened it,
 * shared the link, etc). Stripe signs every request with
 * STRIPE_WEBHOOK_SECRET so we can verify it really came from Stripe before
 * acting on it.
 *
 * NOTE: there is no order-confirmation email wired up yet (no email sender
 * configured for this project) — a paid order is currently only recorded in
 * the Stripe Dashboard and these server logs. Wire a confirmation email
 * (mirroring daily-pet-goods' Resend-based one, which includes the 14-day
 * withdrawal right and business identity required by art. 6:230v BW) before
 * relying on this alone for customer communication.
 */

// Best-effort idempotency: skip an event id we've already processed, so a
// duplicate webhook delivery (Stripe retries on anything but a fast 2xx, and
// can occasionally double-deliver even on success) doesn't process an order
// twice. In-memory only — resets on a cold start and isn't shared across
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
      const orderRef = session.metadata?.orderRef ?? session.id;

      console.log("Betaalde bestelling:", {
        orderRef,
        total: (session.amount_total ?? 0) / 100,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        shipping: session.collected_information?.shipping_details,
        items: lineItems.data.map((li) => ({ name: li.description, quantity: li.quantity, amount: (li.amount_total ?? 0) / 100 })),
      });
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
