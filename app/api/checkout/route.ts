import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { randomBytes } from "crypto";
import { getStripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products";
import { isOrderable } from "@/lib/availability";
import {
  cartSubtotalCents,
  getFreeGiftProduct,
  priceToCents,
  qualifiesForFreeGift,
} from "@/lib/promotions";

/**
 * Creates a Stripe Checkout Session for a one-time order and returns its
 * URL. The client only ever sends product ids + quantities — prices are
 * always resolved server-side from lib/products.ts, never trusted from the
 * request body. This is what stops someone from tampering with the price in
 * devtools before checking out. Availability is re-checked here too, since a
 * disabled "add to cart" button only stops the normal UI path, not a direct
 * POST here.
 */

interface CheckoutItem {
  id: string;
  quantity: number;
}

const MAX_QUANTITY_PER_ITEM = 10;

export async function POST(req: NextRequest) {
  let body: { items?: CheckoutItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Winkelwagen is leeg." }, { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const paidLines: { price: number; quantity: number }[] = [];
  const origin = req.nextUrl.origin;

  for (const item of items) {
    if (typeof item?.id !== "string" || typeof item?.quantity !== "number") {
      return NextResponse.json({ error: "Ongeldig item in winkelwagen." }, { status: 400 });
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: `Ongeldig aantal voor product ${item.id}.` }, { status: 400 });
    }

    const product = getProductById(item.id);
    if (!product) {
      return NextResponse.json({ error: `Product niet gevonden: ${item.id}` }, { status: 400 });
    }
    if (!isOrderable(product)) {
      return NextResponse.json(
        { error: `Niet leverbaar: ${product.name}${product.availabilityNote ? ` — ${product.availabilityNote}` : ""}` },
        { status: 409 }
      );
    }

    paidLines.push({ price: product.price, quantity: item.quantity });

    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: priceToCents(product.price),
        product_data: {
          name: product.name,
          ...(product.image ? { images: [new URL(product.image, origin).toString()] } : {}),
          metadata: { productId: product.id },
        },
      },
    });
  }

  // The €300 gift is decided here, never by the client: the cart that arrives
  // is only ids + quantities, and the subtotal is recomputed from catalogue
  // prices above. The shop UI shows the same outcome via lib/promotions.ts.
  const subtotalCents = cartSubtotalCents(paidLines);
  const freeGift = qualifiesForFreeGift(subtotalCents) ? getFreeGiftProduct() : undefined;

  if (freeGift) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: 0,
        product_data: {
          name: `${freeGift.name} — gratis cadeau`,
          ...(freeGift.image ? { images: [new URL(freeGift.image, origin).toString()] } : {}),
          metadata: { productId: freeGift.id, freeGift: "true" },
        },
      },
    });
  }

  // Random suffix (not just the timestamp) so an order reference can't be
  // guessed from roughly when someone ordered.
  const orderRef = `MHP-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      locale: "nl",
      line_items,
      // Checkout Sessions don't have an `automatic_payment_methods` param
      // (that's a PaymentIntents-only field) — omitting `payment_method_types`
      // entirely gets the same effect: Stripe shows every payment method
      // enabled for this currency/country in the Dashboard (iDEAL, cards, ...)
      // without listing them here by hand.
      shipping_address_collection: { allowed_countries: ["NL", "BE"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Verzending",
            // Vast tarief van €0 — in lijn met de "Gratis verzending" die
            // overal op de site staat.
            fixed_amount: { amount: 0, currency: "eur" },
          },
        },
      ],
      // Geen automatic_tax: de weergegeven prijzen zijn al btw-inclusief
      // (verplicht bij consumentenprijzen), dus er hoeft niets bovenop het
      // bedrag berekend te worden. Zie lib/shopTerms.ts (VAT_RATE).
      success_url: `${origin}/checkout/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/geannuleerd`,
      metadata: { orderRef, ...(freeGift ? { freeGift: freeGift.id } : {}) },
    });

    if (!session.url) {
      console.error("Checkout: Stripe gaf geen session.url terug.", session.id);
      return NextResponse.json({ error: "Kon checkout niet starten." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout: aanmaken van Stripe session mislukt:", err);
    return NextResponse.json({ error: "Kon checkout niet starten." }, { status: 500 });
  }
}
