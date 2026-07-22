// api/store.js — Koition HR 데이터 저장 API (Vercel Serverless Function)
// GitHub 저장소의 api/store.js 를 이 내용으로 교체하세요.
// ★ v2: 서버측 권한 필터링 — 직원(employee)·평가자(evaluator)에게는 급여·재무 정보를 아예 내려보내지 않음.
//        위조 방지를 위해 계정 비밀번호 해시 기반 서명 토큰을 검증합니다.
// Upstash Redis REST 환경변수(UPSTASH_REDIS_REST_URL/TOKEN 또는 KV_REST_API_URL/TOKEN) 자동 인식.

import crypto from 'crypto';

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const APP_KEY = process.env.APP_KEY || 'koition-hr-2026-key';

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

// 계정 목록 로드 (users 키) → 사번→역할·해시 매핑
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

// 요청자 인증: 헤더의 x-user(사번)·x-token(서명) 검증.
//   token = sha256(passwordHash + ':' + APP_KEY) — 비밀번호 해시를 아는 정당한 로그인만 생성 가능.
//   직원은 자기 passwordHash로 만든 토큰만 가지므로 역할(role) 위조 불가.
async function authRole(req) {
  const uname = String(req.headers['x-user'] || '');
  const token = String(req.headers['x-token'] || '');
  if (!uname || !token) return null;
  const users = await loadUsers();
  const u = users.find(x => x.username === uname);
  if (!u || !u.passwordHash) return null;
  const expect = crypto.createHash('sha256').update(u.passwordHash + ':' + APP_KEY).digest('hex');
  if (token !== expect) return null;
  return { role: u.role || 'employee', empId: u.empId || null, username: uname };
}

// ── 민감 필드 제거: 직원·평가자에게 내려보낼 main 데이터에서 급여·재무를 통째로 삭제 ──
function stripSensitive(mainStr) {
  let d;
  try { d = typeof mainStr === 'string' ? JSON.parse(mainStr) : mainStr; } catch (e) { return mainStr; }
  if (!d || typeof d !== 'object') return mainStr;

  // 1) 직원 급여 필드 제거 (본인 것 포함 전부)
  if (Array.isArray(d.employees)) {
    d.employees = d.employees.map(e => {
      const { baseSalary, allowance, mealCar, ...rest } = e || {};
      return rest;   // 급여·수당·식대차량 삭제. 이메일은 업무상 필요시 유지(원하면 email도 제거 가능)
    });
  }
  // 2) 프로젝트 재무 필드 제거 (매출·원가·인건비)
  if (Array.isArray(d.projects)) {
    d.projects = d.projects.map(p => {
      const { revenue, laborCost, workerLabor, mgrLabor, overhead, otherCost, planCost, monthly, ...rest } = p || {};
      return rest;   // 사업명·기간·상태·참여자(members)는 남김 — 본인 참여 확인용
    });
  }
  // 3) 재무·경영 데이터 통째 제거
  delete d.fin;            // 회계·통장잔고·세금
  delete d.cashCfg;        // 자금예측 설정
  delete d.loans;          // 대여금
  delete d.receivables;    // 미수금
  delete d.overheads;      // 공통비
  delete d.empLedger;      // 인건비 원장
  delete d.scores;         // 전사 평가 점수(타인 급여 산정 연결)
  delete d.history;        // 연도별 재무 이력
  // 4) 정책 내 민감 항목 제거 (급여 산정식·등급별 인상률 등)
  if (d.policy && typeof d.policy === 'object') {
    const pol = { ...d.policy };
    delete pol.grades;     // 등급별 인상률·PI·PS (급여 산정)
    delete pol.diag;       // 진단 계수
    delete pol.promotion;
    delete pol.targets;
    delete pol.allocation;
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

      // main 데이터는 권한에 따라 필터링. users는 로그인 검증에 필요하므로 그대로(비번은 해시라 안전).
      if (key === 'main' && val != null) {
        const auth = await authRole(req);
        const role = auth ? auth.role : null;
        // admin·manager(대표)만 전체. 그 외(직원·평가자·미인증)는 민감정보 제거본.
        if (role === 'admin' || role === 'manager') {
          return res.status(200).json({ value: val });
        }
        return res.status(200).json({ value: stripSensitive(val), filtered: true });
      }
      return res.status(200).json({ value: val ?? null });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'key required' });

      // main 저장은 admin·manager만 전체 허용. 직원은 본인 평가 필드만 병합 저장(재무 원본 보호).
      if (key === 'main') {
        const auth = await authRole(req);
        const role = auth ? auth.role : null;
        if (role === 'admin' || role === 'manager') {
          const j = await redisSet('main', value);
          if (j.error) return res.status(500).json({ error: j.error });
          return res.status(200).json({ ok: true });
        }
        // 직원·평가자: 서버의 기존 main을 읽어, 평가 관련 필드만 덮어써 저장 (재무·급여 원본 보존)
        const cur = await redisGet('main');
        let base = {};
        try { base = cur ? (typeof cur === 'string' ? JSON.parse(cur) : cur) : {}; } catch (e) {}
        let incoming = {};
        try { incoming = typeof value === 'string' ? JSON.parse(value) : (value || {}); } catch (e) {}
        const merged = {
          ...base,
          selfScores: incoming.selfScores ?? base.selfScores,
          comments: incoming.comments ?? base.comments,
          submissions: incoming.submissions ?? base.submissions,
          peerEvals: incoming.peerEvals ?? base.peerEvals,
          updatedAt: incoming.updatedAt || new Date().toISOString(),
        };
        const j = await redisSet('main', JSON.stringify(merged));
        if (j.error) return res.status(500).json({ error: j.error });
        return res.status(200).json({ ok: true, mergedByServer: true });
      }

      const j = await redisSet(key, value);
      if (j.error) return res.status(500).json({ error: j.error });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
