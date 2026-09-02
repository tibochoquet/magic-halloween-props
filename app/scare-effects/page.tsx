import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScareEffectCollection from "@/components/sections/ScareEffectCollection";

export const metadata: Metadata = {
  title: "Scare Effect Animatronics | Magic Halloween Props",
  description:
    "Halloween poppen met ingebouwd scare-effect voor het ultieme jumpscare-moment. Direct op voorraad in Nederland.",
};

export default function ScareEffectsPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <ScareEffectCollection pageMode />
      <Footer />
    </main>
  );
}
