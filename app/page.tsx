import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import SoulLedgerHero from "@/components/sections/SoulLedgerHero";
import Categories from "@/components/sections/Categories";
import FreeGiftBanner from "@/components/ui/FreeGiftBanner";
import Testimonials from "@/components/sections/Testimonials";
import { professionalProducts } from "@/data/professionalProducts";
import { company } from "@/lib/companyInfo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Premium Halloween animatronics op voorraad in Nederland",
  description:
    "Levensgrote animatronics voor haunted houses, escape rooms en Halloween-displays. Direct geïmporteerd, op voorraad in Nederweert, gratis verzending.",
  alternates: { canonical: "/" },
};

// Zodat Google de merknaam kan tonen in plaats van het kale domein. Alleen
// gegevens die ook op de site staan (lib/companyInfo.ts).
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.tradeName,
    url: SITE_URL,
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.tradeName,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/wordmark-light.svg`,
    email: company.email,
  },
];

export default function Home() {
  const soulLedgerProduct = professionalProducts.find((p) => p.id === "the-collector-of-souls");

  return (
    <main id="main" className="relative min-h-screen bg-horror-black overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      {/* Zelfde banner als op /shop en de collectiepagina's — één component,
          zodat drempel en cadeau op één plek staan (lib/promotions.ts). */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-16">
        <FreeGiftBanner />
      </div>
      <FeaturedProducts />
      {soulLedgerProduct && <SoulLedgerHero product={soulLedgerProduct} underFixedHeader={false} />}
      <Categories />
      <Testimonials />
      <Footer />
    </main>
  );
}
