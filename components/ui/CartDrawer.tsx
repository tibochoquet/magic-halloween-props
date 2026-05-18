"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { useTranslation } from "@/hooks/useTranslation";

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, closeCart } = useCart();
  const t = useTranslation().cart;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#0D0D0D] border-l border-horror-border flex flex-col transition-transform duration-400 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-horror-border">
          <div className="flex items-center gap-3">
            <span className="font-cinzel font-bold text-horror-text-primary tracking-wider uppercase text-sm">
              {t.title}
            </span>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-horror-orange/15 border border-horror-orange/30 text-horror-orange text-xs font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-horror-text-muted hover:text-horror-orange transition-colors duration-200 p-1"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <span className="text-6xl opacity-20">🛒</span>
              <p className="text-horror-text-muted text-sm tracking-wide">{t.empty}</p>
              <button
                onClick={closeCart}
                className="text-horror-orange text-xs font-semibold tracking-widest uppercase hover:underline mt-2"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-4 p-4 bg-horror-card border border-horror-border hover:border-horror-border/70 transition-colors duration-200"
                >
                  <div className={`relative w-16 h-16 flex-shrink-0 bg-gradient-to-br ${product.bgGradient} flex items-center justify-center text-3xl overflow-hidden`}>
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="64px" />
                    ) : (
                      <div className="text-horror-text-muted/30">
                        <CategoryIcon id={product.category} size={28} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-horror-orange-dark text-[10px] font-semibold tracking-wider uppercase">
                          {product.category}
                        </p>
                        <p className="font-cinzel text-sm font-bold text-horror-text-primary leading-tight">
                          {product.name}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-horror-text-muted hover:text-red-500 transition-colors duration-200 flex-shrink-0 mt-0.5"
                        aria-label={`Remove ${product.name}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-horror-border">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-horror-text-muted hover:text-horror-orange hover:bg-horror-orange/10 transition-all duration-200 text-sm"
                          aria-label={t.decreaseQty}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-horror-text-primary text-sm font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-horror-text-muted hover:text-horror-orange hover:bg-horror-orange/10 transition-all duration-200 text-sm"
                          aria-label={t.increaseQty}
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-horror-text-primary font-bold text-sm">
                        ${(product.price * quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-horror-border px-6 py-6 flex flex-col gap-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-horror-text-muted text-sm tracking-wider uppercase">{t.subtotal}</span>
              <span className="font-cinzel font-bold text-horror-text-primary text-lg">
                €{totalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <p className="text-horror-text-muted text-xs">{t.shippingNote}</p>

            {/* CTA */}
            <a href="/checkout" onClick={closeCart} className="btn-primary w-full justify-center">
              {t.checkout}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <button
              onClick={clearCart}
              className="text-horror-text-muted text-xs text-center hover:text-red-500 transition-colors duration-200 tracking-wider"
            >
              {t.clearCart}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
