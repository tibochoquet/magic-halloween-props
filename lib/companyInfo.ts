/**
 * SINGLE SOURCE OF TRUTH — seller of record.
 *
 * Magic Halloween Props is a trade name. The seller of record, the party that
 * carries the consumer-law liability, the returns and the GPSR obligations, is
 * the statutory entity below. Every legal identifier rendered anywhere on the
 * site must come from this file — never hardcode a KVK or BTW number in a
 * component or a locale file again.
 *
 * Values marked TODO are BUILD-BLOCKING for launch. See `missingCompanyFields`.
 */

/** Marker for a value the operator still has to supply. */
export const TODO = null;

export type CompanyInfo = {
  /** Registered name in the Handelsregister. */
  statutoryName: string;
  /** Legal form. Note: this is the FORM, not the name. */
  legalForm: string;
  /** Trade name under which this webshop operates. */
  tradeName: string;
  /** Parent trade name / umbrella business. */
  umbrellaTradeName: string;
  kvk: string;
  /** Vestigingsnummer (establishment number) from the Handelsregister. */
  establishmentNumber: string | null;
  /** BTW-identificatienummer. Legally required on a consumer webshop. */
  vatId: string | null;
  /**
   * Omzetbelastingnummer — used for Belastingdienst filings only.
   * Deliberately NOT rendered anywhere public: the BTW-identificatienummer is
   * the number meant for customers and invoices.
   */
  turnoverTaxNumber: string | null;
  address: {
    street: string;
    postcode: string;
    city: string;
    country: string;
  };
  email: string;
  /**
   * Second contact channel. A webshop must offer a means of contact beyond a
   * single email address. TODO — supply a phone or WhatsApp number.
   */
  phone: string | null;
  /** Where order confirmations are sent from/to. TODO once a PSP is wired. */
  orderConfirmationFrom: string | null;
};

export const company: CompanyInfo = {
  // Seller of record changed to the eenmanszaak "Spinecollection" (confirmed by
  // the operator). The previous entity was Slegers import vof, KVK 64942708.
  statutoryName: "Spinecollection",
  legalForm: "Eenmanszaak",
  tradeName: "Magic Halloween Props",
  umbrellaTradeName: "Spinecollection",
  kvk: "97264180",
  establishmentNumber: "000062518372",

  vatId: "NL005258878B60",
  turnoverTaxNumber: "263478269B02",
  address: {
    street: "Pannenweg 306",
    postcode: "6031 RK",
    city: "Nederweert",
    country: "Nederland",
  },
  email: "jorgen0207@gmail.com",

  // TODO (build-blocking): a second contact channel is legally required
  // alongside email. Supply a phone number reachable during business hours.
  phone: TODO,

  // TODO (build-blocking): the address order confirmations are sent from.
  // Cannot be finalised until a payment provider and mail sender are wired.
  orderConfirmationFrom: TODO,
};

/** One-line postal address. */
export const addressLine = `${company.address.street}, ${company.address.postcode} ${company.address.city}`;

/** Full postal address including country. */
export const addressLineFull = `${addressLine}, ${company.address.country}`;

/**
 * Entity line for footers/legal headers. When the webshop trade name and the
 * registered name are the same (typical for an eenmanszaak) we show it once
 * rather than repeating it.
 */
export const entityLine =
  company.umbrellaTradeName === company.statutoryName
    ? `${company.statutoryName} (${company.legalForm})`
    : `${company.umbrellaTradeName} · ${company.statutoryName}`;

/** Full sentence identifying the seller, used at the top of legal pages. */
export const identitySentence =
  company.tradeName === company.statutoryName
    ? `${company.statutoryName} (${company.legalForm}), ingeschreven bij de KvK onder nummer ${company.kvk}.`
    : `${company.tradeName} is een handelsnaam van ${company.statutoryName} (${company.legalForm}), ingeschreven bij de KvK onder nummer ${company.kvk}.`;

/**
 * Fields still outstanding. Rendered into the pre-launch checklist and used by
 * `scripts/audit.mjs` so a missing value fails loudly instead of silently
 * shipping a blank.
 */
export const missingCompanyFields: { field: string; why: string }[] = [
  ...(company.phone === null
    ? [{ field: "company.phone", why: "Second contact channel is legally required alongside email." }]
    : []),
  ...(company.orderConfirmationFrom === null
    ? [{ field: "company.orderConfirmationFrom", why: "Consumer must be told where the order confirmation is sent." }]
    : []),
];
