// Sendcloud Shipments API - Create a shipment and retrieve the label
// Called by the admin panel to generate a shipping label for an order

import { verifyAdminRequest } from '../../server/admin-auth.js';

const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

const supportsServicePoint = (shippingOptionCode) => {
  const code = String(shippingOptionCode || '').toLowerCase();
  const optionCode = code.includes(':') ? code.split(':').slice(1).join(':') : code;
  return optionCode.includes('service_point')
    || optionCode.includes('post-office')
    || optionCode.includes('locker_delivery')
    || optionCode.includes('relay');
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const admin = await verifyAdminRequest(event.headers);
  if (!admin.ok) return json(admin.status, { error: admin.error });

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return json(503, { error: 'Sendcloud non configuré — clés API manquantes' });
  }

  try {
    const {
      shippingOptionCode,
      recipient,
      parcel,
      testMode,
      servicePointId,
    } = JSON.parse(event.body || '{}');

    if (!shippingOptionCode || !recipient || !parcel) {
      return json(400, { error: 'Paramètres manquants: shippingOptionCode, recipient, parcel requis' });
    }
    if (!testMode && servicePointId && !supportsServicePoint(shippingOptionCode)) {
      return json(400, { error: 'Cette méthode Sendcloud ne supporte pas les points relais' });
    }

    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');

    // Build the shipment payload
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

    // Create shipment synchronously
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
      return json(resp.status, { error: data.detail || data.message || 'Erreur Sendcloud', raw: data });
    }

    // Extract shipment + parcel + label info
    const shipment = data.data || data.shipment || data;
    const parcels = shipment.parcels || [];
    const firstParcel = parcels[0] || {};
    const labelBase64 = firstParcel.label_file || shipment.label_file || data.label_file || null;
    const labelUrl = firstParcel.id
      ? `/api/sendcloud-label?parcelId=${firstParcel.id}`
      : labelBase64
        ? `data:application/pdf;base64,${labelBase64}`
        : null;

    return json(200, {
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
    return json(500, { error: err.message || 'Erreur serveur' });
  }
};
