"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CategoryIcon from "@/components/ui/CategoryIcon";

const IDEAL_BANKS = [
  "ABN AMRO", "ING", "Rabobank", "SNS Bank", "ASN Bank", "Bunq", "Revolut",
];

const PAYMENT_METHODS = [
  { id: "ideal", label: "iDEAL", flag: "🇳🇱" },
  { id: "card", label: "Creditcard / Debitcard", flag: "💳" },
  { id: "paypal", label: "PayPal", flag: "🅿" },
  { id: "bancontact", label: "Bancontact", flag: "🇧🇪" },
];

type Step = "cart" | "details" | "payment" | "confirm";

export default function CheckoutContent() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { language } = useLanguage();
  const nl = language === "nl";

  const [step, setStep] = useState<Step>("cart");
  const [method, setMethod] = useState("ideal");
  const [bank, setBank] = useState(IDEAL_BANKS[0]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", houseNumber: "", city: "", postcode: "", country: "Nederland",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      clearCart();
    }, 1200);
  }

  const shipping = totalPrice >= 500 ? 0 : 14.95;
  const total = totalPrice + shipping;

  if (items.length === 0 && !submitted) {
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center max-w-lg mx-auto px-5">
        <div className="w-20 h-20 border-2 border-horror-orange flex items-center justify-center text-horror-orange">
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-cinzel text-3xl font-bold text-horror-text-primary">
          {nl ? "Bestelling geplaatst!" : "Order placed!"}
        </h2>
        <p className="text-horror-text-secondary text-base leading-relaxed">
          {nl
            ? `Bedankt voor je bestelling, ${form.firstName}. Je ontvangt een bevestiging op ${form.email}. We nemen contact met je op voor verdere afhandeling.`
            : `Thank you for your order, ${form.firstName}. You'll receive a confirmation at ${form.email}. We'll contact you shortly.`}
        </p>
        <p className="text-horror-text-muted text-sm">
          {nl ? "Vragen? Mail ons op " : "Questions? Email us at "}
          <a href="mailto:info@allseasontoys.nl" className="text-horror-orange hover:underline">
            info@allseasontoys.nl
          </a>
        </p>
        <Link href="/shop" className="btn-outline mt-4">
          {nl ? "Verder winkelen" : "Continue shopping"}
        </Link>
      </div>
    );
  }

  const steps: { id: Step; label: string }[] = [
    { id: "cart", label: nl ? "Overzicht" : "Summary" },
    { id: "details", label: nl ? "Gegevens" : "Details" },
    { id: "payment", label: nl ? "Betalen" : "Payment" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-24">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-12">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => step !== "payment" && setStep(s.id)}
              className={`flex items-center gap-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
                step === s.id ? "text-horror-orange" : "text-horror-text-muted"
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center border text-[10px] font-bold transition-colors duration-200 ${
                step === s.id ? "border-horror-orange text-horror-orange" : "border-horror-border text-horror-text-muted"
              }`}>
                {i + 1}
              </span>
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <div className="w-8 h-px bg-horror-border mx-3" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* STEP 1: Cart overview */}
          {step === "cart" && (
            <div>
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
              <button onClick={() => setStep("details")} className="btn-primary w-full justify-center">
                {nl ? "Doorgaan naar gegevens" : "Continue to details"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}

          {/* STEP 2: Customer details */}
          {step === "details" && (
            <div>
              <h2 className="font-cinzel text-xl font-bold text-horror-text-primary mb-6">
                {nl ? "Jouw gegevens" : "Your details"}
              </h2>
              <form id="details-form" onSubmit={(e) => { e.preventDefault(); setStep("payment"); }} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Voornaam" : "First name"}</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder={nl ? "Jan" : "John"} className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Achternaam" : "Last name"}</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder={nl ? "de Vries" : "Smith"} className="input-horror" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">E-mail</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jan@email.nl" className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Telefoon" : "Phone"}</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+31 6 12345678" className="input-horror" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Straat" : "Street"}</label>
                    <input name="street" value={form.street} onChange={handleChange} required placeholder={nl ? "Voorbeeldstraat" : "Example Street"} className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Huisnr." : "Number"}</label>
                    <input name="houseNumber" value={form.houseNumber} onChange={handleChange} required placeholder="12A" className="input-horror" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Postcode" : "Postcode"}</label>
                    <input name="postcode" value={form.postcode} onChange={handleChange} required placeholder="1234 AB" className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Stad" : "City"}</label>
                    <input name="city" value={form.city} onChange={handleChange} required placeholder={nl ? "Amsterdam" : "Amsterdam"} className="input-horror" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Opmerkingen (optioneel)" : "Notes (optional)"}</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder={nl ? "Bezorgingsinstructies of opmerkingen..." : "Delivery instructions or notes..."} className="input-horror resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  {nl ? "Doorgaan naar betaling" : "Continue to payment"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === "payment" && (
            <form onSubmit={handleOrder}>
              <h2 className="font-cinzel text-xl font-bold text-horror-text-primary mb-6">
                {nl ? "Betaalmethode" : "Payment method"}
              </h2>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors duration-200 ${
                      method === m.id ? "border-horror-orange/60 bg-horror-orange/5" : "border-horror-border hover:border-horror-border/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="accent-horror-orange"
                    />
                    <span className="text-lg">{m.flag}</span>
                    <span className="text-horror-text-primary text-sm font-medium">{m.label}</span>
                  </label>
                ))}
              </div>

              {method === "ideal" && (
                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Kies je bank" : "Select your bank"}</label>
                  <select value={bank} onChange={(e) => setBank(e.target.value)} className="input-horror">
                    {IDEAL_BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    {nl ? "Bestelling bevestigen" : "Confirm order"} · €{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>
              <p className="text-horror-text-muted text-xs text-center mt-3">
                {nl ? "Beveiligde verbinding · Gegevens worden niet opgeslagen" : "Secure connection · Data is not stored"}
              </p>
            </form>
          )}
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
                <span>{shipping === 0 ? (nl ? "Gratis" : "Free") : `€${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-horror-orange text-xs">{nl ? "Gratis verzending vanaf €500" : "Free shipping from €500"}</p>
              )}
              <div className="flex justify-between font-bold text-horror-text-primary text-base pt-2 border-t border-horror-border">
                <span>{nl ? "Totaal" : "Total"}</span>
                <span>€{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-horror-text-muted text-xs">{nl ? "Inclusief btw" : "Including VAT"}</p>
            </div>

            <div className="mt-5 pt-5 border-t border-horror-border space-y-2 text-xs text-horror-text-muted">
              {[
                { icon: "↩", text: nl ? "14 dagen retourrecht" : "14-day returns" },
                { icon: "🏭", text: nl ? "Op voorraad in NL" : "In stock in NL" },
                { icon: "✉", text: nl ? "Reactie binnen 1 dag" : "Reply within 1 day" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2">
                  <span className="text-horror-orange">{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
