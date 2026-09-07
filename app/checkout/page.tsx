import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutContent from "@/components/pages/CheckoutContent";

export const metadata: Metadata = {
  title: "Bestelaanvraag",
  description:
    "Rond je bestelaanvraag af. Online betalen is nog niet mogelijk; wij nemen contact op om bestelling, levertijd en betaling te bevestigen.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <Suspense>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </main>
  );
}
