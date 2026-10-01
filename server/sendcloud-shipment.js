const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

const mapShipmentStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  const statusMap = {
    announcement_succeeded: 'label_created',
    shipment_announced: 'label_created',
    ready_to_send: 'label_created',
    handed_to_carrier: 'shipped',
    shipment_taken_over_by_carrier: 'shipped',
    delivered_to_consumer: 'delivered',
    delivered: 'delivered',
    delivery_failed: 'failed',
    returned_to_sender: 'returned',
    cancelled: 'cancelled',
  };
  return statusMap[normalized] || normalized || 'label_created';
};

const errorBody = (status, error, raw = null) => ({
  ok: false,
  status,
  body: { error, raw },
});

export async function fetchSendcloudShipment({ shipmentId, env = process.env }) {
  const publicKey = env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = env.SENDCLOUD_SECRET_KEY;

  if (!publicKey || !secretKey) {
    return errorBody(503, 'Sendcloud non configuré — clés API manquantes');
  }
  if (!shipmentId) {
    return errorBody(400, 'shipmentId requis');
  }

  try {
    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
    const response = await fetch(`${SENDCLOUD_API_BASE}/api/v3/shipments/${shipmentId}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      const detail = data?.errors?.[0]?.detail || data?.detail || data?.message || 'Erreur Sendcloud';
      return errorBody(response.status, detail, data);
    }

    const shipment = data.data || data.shipment || data;
    const firstParcel = shipment.parcels?.[0] || {};
    const rawStatus = firstParcel.status?.code || shipment.status?.code || shipment.status || '';
    const trackingNumber = firstParcel.tracking_number
      || firstParcel.tracking_numbers?.[0]?.tracking_number
      || shipment.tracking_number
      || null;
    const trackingUrl = firstParcel.tracking_url
      || firstParcel.tracking_link
      || shipment.tracking_url
      || data.tracking_url
      || null;

    return {
      ok: true,
      status: 200,
      body: {
        shipmentId: shipment.id || shipmentId,
        parcelId: firstParcel.id || null,
        labelUrl: firstParcel.id ? `/api/sendcloud-label?parcelId=${firstParcel.id}` : null,
        trackingNumber,
        trackingUrl,
        status: mapShipmentStatus(rawStatus),
        sendcloudStatus: rawStatus || null,
        updatedAt: shipment.updated_at || firstParcel.updated_at || null,
      },
    };
  } catch (err) {
    return errorBody(500, err.message || 'Erreur récupération Sendcloud');
  }
}
