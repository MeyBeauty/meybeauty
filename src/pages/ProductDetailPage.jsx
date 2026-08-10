import { useEffect, useMemo, useState } from 'react';
import { Heart, Search, User, Percent } from 'lucide-react';
import { formatPriceEUR, popularProductIds } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { usePromotions } from '../context/PromotionsContext.jsx';
import PromoCountdown from '../components/PromoCountdown.jsx';
import SEO, { generateProductSchema } from '../components/SEO.jsx';

function parseProductIdFromHash(hash) {
  const idx = hash.indexOf('?');
  const query = idx >= 0 ? hash.slice(idx + 1) : '';
  const params = new URLSearchParams(query);
  return params.get('id');
}

function getDealEndDate(endsAt) {
  if (endsAt) {
    const d = new Date(endsAt);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d;
}

function format2(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

function DealTimer({ endsAt }) {
  const [end] = useState(() => getDealEndDate(endsAt));
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const diff = Math.max(0, end.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return (
    <div className="pd-deal-timer" aria-label="Offre limitée">
      <div className="pd-deal-timer-label">Dépêche‑toi ! Offre limitée :</div>
      <div className="pd-timer-boxes">
        {[['Jours', format2(days)], ['Hrs', format2(hours)], ['Mins', format2(mins)], ['Secs', format2(secs)]].map(([label, val]) => (
          <div key={label} className="pd-timer-box">
            <div className="pd-timer-number">{val}</div>
            <div className="pd-timer-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const premiumDetails = "Parce que chaque peau est unique, les résultats s'adaptent à votre épiderme. Pour une expérience sur-mesure en toute sérénité, nous vous conseillons d'effectuer un test de tolérance sur le poignet si vous avez la peau particulièrement sensible.";
const premiumDelivery = "Recevez votre rituel beauté directement chez vous en un clic. Notre service client est à votre entière disposition pour vous guider à chaque étape de votre commande et faciliter vos retours.";

function AccordionItem({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  return (
    <div className={`pd-accordion-item${open ? ' active' : ''}`}>
      <div
        className="pd-accordion-header"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v); }}
        role="button"
        tabIndex={0}
      >
        <div className="pd-accordion-title">{title}</div>
        <div className="pd-accordion-icon">∧</div>
      </div>
      <div className="pd-accordion-body" style={{ maxHeight: open ? 600 : 0 }}>
        <div className="pd-accordion-content">{children}</div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { products: allProducts, getProductById, loading: catalogLoading } = useCatalog();
  const { getProductPromotion, calculateDiscountedPrice, calculateSavings } = usePromotions();
  const [productId, setProductId] = useState(() => parseProductIdFromHash(window.location.hash || ''));
  const product = useMemo(() => (productId ? getProductById(productId) : null), [productId, getProductById, allProducts]);

  useEffect(() => {
    console.log('[ProductDetail] productId:', productId);
    console.log('[ProductDetail] products available:', allProducts?.length || 0);
    console.log('[ProductDetail] catalogLoading:', catalogLoading);
    console.log('[ProductDetail] product found:', product);
  }, [productId, allProducts, catalogLoading, product]);

  const promotion = useMemo(() => product ? getProductPromotion(product.id) : null, [product, getProductPromotion]);
  const discountedPrice = useMemo(() => {
    if (!product || !promotion) return product?.priceCents || 0;
    return calculateDiscountedPrice(product.priceCents, promotion);
  }, [product, promotion, calculateDiscountedPrice]);
  const savings = useMemo(() => {
    if (!product || !promotion) return null;
    return calculateSavings(product.priceCents, promotion);
  }, [product, promotion, calculateSavings]);
  const isActive = (p) => p && p.status === 'active';
  const outOfStock = product ? Number(product.stock) === 0 : false;

  const related = useMemo(() => {
    const active = (allProducts || []).filter(isActive);
    const byId = new Map(active.map((p) => [p.id, p]));
    const picked = popularProductIds.map((id) => byId.get(id)).filter(Boolean).filter((p) => p.id !== productId).slice(0, 3);
    if (picked.length) return picked;
    return active.filter((p) => p.id !== productId).slice(0, 3);
  }, [allProducts, productId]);

  const mini = useMemo(() => {
    const active = (allProducts || []).filter(isActive);
    const byId = new Map(active.map((p) => [p.id, p]));
    const picked = popularProductIds.map((id) => byId.get(id)).filter(Boolean).slice(0, 5);
    if (picked.length) return picked;
    return active.slice(0, 5);
  }, [allProducts]);

  const images = product?.images?.length ? product.images : ['/produits/produit (1).webp'];
  const [mainImg, setMainImg] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const netQuantity = product?.netQuantity || '-';
  const skinType = product?.skinType || '-';

  useEffect(() => {
    const onHash = () => setProductId(parseProductIdFromHash(window.location.hash || ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Reset main image when product images become available (e.g. after Firebase load)
  useEffect(() => { setMainImg(images[0]); setQty(1); }, [productId, images[0]]);

  const productStructuredData = product ? generateProductSchema(product) : null;

  if (catalogLoading) {
    return (
      <>
        <SEO
          title="Produit LPG - Cosmétiques Visage & Corps | Mey Beauty 91"
          description="Produits cosmétiques premium LPG disponibles à Viry-Châtillon (91). Soins visage et corps, crèmes anti-cellulite, compléments alimentaires beauté. Retrait en institut ou livraison IDF."
          keywords="produits LPG Viry-Châtillon, cosmétiques soin visage Essonne 91, crème anti-cellulite, compléments alimentaires beauté, achat cosmétiques Ile-de-France, boutique LPG 91"
        />
        <main className="product-detail-page">
          <section className="page-hero-banner" aria-label="Bannière">
            <h1>Produit</h1>
            <div className="breadcrumb">
              <a href="#home">Accueil</a><span>/</span>
              <a href="#shop">Boutique</a><span>/</span>
              <span>Produit</span>
            </div>
          </section>
          <section className="pd-notfound" aria-label="Chargement">
            <div className="legal-block"><p>Chargement du produit...</p></div>
          </section>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SEO
          title="Produit LPG - Cosmétiques Visage & Corps | Mey Beauty 91"
          description="Produits cosmétiques premium LPG disponibles à Viry-Châtillon (91). Soins visage et corps, crèmes anti-cellulite, compléments alimentaires beauté. Retrait en institut ou livraison IDF."
          keywords="produits LPG Viry-Châtillon, cosmétiques soin visage Essonne 91, crème anti-cellulite, compléments alimentaires beauté, achat cosmétiques Ile-de-France, boutique LPG 91"
        />
        <main className="product-detail-page">
          <section className="page-hero-banner" aria-label="Bannière">
            <h1>Produit</h1>
            <div className="breadcrumb">
              <a href="#home">Accueil</a><span>/</span>
              <a href="#shop">Boutique</a><span>/</span>
              <span>Produit</span>
            </div>
          </section>
          <section className="pd-notfound" aria-label="Produit introuvable">
            <div className="legal-block">
              <h2>Produit introuvable</h2>
              <p>Le produit demandé n&apos;existe pas ou n&apos;est plus disponible.<br /><a href="#shop">Retour à la boutique</a></p>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        keywords={`${product.name}, ${product.category}, ${product.brand}, LPG, cosmétique, soin`}
        image={product.images?.[0]}
        type="product"
        structuredData={productStructuredData}
      />
      <main className="product-detail-page" style={{ zoom: '90%' }}>
        <section className="page-hero-banner" aria-label="Bannière">
          <h1>Produit</h1>
          <div className="breadcrumb">
            <a href="#home">Accueil</a><span>/</span>
            <a href="#shop">Boutique</a><span>/</span>
            <span>{product.name}</span>
          </div>
        </section>

        <section className="pd-product-layout" aria-label="Détail du produit">

          {/* ── Galerie — inchangée ── */}
          <div className="pd-product-gallery">
            <div className="pd-main-img-wrap">
              <img src={mainImg} alt={product.name} className="pd-main-img" loading="lazy" />
            </div>
            <div className="pd-thumbnails" aria-label="Miniatures">
              {images.slice(0, 4).map((img) => (
                <div
                  key={img}
                  className={`pd-thumb${mainImg === img ? ' active' : ''}`}
                  onClick={() => setMainImg(img)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={img} alt="Aperçu" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Infos produit ── */}
          <div className="pd-product-info">
            <h1 className="pd-product-title">{product.name}</h1>

            {/* Prix / promo — inchangé */}
            {promotion ? (
              <div className="pd-promo-section">
                <span className="pd-promo-badge" style={{ background: promotion.badgeColor || '#ef4444' }}>
                  <Percent size={12} />
                  {promotion.badgeText || 'PROMO'}
                </span>
                <div className="pd-promo-title">{promotion.title}</div>
                {promotion.description && <div className="pd-promo-description">{promotion.description}</div>}
                <div className="pd-promo-prices">
                  <span className="pd-original-price">{formatPriceEUR(product.priceCents)}</span>
                  <span className="pd-promo-price">{formatPriceEUR(discountedPrice)}</span>
                  {savings?.percentage > 0 && <span className="pd-savings">-{savings.percentage}%</span>}
                </div>
                {promotion.endDate && <PromoCountdown endDate={promotion.endDate} />}
              </div>
            ) : (
              <div className="pd-product-price">{formatPriceEUR(product.priceCents)}</div>
            )}

            {outOfStock && (
              <div style={{ display: 'inline-block', marginTop: 10, padding: '6px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Rupture de stock
              </div>
            )}

            {/* ────────────────────────────────────────────────────
                MÉTA-INFOS — remplacées par des puces bien stylées
                (seule modification par rapport à l'original)
            ──────────────────────────────────────────────────── */}
            <div style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              margin: '18px 0',
            }}>
              {[
                { label: 'Quantité nette', value: netQuantity },
                { label: 'Type de peau',   value: skinType   },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    background: '#f5f4f0',
                    borderRadius: 12,
                    padding: '10px 16px',
                    minWidth: 120,
                  }}
                >
                  <span style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: '#9ca3af',
                    fontWeight: 500,
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1a1a2e',
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* ────────────────────────────────────────────────────
                DESCRIPTION — même classe CSS, juste un peu d'air
                (seule modification par rapport à l'original)
            ──────────────────────────────────────────────────── */}
            <p className="pd-product-desc" style={{ lineHeight: 1.75, marginBottom: 24 }}>
              {product.description}
            </p>

            {/* ────────────────────────────────────────────────────
                AJOUT AU PANIER — boutons +/- redessinés,
                reste identique à l'original
            ──────────────────────────────────────────────────── */}
            <div className="pd-add-row" aria-label="Ajout au panier">
              <div className="pd-add-actions">
                <button
                  type="button"
                  className="pd-btn-add-cart"
                  disabled={outOfStock}
                  style={outOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                  onClick={() => {
                    if (outOfStock) return;
                    const itemToAdd = promotion
                      ? { ...product, priceCents: discountedPrice, originalPriceCents: product.priceCents, promotionId: promotion.id }
                      : product;
                    addItem(itemToAdd, qty);
                  }}
                >
                  {outOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>

                <button
                  type="button"
                  className={`pd-btn-wishlist${isWishlisted(product.id) ? ' active' : ''}`}
                  aria-label={isWishlisted(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  onClick={() => toggle(product.id)}
                >
                  <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="pd-qty-wrap">
                <button
                  type="button"
                  className="pd-qty-btn"
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <input
                  className="pd-qty-input"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  aria-label="Quantité"
                />
                <button
                  type="button"
                  className="pd-qty-btn"
                  onClick={() => setQty((v) => v + 1)}
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pd-accordion" aria-label="Informations">
              <AccordionItem title="Détails complémentaires">
                <p>{product.details || premiumDetails}</p>
              </AccordionItem>
              <AccordionItem title="Spécifications">
                <ul>
                  <li>Marque : {product.brand}</li>
                  <li>Catégorie : {product.category}</li>
                  <li>Quantité nette : {netQuantity}</li>
                  <li>Type de peau : {skinType}</li>
                </ul>
              </AccordionItem>
              <AccordionItem title="Livraison & retours">
                <p>{product.delivery || premiumDelivery}</p>
              </AccordionItem>
            </div>
          </div>

          {/* ── Sidebar — inchangée ── */}
          <aside className="pd-product-sidebar" aria-label="Sidebar">
            <div>
              <div className="pd-sidebar-title">Recherche produit</div>
              <div className="pd-shop-search">
                <input
                  type="text"
                  placeholder="Rechercher…"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = (sidebarSearch || '').trim();
                      window.location.hash = q ? `#shop?search=${encodeURIComponent(q)}` : '#shop';
                    }
                  }}
                />
                <button
                  type="button"
                  aria-label="Rechercher"
                  onClick={() => {
                    const q = (sidebarSearch || '').trim();
                    window.location.hash = q ? `#shop?search=${encodeURIComponent(q)}` : '#shop';
                  }}
                >
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div>
              <div className="pd-sidebar-title">Produits populaires</div>
              <div className="pd-mini-products">
                {mini.map((p) => (
                  <div
                    key={p.id}
                    className="pd-mini-product"
                    onClick={() => {
                      window.location.hash = `#product?id=${encodeURIComponent(p.id)}`;
                      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                    }}
                  >
                    <img src={p.images?.[0]} alt={p.name} className="pd-mini-product-img" loading="lazy" />
                    <div className="pd-mini-product-info">
                      <div className="pd-mini-product-name">{p.name}</div>
                      <div className="pd-mini-product-price">{formatPriceEUR(p.priceCents)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="pd-sidebar-title">Commentaire</div>
              <div className="pd-mini-comment">
                <div className="pd-mini-comment-avatar" aria-hidden="true">
                  <User size={18} />
                </div>
                <div>
                  <div className="pd-mini-comment-name">Mey Beauty</div>
                  <div className="pd-mini-comment-text">
                    Besoin d'un conseil avant achat ? Écris‑nous sur la page contact.
                  </div>
                </div>
              </div>
              <a className="pd-mini-comment-cta" href="#contact">Nous contacter</a>
            </div>
          </aside>
        </section>

        {/* Produits associés — inchangés */}
        <section className="pd-related-section" aria-label="Produits associés">
          <h2 className="pd-related-title">Produits associés</h2>
          <div className="pd-related-grid">
            {related.map((p) => (
              <div
                key={p.id}
                className="pd-related-card"
                onClick={() => {
                  window.location.hash = `#product?id=${encodeURIComponent(p.id)}`;
                  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                }}
              >
                <div className="pd-related-img-wrap">
                  <img src={p.images?.[0]} alt={p.name} className="pd-related-img" loading="lazy" />
                </div>
                <div className="pd-related-info">
                  <div className="pd-related-category">{p.category}</div>
                  <div className="pd-related-name">{p.name}</div>
                  <div className="pd-related-price">{formatPriceEUR(p.priceCents)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}