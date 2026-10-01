// Sendcloud Shipments API - Create a shipment and retrieve the label
// Vercel serverless function (called by admin to generate shipping label)

import { verifyAdminRequest } from '../server/admin-auth.js';

const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

const supportsServicePoint = (shippingOptionCode) => {
  const code = String(shippingOptionCode || '').toLowerCase();
  const optionCode = code.includes(':') ? code.split(':').slice(1).join(':') : code;
  return optionCode.includes('service_point')
    || optionCode.includes('post-office')
    || optionCode.includes('locker_delivery')
    || optionCode.includes('relay');
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS').setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await verifyAdminRequest(req.headers);
  if (!admin.ok) return res.status(admin.status).json({ error: admin.error });

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return res.status(503).json({ error: 'Sendcloud non configuré — clés API manquantes' });
  }

  try {
    const { shippingOptionCode, recipient, parcel, testMode, servicePointId } = req.body;

    if (!shippingOptionCode || !recipient || !parcel) {
      return res.status(400).json({ error: 'Paramètres manquants: shippingOptionCode, recipient, parcel requis' });
    }
    if (!testMode && servicePointId && !supportsServicePoint(shippingOptionCode)) {
      return res.status(400).json({ error: 'Cette méthode Sendcloud ne supporte pas les points relais' });
    }

    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');

    const payload = {
      label_details: {
        mime_type: 'application/pdf',
        dpi: 72,
      },
      to_address: {
        name: `${recipient.firstName} ${recipient.lastName}`.trim(),
        address_line_1: recipient.address || '',
        postal_code: recipient.postalCode || '',
        city: recipient.city || '',
        country_code: recipient.countryCode || 'FR',
        phone_number: recipient.phone || '',
        email: recipient.email || '',
      },
      from_address: {
        name: process.env.SENDCLOUD_SENDER_NAME || 'Mey Beauty',
        company_name: 'Mey Beauty',
        address_line_1: process.env.SENDCLOUD_SENDER_ADDRESS || '',
        postal_code: process.env.SENDCLOUD_SENDER_POSTAL_CODE || '',
        city: process.env.SENDCLOUD_SENDER_CITY || '',
        country_code: process.env.SENDCLOUD_SENDER_COUNTRY_CODE || 'FR',
        phone_number: process.env.SENDCLOUD_SENDER_PHONE || '',
        email: process.env.SENDCLOUD_SENDER_EMAIL || '',
      },
      ship_with: {
        type: 'shipping_option_code',
        properties: {
          shipping_option_code: testMode ? 'sendcloud:letter' : shippingOptionCode,
        },
      },
      parcels: [
        {
          weight: {
            value: String(parcel.weightKg || '1'),
            unit: 'kg',
          },
          length: parcel.lengthCm || 20,
          width: parcel.widthCm || 15,
          height: parcel.heightCm || 10,
        },
      ],
    };

    if (!testMode && servicePointId) {
      payload.to_service_point = { id: Number(servicePointId) };
    }

    const url = `${SENDCLOUD_API_BASE}/api/v3/shipments/announce`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error('[Sendcloud] create-shipment error:', resp.status, JSON.stringify(data));
      return res.status(resp.status).json({ error: data.detail || data.message || 'Erreur Sendcloud', raw: data });
    }

    const shipment = data.data || data.shipment || data;
    const parcels = shipment.parcels || [];
    const firstParcel = parcels[0] || {};
    const labelBase64 = firstParcel.label_file || shipment.label_file || data.label_file || null;
    const labelUrl = firstParcel.id
      ? `/api/sendcloud-label?parcelId=${firstParcel.id}`
      : labelBase64
        ? `data:application/pdf;base64,${labelBase64}`
        : null;

    return res.status(200).json({
      shipmentId: shipment.id || data.id,
      parcelId: firstParcel.id,
      labelUrl,
      trackingNumber: firstParcel.tracking_number || firstParcel.tracking_code || shipment.tracking_number || data.tracking_number || null,
      trackingUrl: firstParcel.tracking_url || firstParcel.tracking_link || shipment.tracking_url || data.tracking_url || null,
      status: shipment.status || data.status || 'created',
      testMode: !!testMode,
    });
  } catch (err) {
    console.error('[Sendcloud] create-shipment exception:', err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
}
