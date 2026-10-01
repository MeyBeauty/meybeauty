import { fetchSendcloudShipment } from '../../server/sendcloud-shipment.js';
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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const admin = await verifyAdminRequest(event.headers);
  if (!admin.ok) return json(admin.status, { error: admin.error });

  try {
    const body = JSON.parse(event.body || '{}');
    const result = await fetchSendcloudShipment({ shipmentId: body.shipmentId, env: process.env });
    return json(result.status, result.body);
  } catch (err) {
    return json(500, { error: err.message || 'Erreur récupération Sendcloud' });
  }
};
