import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/data";
import { professionalProducts } from "@/data/professionalProducts";
import { scareEffectProducts } from "@/data/scareEffectProducts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductPageContent from "@/components/pages/ProductPageContent";

const allProducts = [...products, ...professionalProducts, ...scareEffectProducts];

export async function generateStaticParams() {
  return allProducts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = allProducts.find((p) => p.id === params.id);
  if (!product) return {};
  return {
    title: `${product.name} | Magic Halloween Props`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = allProducts.find((p) => p.id === params.id);
  if (!product) notFound();

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      <ProductPageContent product={product} related={related} />
      <Footer />
    </main>
  );
}
