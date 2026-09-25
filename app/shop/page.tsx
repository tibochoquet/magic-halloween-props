import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CollectionHero from "@/components/ui/CollectionHero";
import ShopContent from "@/components/pages/ShopContent";
import { wholeHeroSpots } from "@/lib/collectionHeroSpots";

export const metadata: Metadata = {
  title: "Assortiment — alle animatronics",
  alternates: { canonical: "/shop" },
  description: "Alle premium animatronic horror props op voorraad in Nederland. Skeletten, zombies, heksen, geesten, clowns en meer.",
};

export default function ShopPage() {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <CollectionHero
        src="/whole%20collection%20hero-wolfgirl-terrorclown-nun-poppingpumpkin.png"
        alt="Het Gehele Assortiment — Wolf Woman, Halloween pop Terror Clown, Nun From Hell en Popping Pumpkin Man"
        spots={wholeHeroSpots}
        eyebrow="Volledige Collectie"
        title="Horror"
        titleAccent="Collectie"
        subtitle="Alle animatronics op voorraad in ons magazijn in Nederweert. Direct leverbaar of afhalen op afspraak."
      />
      <Suspense><ShopContent /></Suspense>
      <Footer />
    </main>
  );
}
