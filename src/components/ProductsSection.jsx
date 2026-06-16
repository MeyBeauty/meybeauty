import useRevealOnScroll from '../hooks/useRevealOnScroll.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { popularProductIds } from '../data/products.js';
import { useCatalog } from '../context/CatalogContext.jsx';
import ProductCard from './ProductCard.jsx';

export default function ProductsSection() {
  useRevealOnScroll('.reveal');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { products: allProducts } = useCatalog();
  const cardRefs = useRef([]);
  const gridRef = useRef(null);
  const sectionRef = useRef(null);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const items = useMemo(() => {
    const byId = new Map((allProducts || []).map((p) => [p.id, p]));
    const picked = popularProductIds.map((id) => byId.get(id)).filter(Boolean);
    if (picked.length) return picked;
    return (allProducts || []).slice(0, 8);
  }, [allProducts]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const sync = () => setIsMobile(mq.matches);

    sync();
    if (mq.addEventListener) {
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    }

    mq.addListener(sync);
    return () => mq.removeListener(sync);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    if (!isSectionVisible) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(id);
  }, [isMobile, isSectionVisible, items.length]);

  useEffect(() => {
    if (!isMobile) return;
    const grid = gridRef.current;
    const el = cardRefs.current[activeIndex];
    if (!grid || !el) return;

    const gridRect = grid.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const leftInGrid = elRect.left - gridRect.left + grid.scrollLeft;
    const targetLeft = leftInGrid - (grid.clientWidth - el.clientWidth) / 2;
    grid.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, [activeIndex, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setIsSectionVisible(true);
      return;
    }

    const node = sectionRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsSectionVisible(Boolean(entry && entry.isIntersecting));
      },
      { threshold: 0.35 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="products-section reveal">
      <div className="section-header">
        <span className="section-kicker">Boutique</span>
        <h2 className="section-title">Nos produits de beauté</h2>
      </div>

      <div ref={gridRef} className="products-grid">
        {items.map((p, idx) => (
          <ProductCard
            key={p.id}
            product={p}
            className="products-section-card"
            onClick={() => {
              window.location.hash = `#product?id=${encodeURIComponent(p.id)}`;
            }}
          />
        ))}
      </div>

      {isMobile ? (
        <div className="products-dots" aria-label="Navigation produits">
          {items.map((p, idx) => (
            <span
              key={p.id}
              className={idx === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
              aria-label={`Aller au produit ${idx + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setActiveIndex(idx);
              }}
            ></span>
          ))}
        </div>
      ) : null}

      <div className="view-all-wrap">
        <a href="#shop" className="btn-cta">— Voir Tout —</a>
      </div>
    </section>
  );
}
