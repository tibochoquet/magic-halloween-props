import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/data";
import { professionalProducts } from "@/data/professionalProducts";
import { scareEffectProducts } from "@/data/scareEffectProducts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductPageContent from "@/components/pages/ProductPageContent";

const allProducts = [...products, ...professionalProducts, ...scareEffectProducts];

// Products discontinued and removed from the catalog. Their old URLs redirect
// to the category they used to belong to, rather than a plain 404.
const discontinuedRedirects: Record<string, string> = {
  "pro-nightmare-terror-zombie": "/shop?category=zombie",
  "pro-peekaboo-little-girl": "/shop?category=ghost",
};

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
  if (params.id in discontinuedRedirects) redirect(discontinuedRedirects[params.id]);

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
