"use client";

import Image from "next/image";
import Link from "next/link";
import { upcomingProducts } from "@/data/upcomingProducts";
import NotifyForm from "@/components/ui/NotifyForm";
import CategoryIcon from "@/components/ui/CategoryIcon";

export default function UpcomingProducts() {
  if (upcomingProducts.length === 0) return null;

  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="w-full h-px mb-12" style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.25), transparent)" }} />
        <h2 className="font-cinzel text-2xl font-bold text-horror-text-primary tracking-wider mb-2 text-center">
          Binnenkort <span className="text-horror-orange">Verwachte Producten</span>
        </h2>
        <p className="text-horror-text-muted text-sm text-center mb-10 max-w-xl mx-auto">
          Deze animatronics komen er nog aan. Laat je e-mailadres achter en we laten het je weten zodra ze binnen zijn.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {upcomingProducts.map((product) => (
            <article key={product.id} className="card-horror flex flex-col overflow-hidden">
              <Link href={`/products/${product.id}`} className="block">
                <div className={`relative h-56 bg-gradient-to-br ${product.bgGradient} flex items-center justify-center overflow-hidden`}>
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain object-center p-4 relative z-10"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="text-horror-text-muted/30">
                      <CategoryIcon id={product.category} size={80} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 right-4 px-3 py-1 bg-black/75 border border-horror-orange/40 text-horror-orange text-xs font-bold tracking-widest uppercase text-center z-10">
                    {product.availabilityNote}
                  </div>
                </div>
              </Link>

              <div className="flex flex-col flex-1 p-5">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-cinzel text-lg font-bold text-horror-text-primary hover:text-horror-orange transition-colors duration-200 leading-snug">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-horror-text-primary font-bold mt-1 mb-4">
                  €{product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </p>

                <div className="mt-auto pt-4 border-t border-horror-border">
                  <NotifyForm productName={product.name} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
