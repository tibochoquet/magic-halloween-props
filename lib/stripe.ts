import Stripe from "stripe";

/**
 * Server-only Stripe client. Never import this from a Client Component.
 *
 * Instantiated lazily (on first call, then cached) rather than at module
 * load time, so a missing STRIPE_SECRET_KEY fails the specific request that
 * needs it instead of breaking the build or every unrelated route.
 */
let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY ontbreekt. Zet hem in .env.local (zie .env.example).");
    }
    stripe = new Stripe(secretKey);
  }
  return stripe;
}
