import { useEffect, useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SEO from '../components/SEO.jsx';

function parseSearchFromHash(hash) {
  const idx = hash.indexOf('?');
  const query = idx >= 0 ? hash.slice(idx + 1) : '';
  const params = new URLSearchParams(query);
  return (params.get('search') || '').trim();
}

export default function ShopPage() {
  const { products: allProducts } = useCatalog();
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [search, setSearch] = useState(() => parseSearchFromHash(window.location.hash || ''));

  useEffect(() => {
    const onHash = () => setSearch(parseSearchFromHash(window.location.hash || ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const categories = useMemo(() => {
    const set = new Set((allProducts || []).map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [allProducts]);

  const products = useMemo(() => {
    let list = allProducts || [];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => {
        const hay = [
          p.name,
          p.description,
          p.brand,
          p.category,
          Array.isArray(p.tags) ? p.tags.join(' ') : '',
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [activeCategory, search]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(products.length / pageSize)), [products.length]);
  const pageProducts = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page, totalPages]);

  const goToPage = (next) => {
    setPage((prev) => {
      const n = typeof next === 'function' ? next(prev) : next;
      return Math.min(Math.max(1, n), totalPages);
    });
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <>
      <SEO
        title="Boutique — Produits Cosmétiques LPG"
        description="Découvrez notre boutique de cosmétiques premium LPG. Crèmes visage et corps, compléments alimentaires, textiles minceur. Livraison rapide."
        keywords="boutique cosmétiques, produits LPG, crème anti-cellulite, soin visage, compléments alimentaires beauté"
      />
      <main className="shop-page">
      <section className="page-hero-banner" aria-label="Bannière">
        <h1>Boutique</h1>
        <div className="breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <span>Boutique</span>
        </div>
      </section>

      <section className="shop-layout" aria-label="Boutique">
        <aside className="shop-sidebar" aria-label="Filtres">
          <div>
            <div className="shop-sidebar-title">Recherche</div>
            <div className="shop-search">
              <input
                type="text"
                placeholder="Rechercher un produit…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (search || '').trim();
                    window.location.hash = q ? `#shop?search=${encodeURIComponent(q)}` : '#shop';
                  }
                }}
              />
              <button
                type="button"
                aria-label="Rechercher"
                onClick={() => {
                  const q = (search || '').trim();
                  window.location.hash = q ? `#shop?search=${encodeURIComponent(q)}` : '#shop';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <div className="shop-sidebar-title">Filtrer par prix</div>
            <div className="price-slider-wrap">
              <div className="price-track">
                <div className="price-fill" />
              </div>
            </div>
            <div className="price-label">Prix : 0 € — 50 €</div>
            <button className="btn-filter" type="button">Filtrer</button>
          </div>

          <div>
            <div className="shop-sidebar-title">Catégories</div>
            <ul className="category-list">
              <li
                onClick={() => setActiveCategory('')}
                style={{ color: !activeCategory ? 'var(--brun-medium)' : undefined }}
              >
                Tous les produits
              </li>
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setPage(1);
                  }}
                  style={{ color: activeCategory === cat ? 'var(--brun-medium)' : undefined }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="shop-sidebar-title">Tags</div>
            <div className="product-tags-wrap">
              <span className="product-tag">Éclat</span>
              <span className="product-tag">Hydratation</span>
              <span className="product-tag">Relaxation</span>
              <span className="product-tag">Bien‑être</span>
            </div>
          </div>
        </aside>

        <div className="shop-main">
          <div className="products-grid unified shop-products-grid">
            {pageProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                className="shop-product-card unified"
                onClick={() => {
                  window.location.hash = `#product?id=${encodeURIComponent(p.id)}`;
                }}
              />
            ))}
          </div>

          <div className="shop-pagination" aria-label="Pagination boutique">
            <button
              className={`shop-page-btn arrow${page <= 1 ? ' inactive' : ''}`}
              type="button"
              onClick={() => goToPage((p) => p - 1)}
              disabled={page <= 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const n = idx + 1;
              return (
                <button
                  key={n}
                  className={`shop-page-btn${n === page ? ' active' : ''}`}
                  type="button"
                  onClick={() => goToPage(n)}
                >
                  {n}
                </button>
              );
            })}

            <button
              className={`shop-page-btn arrow${page >= totalPages ? ' inactive' : ''}`}
              type="button"
              onClick={() => goToPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              →
            </button>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
