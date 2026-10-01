import crypto from 'node:crypto';

const STATUS_MAP = {
  announced: 'label_created',
  announcing: 'label_created',
  announcement_succeeded: 'label_created',
  shipment_announced: 'label_created',
  ready_to_send: 'label_created',
  announced_uncollected: 'label_created',
  to_sorting: 'shipped',
  delivery_delayed: 'shipped',
  sorted: 'shipped',
  sorting: 'shipped',
  at_sorting_centre: 'shipped',
  shipment_on_route: 'shipped',
  driver_on_route: 'shipped',
  picked_up_by_driver: 'shipped',
  handed_to_carrier: 'shipped',
  shipment_taken_over_by_carrier: 'shipped',
  awaiting_customer_pickup: 'shipped',
  delivered: 'delivered',
  delivered_to_consumer: 'delivered',
  collected_by_customer: 'delivered',
  delivery_failed: 'failed',
  collect_error: 'failed',
  undeliverable: 'failed',
  refused_by_recipient: 'failed',
  address_invalid: 'failed',
  exception: 'failed',
  announcement_failed: 'failed',
  cancellation_failed: 'failed',
  returned_to_sender: 'returned',
  cancelling_upstream: 'cancelled',
  cancelling: 'cancelled',
  cancelled_upstream: 'cancelled',
  cancelled: 'cancelled',
};

const LEGACY_STATUS_ID_MAP = {
  1: 'label_created',
  3: 'shipped',
  4: 'shipped',
  5: 'shipped',
  7: 'shipped',
  8: 'failed',
  11: 'delivered',
  12: 'shipped',
  13: 'label_created',
  15: 'failed',
  22: 'shipped',
  80: 'failed',
  91: 'shipped',
  92: 'shipped',
  93: 'delivered',
  999: 'pending',
  1000: 'label_created',
  1001: 'label_created',
  1002: 'failed',
  1337: 'pending',
  1998: 'cancelled',
  1999: 'cancelled',
  2000: 'cancelled',
  2001: 'cancelled',
};

const normalizeStatus = (value) => {
  if (value == null) return '';
  if (typeof value === 'number') return LEGACY_STATUS_ID_MAP[value] || String(value);
  if (typeof value === 'object') return normalizeStatus(value.code ?? value.id ?? value.message);
  return String(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
};

export function extractSendcloudWebhook(body = {}) {
  const parcel = body.parcel || body.data?.parcel || {};
  const shipment = body.shipment || parcel.shipment || {};
  const rawStatus = parcel.status ?? body.status ?? shipment.status ?? '';
  const normalizedStatus = normalizeStatus(rawStatus);

  return {
    action: body.action || '',
    parcelId: parcel.id ?? body.parcel_id ?? body.parcelId ?? null,
    shipmentId: parcel.shipment_uuid || shipment.uuid || body.shipment_uuid || shipment.id || body.shipment_id || body.id || null,
    rawStatus,
    sendcloudStatus: normalizedStatus,
    mappedStatus: STATUS_MAP[normalizedStatus] || normalizedStatus || 'label_created',
    trackingNumber: parcel.tracking_number || body.tracking_number || shipment.tracking_number || null,
    trackingUrl: parcel.tracking_url || body.tracking_url || shipment.tracking_url || null,
    timestamp: Number(body.timestamp || Date.now()),
  };
}

export function verifySendcloudSignature(rawBody, signature, env = process.env) {
  const secret = env.SENDCLOUD_WEBHOOK_SECRET || env.SENDCLOUD_SECRET_KEY;
  if (!secret || !signature) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(String(signature), 'utf8');
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
