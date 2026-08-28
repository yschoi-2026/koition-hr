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
    // 재무 관련만 제거. scores·scoresBy·selfScores·comments·submissions·peerEvals·policy.grades 는 유지(평가결과 조회용).
    delete d.fin; delete d.cashCfg; delete d.loans; delete d.receivables; delete d.overheads; delete d.empLedger;
    return JSON.stringify(d);
  } catch (e) { return null; }
}

// 자기평가류를 '항목별'로 병합한다. 통째로 교체하면 다른 직원이 먼저 저장한 입력이 사라진다.
//   employee/evaluator 는 자기 항목만 쓸 수 있게 제한해 남의 점수를 덮어쓰지 못하게 한다.
function mergeByKey(baseObj, incObj, onlyKey) {
  const base = baseObj && typeof baseObj === 'object' ? baseObj : {};
  if (!incObj || typeof incObj !== 'object') return base;
  // ★ 빈 객체({})는 '지워라'가 아니라 '보낼 게 없다'로 본다.
  //   구버전 앱이 scores:{} 를 보내 기존 평가 점수를 통째로 날린 사례가 있었다.
  //   삭제는 관리자 화면의 명시적 삭제 기능으로만 이뤄져야 한다.
  if (Object.keys(incObj).length === 0) return base;
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
      // ── 백업 목록 조회 (admin 전용) : GET ?backups=1 ──
      if (String(req.query.backups || '') === '1') {
        const rr = await resolveRole(req, baseUrl, token).catch(() => ({ role: null, verified: false }));
        if (!rr || !rr.verified || rr.role !== 'admin') return res.status(403).json({ error: 'admin only' });
        const out = [];
        for (let i = 0; i < 10; i++) {
          try {
            const m = await redisGetRaw(baseUrl, token, 'main:bakmeta:' + i);
            if (m && m.result != null) { const o = JSON.parse(m.result); out.push({ slot: i, ...o }); }
          } catch (e) { /* skip */ }
        }
        out.sort((a, b) => String(b.at).localeCompare(String(a.at)));
        return res.status(200).json({ ok: true, backups: out });
      }
      // ── 백업 복구 (admin 전용) : GET ?restore=슬롯번호 ──
      if (req.query.restore != null && String(req.query.restore) !== '') {
        const rr = await resolveRole(req, baseUrl, token).catch(() => ({ role: null, verified: false }));
        if (!rr || !rr.verified || rr.role !== 'admin') return res.status(403).json({ error: 'admin only' });
        const slot = Number(req.query.restore);
        if (!(slot >= 0 && slot < 10)) return res.status(400).json({ error: 'invalid slot' });
        const b = await redisGetRaw(baseUrl, token, 'main:bak:' + slot);
        if (!b || b.result == null) return res.status(404).json({ error: 'backup not found' });
        // 복구 전 현재 상태도 백업에 남긴다 (복구를 되돌릴 수 있게)
        try {
          const cur = await redisGetRaw(baseUrl, token, 'main');
          if (cur && cur.result != null) {
            const iRaw = await redisGetRaw(baseUrl, token, 'main:bak:idx');
            const i2 = (iRaw && iRaw.result != null ? Number(iRaw.result) : 0) || 0;
            const sl2 = i2 % 10;
            await fetch(`${baseUrl}/set/${encodeURIComponent('main:bak:' + sl2)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: String(cur.result) });
            await fetch(`${baseUrl}/set/${encodeURIComponent('main:bakmeta:' + sl2)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ at: new Date().toISOString(), by: 'restore-prev', size: String(cur.result).length }) });
            await fetch(`${baseUrl}/set/${encodeURIComponent('main:bak:idx')}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: String(i2 + 1) });
          }
        } catch (e) { /* ignore */ }
        await fetch(`${baseUrl}/set/${encodeURIComponent('main')}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: String(b.result) });
        return res.status(200).json({ ok: true, restored: slot });
      }
      const data = await redisGetRaw(baseUrl, token, key);
      if (data && data.error) return res.status(500).json({ error: data.error });
      const val = data ? (data.result ?? null) : null;

      if (key === 'main' && val != null) {
        // 역할 확인 (실패해도 throw 안 됨)
        let rr = { role: null, verified: false };
        try { rr = await resolveRole(req, baseUrl, token); } catch (e) { rr = { role: null, verified: false }; }
        const role = rr && rr.role;
        // ★ 재무 열람 = admin(경영지원) + 대표이사 2인(manager) 만.
        //   토큰 검증(verified)이 실패해도 users 에 admin/manager 로 등록된 계정이면 전체를 준다.
        //   이유: 비밀번호 변경이 서버에 늦게 반영되면 verified 가 false 가 되어
        //         관리자에게도 필터본이 내려가고, 그 필터본이 저장돼 원본을 덮는 사고로 이어졌다.
        //   x-user 만 넣은 위조는 users 에 실제 등록돼 있어야 하므로 여전히 막힌다
        //   (KNOWN_ADMINS 폴백만으로는 전체를 주지 않는다 → rr.user 존재를 요구).
        //   토큰 헤더 자체가 없으면 전체를 주지 않는다(URL 직접 접근·위조 차단).
        //   토큰이 있고 users 에 admin/manager 로 등록된 계정이면, 해시가 어긋나도 전체를 준다
        //   (비밀번호 변경이 서버에 늦게 반영된 과도기에 필터본이 원본을 덮는 사고 방지).
        const hasTokenHeader = !!String(req.headers['x-token'] || '');
        const FIN_VIEW = hasTokenHeader && (role === 'admin' || role === 'manager')
          && (rr.verified || !!(rr.user && (rr.user.role === 'admin' || rr.user.role === 'manager')));
        if (FIN_VIEW) {
          return res.status(200).json({ value: val, finView: true });   // 경영지원·대표이사: 전체
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
      let rrUser = String((req.headers && (req.headers['x-user'] || req.headers['X-User'])) || 'unknown');
      let basePrev = null;      // 앞 단계에서 읽은 main 원본 재사용 (중복 GET 방지)
      let bakSkip = false;      // 이미 병합 경로에서 저장한 경우 백업 생략

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
          const pv = JSON.parse(payload);
          if (pv && typeof pv === 'object') {
            hasHeavy = !!(pv.fin || pv.scores || pv.cashCfg || pv.empLedger || pv.loans || pv.receivables);
            // '전체 구조' 감지: projects에 revenue(재무필드)가 살아있으면 관리자 데이터 (직원본엔 제거돼 있음)
            const projHasFin = Array.isArray(pv.projects) && pv.projects.some(p => p && (p.revenue != null || p.workerLabor != null || p.mgrLabor != null));
            const empHasSalary = Array.isArray(pv.employees) && pv.employees.some(e => e && (e.baseSalary != null || e.allowance != null));
            looksFull = projHasFin || empHasSalary;
          }
        } catch (e) { hasHeavy = false; }
        // ★ 재무·급여 '편집'은 admin(경영지원)만. 대표이사(manager)는 열람 전용.
        //   manager 가 보낸 저장에서 fin·baseSalary 가 서버와 다르면 서버 원본을 유지한다.
        if (role === 'manager') {
          try {
            const im = JSON.parse(payload);
            const cm = await redisGetRaw(baseUrl, token, 'main');
            const bm = cm && cm.result != null ? JSON.parse(cm.result) : null;
            if (bm) {
              im.fin = bm.fin;                                     // 재무는 항상 서버 값 유지
              if (Array.isArray(im.employees) && Array.isArray(bm.employees)) {
                const map = new Map(bm.employees.map(e => [e.id, e]));
                im.employees = im.employees.map(e => {
                  const b = map.get(e && e.id);
                  if (!b) return e;
                  return { ...e, baseSalary: b.baseSalary, allowance: b.allowance, mealCar: b.mealCar, qualif: b.qualif };
                });
              }
              payload = JSON.stringify(im);
            }
          } catch (e) { /* 실패 시 원래 흐름 */ }
        }
        const isAdmin = role === 'admin' || role === 'manager' || hasHeavy || looksFull;
        // ★ 관리자 전체저장이라도 평가 데이터(scores/scoresBy/selfScores/comments/submissions)가
        //   비어 있으면 서버 원본을 지우지 않는다. 평가 기간에는 다른 세션이 계속 입력 중이므로
        //   빈 값으로 덮이면 그 입력이 통째로 사라진다(이종민 사례).
        if (isAdmin) {
          try {
            const inc2 = JSON.parse(payload);   // ★ value(원본)가 아니라 payload(직전 가드 결과)를 이어받는다
            const cur2 = await redisGetRaw(baseUrl, token, 'main'); basePrev = cur2;
            const base2 = cur2 && cur2.result != null ? JSON.parse(cur2.result) : null;
            if (base2 && inc2 && typeof inc2 === 'object') {
              let touched = false;
              ['scores', 'scoresBy', 'selfScores', 'comments', 'submissions', 'peerEvals'].forEach(k => {
                const bv = base2[k], iv = inc2[k];
                const bn = bv && typeof bv === 'object' ? Object.keys(bv).length : 0;
                const inN = iv && typeof iv === 'object' ? Object.keys(iv).length : 0;
                if (bn > 0 && inN === 0) { inc2[k] = bv; touched = true; }      // 빈 값이면 원본 유지
                else if (bn > 0 && inN > 0) { inc2[k] = mergeByKey(bv, iv, null); touched = true; }  // 키 단위 병합
              });
              if (touched) payload = JSON.stringify(inc2);   // value 는 const 이므로 payload 만 갱신
            }
          } catch (e) { /* 실패 시 원래 흐름 유지 */ }
        }
        // ★ 관리자 저장이라도, 매출·재무·급여가 통째로 빈 '필터본'이면 서버 원본을 덮지 않는다.
        //   (필터본을 받은 관리자 세션의 자동저장이 원본을 훼손하는 것을 서버에서도 차단 — 이중 방어)
        if (isAdmin) {
          let incoming = {};
          try { incoming = JSON.parse(payload); } catch (e) { incoming = {}; }
          const inHasProjects = Array.isArray(incoming.projects) && incoming.projects.length > 0;
          const inRevenue = inHasProjects && incoming.projects.some(p => p && Number(p.revenue) > 0);
          const inFin = incoming.fin && typeof incoming.fin === 'object' && Object.keys(incoming.fin).length > 0;
          const inSalary = Array.isArray(incoming.employees) && incoming.employees.some(e => e && Number(e.baseSalary) > 0);
          if (inHasProjects && !inRevenue && !inFin && !inSalary) {
            // 들어온 게 필터본. 서버 원본이 더 온전하면(매출·재무 보유) 평가 필드만 병합.
            try {
              const curRaw = await redisGetRaw(baseUrl, token, 'main'); basePrev = curRaw;
              const base = curRaw && curRaw.result != null ? JSON.parse(curRaw.result) : null;
              const baseRevenue = base && Array.isArray(base.projects) && base.projects.some(p => p && Number(p.revenue) > 0);
              const baseFin = base && base.fin && Object.keys(base.fin).length > 0;
              if (base && (baseRevenue || baseFin)) {
                const merged = {
                  ...base,
                  selfScores: mergeByKey(base.selfScores, incoming.selfScores, null),
                  // ★ scoresBy[평가자][대상자] — 공동 평가에서 평가자끼리 서로 덮어쓰지 않게 평가자 키 단위로 병합
                  scoresBy: mergeByKey(base.scoresBy, incoming.scoresBy, null),
                  comments: mergeByKey(base.comments, incoming.comments, null),
                  submissions: mergeByKey(base.submissions, incoming.submissions, null),
                  peerEvals: mergeByKey(base.peerEvals, incoming.peerEvals, null),
                  updatedAt: new Date().toISOString(),
                };
                payload = JSON.stringify(merged);
                const r0 = await fetch(`${baseUrl}/set/${encodeURIComponent(key)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: payload });
                const d0 = await r0.json().catch(() => ({}));
                bakSkip = true;
                return res.status(200).json({ ok: true, guarded: true, result: d0 && d0.result });
              }
            } catch (e) { /* 원본 읽기 실패 시 아래 기본 저장으로 진행 */ }
          }
        }
        if (!isAdmin) {
          // 직원·평가자·미인증: 서버 원본을 읽어 평가 필드만 병합 (재무·급여·프로젝트 원본 보존)
          try {
            const curRaw = await redisGetRaw(baseUrl, token, 'main'); basePrev = curRaw;
            const base = curRaw && curRaw.result != null ? JSON.parse(curRaw.result) : {};
            let inc = {};
            try { inc = JSON.parse(payload); } catch (e) { inc = {}; }
            const only = (role === 'admin' || role === 'manager') ? null : (meKey || null);
            const merged = {
              ...base,
              selfScores: mergeByKey(base.selfScores, inc.selfScores, only),
              // ★ 평가자는 자기 사번 키(scoresBy[내사번])만 쓸 수 있다. 남의 평가를 지우거나 위조할 수 없다.
              scoresBy: mergeByKey(base.scoresBy, inc.scoresBy, (role === 'admin' || role === 'manager') ? null : (meKey || null)),
              // ★ scores(확정 점수)도 대상자 키 단위로 병합한다.
              //   v217 이전 앱은 평가자도 scores 에 직접 저장했다. 병합 대상에서 빠져 있으면
              //   그 기록이 남아 있어도 다른 세션의 저장에 밀려 사라질 수 있다.
              scores: mergeByKey(base.scores, inc.scores, null),
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

      // ══════════════════════════════════════════════════════════════
      //  저장 직전 자동 백업 (main 키 한정)
      //   덮어쓰기 전 상태를 main:bak:0~9 에 남긴다(10세대 순환).
      //   평가 시즌처럼 여러 명이 동시에 입력하는 상황에서 사고가 나면
      //   되돌릴 수단이 없었다(2026.08 평가 점수 유실 사례).
      //   ?restore=N 으로 복구, ?backups=1 로 목록 조회.
      // ══════════════════════════════════════════════════════════════
      // ══════════════════════════════════════════════════════════════
      //  ★ 필터본 저장 차단 (평가기간 데이터 보호 최우선)
      //   필터본(급여·재무가 제거된 데이터)이 서버 원본을 덮으면 되돌릴 수 없다.
      //   앱에도 같은 가드가 있지만, 서버에서도 한 번 더 막는다.
      // ══════════════════════════════════════════════════════════════
      if (key === 'main') {
        try {
          const inc3 = JSON.parse(payload);
          const cur3 = await redisGetRaw(baseUrl, token, 'main');
          const base3 = cur3 && cur3.result != null ? JSON.parse(cur3.result) : null;
          if (base3) {
            const hasFin = o => !!(o && o.fin && typeof o.fin === 'object' && Object.keys(o.fin).length > 0);
            const hasBal = o => !!(o && o.fin && o.fin.actualBalances && Object.keys(o.fin.actualBalances).length > 0);
            const hasSal = o => Array.isArray(o && o.employees) && o.employees.some(e => e && Number(e.baseSalary) > 0);
            const lostFin = hasFin(base3) && !hasFin(inc3);
            const lostBal = hasBal(base3) && !hasBal(inc3);
            const lostSal = hasSal(base3) && !hasSal(inc3);
            if (lostFin || lostBal || lostSal) {
              // 재무·급여가 사라진 저장 → 그 부분만 서버 원본으로 되살려 덮어쓰기를 막는다
              if (lostFin || lostBal) inc3.fin = base3.fin;
              if (lostSal && Array.isArray(inc3.employees) && Array.isArray(base3.employees)) {
                const bm = new Map(base3.employees.map(e => [e.id, e]));
                inc3.employees = inc3.employees.map(e => {
                  const b = bm.get(e && e.id);
                  if (!b) return e;
                  return { ...e, baseSalary: b.baseSalary, allowance: b.allowance, mealCar: b.mealCar, qualif: b.qualif };
                });
              }
              payload = JSON.stringify(inc3);
            }
          }
        } catch (e) { /* 판단 실패 시 원래 흐름 유지 */ }
      }
      // ★ 백업은 Redis 호출을 늘리므로(무료 플랜 한도) 최소 간격을 둔다.
      //   매 저장마다 백업하면 PUT 1회당 커맨드가 3~4 → 8~9 로 늘어 한도 초과가 난다.
      //   BAK_MIN_GAP_MS(기본 10분) 이내면 건너뛴다. 직전 상태는 이미 이전 백업에 있다.
      const BAK_MIN_GAP_MS = 3 * 60 * 1000;   // 3분 (평가 시즌 기준: 하루 최대 480회 백업 = 커맨드 여유 충분)
      if (key === 'main' && !bakSkip) {
        try {
          const lastRaw = await redisGetRaw(baseUrl, token, 'main:bak:last');
          const lastAt = lastRaw && lastRaw.result != null ? Number(lastRaw.result) || 0 : 0;
          if (Date.now() - lastAt < BAK_MIN_GAP_MS) throw new Error('skip-backup');
          const prev = basePrev !== null ? basePrev : (await redisGetRaw(baseUrl, token, 'main'));
          const prevStr = prev && prev.result != null ? String(prev.result) : '';
          if (prevStr && prevStr !== payload) {
            const idxRaw = await redisGetRaw(baseUrl, token, 'main:bak:idx');
            const idx = idxRaw && idxRaw.result != null ? (Number(idxRaw.result) || 0) : 0;
            const slot = idx % 10;
            let sum = {};
            try {
              const o = JSON.parse(prevStr);
              const cnt = (v) => (v && typeof v === 'object') ? Object.keys(v).length : 0;
              let byCnt = 0;
              if (o.scoresBy && typeof o.scoresBy === 'object') Object.keys(o.scoresBy).forEach(k => { byCnt += cnt(o.scoresBy[k]); });
              sum = { scores: cnt(o.scores), scoresBy: cnt(o.scoresBy), scoresByItems: byCnt,
                      selfScores: cnt(o.selfScores), submissions: cnt(o.submissions), comments: cnt(o.comments),
                      projects: Array.isArray(o.projects) ? o.projects.length : 0 };
            } catch (e) { sum = {}; }
            const meta = JSON.stringify({ at: new Date().toISOString(), by: (rrUser || 'unknown'), size: prevStr.length, summary: sum });
            await fetch(`${baseUrl}/set/${encodeURIComponent('main:bak:' + slot)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: prevStr });
            await fetch(`${baseUrl}/set/${encodeURIComponent('main:bakmeta:' + slot)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: meta });
            await fetch(`${baseUrl}/set/${encodeURIComponent('main:bak:idx')}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: String(idx + 1) });
            await fetch(`${baseUrl}/set/${encodeURIComponent('main:bak:last')}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: String(Date.now()) });
          }
        } catch (e) { /* 백업 실패·건너뜀이 저장을 막지 않도록 무시 */ }
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
