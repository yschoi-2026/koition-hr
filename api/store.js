// api/store.js — Koition HR 데이터 저장 API (Vercel Serverless Function)
// GitHub 저장소의 api/store.js 를 이 내용으로 교체하세요.
// ★ v3: 조회(GET) 시에만 권한 필터링 — 직원·평가자에게 급여·재무 정보를 내려보내지 않음.
//        저장(PUT)은 기존처럼 허용(막지 않음) → admin 저장 실패 위험 제거.
//        crypto는 Node 내장 require 방식으로 안전하게 사용.
// Upstash Redis REST 환경변수(UPSTASH_REDIS_REST_URL/TOKEN 또는 KV_REST_API_URL/TOKEN) 자동 인식.

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const APP_KEY = process.env.APP_KEY || 'koition-hr-2026-key';

let _crypto = null;
try { _crypto = require('crypto'); } catch (e) { _crypto = null; }

async function redisGet(key) {
  const r = await fetch(`${REST_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REST_TOKEN}` },
  });
  const j = await r.json();
  return j.result ?? null;
}
async function redisSet(key, value) {
  const r = await fetch(`${REST_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(typeof value === 'string' ? value : JSON.stringify(value)),
  });
  return r.json();
}

async function loadUsers() {
  try {
    const raw = await redisGet('users');
    if (raw == null) return [];
    let o = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(o)) return o;
    if (o && Array.isArray(o.list)) return o.list;
    return [];
  } catch (e) { return []; }
}

// 요청자 역할 확인 (조회 필터링용). 검증 실패·불명이면 '직원'으로 간주(보수적 = 더 안전).
async function resolveRole(req) {
  try {
    const uname = String(req.headers['x-user'] || '');
    const token = String(req.headers['x-token'] || '');
    if (!uname || !token || !_crypto) return null;
    const users = await loadUsers();
    const u = users.find(x => x.username === uname);
    if (!u || !u.passwordHash) return null;
    const expect = _crypto.createHash('sha256').update(u.passwordHash + ':' + APP_KEY).digest('hex');
    if (token !== expect) return null;
    return u.role || 'employee';
  } catch (e) { return null; }
}

// 민감 필드 제거 (직원·평가자용)
function stripSensitive(mainStr) {
  let d;
  try { d = typeof mainStr === 'string' ? JSON.parse(mainStr) : mainStr; } catch (e) { return mainStr; }
  if (!d || typeof d !== 'object') return mainStr;
  if (Array.isArray(d.employees)) {
    d.employees = d.employees.map(e => { const { baseSalary, allowance, mealCar, ...rest } = e || {}; return rest; });
  }
  if (Array.isArray(d.projects)) {
    d.projects = d.projects.map(p => { const { revenue, laborCost, workerLabor, mgrLabor, overhead, otherCost, planCost, monthly, ...rest } = p || {}; return rest; });
  }
  delete d.fin; delete d.cashCfg; delete d.loans; delete d.receivables;
  delete d.overheads; delete d.empLedger; delete d.scores; delete d.history;
  if (d.policy && typeof d.policy === 'object') {
    const pol = { ...d.policy };
    delete pol.grades; delete pol.diag; delete pol.promotion; delete pol.targets; delete pol.allocation;
    d.policy = pol;
  }
  return JSON.stringify(d);
}

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
      const val = await redisGet(key);
      if (key === 'main' && val != null) {
        const role = await resolveRole(req);
        // admin·manager만 전체. 그 외(직원·평가자·미인증)는 민감정보 제거본.
        if (role === 'admin' || role === 'manager') {
          return res.status(200).json({ value: val });
        }
        return res.status(200).json({ value: stripSensitive(val), filtered: true });
      }
      return res.status(200).json({ value: val ?? null });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      // 저장은 막지 않음 (admin 저장 실패 방지). 앱단에서 직원은 경량 필드만 저장하도록 이미 처리됨.
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'key required' });
      const j = await redisSet(key, value);
      if (j.error) return res.status(500).json({ error: j.error });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
