// api/store.js — 단순 버전 (필터링 없음, 저장·조회만). 데이터 정상 확인용 임시.
const REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const rawUrl = REST_URL;
  const token = REST_TOKEN;
  if (!rawUrl || !token) return res.status(500).json({ error: 'Missing Redis environment variables' });
  const baseUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  try {
    if (req.method === 'GET') {
      const key = String(req.query.key || 'main');
      const r = await fetch(`${baseUrl}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await r.json();
      if (data && data.error) return res.status(500).json({ error: data.error });
      return res.status(200).json({ value: data.result ?? null });
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      const key = String((body && body.key) || 'main');
      const value = body && body.value != null ? body.value : '';
      const payload = typeof value === 'string' ? value : JSON.stringify(value);
      const r = await fetch(`${baseUrl}/set/${encodeURIComponent(key)}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: payload,
      });
      const data = await r.json();
      if (data && data.error) return res.status(500).json({ error: data.error });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
