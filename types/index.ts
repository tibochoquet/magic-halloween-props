export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  // No `rating` / `reviews` here on purpose: a star score on a product may
  // only come from reviews that real customers actually left (EU Omnibus,
  // 2022). The shop has no such data yet, so products carry none.
  description: string;
  badge?: "BESTSELLER" | "NEW" | "PREMIUM" | "EXTREME" | "LIMITED";
  availability: "in_stock" | "unavailable";
  availabilityNote?: string;
  notifyOnRestock?: boolean;
  featured?: boolean;
  height?: string;
  powerSource?: string;
  features: string[];
  accentColor: string;
  bgGradient: string;
  iconEmoji: string;
  image?: string;
  video?: string;
  /** Additional gallery images beyond the primary `image`. */
  images?: string[];
  /** Additional gallery videos beyond the primary `video`. */
  videos?: string[];
  /** Dedicated cinematic promotional hero image for this product (distinct from gallery `image`). */
  heroImage?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  // No `itemCount` here: how many products a category holds is derived from
  // the product data in lib/catalogue.ts, so it can never drift from reality.
  bgGradient: string;
  accentColor: string;
  icon: string;
}

/**
 * A review from a real customer.
 *
 * Nothing may be listed here that a customer did not actually say: inventing
 * or embellishing reviews is banned under the EU Omnibus directive (2022).
 * `source` and `date` are mandatory precisely so every quote on the site can
 * be traced back to where it came from, and both are rendered with the quote.
 */
export interface Testimonial {
  id: string;
  /** Name exactly as the customer gave it. */
  name: string;
  /** Place the customer gave, e.g. "Eindhoven, Nederland". */
  place: string;
  /** The review itself, in the customer's own words. */
  text: string;
  /** Where it came from, e.g. "email", "Google reviews". */
  source: string;
  /** ISO date (YYYY-MM-DD) on which the customer gave the review. */
  date: string;
  /** Only true when the purchase was actually verified in the order records. */
  verifiedPurchase: boolean;
}

export interface NavLink {
  id: "shop" | "categories" | "about" | "contact";
  href: string;
}
