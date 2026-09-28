// Sendcloud Webhook Handler
// Receives shipment status updates from Sendcloud and updates the order in Firebase
// Webhook URL to set in Sendcloud: https://[your-domain]/api/sendcloud-webhook

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

// Initialize Firebase Admin (singleton)
function getDb() {
  if (getApps().length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY manquant');
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  }
  return getFirestore();
}

// Map Sendcloud statuses to our internal statuses
function mapSendcloudStatus(sendcloudStatus) {
  const statusMap = {
    'announcement_succeeded': 'label_created',
    'shipment_announced': 'label_created',
    'ready_to_send': 'label_created',
    'handed_to_carrier': 'shipped',
    'shipment_taken_over_by_carrier': 'shipped',
    'delivered_to_consumer': 'delivered',
    'delivered': 'delivered',
    'delivery_failed': 'failed',
    'returned_to_sender': 'returned',
    'cancelled': 'cancelled',
  };
  return statusMap[sendcloudStatus] || sendcloudStatus;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body);
    console.log('[Sendcloud Webhook] Received:', JSON.stringify(body, null, 2));

    // Sendcloud webhook payload structure:
    // body.action or body.status — the shipment status
    // body.shipment.id — the Sendcloud shipment ID
    // body.parcel.tracking_number — tracking number
    // body.parcel.tracking_url — tracking URL

    const shipmentId = body.shipment?.id || body.id || body.shipment_id;
    const sendcloudStatus = body.action || body.status || body.shipment?.status || '';
    const trackingNumber = body.parcel?.tracking_number || body.shipment?.tracking_number || null;
    const trackingUrl = body.parcel?.tracking_url || body.shipment?.tracking_url || body.tracking_url || null;

    if (!shipmentId) {
      console.warn('[Sendcloud Webhook] No shipment ID found in payload');
      return json(200, { received: true, message: 'No shipment ID — ignored' });
    }

    const mappedStatus = mapSendcloudStatus(sendcloudStatus);
    console.log(`[Sendcloud Webhook] Shipment ${shipmentId} → status: ${sendcloudStatus} → ${mappedStatus}`);

    // Find the order in Firebase by sendcloud shipment ID
    const db = getDb();
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef
      .where('shipping.sendcloudShipmentId', '==', String(shipmentId))
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(`[Sendcloud Webhook] No order found for shipment ${shipmentId}`);
      return json(200, { received: true, message: 'No matching order — ignored' });
    }

    const orderDoc = snapshot.docs[0];
    const orderId = orderDoc.id;
    const orderData = orderDoc.data();
    const currentShipping = orderData.shipping || {};

    // Update the shipping info
    const updatedShipping = {
      ...currentShipping,
      sendcloudShipmentId: String(shipmentId),
      status: mappedStatus,
      lastWebhookStatus: sendcloudStatus,
      trackingNumber: trackingNumber || currentShipping.trackingNumber || null,
      trackingUrl: trackingUrl || currentShipping.trackingUrl || null,
      updatedAt: new Date().toISOString(),
    };

    // Also update the order status if delivered or shipped
    let orderStatus = orderData.status;
    if (mappedStatus === 'shipped' && orderStatus === 'paid') {
      orderStatus = 'shipped';
    } else if (mappedStatus === 'delivered') {
      orderStatus = 'delivered';
    }

    await orderDoc.ref.update({
      shipping: updatedShipping,
      status: orderStatus,
      updatedAt: new Date(),
    });

    console.log(`[Sendcloud Webhook] Order ${orderId} updated: shipping.status=${mappedStatus}, order.status=${orderStatus}`);

    return json(200, {
      received: true,
      orderId,
      shipmentId: String(shipmentId),
      status: mappedStatus,
      trackingNumber,
    });
  } catch (err) {
    console.error('[Sendcloud Webhook] Error:', err);
    // Return 200 even on error so Sendcloud doesn't retry indefinitely
    return json(200, { received: true, error: err.message });
  }
};
