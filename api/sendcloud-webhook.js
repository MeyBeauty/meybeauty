// Sendcloud Webhook Handler (Vercel serverless function)
// Receives shipment status updates from Sendcloud and updates the order in Firebase
// Webhook URL to set in Sendcloud: https://meybeauty.vercel.app/api/sendcloud-webhook

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { sendOrderEmail } from '../server/send-order-email.js';
import { extractSendcloudWebhook, verifySendcloudSignature } from '../server/sendcloud-webhook-utils.js';

export const config = {
  api: { bodyParser: false },
};

function getDb() {
  if (getApps().length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountJson) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY manquant');
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  }
  return getFirestore();
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function findOrder(db, shipmentId, parcelId) {
  const ordersRef = db.collection('orders');

  if (shipmentId) {
    const snapshot = await ordersRef.where('shipping.sendcloudShipmentId', '==', String(shipmentId)).limit(1).get();
    if (!snapshot.empty) return snapshot.docs[0];
  }

  if (parcelId != null) {
    const numericParcelId = Number(parcelId);
    const storedParcelId = Number.isFinite(numericParcelId) ? numericParcelId : String(parcelId);
    const snapshot = await ordersRef.where('shipping.parcelId', '==', storedParcelId).limit(1).get();
    if (!snapshot.empty) return snapshot.docs[0];
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers['sendcloud-signature'];
    if (!verifySendcloudSignature(rawBody, signature)) {
      return res.status(401).json({ error: 'Signature Sendcloud invalide' });
    }

    const body = JSON.parse(rawBody.toString('utf8'));
    const webhook = extractSendcloudWebhook(body);
    const { shipmentId, parcelId, sendcloudStatus, mappedStatus, trackingNumber, trackingUrl, timestamp } = webhook;

    if (!shipmentId && !parcelId) {
      return res.status(200).json({ received: true, message: 'No shipment or parcel ID — ignored' });
    }

    const db = getDb();
    const orderDoc = await findOrder(db, shipmentId, parcelId);
    if (!orderDoc) {
      return res.status(200).json({ received: true, message: 'No matching order — ignored' });
    }

    const orderId = orderDoc.id;
    const orderData = orderDoc.data();
    const currentShipping = orderData.shipping || {};
    const lastWebhookTimestamp = Number(currentShipping.lastWebhookTimestamp || 0);
    if (timestamp && lastWebhookTimestamp && timestamp < lastWebhookTimestamp) {
      return res.status(200).json({ received: true, ignored: 'stale_webhook' });
    }

    const updatedShipping = {
      ...currentShipping,
      status: mappedStatus,
      lastWebhookStatus: sendcloudStatus,
      lastWebhookTimestamp: timestamp,
      trackingNumber: trackingNumber || currentShipping.trackingNumber || null,
      trackingUrl: trackingUrl || currentShipping.trackingUrl || null,
      updatedAt: new Date().toISOString(),
    };
    if (shipmentId) updatedShipping.sendcloudShipmentId = String(shipmentId);
    if (parcelId != null) updatedShipping.parcelId = Number.isFinite(Number(parcelId)) ? Number(parcelId) : String(parcelId);

    let orderStatus = orderData.status;
    if (mappedStatus === 'shipped' && orderStatus === 'paid') orderStatus = 'shipped';
    if (mappedStatus === 'delivered') orderStatus = 'delivered';
    if (mappedStatus === 'cancelled' && orderStatus !== 'delivered') orderStatus = 'cancelled';

    await orderDoc.ref.update({ shipping: updatedShipping, status: orderStatus, updatedAt: new Date() });

    let trackingEmailSent = false;
    const canSendTrackingEmail = orderData.customer?.email
      && !currentShipping.trackingEmailSentAt
      && (updatedShipping.trackingNumber || updatedShipping.trackingUrl);

    if (canSendTrackingEmail) {
      const emailResult = await sendOrderEmail({
        type: 'shipping_tracking',
        order: { id: orderId, ...orderData, shipping: updatedShipping },
        recipientEmail: orderData.customer.email,
        recipientName: `${orderData.customer.firstName || ''} ${orderData.customer.lastName || ''}`.trim(),
        trackingNumber: updatedShipping.trackingNumber,
        trackingUrl: updatedShipping.trackingUrl,
        carrier: updatedShipping.carrier,
        env: process.env,
      });
      trackingEmailSent = emailResult.ok;
      if (emailResult.ok) {
        updatedShipping.trackingEmailSentAt = new Date().toISOString();
        await orderDoc.ref.update({ shipping: updatedShipping });
      }
    }

    return res.status(200).json({ received: true, orderId, shipmentId, parcelId, status: mappedStatus, trackingNumber, trackingEmailSent });
  } catch (err) {
    console.error('[Sendcloud Webhook] Error:', err);
    return res.status(200).json({ received: true, error: err.message });
  }
}
