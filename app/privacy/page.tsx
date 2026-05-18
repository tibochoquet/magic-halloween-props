import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacybeleid | Magic Halloween Props",
};

const sections = [
  {
    title: "1. Verwerkingsverantwoordelijke",
    content: `Magic Halloween Props is een handelsnaam van All Season Toys (Slegers import vof).\n\nAdres: Pannenweg 306, 6031 RK Nederweert, Nederland\nE-mail: info@allseasontoys.nl\nKvK: 64942708 · BTW: NL855913770B01`,
  },
  {
    title: "2. Welke persoonsgegevens wij verwerken",
    content: "Wij verwerken persoonsgegevens die u zelf aan ons verstrekt bij het plaatsen van een bestelling of het sturen van een contactverzoek:\n\n• Naam en adresgegevens\n• E-mailadres\n• Telefoonnummer (optioneel)\n• Betaalgegevens (verwerkt door onze betaalprovider)\n• IP-adres en browsegedrag (via cookies)",
  },
  {
    title: "3. Doel van de verwerking",
    content: "Wij gebruiken uw gegevens uitsluitend voor:\n\n• Het uitvoeren van uw bestelling en levering\n• Het sturen van een orderbevestiging\n• Het afhandelen van vragen of klachten\n• Het voldoen aan wettelijke verplichtingen\n\nWij verkopen uw gegevens nooit aan derden.",
  },
  {
    title: "4. Bewaartermijn",
    content: "Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk. Ordergegevens worden bewaard conform de wettelijke bewaarplicht van 7 jaar voor de boekhouding.",
  },
  {
    title: "5. Delen met derden",
    content: "Uw gegevens worden uitsluitend gedeeld met:\n\n• Bezorgdiensten (DHL, PostNL) voor de uitvoering van uw bestelling\n• Onze betaalprovider voor de verwerking van betalingen\n\nDeze partijen zijn gebonden aan strikte verwerkersovereenkomsten.",
  },
  {
    title: "6. Cookies",
    content: "Onze website maakt gebruik van functionele cookies die noodzakelijk zijn voor het functioneren van de webshop (zoals uw winkelwagen). Wij plaatsen geen tracking- of advertentiecookies zonder uw toestemming.",
  },
  {
    title: "7. Uw rechten (AVG)",
    content: "U heeft op grond van de AVG de volgende rechten:\n\n• Recht op inzage in uw gegevens\n• Recht op correctie of verwijdering\n• Recht op beperking van de verwerking\n• Recht op dataportabiliteit\n• Recht om bezwaar te maken\n\nStuur een verzoek naar info@allseasontoys.nl. Wij reageren binnen 30 dagen.",
  },
  {
    title: "8. Beveiliging",
    content: "Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beveiligen tegen ongeautoriseerde toegang, verlies of misbruik.",
  },
  {
    title: "9. Klachten",
    content: "Bent u niet tevreden over de manier waarop wij met uw gegevens omgaan? U kunt een klacht indienen bij de Autoriteit Persoonsgegevens via autoriteitpersoonsgegevens.nl.",
  },
  {
    title: "10. Wijzigingen",
    content: "Wij behouden het recht om dit privacybeleid te wijzigen. De meest actuele versie is altijd beschikbaar op deze pagina. Versie: 2026.",
  },
];

export default function PrivacyPage() {
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
            Privacy<span className="text-horror-orange">beleid</span>
          </h1>
          <p className="text-horror-text-muted text-sm mb-12">
            Magic Halloween Props — All Season Toys (Slegers import vof) · Versie 2026
          </p>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title} className="border-b border-horror-border pb-10 last:border-0">
                <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-4">
                  {s.title}
                </h2>
                <div className="text-horror-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {s.content}
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
