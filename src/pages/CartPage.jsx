import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { CreditCard, ShieldCheck, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { getProductById, formatPriceEUR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardPaymentForm } from '../components/StripeCardForm.jsx';
import { createOrder } from '../firebase/collections.js';
import SEO from '../components/SEO.jsx';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const { items, removeItem, setQuantity, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Build cart lines with correct pricing
  const lines = useMemo(() => {
    return items
      .map((it) => {
        const product = getProductById(it.productId);
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
        };
      })
      .filter(Boolean);
  }, [items]);

  const subtotalCents = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotalCents, 0),
    [lines]
  );

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
    const finalAmount = amount || subtotalCents;
    setPaidAmount(finalAmount);
    
    // Create order in Firebase
    try {
      const orderData = {
        customer: {
          firstName: customerInfo.firstName || '',
          lastName: customerInfo.lastName || '',
          email: customerInfo.email || '',
          phone: customerInfo.phone || '',
        },
        items: lines.map(line => ({
          productId: line.product.id,
          name: line.product.name,
          quantity: line.quantity,
          priceCents: line.priceCents,
          totalCents: line.lineTotalCents,
        })),
        totalAmountCents: finalAmount,
        paymentMethod: paymentMethod || 'unknown',
        status: 'paid',
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
  }, [clearCart, subtotalCents, lines]);

  return (
    <>
      <SEO
        title="Panier — Commande"
        description="Finalisez votre commande de produits cosmétiques LPG. Paiement sécurisé par carte ou PayPal. Livraison rapide."
        keywords="panier, commande cosmétiques, paiement sécurisé, achat LPG"
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
                <h2>Ton panier est vide</h2>
                <p>
                  Ajoute des produits depuis la boutique.
                  <br />
                  <a href="#shop">Aller à la boutique</a>
                </p>
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
          <div className="cart-summary-box">
            <div className="cart-summary-title">Récapitulatif</div>
            <div className="cart-summary-line">
              <span>Sous‑total</span>
              <span>{formatPriceEUR(subtotalCents)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Livraison</span>
              <span>Selon options</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span>{formatPriceEUR(subtotalCents)}</span>
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
              <div className="cart-customer-form">
                <h4>Informations client</h4>
                <div className="cart-form-row">
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    className="cart-form-input"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    className="cart-form-input"
                  />
                </div>
                <div className="cart-form-row">
                  <input
                    type="email"
                    placeholder="Email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="cart-form-input"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="cart-form-input"
                  />
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentSection
                  amount={subtotalCents}
                  totalSavings={totalSavings}
                  onSuccess={handlePaymentSuccess}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  customerInfo={customerInfo}
                />
              </Elements>
              </>
            )}
          </div>
        </aside>
      </section>
    </main>
    </>
  );
}

// Payment Section Component with Stripe + PayPal
function PaymentSection({ amount, totalSavings, onSuccess, isProcessing, setIsProcessing, customerInfo }) {
  const amountEuros = (amount / 100).toFixed(2);
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const [showStripeForm, setShowStripeForm] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const paypalButtonRef = useRef(null);
  const paypalButtonsRef = useRef(null);
  const renderTimeoutRef = useRef(null);
  const customerInfoRef = useRef(customerInfo);

  // Keep customerInfoRef always up to date
  useEffect(() => {
    customerInfoRef.current = customerInfo;
  }, [customerInfo]);

  // Check if customer form is valid
  const isCustomerFormValid = () => {
    const info = customerInfoRef.current;
    return info && info.firstName?.trim() && info.lastName?.trim() && info.email?.trim() && info.phone?.trim();
  };

  // Load PayPal SDK and render button
  const loadPayPal = () => {
    console.log('[PayPal] loadPayPal called, clientId:', paypalClientId ? 'present' : 'missing');
    
    if (!paypalClientId) {
      setErrorMsg('Client ID PayPal manquant - Vérifiez VITE_PAYPAL_CLIENT_ID dans .env.local');
      console.error('[PayPal] Missing client ID');
      return;
    }
    
    if (window.paypal) {
      console.log('[PayPal] SDK already loaded, scheduling render');
      scheduleRender();
      return;
    }
    
    console.log('[PayPal] Loading SDK...');
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR&intent=capture&locale=fr_FR`;
    script.async = true;
    script.onload = () => {
      console.log('[PayPal] SDK loaded successfully');
      scheduleRender();
    };
    script.onerror = (e) => {
      console.error('[PayPal] Failed to load SDK:', e);
      setErrorMsg('Erreur chargement PayPal - vérifiez votre connexion');
    };
    document.body.appendChild(script);
  };

  // Schedule render with delay to handle React Strict Mode
  const scheduleRender = () => {
    // Clear any pending render
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    // Delay render to let React Strict Mode settle
    renderTimeoutRef.current = setTimeout(() => {
      renderPayPal();
    }, 100);
  };

  // Render PayPal Smart Buttons
  const renderPayPal = () => {
    console.log('[PayPal] renderPayPal called, paypal available:', !!window.paypal, 'ref available:', !!paypalButtonRef.current, 'buttons exist:', !!paypalButtonsRef.current);
    
    if (!window.paypal) {
      console.error('[PayPal] window.paypal not available');
      setErrorMsg('SDK PayPal non disponible');
      return;
    }
    
    if (!paypalButtonRef.current) {
      console.error('[PayPal] Button container ref not available');
      return;
    }
    
    // If buttons already exist, close them first (for re-renders)
    if (paypalButtonsRef.current) {
      try {
        paypalButtonsRef.current.close();
        console.log('[PayPal] Closed existing buttons');
      } catch (e) {
        // Ignore close errors
      }
      paypalButtonsRef.current = null;
    }
    
    // Clear container
    paypalButtonRef.current.innerHTML = '';
    
    try {
      console.log('[PayPal] Creating buttons with amount:', amountEuros);
      
      const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 45
        },
        onClick: (data, actions) => {
          // Validate before opening PayPal popup
          if (!isCustomerFormValid()) {
            setErrorMsg('Veuillez remplir vos informations client (prénom, nom, email, téléphone) avant de payer avec PayPal.');
            return actions.reject();
          }
          return actions.resolve();
        },
        createOrder: (data, actions) => {
          console.log('[PayPal] createOrder called');
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
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          }).then((orderId) => {
            console.log('[PayPal] Order created:', orderId);
            return orderId;
          });
        },
        onApprove: async (data, actions) => {
          console.log('[PayPal] onApprove called, orderID:', data.orderID);
          // Check if customer form is filled
          if (!isCustomerFormValid()) {
            setErrorMsg('Veuillez remplir vos informations client (prénom, nom, email, téléphone) avant de payer.');
            return;
          }
          setIsProcessing(true);
          try {
            const details = await actions.order.capture();
            console.log('[PayPal] Payment captured:', details);
            if (details.status === 'COMPLETED') {
              // Use the ref to get current customerInfo
              onSuccess(amount, 'paypal', customerInfoRef.current);
            } else {
              setErrorMsg('Statut PayPal: ' + details.status);
              setIsProcessing(false);
            }
          } catch (err) {
            console.error('[PayPal] Capture error:', err);
            setErrorMsg('Erreur capture PayPal: ' + (err.message || 'Erreur inconnue'));
            setIsProcessing(false);
          }
        },
        onError: (err) => {
          console.error('[PayPal] onError:', err);
          setErrorMsg('Erreur PayPal: ' + (err.message || 'Erreur inconnue'));
          setIsProcessing(false);
        },
        onCancel: () => {
          console.log('[PayPal] Payment cancelled by user');
          setIsProcessing(false);
        }
      });
      
      paypalButtonsRef.current = buttons;
      
      buttons.render(paypalButtonRef.current).then(() => {
        console.log('[PayPal] Buttons rendered successfully');
        setPaypalReady(true);
      }).catch((err) => {
        console.error('[PayPal] Render error:', err);
        setErrorMsg('Erreur affichage bouton PayPal: ' + err.message);
        paypalButtonsRef.current = null;
      });
      
    } catch (err) {
      console.error('[PayPal] Exception:', err);
      setErrorMsg('Erreur rendu PayPal: ' + err.message);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
      if (paypalButtonsRef.current) {
        try {
          paypalButtonsRef.current.close();
          console.log('[PayPal] Cleaned up buttons on unmount');
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);
  
  // Auto-load PayPal on mount if client ID is available
  useEffect(() => {
    if (paypalClientId && amount > 0) {
      console.log('[PayPal] Auto-loading SDK on mount');
      loadPayPal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paypalClientId]);

  return (
    <div className="cart-pay">
      <div className="cart-pay-title">
        <ShieldCheck size={14} strokeWidth={2} />
        Paiement sécurisé
      </div>

      {totalSavings > 0 && (
        <div className="cart-savings-banner">
          <span className="cart-savings-icon">🎉</span>
          <span>Vous économisez {formatPriceEUR(totalSavings)}</span>
        </div>
      )}

      {errorMsg && (
        <div className="cart-pay-error" style={{ 
          padding: '10px 12px', 
          background: '#fef2f2', 
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          fontSize: '12px',
          marginBottom: '10px'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Form validation warning */}
      {!isCustomerFormValid() && (
        <div className="cart-pay-error" style={{
          padding: '10px 12px',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '6px',
          color: '#92400e',
          fontSize: '12px',
          marginBottom: '10px'
        }}>
          ⚠️ Veuillez remplir vos informations client (prénom, nom, email, téléphone) pour accéder au paiement.
        </div>
      )}

      {/* CARTE BANCAIRE */}
      <div className="cart-payment-section">
        {!showStripeForm ? (
          <button
            type="button"
            className="cart-pay-btn stripe"
            onClick={() => {
              if (!isCustomerFormValid()) {
                setErrorMsg('Veuillez remplir vos informations client avant de payer.');
                return;
              }
              setShowStripeForm(true);
            }}
            disabled={isProcessing || amount === 0}
          >
            <span className="cart-pay-icon"><CreditCard size={18} strokeWidth={2} /></span>
            <span className="cart-pay-label">Carte bancaire</span>
          </button>
        ) : (
          <CardPaymentForm
            amount={amount}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            setErrorMsg={setErrorMsg}
            onSuccess={(amt, method) => onSuccess(amt, method, customerInfoRef.current)}
            onCancel={() => { setShowStripeForm(false); setErrorMsg(''); }}
            customerInfo={customerInfo}
          />
        )}
      </div>

      {/* PAYPAL PAYMENT */}
      <div className="cart-payment-section" style={{ marginTop: '10px' }}>
        {!paypalClientId ? (
          <div className="cart-pay-error" style={{ padding: '12px', fontSize: '12px' }}>
            PayPal non configuré - Vérifiez VITE_PAYPAL_CLIENT_ID
          </div>
        ) : (
          <>
            {!paypalReady && (
              <div style={{ 
                padding: '12px', 
                textAlign: 'center', 
                color: '#666',
                fontSize: '12px',
                background: '#f5f5f5',
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                Chargement de PayPal...
              </div>
            )}
            <div 
              ref={paypalButtonRef} 
              style={{ minHeight: paypalReady ? 'auto' : '0px' }}
            />
          </>
        )}
      </div>

      <div className="cart-pay-security">
        <ShieldCheck size={12} />
        <span>Paiement 100% sécurisé • SSL Chiffré</span>
      </div>
    </div>
  );
}
