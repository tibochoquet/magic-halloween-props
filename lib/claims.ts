/**
 * Marketing claims that are NOT rendered anywhere, and must not be until the
 * operator has confirmed they are true and can back them up.
 *
 * These four numbers used to sit in a stats block under the category tiles.
 * Two were simply wrong (the page claimed 28 props in the hero and 135+ here,
 * with "6 categories" above nine tiles) and are now derived in
 * lib/catalogue.ts instead. The two below are the ones nobody could verify.
 *
 * A number about your own business that turns out to be decorative is a
 * problem beyond taste: under the EU Omnibus rules an unverifiable claim in a
 * commercial context is a misleading practice. So they live here, unrendered,
 * until they are confirmed — not in a translation file where they read as fact.
 */

export type UnverifiedClaim = {
  /** What the site used to say. */
  claim: { nl: string; en: string };
  /** What would have to be true, and what evidence would settle it. */
  needed: string;
};

export const unverifiedClaims: UnverifiedClaim[] = [
  {
    claim: { nl: "98% klanttevredenheid", en: "98% customer satisfaction" },
    needed:
      "TODO — requires an actual measurement: a review average, a survey, or a rating from a platform, with the sample size. Without a source this may not be shown.",
  },
  {
    claim: { nl: "15jr branche-ervaring", en: "15yr industry experience" },
    needed:
      "TODO — the KVK registration for Spinecollection is recent (see lib/companyInfo.ts). If the 15 years refer to experience gained elsewhere, the claim has to say so in those words, or not appear at all.",
  },
];
