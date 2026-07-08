// ============================================================
// KOITION HR 서버 저장 API (진단 기능 포함)
// 위치: 저장소 루트의  api/store.js
// ============================================================
export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // 진단 모드: /api/store?diag=1  → 어떤 환경변수가 잡히는지 확인 (값은 노출 안 함)
  if (req.query && req.query.diag) {
    const keys = Object.keys(process.env).filter(k =>
      /KV_|UPSTASH|REDIS|APP_KEY/.test(k)
    );
    return res.status(200).json({
      envKeysFound: keys,
      hasUrl: !!url,
      hasToken: !!token,
      urlHost: url ? String(url).replace(/^https?:\/\//, '').split('.')[0] + '...' : null,
    });
  }

  const APP_KEY = process.env.APP_KEY || '';
  if (APP_KEY && req.headers['x-app-key'] !== APP_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  if (!url || !token) return res.status(500).json({ error: 'storage not configured' });

  const rawKey = (req.method === 'GET' ? req.query.key : (req.body && req.body.key)) || 'main';
  const k = 'koition:' + String(rawKey).replace(/[^\w:-]/g, '');

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${url}/get/${encodeURIComponent(k)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await r.json();
      return res.status(200).json({ key: rawKey, value: j.result == null ? null : j.result });
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const value = req.body ? req.body.value : null;
      const body = typeof value === 'string' ? value : JSON.stringify(value);
      const r = await fetch(`${url}/set/${encodeURIComponent(k)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },
        body,
      });
      const j = await r.json();
      return res.status(200).json({ ok: j.result === 'OK' });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message) });
  }
}
