/**
 * Stripe Card Payment Form Component
 * Production-ready integration using official @stripe/react-stripe-js
 */

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';
import { formatPriceEUR } from '../data/products.js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#523A28',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': { color: '#8B7355' },
      backgroundColor: 'transparent'
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626'
    }
  }
};

export function CardPaymentForm({ amount, isProcessing, setIsProcessing, setErrorMsg, onSuccess, onCancel, customerInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setErrorMsg('Stripe non initialisé');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const cardElement = elements.getElement(CardElement);
      
      // Create PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo?.firstName && customerInfo?.lastName
            ? `${customerInfo.firstName} ${customerInfo.lastName}`
            : 'Client Mey Beauty',
          email: customerInfo?.email || '',
          phone: customerInfo?.phone || ''
        }
      });

      if (error) {
        setErrorMsg(error.message);
        setIsProcessing(false);
        return;
      }

      console.log('[STRIPE] PaymentMethod created:', paymentMethod.id);

      // Call backend to create PaymentIntent
      const response = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: 'eur',
          paymentMethodId: paymentMethod.id,
          description: 'Commande Mey Beauty'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.message || 'Erreur de paiement');
        setIsProcessing(false);
        return;
      }

      // Handle 3D Secure if needed
      if (result.requiresAction && result.clientSecret) {
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret);

        if (confirmError) {
          setErrorMsg(confirmError.message);
          setIsProcessing(false);
          return;
        }

        if (paymentIntent.status === 'succeeded') {
          console.log('[STRIPE] Payment succeeded:', paymentIntent.id);
          onSuccess(amount, 'stripe', customerInfo);
        } else {
          setErrorMsg('Statut: ' + paymentIntent.status);
          setIsProcessing(false);
        }
      } else if (result.success) {
        console.log('[STRIPE] Payment succeeded:', result.paymentIntentId);
        onSuccess(amount, 'stripe', customerInfo);
      } else {
        setErrorMsg('Réponse inattendue');
        setIsProcessing(false);
      }

    } catch (err) {
      console.error('[STRIPE] Error:', err);
      setErrorMsg(err.message || 'Erreur de paiement');
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-stripe-container">
      <div className="cart-stripe-header">
        <Lock size={14} />
        <span>Paiement sécurisé par carte</span>
        <button 
          type="button" 
          className="cart-form-close"
          onClick={onCancel}
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="cart-card-element">
          <CardElement 
            options={CARD_ELEMENT_OPTIONS}
            onReady={() => setIsReady(true)}
          />
        </div>
        
        {!isReady && (
          <div style={{ fontSize: '13px', color: '#8B7355', marginBottom: '12px' }}>
            Chargement du formulaire...
          </div>
        )}
        
        <button
          type="submit"
          className="cart-pay-btn stripe"
          disabled={isProcessing || !isReady || !stripe}
          style={{ marginBottom: 0 }}
        >
          <span className="cart-pay-icon"><Lock size={16} /></span>
          <span className="cart-pay-label">
            {isProcessing ? 'Traitement...' : `Payer ${formatPriceEUR(amount)}`}
          </span>
        </button>
      </form>
    </div>
  );
}
