import { fetchSendcloudShipment } from '../server/sendcloud-shipment.js';
import { verifyAdminRequest } from '../server/admin-auth.js';

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

  const result = await fetchSendcloudShipment({
    shipmentId: req.body?.shipmentId,
    env: process.env,
  });
  return res.status(result.status).json(result.body);
}
