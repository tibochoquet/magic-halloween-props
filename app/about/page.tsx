import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutContent from "@/components/pages/AboutContent";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "All Season Toys (Slegers import vof) importeert en verkoopt premium Halloween animatronics vanuit Nederweert. Eigen voorraad, bekijken op afspraak.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <AboutContent />
      <Footer />
    </main>
  );
}
