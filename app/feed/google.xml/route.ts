import { allProducts } from "@/lib/catalogue";
import { isOrderable } from "@/lib/availability";
import { company } from "@/lib/companyInfo";
import { SITE_URL } from "@/lib/site";

/**
 * Productfeed voor Google Merchant Center: RSS 2.0 met het g:-namespace.
 *
 * Uit dezelfde catalogus als de site (lib/catalogue.ts), zodat prijs en
 * voorraad niet uiteen kunnen lopen met wat de bezoeker ziet. Alleen
 * producten die nu echt besteld kunnen worden — een feed met artikelen die
 * de winkel niet levert, levert afgekeurde items op.
 *
 * Geen GTIN of MPN: die hebben deze producten niet, vandaar
 * identifier_exists = no.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export async function GET() {
  const producten = allProducts.filter(isOrderable);

  const items = producten
    .map((p) => {
      const link = `${SITE_URL}/products/${p.id}`;
      const image = p.image ? new URL(p.image, SITE_URL).toString() : "";
      // Prijzen in de catalogus zijn btw-inclusief (zie lib/shopTerms.ts).
      const prijs = `${p.price.toFixed(2)} EUR`;
      return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      ${image ? `<g:image_link>${escapeXml(image)}</g:image_link>` : ""}
      <g:price>${prijs}</g:price>
      <g:availability>in_stock</g:availability>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:brand>${escapeXml(company.tradeName)}</g:brand>
      <g:shipping>
        <g:country>NL</g:country>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(company.tradeName)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml("Premium Halloween animatronics op voorraad in Nederland.")}</description>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
