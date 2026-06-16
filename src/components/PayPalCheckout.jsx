import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { AlertCircle } from 'lucide-react';
import { formatPriceEUR } from '../data/products.js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function PayPalCheckout({ amount, onSuccess, onCancel, onError }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) {
      console.warn('PayPal client ID not configured');
      return;
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="paypal-checkout-not-configured">
        <AlertCircle size={24} />
        <p>Le paiement PayPal n'est pas configuré.</p>
        <p className="paypal-config-help">
          Veuillez configurer VITE_PAYPAL_CLIENT_ID dans vos variables d'environnement.
        </p>
      </div>
    );
  }

  const amountInEuros = (amount / 100).toFixed(2);

  return (
    <div className="paypal-checkout-wrapper">
      <div className="paypal-checkout-header">
        <div className="paypal-header-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
          </svg>
        </div>
        <span className="paypal-header-title">PayPal</span>
        <div className="paypal-header-badge">Rapide & Sécurisé</div>
      </div>

      <div className="paypal-amount-display">
        <span className="paypal-amount-label">Montant à payer</span>
        <span className="paypal-amount-value">{formatPriceEUR(amount)}</span>
      </div>

      <PayPalScriptProvider
        options={{
          'client-id': PAYPAL_CLIENT_ID,
          currency: 'EUR',
          intent: 'capture',
        }}
      >
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          }}
          createOrder={(_, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amountInEuros,
                    currency_code: 'EUR',
                  },
                  description: 'Commande Mey Beauty',
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              const details = await actions.order.capture();
              onSuccess?.({
                id: details.id,
                status: details.status,
                amount: amount,
                method: 'paypal',
                payer: details.payer,
              });
            } catch (err) {
              setError('Erreur lors de la capture du paiement PayPal');
              onError?.(err);
            }
          }}
          onError={(err) => {
            setError('Erreur lors du paiement PayPal');
            onError?.(err);
          }}
          onCancel={() => {
            onCancel?.();
          }}
        />
      </PayPalScriptProvider>

      {error && (
        <div className="paypal-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        className="paypal-cancel-btn"
        onClick={onCancel}
      >
        Choisir un autre mode de paiement
      </button>
    </div>
  );
}
