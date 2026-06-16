/**
 * Stripe Payment Intent API
 * Production-ready backend for Stripe payments
 */

import Stripe from 'stripe';
import { z } from 'zod';

// ============================================================================
// CONFIGURATION
// ============================================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('[STRIPE] Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: false
});

// ============================================================================
// VALIDATION SCHEMAS (ZOD)
// ============================================================================

const createPaymentIntentSchema = z.object({
  amount: z.number().int().positive().max(99999999, 'Montant trop élevé'),
  currency: z.string().length(3).default('eur'),
  paymentMethodId: z.string().min(1, 'PaymentMethod ID requis'),
  description: z.string().max(500).optional(),
  customerEmail: z.string().email().optional(),
  metadata: z.record(z.string()).optional()
});

// ============================================================================
// CORS HEADERS
// ============================================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// ============================================================================
// ERROR HANDLER
// ============================================================================

function handleError(error, context = '') {
  const timestamp = new Date().toISOString();
  
  // Stripe errors
  if (error.type && error.type.startsWith('Stripe')) {
    console.error(`[STRIPE ERROR ${timestamp}] ${context}:`, {
      type: error.type,
      code: error.code,
      message: error.message,
      decline_code: error.decline_code
    });
    
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'stripe_error',
        code: error.code || 'unknown',
        message: getUserFriendlyError(error),
        declineCode: error.decline_code || null
      })
    };
  }
  
  // Validation errors
  if (error instanceof z.ZodError) {
    console.error(`[VALIDATION ERROR ${timestamp}]:`, error.errors);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'validation_error',
        message: 'Données invalides',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      })
    };
  }
  
  // Generic errors
  console.error(`[SERVER ERROR ${timestamp}] ${context}:`, error);
  return {
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify({
      error: 'server_error',
      message: 'Une erreur est survenue. Veuillez réessayer.'
    })
  };
}

function getUserFriendlyError(stripeError) {
  const errorMap = {
    'card_declined': 'Votre carte a été refusée. Veuillez essayer une autre carte.',
    'insufficient_funds': 'Fonds insuffisants sur cette carte.',
    'expired_card': 'Votre carte a expiré.',
    'incorrect_cvc': 'Le code de sécurité est incorrect.',
    'processing_error': 'Erreur lors du traitement. Veuillez réessayer.',
    'incorrect_number': 'Le numéro de carte est incorrect.'
  };
  
  return errorMap[stripeError.code] || 'Erreur de paiement. Veuillez réessayer.';
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export const handler = async (event) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`[${requestId}] ${event.httpMethod} /api/create-payment-intent`);
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }
  
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    // Parse and validate body
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }
    
    const validated = createPaymentIntentSchema.parse(body);
    
    console.log(`[${requestId}] Creating PaymentIntent:`, {
      amount: validated.amount,
      currency: validated.currency,
      paymentMethodId: validated.paymentMethodId.substring(0, 10) + '...'
    });
    
    // Create PaymentIntent
    const returnUrl = process.env.URL ? `${process.env.URL}/cart` : 'http://localhost:5173/cart';
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: validated.amount,
      currency: validated.currency,
      payment_method: validated.paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: returnUrl,
      description: validated.description || 'Commande Mey Beauty',
      receipt_email: validated.customerEmail,
      metadata: {
        order_id: `MEY-${Date.now()}`,
        store: 'Mey Beauty',
        request_id: requestId,
        ...validated.metadata
      }
    });
    
    console.log(`[${requestId}] PaymentIntent created:`, {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount
    });
    
    // Handle different statuses
    switch (paymentIntent.status) {
      case 'requires_action':
      case 'requires_source_action':
        console.log(`[${requestId}] 3D Secure required`);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            requiresAction: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
          })
        };
        
      case 'succeeded':
        console.log(`[${requestId}] Payment succeeded`);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status
          })
        };
        
      case 'requires_payment_method':
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: 'payment_failed',
            message: 'Le paiement a échoué. Veuillez vérifier vos informations.'
          })
        };
        
      default:
        console.log(`[${requestId}] Unexpected status: ${paymentIntent.status}`);
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            status: paymentIntent.status,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
          })
        };
    }
    
  } catch (error) {
    return handleError(error, requestId);
  }
};
