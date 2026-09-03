import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import SoulLedgerHero from "@/components/sections/SoulLedgerHero";
import Categories from "@/components/sections/Categories";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";
import { professionalProducts } from "@/data/professionalProducts";

export default function Home() {
  const soulLedgerProduct = professionalProducts.find((p) => p.id === "the-collector-of-souls");

  return (
    <main className="relative min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <Hero />
      <FeaturedProducts />
      {soulLedgerProduct && <SoulLedgerHero product={soulLedgerProduct} underFixedHeader={false} />}
      <Categories />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
