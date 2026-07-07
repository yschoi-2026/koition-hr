// ============================================================
// KOITION HR 서버 저장 API
// 설치 위치: GitHub 저장소의  api/store.js  (repo 루트의 api 폴더)
// 저장소: Vercel Marketplace의 Upstash Redis (무료) 연결 필요
// ============================================================
export default async function handler(req, res) {
  // 앱 키 검증 (임의 외부 접근 차단)
  const APP_KEY = process.env.APP_KEY || '';
  if (APP_KEY && req.headers['x-app-key'] !== APP_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Upstash Redis 연결 정보 (Vercel 연동 시 자동 생성되는 환경변수)
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
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
