import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

function readWishlist() {
  try {
    const raw = window.localStorage.getItem('mey_wishlist');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => readWishlist());

  useEffect(() => {
    window.localStorage.setItem('mey_wishlist', JSON.stringify(ids));
  }, [ids]);

  const isWishlisted = useCallback(
    (productId) => {
      const id = String(productId || '').trim();
      if (!id) return false;
      return ids.includes(id);
    },
    [ids]
  );

  const add = useCallback((productId) => {
    const id = String(productId || '').trim();
    if (!id) return;
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const remove = useCallback((productId) => {
    const id = String(productId || '').trim();
    if (!id) return;
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const toggle = useCallback((productId) => {
    const id = String(productId || '').trim();
    if (!id) return;
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const count = useMemo(() => ids.length, [ids]);

  const value = useMemo(
    () => ({ ids, count, isWishlisted, add, remove, toggle, clear }),
    [ids, count, isWishlisted, add, remove, toggle, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
