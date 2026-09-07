import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The cart/checkout carry no unique content and should not be indexed.
        // Personal order pages must never be crawled or indexed.
        disallow: ["/checkout", "/mijn-bestelling", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
