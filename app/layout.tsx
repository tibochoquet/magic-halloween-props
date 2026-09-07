import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import CartDrawer from "@/components/ui/CartDrawer";
import { SITE_URL } from "@/lib/site";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Magic Halloween Props | Premium Halloween animatronics op voorraad in NL",
    template: "%s | Magic Halloween Props",
  },
  description:
    "Levensgrote animatronics voor haunted houses, escape rooms en Halloween-displays. Op voorraad in Nederweert, gratis verzending, 14 dagen bedenktijd.",
  keywords: ["halloween animatronics", "haunted house props", "horror props", "animatronic Halloween"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        <a href="#main" className="skip-link">
          Naar hoofdinhoud
        </a>
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
        {/*
          Vercel Analytics: cookieless, no cross-site tracking, no personal data
          stored, so no consent banner is required. Chosen over Plausible purely
          because the site already runs on Vercel — same processor, no extra
          third-party domain to declare, no additional subscription.

          WARNING: adding any advertising pixel (Meta, Google Ads, TikTok) DOES
          require a consent banner. Do not install one without building consent
          first. See section 8 of the pre-launch brief.
        */}
        <Analytics />
      </body>
    </html>
  );
}
