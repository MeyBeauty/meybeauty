import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import Stripe from 'stripe';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple backend plugin for local development
const stripeBackendPlugin = (env) => ({
  name: 'stripe-backend',
  configureServer(server) {
    server.middlewares.use('/api/stripe-payment', async (req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        });
        res.end();
        return;
      }

      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
          });
        });

        const secretKey = env.VITE_STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
        if (!secretKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Stripe secret key not configured' }));
          return;
        }
        
        const stripe = new Stripe(secretKey, {
          apiVersion: '2024-06-20'
        });

        const { amount, currency, paymentMethodId, description } = body;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount),
          currency: currency || 'eur',
          payment_method: paymentMethodId,
          confirmation_method: 'manual',
          confirm: true,
          return_url: 'http://localhost:5173/cart',
          description: description || 'Commande Mey Beauty',
          metadata: {
            order_id: `MEY-${Date.now()}`,
            store: 'Mey Beauty'
          }
        });

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });

        if (paymentIntent.status === 'requires_action') {
          res.end(JSON.stringify({
            success: false,
            requiresAction: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
          }));
        } else if (paymentIntent.status === 'succeeded') {
          res.end(JSON.stringify({
            success: true,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
          }));
        } else {
          res.end(JSON.stringify({
            success: false,
            status: paymentIntent.status
          }));
        }

      } catch (error) {
        console.error('[STRIPE BACKEND ERROR]', error);
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          error: 'stripe_error',
          message: error.message || 'Payment failed'
        }));
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  
  return {
    plugins: [react(), stripeBackendPlugin(env)],
    server: {
      port: 5173
    }
  };
});
