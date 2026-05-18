import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShopContent from "@/components/pages/ShopContent";

export const metadata: Metadata = {
  title: "Assortiment | Magic Halloween Props — All Season Toys",
  description: "Alle premium animatronic horror props op voorraad in Nederland. Skeletten, zombies, vampieren, geesten en meer.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <Suspense><ShopContent /></Suspense>
      <Footer />
    </main>
  );
}
