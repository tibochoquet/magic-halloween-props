import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CollectionHero from "@/components/ui/CollectionHero";
import ProfessionalCollection from "@/components/sections/ProfessionalCollection";
import { professionalHeroSpots } from "@/lib/collectionHeroSpots";

export const metadata: Metadata = {
  title: "Professional animatronics",
  alternates: { canonical: "/professional-animatronics" },
  description:
    "High-end animatronics voor haunted houses, escape rooms en professionele horrorattracties. Eigen voorraad in Nederweert, gratis verzending.",
};

export default function ProfessionalAnimatronicsPage() {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <CollectionHero
        src="/pro%20collection%20hero-bloodwerewolf-ridingdead-smoderingscarecrow.png"
        alt="Professional Animatronics collectie — Bloodthirsty Werewolf, Riding Dead en Pumpkin Hollow Smoldering Ghoul Scarecrow"
        spots={professionalHeroSpots}
        heroKey="pro"
      />
      <ProfessionalCollection pageMode />
      <Footer />
    </main>
  );
}
