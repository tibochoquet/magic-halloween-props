import type { Product } from "@/types";
import { nl } from "@/locales/nl";

/**
 * 27 standard products share the placeholder description "Halloween animatronic
 * pop met beweging en geluid.", which shipped as 27 identical meta
 * descriptions. The locale files already carry unique per-product copy, so
 * derive the description from there and fall back to the data file.
 *
 * The site renders lang="nl", so Dutch is the source for metadata.
 */
const GENERIC = /^Halloween animatronic pop met beweging en geluid\.?$/i;

type LocaleProduct = { description?: string; longDescription?: string };

function stripHtml(html: string): string {
  return html
    .replace(/<\/(p|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Trim to a whole word at or below `max` characters. */
function clamp(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:–—-]$/, "")}…`;
}

export function productMetaDescription(product: Product): string {
  const entry = (nl.productData as Record<string, LocaleProduct | undefined>)[product.id];

  // 1. Locale description, when it is not the shared placeholder.
  if (entry?.description && !GENERIC.test(entry.description.trim())) {
    return clamp(entry.description.trim());
  }

  // 2. First sentences of the rich long description.
  if (entry?.longDescription) {
    const plain = stripHtml(entry.longDescription);
    if (plain) return clamp(plain);
  }

  // 3. Data-file description, first paragraph.
  const own = product.description.split("\n\n")[0].trim();
  if (own && !GENERIC.test(own)) return clamp(own);

  // 4. Last resort: build something specific from the product's own fields so
  //    it is still unique per product rather than a shared placeholder.
  const bits = [
    product.name,
    product.height ? `${product.height} hoog` : null,
    "animatronic met beweging, licht en geluid.",
    "Op voorraad in Nederweert, gratis verzending.",
  ].filter(Boolean);
  return clamp(bits.join(" — ").replace(" — animatronic", ", animatronic"));
}
