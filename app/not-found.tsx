import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pagina niet gevonden (404)",
  description: "Deze pagina bestaat niet of is verplaatst. Ga terug naar het assortiment.",
};

export default function NotFound() {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden flex flex-col">
      <Header />

      <section className="relative flex-1 flex items-center justify-center px-5 py-32 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,107,0,0.08) 0%, transparent 60%)" }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.3), transparent)" }}
        />

        <div className="relative z-10 text-center max-w-lg">
          <p className="font-cinzel text-7xl md:text-8xl font-black text-horror-orange/30 leading-none mb-4">
            404
          </p>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-horror-text-primary mb-4">
            Deze is in het donker verdwenen
          </h1>
          <p className="text-horror-text-secondary text-base leading-relaxed mb-10">
            De pagina die je zoekt bestaat niet meer, of heeft nooit bestaan. Misschien is het
            product uit het assortiment gehaald — of ben je gewoon verkeerd afgeslagen.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary justify-center">
              Naar het assortiment
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/contact" className="btn-outline justify-center">
              Contact opnemen
            </Link>
          </div>

          <p className="text-horror-text-muted text-xs mt-10">
            Zocht je een specifiek product?{" "}
            <Link href="/contact" className="text-horror-orange hover:underline">
              Vraag het ons
            </Link>{" "}
            — we hebben meer op voorraad dan online staat.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
