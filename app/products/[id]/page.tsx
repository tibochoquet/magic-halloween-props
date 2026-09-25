import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { allProducts } from "@/lib/catalogue";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductPageContent from "@/components/pages/ProductPageContent";
import { isOrderable } from "@/lib/availability";
import { company } from "@/lib/companyInfo";
import { SITE_URL } from "@/lib/site";
import { productMetaDescription } from "@/lib/productMeta";

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
  const desc = productMetaDescription(product);
  return {
    title: product.name,
    description: desc,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} | Magic Halloween Props`,
      description: desc,
      url: `${SITE_URL}/products/${product.id}`,
      type: "website",
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  if (params.id in discontinuedRedirects) redirect(discontinuedRedirects[params.id]);

  const product = allProducts.find((p) => p.id === params.id);
  if (!product) notFound();

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  // Availability comes from the real per-product field — never hardcoded.
  const schemaAvailability = isOrderable(product)
    ? "https://schema.org/InStock"
    : product.notifyOnRestock
      ? "https://schema.org/PreOrder"
      : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.split("\n\n")[0],
    ...(product.image ? { image: `${SITE_URL}${product.image}` } : {}),
    ...(product.height ? { height: product.height } : {}),
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      availability: schemaAvailability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: company.umbrellaTradeName,
      },
    },
  };

  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <ProductPageContent product={product} related={related} />
      <Footer />
    </main>
  );
}
