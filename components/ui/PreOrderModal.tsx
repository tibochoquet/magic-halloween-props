"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types";

export default function PreOrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [form, setForm] = useState({ quantity: 1, name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
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
            aria-label="Sluiten"
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
            <p className="font-cinzel font-bold text-xl text-horror-text-primary">Pre-order ontvangen</p>
            <p className="text-horror-text-muted text-sm max-w-xs">
              Bedankt, {form.name}. We nemen contact met je op via {form.email} zodra {product.name} verzendklaar is.
            </p>
            <button type="button" onClick={onClose} className="btn-outline mt-2">Sluiten</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
            <p className="text-horror-text-secondary text-sm leading-relaxed">
              Reserveer nu je {product.name} met een vrijblijvende pre-order. {product.availabilityNote ?? "We nemen na registratie contact met je op."}
            </p>

            <div className="flex items-baseline justify-between py-3 border-y border-horror-border">
              <span className="text-horror-text-muted text-xs tracking-widest uppercase">Prijs</span>
              <span className="font-cinzel text-lg font-bold text-horror-text-primary">
                €{product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="preorder-name" className="text-horror-text-muted text-xs tracking-widest uppercase">Naam</label>
              <input
                ref={firstFieldRef}
                id="preorder-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Je volledige naam"
                className="input-horror"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="preorder-email" className="text-horror-text-muted text-xs tracking-widest uppercase">E-mail</label>
              <input
                id="preorder-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="jouw@email.nl"
                className="input-horror"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="preorder-phone" className="text-horror-text-muted text-xs tracking-widest uppercase">Telefoon</label>
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
                <label htmlFor="preorder-quantity" className="text-horror-text-muted text-xs tracking-widest uppercase">Aantal</label>
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
              <span className="text-horror-text-muted text-xs tracking-widest uppercase">Totaal</span>
              <span className="font-cinzel text-base font-bold text-horror-orange">
                €{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed justify-center mt-1">
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Bevestig pre-order
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-horror-text-muted text-[11px] text-center leading-relaxed">
              Vrijblijvend, geen betaling nu. We nemen contact op zodra het product beschikbaar is.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
