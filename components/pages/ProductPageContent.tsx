"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { useTranslation } from "@/hooks/useTranslation";
import { StarRating, BADGE_STYLES } from "@/components/ui/StarRating";

export default function ProductPageContent({ product, related }: { product: Product; related: Product[] }) {
  const t = useTranslation();
  const p = t.product;
  type PD = { description: string; features: string[]; longDescription?: string };
  const pd = (t.productData as Record<string, PD | undefined>)[product.id];
  const description = pd?.description ?? product.description;
  const features: string[] = pd?.features ?? product.features;
  const longDescription = pd?.longDescription;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-horror-text-muted mb-10 tracking-wide">
        <Link href="/" className="hover:text-horror-orange transition-colors duration-200">{p.breadcrumbHome}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-horror-orange transition-colors duration-200">{p.breadcrumbShop}</Link>
        <span>/</span>
        <span className="text-horror-text-secondary">{product.name}</span>
      </nav>

      {/* Product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Visual */}
        <div className="relative">
          <div className={`relative w-full aspect-square bg-gradient-to-br ${product.bgGradient} flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 80%, ${product.accentColor} 0%, transparent 60%)` }} />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain object-center p-8 relative z-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <span className="text-[10rem] md:text-[14rem] select-none drop-shadow-2xl animate-float relative z-10">{product.iconEmoji}</span>
            )}
            {product.badge && (
              <div className={`absolute top-5 left-5 px-3 py-1.5 text-xs font-bold tracking-widest ${BADGE_STYLES[product.badge]}`}>{product.badge}</div>
            )}
            <div className="absolute top-5 right-5 px-3 py-1.5 bg-black/60 border border-white/10 text-horror-text-muted text-xs font-mono tracking-wide">{product.height}</div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: "↩", text: p.trust.returns },
              { icon: "🏭", text: p.trust.stock },
              { icon: "📦", text: p.trust.pickup },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1.5 p-3 bg-horror-card border border-horror-border text-center">
                <span className="text-horror-orange text-base">{item.icon}</span>
                <span className="text-horror-text-muted text-[11px] tracking-wide leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-horror-orange-dark text-xs font-semibold tracking-[0.2em] uppercase mb-2">{product.category}</span>
          <h1 className="font-cinzel text-4xl md:text-5xl font-black text-horror-text-primary leading-tight mb-4">{product.name}</h1>

          {product.rating != null && (
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} size="md" />
              <span className="text-horror-text-muted text-sm">
                {product.rating.toFixed(1)}{product.reviews != null ? ` (${product.reviews} reviews)` : ""}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-horror-border">
            <span className="font-cinzel text-4xl font-bold text-horror-text-primary">
              €{product.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-horror-text-muted text-xl line-through">
                  €{product.originalPrice.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </span>
                <span className="px-2 py-0.5 bg-red-900/40 border border-red-700/40 text-red-400 text-xs font-bold tracking-wide">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% {p.discount}
                </span>
              </>
            )}
          </div>

          {longDescription ? (
            <div
              className="product-description mb-8"
              dangerouslySetInnerHTML={{ __html: longDescription }}
            />
          ) : (
            <p className="text-horror-text-secondary text-base leading-relaxed mb-8">{description}</p>
          )}

          {features.length > 0 && (
            <div className="mb-8">
              <h2 className="font-cinzel text-xs font-bold tracking-widest uppercase text-horror-text-primary mb-4">{p.featuresTitle}</h2>
              <ul className="grid grid-cols-2 gap-3">
                {features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-sm text-horror-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-horror-orange flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8 p-5 bg-horror-card border border-horror-border">
            <h2 className="font-cinzel text-xs font-bold tracking-widest uppercase text-horror-text-primary mb-4">{p.specsTitle}</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                { label: p.specLabels.height, value: product.height },
                { label: p.specLabels.type, value: product.category },
                { label: p.specLabels.activation, value: p.specValues.activation },
                { label: p.specLabels.power, value: p.specValues.power },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-horror-text-muted text-xs tracking-wider uppercase mb-0.5">{label}</dt>
                  <dd className="text-horror-text-primary font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <AddToCartButton product={product} />
          <p className="mt-4 text-horror-text-muted text-xs text-center leading-relaxed">{p.shippingNote}</p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-24">
          <div className="w-full max-w-4xl mx-auto h-px mb-16 pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(255,107,0,0.25), transparent)" }} />
          <h2 className="font-cinzel text-2xl font-bold text-horror-text-primary tracking-wider mb-8 text-center">
            {p.relatedTitle} <span className="text-horror-orange">{p.relatedAccent}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link key={r.id} href={`/products/${r.id}`} className="group card-horror flex flex-col overflow-hidden">
                <div className={`relative h-48 bg-gradient-to-br ${r.bgGradient} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 50% 80%, ${r.accentColor} 0%, transparent 65%)` }} />
                  <span className="text-6xl select-none animate-float relative z-10">{r.iconEmoji}</span>
                </div>
                <div className="p-5">
                  <span className="text-horror-orange-dark text-[10px] font-semibold tracking-wider uppercase">{r.category}</span>
                  <h3 className="font-cinzel text-base font-bold text-horror-text-primary group-hover:text-horror-orange transition-colors duration-200 mt-0.5">{r.name}</h3>
                  <p className="text-horror-orange font-bold mt-2">€{r.price.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
