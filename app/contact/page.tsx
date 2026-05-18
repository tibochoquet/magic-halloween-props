import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactPageContent from "@/components/pages/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact | Magic Halloween Props — All Season Toys",
  description: "Neem contact op met All Season Toys. Vragen over animatronics, afhalen, groothandel of garantie? Wij reageren binnen 1 werkdag.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <ContactPageContent />
      <Footer />
    </main>
  );
}
