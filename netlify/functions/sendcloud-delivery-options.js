// Sendcloud Dynamic Checkout API - Retrieve delivery options
// Called by the frontend during checkout to show available shipping methods

const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' } };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;
  const configId = process.env.SENDCLOUD_CONFIG_ID;

  if (!publicKey || !secretKey) {
    return json(503, { error: 'Sendcloud non configuré — clés API manquantes' });
  }
  if (!configId) {
    return json(503, { error: 'Sendcloud non configuré — configuration_id manquant' });
  }

  try {
    const { weightGrams, totalOrderValue, toCountryCode, toPostalCode } = JSON.parse(event.body);

    if (!weightGrams || !totalOrderValue || !toCountryCode) {
      return json(400, { error: 'Paramètres manquants: weightGrams, totalOrderValue, toCountryCode requis' });
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
      return json(resp.status, { error: data.detail || data.message || 'Erreur Sendcloud', raw: data });
    }

    // Normalize delivery options for the frontend
    const options = (data.delivery_options || []).map((opt) => ({
      id: opt.id,
      shippingOptionCode: opt.checkout_identifier?.value || opt.checkout_identifier || null,
      carrier: opt.carrier || opt.carrier_name || '',
      deliveryMethod: opt.delivery_method?.name || opt.delivery_method_name || '',
      name: opt.name || `${opt.carrier || ''} ${opt.delivery_method?.name || ''}`.trim(),
      price: opt.price ?? opt.shipping_price ?? 0,
      currency: opt.currency || 'EUR',
      estimatedDeliveryDays: opt.estimated_delivery_days || opt.delivery_days || null,
      logoUrl: opt.carrier_logo_url || opt.logo_url || null,
    })).filter((o) => o.shippingOptionCode);

    return json(200, { options, configurationId: data.configuration_id || configId });
  } catch (err) {
    console.error('[Sendcloud] delivery-options exception:', err);
    return json(500, { error: err.message || 'Erreur serveur' });
  }
};
