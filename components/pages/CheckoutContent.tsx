"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { company } from "@/lib/companyInfo";
import { deliveryTerms, WITHDRAWAL_DAYS, VAT_RATE } from "@/lib/shopTerms";

type Step = "cart" | "details" | "confirm";

/**
 * ORDER REQUEST FLOW — deliberately NOT a payment flow.
 *
 * There is no payment provider wired to this site. Until one is, this page must
 * never imply that money has changed hands or that an order is final. It
 * therefore collects an order REQUEST and hands it to the customer's own mail
 * client addressed to the shop; nothing is transmitted or stored by us.
 *
 * When a PSP is added, replace this component wholesale — do not bolt payment
 * onto it. See section 6 of the pre-launch brief for the required final-button
 * wording ("Bestelling met betalingsverplichting") which applies only once a
 * real payment obligation exists.
 */
export default function CheckoutContent() {
  const { items, totalPrice, totalItems, blockedItems } = useCart();
  const { language } = useLanguage();
  const nl = language === "nl";

  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", houseNumber: "", city: "", postcode: "", country: "Nederland",
    notes: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  const shipping = 0;
  const total = totalPrice + shipping;
  // Prices are stored gross; show the VAT already contained in the total.
  const vatIncluded = total - total / (1 + VAT_RATE);

  function buildMailto() {
    const lines = [
      nl ? "Ik wil de volgende bestelling plaatsen:" : "I would like to place the following order:",
      "",
      ...items.map(
        ({ product, quantity }) =>
          `- ${quantity}x ${product.name} (${product.id}) — €${(product.price * quantity).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`
      ),
      "",
      `${nl ? "Totaal (incl. btw)" : "Total (incl. VAT)"}: €${total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`,
      "",
      `${nl ? "Naam" : "Name"}: ${form.firstName} ${form.lastName}`,
      `E-mail: ${form.email}`,
      `${nl ? "Telefoon" : "Phone"}: ${form.phone}`,
      `${nl ? "Adres" : "Address"}: ${form.street} ${form.houseNumber}, ${form.postcode} ${form.city}, ${form.country}`,
      form.notes ? `${nl ? "Opmerkingen" : "Notes"}: ${form.notes}` : "",
    ].filter(Boolean);

    const subject = nl ? "Bestelaanvraag via magichalloweenprops.nl" : "Order request via magichalloweenprops.nl";
    return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedTerms) return;
    window.location.href = buildMailto();
    setSent(true);
  }

  if (items.length === 0 && !sent) {
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

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5 text-center max-w-lg mx-auto px-5">
        <div className="w-20 h-20 border-2 border-horror-orange flex items-center justify-center text-horror-orange">
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-cinzel text-3xl font-bold text-horror-text-primary">
          {nl ? "Bijna klaar — verstuur je e-mail" : "Almost done — send your email"}
        </h2>
        <p className="text-horror-text-secondary text-base leading-relaxed">
          {nl
            ? "We hebben je e-mailprogramma geopend met je aanvraag erin. Verstuur die e-mail om je aanvraag bij ons af te ronden. Opent er niets? Mail ons dan rechtstreeks."
            : "We opened your email client with your request. Send that email to complete your request. Nothing opened? Email us directly."}
        </p>
        <a href={`mailto:${company.email}`} className="text-horror-orange hover:underline text-sm">
          {company.email}
        </a>
        <p className="text-horror-text-muted text-xs leading-relaxed max-w-sm">
          {nl
            ? "Je hebt nog niets betaald en er is nog geen koopovereenkomst. Wij nemen contact op om je bestelling, levertijd en betaling te bevestigen."
            : "You have not paid anything and no purchase agreement exists yet. We will contact you to confirm your order, delivery time and payment."}
        </p>
        <Link href="/shop" className="btn-outline mt-2">
          {nl ? "Verder winkelen" : "Continue shopping"}
        </Link>
      </div>
    );
  }

  const steps: { id: Step; label: string }[] = [
    { id: "cart", label: nl ? "Overzicht" : "Summary" },
    { id: "details", label: nl ? "Gegevens" : "Details" },
    { id: "confirm", label: nl ? "Aanvraag" : "Request" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-32 pb-24">
      {/* No-payment notice — must be visible from the first step. */}
      <div className="mb-10 p-4 md:p-5 border border-horror-orange/40 bg-horror-orange/5">
        <p className="font-cinzel text-sm font-bold text-horror-text-primary mb-1.5">
          {nl ? "Online betalen is nog niet mogelijk" : "Online payment is not available yet"}
        </p>
        <p className="text-horror-text-secondary text-sm leading-relaxed">
          {nl
            ? "Je kunt hier een bestelaanvraag doen. Wij nemen daarna contact met je op om de bestelling, levertijd en betaling te bevestigen. Er wordt via deze site geen betaling gedaan en er komt nog geen koopovereenkomst tot stand."
            : "You can submit an order request here. We will then contact you to confirm the order, delivery time and payment. No payment is taken through this site and no purchase agreement is formed yet."}
        </p>
      </div>

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

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-12">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => setStep(s.id)}
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
            {i < steps.length - 1 && <div className="w-8 h-px bg-horror-border mx-3" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
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
              <button
                onClick={() => setStep("details")}
                disabled={blockedItems.length > 0}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {nl ? "Doorgaan naar gegevens" : "Continue to details"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}

          {step === "details" && (
            <div>
              <h2 className="font-cinzel text-xl font-bold text-horror-text-primary mb-6">
                {nl ? "Jouw gegevens" : "Your details"}
              </h2>
              <form onSubmit={(e) => { e.preventDefault(); setStep("confirm"); }} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Voornaam" : "First name"}</label>
                    <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required placeholder={nl ? "Jan" : "John"} className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Achternaam" : "Last name"}</label>
                    <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required placeholder={nl ? "de Vries" : "Smith"} className="input-horror" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-horror-text-muted text-xs tracking-widest uppercase">E-mail</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jan@email.nl" className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Telefoon" : "Phone"}</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+31 6 12345678" className="input-horror" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="street" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Straat" : "Street"}</label>
                    <input id="street" name="street" value={form.street} onChange={handleChange} required placeholder={nl ? "Voorbeeldstraat" : "Example Street"} className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="houseNumber" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Huisnr." : "Number"}</label>
                    <input id="houseNumber" name="houseNumber" value={form.houseNumber} onChange={handleChange} required placeholder="12A" className="input-horror" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="postcode" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Postcode" : "Postcode"}</label>
                    <input id="postcode" name="postcode" value={form.postcode} onChange={handleChange} required placeholder="1234 AB" className="input-horror" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Stad" : "City"}</label>
                    <input id="city" name="city" value={form.city} onChange={handleChange} required placeholder="Amsterdam" className="input-horror" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Opmerkingen (optioneel)" : "Notes (optional)"}</label>
                  <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder={nl ? "Bezorgingsinstructies of opmerkingen..." : "Delivery instructions or notes..."} className="input-horror resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  {nl ? "Doorgaan naar overzicht" : "Continue to summary"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {step === "confirm" && (
            <form onSubmit={handleSubmit}>
              <h2 className="font-cinzel text-xl font-bold text-horror-text-primary mb-6">
                {nl ? "Controleer je aanvraag" : "Review your request"}
              </h2>

              {/* Full order summary before the final action */}
              <div className="border border-horror-border divide-y divide-horror-border mb-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-horror-text-secondary">
                      {quantity}× {product.name}
                    </span>
                    <span className="text-horror-text-primary font-medium whitespace-nowrap">
                      €{(product.price * quantity).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-3 text-sm text-horror-text-muted">
                  <span>{nl ? "Verzending" : "Shipping"}</span>
                  <span className="text-horror-orange">{nl ? "Gratis" : "Free"}</span>
                </div>
                <div className="flex justify-between px-4 py-3 text-base font-bold text-horror-text-primary">
                  <span>{nl ? "Totaal" : "Total"}</span>
                  <span>€{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between px-4 py-2 text-xs text-horror-text-muted">
                  <span>{nl ? `Waarvan btw (${VAT_RATE * 100}%)` : `Of which VAT (${VAT_RATE * 100}%)`}</span>
                  <span>€{vatIncluded.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="text-sm text-horror-text-secondary space-y-1.5 mb-6 p-4 bg-horror-card border border-horror-border">
                <p className="text-horror-text-primary font-medium">{form.firstName} {form.lastName}</p>
                <p>{form.street} {form.houseNumber}, {form.postcode} {form.city}</p>
                <p>{form.email}{form.phone ? ` · ${form.phone}` : ""}</p>
                <p className="text-horror-text-muted text-xs pt-2">
                  {nl ? "Levertijd" : "Delivery"}:{" "}
                  {deliveryTerms.inStock ?? (nl ? "TODO — levertijd nog aan te leveren" : "TODO — delivery term pending")}
                </p>
              </div>

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

              <button
                type="submit"
                disabled={!acceptedTerms || blockedItems.length > 0}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {nl ? "Aanvraag versturen" : "Send request"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <p className="text-horror-text-muted text-xs text-center mt-3 leading-relaxed">
                {nl
                  ? "Dit is geen betaling en nog geen koopovereenkomst. Je aanvraag wordt via je eigen e-mailprogramma verstuurd."
                  : "This is not a payment and not yet a purchase agreement. Your request is sent via your own email client."}
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
                <span className="text-horror-orange">{nl ? "Gratis" : "Free"}</span>
              </div>
              <div className="flex justify-between font-bold text-horror-text-primary text-base pt-2 border-t border-horror-border">
                <span>{nl ? "Totaal" : "Total"}</span>
                <span>€{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-horror-text-muted text-xs">
                {nl ? `Inclusief btw (${VAT_RATE * 100}%)` : `Including VAT (${VAT_RATE * 100}%)`}
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
              <div className="flex items-center gap-2">
                <span className="text-horror-orange">✉</span>
                <span>{nl ? "Reactie binnen 1 werkdag" : "Reply within 1 business day"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
