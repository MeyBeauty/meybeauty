const SENDCLOUD_API_BASE = 'https://panel.sendcloud.sc';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publicKey = process.env.SENDCLOUD_PUBLIC_KEY;
  const secretKey = process.env.SENDCLOUD_SECRET_KEY;
  const parcelId = req.query?.parcelId;
  const paperSize = req.query?.paperSize || 'A4';
  const download = req.query?.download === '1';

  if (!publicKey || !secretKey) {
    return res.status(503).json({ error: 'Sendcloud non configuré — clés API manquantes' });
  }
  if (!parcelId) {
    return res.status(400).json({ error: 'parcelId requis' });
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
      return res.status(response.status).json({ error: detail, raw: data });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.status(200)
      .setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf')
      .setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="sendcloud-label-${parcelId}.pdf"`)
      .setHeader('Cache-Control', 'private, max-age=60')
      .send(buffer);
  } catch (err) {
    console.error('[Sendcloud] label proxy error:', err);
    return res.status(500).json({ error: err.message || 'Erreur récupération étiquette' });
  }
}
