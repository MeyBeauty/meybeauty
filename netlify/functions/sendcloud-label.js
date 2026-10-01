const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;
  const parcelId = event.queryStringParameters?.parcelId;
  const paperSize = event.queryStringParameters?.paperSize || 'A4';
  const download = event.queryStringParameters?.download === '1';

  if (!publicKey || !secretKey) {
    return json(503, { error: 'Sendcloud non configuré — clés API manquantes' });
  }
  if (!parcelId) {
    return json(400, { error: 'parcelId requis' });
  }

  try {
    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
    const url = `${SENDCLOUD_API_BASE}/api/v3/parcels/${parcelId}/documents/label?paper_size=${encodeURIComponent(paperSize)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/pdf',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}
      const detail = data?.errors?.[0]?.detail || data?.detail || text || 'Étiquette Sendcloud introuvable';
      return json(response.status, { error: detail, raw: data });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'application/pdf',
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="sendcloud-label-${parcelId}.pdf"`,
        'Cache-Control': 'private, max-age=60',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('[Sendcloud] label proxy error:', err);
    return json(500, { error: err.message || 'Erreur récupération étiquette' });
  }
};
