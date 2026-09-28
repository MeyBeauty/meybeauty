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

// Helper: read JSON body from request
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
  });
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
}

// Sendcloud API plugin for local development
const sendcloudPlugin = (env) => ({
  name: 'sendcloud-api',
  configureServer(server) {
    const SC_BASE = 'https://panel.sendcloud.sc';

    // GET delivery options
    server.middlewares.use('/api/sendcloud-delivery-options', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

      try {
        const body = await readBody(req);
        const publicKey = env.SENDCLOUD_PUBLIC_KEY;
        const secretKey = env.SENDCLOUD_SECRET_KEY;
        const configId = env.SENDCLOUD_CONFIG_ID;

        if (!publicKey || !secretKey) return sendJson(res, 503, { error: 'Sendcloud non configuré' });
        if (!configId) return sendJson(res, 503, { error: 'Config ID manquant' });

        const params = new URLSearchParams({
          weight_value: String(body.weightGrams || 500),
          total_order_value: String(body.totalOrderValue || '0'),
          from_country_code: 'FR',
          to_country_code: body.toCountryCode || 'FR',
          checkout_identifier_type: 'shipping_option_code',
        });
        if (body.toPostalCode) params.append('to_postal_code', body.toPostalCode);

        const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        const url = `${SC_BASE}/api/v3/checkout/configurations/${configId}/delivery-options?${params}`;

        const resp = await fetch(url, {
          headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
        });
        const data = await resp.json();

        if (!resp.ok) {
          console.error('[Sendcloud] delivery-options error:', resp.status, data);
          return sendJson(res, resp.status, { error: data.detail || data.message || 'Erreur Sendcloud' });
        }

        const options = (data.delivery_options || []).map((opt) => ({
          id: opt.id,
          shippingOptionCode: opt.checkout_identifier?.value || null,
          carrier: opt.carrier?.name || '',
          carrierCode: opt.carrier?.code || '',
          name: opt.title || opt.internal_title || opt.carrier?.name || '',
          price: opt.shipping_rate?.value ?? null,
          currency: opt.shipping_rate?.currency || 'EUR',
          leadTimeHours: opt.lead_time_hours?.p50 || null,
          logoUrl: opt.carrier?.logo_url || null,
        })).filter((o) => o.shippingOptionCode);

        return sendJson(res, 200, { options, configurationId: data.configuration_id || configId });
      } catch (err) {
        console.error('[Sendcloud] delivery-options exception:', err);
        return sendJson(res, 500, { error: err.message });
      }
    });

    // POST create shipment
    server.middlewares.use('/api/sendcloud-create-shipment', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

      try {
        const body = await readBody(req);
        const publicKey = env.SENDCLOUD_PUBLIC_KEY;
        const secretKey = env.SENDCLOUD_SECRET_KEY;

        if (!publicKey || !secretKey) return sendJson(res, 503, { error: 'Sendcloud non configuré' });

        const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        const payload = {
          to_address: {
            name: `${body.recipient?.firstName || ''} ${body.recipient?.lastName || ''}`.trim(),
            address_line_1: body.recipient?.address || '',
            postal_code: body.recipient?.postalCode || '',
            city: body.recipient?.city || '',
            country_code: body.recipient?.countryCode || 'FR',
            phone_number: body.recipient?.phone || '',
            email: body.recipient?.email || '',
          },
          from_address: {
            name: env.SENDCLOUD_SENDER_NAME || 'Mey Beauty',
            company_name: 'Mey Beauty',
            address_line_1: env.SENDCLOUD_SENDER_ADDRESS || '',
            postal_code: env.SENDCLOUD_SENDER_POSTAL_CODE || '',
            city: env.SENDCLOUD_SENDER_CITY || '',
            country_code: env.SENDCLOUD_SENDER_COUNTRY_CODE || 'FR',
            phone_number: env.SENDCLOUD_SENDER_PHONE || '',
            email: env.SENDCLOUD_SENDER_EMAIL || '',
          },
          ship_with: {
            type: 'shipping_option_code',
            properties: {
              shipping_option_code: body.testMode ? 'sendcloud:letter' : body.shippingOptionCode,
            },
          },
          parcels: [{
            weight: { value: String(body.parcel?.weightKg || '1'), unit: 'kg' },
            length: body.parcel?.lengthCm || 20,
            width: body.parcel?.widthCm || 15,
            height: body.parcel?.heightCm || 10,
          }],
        };

        const resp = await fetch(`${SC_BASE}/api/v3/shipments/announce`, {
          method: 'POST',
          headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await resp.json();

        if (!resp.ok) {
          console.error('[Sendcloud] create-shipment error:', resp.status, JSON.stringify(data, null, 2));
          return sendJson(res, resp.status, { 
            error: data.detail || data.message || 'Erreur Sendcloud',
            details: data.errors || data,
            status: resp.status
          });
        }

        console.log('[Sendcloud] create-shipment success:', JSON.stringify(data, null, 2));
        const shipment = data.shipment || data;
        const firstParcel = (shipment.parcels || [])[0] || {};
        let labelUrl = data.label_file || firstParcel.label_file_url || null;

        if (!labelUrl && firstParcel.id) {
          try {
            const labelResp = await fetch(`${SC_BASE}/api/v3/parcels/${firstParcel.id}/documents/label`, {
              headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
            });
            if (labelResp.ok) {
              const labelData = await labelResp.json();
              labelUrl = labelData.label_url || labelData.url || null;
            }
          } catch (e) { console.error('[Sendcloud] label fetch failed:', e.message); }
        }

        return sendJson(res, 200, {
          shipmentId: shipment.id || data.id,
          parcelId: firstParcel.id,
          labelUrl,
          trackingNumber: firstParcel.tracking_number || null,
          trackingUrl: firstParcel.tracking_url || null,
          status: shipment.status || data.status || 'created',
          testMode: !!body.testMode,
        });
      } catch (err) {
        console.error('[Sendcloud] create-shipment exception:', err);
        return sendJson(res, 500, { error: err.message });
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  
  return {
    base: './',
    plugins: [react(), stripeBackendPlugin(env), sendcloudPlugin(env)],
    server: {
      port: 5173
    },
    build: {
      // Optimisations pour la performance
      target: 'es2020',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // Code splitting manuel pour réduire le bundle initial
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-helmet-async'],
            'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
            'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage']
          }
        }
      },
      // Compression des assets
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000,
      // Préchargement des modules critiques
      modulePreload: {
        polyfill: true
      }
    },
    // Optimisations pour le développement
    optimizeDeps: {
      include: ['react', 'react-dom', 'firebase/app', 'firebase/firestore'],
      exclude: ['firebase-admin']
    }
  };
});
