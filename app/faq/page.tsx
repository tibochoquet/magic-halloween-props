import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { company } from "@/lib/companyInfo";
import { deliveryTerms, WITHDRAWAL_DAYS } from "@/lib/shopTerms";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Stroomvoorziening, montage, binnen of buiten gebruiken, afmetingen en wat er in de doos zit. De meestgestelde vragen over onze animatronics.",
  alternates: { canonical: "/faq" },
};

/**
 * At €275–€850 people have real questions before they buy. Structure is built;
 * answers marked TODO must come from the operator/supplier — several depend on
 * the same product-safety data as section 5, so chase them together.
 */
type Faq = { q: string; a: string; todo?: boolean };

const groups: { title: string; items: Faq[] }[] = [
  {
    title: "Stroom en aansluiting",
    items: [
      {
        q: "Werken de animatronics op netstroom of op batterijen?",
        a: "Dat verschilt per product. Op elke productpagina staat onder 'Specificaties' en 'Productveiligheid' precies welke voeding dat product nodig heeft — netstroom via een meegeleverde adapter, of batterijen.",
      },
      {
        q: "Wordt de adapter meegeleverd?",
        a: "Bij producten die op netstroom werken wordt de adapter meegeleverd, tenzij anders vermeld bij het product.",
      },
      {
        q: "Zijn de animatronics veilig?",
        a: "Ja. Alle poppen zijn CE-gemarkeerd en werken op batterijen of op laagspanning via een meegeleverde adapter. Er staat dus geen netspanning op de pop zelf.",
      },
    ],
  },
  {
    title: "Montage",
    items: [
      {
        q: "Moet ik de animatronic zelf in elkaar zetten?",
        a: "De meeste modellen worden gedemonteerd geleverd en zijn met de meegeleverde instructies op te bouwen. Grote modellen zijn eenvoudiger met twee personen.",
      },
      {
        q: "Heb ik gereedschap nodig?",
        a: "Nee. De modellen worden gedemonteerd geleverd en klik- of schroefbaar in elkaar gezet met de meegeleverde instructies. Voor de grote modellen boven 1,80 m raden we twee personen aan.",
      },
      {
        q: "Kan ik de animatronic weer demonteren voor opslag?",
        a: "Ja. De meeste modellen zijn volledig demonteerbaar, zodat je ze na het seizoen compact kunt opslaan.",
      },
    ],
  },
  {
    title: "Binnen of buiten",
    items: [
      {
        q: "Kan ik een animatronic buiten neerzetten?",
        a: "Onze animatronics zijn bedoeld voor gebruik binnenshuis of onder een afdak. Ze zijn niet waterdicht. Zet ze nooit onbeschermd in de regen. Per product staat dit vermeld onder 'Productveiligheid'.",
      },
      {
        q: "Mag hij onder een overkapping staan?",
        a: "Ja, mits volledig droog en beschut. Regen, sneeuw en vocht kunnen de elektronica beschadigen. Haal de pop bij twijfel naar binnen."
      },
    ],
  },
  {
    title: "Afmetingen en gewicht",
    items: [
      {
        q: "Hoe groot zijn de animatronics?",
        a: "De hoogte staat bij elk product vermeld, zowel op de productkaart als op de productpagina. Ons assortiment loopt van circa 0,32 m tot 2,25 m.",
      },
      {
        q: "Hoe wordt een groot model bezorgd?",
        a: "Modellen boven 1,80 m worden als groot pakket of op pallet verzonden via DHL of DPD. Zorg dat er iemand aanwezig is om de zending aan te nemen en controleer de verpakking direct op transportschade.",
      },
      {
        q: "Kan ik hem na het seizoen opbergen?",
        a: "Ja. De meeste modellen zijn volledig demonteerbaar, zodat ze compact en droog opgeslagen kunnen worden tot het volgende seizoen.",
      },
    ],
  },
  {
    title: "Wat zit er in de doos",
    items: [
      {
        q: "Wat wordt er meegeleverd?",
        a: "Bij elk product staat onder 'Kenmerken' wat er wordt meegeleverd, bijvoorbeeld een adapter, een deurmat voor activering of een rookmachine.",
      },
      {
        q: "Zit de adapter of batterij erbij?",
        a: "Bij modellen op netstroom wordt de adapter meegeleverd. Bij batterijmodellen staat op de productpagina vermeld of de batterijen zijn inbegrepen — bij de meeste is dat het geval.",
      },
    ],
  },
  {
    title: "Bestellen, levering en retour",
    items: [
      {
        q: "Kan ik online betalen?",
        a: "Op dit moment nog niet. Je kunt via de site een bestelaanvraag doen; wij nemen daarna contact op om de bestelling, levertijd en betaling te bevestigen.",
      },
      {
        q: "Wat is de levertijd?",
        a: deliveryTerms.inStock
          ? `Producten op voorraad worden geleverd in ${deliveryTerms.inStock}, verzonden via ${deliveryTerms.carriers}.`
          : "TODO — levertijd nog aan te leveren. Zie /verzending.",
        todo: !deliveryTerms.inStock,
      },
      {
        q: "Kan ik het product ruilen of terugsturen?",
        a: `Ja. Je hebt ${WITHDRAWAL_DAYS} dagen bedenktijd na ontvangst. Zie de pagina Retourneren voor de volledige voorwaarden en het modelformulier.`,
      },
      {
        q: "Kan ik bestellen en zelf ophalen?",
        a: `Ja, afhalen kan op afspraak in Nederweert. Neem contact op via ${company.email} om een moment af te spreken.`,
      },
    ],
  },
];

export default function FaqPage() {
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

          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-horror-text-primary mb-3">
            Veelgestelde <span className="text-horror-orange">vragen</span>
          </h1>
          <p className="text-horror-text-secondary text-base leading-relaxed mb-14 max-w-xl">
            Stroom, montage, binnen of buiten, afmetingen en wat er in de doos zit. Staat je vraag
            er niet bij? Mail{" "}
            <a href={`mailto:${company.email}`} className="text-horror-orange hover:underline">
              {company.email}
            </a>
            .
          </p>

          <div className="space-y-12">
            {groups.map((g) => (
              <div key={g.title}>
                <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-orange mb-5">
                  {g.title}
                </h2>
                <div className="space-y-5">
                  {g.items.map((item) => (
                    <details key={item.q} className="group border-b border-horror-border pb-5">
                      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                        <span className="text-horror-text-primary text-sm font-medium leading-snug">
                          {item.q}
                        </span>
                        <span className="text-horror-orange text-lg leading-none flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p
                        className={`text-sm leading-relaxed mt-3 ${
                          item.todo ? "text-horror-orange" : "text-horror-text-secondary"
                        }`}
                      >
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 p-6 border border-horror-border bg-horror-card">
            <p className="font-cinzel text-sm font-bold text-horror-text-primary mb-2">
              Nog een vraag?
            </p>
            <p className="text-horror-text-secondary text-sm leading-relaxed mb-4">
              We reageren doorgaans binnen één werkdag met een concreet antwoord.
            </p>
            <Link href="/contact" className="btn-outline">
              Neem contact op
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
