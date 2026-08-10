import { useMemo, useState } from 'react';
import { Heart, X, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';
import { usePromotions } from '../context/PromotionsContext.jsx';
import { formatPriceEUR } from '../data/products.js';
import LazyImage from './LazyImage.jsx';

export default function WishlistWidget() {
  const { ids, count, remove, toggle, clear } = useWishlist();
  const { products } = useCatalog();
  const { addItem } = useCart();
  const { getProductPromotion, calculateDiscountedPrice } = usePromotions();
  const [open, setOpen] = useState(false);

  const favorites = useMemo(() => {
    return ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  }, [ids, products]);

  const handleAddToCart = (product) => {
    if (Number(product.stock) === 0) return;
    const promo = getProductPromotion?.(product.id);
    const discountedPrice = promo
      ? calculateDiscountedPrice?.(product.priceCents, promo)
      : null;
    const itemToAdd = promo
      ? { ...product, priceCents: discountedPrice, originalPriceCents: product.priceCents, promotionId: promo.id }
      : product;
    addItem(itemToAdd, 1);
  };

  if (count === 0) return null;

  return (
    <>
      <button
        className="wishlist-widget-btn"
        type="button"
        aria-label={`Ouvrir les favoris (${count})`}
        onClick={() => setOpen(true)}
      >
        <Heart size={20} fill="currentColor" />
        <span className="wishlist-widget-count">{count}</span>
      </button>

      {open && (
        <>
          <div
            className="wishlist-overlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="wishlist-drawer" role="dialog" aria-modal="true" aria-label="Vos favoris">
            <div className="wishlist-drawer-header">
              <div className="wishlist-drawer-title">
                <Heart size={18} fill="currentColor" />
                <span>Vos favoris</span>
                <span className="wishlist-drawer-count">{count}</span>
              </div>
              <button
                className="wishlist-drawer-close"
                type="button"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="wishlist-drawer-body">
              {favorites.length === 0 ? (
                <p className="wishlist-empty">Votre liste de favoris est vide.</p>
              ) : (
                <ul className="wishlist-list">
                  {favorites.map((product) => {
                    const promo = getProductPromotion?.(product.id);
                    const discountedPrice = promo
                      ? calculateDiscountedPrice?.(product.priceCents, promo)
                      : null;
                    const price = discountedPrice || product.priceCents;
                    const outOfStock = Number(product.stock) === 0;
                    return (
                      <li className="wishlist-item" key={product.id}>
                        <div className="wishlist-item-img">
                          <LazyImage src={product.images?.[0]} alt={product.name} aspectRatio="1/1" />
                        </div>
                        <div className="wishlist-item-info">
                          <div className="wishlist-item-name">{product.name}</div>
                          <div className="wishlist-item-price">
                            {outOfStock ? (
                              <span style={{ color: '#b91c1c', fontSize: 12, fontWeight: 600 }}>Rupture de stock</span>
                            ) : promo ? (
                              <>
                                <span className="wishlist-price-old">{formatPriceEUR(product.priceCents)}</span>
                                <span className="wishlist-price-current">{formatPriceEUR(price)}</span>
                              </>
                            ) : (
                              <span className="wishlist-price-current">{formatPriceEUR(price)}</span>
                            )}
                          </div>
                        </div>
                        <div className="wishlist-item-actions">
                          <button
                            className="wishlist-item-add"
                            type="button"
                            aria-label={`Ajouter ${product.name} au panier`}
                            onClick={() => handleAddToCart(product)}
                            disabled={outOfStock}
                            style={outOfStock ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                          >
                            <ShoppingBag size={16} />
                          </button>
                          <button
                            className="wishlist-item-remove"
                            type="button"
                            aria-label={`Retirer ${product.name} des favoris`}
                            onClick={() => toggle(product.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="wishlist-drawer-footer">
              <button className="wishlist-clear-btn" type="button" onClick={clear}>
                Vider la liste
              </button>
              <button
                className="wishlist-cart-btn"
                type="button"
                onClick={() => {
                  favorites.forEach((p) => handleAddToCart(p));
                  setOpen(false);
                }}
              >
                Tout ajouter au panier
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
