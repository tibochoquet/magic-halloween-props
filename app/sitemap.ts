import type { MetadataRoute } from "next";
import { allProducts } from "@/lib/catalogue";
import { SITE_URL } from "@/lib/site";

/**
 * Built from the live route list and the real catalogue, so discontinued
 * products cannot linger in the sitemap. The two ids in `discontinuedRedirects`
 * on the product route are absent from these arrays by construction.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/shop", priority: 0.9, freq: "weekly" },
    { path: "/halloween-props", priority: 0.8, freq: "weekly" },
    { path: "/professional-animatronics", priority: 0.8, freq: "weekly" },
    { path: "/scare-effects", priority: 0.8, freq: "weekly" },
    { path: "/about", priority: 0.5, freq: "monthly" },
    { path: "/contact", priority: 0.5, freq: "monthly" },
    { path: "/faq", priority: 0.5, freq: "monthly" },
    { path: "/verzending", priority: 0.4, freq: "yearly" },
    { path: "/retourneren", priority: 0.4, freq: "yearly" },
    { path: "/retourneren/modelformulier", priority: 0.2, freq: "yearly" },
    { path: "/algemene-voorwaarden", priority: 0.3, freq: "yearly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...allProducts.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
