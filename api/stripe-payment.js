import Stripe from 'stripe';
import { z } from 'zod';

const createPaymentIntentSchema = z.object({
  amount: z.number().int().positive().max(99999999, 'Montant trop élevé'),
  currency: z.string().length(3).default('eur'),
  paymentMethodId: z.string().min(1, 'PaymentMethod ID requis'),
  description: z.string().max(500).optional(),
  customerEmail: z.string().email().optional(),
  metadata: z.record(z.string()).optional(),
});

const getReturnUrl = () => {
  const siteUrl = process.env.PUBLIC_SITE_URL || process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
  return `${siteUrl.replace(/\/$/, '')}/cart`;
};

const getUserFriendlyError = (stripeError) => ({
  card_declined: 'Votre carte a été refusée. Veuillez essayer une autre carte.',
  insufficient_funds: 'Fonds insuffisants sur cette carte.',
  expired_card: 'Votre carte a expiré.',
  incorrect_cvc: 'Le code de sécurité est incorrect.',
  processing_error: 'Erreur lors du traitement. Veuillez réessayer.',
  incorrect_number: 'Le numéro de carte est incorrect.',
}[stripeError.code] || 'Erreur de paiement. Veuillez réessayer.');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(503).json({ error: 'stripe_not_configured', message: 'Stripe non configuré' });

  try {
    const validated = createPaymentIntentSchema.parse(req.body || {});
    const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: validated.amount,
      currency: validated.currency,
      payment_method: validated.paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: getReturnUrl(),
      description: validated.description || 'Commande Mey Beauty',
      receipt_email: validated.customerEmail,
      metadata: {
        store: 'Mey Beauty',
        ...validated.metadata,
      },
    });

    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      return res.status(200).json({
        success: false,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    if (paymentIntent.status === 'succeeded') {
      return res.status(200).json({
        success: true,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      });
    }

    if (paymentIntent.status === 'requires_payment_method') {
      return res.status(400).json({ error: 'payment_failed', message: 'Le paiement a échoué. Veuillez vérifier vos informations.' });
    }

    return res.status(200).json({
      success: false,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'validation_error', message: 'Données invalides' });
    }

    if (error.type?.startsWith('Stripe')) {
      return res.status(400).json({
        error: 'stripe_error',
        code: error.code || 'unknown',
        message: getUserFriendlyError(error),
        declineCode: error.decline_code || null,
      });
    }

    console.error('[Stripe Vercel] Error:', error);
    return res.status(500).json({ error: 'server_error', message: 'Une erreur est survenue. Veuillez réessayer.' });
  }
}
