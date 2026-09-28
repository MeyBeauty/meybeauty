// Sendcloud Webhook Handler (Vercel serverless function)
// Receives shipment status updates from Sendcloud and updates the order in Firebase
// Webhook URL to set in Sendcloud: https://meybeauty.vercel.app/api/sendcloud-webhook

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log('[Sendcloud Webhook] Received:', JSON.stringify(body, null, 2));

    const shipmentId = body.shipment?.id || body.id || body.shipment_id;
    const sendcloudStatus = body.action || body.status || body.shipment?.status || '';
    const trackingNumber = body.parcel?.tracking_number || body.shipment?.tracking_number || null;
    const trackingUrl = body.parcel?.tracking_url || body.shipment?.tracking_url || body.tracking_url || null;

    if (!shipmentId) {
      console.warn('[Sendcloud Webhook] No shipment ID found in payload');
      return res.status(200).json({ received: true, message: 'No shipment ID — ignored' });
    }

    const mappedStatus = mapSendcloudStatus(sendcloudStatus);
    console.log(`[Sendcloud Webhook] Shipment ${shipmentId} → status: ${sendcloudStatus} → ${mappedStatus}`);

    const db = getDb();
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef
      .where('shipping.sendcloudShipmentId', '==', String(shipmentId))
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(`[Sendcloud Webhook] No order found for shipment ${shipmentId}`);
      return res.status(200).json({ received: true, message: 'No matching order — ignored' });
    }

    const orderDoc = snapshot.docs[0];
    const orderId = orderDoc.id;
    const orderData = orderDoc.data();
    const currentShipping = orderData.shipping || {};

    const updatedShipping = {
      ...currentShipping,
      sendcloudShipmentId: String(shipmentId),
      status: mappedStatus,
      lastWebhookStatus: sendcloudStatus,
      trackingNumber: trackingNumber || currentShipping.trackingNumber || null,
      trackingUrl: trackingUrl || currentShipping.trackingUrl || null,
      updatedAt: new Date().toISOString(),
    };

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

    return res.status(200).json({
      received: true,
      orderId,
      shipmentId: String(shipmentId),
      status: mappedStatus,
      trackingNumber,
    });
  } catch (err) {
    console.error('[Sendcloud Webhook] Error:', err);
    return res.status(200).json({ received: true, error: err.message });
  }
}
