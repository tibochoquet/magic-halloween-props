import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfessionalCollection from "@/components/sections/ProfessionalCollection";

export const metadata: Metadata = {
  title: "Professional Animatronics | Magic Halloween Props",
  description:
    "High-end cinematic animatronics for haunted attractions, escape rooms and professional horror experiences. 23 professional grade props, direct from stock in the Netherlands.",
};

export default function ProfessionalAnimatronicsPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <ProfessionalCollection pageMode />
      <Footer />
    </main>
  );
}
