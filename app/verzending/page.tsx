import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/pages/LegalPageLayout";
import { company, addressLineFull } from "@/lib/companyInfo";
import { deliveryTerms, WITHDRAWAL_DAYS } from "@/lib/shopTerms";

export const metadata: Metadata = {
  title: "Verzending en levering | Magic Halloween Props",
  description:
    "Verzendkosten, levertijden en afhalen op afspraak. Alles wat je moet weten voordat je bestelt bij Magic Halloween Props.",
};

function Todo({ what }: { what: string }) {
  return (
    <span className="inline-block px-2 py-0.5 bg-horror-orange/15 border border-horror-orange/40 text-horror-orange text-xs font-bold tracking-wide">
      TODO — {what}
    </span>
  );
}

export default function VerzendingPage() {
  return (
    <LegalPageLayout
      eyebrow="Klantenservice"
      title="Verzending en "
      titleAccent="levering"
      lastUpdated="2026-09-06"
      intro={
        <p className="text-horror-text-secondary text-base leading-relaxed">
          Onze animatronics zijn groot — tot 2,13 meter. Hieronder staat wat dat betekent voor
          bezorging, levertijd en afhalen.
        </p>
      }
      sections={[
        {
          title: "1. Verzendkosten",
          content:
            `Verzending binnen Nederland is gratis. De prijs die je op de productpagina ziet is de prijs die je betaalt: inclusief btw en inclusief verzending.\n\n` +
            `De verzendkosten worden ook getoond in het besteloverzicht, vóór je de bestelling plaatst.`,
        },
        {
          title: "2. Levertijd",
          body: (
            <div className="text-horror-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                Producten met de status <span className="text-horror-text-primary">op voorraad</span>{" "}
                liggen fysiek in ons magazijn in Nederweert.
              </p>
              <div className="border border-horror-border divide-y divide-horror-border">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-horror-text-muted text-xs tracking-wide uppercase">
                    Op voorraad
                  </span>
                  <span>
                    {deliveryTerms.inStock ?? <Todo what="levertijd, bijv. 1-3 werkdagen" />}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-horror-text-muted text-xs tracking-wide uppercase">
                    Afhalen op afspraak
                  </span>
                  <span>{deliveryTerms.pickup ?? <Todo what="afhaaltermijn" />}</span>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-horror-text-muted text-xs tracking-wide uppercase">
                    Vervoerder
                  </span>
                  <span className="text-horror-text-primary">{deliveryTerms.carriers}</span>
                </div>
              </div>
              <p className="text-horror-text-muted text-xs">
                De levertijd staat ook op elke productpagina, zodat je die ziet vóórdat je bestelt.
              </p>
            </div>
          ),
        },
        {
          title: "3. Producten die nog niet leverbaar zijn",
          content:
            `Een deel van het assortiment is tijdelijk niet leverbaar of arriveert later. Dat staat altijd duidelijk bij het product, met de verwachte datum waarop het weer te bestellen is.\n\n` +
            `Producten die niet leverbaar zijn, kun je niet bestellen. De bestelknop is dan uitgeschakeld en toont de reden. Je kunt je e-mailadres achterlaten om bericht te krijgen zodra het product er is.`,
        },
        {
          title: "4. Afhalen op afspraak",
          content:
            `Je kunt je bestelling ook zelf ophalen in Nederweert. Dat kan uitsluitend op afspraak — neem vooraf contact op via ${company.email}.\n\n` +
            `${addressLineFull}`,
        },
        {
          title: "5. Bezorging van grote producten",
          content:
            `Producten boven 1,80 meter worden als groot pakket of pallet verzonden. Zorg dat er iemand aanwezig is om de zending in ontvangst te nemen.\n\n` +
            `Controleer de verpakking bij ontvangst op transportschade. Meld zichtbare schade binnen bekwame tijd, zodat wij dit met de vervoerder kunnen opnemen.`,
        },
        {
          title: "6. Niet tevreden?",
          body: (
            <p className="text-horror-text-secondary text-sm leading-relaxed">
              Je hebt {WITHDRAWAL_DAYS} dagen bedenktijd. Lees hoe herroepen werkt op{" "}
              <Link href="/retourneren" className="text-horror-orange hover:underline">
                retourneren en herroepingsrecht
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
