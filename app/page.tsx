import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import SoulLedgerHero from "@/components/sections/SoulLedgerHero";
import Categories from "@/components/sections/Categories";
import Testimonials from "@/components/sections/Testimonials";
import { professionalProducts } from "@/data/professionalProducts";

export const metadata: Metadata = {
  title: "Premium Halloween animatronics op voorraad in Nederland",
  description:
    "Levensgrote animatronics voor haunted houses, escape rooms en Halloween-displays. Direct geïmporteerd, op voorraad in Nederweert, gratis verzending.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const soulLedgerProduct = professionalProducts.find((p) => p.id === "the-collector-of-souls");

  return (
    <main id="main" className="relative min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <Hero />
      <FeaturedProducts />
      {soulLedgerProduct && <SoulLedgerHero product={soulLedgerProduct} underFixedHeader={false} />}
      <Categories />
      <Testimonials />
      <Footer />
    </main>
  );
}
