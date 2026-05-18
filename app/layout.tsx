import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import CartDrawer from "@/components/ui/CartDrawer";

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
  title: "Magic Halloween Props | Premium Halloween Animatronics",
  description:
    "Life-size animatronic horrors for haunted houses, escape rooms, and the most terrifying Halloween displays. Premium quality. Maximum fear.",
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
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
