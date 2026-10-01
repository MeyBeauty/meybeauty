import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import Stripe from 'stripe';
import { sendOrderEmail } from './server/send-order-email.js';
import { fetchSendcloudShipment } from './server/sendcloud-shipment.js';
import { verifyAdminRequest } from './server/admin-auth.js';
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
}

const supportsServicePoint = (shippingOptionCode) => {
  const code = String(shippingOptionCode || '').toLowerCase();
  const optionCode = code.includes(':') ? code.split(':').slice(1).join(':') : code;
  return optionCode.includes('service_point')
    || optionCode.includes('post-office')
    || optionCode.includes('locker_delivery')
    || optionCode.includes('relay');
};

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
          deliveryMethod: opt.delivery_method_type || '',
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

    // GET / POST service points
    server.middlewares.use('/api/sendcloud-service-points', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      try {
        const body = req.method === 'POST' ? await readBody(req) : {};
        const urlObj = new URL(req.url, 'http://localhost:5173');
        const postalCode = urlObj.searchParams.get('postalCode') || body.postalCode || '91170';
        const country = urlObj.searchParams.get('country') || body.country || 'FR';
        const carrier = urlObj.searchParams.get('carrier') || body.carrier || '';
        const radius = urlObj.searchParams.get('radius') || body.radius || '10000';

        const publicKey = env.SENDCLOUD_PUBLIC_KEY;
        const secretKey = env.SENDCLOUD_SECRET_KEY;
        if (!publicKey || !secretKey) return sendJson(res, 503, { error: 'Sendcloud non configuré' });

        const params = new URLSearchParams({
          country,
          address: postalCode,
          radius: String(radius),
        });
        if (carrier) params.append('carrier', carrier);

        const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        const scUrl = `https://servicepoints.sendcloud.sc/api/v2/service-points?${params}`;

        const resp = await fetch(scUrl, {
          method: 'GET',
          headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
        });
        const data = await resp.json();

        if (!resp.ok) {
          console.error('[Sendcloud] service-points error:', resp.status, data);
          return sendJson(res, resp.status, { error: data.detail || 'Erreur récupération points relais' });
        }

        const points = (Array.isArray(data) ? data : []).map((pt) => ({
          id: pt.id,
          code: pt.code,
          name: pt.name,
          street: pt.street,
          houseNumber: pt.house_number || '',
          address: `${pt.house_number ? pt.house_number + ' ' : ''}${pt.street}`.trim(),
          postalCode: pt.postal_code,
          city: pt.city,
          distanceMeters: pt.distance || null,
          carrier: pt.carrier,
          carrierName: pt.carrier_name || pt.carrier,
          carrierLogoUrl: pt.carrier_logo_url || null,
          shopType: pt.general_shop_type || pt.shop_type || 'servicepoint',
          isLocker: pt.general_shop_type === 'locker' || pt.shop_type === 'C',
          openingTimes: pt.formatted_opening_times || null,
        }));

        return sendJson(res, 200, { points });
      } catch (err) {
        console.error('[Sendcloud] service-points exception:', err);
        return sendJson(res, 500, { error: err.message });
      }
    });

    // POST create shipment
    server.middlewares.use('/api/sendcloud-create-shipment', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

      const admin = await verifyAdminRequest(req.headers, env);
      if (!admin.ok) return sendJson(res, admin.status, { error: admin.error });

      try {
        const body = await readBody(req);
        const publicKey = env.SENDCLOUD_PUBLIC_KEY;
        const secretKey = env.SENDCLOUD_SECRET_KEY;

        if (!publicKey || !secretKey) return sendJson(res, 503, { error: 'Sendcloud non configuré' });
        if (!body.shippingOptionCode || !body.recipient || !body.parcel) {
          return sendJson(res, 400, { error: 'Paramètres manquants: shippingOptionCode, recipient, parcel requis' });
        }
        if (!body.testMode && body.servicePointId && !supportsServicePoint(body.shippingOptionCode)) {
          return sendJson(res, 400, { error: 'Cette méthode Sendcloud ne supporte pas les points relais' });
        }

        const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        const payload = {
          label_details: {
            mime_type: 'application/pdf',
            dpi: 72,
          },
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

        if (!body.testMode && body.servicePointId) {
          payload.to_service_point = { id: Number(body.servicePointId) };
        }

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
        const shipment = data.data || data.shipment || data;
        const firstParcel = (shipment.parcels || [])[0] || {};
        const labelBase64 = firstParcel.label_file || shipment.label_file || data.label_file || null;
        const labelUrl = firstParcel.id
          ? `/api/sendcloud-label?parcelId=${firstParcel.id}`
          : labelBase64
            ? `data:application/pdf;base64,${labelBase64}`
            : null;

        return sendJson(res, 200, {
          shipmentId: shipment.id || data.id,
          parcelId: firstParcel.id,
          labelUrl,
          trackingNumber: firstParcel.tracking_number || firstParcel.tracking_code || shipment.tracking_number || data.tracking_number || null,
          trackingUrl: firstParcel.tracking_url || firstParcel.tracking_link || shipment.tracking_url || data.tracking_url || null,
          status: shipment.status || data.status || 'created',
          testMode: !!body.testMode,
        });
      } catch (err) {
        console.error('[Sendcloud] create-shipment exception:', err);
        return sendJson(res, 500, { error: err.message });
      }
    });

    // GET parcel label PDF
    server.middlewares.use('/api/sendcloud-label', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });

      try {
        const publicKey = env.SENDCLOUD_PUBLIC_KEY;
        const secretKey = env.SENDCLOUD_SECRET_KEY;
        const url = new URL(req.url, 'http://localhost');
        const parcelId = url.searchParams.get('parcelId');
        const paperSize = url.searchParams.get('paperSize') || 'A4';
        const download = url.searchParams.get('download') === '1';

        if (!publicKey || !secretKey) return sendJson(res, 503, { error: 'Sendcloud non configuré' });
        if (!parcelId) return sendJson(res, 400, { error: 'parcelId requis' });

        const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        const response = await fetch(`${SC_BASE}/api/v3/parcels/${parcelId}/documents/label?paper_size=${encodeURIComponent(paperSize)}`, {
          headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/pdf' },
        });

        if (!response.ok) {
          const text = await response.text();
          let data = null;
          try { data = JSON.parse(text); } catch {}
          const detail = data?.errors?.[0]?.detail || data?.detail || text || 'Étiquette Sendcloud introuvable';
          return sendJson(res, response.status, { error: detail, raw: data });
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        res.writeHead(200, {
          'Content-Type': response.headers.get('content-type') || 'application/pdf',
          'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="sendcloud-label-${parcelId}.pdf"`,
          'Cache-Control': 'private, max-age=60',
        });
        res.end(buffer);
      } catch (err) {
        console.error('[Sendcloud] label proxy error:', err);
        return sendJson(res, 500, { error: err.message || 'Erreur récupération étiquette' });
      }
    });

    // POST refresh shipment status/tracking
    server.middlewares.use('/api/sendcloud-refresh-shipment', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

      const admin = await verifyAdminRequest(req.headers, env);
      if (!admin.ok) return sendJson(res, admin.status, { error: admin.error });

      try {
        const body = await readBody(req);
        const result = await fetchSendcloudShipment({ shipmentId: body.shipmentId, env });
        return sendJson(res, result.status, result.body);
      } catch (err) {
        return sendJson(res, 500, { error: err.message || 'Erreur récupération Sendcloud' });
      }
    });

    // POST cancel shipment
    server.middlewares.use('/api/sendcloud-cancel-shipment', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

      const admin = await verifyAdminRequest(req.headers, env);
      if (!admin.ok) return sendJson(res, admin.status, { error: admin.error });

      try {
        const body = await readBody(req);
        const publicKey = env.SENDCLOUD_PUBLIC_KEY;
        const secretKey = env.SENDCLOUD_SECRET_KEY;
        if (!publicKey || !secretKey) return sendJson(res, 503, { error: 'Sendcloud non configuré' });
        const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        let cancelled = false;
        let message = '';

        if (body.parcelId) {
          try {
            const resp = await fetch(`${SC_BASE}/api/v2/parcels/${body.parcelId}/cancel`, {
              method: 'POST',
              headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            });
            const data = await resp.json();
            if (resp.ok) { cancelled = true; message = data.message || 'Étiquette annulée'; }
          } catch (e) {}
        }
        if (!cancelled && body.shipmentId) {
          try {
            const resp = await fetch(`${SC_BASE}/api/v3/shipments/${body.shipmentId}/cancel`, {
              method: 'POST',
              headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
            });
            if (resp.ok) { cancelled = true; message = 'Expédition annulée'; }
          } catch (e) {}
        }
        return sendJson(res, 200, { success: true, cancelled, message: message || 'Traitée' });
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    });

    // POST send order email notification
    server.middlewares.use('/api/send-order-email', async (req, res, next) => {
      if (req.method === 'OPTIONS') return sendJson(res, 200, {});
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
      try {
        const body = await readBody(req);
        if (body.type === 'shipping_tracking') {
          const admin = await verifyAdminRequest(req.headers, env);
          if (!admin.ok) return sendJson(res, admin.status, { error: admin.error });
        }

        const result = await sendOrderEmail({ ...body, env });
        return sendJson(res, result.status, result.body);
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  
  return {
    base: './',
    resolve: {
      dedupe: ['react', 'react-dom']
    },
    plugins: [react(), stripeBackendPlugin(env), sendcloudPlugin(env)],
    server: {
      port: 5173
    },
    build: {
      // Optimisations pour la performance
      target: 'es2020',
      minify: 'esbuild',
      reportCompressedSize: false,
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
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-helmet-async',
        'react-quill',
        'lucide-react',
        '@stripe/react-stripe-js',
        '@paypal/react-paypal-js',
        'firebase/app',
        'firebase/firestore'
      ],
      exclude: ['firebase-admin', 'nodemailer']
    }
  };
});
