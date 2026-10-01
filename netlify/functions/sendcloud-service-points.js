// Sendcloud Service Points API - Retrieve pickup locations (Mondial Relay, Colissimo, Chronopost)
// Netlify serverless function

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

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return json(503, { error: 'Sendcloud non configuré — clés API manquantes' });
  }

  try {
    let body = {};
    if (event.body) {
      try { body = JSON.parse(event.body); } catch (_) {}
    }
    const q = event.queryStringParameters || {};

    const postalCode = q.postalCode || body.postalCode || '91170';
    const country = q.country || body.country || 'FR';
    const carrier = q.carrier || body.carrier || '';
    const radius = q.radius || body.radius || '10000';

    const params = new URLSearchParams({
      country,
      address: postalCode,
      radius: String(radius),
    });
    if (carrier) params.append('carrier', carrier);

    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
    const url = `https://servicepoints.sendcloud.sc/api/v2/service-points?${params}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error('[Sendcloud] service-points error:', resp.status, data);
      return json(resp.status, { error: data.detail || 'Erreur récupération points relais' });
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

    return json(200, { points });
  } catch (err) {
    console.error('[Sendcloud] service-points exception:', err);
    return json(500, { error: err.message || 'Erreur serveur' });
  }
};
