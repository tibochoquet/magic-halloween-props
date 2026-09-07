import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderDetail from "@/components/orders/OrderDetail";

export const metadata: Metadata = {
  title: "Mijn bestelling",
  description: "Bekijk je bestelling, volg je pakket en meld een retour aan.",
  // Order pages are personal and must never be indexed or previewed.
  robots: { index: false, follow: false, nocache: true },
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />

      <section className="relative pt-36 pb-24">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <Link
            href="/mijn-bestelling"
            className="inline-flex items-center gap-1.5 text-horror-text-muted text-xs tracking-wide uppercase hover:text-horror-orange transition-colors duration-200 mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Andere bestelling opzoeken
          </Link>

          <OrderDetail orderId={params.id} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
