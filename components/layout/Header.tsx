"use client";

import { useState, useEffect } from "react";
import { navLinks } from "@/data";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

function SkullIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9 9 0 00-9 9c0 3.07 1.54 5.78 3.9 7.44V21a1 1 0 001 1h8a1 1 0 001-1v-2.56A9 9 0 0012 2zm-2 14H8v-2h2v2zm6 0h-2v-2h2v2zM9 13a2 2 0 110-4 2 2 0 010 4zm6 0a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}

function CartIcon({ count }: { count: number }) {
  return (
    <div className="relative">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-horror-orange text-black text-[10px] font-bold flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-horror-black/90 backdrop-blur-md border-b border-horror-border shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-18 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="text-horror-orange animate-flicker group-hover:text-horror-orange-light transition-colors duration-300">
            <SkullIcon />
          </div>
          <div className="font-cinzel font-bold tracking-wider">
            <span className="text-horror-text-primary text-base">MAGIC HALLOWEEN</span>
            <span className="text-horror-orange text-glow-sm text-base"> PROPS</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-horror-text-secondary text-sm font-medium tracking-wider uppercase hover:text-horror-orange transition-colors duration-300 relative group"
            >
              {t.nav.links[link.id]}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-horror-orange group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <div className="hidden md:flex items-center border border-horror-border text-xs font-bold tracking-widest overflow-hidden">
            <button
              onClick={() => setLanguage("nl")}
              className={`px-2.5 py-1.5 transition-colors duration-200 ${language === "nl" ? "bg-horror-orange text-black" : "text-horror-text-muted hover:text-horror-orange"}`}
            >
              NL
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1.5 transition-colors duration-200 ${language === "en" ? "bg-horror-orange text-black" : "text-horror-text-muted hover:text-horror-orange"}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={openCart}
            className="text-horror-text-secondary hover:text-horror-orange transition-colors duration-300"
            aria-label={t.nav.openCart}
          >
            <CartIcon count={totalItems} />
          </button>

          <a
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 border border-horror-orange/40 text-horror-orange text-xs font-bold tracking-widest uppercase hover:bg-horror-orange/10 hover:border-horror-orange transition-all duration-300"
          >
            {t.nav.shopNow}
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-horror-text-secondary hover:text-horror-orange transition-colors duration-300 p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t.nav.openMenu}
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
          mobileOpen ? "max-h-96 border-t border-horror-border" : "max-h-0"
        } bg-horror-black/95 backdrop-blur-md`}
      >
        <nav className="px-5 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-horror-text-secondary text-sm font-medium tracking-wider uppercase py-3 border-b border-horror-border/40 hover:text-horror-orange transition-colors duration-300"
              onClick={() => setMobileOpen(false)}
            >
              {t.nav.links[link.id]}
            </a>
          ))}

          {/* Mobile language toggle */}
          <div className="flex items-center gap-3 py-3 border-b border-horror-border/40">
            <span className="text-horror-text-muted text-xs tracking-widest uppercase">Taal / Language</span>
            <div className="flex items-center border border-horror-border text-xs font-bold tracking-widest overflow-hidden ml-auto">
              <button
                onClick={() => setLanguage("nl")}
                className={`px-3 py-1.5 transition-colors duration-200 ${language === "nl" ? "bg-horror-orange text-black" : "text-horror-text-muted"}`}
              >
                NL
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 transition-colors duration-200 ${language === "en" ? "bg-horror-orange text-black" : "text-horror-text-muted"}`}
              >
                EN
              </button>
            </div>
          </div>

          <a
            href="/shop"
            className="mt-4 btn-primary text-center"
            onClick={() => setMobileOpen(false)}
          >
            {t.nav.shopNow}
          </a>
        </nav>
      </div>
    </header>
  );
}
