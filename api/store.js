// api/store.js — Koition HR 데이터 저장 API (Vercel Serverless Function)
// ★ v-safe: 앱(v153)과 호환 + 조회(GET) 시 직원·평가자에게 급여·재무 제거.
//   안정성 최우선 설계:
//     - 저장(PUT)은 절대 막지 않음 (admin 저장 실패 방지)
//     - 필터링·역할확인·crypto를 모두 try-catch로 감싸 어떤 에러가 나도 500이 안 나고 정상 데이터 반환
//     - crypto 실패 시엔 "필터링만 적용 못함"이 아니라 "안전하게 전체 차단"(보수적)
//   Upstash REST 환경변수: KV_REST_API_URL/TOKEN 또는 UPSTASH_REDIS_REST_URL/TOKEN 자동 인식.

import crypto from 'crypto';   // ★ ESM에서 require('crypto')는 실패한다 — 실패 시 토큰 검증이 통째로 꺼졌었음

const APP_KEY = process.env.APP_KEY || 'koition-hr-2026-key';

function getRedisEnv() {
  const rawUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const baseUrl = rawUrl && rawUrl.startsWith('http') ? rawUrl : (rawUrl ? `https://${rawUrl}` : null);
  return { baseUrl, token };
}

async function redisGetRaw(baseUrl, token, key) {
  const r = await fetch(`${baseUrl}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` } });
  return r.json();
}

// 요청자 역할 확인. 실패·불명이면 null → 호출부에서 '민감정보 제거'(보수적)로 처리.
// 반환: { role, verified, user }  — verified=true 는 토큰이 실제로 일치했다는 뜻.
//   읽기(GET)는 verified 를 요구하고, 쓰기(PUT)는 기존처럼 관대하게 둔다(관리자 저장 실패 = 데이터 유실).
async function resolveRole(req, baseUrl, token) {
  // 알려진 관리자·대표 계정 (users 조회 실패·형식 문제와 무관하게 최소한의 admin 인식 보장)
  const KNOWN_ADMINS = { 'cys': 'admin', 'K-140403': 'admin', 'K-140401': 'manager', 'K-140402': 'manager' };
  try {
    const uname = String(req.headers['x-user'] || '');
    const tk = String(req.headers['x-token'] || '');
    if (!uname) return { role: null, verified: false, user: null };
    let users = [];
    try {
      const ud = await redisGetRaw(baseUrl, token, 'users');
      if (ud && ud.result != null) {
        let parsed = JSON.parse(ud.result);
        if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.list)) parsed = parsed.list;
        if (Array.isArray(parsed)) users = parsed;
      }
    } catch (e) { users = []; }
    const u = users.find(x => x && String(x.username).trim() === uname.trim());
    if (u && u.passwordHash && crypto && tk) {
      const expect = crypto.createHash('sha256').update(u.passwordHash + ':' + APP_KEY).digest('hex');
      if (tk === expect) return { role: u.role || 'employee', verified: true, user: u };
    }
    // 토큰 불일치/users 조회 실패 등 — users에 admin/manager로 있으면 인정
    if (u && (u.role === 'admin' || u.role === 'manager')) return { role: u.role, verified: false, user: u };
    // 최후: 알려진 관리자 username이면 인정 (데이터 유실 방지 최우선)
    if (KNOWN_ADMINS[uname.trim()]) return { role: KNOWN_ADMINS[uname.trim()], verified: false, user: u || null };
    return { role: u ? (u.role || 'employee') : null, verified: false, user: u || null };
  } catch (e) {
    // 예외 상황에서도 알려진 관리자는 인정
    try { const un = String(req.headers['x-user'] || '').trim(); if (KNOWN_ADMINS[un]) return { role: KNOWN_ADMINS[un], verified: false, user: null }; } catch (e2) {}
    return { role: null, verified: false, user: null };
  }
}

// 민감 필드 제거 (직원·평가자용). 어떤 입력에도 절대 throw 안 함.
function stripSensitive(valStr) {
  try {
    if (valStr == null) return valStr;
    const d = typeof valStr === 'string' ? JSON.parse(valStr) : valStr;
    if (!d || typeof d !== 'object') return valStr;
    if (Array.isArray(d.employees)) {
      d.employees = d.employees.map(e => { if (!e) return e; const { baseSalary, allowance, mealCar, ...rest } = e; return rest; });
    }
    if (Array.isArray(d.projects)) {
      d.projects = d.projects.map(p => { if (!p) return p; const { revenue, laborCost, workerLabor, mgrLabor, overhead, otherCost, planCost, monthly, ...rest } = p; return rest; });
    }
    delete d.fin; delete d.cashCfg; delete d.loans; delete d.receivables;
    delete d.overheads; delete d.empLedger; delete d.scores; delete d.history;
    if (d.policy && typeof d.policy === 'object') {
      const pol = { ...d.policy };
      delete pol.grades; delete pol.diag; delete pol.promotion; delete pol.targets; delete pol.allocation;
      d.policy = pol;
    }
    return JSON.stringify(d);
  } catch (e) { return null; }   // 필터 실패 시 null → 호출부에서 안전 처리(원본 절대 반환 안 함)
}

// 평가자(부서장)용: 급여·재무만 제거하고 평가 데이터(scores·selfScores·comments·등급기준)는 유지.
function stripForEvaluator(valStr) {
  try {
    if (valStr == null) return valStr;
    const d = typeof valStr === 'string' ? JSON.parse(valStr) : valStr;
    if (!d || typeof d !== 'object') return valStr;
    if (Array.isArray(d.employees)) {
      d.employees = d.employees.map(e => { if (!e) return e; const { baseSalary, allowance, mealCar, qualif, ...rest } = e; return rest; });
    }
    if (Array.isArray(d.projects)) {
      d.projects = d.projects.map(p => { if (!p) return p; const { revenue, laborCost, workerLabor, mgrLabor, overhead, otherCost, planCost, monthly, ...rest } = p; return rest; });
    }
    // 재무 관련만 제거. scores·selfScores·comments·submissions·peerEvals·policy.grades 는 유지(평가결과 조회용).
    delete d.fin; delete d.cashCfg; delete d.loans; delete d.receivables; delete d.overheads; delete d.empLedger;
    return JSON.stringify(d);
  } catch (e) { return null; }
}

// 자기평가류를 '항목별'로 병합한다. 통째로 교체하면 다른 직원이 먼저 저장한 입력이 사라진다.
//   employee/evaluator 는 자기 항목만 쓸 수 있게 제한해 남의 점수를 덮어쓰지 못하게 한다.
function mergeByKey(baseObj, incObj, onlyKey) {
  const base = baseObj && typeof baseObj === 'object' ? baseObj : {};
  if (!incObj || typeof incObj !== 'object') return base;
  const out = { ...base };
  Object.keys(incObj).forEach(k => {
    if (onlyKey && k !== onlyKey) return;   // 남의 항목은 무시
    out[k] = incObj[k];
  });
  return out;
}

export default async function handler(req, res) {
  const { baseUrl, token } = getRedisEnv();
  if (!baseUrl || !token) return res.status(500).json({ error: 'Missing Redis environment variables' });

  try {
    if (req.method === 'GET') {
      const key = String(req.query.key || 'main');
      const data = await redisGetRaw(baseUrl, token, key);
      if (data && data.error) return res.status(500).json({ error: data.error });
      const val = data ? (data.result ?? null) : null;

      if (key === 'main' && val != null) {
        // 역할 확인 (실패해도 throw 안 됨)
        let rr = { role: null, verified: false };
        try { rr = await resolveRole(req, baseUrl, token); } catch (e) { rr = { role: null, verified: false }; }
        const role = rr && rr.role;
        // ★ 읽기 권한은 토큰이 실제로 일치할 때만 준다. 헤더에 x-user 만 넣어도 전체 재무가 내려가던 문제 차단.
        if ((role === 'admin' || role === 'manager') && rr.verified) {
          return res.status(200).json({ value: val });   // 관리자·대표: 전체
        }
        if (role === 'evaluator' && rr.verified) {
          // 평가자(부서장): 평가 데이터(scores·selfScores·comments·등급기준)는 유지, 급여·재무만 제거
          let ev = null;
          try { ev = stripForEvaluator(val); } catch (e) { ev = null; }
          if (ev == null) { try { ev = stripSensitive(val); } catch (e2) { ev = JSON.stringify({ _restricted: true }); } }
          return res.status(200).json({ value: ev, filtered: 'evaluator' });
        }
        // 직원·미인증: 민감정보 제거본(급여·재무·평가점수 모두 제거).
        let filtered = null;
        try { filtered = stripSensitive(val); } catch (e) { filtered = null; }
        if (filtered == null) filtered = JSON.stringify({ _restricted: true });
        return res.status(200).json({ value: filtered, filtered: true });
      }
      return res.status(200).json({ value: val });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      // 저장. main 키는 권한별 보호: 직원·평가자·미인증의 저장은 재무·급여 원본을 덮어쓰지 못하게
      //   서버의 기존 main에 '평가 관련 경량 필드'만 병합한다. (관리자 전체 저장만 원본 갱신)
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      const key = String((body && body.key) || 'main');
      const value = body && body.value != null ? body.value : '';
      let payload = typeof value === 'string' ? value : JSON.stringify(value);

      if (key === 'main') {
        let rr = { role: null, verified: false, user: null };
        try { rr = await resolveRole(req, baseUrl, token); } catch (e) { rr = { role: null, verified: false, user: null }; }
        const role = rr && rr.role;
        const meKey = rr && rr.user ? String(rr.user.empId || rr.user.username || '').trim() : '';
        // 관리자 앱의 '전체 저장'인지 판별. 토큰 검증(role)이 우선이나, 비밀번호 변경 직후 등
        //   토큰이 일시적으로 어긋나도 admin 데이터가 유실되지 않도록 페이로드 구조로도 판별한다.
        //   - 직원 앱은 재무·평가원본(fin/scores/cashCfg/empLedger)을 절대 안 보냄
        //   - 직원 앱은 projects에 revenue 등 재무필드가 없음(서버가 필터링해서 내려줬으므로)
        let hasHeavy = false, looksFull = false;
        try {
          const pv = typeof value === 'string' ? JSON.parse(value) : value;
          if (pv && typeof pv === 'object') {
            hasHeavy = !!(pv.fin || pv.scores || pv.cashCfg || pv.empLedger || pv.loans || pv.receivables);
            // '전체 구조' 감지: projects에 revenue(재무필드)가 살아있으면 관리자 데이터 (직원본엔 제거돼 있음)
            const projHasFin = Array.isArray(pv.projects) && pv.projects.some(p => p && (p.revenue != null || p.workerLabor != null || p.mgrLabor != null));
            const empHasSalary = Array.isArray(pv.employees) && pv.employees.some(e => e && (e.baseSalary != null || e.allowance != null));
            looksFull = projHasFin || empHasSalary;
          }
        } catch (e) { hasHeavy = false; }
        const isAdmin = role === 'admin' || role === 'manager' || hasHeavy || looksFull;
        // ★ 관리자 저장이라도, 매출·재무·급여가 통째로 빈 '필터본'이면 서버 원본을 덮지 않는다.
        //   (필터본을 받은 관리자 세션의 자동저장이 원본을 훼손하는 것을 서버에서도 차단 — 이중 방어)
        if (isAdmin) {
          let incoming = {};
          try { incoming = typeof value === 'string' ? JSON.parse(value) : (value || {}); } catch (e) { incoming = {}; }
          const inHasProjects = Array.isArray(incoming.projects) && incoming.projects.length > 0;
          const inRevenue = inHasProjects && incoming.projects.some(p => p && Number(p.revenue) > 0);
          const inFin = incoming.fin && typeof incoming.fin === 'object' && Object.keys(incoming.fin).length > 0;
          const inSalary = Array.isArray(incoming.employees) && incoming.employees.some(e => e && Number(e.baseSalary) > 0);
          if (inHasProjects && !inRevenue && !inFin && !inSalary) {
            // 들어온 게 필터본. 서버 원본이 더 온전하면(매출·재무 보유) 평가 필드만 병합.
            try {
              const curRaw = await redisGetRaw(baseUrl, token, 'main');
              const base = curRaw && curRaw.result != null ? JSON.parse(curRaw.result) : null;
              const baseRevenue = base && Array.isArray(base.projects) && base.projects.some(p => p && Number(p.revenue) > 0);
              const baseFin = base && base.fin && Object.keys(base.fin).length > 0;
              if (base && (baseRevenue || baseFin)) {
                const merged = {
                  ...base,
                  selfScores: mergeByKey(base.selfScores, incoming.selfScores, null),
                  comments: mergeByKey(base.comments, incoming.comments, null),
                  submissions: mergeByKey(base.submissions, incoming.submissions, null),
                  peerEvals: mergeByKey(base.peerEvals, incoming.peerEvals, null),
                  updatedAt: new Date().toISOString(),
                };
                payload = JSON.stringify(merged);
                const r0 = await fetch(`${baseUrl}/set/${encodeURIComponent(key)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: payload });
                const d0 = await r0.json().catch(() => ({}));
                return res.status(200).json({ ok: true, guarded: true, result: d0 && d0.result });
              }
            } catch (e) { /* 원본 읽기 실패 시 아래 기본 저장으로 진행 */ }
          }
        }
        if (!isAdmin) {
          // 직원·평가자·미인증: 서버 원본을 읽어 평가 필드만 병합 (재무·급여·프로젝트 원본 보존)
          try {
            const curRaw = await redisGetRaw(baseUrl, token, 'main');
            const base = curRaw && curRaw.result != null ? JSON.parse(curRaw.result) : {};
            let inc = {};
            try { inc = typeof value === 'string' ? JSON.parse(value) : (value || {}); } catch (e) { inc = {}; }
            const only = (role === 'admin' || role === 'manager') ? null : (meKey || null);
            const merged = {
              ...base,
              selfScores: mergeByKey(base.selfScores, inc.selfScores, only),
              comments: mergeByKey(base.comments, inc.comments, only),
              submissions: mergeByKey(base.submissions, inc.submissions, only),
              peerEvals: mergeByKey(base.peerEvals, inc.peerEvals, null),
              updatedAt: new Date().toISOString(),
            };
            payload = JSON.stringify(merged);
          } catch (e) {
            return res.status(200).json({ ok: true, skipped: true });
          }
        }
      }

      const r = await fetch(`${baseUrl}/set/${encodeURIComponent(key)}`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: payload,
      });
      const data = await r.json();
      if (data && data.error) return res.status(500).json({ error: data.error });
      return res.status(200).json({ ok: true, result: data ? data.result : null });
    }

    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
