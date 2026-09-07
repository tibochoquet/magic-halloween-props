import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/pages/LegalPageLayout";
import { company, addressLineFull } from "@/lib/companyInfo";
import {
  WITHDRAWAL_DAYS,
  RETURN_WINDOW_DAYS,
  REFUND_DAYS,
  returnPolicy,
} from "@/lib/shopTerms";

export const metadata: Metadata = {
  title: "Retourneren en herroepingsrecht",
  alternates: { canonical: "/retourneren" },
  description:
    "Je hebt 14 dagen bedenktijd. Lees hoe je je bestelling herroept, binnen welke termijn je retourneert en wanneer je je geld terugkrijgt.",
};

/** Renders a value, or a loud build-blocking TODO marker when not yet supplied. */
function Todo({ what }: { what: string }) {
  return (
    <span className="inline-block px-2 py-0.5 bg-horror-orange/15 border border-horror-orange/40 text-horror-orange text-xs font-bold tracking-wide">
      TODO — {what}
    </span>
  );
}

export default function RetournerenPage() {
  const payer =
    returnPolicy.paidBy === "customer"
      ? "De kosten van de retourzending zijn voor jouw rekening."
      : returnPolicy.paidBy === "seller"
        ? "Wij betalen de kosten van de retourzending."
        : null;

  return (
    <LegalPageLayout
      eyebrow="Klantenservice"
      title="Retourneren en "
      titleAccent="herroepingsrecht"
      lastUpdated="2026-09-06"
      intro={
        <p className="text-horror-text-secondary text-base leading-relaxed">
          Je koopt op afstand, dus je hebt wettelijk {WITHDRAWAL_DAYS} dagen bedenktijd. Op deze
          pagina staat precies hoe dat werkt: wanneer de termijn begint, hoe je ons laat weten dat
          je de koop herroept, hoe lang je daarna hebt om terug te sturen, en wanneer je je geld
          terugkrijgt.
        </p>
      }
      sections={[
        {
          title: `1. Je hebt ${WITHDRAWAL_DAYS} dagen bedenktijd`,
          content:
            `Je mag de overeenkomst binnen ${WITHDRAWAL_DAYS} dagen zonder opgave van redenen ontbinden.\n\n` +
            `De termijn begint te lopen op de dag nadat jij — of een door jou aangewezen derde die niet de vervoerder is — het product fysiek in ontvangst hebt genomen.\n\n` +
            `Bestaat je bestelling uit meerdere producten die apart worden geleverd? Dan begint de termijn op de dag nadat je het laatste product hebt ontvangen.`,
        },
        {
          title: "2. Hoe je de koop herroept",
          body: (
            <div className="text-horror-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                Laat ons binnen de bedenktijd ondubbelzinnig weten dat je de koop herroept. Dat kan
                op twee manieren:
              </p>
              <ul className="space-y-2 list-none">
                <li className="flex gap-2.5">
                  <span className="text-horror-orange flex-shrink-0">•</span>
                  <span>
                    Stuur een e-mail naar{" "}
                    <a href={`mailto:${company.email}`} className="text-horror-orange hover:underline">
                      {company.email}
                    </a>{" "}
                    met je naam, bestelnummer en de mededeling dat je de koop herroept.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-horror-orange flex-shrink-0">•</span>
                  <span>
                    Of gebruik het{" "}
                    <Link href="/retourneren/modelformulier" className="text-horror-orange hover:underline">
                      modelformulier voor herroeping
                    </Link>
                    . Dat is niet verplicht, maar mag altijd.
                  </span>
                </li>
              </ul>
              <p>
                Je hoeft geen reden op te geven. Wij bevestigen de ontvangst van je melding.
              </p>
            </div>
          ),
        },
        {
          title: `3. Terugsturen: ${RETURN_WINDOW_DAYS} dagen na je melding`,
          body: (
            <div className="text-horror-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                Nadat je hebt gemeld dat je herroept, heb je nog {RETURN_WINDOW_DAYS} dagen om het
                product terug te sturen of af te geven.
              </p>
              <p>
                Behandel het product en de verpakking zorgvuldig. Je mag het uitpakken en bekijken
                zoals je in een winkel zou doen. Gebruik je het verder dan dat, dan kunnen wij de
                waardevermindering in rekening brengen.
              </p>
              <div className="pt-2">
                <p className="text-horror-text-muted text-xs tracking-widest uppercase mb-2">
                  Retouradres
                </p>
                {returnPolicy.returnAddress ? (
                  <p className="whitespace-pre-line">{returnPolicy.returnAddress}</p>
                ) : (
                  <Todo what="retouradres aanleveren (niet automatisch gelijk aan het bezoekadres)" />
                )}
              </div>
            </div>
          ),
        },
        {
          title: "4. Kosten van de retourzending",
          body: (
            <div className="text-horror-text-secondary text-sm leading-relaxed space-y-4">
              {payer ? <p>{payer}</p> : <Todo what="wie de retourkosten betaalt vastleggen" />}
              <p>
                Deze animatronics zijn groot en zwaar — tot 2,13 meter. Een retour is daarom geen
                standaard pakketzending. De verwachte kosten per formaat:
              </p>
              <div className="border border-horror-border divide-y divide-horror-border">
                {returnPolicy.costsBySizeClass.map((c) => (
                  <div key={c.label} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-horror-text-muted text-xs tracking-wide uppercase">
                      {c.label}
                    </span>
                    <span className="text-right">
                      {c.costEur !== null ? (
                        <span className="text-horror-text-primary font-medium">
                          €{c.costEur.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <Todo what="tarief" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-horror-text-muted text-xs">
                Deze kosten worden vóór het plaatsen van je bestelling getoond. Wordt dit niet vooraf
                gemeld, dan komen de retourkosten wettelijk voor rekening van de verkoper.
              </p>
            </div>
          ),
        },
        {
          title: `5. Terugbetaling binnen ${REFUND_DAYS} dagen`,
          content:
            `Wij betalen het volledige aankoopbedrag terug, inclusief de standaard verzendkosten die je bij de bestelling hebt betaald, binnen ${REFUND_DAYS} dagen nadat je hebt gemeld dat je herroept.\n\n` +
            `Wij mogen wachten met terugbetalen tot wij het product terug hebben ontvangen, of tot jij hebt aangetoond dat je het hebt teruggestuurd — wat het eerst valt.\n\n` +
            `Terugbetaling gebeurt met hetzelfde betaalmiddel als waarmee je hebt betaald, tenzij je uitdrukkelijk met iets anders instemt. Hier zijn voor jou geen kosten aan verbonden.\n\n` +
            `Heb je gekozen voor een duurdere verzendmethode dan onze standaardlevering, dan hoeven wij het meerdere daarvan niet terug te betalen.`,
        },
        {
          title: "6. Uitzonderingen",
          content:
            `Het herroepingsrecht geldt niet voor producten die volgens jouw specificaties zijn gemaakt of duidelijk persoonlijk van aard zijn, en niet voor producten die om redenen van hygiëne of gezondheidsbescherming verzegeld waren en waarvan de verzegeling na levering is verbroken.\n\n` +
            `Voor het standaard assortiment animatronics geldt het herroepingsrecht onverkort.`,
        },
        {
          title: "7. Garantie en conformiteit",
          content:
            `Los van het herroepingsrecht heb je altijd recht op een product dat aan de overeenkomst voldoet. Is het product defect of anders dan afgesproken, neem dan contact op via ${company.email}. De wettelijke garantiebepalingen blijven onverkort van toepassing.`,
        },
        {
          title: "8. Vragen over een retour",
          content:
            `Neem contact op via ${company.email}${company.phone ? ` of ${company.phone}` : ""}. Vermeld je bestelnummer, dan handelen we het zo snel mogelijk af.\n\n` +
            `${company.umbrellaTradeName} · ${company.statutoryName}\n${addressLineFull}\nKvK ${company.kvk} · BTW ${company.vatId}`,
        },
      ]}
    >
      <div className="mt-12 p-6 border border-horror-orange/30 bg-horror-orange/5">
        <p className="font-cinzel text-sm font-bold text-horror-text-primary mb-2">
          Modelformulier voor herroeping
        </p>
        <p className="text-horror-text-secondary text-sm leading-relaxed mb-4">
          Wil je het formulier gebruiken? Vul het in en stuur het naar {company.email}.
        </p>
        <Link href="/retourneren/modelformulier" className="btn-outline">
          Open het modelformulier
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </LegalPageLayout>
  );
}
