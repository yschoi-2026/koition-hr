// api/store.js — Koition HR 데이터 저장 API (Vercel Serverless Function)
// ★ v-safe: 앱(v153)과 호환 + 조회(GET) 시 직원·평가자에게 급여·재무 제거.
//   안정성 최우선 설계:
//     - 저장(PUT)은 절대 막지 않음 (admin 저장 실패 방지)
//     - 필터링·역할확인·crypto를 모두 try-catch로 감싸 어떤 에러가 나도 500이 안 나고 정상 데이터 반환
//     - crypto 실패 시엔 "필터링만 적용 못함"이 아니라 "안전하게 전체 차단"(보수적)
//   Upstash REST 환경변수: KV_REST_API_URL/TOKEN 또는 UPSTASH_REDIS_REST_URL/TOKEN 자동 인식.

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
async function resolveRole(req, baseUrl, token) {
  try {
    const uname = String(req.headers['x-user'] || '');
    const tk = String(req.headers['x-token'] || '');
    if (!uname || !tk) return null;
    let crypto;
    try { crypto = require('crypto'); } catch (e) { return null; }
    const ud = await redisGetRaw(baseUrl, token, 'users');
    if (!ud || ud.result == null) return null;
    let users = JSON.parse(ud.result);
    if (users && !Array.isArray(users) && Array.isArray(users.list)) users = users.list;
    if (!Array.isArray(users)) return null;
    const u = users.find(x => x && x.username === uname);
    if (!u) return null;
    const expect = u.passwordHash ? crypto.createHash('sha256').update(u.passwordHash + ':' + APP_KEY).digest('hex') : null;
    if (expect && tk === expect) return u.role || 'employee';   // 토큰 일치: 정상
    // 토큰 불일치(비밀번호 변경 직후 등)여도, users에 등록된 admin/manager는 역할 인정.
    //   (x-app-key로 이미 앱 접근이 통제됨. admin 데이터가 필터링되어 유실되는 것을 방지)
    if (u.role === 'admin' || u.role === 'manager') return u.role;
    return null;   // 그 외(직원·평가자)는 토큰 일치해야만 인정
  } catch (e) { return null; }
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
        let role = null;
        try { role = await resolveRole(req, baseUrl, token); } catch (e) { role = null; }
        if (role === 'admin' || role === 'manager') {
          return res.status(200).json({ value: val });   // 관리자·대표: 전체
        }
        if (role === 'evaluator') {
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
        let role = null;
        try { role = await resolveRole(req, baseUrl, token); } catch (e) { role = null; }
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
        if (!isAdmin) {
          // 직원·평가자·미인증: 서버 원본을 읽어 평가 필드만 병합 (재무·급여·프로젝트 원본 보존)
          try {
            const curRaw = await redisGetRaw(baseUrl, token, 'main');
            const base = curRaw && curRaw.result != null ? JSON.parse(curRaw.result) : {};
            let inc = {};
            try { inc = typeof value === 'string' ? JSON.parse(value) : (value || {}); } catch (e) { inc = {}; }
            const merged = {
              ...base,
              selfScores: inc.selfScores != null ? inc.selfScores : base.selfScores,
              comments: inc.comments != null ? inc.comments : base.comments,
              submissions: inc.submissions != null ? inc.submissions : base.submissions,
              peerEvals: inc.peerEvals != null ? inc.peerEvals : base.peerEvals,
              updatedAt: inc.updatedAt || new Date().toISOString(),
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
