import type { Product } from "@/types";
import { products } from "@/data";
import { professionalProducts } from "@/data/professionalProducts";
import { scareEffectProducts } from "@/data/scareEffectProducts";

const allProducts: Product[] = [...products, ...professionalProducts, ...scareEffectProducts];

/**
 * Looks up a product by id across every catalogue (standard, professional,
 * scare-effect). Used by the checkout API to resolve authoritative prices
 * server-side — never trust a price sent by the client.
 */
export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}
