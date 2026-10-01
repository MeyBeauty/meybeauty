// Sendcloud Cancel Shipment API - Netlify function

import { verifyAdminRequest } from '../../server/admin-auth.js';

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

const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

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
    const body = JSON.parse(event.body || '{}');
    const { parcelId, shipmentId } = body;

    if (!parcelId && !shipmentId) {
      return json(400, { error: 'parcelId ou shipmentId requis' });
    }

    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
    let cancelled = false;
    let message = '';

    if (parcelId) {
      try {
        const resp = await fetch(`${SENDCLOUD_API_BASE}/api/v2/parcels/${parcelId}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const data = await resp.json();
        if (resp.ok) {
          cancelled = true;
          message = data.message || 'Étiquette annulée';
        }
      } catch (e) {}
    }

    if (!cancelled && shipmentId) {
      try {
        const resp = await fetch(`${SENDCLOUD_API_BASE}/api/v3/shipments/${shipmentId}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (resp.ok) {
          cancelled = true;
          message = 'Expédition annulée';
        }
      } catch (e) {}
    }

    return json(200, { success: true, cancelled, message: message || 'Traitée' });
  } catch (err) {
    return json(500, { error: err.message || 'Erreur serveur' });
  }
};
