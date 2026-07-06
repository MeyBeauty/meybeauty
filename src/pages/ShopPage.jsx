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

const isActiveProduct = (p) => !p.status || p.status === 'active';

export default function ShopPage() {
  const { products: rawProducts } = useCatalog();
  const allProducts = useMemo(() => (rawProducts || []).filter(isActiveProduct), [rawProducts]);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [search, setSearch] = useState(() => parseSearchFromHash(window.location.hash || ''));
  const [priceRange, setPriceRange] = useState(130);

  useEffect(() => {
    const onHash = () => setSearch(parseSearchFromHash(window.location.hash || ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const categories = useMemo(() => {
    const set = new Set((allProducts || []).map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [allProducts]);

  const tags = useMemo(() => {
    const allowed = new Set([
      'visage',
      'corps',
      'minceur',
      'anti-âge',
      'hydratation',
      'sérum',
      'masque',
      'contour des yeux',
      'lift',
      'exfoliation',
    ]);
    const set = new Set();
    (allProducts || []).forEach((p) => {
      (Array.isArray(p.tags) ? p.tags : []).forEach((t) => {
        const tag = String(t || '').trim();
        if (allowed.has(tag)) set.add(tag);
      });
    });
    return Array.from(set).sort();
  }, [allProducts]);

  const priceBounds = useMemo(() => {
    const prices = (allProducts || []).map((p) => (p.priceCents || 0) / 100);
    return {
      min: Math.floor(Math.min(...prices, 0)),
      max: Math.ceil(Math.max(...prices, 130)),
    };
  }, [allProducts]);

  useEffect(() => {
    if (priceBounds.max > 0 && priceRange !== priceBounds.max) {
      setPriceRange(priceBounds.max);
    }
  }, [priceBounds.max]);

  const products = useMemo(() => {
    let list = allProducts || [];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (activeTag) {
      list = list.filter((p) => Array.isArray(p.tags) && p.tags.some((t) => String(t).trim() === activeTag));
    }
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
    const max = Number(priceRange);
    if (!isNaN(max) && max > 0) {
      list = list.filter((p) => (p.priceCents || 0) <= max * 100);
    }
    return list;
  }, [allProducts, activeCategory, activeTag, search, priceRange]);

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
        title="Boutique Cosmétiques - LPG & Produits Beauté | Mey Beauty 91"
        description="Boutique de cosmétiques premium LPG à Viry-Châtillon (91). Crèmes visage et corps, compléments alimentaires, soins minceur. Retrait en institut ou livraison en Ile-de-France."
        keywords="boutique cosmétiques Viry-Châtillon, produits LPG Essonne 91, crème anti-cellulite, soin visage IDF, compléments alimentaires beauté, achat cosmétiques Ile-de-France, institut beauté boutique 91"
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
                <div
                  className="price-fill"
                  style={{ width: `${((priceRange - priceBounds.min) / Math.max(1, priceBounds.max - priceBounds.min)) * 100}%` }}
                />
              </div>
              <input
                type="range"
                className="price-range-input"
                min={priceBounds.min}
                max={priceBounds.max}
                step="1"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                aria-label="Prix maximum"
              />
            </div>
            <div className="price-label">Prix : 0 € - {priceRange} €</div>
            <button
              className="btn-filter"
              type="button"
              onClick={() => setPriceRange(priceBounds.max)}
            >
              Filtrer
            </button>
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

          <div className="shop-sidebar-tags">
            <div className="shop-sidebar-title">Tags</div>
            <div className="product-tags-wrap">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`product-tag${activeTag === tag ? ' active' : ''}`}
                  onClick={() => {
                    setActiveTag((prev) => (prev === tag ? '' : tag));
                    setPage(1);
                  }}
                >
                  {tag}
                </button>
              ))}
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

          <div className="shop-tags-mobile">
            <div className="shop-tags-mobile-title">Tags</div>
            <div className="product-tags-wrap">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`product-tag${activeTag === tag ? ' active' : ''}`}
                  onClick={() => {
                    setActiveTag((prev) => (prev === tag ? '' : tag));
                    setPage(1);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
