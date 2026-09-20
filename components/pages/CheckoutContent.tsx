"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CategoryIcon from "@/components/ui/CategoryIcon";
import FreeGiftNotice from "@/components/ui/FreeGiftNotice";
import { deliveryTerms, WITHDRAWAL_DAYS, VAT_RATE } from "@/lib/shopTerms";
import { cartSubtotalCents } from "@/lib/promotions";

/**
 * REAL PAYMENT FLOW via Stripe Checkout.
 *
 * Replaces the earlier "order request via mailto" flow now that a payment
 * provider is wired up (see app/api/checkout/route.ts). The final button
 * must read "Bestellen met betalingsverplichting" (or equally unambiguous
 * wording) per art. 6:230v BW, since clicking it starts the real payment
 * flow. Name, address and payment details are collected on Stripe's own
 * hosted Checkout page (shipping_address_collection in the API route) —
 * deliberately not duplicated here.
 */
export default function CheckoutContent() {
  const { items, totalPrice, totalItems, blockedItems } = useCart();
  const { language } = useLanguage();
  const nl = language === "nl";

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = 0;
  const total = totalPrice + shipping;

  async function handleCheckout() {
    if (!acceptedTerms || blockedItems.length > 0 || items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ product, quantity }) => ({ id: product.id, quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? (nl ? "Kon checkout niet starten." : "Could not start checkout."));
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(nl ? "Kon checkout niet starten. Probeer het opnieuw." : "Could not start checkout. Please try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <p className="text-horror-text-muted text-sm tracking-wide">
          {nl ? "Je winkelwagen is leeg." : "Your cart is empty."}
        </p>
        <Link href="/shop" className="btn-primary">
          {nl ? "Terug naar de shop" : "Back to shop"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-24">
      {/* Blocked items — hard stop. */}
      {blockedItems.length > 0 && (
        <div className="mb-10 p-4 md:p-5 border border-red-700/50 bg-red-950/20">
          <p className="font-cinzel text-sm font-bold text-red-400 mb-1.5">
            {nl ? "Niet-leverbare producten in je winkelwagen" : "Unavailable products in your cart"}
          </p>
          <ul className="text-horror-text-secondary text-sm space-y-1">
            {blockedItems.map(({ product }) => (
              <li key={product.id}>
                {product.name} — {product.availabilityNote ?? (nl ? "niet beschikbaar" : "unavailable")}
              </li>
            ))}
          </ul>
          <p className="text-horror-text-muted text-xs mt-2">
            {nl ? "Verwijder deze uit je winkelwagen om verder te gaan." : "Remove these from your cart to continue."}
          </p>
        </div>
      )}

      <h1 className="font-cinzel text-2xl font-bold text-horror-text-primary mb-8">
        {nl ? "Afrekenen" : "Checkout"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-cinzel text-xl font-bold text-horror-text-primary mb-6">
            {nl ? "Jouw bestelling" : "Your order"}
          </h2>
          <ul className="space-y-4 mb-8">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 p-4 bg-horror-card border border-horror-border">
                <div className={`relative w-16 h-16 flex-shrink-0 bg-gradient-to-br ${product.bgGradient} flex items-center justify-center overflow-hidden`}>
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="64px" />
                  ) : (
                    <div className="text-horror-text-muted/30"><CategoryIcon id={product.category} size={28} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-sm font-bold text-horror-text-primary leading-snug line-clamp-2">{product.name}</p>
                  <p className="text-horror-text-muted text-xs mt-1">{nl ? "Aantal" : "Qty"}: {quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-horror-text-primary">
                    €{(product.price * quantity).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-horror-text-muted text-xs mt-0.5">
                    €{product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} / {nl ? "stuk" : "pc"}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mb-8">
            <FreeGiftNotice
              subtotalCents={cartSubtotalCents(
                items.map(({ product, quantity }) => ({ price: product.price, quantity }))
              )}
            />
          </div>

          <p className="text-horror-text-muted text-xs leading-relaxed mb-6">
            {nl
              ? "Je vult je naam, adres en betaalgegevens in op de beveiligde betaalpagina van Stripe in de volgende stap."
              : "You'll fill in your name, address and payment details on Stripe's secure payment page in the next step."}
          </p>

          {/* Terms must be actively accepted, never pre-ticked */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              className="mt-0.5 accent-horror-orange w-4 h-4 flex-shrink-0"
            />
            <span className="text-horror-text-secondary text-sm leading-relaxed">
              {nl ? "Ik ga akkoord met de " : "I agree to the "}
              <Link href="/algemene-voorwaarden" className="text-horror-orange hover:underline">
                {nl ? "algemene voorwaarden" : "terms and conditions"}
              </Link>
              {nl ? " en het " : " and the "}
              <Link href="/privacy" className="text-horror-orange hover:underline">
                {nl ? "privacybeleid" : "privacy policy"}
              </Link>
              {nl
                ? `, en ik weet dat ik ${WITHDRAWAL_DAYS} dagen bedenktijd heb.`
                : `, and I understand I have ${WITHDRAWAL_DAYS} days to withdraw.`}
            </span>
          </label>

          {error && (
            <p className="text-red-400 text-sm mb-4" role="alert">{error}</p>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!acceptedTerms || blockedItems.length > 0 || loading}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? (nl ? "Bezig..." : "Loading...")
              : (nl ? "Bestellen met betalingsverplichting" : "Order with obligation to pay")}
            {!loading && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )}
          </button>
          <p className="text-horror-text-muted text-xs text-center mt-3 leading-relaxed">
            {nl
              ? "Je wordt doorgestuurd naar Stripe om veilig te betalen (iDEAL, creditcard en meer)."
              : "You'll be redirected to Stripe to pay securely (iDEAL, card and more)."}
          </p>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-horror-card border border-horror-border p-6 sticky top-28">
            <h3 className="font-cinzel text-xs font-bold tracking-widest uppercase text-horror-text-primary mb-5">
              {nl ? "Bestelling" : "Order"} ({totalItems})
            </h3>
            <ul className="space-y-3 mb-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between text-sm gap-3">
                  <span className="text-horror-text-secondary leading-snug line-clamp-2 flex-1">
                    {quantity}× {product.name}
                  </span>
                  <span className="text-horror-text-primary font-medium flex-shrink-0">
                    €{(product.price * quantity).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-horror-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-horror-text-muted">
                <span>{nl ? "Subtotaal" : "Subtotal"}</span>
                <span>€{totalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-horror-text-muted">
                <span>{nl ? "Verzending" : "Shipping"}</span>
                <span className="text-horror-orange">{nl ? "Gratis" : "Free"}</span>
              </div>
              <div className="flex justify-between font-bold text-horror-text-primary text-base pt-2 border-t border-horror-border">
                <span>{nl ? "Totaal" : "Total"}</span>
                <span>€{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-horror-text-muted text-xs">
                {nl ? `Inclusief btw (${VAT_RATE * 100}%)` : `Including VAT (${VAT_RATE * 100}%)`}
              </p>
              <p className="text-horror-text-muted text-xs pt-2 border-t border-horror-border">
                {nl ? "Levertijd" : "Delivery"}:{" "}
                {deliveryTerms.inStock ?? (nl ? "in overleg" : "to be confirmed")}
              </p>
            </div>

            <div className="mt-5 pt-5 border-t border-horror-border space-y-2 text-xs text-horror-text-muted">
              <div className="flex items-center gap-2">
                <span className="text-horror-orange">↩</span>
                <span>
                  <Link href="/retourneren" className="hover:text-horror-orange transition-colors">
                    {nl ? `${WITHDRAWAL_DAYS} dagen bedenktijd` : `${WITHDRAWAL_DAYS}-day withdrawal right`}
                  </Link>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-horror-orange">🚚</span>
                <span>
                  <Link href="/verzending" className="hover:text-horror-orange transition-colors">
                    {nl ? "Verzending en levering" : "Shipping and delivery"}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
