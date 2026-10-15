"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { company } from "@/lib/companyInfo";

export default function PreOrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { language } = useLanguage();
  const nl = language === "nl";
  const [form, setForm] = useState({ quantity: 1, name: "", email: "", phone: "" });
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "quantity" ? Math.max(1, Number(value) || 1) : value }));
  }

  const fallbackError = nl
    ? `Verzenden is mislukt. Mail ons rechtstreeks op ${company.email}.`
    : `Sending failed. Please email us directly at ${company.email}.`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "preorder", language, website, productId: product.id, ...form }),
      });
      // Success only on a 2xx. "Pre-order ontvangen" while nothing was sent is
      // exactly the lie this rewrite exists to remove.
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? fallbackError);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(fallbackError);
    } finally {
      setLoading(false);
    }
  }

  const total = product.price * form.quantity;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center motion-safe:animate-modal-fade-in"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preorder-modal-title"
        className="relative z-10 w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-horror-card border border-horror-orange/25 shadow-[0_0_60px_rgba(0,0,0,0.7)] motion-safe:animate-modal-slide-up"
      >
        <div className="sticky top-0 flex items-center justify-between px-6 pt-6 pb-4 bg-horror-card border-b border-horror-border">
          <div>
            <span className="text-horror-orange-dark text-[10px] font-semibold tracking-[0.2em] uppercase">Pre-order</span>
            <h2 id="preorder-modal-title" className="font-cinzel text-xl font-bold text-horror-text-primary mt-0.5 leading-snug">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={nl ? "Sluiten" : "Close"}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-horror-text-muted hover:text-horror-orange border border-horror-border hover:border-horror-orange/40 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-horror-orange flex items-center justify-center text-horror-orange">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-cinzel font-bold text-xl text-horror-text-primary">{nl ? "Reservering genoteerd" : "Reservation noted"}</p>
            <p className="text-horror-text-muted text-sm max-w-xs">
              {nl
                ? `Bedankt, ${form.name}. Je reservering is bij ons binnen en je krijgt een bevestiging op ${form.email}. Dit is een reservering, geen betaling — we nemen contact op zodra ${product.name} leverbaar is.`
                : `Thanks, ${form.name}. Your reservation has reached us and a confirmation is on its way to ${form.email}. This is a reservation, not a payment — we will contact you as soon as ${product.name} is available.`}
            </p>
            <button type="button" onClick={onClose} className="btn-outline mt-2">{nl ? "Sluiten" : "Close"}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
            <p className="text-horror-text-secondary text-sm leading-relaxed">
              {nl
                ? `Reserveer nu je ${product.name} met een vrijblijvende pre-order. ${product.availabilityNote ?? "We nemen na registratie contact met je op."}`
                : `Reserve your ${product.name} now with a no-obligation pre-order. ${product.availabilityNote ?? "We will contact you after you register."}`}
            </p>

            <div className="flex items-baseline justify-between py-3 border-y border-horror-border">
              <span className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Prijs" : "Price"}</span>
              <span className="font-cinzel text-lg font-bold text-horror-text-primary">
                €{product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="preorder-name" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Naam" : "Name"}</label>
              <input
                ref={firstFieldRef}
                id="preorder-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={nl ? "Je volledige naam" : "Your full name"}
                className="input-horror"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="preorder-email" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "E-mail" : "Email"}</label>
              <input
                id="preorder-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder={nl ? "jouw@email.nl" : "you@email.com"}
                className="input-horror"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="preorder-phone" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Telefoon" : "Phone"}</label>
                <input
                  id="preorder-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="06 12345678"
                  className="input-horror"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="preorder-quantity" className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Aantal" : "Quantity"}</label>
                <input
                  id="preorder-quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={handleChange}
                  className="input-horror"
                />
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-horror-text-muted text-xs tracking-widest uppercase">{nl ? "Totaal" : "Total"}</span>
              <span className="font-cinzel text-base font-bold text-horror-orange">
                €{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Honeypot: hidden from people, filled in by bots. */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {error && (
              <p role="alert" className="text-sm text-red-400 bg-red-950/30 border border-red-700/50 px-4 py-3">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed justify-center mt-1">
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  {nl ? "Bevestig pre-order" : "Confirm pre-order"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-horror-text-muted text-[11px] text-center leading-relaxed">
              {nl
                ? "Vrijblijvend, geen betaling nu. We nemen contact op zodra het product beschikbaar is."
                : "No obligation, no payment now. We will get in touch as soon as the product is available."}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
