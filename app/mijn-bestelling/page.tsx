import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderLookupForm from "@/components/orders/OrderLookupForm";
import { company } from "@/lib/companyInfo";
import { WITHDRAWAL_DAYS } from "@/lib/shopTerms";
import { usingFixtureData } from "@/lib/orders/store";

export const metadata: Metadata = {
  title: "Waar is mijn bestelling?",
  description:
    "Bekijk je bestelling, volg je pakket, meld eenvoudig een retour aan of laat een review achter.",
  alternates: { canonical: "/mijn-bestelling" },
  robots: { index: false, follow: false },
};

export default function MijnBestellingPage() {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />

      <section className="relative pt-36 pb-24 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.3), transparent)" }}
        />
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-horror-orange/50" />
            <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">
              Klantenservice
            </span>
            <div className="h-px w-10 bg-horror-orange/50" />
          </div>

          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-horror-text-primary mb-4">
            Waar is mijn <span className="text-horror-orange">bestelling?</span>
          </h1>
          <p className="text-horror-text-secondary text-base md:text-lg leading-relaxed mb-12 max-w-xl">
            Bekijk je bestelling, volg je pakket, meld eenvoudig een retour aan of laat een review
            achter.
          </p>

          {usingFixtureData && (
            <div className="mb-10 p-4 border border-horror-orange/40 bg-horror-orange/5">
              <p className="font-cinzel text-sm font-bold text-horror-text-primary mb-1.5">
                Testomgeving
              </p>
              <p className="text-horror-text-secondary text-sm leading-relaxed">
                Er is nog geen bestelsysteem gekoppeld. Deze pagina werkt op testgegevens, zodat de
                flow te controleren is. Probeer bestelnummer{" "}
                <span className="text-horror-orange font-mono">MHP-2026-0001</span> met{" "}
                <span className="text-horror-orange font-mono">demo@example.com</span>.
              </p>
            </div>
          )}

          {/* Optie 1 — inloggen */}
          <div className="border border-horror-border bg-horror-card p-6 md:p-8 mb-6">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-9 h-9 border border-horror-orange/40 text-horror-orange flex items-center justify-center font-cinzel font-bold text-sm">
                1
              </span>
              <div className="flex-1">
                <h2 className="font-cinzel text-lg font-bold text-horror-text-primary mb-2">
                  Inloggen en mijn bestellingen bekijken
                </h2>
                <p className="text-horror-text-secondary text-sm leading-relaxed mb-5">
                  Met een account zie je al je bestellingen in één overzicht, inclusief status,
                  Track &amp; Trace en retouren.
                </p>

                {/* Honest state: accounts do not exist yet, so this is not a
                    dead button pretending otherwise. */}
                <div className="p-4 border border-horror-border bg-horror-black/40">
                  <p className="text-horror-text-primary text-sm font-medium mb-1">
                    Klantaccounts zijn nog niet beschikbaar
                  </p>
                  <p className="text-horror-text-muted text-sm leading-relaxed">
                    We werken hieraan. Gebruik voorlopig optie 2 hieronder — met je bestelnummer en
                    e-mailadres kom je bij dezelfde informatie.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optie 2 — bestelnummer */}
          <div className="border border-horror-border bg-horror-card p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-9 h-9 border border-horror-orange/40 text-horror-orange flex items-center justify-center font-cinzel font-bold text-sm">
                2
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="font-cinzel text-lg font-bold text-horror-text-primary mb-2">
                  Bestelling opzoeken
                </h2>
                <p className="text-horror-text-secondary text-sm leading-relaxed mb-6">
                  Je bestelnummer staat in de bevestiging die je van ons hebt ontvangen.
                </p>
                <OrderLookupForm />
              </div>
            </div>
          </div>

          {/* Wat kun je hier doen */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "📦", title: "Track & Trace", body: "Volg je pakket rechtstreeks bij DHL of DPD." },
              { icon: "↩", title: "Retour melden", body: `Binnen ${WITHDRAWAL_DAYS} dagen na ontvangst, in een paar stappen.` },
              { icon: "★", title: "Review schrijven", body: "Deel je ervaring zodra je bestelling is afgeleverd." },
              { icon: "✉", title: "Hulp nodig", body: "We reageren doorgaans binnen één werkdag." },
            ].map((c) => (
              <div key={c.title} className="border border-horror-border p-5">
                <div className="text-horror-orange text-xl mb-2" aria-hidden="true">{c.icon}</div>
                <p className="font-cinzel text-sm font-bold text-horror-text-primary mb-1">{c.title}</p>
                <p className="text-horror-text-muted text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 p-6 border border-horror-border bg-horror-card">
            <h2 className="font-cinzel text-base font-bold text-horror-text-primary mb-2">
              Heb je een vraag over je bestelling of retour?
            </h2>
            <p className="text-horror-text-secondary text-sm leading-relaxed mb-5">
              Kom je ergens niet uit? Mail ons gerust, we helpen je graag. Vermeld je bestelnummer,
              dan kunnen we je direct verder helpen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`mailto:${company.email}`} className="btn-primary justify-center">
                Mail ons
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <Link href="/retourneren" className="btn-outline justify-center">
                Retourvoorwaarden
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
