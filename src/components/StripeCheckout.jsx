import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { formatPriceEUR } from '../data/products.js';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1410',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#dc2626',
    },
  },
};

function CheckoutForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardComplete) {
      setError('Veuillez compléter les informations de la carte');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // In a real implementation, you would call your backend to create a PaymentIntent
      // and get the client_secret. For now, we'll simulate the flow.
      
      // Simulating backend call - replace with actual API call
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'eur',
        }),
      });

      // For demo purposes, simulate success
      // const { clientSecret } = await response.json();
      
      // const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      //   clientSecret,
      //   {
      //     payment_method: {
      //       card: elements.getElement(CardElement),
      //     },
      //   }
      // );

      // Simulate success for now
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      onSuccess?.({
        id: `pi_${Date.now()}`,
        amount: amount,
        status: 'succeeded',
        method: 'card',
      });
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <div className="stripe-checkout-header">
        <div className="stripe-header-icon">
          <CreditCard size={22} strokeWidth={2} />
        </div>
        <span className="stripe-header-title">Carte bancaire</span>
        <div className="stripe-header-secure">
          <Lock size={14} />
          <span>Sécurisé</span>
        </div>
      </div>

      <div className="stripe-amount-display">
        <span className="stripe-amount-label">Montant à payer</span>
        <span className="stripe-amount-value">{formatPriceEUR(amount)}</span>
      </div>

      <div className="stripe-card-container">
        <label className="stripe-card-label">
          Numéro de carte
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => {
              setError(e.error ? e.error.message : null);
              setCardComplete(e.complete);
            }}
          />
        </label>
      </div>

      {error && (
        <div className="stripe-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <div className="stripe-secure-notice">
        <Lock size={12} />
        <span>Paiement 100% sécurisé • Cryptage SSL 256-bit • Données chiffrées</span>
      </div>

      <div className="stripe-actions">
        <button
          type="button"
          className="stripe-btn stripe-btn-secondary"
          onClick={onCancel}
          disabled={processing}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="stripe-btn stripe-btn-primary"
          disabled={!stripe || processing || !cardComplete}
        >
          {processing ? (
            <>
              <span className="stripe-spinner"></span>
              Traitement...
            </>
          ) : (
            `Payer ${formatPriceEUR(amount)}`
          )}
        </button>
      </div>
    </form>
  );
}

export default function StripeCheckout({ amount, onSuccess, onCancel }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if Stripe key is configured
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      console.warn('Stripe publishable key not configured');
      return;
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="stripe-checkout-not-configured">
        <AlertCircle size={24} />
        <p>Le paiement Stripe n'est pas configuré.</p>
        <p className="stripe-config-help">
          Veuillez configurer VITE_STRIPE_PUBLISHABLE_KEY dans vos variables d'environnement.
        </p>
      </div>
    );
  }

  return (
    <div className="stripe-checkout-wrapper">
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>
    </div>
  );
}
