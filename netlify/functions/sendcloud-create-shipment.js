// Sendcloud Shipments API - Create a shipment and retrieve the label
// Called by the admin panel to generate a shipping label for an order

const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

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
    } = JSON.parse(event.body);

    if (!shippingOptionCode || !recipient || !parcel) {
      return json(400, { error: 'Paramètres manquants: shippingOptionCode, recipient, parcel requis' });
    }

    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');

    // Build the shipment payload
    const payload = {
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
    const shipment = data.shipment || data;
    const parcels = shipment.parcels || [];
    const firstParcel = parcels[0] || {};

    // Label can be in the response (synchronous) or needs a separate fetch
    let labelUrl = data.label_file || firstParcel.label_file_url || null;

    // If no label URL in response, try to fetch it via Parcel Documents API
    if (!labelUrl && firstParcel.id) {
      try {
        const labelResp = await fetch(
          `${SENDCLOUD_API_BASE}/api/v3/parcels/${firstParcel.id}/documents/label`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Accept': 'application/json',
            },
          }
        );
        if (labelResp.ok) {
          const labelData = await labelResp.json();
          labelUrl = labelData.label_url || labelData.url || labelData.download_url || null;
        }
      } catch (e) {
        console.error('[Sendcloud] label fetch failed:', e.message);
      }
    }

    return json(200, {
      shipmentId: shipment.id || data.id,
      parcelId: firstParcel.id,
      labelUrl,
      trackingNumber: firstParcel.tracking_number || firstParcel.tracking_code || null,
      trackingUrl: firstParcel.tracking_url || firstParcel.tracking_link || null,
      status: shipment.status || data.status || 'created',
      testMode: !!testMode,
    });
  } catch (err) {
    console.error('[Sendcloud] create-shipment exception:', err);
    return json(500, { error: err.message || 'Erreur serveur' });
  }
};
