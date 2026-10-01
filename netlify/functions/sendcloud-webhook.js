// Sendcloud Webhook Handler
// Receives shipment status updates from Sendcloud and updates the order in Firebase
// Webhook URL to set in Sendcloud: https://[your-domain]/api/sendcloud-webhook

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { sendOrderEmail } from '../../server/send-order-email.js';
import { extractSendcloudWebhook, verifySendcloudSignature } from '../../server/sendcloud-webhook-utils.js';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Sendcloud-Signature',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function getDb() {
  if (getApps().length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountJson) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY manquant');
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  }
  return getFirestore();
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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Sendcloud-Signature', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } };
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  try {
    const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64') : Buffer.from(event.body || '', 'utf8');
    const signature = event.headers?.['sendcloud-signature'] || event.headers?.['Sendcloud-Signature'];
    if (!verifySendcloudSignature(rawBody, signature)) {
      return json(401, { error: 'Signature Sendcloud invalide' });
    }

    const body = JSON.parse(rawBody.toString('utf8'));
    const webhook = extractSendcloudWebhook(body);
    const { shipmentId, parcelId, sendcloudStatus, mappedStatus, trackingNumber, trackingUrl, timestamp } = webhook;

    if (!shipmentId && !parcelId) {
      return json(200, { received: true, message: 'No shipment or parcel ID — ignored' });
    }

    const db = getDb();
    const orderDoc = await findOrder(db, shipmentId, parcelId);
    if (!orderDoc) return json(200, { received: true, message: 'No matching order — ignored' });

    const orderId = orderDoc.id;
    const orderData = orderDoc.data();
    const currentShipping = orderData.shipping || {};
    const lastWebhookTimestamp = Number(currentShipping.lastWebhookTimestamp || 0);
    if (timestamp && lastWebhookTimestamp && timestamp < lastWebhookTimestamp) {
      return json(200, { received: true, ignored: 'stale_webhook' });
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

    return json(200, { received: true, orderId, shipmentId, parcelId, status: mappedStatus, trackingNumber, trackingEmailSent });
  } catch (err) {
    console.error('[Sendcloud Webhook] Error:', err);
    return json(200, { received: true, error: err.message });
  }
};
