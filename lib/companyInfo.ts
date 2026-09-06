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
  /** Statutory name as registered in the Handelsregister. */
  statutoryName: string;
  /** Legal form. Note: this is the FORM, not the name. */
  legalForm: string;
  /** Trade name under which this webshop operates. */
  tradeName: string;
  /** Parent trade name / umbrella business. */
  umbrellaTradeName: string;
  kvk: string;
  vatId: string;
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
  statutoryName: "Slegers import vof",
  legalForm: "Vennootschap onder firma (vof)",
  tradeName: "Magic Halloween Props",
  umbrellaTradeName: "All Season Toys",
  kvk: "64942708",
  vatId: "NL855913770B01",
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

/** "All Season Toys · Slegers import vof" */
export const entityLine = `${company.umbrellaTradeName} · ${company.statutoryName}`;

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
