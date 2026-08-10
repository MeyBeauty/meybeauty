import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

function readCart() {
  try {
    const raw = window.localStorage.getItem('mey_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readCart());

  useEffect(() => {
    window.localStorage.setItem('mey_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    if (!product || !product.id) return;
    if (Number(product.stock) === 0) return;
    const qty = Number(quantity) || 1;
    setItems((prev) => {
      const existing = prev.find((it) => it.productId === product.id);
      const itemData = {
        productId: product.id,
        quantity: Math.max(1, qty),
        priceCents: product.priceCents || 0,
        originalPriceCents: product.originalPriceCents || product.priceCents || 0,
        promotionId: product.promotionId || null,
      };
      if (existing) {
        return prev.map((it) =>
          it.productId === product.id ? { ...it, quantity: Math.max(1, it.quantity + qty) } : it
        );
      }
      return [...prev, itemData];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((prev) => prev.map((it) => (it.productId === productId ? { ...it, quantity: qty } : it)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, it) => sum + (it.quantity || 0), 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clearCart, count }),
    [items, addItem, removeItem, setQuantity, clearCart, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
