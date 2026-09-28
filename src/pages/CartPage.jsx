import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Lock,
  X,
  Wallet,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Sparkles,
  Truck,
  Package,
} from 'lucide-react';
import { getProductById as getLocalProductById, formatPriceEUR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardPaymentForm } from '../components/StripeCardForm.jsx';
import { createOrder } from '../firebase/collections.js';
import SEO from '../components/SEO.jsx';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const { items, removeItem, setQuantity, clearCart } = useCart();
  const { getProductById: getCatalogProductById, loading: catalogLoading } = useCatalog();
  const [orderComplete, setOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [shippingInfo, setShippingInfo] = useState(null); // { shippingOptionCode, name, priceCents, carrier }

  // Build cart lines with correct pricing
  const lines = useMemo(() => {
    return items
      .map((it) => {
        const product = getCatalogProductById?.(it.productId) || getLocalProductById(it.productId);
        if (!product) return null;
        const quantity = Math.max(1, Number(it.quantity) || 1);
        // Use stored promotional price if available, otherwise use product price
        const priceCents = it.priceCents || product.priceCents || 0;
        const originalPriceCents = it.originalPriceCents || product.priceCents || 0;
        const hasPromotion = it.promotionId && originalPriceCents > priceCents;
        const lineTotalCents = priceCents * quantity;
        return {
          product,
          quantity,
          priceCents,
          originalPriceCents,
          lineTotalCents,
          hasPromotion,
          promotionId: it.promotionId,
          savingsPerUnit: hasPromotion ? originalPriceCents - priceCents : 0,
          outOfStock: Number(product.stock) === 0,
        };
      })
      .filter(Boolean);
  }, [items, getCatalogProductById]);

  const subtotalCents = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotalCents, 0),
    [lines]
  );

  const shippingCents = shippingInfo?.priceCents || 0;
  const totalCents = subtotalCents + shippingCents;

  // Total weight in grams (default 500g per item — cosmetics are lightweight)
  const totalWeightGrams = useMemo(
    () => lines.reduce((sum, l) => sum + (l.product.weightGrams || 500) * l.quantity, 0),
    [lines]
  );

  const hasOutOfStock = useMemo(() => lines.some((l) => l.outOfStock), [lines]);

  const hasPromotions = useMemo(() => lines.some((l) => l.promotionId), [lines]);
  const totalSavings = useMemo(() => {
    return lines.reduce((sum, l) => {
      if (l.originalPriceCents && l.originalPriceCents !== l.priceCents) {
        return sum + (l.originalPriceCents - l.priceCents) * l.quantity;
      }
      return sum;
    }, 0);
  }, [lines]);

  const handlePaymentSuccess = useCallback(async (amount, paymentMethod, customerInfo = {}) => {
    if (!lines || lines.length === 0) {
      console.warn('[Order] Cannot create order: cart is empty');
      return;
    }
    const finalAmount = amount || totalCents;
    setPaidAmount(finalAmount);

    // Create order in Firebase
    try {
      const orderData = {
        customer: {
          firstName: customerInfo.firstName || '',
          lastName: customerInfo.lastName || '',
          email: customerInfo.email || '',
          phone: customerInfo.phone || '',
          address: customerInfo.address || '',
          city: customerInfo.city || '',
          postalCode: customerInfo.postalCode || ''
        },
        items: lines.map(line => ({
          productId: line.product.id,
          name: line.product.name,
          quantity: line.quantity,
          priceCents: line.priceCents,
          totalCents: line.lineTotalCents,
        })),
        subtotalCents,
        shippingCents,
        totalAmountCents: finalAmount,
        paymentMethod: paymentMethod || 'unknown',
        status: 'paid',
        shipping: shippingInfo ? {
          shippingOptionCode: shippingInfo.shippingOptionCode,
          name: shippingInfo.name,
          carrier: shippingInfo.carrier,
          priceCents: shippingInfo.priceCents,
          status: 'pending',
        } : null,
        createdAt: new Date().toISOString(),
      };

      await createOrder(orderData);
      console.log('[Order] Order saved successfully');
    } catch (err) {
      console.error('[Order] Failed to save order:', err);
    }

    setOrderComplete(true);
    clearCart();
    setIsProcessing(false);
  }, [clearCart, totalCents, lines, subtotalCents, shippingCents, shippingInfo]);

  return (
    <>
      <SEO
        title="Panier - Commande Cosmétiques LPG | Mey Beauty Viry-Châtillon"
        description="Finalisez votre commande de cosmétiques LPG à Viry-Châtillon (91). Paiement sécurisé par carte ou PayPal. Retrait en institut ou livraison en Ile-de-France."
        keywords="panier cosmétiques Viry-Châtillon, commande LPG Essonne 91, paiement sécurisé beauté, achat soins visage IDF, boutique en ligne beauté Ile-de-France"
        noindex={true}
      />
      <main className="cart-page">
      <section className="page-hero-banner" aria-label="Bannière">
        <h1>Panier</h1>
        <div className="breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <span>Panier</span>
        </div>
      </section>

      <section className="cart-layout" aria-label="Contenu du panier">
        <div className="cart-main">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <div className="legal-block">
                {catalogLoading && items.length > 0 ? (
                  <>
                    <h2>Chargement du panier…</h2>
                    <p>Récupération de vos produits en cours.</p>
                  </>
                ) : (
                  <>
                    <h2>Ton panier est vide</h2>
                    <p>
                      Ajoute des produits depuis la boutique.
                      <br />
                      <a href="#shop">Aller à la boutique</a>
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="cart-table" role="table" aria-label="Liste des produits">
                <div className="cart-row cart-head" role="row">
                  <div role="columnheader">Produit</div>
                  <div role="columnheader">Prix</div>
                  <div role="columnheader">Quantité</div>
                  <div role="columnheader">Total</div>
                  <div role="columnheader"></div>
                </div>

                {lines.map((l) => (
                  <div key={l.product.id} className="cart-row" role="row">
                    <div className="cart-product" role="cell">
                      <img
                        src={l.product.images?.[0]}
                        alt={l.product.name}
                        className="cart-product-img"
                        loading="lazy"
                      />
                      <div className="cart-product-meta">
                        <div className="cart-product-name">{l.product.name}</div>
                        <div className="cart-product-cat">{l.product.category}</div>
                        {l.outOfStock && (
                          <div style={{ color: '#b91c1c', fontSize: 11, fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Rupture de stock
                          </div>
                        )}
                      </div>
                    </div>

                    <div role="cell" className="cart-price">
                      {l.hasPromotion ? (
                        <div className="cart-price-promo">
                          <span className="cart-price-original">{formatPriceEUR(l.originalPriceCents)}</span>
                          <span className="cart-price-current">{formatPriceEUR(l.priceCents)}</span>
                        </div>
                      ) : (
                        formatPriceEUR(l.priceCents)
                      )}
                    </div>

                    <div role="cell" className="cart-qty">
                      <div className="cart-qty-wrap">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => setQuantity(l.product.id, Math.max(1, l.quantity - 1))}
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <input
                          className="cart-qty-input"
                          type="number"
                          min={1}
                          value={l.quantity}
                          onChange={(e) => setQuantity(l.product.id, Math.max(1, Number(e.target.value) || 1))}
                          aria-label="Quantité"
                        />
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => setQuantity(l.product.id, l.quantity + 1)}
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div role="cell" className="cart-line-total">
                      {formatPriceEUR(l.lineTotalCents)}
                    </div>

                    <div role="cell" className="cart-remove">
                      <button type="button" className="cart-remove-btn" onClick={() => removeItem(l.product.id)}>
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-actions">
                <button type="button" className="cart-clear" onClick={clearCart}>
                  Vider le panier
                </button>
                <a className="cart-back" href="#shop">
                  Continuer mes achats
                </a>
              </div>
            </>
          )}
        </div>

        <aside className="cart-summary" aria-label="Récapitulatif">
          <div className="cart-summary-box cart-summary-box-modern">
            <div className="cart-summary-title">
              <Sparkles size={16} strokeWidth={2} />
              Récapitulatif
            </div>
            <div className="cart-summary-line">
              <span>Sous‑total</span>
              <span>{formatPriceEUR(subtotalCents)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Livraison</span>
              <span>{shippingCents > 0 ? formatPriceEUR(shippingCents) : 'Selon options'}</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span>{formatPriceEUR(totalCents)}</span>
            </div>

            {orderComplete ? (
              <div className="cart-order-success">
                <div className="cart-success-icon">
                  <CheckCircle size={32} strokeWidth={2} />
                </div>
                <h3>Merci pour votre commande !</h3>
                <p className="cart-success-text">
                  Votre paiement a bien été reçu. Un email de confirmation vous sera envoyé dans quelques instants.
                </p>
                <div className="cart-success-details">
                  <span className="cart-success-label">Montant payé</span>
                  <span className="cart-success-amount">{formatPriceEUR(paidAmount)}</span>
                </div>
                {paidAmount > 0 && totalSavings > 0 && (
                  <p className="cart-success-savings">Vous avez économisé {formatPriceEUR(totalSavings)}</p>
                )}
                <button className="cart-success-btn" onClick={() => { setOrderComplete(false); window.location.href = '#shop'; }}>
                  Continuer mes achats <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="cart-pay-main-btn"
                  onClick={() => setShowCheckout(true)}
                  disabled={subtotalCents === 0 || hasOutOfStock}
                >
                  <CreditCard size={18} strokeWidth={1.8} />
                  Commander {formatPriceEUR(totalCents)}
                  <ArrowRight size={16} />
                </button>
                <p className="cart-pay-main-note">
                  Paiement sécurisé · Vous pourrez choisir carte bancaire ou PayPal
                </p>
                {hasOutOfStock && (
                  <p style={{ color: '#b91c1c', fontSize: 12, fontWeight: 500, marginTop: 8, textAlign: 'center' }}>
                    Retirez les produits en rupture de stock pour finaliser votre commande.
                  </p>
                )}
              </>
            )}

            {showCheckout && (
              <Elements stripe={stripePromise}>
                <CheckoutModal
                  amount={totalCents}
                  subtotalCents={subtotalCents}
                  shippingCents={shippingCents}
                  totalSavings={totalSavings}
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                  shippingInfo={shippingInfo}
                  setShippingInfo={setShippingInfo}
                  totalWeightGrams={totalWeightGrams}
                  onSuccess={handlePaymentSuccess}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  onClose={() => setShowCheckout(false)}
                />
              </Elements>
            )}
          </div>
        </aside>
      </section>
    </main>
    </>
  );
}

// Checkout modal with three steps:
// 1. Customer information
// 2. Shipping method selection (Sendcloud delivery options)
// 3. Payment method selection (Card or PayPal)
function CheckoutModal({ amount, subtotalCents, shippingCents, totalSavings, customerInfo, setCustomerInfo, shippingInfo, setShippingInfo, totalWeightGrams, onSuccess, isProcessing, setIsProcessing, onClose }) {
  const [step, setStep] = useState('customer'); // 'customer' | 'shipping' | 'payment' | 'card' | 'paypal'
  const [paypalReady, setPaypalReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressSearchTimeout, setAddressSearchTimeout] = useState(null);

  const paypalButtonRef = useRef(null);
  const paypalButtonsRef = useRef(null);
  const renderTimeoutRef = useRef(null);
  const customerInfoRef = useRef(customerInfo);

  const amountEuros = (amount / 100).toFixed(2);
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    customerInfoRef.current = customerInfo;
  }, [customerInfo]);

  useEffect(() => {
    if (!isCustomerFormValid() && errorMsg && !errorMsg.includes('PayPal')) {
      return;
    }
    if (isCustomerFormValid() && errorMsg && errorMsg.includes('informations client')) {
      setErrorMsg('');
    }
  }, [customerInfo, errorMsg]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const isCustomerFormValid = () => {
    const info = customerInfoRef.current;
    return info && info.firstName?.trim() && info.lastName?.trim() && info.email?.trim() && info.phone?.trim() && info.address?.trim() && info.city?.trim() && info.postalCode?.trim();
  };

  const handleCustomerSubmit = () => {
    if (!isCustomerFormValid()) {
      setErrorMsg('Veuillez remplir toutes vos informations client.');
      return;
    }
    setErrorMsg('');
    setStep('shipping');
  };

  // Fetch delivery options from Sendcloud via Netlify function
  const fetchDeliveryOptions = useCallback(async () => {
    setDeliveryLoading(true);
    setDeliveryError('');
    try {
      const info = customerInfoRef.current;
      const totalOrderValue = (subtotalCents / 100).toFixed(2);
      const resp = await fetch('/api/sendcloud-delivery-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightGrams: totalWeightGrams || 500,
          totalOrderValue,
          toCountryCode: 'FR',
          toPostalCode: info.postalCode,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des options de livraison');
      }
      setDeliveryOptions(data.options || []);
    } catch (err) {
      console.error('[Delivery] fetch error:', err);
      setDeliveryError(err.message);
      setDeliveryOptions([]);
    } finally {
      setDeliveryLoading(false);
    }
  }, [subtotalCents, totalWeightGrams]);

  // Fetch delivery options when entering the shipping step
  useEffect(() => {
    if (step === 'shipping' && deliveryOptions.length === 0 && !deliveryLoading && !deliveryError) {
      fetchDeliveryOptions();
    }
  }, [step, deliveryOptions.length, deliveryLoading, deliveryError, fetchDeliveryOptions]);

  const updateField = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    customerInfoRef.current = { ...customerInfoRef.current, [field]: value };
  };

  // Search address using French government API
  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    try {
      const resp = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await resp.json();
      setAddressSuggestions(data.features || []);
      setShowAddressSuggestions(true);
    } catch (err) {
      console.error('[Address API] error:', err);
      setAddressSuggestions([]);
    }
  };

  const handleAddressChange = (value) => {
    updateField('address', value);
    
    // Debounce API call
    if (addressSearchTimeout) clearTimeout(addressSearchTimeout);
    const timeout = setTimeout(() => searchAddress(value), 300);
    setAddressSearchTimeout(timeout);
  };

  const selectAddress = (feature) => {
    const props = feature.properties;
    updateField('address', props.name || '');
    updateField('city', props.city || '');
    updateField('postalCode', props.postcode || '');
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  // Load PayPal SDK and render button
  const loadPayPal = () => {
    if (!paypalClientId) return;
    if (window.paypal) {
      scheduleRender();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR&intent=capture&locale=fr_FR`;
    script.async = true;
    script.onload = () => scheduleRender();
    script.onerror = () => setErrorMsg('Erreur chargement PayPal - vérifiez votre connexion');
    document.body.appendChild(script);
  };

  const scheduleRender = () => {
    if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
    renderTimeoutRef.current = setTimeout(() => renderPayPal(), 100);
  };

  const renderPayPal = () => {
    if (!window.paypal) {
      setErrorMsg('SDK PayPal non chargé — vérifiez votre connexion.');
      return;
    }
    if (!paypalButtonRef.current) return;

    if (paypalButtonsRef.current) {
      try { paypalButtonsRef.current.close(); } catch (e) {}
      paypalButtonsRef.current = null;
    }
    paypalButtonRef.current.innerHTML = '';

    try {
      const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 45
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'EUR',
                value: amountEuros,
                breakdown: {
                  item_total: { currency_code: 'EUR', value: amountEuros }
                }
              },
              description: 'Commande Mey Beauty',
              custom_id: 'MEY-' + Date.now()
            }],
            application_context: { shipping_preference: 'NO_SHIPPING' }
          });
        },
        onApprove: async (data, actions) => {
          setIsProcessing(true);
          try {
            const details = await actions.order.capture();
            if (details.status === 'COMPLETED') {
              onClose();
              onSuccess(amount, 'paypal', customerInfoRef.current);
            } else {
              setErrorMsg('Statut PayPal: ' + details.status);
              setIsProcessing(false);
            }
          } catch (err) {
            setErrorMsg('Erreur capture PayPal: ' + (err.message || 'Erreur inconnue'));
            setIsProcessing(false);
          }
        },
        onError: (err) => {
          setErrorMsg('Erreur PayPal: ' + (err.message || 'Erreur inconnue'));
          setIsProcessing(false);
        },
        onCancel: () => setIsProcessing(false)
      });

      paypalButtonsRef.current = buttons;
      buttons.render(paypalButtonRef.current).then(() => {
        setPaypalReady(true);
      }).catch((err) => {
        setErrorMsg('Erreur affichage bouton PayPal: ' + err.message);
        paypalButtonsRef.current = null;
      });
    } catch (err) {
      setErrorMsg('Erreur rendu PayPal: ' + err.message);
    }
  };

  useEffect(() => {
    if (paypalClientId && amount > 0) {
      loadPayPal();
    }
    return () => {
      if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
      if (paypalButtonsRef.current) {
        try { paypalButtonsRef.current.close(); } catch (e) {}
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paypalClientId, amount]);

  // Re-render PayPal buttons when the user enters the PayPal step
  // (the container div only exists when step === 'paypal')
  useEffect(() => {
    if (step === 'paypal' && paypalClientId && amount > 0) {
      if (window.paypal) {
        scheduleRender();
      } else {
        loadPayPal();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paypalClientId, amount]);

  const isFormValid = isCustomerFormValid();

  const stepTitle = {
    customer: 'Vos informations',
    shipping: 'Mode de livraison',
    payment: 'Mode de paiement',
    card: 'Paiement par carte',
    paypal: 'Paiement PayPal'
  }[step];

  const stepIcon = step === 'paypal' ? <Wallet size={18} strokeWidth={1.8} /> : step === 'shipping' ? <Truck size={18} strokeWidth={1.8} /> : <CreditCard size={18} strokeWidth={1.8} />;

  return (
    <div className="checkout-modal-overlay open" onClick={onClose}>
      <div className="checkout-modal checkout-modal-wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="checkout-modal-header">
          <div className="checkout-modal-header-left">
            <span className="checkout-modal-icon">
              {stepIcon}
            </span>
            <div>
              <div className="checkout-modal-title">{stepTitle}</div>
              <div className="checkout-modal-amount">{formatPriceEUR(amount)}</div>
            </div>
          </div>
          <button type="button" className="checkout-modal-close" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="checkout-modal-body">
          {/* Step progress */}
          <div className="checkout-progress">
            <div className={`checkout-progress-step${step !== 'customer' ? ' active' : ''}${step === 'customer' ? ' current' : ''}`}>
              <span className="checkout-progress-num">1</span>
              <span className="checkout-progress-label">Informations</span>
            </div>
            <div className={`checkout-progress-line${step === 'shipping' || step === 'payment' || step === 'card' || step === 'paypal' ? ' active' : ''}`} />
            <div className={`checkout-progress-step${step === 'payment' || step === 'card' || step === 'paypal' ? ' active' : ''}${step === 'shipping' ? ' current' : ''}`}>
              <span className="checkout-progress-num">2</span>
              <span className="checkout-progress-label">Livraison</span>
            </div>
            <div className={`checkout-progress-line${step === 'payment' || step === 'card' || step === 'paypal' ? ' active' : ''}`} />
            <div className={`checkout-progress-step${step === 'card' || step === 'paypal' ? ' active' : ''}${step === 'payment' ? ' current' : ''}`}>
              <span className="checkout-progress-num">3</span>
              <span className="checkout-progress-label">Paiement</span>
            </div>
          </div>

          {errorMsg && (
            <div className="cart-pay-alert cart-pay-alert-error">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Customer information */}
          {(step === 'customer') && (
            <div className="checkout-step">
              <div className="cart-customer-form cart-customer-form-modern checkout-customer-form">
                <div className="cart-form-row">
                  <div className="cart-input-group">
                    <User size={15} className="cart-input-icon" />
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={customerInfo.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="cart-form-input"
                    />
                  </div>
                  <div className="cart-input-group">
                    <User size={15} className="cart-input-icon" />
                    <input
                      type="text"
                      placeholder="Nom"
                      value={customerInfo.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="cart-form-input"
                    />
                  </div>
                </div>

                <div className="cart-form-row">
                  <div className="cart-input-group">
                    <Mail size={15} className="cart-input-icon" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={customerInfo.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="cart-form-input"
                    />
                  </div>
                  <div className="cart-input-group">
                    <Phone size={15} className="cart-input-icon" />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      value={customerInfo.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="cart-form-input"
                    />
                  </div>
                </div>

                <div className="cart-form-row cart-form-row-address">
                  <div className="cart-input-group cart-input-group-full address-autocomplete-wrapper">
                    <MapPin size={15} className="cart-input-icon" />
                    <input
                      type="text"
                      placeholder="Adresse (commencez à taper...)"
                      value={customerInfo.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                      className="cart-form-input"
                      autoComplete="off"
                    />
                    {showAddressSuggestions && addressSuggestions.length > 0 && (
                      <div className="address-suggestions">
                        {addressSuggestions.map((feature, idx) => {
                          const props = feature.properties;
                          return (
                            <div
                              key={idx}
                              className="address-suggestion-item"
                              onClick={() => selectAddress(feature)}
                            >
                              <MapPin size={14} className="suggestion-icon" />
                              <div className="suggestion-content">
                                <div className="suggestion-name">{props.name}</div>
                                <div className="suggestion-meta">
                                  {props.postcode} {props.city}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="cart-form-row cart-form-row-city">
                  <div className="cart-input-group">
                    <Building2 size={15} className="cart-input-icon" />
                    <input
                      type="text"
                      placeholder="Ville"
                      value={customerInfo.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="cart-form-input"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Code postal"
                    value={customerInfo.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    className="cart-form-input cart-form-input-postal"
                  />
                </div>
              </div>

              <button
                type="button"
                className="cart-pay-main-btn"
                onClick={handleCustomerSubmit}
                disabled={isProcessing}
              >
                Continuer
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2: Shipping method selection */}
          {step === 'shipping' && (
            <div className="checkout-step">
              {deliveryLoading && (
                <div className="shipping-loading">
                  <Truck size={20} className="shipping-loading-icon" />
                  <span>Recherche des options de livraison…</span>
                </div>
              )}

              {deliveryError && !deliveryLoading && (
                <div className="cart-pay-alert cart-pay-alert-warning">
                  {deliveryError}
                </div>
              )}

              {!deliveryLoading && !deliveryError && deliveryOptions.length === 0 && (
                <div className="cart-pay-alert cart-pay-alert-warning">
                  Aucune option de livraison trouvée pour cette adresse.
                </div>
              )}

              {!deliveryLoading && deliveryOptions.length > 0 && (
                <div className="shipping-options-list">
                  {deliveryOptions.map((opt) => {
                    const isSelected = shippingInfo?.shippingOptionCode === opt.shippingOptionCode;
                    const priceCents = opt.price != null ? Math.round(opt.price * 100) : null;
                    const leadTimeText = opt.leadTimeHours
                      ? (opt.leadTimeHours >= 24
                          ? `~${Math.ceil(opt.leadTimeHours / 24)} jour(s)`
                          : `~${opt.leadTimeHours}h`)
                      : null;
                    return (
                      <label
                        key={opt.shippingOptionCode}
                        className={`shipping-option-card${isSelected ? ' selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="shipping-option"
                          value={opt.shippingOptionCode}
                          checked={isSelected}
                          onChange={() => setShippingInfo({
                            shippingOptionCode: opt.shippingOptionCode,
                            name: opt.name,
                            carrier: opt.carrier,
                            priceCents: priceCents || 0,
                          })}
                        />
                        <span className="shipping-option-radio" />
                        {opt.logoUrl && (
                          <img src={opt.logoUrl} alt={opt.carrier} className="shipping-option-logo" />
                        )}
                        <span className="shipping-option-content">
                          <span className="shipping-option-header">
                            <span className="shipping-option-name">{opt.name}</span>
                            <span className="shipping-option-price">
                              {priceCents != null
                                ? (priceCents > 0 ? formatPriceEUR(priceCents) : 'Gratuit')
                                : 'À calculer'}
                            </span>
                          </span>
                          <span className="shipping-option-meta">
                            {opt.carrier && <span className="shipping-option-carrier">{opt.carrier}</span>}
                            {leadTimeText && (
                              <span className="shipping-option-delay">
                                {leadTimeText}
                              </span>
                            )}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="shipping-actions">
                <button
                  type="button"
                  className="checkout-back-btn"
                  onClick={() => setStep('customer')}
                  disabled={isProcessing}
                >
                  ← Modifier mes informations
                </button>
                <button
                  type="button"
                  className="cart-pay-main-btn"
                  onClick={() => setStep('payment')}
                  disabled={isProcessing || !shippingInfo}
                >
                  Continuer vers le paiement
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment method selection */}
          {step === 'payment' && (
            <div className="checkout-step">
              <div className="pay-method-grid">
                <button
                  type="button"
                  className="pay-method-card"
                  onClick={() => setStep('card')}
                  disabled={isProcessing || amount === 0}
                >
                  <span className="pay-method-icon">
                    <CreditCard size={20} strokeWidth={1.8} />
                  </span>
                  <span className="pay-method-text">
                    <span className="pay-method-title">Carte bancaire</span>
                    <span className="pay-method-sub">Visa, Mastercard, Amex</span>
                  </span>
                  <ChevronRight size={18} className="pay-method-arrow" />
                </button>

                <button
                  type="button"
                  className="pay-method-card"
                  onClick={() => setStep('paypal')}
                  disabled={isProcessing || amount === 0 || !paypalClientId}
                >
                  <span className="pay-method-icon pay-method-icon-paypal">
                    <Wallet size={20} strokeWidth={1.8} />
                  </span>
                  <span className="pay-method-text">
                    <span className="pay-method-title">PayPal</span>
                    <span className="pay-method-sub">
                      {paypalClientId ? 'Paiement rapide et sécurisé' : 'Non configuré'}
                    </span>
                  </span>
                  <ChevronRight size={18} className="pay-method-arrow" />
                </button>
              </div>

              <button
                type="button"
                className="checkout-back-btn"
                onClick={() => setStep('shipping')}
                disabled={isProcessing}
              >
                ← Modifier la livraison
              </button>
            </div>
          )}

          {/* Card payment form */}
          {step === 'card' && (
            <div className="checkout-step">
              <CardPaymentForm
                amount={amount}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                setErrorMsg={setErrorMsg}
                onSuccess={(amt, method) => {
                  onClose();
                  onSuccess(amt, method, customerInfoRef.current);
                }}
                onCancel={() => setStep('payment')}
                customerInfo={customerInfo}
              />
              <button
                type="button"
                className="checkout-back-btn"
                onClick={() => setStep('payment')}
                disabled={isProcessing}
              >
                ← Choisir un autre mode de paiement
              </button>
            </div>
          )}

          {/* PayPal payment */}
          {step === 'paypal' && (
            <div className="checkout-step">
              <div className="checkout-paypal-wrap">
                {!paypalClientId ? (
                  <div className="cart-pay-alert cart-pay-alert-warning">
                    PayPal non configuré — Vérifiez VITE_PAYPAL_CLIENT_ID
                  </div>
                ) : (
                  <>
                    {!paypalReady && (
                      <div className="checkout-paypal-loading">
                        Chargement de PayPal…
                      </div>
                    )}
                    <div ref={paypalButtonRef} className="checkout-paypal-container" />
                  </>
                )}
              </div>
              <button
                type="button"
                className="checkout-back-btn"
                onClick={() => setStep('payment')}
                disabled={isProcessing}
              >
                ← Choisir un autre mode de paiement
              </button>
            </div>
          )}
        </div>

        <div className="checkout-modal-footer">
          <Lock size={12} />
          <span>Paiement 100% sécurisé · Connexion chiffrée</span>
        </div>
      </div>
    </div>
  );
}