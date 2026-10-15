/** Canonical origin, used for metadataBase, sitemap and JSON-LD. */
// Mét www: dat is waar de site daadwerkelijk draait. Zonder www stuurt
// Vercel een 308 door naar www, dus elk signaal dat naar het kale domein
// wees — canonical, og:url, sitemap, robots, JSON-LD — verwees naar een URL
// die doorstuurt. De redirect in Vercel blijft zoals hij is.
export const SITE_URL = "https://www.magichalloweenprops.nl";
