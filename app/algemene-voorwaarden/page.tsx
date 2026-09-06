import type { Metadata } from "next";
import LegalPageLayout from "@/components/pages/LegalPageLayout";
import { company, addressLineFull } from "@/lib/companyInfo";
import {
  WITHDRAWAL_DAYS,
  RETURN_WINDOW_DAYS,
  REFUND_DAYS,
  returnPolicy,
  deliveryTerms,
} from "@/lib/shopTerms";

export const metadata: Metadata = {
  title: "Algemene voorwaarden | Magic Halloween Props",
  description:
    "De algemene voorwaarden van Magic Halloween Props (All Season Toys, Slegers import vof) voor koop op afstand door consumenten.",
};

/**
 * NOTE: content is deliberately conservative and factual. It restates statutory
 * consumer rights and points at the dedicated pages for detail. Anything
 * business-specific that has not been supplied is rendered as an explicit TODO
 * rather than invented — see lib/shopTerms.ts.
 */
const returnCostSentence =
  returnPolicy.paidBy === "customer"
    ? "De rechtstreekse kosten van het terugzenden zijn voor rekening van de consument. Deze kosten worden vóór het plaatsen van de bestelling vermeld."
    : returnPolicy.paidBy === "seller"
      ? "De rechtstreekse kosten van het terugzenden komen voor rekening van de ondernemer."
      : "TODO — vastleggen wie de rechtstreekse kosten van het terugzenden draagt. Wordt dit niet vóór de bestelling vermeld, dan komen deze kosten wettelijk voor rekening van de ondernemer.";

const articles = [
  {
    title: "Artikel 1 – Identiteit van de ondernemer",
    content:
      `${company.tradeName} is een handelsnaam van ${company.statutoryName} ` +
      `(${company.legalForm}), handelend onder ${company.umbrellaTradeName}, ` +
      `gevestigd te ${addressLineFull}.\n\n` +
      `E-mail: ${company.email}\n` +
      (company.phone ? `Telefoon: ${company.phone}\n` : `Telefoon: TODO — nog aan te leveren\n`) +
      `KvK-nummer: ${company.kvk}\n` +
      `BTW-identificatienummer: ${company.vatId}`,
  },
  {
    title: "Artikel 2 – Toepasselijkheid",
    content:
      "Deze algemene voorwaarden zijn van toepassing op elk aanbod van de ondernemer en op elke tot stand gekomen overeenkomst op afstand tussen ondernemer en consument.\n\n" +
      "Voordat de overeenkomst op afstand wordt gesloten, wordt de tekst van deze algemene voorwaarden aan de consument beschikbaar gesteld. De consument kan deze opslaan of afdrukken.",
  },
  {
    title: "Artikel 3 – Het aanbod",
    content:
      "Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden producten. Kennelijke vergissingen of fouten in het aanbod binden de ondernemer niet.\n\n" +
      "Elk aanbod vermeldt de prijs inclusief btw, de eventuele verzendkosten, de wijze van levering, de levertermijn en of het herroepingsrecht van toepassing is.",
  },
  {
    title: "Artikel 4 – De overeenkomst",
    content:
      "De overeenkomst komt tot stand op het moment waarop de consument het aanbod aanvaardt en aan de daarbij gestelde voorwaarden voldoet.\n\n" +
      "De ondernemer bevestigt de ontvangst van de aanvaarding langs elektronische weg. Zolang de ontvangst van deze aanvaarding niet is bevestigd, kan de consument de overeenkomst ontbinden.",
  },
  {
    title: "Artikel 5 – Prijs",
    content:
      "Alle vermelde prijzen zijn in euro's en inclusief btw. Het geldende btw-tarief is 21%.\n\n" +
      "Verzending binnen Nederland is kosteloos. Eventuele bijkomende kosten worden vóór het plaatsen van de bestelling duidelijk vermeld in het besteloverzicht.\n\n" +
      "Gedurende de in het aanbod vermelde geldigheidsduur worden de prijzen niet verhoogd, behoudens prijswijzigingen als gevolg van veranderingen in btw-tarieven.",
  },
  {
    title: "Artikel 6 – Levering en uitvoering",
    content:
      `De ondernemer neemt de grootst mogelijke zorgvuldigheid in acht bij de uitvoering van bestellingen. Als plaats van levering geldt het adres dat de consument heeft opgegeven.\n\n` +
      `Levertermijn voor producten op voorraad: ${deliveryTerms.inStock ?? "TODO — levertermijn nog aan te leveren"}.\n` +
      `Verzending geschiedt via ${deliveryTerms.carriers}. Afhalen op afspraak is mogelijk.\n\n` +
      `Producten die niet leverbaar zijn kunnen niet worden besteld. Bij het product staat vermeld wanneer het naar verwachting weer beschikbaar is.\n\n` +
      `Wordt een bestelling onverhoopt niet of slechts gedeeltelijk uitgevoerd, dan ontvangt de consument uiterlijk 30 dagen na plaatsing van de bestelling bericht en heeft hij het recht de overeenkomst kosteloos te ontbinden.\n\n` +
      `Het risico van beschadiging of vermissing berust bij de ondernemer tot het moment van bezorging aan de consument.`,
  },
  {
    title: "Artikel 7 – Herroepingsrecht",
    content:
      `De consument kan de overeenkomst gedurende ${WITHDRAWAL_DAYS} dagen zonder opgave van redenen ontbinden. Deze bedenktijd gaat in op de dag nadat de consument, of een door hem aangewezen derde die niet de vervoerder is, het product heeft ontvangen.\n\n` +
      `De consument meldt de herroeping via een ondubbelzinnige verklaring, bijvoorbeeld per e-mail aan ${company.email} of met het modelformulier voor herroeping. Gebruik van het modelformulier is niet verplicht.\n\n` +
      `Na de melding heeft de consument nog ${RETURN_WINDOW_DAYS} dagen om het product terug te zenden.\n\n` +
      `Tijdens de bedenktijd gaat de consument zorgvuldig om met het product en de verpakking. Hij mag het product slechts uitpakken en gebruiken voor zover nodig om de aard en kenmerken vast te stellen, zoals in een winkel. Bij verdergaand gebruik kan de ondernemer de waardevermindering in rekening brengen.\n\n` +
      `${returnCostSentence}`,
  },
  {
    title: "Artikel 8 – Terugbetaling",
    content:
      `De ondernemer vergoedt alle betalingen van de consument, inclusief de standaard leveringskosten, onverwijld doch uiterlijk binnen ${REFUND_DAYS} dagen na de melding van herroeping.\n\n` +
      `De ondernemer mag wachten met terugbetalen tot hij het product heeft ontvangen, of tot de consument heeft aangetoond dat hij het product heeft teruggezonden — al naar gelang welk tijdstip eerder valt.\n\n` +
      `Terugbetaling geschiedt met hetzelfde betaalmiddel als waarmee de consument heeft betaald, tenzij de consument uitdrukkelijk met een andere wijze instemt. Voor de terugbetaling worden geen kosten in rekening gebracht.\n\n` +
      `Heeft de consument gekozen voor een duurdere leveringswijze dan de goedkoopste standaardlevering, dan hoeft de ondernemer de bijkomende kosten daarvan niet terug te betalen.`,
  },
  {
    title: "Artikel 9 – Uitsluiting herroepingsrecht",
    content:
      "Het herroepingsrecht geldt niet voor producten die volgens specificaties van de consument zijn vervaardigd, die duidelijk persoonlijk van aard zijn, of die om redenen van gezondheidsbescherming of hygiëne verzegeld waren en waarvan de verzegeling na levering is verbroken.\n\n" +
      "Voor het reguliere assortiment animatronics geldt het herroepingsrecht onverkort.",
  },
  {
    title: "Artikel 10 – Betaling",
    content:
      "Betaling geschiedt bij het plaatsen van de bestelling via de aangeboden betaalmethoden. De consument heeft de plicht onjuistheden in verstrekte betaalgegevens onverwijld te melden.\n\n" +
      "Bij niet-tijdige betaling is de ondernemer gerechtigd de wettelijk toegestane kosten in rekening te brengen, na voorafgaande aanmaning en een redelijke termijn om alsnog te betalen.",
  },
  {
    title: "Artikel 11 – Conformiteit en garantie",
    content:
      `De ondernemer staat ervoor in dat de producten voldoen aan de overeenkomst, aan de in het aanbod vermelde specificaties, en aan de redelijke eisen van deugdelijkheid en bruikbaarheid.\n\n` +
      `Op alle producten gelden de wettelijke garantiebepalingen. Een door de ondernemer, fabrikant of importeur verstrekte garantie doet niets af aan de wettelijke rechten die de consument kan uitoefenen.\n\n` +
      `Bij defecten of klachten kan de consument contact opnemen via ${company.email}.`,
  },
  {
    title: "Artikel 12 – Productveiligheid",
    content:
      "De aangeboden producten zijn elektrisch aangedreven en bevatten bewegende delen. Bij elk product worden de fabrikant, de in de EU gevestigde verantwoordelijke persoon, de aansluitspanning en de veiligheidswaarschuwingen vermeld.\n\n" +
      "De consument dient de meegeleverde gebruiksaanwijzing en waarschuwingen op te volgen, waaronder aanwijzingen over gebruik binnenshuis, montage door twee personen en leeftijdsindicatie.",
  },
  {
    title: "Artikel 13 – Klachten",
    content:
      `Klachten over de uitvoering van de overeenkomst dienen binnen bekwame tijd nadat de consument de gebreken heeft geconstateerd, volledig en duidelijk omschreven te worden ingediend via ${company.email}.\n\n` +
      `Ingediende klachten worden binnen een termijn van 14 dagen na ontvangst beantwoord. Is een klacht niet in onderling overleg op te lossen, dan kan de consument het geschil voorleggen aan de bevoegde Nederlandse rechter.`,
  },
  {
    title: "Artikel 14 – Toepasselijk recht",
    content:
      "Op overeenkomsten tussen de ondernemer en de consument is uitsluitend Nederlands recht van toepassing. Dwingendrechtelijke bepalingen van het land waar de consument zijn gewone verblijfplaats heeft blijven onverlet.",
  },
];

export default function AlgemeneVoorwaardenPage() {
  return (
    <LegalPageLayout
      title="Algemene "
      titleAccent="voorwaarden"
      lastUpdated="2026-09-06"
      sections={articles}
    />
  );
}
