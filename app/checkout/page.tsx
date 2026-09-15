import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutContent from "@/components/pages/CheckoutContent";

export const metadata: Metadata = {
  title: "Afrekenen",
  description: "Reken je bestelling veilig af via Stripe (iDEAL, creditcard en meer).",
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
