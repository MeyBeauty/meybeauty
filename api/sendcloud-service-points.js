// Sendcloud Service Points API - Retrieve pickup locations (Mondial Relay, Colissimo, Chronopost)
// Vercel serverless function (called by frontend when user selects point relais)

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return res.status(503).json({ error: 'Sendcloud non configuré — clés API manquantes' });
  }

  try {
    const postalCode = req.query?.postalCode || req.body?.postalCode || '91170';
    const country = req.query?.country || req.body?.country || 'FR';
    const carrier = req.query?.carrier || req.body?.carrier || '';
    const radius = req.query?.radius || req.body?.radius || '10000'; // 10 km default

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
      return res.status(resp.status).json({ error: data.detail || 'Erreur récupération points relais' });
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

    return res.status(200).json({ points });
  } catch (err) {
    console.error('[Sendcloud] service-points exception:', err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
}
