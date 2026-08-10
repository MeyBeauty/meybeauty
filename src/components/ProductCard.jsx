/**
 * ProductCard Component
 * Exact same design as ProductsSection on Homepage
 * Used in both ProductsSection and ShopPage
 */

import { formatPriceEUR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import LazyImage from './LazyImage.jsx';
import { Percent, Heart } from 'lucide-react';

function Stars({ value }) {
  const total = 5;
  return (
    <div className="stars">
      {Array.from({ length: total }).map((_, idx) => {
        const filled = idx < value;
        return (
          <span key={idx} className={`star${filled ? '' : ' empty'}`}>
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function ProductCard({ 
  product, 
  onClick,
  showWishlist = true,
  showAddToCart = true,
  showPromoBadge = true,
  showStars = true,
  className = ''
}) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { getProductPromotion, calculateDiscountedPrice, calculateSavings } = useCatalog();

  const promo = getProductPromotion?.(product.id);
  const discountedPrice = promo ? calculateDiscountedPrice?.(product.priceCents, promo) : null;
  const savings = promo ? calculateSavings?.(product.priceCents, promo) : null;
  const outOfStock = Number(product.stock) === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    const itemToAdd = promo 
      ? { ...product, priceCents: discountedPrice, originalPriceCents: product.priceCents, promotionId: promo.id }
      : product;
    addItem(itemToAdd, 1);
  };

  const handleCardClick = (e) => {
    if (e.defaultPrevented) return;
    if (onClick) {
      onClick(product);
    } else {
      window.location.hash = `#product?id=${encodeURIComponent(product.id)}`;
    }
  };

  return (
    <div 
      className={`product-card ${className}`}
      onClick={handleCardClick}
    >
      <div className="product-img-wrap">
        {showPromoBadge && promo && (
          <span
            className="product-badge"
            style={{ 
              background: promo.badgeColor || '#ef4444',
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontFamily: 'var(--font-sc)',
              fontSize: '9px',
              letterSpacing: '0.14em',
              padding: '5px 10px',
              zIndex: 2,
              color: 'var(--blanc)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Percent size={10} />
            {promo.badgeText || 'PROMO'}
          </span>
        )}
        
        <LazyImage 
          className="product-photo" 
          src={product.images?.[0]} 
          alt={product.name}
          aspectRatio="1/1"
        />
      </div>

      {showStars && <Stars value={5} />}
      <div className="product-cat">{product.category}</div>
      <div className="product-name">{product.name}</div>
      
      {promo ? (
        <div className="product-price-container" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ 
            fontFamily: 'var(--font-corps)', 
            fontSize: '12px', 
            textDecoration: 'line-through', 
            color: '#999' 
          }}>
            {formatPriceEUR(product.priceCents)}
          </span>
          <span style={{ 
            fontFamily: 'var(--font-corps)', 
            fontSize: '13px', 
            fontWeight: 600, 
            color: 'var(--brun)' 
          }}>
            {formatPriceEUR(discountedPrice)}
          </span>
          {savings?.amount > 0 && (
            <span style={{ 
              fontFamily: 'var(--font-corps)', 
              fontSize: '11px', 
              color: '#22c55e',
              fontWeight: 500 
            }}>
              Économisez {formatPriceEUR(savings.amount)}
            </span>
          )}
        </div>
      ) : (
        <div className="product-price">{formatPriceEUR(product.priceCents)}</div>
      )}

      {showAddToCart && (
        <div className="product-card-actions">
          <button
            className="product-card-add"
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            style={outOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            {outOfStock ? 'Rupture de stock' : 'Ajouter au Panier'}
          </button>
          {showWishlist && (
            <button
              className={`product-card-wish${isWishlisted(product.id) ? ' active' : ''}`}
              type="button"
              aria-label={isWishlisted(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(product.id);
              }}
            >
              <Heart size={16} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
