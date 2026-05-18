import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShopContent from "@/components/pages/ShopContent";

export const metadata: Metadata = {
  title: "Halloween Props | Magic Halloween Props — All Season Toys",
  description:
    "Premium Halloween animatronic horror props on stock in the Netherlands. Skeletons, zombies, witches, ghosts, clowns and more — direct shipping.",
};

export default function HalloweenPropsPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <Suspense>
        <ShopContent />
      </Suspense>
      <Footer />
    </main>
  );
}
