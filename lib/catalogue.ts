import type { Category, Product } from "@/types";
import { categories, products } from "@/data";
import { professionalProducts } from "@/data/professionalProducts";
import { scareEffectProducts } from "@/data/scareEffectProducts";

/**
 * The catalogue, counted in one place.
 *
 * Every number the site states about its own range is derived here — never
 * typed into a translation file, where it silently goes stale. The page used
 * to claim 28 props in the hero and 135+ a few sections lower, with "6
 * categories" sitting above nine category tiles.
 *
 * The three data files can't do this themselves: data/professionalProducts.ts
 * and data/scareEffectProducts.ts import `style` from data/index.ts, so
 * counting across all three there would be a circular import. That is why the
 * per-category counts live here rather than on the category data.
 */
export const allProducts: Product[] = [...products, ...professionalProducts, ...scareEffectProducts];

/** Total number of products listed across all three catalogues. */
export const productCount = allProducts.length;

/** How many products each category id holds, across all catalogues. */
export const productCountByCategory: Record<string, number> = allProducts.reduce<Record<string, number>>(
  (acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  },
  {}
);

/** Categories that actually hold at least one product — the only ones worth showing or counting. */
export const activeCategories: Category[] = categories.filter(
  (category) => (productCountByCategory[category.id] ?? 0) > 0
);

export const categoryCount = activeCategories.length;

/**
 * Looks up a product by id across every catalogue. Used by the checkout API to
 * resolve authoritative prices server-side — never trust a price sent by the
 * client.
 */
export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}
