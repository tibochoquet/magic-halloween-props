"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/**
 * Empties the cart once we land on the checkout success page with a
 * confirmed-paid session. Kept as its own tiny client component because the
 * success page itself is a Server Component (it needs to call Stripe with
 * the secret key), and useCart requires a client boundary.
 */
export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
