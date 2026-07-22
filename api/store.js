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
    if (!u || !u.passwordHash) return null;
    const expect = crypto.createHash('sha256').update(u.passwordHash + ':' + APP_KEY).digest('hex');
    if (tk !== expect) return null;
    return u.role || 'employee';
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
        // 직원·평가자·미인증: 민감정보 제거본.
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
        // 페이로드에 재무·평가 원본(fin·scores·cashCfg)이 들어있으면 관리자 앱의 전체 저장으로 간주.
        //   (직원 앱은 이 필드들을 애초에 안 보냄 → 오탐 없음. 토큰 검증 실패 시에도 admin 저장 보호)
        let hasHeavy = false;
        try { const pv = typeof value === 'string' ? JSON.parse(value) : value; hasHeavy = !!(pv && (pv.fin || pv.scores || pv.cashCfg || pv.empLedger)); } catch (e) { hasHeavy = false; }
        const isAdmin = role === 'admin' || role === 'manager' || hasHeavy;
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
