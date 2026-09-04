import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CollectionHero from "@/components/ui/CollectionHero";
import ScareEffectCollection from "@/components/sections/ScareEffectCollection";
import { scareHeroSpots } from "@/lib/collectionHeroSpots";

export const metadata: Metadata = {
  title: "Scare Effect Animatronics | Magic Halloween Props",
  description:
    "Halloween poppen met ingebouwd scare-effect voor het ultieme jumpscare-moment. Direct op voorraad in Nederland.",
};

export default function ScareEffectsPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <CollectionHero
        src="/scare%20collection%20hero-screaminggirl-angelofdead-risingspirit.png"
        alt="Scare Effect collectie — Screaming Little Girl, Angel Of Dead en Rising Spirit"
        spots={scareHeroSpots}
        eyebrow="Scare Effect Collection"
        title="Scare Effect"
        titleAccent="Animatronics"
        subtitle="Poppen met een ingebouwd schrikeffect, voor het ultieme jumpscare-moment op je Halloween-feest."
        backLink={{ href: "/shop", label: "Terug naar gehele assortiment" }}
      />
      <ScareEffectCollection pageMode />
      <Footer />
    </main>
  );
}
