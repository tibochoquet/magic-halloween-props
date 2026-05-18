import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductPageContent from "@/components/pages/ProductPageContent";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id);
  if (!product) return {};
  return {
    title: `${product.name} | Magic Halloween Props`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <ProductPageContent product={product} related={related} />
      <Footer />
    </main>
  );
}
