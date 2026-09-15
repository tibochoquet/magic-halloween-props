import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Bestelling geannuleerd",
  robots: { index: false, follow: true },
};

export default function CheckoutCancelledPage() {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <div className="max-w-xl mx-auto px-5 md:px-8 pt-32 pb-24 text-center">
        <h1 className="font-cinzel text-2xl font-bold text-horror-text-primary mb-3">
          Bestelling geannuleerd
        </h1>
        <p className="text-horror-text-secondary text-sm leading-relaxed mb-8">
          Er is niets afgeschreven. Je winkelwagen staat nog klaar als je verder wilt gaan.
        </p>
        <Link href="/checkout" className="btn-primary">
          Terug naar afrekenen
        </Link>
      </div>
      <Footer />
    </main>
  );
}
