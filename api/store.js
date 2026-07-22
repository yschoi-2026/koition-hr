// api/store.js — Koition HR 데이터 저장 API (Vercel Serverless Function)
// ★ 안정 복구 버전: 인증·필터링 없이 저장/조회만 (500 에러 해결 우선).
//    검증된 단순 구조 — Upstash Redis REST 환경변수 자동 인식.

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const APP_KEY = process.env.APP_KEY || 'koition-hr-2026-key';

export default async function handler(req, res) {
  if (req.headers['x-app-key'] !== APP_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  if (!REST_URL || !REST_TOKEN) {
    return res.status(500).json({ error: 'redis env not configured' });
  }

  try {
    if (req.method === 'GET') {
      const key = String(req.query.key || '');
      if (!key) return res.status(400).json({ error: 'key required' });
      const r = await fetch(`${REST_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${REST_TOKEN}` },
      });
      const j = await r.json();
      return res.status(200).json({ value: j.result ?? null });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'key required' });
      const r = await fetch(`${REST_URL}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${REST_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(typeof value === 'string' ? value : JSON.stringify(value)),
      });
      const j = await r.json();
      if (j.error) return res.status(500).json({ error: j.error });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
