// Sendcloud Dynamic Checkout API - Retrieve delivery options
// Vercel serverless function (called by frontend during checkout)

const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS').setHeader('Access-Control-Allow-Headers', 'Content-Type').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;
  const configId = process.env.SENDCLOUD_CONFIG_ID;

  if (!publicKey || !secretKey) {
    return res.status(503).json({ error: 'Sendcloud non configuré — clés API manquantes' });
  }
  if (!configId) {
    return res.status(503).json({ error: 'Sendcloud non configuré — configuration_id manquant' });
  }

  try {
    const { weightGrams, totalOrderValue, toCountryCode, toPostalCode } = req.body;

    if (!weightGrams || !totalOrderValue || !toCountryCode) {
      return res.status(400).json({ error: 'Paramètres manquants: weightGrams, totalOrderValue, toCountryCode requis' });
    }

    const params = new URLSearchParams({
      weight_value: String(weightGrams),
      total_order_value: String(totalOrderValue),
      from_country_code: process.env.SENDCLOUD_SENDER_COUNTRY_CODE || 'FR',
      to_country_code: toCountryCode,
      checkout_identifier_type: 'shipping_option_code',
    });

    if (toPostalCode) params.append('to_postal_code', toPostalCode);

    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
    const url = `${SENDCLOUD_API_BASE}/api/v3/checkout/configurations/${configId}/delivery-options?${params}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error('[Sendcloud] delivery-options error:', resp.status, JSON.stringify(data));
      return res.status(resp.status).json({ error: data.detail || data.message || 'Erreur Sendcloud', raw: data });
    }

    const options = (data.delivery_options || []).map((opt) => ({
      id: opt.id,
      shippingOptionCode: opt.checkout_identifier?.value || opt.checkout_identifier || null,
      carrier: opt.carrier?.name || opt.carrier?.code || opt.carrier_name || '',
      carrierCode: opt.carrier?.code || '',
      deliveryMethod: opt.delivery_method_type || '',
      name: opt.title || opt.internal_title || `${opt.carrier?.name || ''}`.trim(),
      price: opt.shipping_rate?.value ?? opt.price ?? opt.shipping_price ?? null,
      currency: opt.shipping_rate?.currency || 'EUR',
      estimatedDeliveryDays: null,
      leadTimeHours: opt.lead_time_hours?.p50 || null,
      logoUrl: opt.carrier?.logo_url || null,
    })).filter((o) => o.shippingOptionCode);

    return res.status(200).json({ options, configurationId: data.configuration_id || configId });
  } catch (err) {
    console.error('[Sendcloud] delivery-options exception:', err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
}
