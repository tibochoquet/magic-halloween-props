import type { Product } from "@/types";
import { getSafety, missingSafetyFields } from "@/lib/productSafety";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-horror-border last:border-0">
      <dt className="text-horror-text-muted text-xs tracking-wider uppercase sm:w-56 sm:flex-shrink-0 mb-0.5 sm:mb-0">
        {label}
      </dt>
      <dd className="text-horror-text-primary text-sm">{children}</dd>
    </div>
  );
}

function Missing({ critical = false }: { critical?: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-bold tracking-wide border ${
        critical
          ? "bg-red-950/40 border-red-700/50 text-red-400"
          : "bg-horror-orange/15 border-horror-orange/40 text-horror-orange"
      }`}
    >
      TODO — nog aan te leveren
    </span>
  );
}

function YesNo({ value }: { value: boolean | null }) {
  if (value === null) return <Missing />;
  return <span>{value ? "Ja" : "Nee"}</span>;
}

/**
 * GPSR safety block. Rendered on every product page in a consistent structured
 * form, never buried in prose. Missing values render as visible TODOs rather
 * than being omitted, so a gap is obvious to the operator and honest to the
 * reader.
 */
export default function ProductSafetyBlock({ product }: { product: Product }) {
  const s = getSafety(product);
  const gaps = missingSafetyFields(product);
  const critical = gaps.filter((g) => g.critical);

  return (
    <section aria-labelledby="productveiligheid" className="mt-12 p-5 md:p-6 bg-horror-card border border-horror-border">
      <h2
        id="productveiligheid"
        className="font-cinzel text-xs font-bold tracking-widest uppercase text-horror-text-primary mb-1"
      >
        Productveiligheid
      </h2>
      <p className="text-horror-text-muted text-xs mb-5">
        Wettelijk verplichte informatie op grond van de EU-verordening algemene productveiligheid
        (GPSR).
      </p>

      {critical.length > 0 && (
        <div className="mb-5 p-3 border border-red-700/50 bg-red-950/20">
          <p className="text-red-400 text-xs font-bold tracking-wide uppercase mb-1">
            Onvolledige veiligheidsinformatie
          </p>
          <p className="text-horror-text-secondary text-xs leading-relaxed">
            Voor dit product ontbreken nog gegevens die wettelijk vermeld moeten worden. Neem
            contact op voordat je bestelt als je deze informatie nodig hebt.
          </p>
        </div>
      )}

      <dl>
        <Row label="Fabrikant">
          {s.manufacturerName ?? <Missing />}
          {s.manufacturerAddress && (
            <span className="block text-horror-text-secondary text-xs mt-0.5 whitespace-pre-line">
              {s.manufacturerAddress}
            </span>
          )}
          {!s.manufacturerAddress && s.manufacturerName && (
            <span className="block mt-1">
              <Missing />
            </span>
          )}
        </Row>

        <Row label="Verantwoordelijke persoon in de EU">
          {s.euResponsibleName ?? <Missing critical />}
          {s.euResponsibleAddress && (
            <span className="block text-horror-text-secondary text-xs mt-0.5 whitespace-pre-line">
              {s.euResponsibleAddress}
            </span>
          )}
          {s.euResponsibleContact && (
            <span className="block text-horror-text-secondary text-xs mt-0.5">
              {s.euResponsibleContact}
            </span>
          )}
        </Row>

        <Row label="CE-markering">
          {s.ceMarking === null ? <Missing critical /> : s.ceMarking ? "Aanwezig" : "Niet aanwezig"}
        </Row>

        <Row label="Voeding">{s.voltage ?? <Missing />}</Row>

        <Row label="Alleen binnenshuis gebruiken">
          <YesNo value={s.warnings.indoorOnly} />
        </Row>

        <Row label="Montage door twee personen">
          <YesNo value={s.warnings.twoPersonAssembly} />
        </Row>

        <Row label="Leeftijdsindicatie">{s.warnings.ageGuidance ?? <Missing />}</Row>

        <Row label="Waarschuwingen op verpakking">
          {s.warnings.packagingWarnings.length > 0 ? (
            <ul className="space-y-1">
              {s.warnings.packagingWarnings.map((w) => (
                <li key={w} className="flex gap-2">
                  <span className="text-horror-orange flex-shrink-0">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Missing />
          )}
        </Row>
      </dl>
    </section>
  );
}
