import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CollectionHero from "@/components/ui/CollectionHero";
import ShopContent from "@/components/pages/ShopContent";
import { standardHeroSpots } from "@/lib/collectionHeroSpots";

export const metadata: Metadata = {
  title: "Halloween Props | Magic Halloween Props — All Season Toys",
  description:
    "Premium Halloween animatronic horror props on stock in the Netherlands. Skeletons, zombies, witches, ghosts, clowns and more — direct shipping.",
};

export default function HalloweenPropsPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <CollectionHero
        src="/standaard%20collection%20hero-psychoclown-horrible%20pumpkin-evilwitch.png"
        alt="Standaard Halloween Props — Halloween pop Horrible Pumpkin, Halloween pop Evil Witch en Halloween pop Psycho Clown"
        spots={standardHeroSpots}
        eyebrow="Halloween Collection"
        title="Standaard"
        titleAccent="Halloween Props"
        subtitle="Premium animatronics voor thuisdecoratie, feesten en seizoensevenementen."
        backLink={{ href: "/shop", label: "Terug naar gehele assortiment" }}
      />
      <Suspense>
        <ShopContent variant="standard" />
      </Suspense>
      <Footer />
    </main>
  );
}
