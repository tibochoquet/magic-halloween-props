import type { Metadata } from "next";
import LegalPageLayout from "@/components/pages/LegalPageLayout";
import { company, addressLineFull, identitySentence } from "@/lib/companyInfo";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Welke persoonsgegevens Magic Halloween Props verwerkt, waarvoor, hoe lang wij ze bewaren en welke rechten je hebt onder de AVG.",
  alternates: { canonical: "/privacy" },
};

/**
 * FACTUAL BASIS — measured against the running site, not assumed:
 *
 *   Cookies set ............ NONE (empty browser profile, walked
 *                            home → product → add to cart → checkout)
 *   localStorage ........... "lang" (nl/en preference, LanguageContext)
 *                            "mhp_cart_v1" (cart contents, CartContext)
 *   sessionStorage ......... NONE
 *   Third-party hosts ...... va.vercel-scripts.com (Vercel Analytics) only
 *   Fonts .................. self-hosted at /_next/static/media/*.woff2 via
 *                            next/font — no request to Google Fonts
 *   Payment provider ....... NONE (no Stripe/Mollie; checkout hands the order
 *                            to the visitor's own mail client)
 *   Server-side storage .... NONE (no database, no API routes, no server actions)
 *
 * The previous version of this page claimed that payment data was processed by
 * a payment provider, that functional cookies were set, that IP address and
 * browsing behaviour were collected via cookies, and that order data was kept
 * for 7 years. None of that was true of this site. An inaccurate privacy
 * statement is worse than a thin one, so those claims are removed rather than
 * reworded.
 *
 * TODO (legal review): the operator's lawyer should confirm the wording, the
 * legal basis per processing purpose, and the retention table — and this page
 * must be revisited the moment a payment provider or order storage is added.
 */
const sections = [
  {
    title: "1. Verwerkingsverantwoordelijke",
    content:
      `${identitySentence}\n\n` +
      `Adres: ${addressLineFull}\n` +
      `E-mail: ${company.email}\n` +
      (company.phone ? `Telefoon: ${company.phone}\n` : "Telefoon: TODO — nog aan te leveren\n") +
      `KvK: ${company.kvk} · BTW: ${company.vatId ?? "TODO — nog aan te leveren"}`,
  },
  {
    title: "2. Welke gegevens wij verwerken",
    content:
      "Contactformulier — naam, e-mailadres, onderwerp en de inhoud van je bericht.\n\n" +
      "Bestelaanvraag — naam, e-mailadres, telefoonnummer, adres en eventuele opmerkingen. Belangrijk: deze gegevens worden door deze website niet opgeslagen en niet automatisch naar ons verstuurd. Je eigen e-mailprogramma wordt geopend met de gegevens erin; pas als jij die e-mail zelf verstuurt, ontvangen wij ze.\n\n" +
      "Voorraadmelding — je e-mailadres, als je wilt weten wanneer een product weer leverbaar is.\n\n" +
      "Wij verwerken géén betaalgegevens. Er is op dit moment geen betaalprovider aan deze website gekoppeld en er kan via de website niet worden betaald.",
  },
  {
    title: "3. Cookies",
    content:
      "Deze website plaatst geen cookies. Niet voor functionaliteit, niet voor statistieken en niet voor advertenties.\n\n" +
      "Daarom vragen wij ook geen cookietoestemming: er is niets om toestemming voor te geven.",
  },
  {
    title: "4. Lokale opslag in je browser",
    content:
      "Wij bewaren twee dingen lokaal in je eigen browser (localStorage). Deze blijven op je apparaat en worden niet naar ons of naar derden verstuurd:\n\n" +
      "• lang — je taalkeuze (Nederlands of Engels)\n" +
      "• mhp_cart_v1 — de inhoud van je winkelwagen, zodat die bewaard blijft als je de pagina ververst\n\n" +
      "Je kunt deze op elk moment wissen via de instellingen van je browser.",
  },
  {
    title: "5. Statistieken",
    content:
      "Wij gebruiken Vercel Analytics om te zien hoeveel bezoekers de site heeft en welke pagina's worden bekeken.\n\n" +
      "Vercel Analytics werkt zonder cookies, volgt je niet over andere websites en bouwt geen profiel van je op.\n\n" +
      "Hiervoor wordt verbinding gemaakt met va.vercel-scripts.com.",
  },
  {
    title: "6. Lettertypen en externe bronnen",
    content:
      "De lettertypen worden vanaf onze eigen server geladen. Er wordt geen verbinding gemaakt met Google Fonts of een ander extern lettertype-netwerk.\n\n" +
      "Behalve Vercel Analytics laadt deze website geen bronnen van derden.",
  },
  {
    title: "7. Doel van de verwerking",
    content:
      "Wij gebruiken je gegevens uitsluitend om je vraag of aanvraag te beantwoorden en, als het tot een bestelling komt, om die uit te voeren en je op de hoogte te houden.\n\n" +
      "TODO — grondslag per verwerkingsdoel laten vaststellen bij juridische controle.",
  },
  {
    title: "8. Bewaartermijn",
    content:
      "E-mailcorrespondentie bewaren wij zolang dat nodig is om je vraag af te handelen en om eventuele garantie- of retourvragen te kunnen beoordelen.\n\n" +
      "Komt het tot een daadwerkelijke verkoop, dan geldt voor de administratie de wettelijke fiscale bewaarplicht van 7 jaar.\n\n" +
      "TODO — concrete bewaartermijnen per categorie vaststellen bij juridische controle.",
  },
  {
    title: "9. Delen met derden",
    content:
      "Wij verkopen je gegevens nooit.\n\n" +
      "Bij een daadwerkelijke bestelling delen wij je naam en adres met de vervoerder (DHL of DPD) om te kunnen bezorgen.\n\n" +
      "Onze website wordt gehost door Vercel, dat daarbij de technische gegevens verwerkt die nodig zijn om de site te tonen.\n\n" +
      "TODO — verwerkersovereenkomsten vastleggen met de partijen die daadwerkelijk gegevens verwerken.",
  },
  {
    title: "10. Jouw rechten",
    content:
      "Je hebt op grond van de AVG recht op inzage, correctie, verwijdering, beperking van de verwerking, dataportabiliteit en het recht bezwaar te maken.\n\n" +
      `Stuur een verzoek naar ${company.email}. Wij reageren binnen 30 dagen.`,
  },
  {
    title: "11. Beveiliging",
    content:
      "De website wordt uitsluitend via een beveiligde verbinding (HTTPS) aangeboden.\n\n" +
      "Omdat er via de website geen betalingen plaatsvinden en er geen klantgegevens in een database worden opgeslagen, is de hoeveelheid gegevens die wij bewaren beperkt.",
  },
  {
    title: "12. Klachten",
    content:
      "Ben je niet tevreden over hoe wij met je gegevens omgaan? Je kunt een klacht indienen bij de Autoriteit Persoonsgegevens via autoriteitpersoonsgegevens.nl.",
  },
  {
    title: "13. Wijzigingen",
    content:
      "Wij kunnen dit privacybeleid aanpassen, bijvoorbeeld wanneer er een betaalprovider aan de website wordt gekoppeld. De actuele versie staat altijd op deze pagina, met de datum van laatste wijziging bovenaan.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy"
      titleAccent="beleid"
      lastUpdated="2026-09-07"
      sections={sections}
    />
  );
}
