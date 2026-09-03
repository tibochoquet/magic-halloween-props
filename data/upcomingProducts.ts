import type { Product } from "@/types";
import { style } from "@/data";

export const upcomingProducts: Product[] = [
  {
    id: "the-collector-of-souls",
    name: "The Collector of Souls",
    category: "reaper",
    price: 850,
    availability: "unavailable",
    availabilityNote: "Verwacht januari 2027",
    notifyOnRestock: true,
    description:
      "Hoog boven zijn bezoekers torent The Collector of Souls: een duistere gestalte met een pratende schedel, een beweegbare kaak en gele ogen die in het donker oplichten. Kop en armen bewegen terwijl hij spreekt — een verschijning die je liever niet alleen tegenkomt.\n\nDe animatronic is 213 cm hoog na montage en werkt op 230V via de meegeleverde EU-adapter. Activeren kan continu, via de ingebouwde bewegingssensor, of met de meegeleverde deurmat. Montage met twee personen wordt aanbevolen. Geschikt voor binnen; buiten alleen onder een afdak.",
    features: [
      "Bewegende kop en armen",
      "Pratende schedel met beweegbare kaak",
      "Oplichtende gele ogen",
      "Continu, bewegingsmelder of voetmatactivering",
      "Materiaal: metaal, latex, kunststof en polyester",
      "Inclusief EU-adapter en deurmat",
    ],
    height: "2,13 m",
    image: "/products/The%20Collector%20of%20Souls.png",
    video: "/products/The%20Collector%20of%20Souls.mp4",
    ...style.reaper,
  },
  {
    id: "rocking-horse-girl",
    name: "Rocking Horse Girl",
    category: "ghost",
    price: 275,
    availability: "unavailable",
    availabilityNote: "Verwacht januari 2027",
    notifyOnRestock: true,
    description:
      "Op het eerste gezicht een onschuldig meisje op haar hobbelpaard — tot ze in beweging komt. Rocking Horse Girl schommelt zachtjes heen en weer terwijl haar ogen rood oplichten en ze een van drie kinderliedjes inzet, geluidsgeactiveerd zodra er iemand in de buurt komt.\n\nDe animatronic weegt 6,6 kg en wordt geleverd met een 5,9V/2A-adapter, inclusief volumeregeling en een aansluiting voor een externe speaker. Step pad en try-me button zijn los verkrijgbaar. Alleen te gebruiken op een overdekte plek.",
    features: [
      "Schommelt heen en weer op haar hobbelpaard",
      "Ogen lichten rood op",
      "Speelt drie kinderliedjes",
      "Geluidsgeactiveerd met volumeregeling",
      "Aansluiting voor externe speaker",
      "Materiaal: metaal, kunststof en textiel",
    ],
    height: "0,86 × 0,38 × 0,76 m",
    image: "/products/Rocking%20Horse%20Girl.png",
    ...style.ghost,
  },
];
