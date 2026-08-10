import useRevealOnScroll from '../hooks/useRevealOnScroll.js';
import { useMemo } from 'react';
import { formatPriceEUR } from '../data/products.js';
import { useCatalog } from '../context/CatalogContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const IMAGES = {
  arch:
    'https://amiy.wpenginepowered.com/wp-content/uploads/2023/10/product-with-img-1.webp',
};

// Product ID for the featured product (Spray bronzant intense - not in popular products)
const FEATURED_PRODUCT_ID = 'botan-spray-bronzant-intense';

export default function LookbookSection() {
  useRevealOnScroll('.reveal');
  const { products: allProducts } = useCatalog();
  const { addItem } = useCart();

  const product = useMemo(() => {
    return allProducts?.find((p) => p.id === FEATURED_PRODUCT_ID);
  }, [allProducts]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product && Number(product.stock) !== 0) {
      addItem(product, 1);
    }
  };

  if (!product) return null;

  return (
    <section className="lookbook-section reveal">
      <div className="lookbook-photo">
        <div className="arch-frame">
          <div className="arch-bg">
            <img src={IMAGES.arch} alt="Salon d'onglerie moderne" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="lookbook-nav">
          <button aria-label="Précédent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15,18 9,12 15,6" /></svg>
          </button>
          <button aria-label="Suivant">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9,18 15,12 9,6" /></svg>
          </button>
        </div>
      </div>

      <div className="lookbook-product">
        <div className="lookbook-product-img">
          <img src={product.images?.[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="lookbook-product-name">{product.name}</div>
        <div className="lookbook-product-category">{product.category}</div>
        <div className="lookbook-product-price">{formatPriceEUR(product.priceCents)}</div>
        <div className="lookbook-dots">
          <span className="active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div style={{ marginTop: 24 }}>
          <button 
            className="btn-cta" 
            onClick={handleAddToCart}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            — Ajouter au Panier —
          </button>
        </div>
      </div>
    </section>
  );
}
