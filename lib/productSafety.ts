import type { Product } from "@/types";

/**
 * GPSR (EU) 2023/988 product-safety data.
 *
 * These are imported, mains-powered, moving products up to 2,13 m. An online
 * listing must identify the manufacturer AND a responsible person established
 * in the EU, with contact details, plus the information needed for safe use.
 *
 * EVERY value here is deliberately empty. They must come from the supplier —
 * inventing a manufacturer address or asserting a CE marking that was never
 * verified would be considerably worse than showing a gap. Run
 * `npm run audit:safety` for the per-product list to chase.
 */

export type ProductSafety = {
  /** Manufacturer's legal name. */
  manufacturerName: string | null;
  /** Manufacturer's postal address (incl. country). */
  manufacturerAddress: string | null;
  /** Name of the responsible person / importer established in the EU. */
  euResponsibleName: string | null;
  /** Postal address of the EU responsible person. */
  euResponsibleAddress: string | null;
  /** Contact (email or URL) for the EU responsible person. */
  euResponsibleContact: string | null;
  /** Whether a CE marking is physically present on the product/packaging. */
  ceMarking: boolean | null;
  /** Supply voltage and type, e.g. "230V AC via meegeleverde EU-adapter". */
  voltage: string | null;
  /** Safety warnings shown to the buyer. */
  warnings: {
    indoorOnly: boolean | null;
    twoPersonAssembly: boolean | null;
    /** e.g. "Niet geschikt voor kinderen jonger dan 3 jaar". */
    ageGuidance: string | null;
    /** Any other warnings/pictograms printed on the packaging. */
    packagingWarnings: string[];
  };
};

export const EMPTY_SAFETY: ProductSafety = {
  manufacturerName: null,
  manufacturerAddress: null,
  euResponsibleName: null,
  euResponsibleAddress: null,
  euResponsibleContact: null,
  ceMarking: null,
  voltage: null,
  warnings: {
    indoorOnly: null,
    twoPersonAssembly: null,
    ageGuidance: null,
    packagingWarnings: [],
  },
};

/**
 * Per-product safety data, keyed by product id.
 *
 * TODO (build-blocking, all products): populate from supplier documentation.
 * Add entries here as they arrive, e.g.
 *
 *   "pro-riding-dead": {
 *     manufacturerName: "…",
 *     manufacturerAddress: "…",
 *     euResponsibleName: "…",
 *     ceMarking: true,
 *     voltage: "230V AC via meegeleverde EU-adapter",
 *     warnings: { indoorOnly: true, twoPersonAssembly: true, ageGuidance: "14+", packagingWarnings: [] },
 *   },
 */
export const productSafety: Record<string, Partial<ProductSafety>> = {};

/** Safety record for a product, falling back to empty (not to invented values). */
export function getSafety(product: Pick<Product, "id" | "powerSource">): ProductSafety {
  const override = productSafety[product.id] ?? {};
  return {
    ...EMPTY_SAFETY,
    ...override,
    // powerSource already exists in the catalogue and is supplier-sourced, so
    // use it as the voltage line until a dedicated value is supplied.
    voltage: override.voltage ?? product.powerSource ?? null,
    warnings: { ...EMPTY_SAFETY.warnings, ...(override.warnings ?? {}) },
  };
}

export type SafetyGap = { field: string; critical: boolean };

/**
 * Which safety fields are still missing for a product.
 * `critical` marks the two that make a listing unlawful rather than incomplete:
 * no identifiable EU responsible person, and no CE marking.
 */
export function missingSafetyFields(product: Pick<Product, "id" | "powerSource">): SafetyGap[] {
  const s = getSafety(product);
  const gaps: SafetyGap[] = [];
  if (!s.manufacturerName) gaps.push({ field: "manufacturerName", critical: false });
  if (!s.manufacturerAddress) gaps.push({ field: "manufacturerAddress", critical: false });
  if (!s.euResponsibleName) gaps.push({ field: "euResponsibleName", critical: true });
  if (!s.euResponsibleAddress) gaps.push({ field: "euResponsibleAddress", critical: true });
  if (!s.euResponsibleContact) gaps.push({ field: "euResponsibleContact", critical: false });
  if (s.ceMarking === null) gaps.push({ field: "ceMarking", critical: true });
  if (!s.voltage) gaps.push({ field: "voltage", critical: false });
  if (s.warnings.indoorOnly === null) gaps.push({ field: "warnings.indoorOnly", critical: false });
  if (s.warnings.twoPersonAssembly === null) gaps.push({ field: "warnings.twoPersonAssembly", critical: false });
  if (!s.warnings.ageGuidance) gaps.push({ field: "warnings.ageGuidance", critical: false });
  return gaps;
}

/**
 * A product that cannot show a CE marking or an EU responsible person should
 * not be listed for sale at all under GPSR.
 */
export function hasCriticalSafetyGap(product: Pick<Product, "id" | "powerSource">): boolean {
  return missingSafetyFields(product).some((g) => g.critical);
}
