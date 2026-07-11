import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products as localProducts } from '../data/products.js';
import { fetchPublicProducts } from '../firebase/publicQueries.js';

const CatalogContext = createContext(null);

const isActiveProduct = (p) => p && p.status === 'active';

export function CatalogProvider({ children }) {
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const remote = await fetchPublicProducts();
        if (!mounted) return;
        console.log('[Catalog] remote products:', remote?.length || 0, remote?.map((p) => ({ id: p.id, status: p.status })));
        setRawProducts(Array.isArray(remote) ? remote : []);
      } catch (e) {
        if (!mounted) return;
        console.error('[Catalog] fetch error:', e);
        setError(e?.message || 'Failed to load products');
        setRawProducts(localProducts.map((p) => ({ ...p, status: p.status || 'active' })));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const products = useMemo(
    () => (rawProducts || []).filter(isActiveProduct),
    [rawProducts]
  );

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
