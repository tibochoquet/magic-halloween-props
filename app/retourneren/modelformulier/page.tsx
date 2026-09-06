import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PrintButton from "@/components/ui/PrintButton";
import { company, addressLineFull } from "@/lib/companyInfo";
import { returnPolicy } from "@/lib/shopTerms";

export const metadata: Metadata = {
  title: "Modelformulier voor herroeping | Magic Halloween Props",
  description:
    "Het wettelijke modelformulier voor herroeping. Vul dit formulier alleen in en stuur het terug wanneer je de overeenkomst wilt herroepen.",
};

/**
 * Statutory model withdrawal form (Annex I(B), Consumer Rights Directive,
 * implemented in NL as Bijlage I onder B bij art. 6:230o BW).
 *
 * The wording below is the prescribed text. It is printable via the browser's
 * own print dialog — print styles live in globals.css under @media print.
 */
export default function ModelformulierPage() {
  const line = "________________________________________";

  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <div className="print:hidden">
        <Header />
      </div>

      <section className="relative pt-36 pb-24 print:pt-0 print:pb-0">
        <div className="max-w-3xl mx-auto px-5 md:px-8 print:max-w-none print:px-0">
          <div className="print:hidden mb-8 flex flex-wrap items-center gap-4">
            <Link href="/retourneren" className="text-horror-text-muted text-xs tracking-wide uppercase hover:text-horror-orange transition-colors duration-200 inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Terug naar retourneren
            </Link>
            <PrintButton />
          </div>

          <article className="legal-form bg-horror-card border border-horror-border p-8 md:p-12 print:bg-white print:text-black print:border-0 print:p-0">
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-horror-text-primary print:text-black mb-2">
              Modelformulier voor herroeping
            </h1>
            <p className="text-horror-text-muted print:text-neutral-600 text-sm mb-8">
              Dit formulier alleen invullen en terugzenden wanneer u de overeenkomst wilt herroepen.
            </p>

            <div className="space-y-6 text-sm leading-relaxed text-horror-text-secondary print:text-black">
              <div className="pb-6 border-b border-horror-border print:border-neutral-300">
                <p className="mb-2">Aan:</p>
                <p className="whitespace-pre-line">
                  {company.umbrellaTradeName} ({company.statutoryName})
                  {"\n"}
                  {addressLineFull}
                  {"\n"}
                  E-mail: {company.email}
                  {company.phone ? `\nTelefoon: ${company.phone}` : ""}
                </p>
                {returnPolicy.returnAddress ? (
                  <p className="mt-3 whitespace-pre-line">
                    Retouradres: {returnPolicy.returnAddress}
                  </p>
                ) : (
                  <p className="mt-3 text-horror-orange print:text-black">
                    [TODO — retouradres nog aan te leveren]
                  </p>
                )}
              </div>

              <p>
                Ik/Wij (*) deel/delen (*) u hierbij mede dat ik/wij (*) onze overeenkomst betreffende
                de verkoop van de volgende goederen herroep/herroepen (*):
              </p>
              <p className="font-mono text-xs leading-loose">
                {line}
                <br />
                {line}
              </p>

              <div className="space-y-4 font-mono text-xs leading-loose">
                <p>Besteld op (*) / ontvangen op (*): {line}</p>
                <p>Naam consument(en): {line}</p>
                <p>Adres consument(en): {line}</p>
                <p>{line}</p>
                <p>Bestelnummer: {line}</p>
                <p className="pt-4">
                  Handtekening consument(en)
                  <br />
                  <span className="text-horror-text-muted print:text-neutral-600">
                    (alleen wanneer dit formulier op papier wordt ingediend)
                  </span>
                </p>
                <p className="pt-6">{line}</p>
                <p>Datum: {line}</p>
              </div>

              <p className="pt-4 text-xs text-horror-text-muted print:text-neutral-600">
                (*) Doorhalen wat niet van toepassing is.
              </p>
            </div>
          </article>

          <p className="print:hidden text-horror-text-muted text-xs mt-6 leading-relaxed">
            Je bent niet verplicht dit formulier te gebruiken. Een ondubbelzinnige mededeling per
            e-mail volstaat ook. Zie{" "}
            <Link href="/retourneren" className="text-horror-orange hover:underline">
              retourneren en herroepingsrecht
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}
