// Sendcloud Cancel Shipment / Parcel API
// Vercel serverless function (called by admin to cancel shipping label)

import { verifyAdminRequest } from '../server/admin-auth.js';

const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .end();
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
    const { parcelId, shipmentId } = req.body;

    if (!parcelId && !shipmentId) {
      return res.status(400).json({ error: 'parcelId ou shipmentId requis pour annuler' });
    }

    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
    let cancelled = false;
    let message = '';

    // Try parcel cancel endpoint first if parcelId is available
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
          message = data.message || 'Étiquette annulée avec succès';
        } else {
          message = data.message || data.detail || 'Erreur annulation parcel';
        }
      } catch (e) {
        console.warn('[Sendcloud] parcel cancel error:', e.message);
      }
    }

    // If not cancelled yet and shipmentId is available, try v3 shipment cancel/delete
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
          message = 'Expédition annulée avec succès';
        }
      } catch (e) {
        console.warn('[Sendcloud] shipment cancel error:', e.message);
      }
    }

    return res.status(200).json({
      success: true,
      cancelled,
      message: message || 'Demande d’annulation traitée',
    });
  } catch (err) {
    console.error('[Sendcloud] cancel exception:', err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
}
