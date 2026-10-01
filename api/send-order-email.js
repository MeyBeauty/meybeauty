import { sendOrderEmail } from '../server/send-order-email.js';
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

  try {
    if (req.body?.type === 'shipping_tracking') {
      const admin = await verifyAdminRequest(req.headers);
      if (!admin.ok) return res.status(admin.status).json({ error: admin.error });
    }

    const result = await sendOrderEmail({ ...req.body, env: process.env });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[Email] Exception:', err);
    return res.status(500).json({ error: err.message || 'Erreur envoi email' });
  }
}
