import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products as localProducts } from '../data/products.js';
import { fetchPublicProducts } from '../firebase/publicQueries.js';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const remote = await fetchPublicProducts();
        if (!mounted) return;
        if (Array.isArray(remote) && remote.length > 0) {
          setProducts(remote);
        } else {
          setProducts(localProducts);
        }
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load products');
        setProducts(localProducts);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const byId = useMemo(() => {
    const map = new Map();
    (products || []).forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      getProductById: (id) => byId.get(id) || null,
    }),
    [products, loading, error, byId]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
