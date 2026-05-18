import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Magic Halloween Props",
};

const articles = [
  {
    title: "Artikel 1 – Identiteit",
    content: `Magic Halloween Props is een handelsnaam van All Season Toys, gevestigd te Pannenweg 306, 6031 RK Nederweert, Nederland.\n\nE-mail: info@allseasontoys.nl\nKvK-nummer: 64942708\nBTW-nummer: NL855913770B01`,
  },
  {
    title: "Artikel 2 – Toepasselijkheid",
    content: "Deze algemene voorwaarden zijn van toepassing op elk aanbod van Magic Halloween Props en op elke tot stand gekomen overeenkomst op afstand tussen ondernemer en consument.",
  },
  {
    title: "Artikel 3 – Aanbod en overeenkomst",
    content: "Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden producten. De overeenkomst komt tot stand op het moment van aanvaarding door de consument en het voldoen aan de daarbij gestelde voorwaarden.",
  },
  {
    title: "Artikel 4 – Prijs",
    content: "Alle genoemde prijzen zijn inclusief btw. Bezorgkosten worden apart vermeld voor of tijdens het bestelproces. Prijswijzigingen voorbehouden.",
  },
  {
    title: "Artikel 5 – Levering",
    content: "Alle producten zijn op voorraad in ons magazijn in Nederweert. Wij streven ernaar bestellingen zo snel mogelijk te verwerken en te verzenden. Exacte levertijden worden bevestigd bij bestelling. Levering geschiedt via DHL of PostNL. Afhalen op afspraak is mogelijk.",
  },
  {
    title: "Artikel 6 – Herroepingsrecht",
    content: "De consument heeft het recht om binnen 14 dagen na ontvangst van het product de overeenkomst zonder opgave van redenen te ontbinden. Producten dienen ongebruikt en in originele verpakking te worden geretourneerd. Retourkosten zijn voor rekening van de consument, tenzij anders overeengekomen. Neem contact op via info@allseasontoys.nl om een retour in te dienen.",
  },
  {
    title: "Artikel 7 – Betaling",
    content: "Betaling dient te geschieden bij bestelling via de aangeboden betaalmethoden. Bij niet-tijdige betaling is de consument van rechtswege in verzuim.",
  },
  {
    title: "Artikel 8 – Garantie en conformiteit",
    content: "Magic Halloween Props staat ervoor in dat de producten voldoen aan de overeenkomst, de in het aanbod vermelde specificaties en de redelijke eisen van deugdelijkheid. Op alle producten gelden de wettelijke garantiebepalingen. Bij defecten of klachten kunt u contact opnemen via info@allseasontoys.nl.",
  },
  {
    title: "Artikel 9 – Klachten",
    content: "Klachten dienen binnen bekwame tijd te worden gemeld via info@allseasontoys.nl. Wij streven ernaar klachten binnen 5 werkdagen te beantwoorden. Bij geschillen trachten wij in goed overleg tot een oplossing te komen.",
  },
  {
    title: "Artikel 10 – Toepasselijk recht",
    content: "Op alle overeenkomsten is uitsluitend Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde Nederlandse rechter.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />

      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.3), transparent)" }} />
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-horror-orange/50" />
            <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase">Legal</span>
            <div className="h-px w-10 bg-horror-orange/50" />
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-horror-text-primary mb-3">
            Algemene <span className="text-horror-orange">Voorwaarden</span>
          </h1>
          <p className="text-horror-text-muted text-sm mb-12">
            Magic Halloween Props — All Season Toys (Slegers import vof) · Versie 2026
          </p>

          <div className="space-y-10">
            {articles.map((a) => (
              <div key={a.title} className="border-b border-horror-border pb-10 last:border-0">
                <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-4">
                  {a.title}
                </h2>
                <div className="text-horror-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {a.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
