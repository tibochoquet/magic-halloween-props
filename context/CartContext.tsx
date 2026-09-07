"use client";

import { createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef } from "react";
import type { Product } from "@/types";
import { isOrderable } from "@/lib/availability";

/** localStorage key holding the cart. Declared in the privacy inventory. */
const CART_STORAGE_KEY = "mhp_cart_v1";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      // Hard guard: an unorderable product must never enter the cart, no matter
      // which UI called this. Disabled buttons are a hint, not a control.
      if (!isOrderable(action.product)) return state;
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.id) };
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "HYDRATE":
      return { ...state, items: action.items };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  /**
   * Items in the cart that are no longer orderable — e.g. availability changed
   * after they were added. Checkout must refuse to proceed while this is
   * non-empty.
   */
  blockedItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const hydrated = useRef(false);

  // Restore the cart on mount. Without this a refresh — or any full page load —
  // silently empties the cart mid-purchase.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        // Re-validate on restore: availability may have changed since.
        const usable = parsed.filter((i) => i?.product && isOrderable(i.product));
        if (usable.length) dispatch({ type: "HYDRATE", items: usable });
      }
    } catch {
      /* corrupt or unavailable storage — start with an empty cart */
    }
    hydrated.current = true;
  }, []);

  // Persist after hydration so we never overwrite stored state with the
  // initial empty array on first render.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* storage full or blocked — cart simply won't survive reload */
    }
  }, [state.items]);

  const addToCart = useCallback((product: Product) => dispatch({ type: "ADD", product }), []);
  const removeFromCart = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const updateQuantity = useCallback((id: string, quantity: number) => dispatch({ type: "UPDATE_QTY", id, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const blockedItems = useMemo(
    () => state.items.filter((i) => !isOrderable(i.product)),
    [state.items]
  );

  const value = useMemo(
    () => ({ ...state, totalItems, totalPrice, blockedItems, addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart }),
    [state, totalItems, totalPrice, blockedItems, addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
