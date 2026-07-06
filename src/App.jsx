import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Users, Settings, FileText, BarChart3, Save, Download, Upload, Search, AlertCircle, Award, Wallet, Trash2, Printer, History, PieChart as PieIcon, LogIn, LogOut, Sparkles, Mail, UserCheck, CheckCircle2, ChevronRight, TrendingUp, Building2, Plus, Pencil, X, StickyNote, ChevronDown, Calendar, Briefcase, MessageSquare, Clock, Tag, Calculator, FileSpreadsheet, TrendingDown, Target, Activity, AlertTriangle, ShieldAlert, Layers, Percent, ArrowUpRight, ArrowDownRight, FileBarChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area, LabelList } from 'recharts';

// ============================================================
// 디자인 토큰 시스템
// ============================================================
const T = {
  // 코이션 로고 기반 컬러 팔레트
  brand: '#1B3A6F',          // 메인 딥 블루 (로고 K 색)
  brandLight: '#2E5BA0',     // 보조 블루 (로고 그라데이션 밝은 부분)
  brandDark: '#0F2547',      // 진한 네이비 (헤더 배경용)
  accent: '#D63838',         // 레드 액센트 (로고 우상단 점)
  accentSoft: '#F4D4D4',     // 연한 레드 (배경용)
  
  // 중성 컬러
  ink: '#1A1A1A',            // 본문 텍스트
  text: '#2C3540',           // 일반 텍스트
  textMute: '#6B7280',       // 보조 텍스트
  textLight: '#9CA3AF',      // 비활성 텍스트
  
  // 배경 & 보더
  bg: '#F8F9FB',             // 페이지 배경
  surface: '#FFFFFF',        // 카드 배경
  surfaceAlt: '#F1F3F7',     // 보조 배경
  border: '#E5E7EB',         // 일반 보더
  borderStrong: '#CBD2DB',   // 강조 보더
  divider: '#F0F2F5',        // 구분선
  
  // 등급 컬러
  S: '#1B7F4F',  // 진한 그린
  A: '#4A9D6E',  // 그린
  B: '#1B3A6F',  // 브랜드 블루
  C: '#D97706',  // 앰버
  D: '#B91C1C',  // 레드
  
  // 직무군 컬러 (Archive·Tech·Biz·PM 4종)
  groupArchive: '#4A9D6E',  // Archive - 그린 (기록·보존의 안정감)
  groupTech: '#1556C9',     // Tech - 코발트 블루 (기술의 첨단성)
  groupBiz: '#D63838',      // Biz - 레드 액센트 (영업의 적극성)
  groupPM: '#7C3AED',       // PM - 퍼플 (사업 수행의 통합성)
  
  // 의미 컬러
  success: '#1B7F4F',
  warning: '#D97706',
  danger: '#B91C1C',
  info: '#1B3A6F',
  
  // Shadow
  shadow1: '0 1px 2px rgba(15, 37, 71, 0.04)',
  shadow2: '0 2px 8px rgba(15, 37, 71, 0.06)',
  shadow3: '0 4px 16px rgba(15, 37, 71, 0.08)',
  shadowHeader: '0 1px 0 rgba(15, 37, 71, 0.06)',
};

// 사이드바 너비 상수 - 헤더 로고 영역과 통일
const SIDEBAR_W = 240;

// Spacing scale (8px grid)
const S = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 48, 10: 64 };

// Typography
const FONT = '"Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif';
const FONT_DISPLAY = '"Cormorant Garamond", "Georgia", serif';

// ============================================================
// 코이션 로고 (SVG 인라인 - 외부 파일 불필요)
// ============================================================
function KoitionLogo({ size = 28, showText = true, variant = 'dark' }) {
  // 4분할 K 심볼 + KOITION 텍스트
  // dark variant: 밝은 배경용 (헤더, 시스템 내부)
  // light variant: 어두운 배경용 (로그인 화면) - K 심볼은 컬러풀 유지, 텍스트만 흰색
  const textColor = variant === 'dark' ? T.brand : '#FFFFFF';
  const subTextColor = variant === 'dark' ? T.textMute : 'rgba(255,255,255,0.7)';
  const uid = `${variant}-${Math.random().toString(36).slice(2, 8)}`;
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {/* 4분할 K 심볼 - 두 variant 모두 컬러풀 유지 */}
      <svg width={size} height={size * (90/70)} viewBox="0 0 70 90" xmlns="http://www.w3.org/2000/svg" 
        style={{ flexShrink: 0, display: 'block' }}>
        <defs>
          {/* 좌측 큰 K 기둥 그라데이션 - 4단계 */}
          <linearGradient id={`kMain-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            {variant === 'dark' ? (
              <>
                <stop offset="0%" stopColor="#1B3A8F" />
                <stop offset="35%" stopColor="#1556C9" />
                <stop offset="70%" stopColor="#0B2C7A" />
                <stop offset="100%" stopColor="#0A1F5C" />
              </>
            ) : (
              // light variant - 어두운 배경에서 잘 보이도록 살짝 밝게 조정
              <>
                <stop offset="0%" stopColor="#3D6BD6" />
                <stop offset="35%" stopColor="#2E6FD8" />
                <stop offset="70%" stopColor="#1B4FA8" />
                <stop offset="100%" stopColor="#143D85" />
              </>
            )}
          </linearGradient>
          {/* 우측 중단 파란 사각형 그라데이션 */}
          <linearGradient id={`kMid-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {variant === 'dark' ? (
              <>
                <stop offset="0%" stopColor="#1E70E0" />
                <stop offset="100%" stopColor="#0B4FBF" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#3F8FF5" />
                <stop offset="100%" stopColor="#1E70E0" />
              </>
            )}
          </linearGradient>
          {/* 우측 하단 진남 사각형 그라데이션 */}
          <linearGradient id={`kBot-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {variant === 'dark' ? (
              <>
                <stop offset="0%" stopColor="#0E2D7A" />
                <stop offset="100%" stopColor="#091F5A" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#1F4DAE" />
                <stop offset="100%" stopColor="#13348A" />
              </>
            )}
          </linearGradient>
        </defs>
        
        {/* 1. 좌측 큰 K 기둥 (둥근 모서리, 세로로 긴 형태) */}
        <path 
          d="M 4,12 Q 4,4 12,4 L 20,4 Q 28,4 28,12 L 28,82 Q 28,90 20,90 L 12,90 Q 4,90 4,82 Z" 
          fill={`url(#kMain-${uid})`}
        />
        
        {/* 2. 우측 상단 빨간 사각형 (우상단 모서리만 둥글게) - 코이션 레드 (두 variant 모두 유지) */}
        <path 
          d="M 42,4 L 58,4 Q 66,4 66,12 L 66,22 L 42,22 Z" 
          fill={variant === 'dark' ? '#E60012' : '#FF2538'}
        />
        
        {/* 3. 우측 중단 파란 사각형 (직사각형) */}
        <rect 
          x="36" y="32" width="22" height="20" rx="2" 
          fill={`url(#kMid-${uid})`}
        />
        
        {/* 4. 우측 하단 진남 사각형 (좌하·우하 둥글게) */}
        <path 
          d="M 36,60 L 58,60 Q 66,60 66,68 L 66,82 Q 66,90 58,90 L 44,90 Q 36,90 36,82 Z" 
          fill={`url(#kBot-${uid})`}
        />
      </svg>
      
      {/* KOITION 텍스트 */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
          <div style={{ 
            fontSize: 15, fontWeight: 800, color: textColor, 
            letterSpacing: '0.08em', fontFamily: FONT
          }}>
            KOITION
          </div>
          <div style={{ 
            fontSize: 8, fontWeight: 600, color: subTextColor, 
            letterSpacing: '0.22em', marginTop: 2, fontFamily: FONT
          }}>
            HR · ARCHIVE
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// K Watermark · 메인 콘텐츠 영역 배경 워터마크
// 헤더 K 로고와 통일된 4분할 디자인
// pointer-events: none으로 상호작용 방해 없음
// ============================================================
function KWatermark() {
  return (
    <div 
      aria-hidden="true"
      style={{ 
        position: 'absolute',
        right: -100,
        bottom: -120,
        width: 560,
        height: 720,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.06,
        transform: 'rotate(-8deg)',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      <svg viewBox="0 0 70 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="kWmMain" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1B3A8F" />
            <stop offset="35%" stopColor="#1556C9" />
            <stop offset="70%" stopColor="#0B2C7A" />
            <stop offset="100%" stopColor="#0A1F5C" />
          </linearGradient>
          <linearGradient id="kWmMid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E70E0" />
            <stop offset="100%" stopColor="#0B4FBF" />
          </linearGradient>
          <linearGradient id="kWmBot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E2D7A" />
            <stop offset="100%" stopColor="#091F5A" />
          </linearGradient>
        </defs>
        
        {/* 1. 좌측 큰 K 기둥 */}
        <path 
          d="M 4,12 Q 4,4 12,4 L 20,4 Q 28,4 28,12 L 28,82 Q 28,90 20,90 L 12,90 Q 4,90 4,82 Z" 
          fill="url(#kWmMain)"
        />
        
        {/* 2. 우측 상단 빨간 사각형 */}
        <path 
          d="M 42,4 L 58,4 Q 66,4 66,12 L 66,22 L 42,22 Z" 
          fill="#E60012"
        />
        
        {/* 3. 우측 중단 파란 사각형 */}
        <rect x="36" y="32" width="22" height="20" rx="2" fill="url(#kWmMid)" />
        
        {/* 4. 우측 하단 진남 사각형 */}
        <path 
          d="M 36,60 L 58,60 Q 66,60 66,68 L 66,82 Q 66,90 58,90 L 44,90 Q 36,90 36,82 Z" 
          fill="url(#kWmBot)"
        />
      </svg>
    </div>
  );
}

// ============================================================
// HR Illustration · 팀 협업 SVG 일러스트 (Undraw 스타일, 톤다운)
// ============================================================
function HRIllustration() {
  // 톤다운 컬러 팔레트 (채도 낮춤)
  const C_skin = '#E8C9A8';        // 피부 톤 (덜 노란색)
  const C_skinD = '#C9A485';       // 피부 음영
  const C_hair1 = '#5C4A3A';       // 갈색 머리
  const C_hair2 = '#3D3530';       // 진한 갈색
  const C_hair3 = '#6B5840';       // 밝은 갈색
  const C_navy = '#3D5A80';        // 톤다운 네이비 (셔츠/바지)
  const C_navyD = '#2E4060';       // 더 진한 네이비
  const C_red = '#A85D5D';         // 톤다운 레드 (자켓)
  const C_redD = '#874A4A';        // 진한 레드
  const C_beige = '#D4C5A9';       // 베이지 (셔츠)
  const C_beigeD = '#B5A78B';      // 진한 베이지
  const C_teal = '#5B7F8A';        // 톤다운 청록
  const C_off = '#E8E4DC';         // 오프화이트
  const C_line = 'rgba(255,255,255,0.5)';
  
  return (
    <svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" 
      style={{ width: '100%', maxWidth: 420, height: 'auto', display: 'block' }}>
      
      {/* 배경 부드러운 원형 */}
      <circle cx="210" cy="130" r="110" fill="rgba(255,255,255,0.03)" />
      <circle cx="210" cy="130" r="80" fill="rgba(255,255,255,0.025)" />
      
      {/* 바닥선 */}
      <line x1="20" y1="200" x2="400" y2="200" stroke={C_line} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
      
      {/* ============ 가운데 큰 화이트보드/스크린 ============ */}
      <g transform="translate(160, 50)">
        {/* 보드 */}
        <rect x="0" y="0" width="100" height="70" rx="3" fill={C_off} />
        <rect x="0" y="0" width="100" height="10" rx="3" fill={C_beigeD} />
        
        {/* 차트 - 막대그래프 */}
        <rect x="12" y="42" width="9" height="18" fill={C_teal} rx="1" opacity="0.85" />
        <rect x="24" y="32" width="9" height="28" fill={C_navy} rx="1" opacity="0.85" />
        <rect x="36" y="22" width="9" height="38" fill={C_red} rx="1" opacity="0.85" />
        <rect x="48" y="28" width="9" height="32" fill={C_navy} rx="1" opacity="0.85" />
        <rect x="60" y="36" width="9" height="24" fill={C_teal} rx="1" opacity="0.85" />
        
        {/* 헤더 텍스트 라인 */}
        <rect x="8" y="3" width="30" height="2" rx="1" fill="#fff" opacity="0.6" />
        <rect x="42" y="3" width="20" height="2" rx="1" fill="#fff" opacity="0.4" />
        
        {/* 차트 베이스라인 */}
        <line x1="10" y1="62" x2="78" y2="62" stroke={C_beigeD} strokeWidth="0.5" />
        
        {/* 보드 받침대 */}
        <rect x="48" y="70" width="4" height="20" fill={C_beigeD} />
        <ellipse cx="50" cy="92" rx="14" ry="2" fill={C_beigeD} opacity="0.7" />
      </g>
      
      {/* ============ 인물 1 - 좌측: 차트 가리키는 여성 (빨간 자켓) ============ */}
      <g transform="translate(95, 95)">
        {/* 다리 */}
        <rect x="14" y="80" width="9" height="30" fill={C_navy} />
        <rect x="25" y="80" width="9" height="30" fill={C_navy} />
        {/* 신발 */}
        <ellipse cx="18" cy="112" rx="7" ry="2.5" fill={C_navyD} />
        <ellipse cx="30" cy="112" rx="7" ry="2.5" fill={C_navyD} />
        
        {/* 몸통 - 빨간 자켓 */}
        <path d="M 8,38 Q 8,28 18,26 L 30,26 Q 40,28 40,38 L 40,82 L 8,82 Z" fill={C_red} />
        {/* 자켓 안쪽 셔츠 */}
        <path d="M 20,26 L 24,40 L 28,26 Z" fill={C_off} />
        {/* 자켓 단추 */}
        <circle cx="24" cy="45" r="1" fill={C_redD} />
        <circle cx="24" cy="55" r="1" fill={C_redD} />
        
        {/* 왼팔 */}
        <path d="M 8,42 Q 0,55 4,72 L 11,72 L 11,42 Z" fill={C_red} />
        <ellipse cx="7" cy="74" rx="4" ry="3.5" fill={C_skin} />
        
        {/* 오른팔 - 차트 가리키기 (확장) */}
        <path d="M 40,42 Q 55,38 70,20 L 64,15 L 36,40 Z" fill={C_red} />
        <ellipse cx="72" cy="17" rx="4" ry="4" fill={C_skin} />
        
        {/* 머리 */}
        <circle cx="24" cy="14" r="13" fill={C_skin} />
        {/* 단발 머리 */}
        <path d="M 11,10 Q 12,0 24,-1 Q 37,0 38,10 L 36,14 Q 34,4 24,4 Q 14,4 12,14 Z" fill={C_hair2} />
        {/* 귀 */}
        <ellipse cx="11" cy="14" rx="1.5" ry="2" fill={C_skinD} />
        <ellipse cx="37" cy="14" rx="1.5" ry="2" fill={C_skinD} />
        {/* 눈 */}
        <ellipse cx="20" cy="15" rx="1" ry="1.2" fill="#2C2416" />
        <ellipse cx="28" cy="15" rx="1" ry="1.2" fill="#2C2416" />
        {/* 입 */}
        <path d="M 22,20 Q 24,21.5 26,20" stroke="#5C4A3A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </g>
      
      {/* ============ 인물 2 - 좌측 끝: 노트북 든 남성 ============ */}
      <g transform="translate(30, 110)">
        {/* 다리 */}
        <rect x="12" y="70" width="8" height="22" fill={C_navyD} />
        <rect x="22" y="70" width="8" height="22" fill={C_navyD} />
        <ellipse cx="16" cy="94" rx="6" ry="2" fill="#1F2A3A" />
        <ellipse cx="26" cy="94" rx="6" ry="2" fill="#1F2A3A" />
        
        {/* 몸통 - 셔츠 (베이지) */}
        <path d="M 8,32 Q 8,22 17,20 L 25,20 Q 34,22 34,32 L 34,72 L 8,72 Z" fill={C_beige} />
        {/* 셔츠 카라 */}
        <path d="M 17,20 L 21,30 L 25,20 Z" fill={C_navy} />
        
        {/* 왼팔 - 노트북 받침 */}
        <path d="M 8,36 Q -2,48 2,60 L 14,55 L 14,36 Z" fill={C_beige} />
        <ellipse cx="6" cy="60" rx="3.5" ry="3" fill={C_skin} />
        
        {/* 오른팔 */}
        <path d="M 34,36 Q 42,48 38,60 L 28,55 L 28,36 Z" fill={C_beige} />
        <ellipse cx="36" cy="60" rx="3.5" ry="3" fill={C_skin} />
        
        {/* 노트북 */}
        <rect x="2" y="48" width="36" height="18" rx="1.5" fill={C_navyD} />
        <rect x="4" y="50" width="32" height="14" fill={C_teal} opacity="0.7" />
        <rect x="0" y="65" width="40" height="3" rx="1" fill="#1F2A3A" />
        
        {/* 머리 */}
        <circle cx="21" cy="10" r="11" fill={C_skin} />
        {/* 짧은 머리 */}
        <path d="M 10,7 Q 11,-2 21,-3 Q 32,-2 33,7 L 31,10 Q 28,2 21,2 Q 13,2 11,10 Z" fill={C_hair1} />
        {/* 눈 */}
        <ellipse cx="18" cy="11" rx="0.9" ry="1" fill="#2C2416" />
        <ellipse cx="24" cy="11" rx="0.9" ry="1" fill="#2C2416" />
        {/* 입 */}
        <path d="M 19,15 Q 21,16 23,15" stroke="#5C4A3A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </g>
      
      {/* ============ 인물 3 - 우측: 책상에 앉은 남성 ============ */}
      <g transform="translate(280, 100)">
        {/* 의자 등받이 */}
        <rect x="-2" y="30" width="40" height="60" rx="3" fill="rgba(255,255,255,0.1)" />
        {/* 책상 */}
        <rect x="-30" y="92" width="100" height="5" fill={C_beigeD} />
        <rect x="-22" y="97" width="3" height="25" fill={C_beigeD} opacity="0.7" />
        <rect x="60" y="97" width="3" height="25" fill={C_beigeD} opacity="0.7" />
        
        {/* 노트북 (책상 위) */}
        <rect x="8" y="76" width="34" height="18" rx="1.5" fill={C_navyD} />
        <rect x="11" y="78" width="28" height="14" fill={C_teal} opacity="0.6" />
        <rect x="5" y="92" width="40" height="3" rx="1" fill="#1F2A3A" />
        
        {/* 몸통 (셔츠) */}
        <path d="M 5,55 Q 5,43 16,40 L 24,40 Q 35,43 35,55 L 35,88 L 5,88 Z" fill={C_navy} />
        {/* 셔츠 카라 */}
        <path d="M 16,40 L 20,52 L 24,40 Z" fill={C_off} />
        
        {/* 왼팔 - 키보드 위 */}
        <path d="M 5,58 Q -4,68 0,80 L 10,84 L 14,80 Z" fill={C_navy} />
        <ellipse cx="11" cy="82" rx="4" ry="3" fill={C_skin} />
        
        {/* 오른팔 - 키보드 위 */}
        <path d="M 35,58 Q 44,68 40,80 L 30,84 L 26,80 Z" fill={C_navy} />
        <ellipse cx="29" cy="82" rx="4" ry="3" fill={C_skin} />
        
        {/* 머리 */}
        <circle cx="20" cy="28" r="13" fill={C_skin} />
        {/* 머리 */}
        <path d="M 7,24 Q 8,14 20,13 Q 32,14 33,24 L 31,28 Q 28,18 20,18 Q 12,18 9,28 Z" fill={C_hair3} />
        {/* 안경 */}
        <circle cx="16" cy="29" r="3" fill="none" stroke={C_navyD} strokeWidth="0.8" />
        <circle cx="24" cy="29" r="3" fill="none" stroke={C_navyD} strokeWidth="0.8" />
        <line x1="19" y1="29" x2="21" y2="29" stroke={C_navyD} strokeWidth="0.6" />
        {/* 눈 (안경 안) */}
        <circle cx="16" cy="29" r="0.8" fill="#2C2416" />
        <circle cx="24" cy="29" r="0.8" fill="#2C2416" />
        {/* 입 */}
        <path d="M 18,34 Q 20,35 22,34" stroke="#5C4A3A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </g>
      
      {/* ============ 인물 4 - 우측 끝: 서류 든 여성 ============ */}
      <g transform="translate(355, 115)">
        {/* 다리 - 스커트 아래 */}
        <rect x="10" y="68" width="7" height="20" fill={C_skinD} opacity="0.7" />
        <rect x="20" y="68" width="7" height="20" fill={C_skinD} opacity="0.7" />
        <ellipse cx="13" cy="89" rx="5" ry="2" fill="#1F2A3A" />
        <ellipse cx="23" cy="89" rx="5" ry="2" fill="#1F2A3A" />
        
        {/* 스커트 */}
        <path d="M 6,55 L 31,55 L 33,72 L 4,72 Z" fill={C_navyD} />
        
        {/* 몸통 - 블라우스 */}
        <path d="M 8,30 Q 8,20 17,18 L 22,18 Q 31,20 31,30 L 31,58 L 8,58 Z" fill={C_teal} opacity="0.9" />
        {/* 블라우스 카라 */}
        <path d="M 17,18 L 20,28 L 22,18 Z" fill={C_off} />
        
        {/* 왼팔 - 서류 들고 있음 */}
        <path d="M 8,34 Q -2,42 0,55 L 9,55 L 12,42 Z" fill={C_teal} opacity="0.9" />
        <ellipse cx="3" cy="56" rx="3.5" ry="3" fill={C_skin} />
        
        {/* 오른팔 */}
        <path d="M 31,34 Q 38,42 35,52 L 28,52 L 26,42 Z" fill={C_teal} opacity="0.9" />
        <ellipse cx="32" cy="54" rx="3.5" ry="3" fill={C_skin} />
        
        {/* 서류/클립보드 (왼손) */}
        <rect x="-4" y="48" width="14" height="18" rx="1" fill={C_off} />
        <rect x="-2" y="50" width="10" height="1.5" fill={C_beigeD} />
        <rect x="-2" y="53" width="8" height="1" fill={C_beigeD} opacity="0.7" />
        <rect x="-2" y="56" width="9" height="1" fill={C_beigeD} opacity="0.7" />
        <rect x="-2" y="59" width="7" height="1" fill={C_beigeD} opacity="0.7" />
        
        {/* 머리 */}
        <circle cx="19" cy="8" r="11" fill={C_skin} />
        {/* 긴 머리 */}
        <path d="M 7,5 Q 8,-5 19,-6 Q 31,-5 32,5 L 32,18 Q 30,8 28,8 L 19,8 L 10,8 Q 8,8 6,18 Z" fill={C_hair2} />
        {/* 눈 */}
        <ellipse cx="16" cy="9" rx="0.9" ry="1" fill="#2C2416" />
        <ellipse cx="22" cy="9" rx="0.9" ry="1" fill="#2C2416" />
        {/* 입 */}
        <path d="M 17,13 Q 19,14 21,13" stroke="#5C4A3A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </g>
      
      {/* ============ 떠다니는 장식 요소 (톤다운) ============ */}
      
      {/* 체크 마크 - 평가 완료 (좌상단) */}
      <g transform="translate(50, 50)" opacity="0.7">
        <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.15)" />
        <circle cx="9" cy="9" r="9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <path d="M 5,9 L 8,12 L 14,6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      {/* 별 - S등급 (우상단) */}
      <g transform="translate(360, 45)" opacity="0.7">
        <path d="M 9,0 L 11,6 L 18,7 L 13,11 L 14,18 L 9,14 L 4,18 L 5,11 L 0,7 L 7,6 Z" fill="rgba(255,255,255,0.4)" />
      </g>
      
      {/* 작은 점들 (배경 반짝임) */}
      <circle cx="30" cy="80" r="1.5" fill="rgba(255,255,255,0.2)" />
      <circle cx="400" cy="80" r="1" fill="rgba(255,255,255,0.2)" />
      <circle cx="200" cy="25" r="1" fill="rgba(255,255,255,0.25)" />
      <circle cx="380" cy="180" r="1.2" fill="rgba(255,255,255,0.2)" />
      <circle cx="25" cy="170" r="1" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

// ============================================================
// Brand Identity Visual · AI + 기록관리 정체성 표현
// ============================================================
function BrandIdentityVisual() {
  return (
    <svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" 
      style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block' }}>
      
      {/* 배경 원형 글로우 */}
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(214,56,56,0.12)" />
          <stop offset="100%" stopColor="rgba(214,56,56,0)" />
        </radialGradient>
        <linearGradient id="archiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="140" r="120" fill="url(#bgGlow)" />
      
      {/* ========== 좌측: 아카이브 박스 스택 (기록관리) ========== */}
      <g transform="translate(40, 110)">
        {/* 박스 3개 적층 */}
        {/* 박스 1 (맨 아래) */}
        <g>
          <rect x="0" y="80" width="100" height="40" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <rect x="0" y="80" width="100" height="6" fill="rgba(255,255,255,0.25)" />
          <rect x="10" y="92" width="35" height="3" rx="1" fill="rgba(255,255,255,0.5)" />
          <rect x="10" y="100" width="50" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="106" width="40" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
          {/* 라벨 */}
          <rect x="75" y="92" width="18" height="14" rx="1" fill="#D63838" />
          <text x="84" y="102" fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="monospace">M650</text>
        </g>
        
        {/* 박스 2 (중간, 약간 우측 시프트) */}
        <g transform="translate(8, -22)">
          <rect x="0" y="80" width="100" height="40" rx="2" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <rect x="0" y="80" width="100" height="6" fill="rgba(255,255,255,0.35)" />
          <rect x="10" y="92" width="40" height="3" rx="1" fill="rgba(255,255,255,0.6)" />
          <rect x="10" y="100" width="55" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
          <rect x="10" y="106" width="42" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
          <rect x="75" y="92" width="18" height="14" rx="1" fill="#D63838" />
          <text x="84" y="102" fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="monospace">M650</text>
        </g>
        
        {/* 박스 3 (맨 위) */}
        <g transform="translate(16, -44)">
          <rect x="0" y="80" width="100" height="40" rx="2" fill="url(#archiveGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
          <rect x="0" y="80" width="100" height="6" fill="rgba(27,58,111,0.8)" />
          <rect x="10" y="92" width="38" height="3" rx="1" fill="rgba(27,58,111,0.8)" />
          <rect x="10" y="100" width="52" height="2" rx="1" fill="rgba(27,58,111,0.5)" />
          <rect x="10" y="106" width="44" height="2" rx="1" fill="rgba(27,58,111,0.5)" />
          <rect x="75" y="92" width="18" height="14" rx="1" fill="#D63838" />
          <text x="84" y="102" fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="monospace">M650</text>
        </g>
        
        {/* 박스 라벨 (ARCHIVE) */}
        <text x="50" y="142" fontSize="7" fontWeight="600" fill="rgba(255,255,255,0.7)" textAnchor="middle" letterSpacing="0.3em">
          ARCHIVE
        </text>
      </g>
      
      {/* ========== 우측: AI 뉴럴 네트워크 (인공지능) ========== */}
      <g transform="translate(170, 60)">
        {/* 연결선들 (먼저 그려서 노드 뒤에 위치) */}
        <g stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="none">
          {/* Layer 1 → Layer 2 */}
          <line x1="20" y1="20" x2="60" y2="10" />
          <line x1="20" y1="20" x2="60" y2="40" />
          <line x1="20" y1="20" x2="60" y2="70" />
          <line x1="20" y1="50" x2="60" y2="10" />
          <line x1="20" y1="50" x2="60" y2="40" />
          <line x1="20" y1="50" x2="60" y2="70" />
          <line x1="20" y1="80" x2="60" y2="40" />
          <line x1="20" y1="80" x2="60" y2="70" />
          <line x1="20" y1="80" x2="60" y2="100" />
          <line x1="20" y1="110" x2="60" y2="70" />
          <line x1="20" y1="110" x2="60" y2="100" />
          
          {/* Layer 2 → Layer 3 */}
          <line x1="60" y1="10" x2="100" y2="30" />
          <line x1="60" y1="10" x2="100" y2="60" />
          <line x1="60" y1="40" x2="100" y2="30" />
          <line x1="60" y1="40" x2="100" y2="60" />
          <line x1="60" y1="40" x2="100" y2="90" />
          <line x1="60" y1="70" x2="100" y2="30" />
          <line x1="60" y1="70" x2="100" y2="60" />
          <line x1="60" y1="70" x2="100" y2="90" />
          <line x1="60" y1="100" x2="100" y2="60" />
          <line x1="60" y1="100" x2="100" y2="90" />
        </g>
        
        {/* 활성화된 연결선 (강조) */}
        <g stroke="#D63838" strokeWidth="1.2" fill="none" opacity="0.8">
          <line x1="20" y1="50" x2="60" y2="40" />
          <line x1="60" y1="40" x2="100" y2="60" />
          <line x1="20" y1="80" x2="60" y2="70" />
          <line x1="60" y1="70" x2="100" y2="60" />
        </g>
        
        {/* Layer 1: 입력 노드 (4개) */}
        <g>
          <circle cx="20" cy="20" r="4.5" fill="rgba(255,255,255,0.6)" stroke="#fff" strokeWidth="0.8" />
          <circle cx="20" cy="50" r="4.5" fill="#fff" stroke="#D63838" strokeWidth="1" />
          <circle cx="20" cy="80" r="4.5" fill="#fff" stroke="#D63838" strokeWidth="1" />
          <circle cx="20" cy="110" r="4.5" fill="rgba(255,255,255,0.6)" stroke="#fff" strokeWidth="0.8" />
        </g>
        
        {/* Layer 2: 히든 노드 (4개) */}
        <g>
          <circle cx="60" cy="10" r="4.5" fill="rgba(255,255,255,0.6)" stroke="#fff" strokeWidth="0.8" />
          <circle cx="60" cy="40" r="4.5" fill="#fff" stroke="#D63838" strokeWidth="1" />
          <circle cx="60" cy="70" r="4.5" fill="#fff" stroke="#D63838" strokeWidth="1" />
          <circle cx="60" cy="100" r="4.5" fill="rgba(255,255,255,0.6)" stroke="#fff" strokeWidth="0.8" />
        </g>
        
        {/* Layer 3: 출력 노드 (3개) */}
        <g>
          <circle cx="100" cy="30" r="4.5" fill="rgba(255,255,255,0.6)" stroke="#fff" strokeWidth="0.8" />
          <circle cx="100" cy="60" r="5.5" fill="#D63838" stroke="#fff" strokeWidth="1.2" />
          <circle cx="100" cy="90" r="4.5" fill="rgba(255,255,255,0.6)" stroke="#fff" strokeWidth="0.8" />
        </g>
        
        {/* AI 라벨 */}
        <text x="60" y="140" fontSize="7" fontWeight="600" fill="rgba(255,255,255,0.7)" textAnchor="middle" letterSpacing="0.3em">
          AI · NEURAL NET
        </text>
      </g>
      
      {/* ========== 중앙 연결: 아카이브 ↔ AI 데이터 흐름 ========== */}
      <g stroke="rgba(214,56,56,0.5)" strokeWidth="1" strokeDasharray="3 2" fill="none">
        <path d="M 145,100 Q 165,90 185,100" />
      </g>
      <circle cx="165" cy="92" r="2" fill="#D63838" />
      
      {/* ========== 하단: 데이터 흐름 표시 ========== */}
      <g transform="translate(60, 200)">
        {/* 데이터 막대그래프 미니 */}
        <rect x="0" y="20" width="6" height="20" rx="1" fill="rgba(255,255,255,0.4)" />
        <rect x="10" y="10" width="6" height="30" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="20" y="0" width="6" height="40" rx="1" fill="#D63838" />
        <rect x="30" y="14" width="6" height="26" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="40" y="6" width="6" height="34" rx="1" fill="rgba(255,255,255,0.4)" />
        <line x1="-2" y1="42" x2="50" y2="42" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <text x="24" y="55" fontSize="6.5" fontWeight="600" fill="rgba(255,255,255,0.6)" textAnchor="middle" letterSpacing="0.25em">
          ANALYTICS
        </text>
      </g>
      
      {/* 하단 우측: 문서 아이콘 */}
      <g transform="translate(200, 200)">
        <rect x="0" y="0" width="28" height="36" rx="1.5" fill="rgba(255,255,255,0.9)" />
        <path d="M 20,0 L 28,8 L 20,8 Z" fill="rgba(255,255,255,0.6)" />
        <rect x="4" y="14" width="20" height="1.5" rx="0.5" fill="rgba(27,58,111,0.7)" />
        <rect x="4" y="18" width="16" height="1.5" rx="0.5" fill="rgba(27,58,111,0.5)" />
        <rect x="4" y="22" width="18" height="1.5" rx="0.5" fill="rgba(27,58,111,0.5)" />
        <rect x="4" y="26" width="14" height="1.5" rx="0.5" fill="rgba(27,58,111,0.5)" />
        <rect x="4" y="30" width="20" height="1.5" rx="0.5" fill="rgba(27,58,111,0.5)" />
        
        {/* 별 (S등급) */}
        <g transform="translate(35, 22)">
          <path d="M 6,0 L 7.4,4.3 L 12,4.5 L 8.3,7.2 L 9.6,11.5 L 6,8.8 L 2.4,11.5 L 3.7,7.2 L 0,4.5 L 4.6,4.3 Z" fill="#D63838" />
        </g>
        <text x="14" y="55" fontSize="6.5" fontWeight="600" fill="rgba(255,255,255,0.6)" textAnchor="middle" letterSpacing="0.25em">
          RECORDS
        </text>
      </g>
      
      {/* 떠다니는 작은 점들 */}
      <circle cx="40" cy="40" r="1.5" fill="rgba(214,56,56,0.6)" />
      <circle cx="290" cy="50" r="1.2" fill="rgba(255,255,255,0.4)" />
      <circle cx="280" cy="220" r="1" fill="rgba(214,56,56,0.5)" />
      <circle cx="20" cy="200" r="1.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

// ============================================================
// Koition Visual Trio · 3개 핵심 가치 (텍스트 중심)
// ============================================================
function KoitionVisualTrio() {
  const items = [
    { 
      num: '01', 
      title: 'TARGETING', 
      kr: '목표 적중', 
      desc: '데이터 기반의 정확한 평가'
    },
    { 
      num: '02', 
      title: 'RECORDING', 
      kr: '기록 관리', 
      desc: '체계적인 기록물 보존·관리'
    },
    { 
      num: '03', 
      title: 'TRANSFORMATION', 
      kr: '디지털 전환', 
      desc: '아날로그에서 디지털 자산화'
    },
  ];
  
  return (
    <div style={{ 
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
      width: '100%'
    }}>
      {items.map(item => (
        <div key={item.num} style={{
          padding: '12px 14px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6,
          position: 'relative'
        }}>
          {/* 번호 */}
          <div style={{ 
            fontSize: 9, fontWeight: 700, color: '#D63838', 
            letterSpacing: '0.15em', marginBottom: 6,
            fontFamily: '"SF Mono", Monaco, monospace'
          }}>
            {item.num}
          </div>
          {/* 영문 타이틀 */}
          <div style={{ 
            fontSize: 11, fontWeight: 700, color: '#fff', 
            letterSpacing: '0.15em', marginBottom: 2
          }}>
            {item.title}
          </div>
          {/* 한글 부제 */}
          <div style={{ 
            fontSize: 13, fontWeight: 600, color: '#fff', 
            marginBottom: 4, letterSpacing: '-0.01em'
          }}>
            {item.kr}
          </div>
          {/* 설명 */}
          <div style={{ 
            fontSize: 10, color: 'rgba(255,255,255,0.6)', 
            lineHeight: 1.5
          }}>
            {item.desc}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 표지 이미지 표시 (admin이 URL로 교체 가능)
// ============================================================
function CoverImageDisplay({ coverImage }) {
  const ci = coverImage || { enabled: true, url: '', caption: '' };
  const [imgError, setImgError] = useState(false);
  
  if (!ci.enabled) return null;
  
  const hasImage = ci.url && !imgError;
  
  return (
    <div style={{ 
      width: '100%', maxWidth: 380,
      borderRadius: 10, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.02)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{ 
        width: '100%', aspectRatio: '4 / 3',
        background: hasImage 
          ? 'transparent' 
          : 'linear-gradient(135deg, rgba(214,56,56,0.08) 0%, rgba(46,91,160,0.15) 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {hasImage ? (
          <img 
            src={ci.url} 
            alt={ci.caption || 'Cover'} 
            onError={() => setImgError(true)}
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover', display: 'block'
            }} 
          />
        ) : (
          /* Placeholder - 이미지 URL이 없거나 로드 실패 */
          <div style={{ 
            textAlign: 'center', padding: 24,
            color: 'rgba(255,255,255,0.6)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" 
              style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#fff" strokeWidth="1.2" />
              <circle cx="8.5" cy="8.5" r="1.5" stroke="#fff" strokeWidth="1.2" />
              <path d="M21 15l-5-5L5 21" stroke="#fff" strokeWidth="1.2" />
            </svg>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>
              표지 이미지 미설정
            </div>
            <div style={{ fontSize: 10, opacity: 0.7, lineHeight: 1.5 }}>
              {imgError ? '이미지를 불러올 수 없습니다' : 'admin이 정책 설정에서\n이미지 URL을 등록하면 표시됩니다'}
            </div>
          </div>
        )}
        
        {/* 우상단 라벨 */}
        {ci.caption && hasImage && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            padding: '5px 10px', background: 'rgba(15,37,71,0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: 4, fontSize: 10, fontWeight: 600,
            color: '#fff', letterSpacing: '0.1em'
          }}>
            {ci.caption}
          </div>
        )}
        
        {/* 좌하단 빨간 액센트 라인 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: 60, height: 3, background: '#D63838'
        }} />
      </div>
    </div>
  );
}

// 회사 정보 카드 (로그인 화면 하단)
function CardStat({ label, value, highlight }) {
  return (
    <div style={{ 
      padding: '4px 0',
      borderLeft: highlight ? `2px solid #D63838` : `2px solid rgba(255,255,255,0.15)`,
      paddingLeft: 12
    }}>
      <div style={{ 
        fontSize: 9, color: 'rgba(255,255,255,0.5)', 
        letterSpacing: '0.12em', fontWeight: 500,
        textTransform: 'uppercase', marginBottom: 4
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: 13, color: highlight ? '#fff' : 'rgba(255,255,255,0.9)', 
        fontWeight: highlight ? 700 : 600, letterSpacing: '-0.01em'
      }}>
        {value}
      </div>
    </div>
  );
}

// ============================================================
// 사용자 계정
// ============================================================
// ============================================================
// 사용자 계정 (초기 데이터 - 처음 로드 시 비밀번호 해시 적용)
// ⚠️ 모든 계정은 첫 로그인 후 즉시 비밀번호를 변경하셔야 합니다
// ============================================================
const INITIAL_USERS = [
  { username: 'admin', password: 'gsH$w77p', role: 'admin', name: '인사담당자', empId: null, deptScope: '전체' },
  { username: 'jiy', password: 'S#8pg6zy', role: 'manager', name: '정일영', empId: 'K-140401', deptScope: '전체' },
  { username: 'cjk', password: '4xb#2krK', role: 'manager', name: '최재교', empId: 'K-140402', deptScope: '전체' },
  { username: 'sys', password: 'mU&6z2as', role: 'manager', name: '신수호', empId: 'K-140404', deptScope: '사업관리부' },
  { username: 'ljm', password: 'p8Vun#g8', role: 'manager', name: '이종민', empId: 'K-231001', deptScope: '서비스개발부' },
  { username: 'cys', password: 'uj!5n3Rs', role: 'admin', name: '최영숙', empId: 'K-140403', deptScope: '전체' },
  { username: 'lwk', password: 'z&yvYu56', role: 'evaluator', name: '이원규', empId: 'K-180501', deptScope: '아카이브사업팀' },
  { username: 'sdh', password: '6ca6zaK%', role: 'evaluator', name: '심도현', empId: 'K-170801', deptScope: '데이터큐레이션팀' },
  { username: 'owk', password: 'bgmUk9!3', role: 'employee', name: '오윤경', empId: 'K-220601' },
  { username: 'whw', password: '#rSva2p7', role: 'employee', name: '원동현', empId: 'K-200501' },
  { username: 'chy', password: 'm$vv5t4F', role: 'employee', name: '최하연', empId: 'K-240403' },
  { username: 'jeh', password: '@N6t6ats', role: 'employee', name: '조은희', empId: 'K-240401' },
  { username: 'gyh', password: 'v#Uemf34', role: 'employee', name: '고영훈', empId: 'K-240202' },
  { username: 'onr', password: 'ju5m%H2v', role: 'employee', name: '오누리', empId: 'K-260301' },
  { username: 'ljh', password: '9z$2Wkyt', role: 'employee', name: '임지홍', empId: 'K-260701' },
  { username: 'chj', password: '9fDe%w5c', role: 'employee', name: '최하진', empId: 'K-260702' },
  { username: 'csy', password: '*2jbfj7S', role: 'evaluator', name: '최순용', empId: 'K-250601', deptScope: '사업관리부' },
  { username: 'lhj', password: 'L8qnb&8k', role: 'employee', name: '이흥주', empId: 'K-250602' },
];

// ============================================================
// 비밀번호 보안 유틸
// SHA-256 단방향 해시 + 복잡성 검증
// ============================================================

// SHA-256 해시 (Web Crypto API 사용 - 브라우저 기본 제공)
async function hashPassword(plaintext) {
  if (!plaintext) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 비밀번호 검증 (입력값과 저장된 해시 비교)
async function verifyPassword(plaintext, hash) {
  const computed = await hashPassword(plaintext);
  return computed === hash;
}

// 비밀번호 복잡성 검증
// 반환: { valid: boolean, score: 0~4, errors: string[], warnings: string[] }
function validatePassword(password, username, name) {
  const errors = [];
  const warnings = [];
  let score = 0;
  
  if (!password || password.length < 8) {
    errors.push('최소 8자 이상이어야 합니다');
  } else {
    score++;
  }
  
  // 문자 종류 검증
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(password);
  const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (typeCount >= 3) score++;
  if (typeCount === 4) score++;
  if (password.length >= 12) score++;
  
  if (typeCount < 3) {
    errors.push('영문 대/소문자, 숫자, 특수문자 중 3종류 이상 포함되어야 합니다');
  }
  
  // 흔한 비밀번호 차단
  const weakPasswords = ['12345678', 'password', 'admin1234', 'qwerty', 'abc12345', '11111111', 'koition1', 'koition12'];
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('너무 흔한 비밀번호입니다');
  }
  
  // 사용자 ID/이름과 동일성 검증
  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push('아이디(username)를 비밀번호에 포함할 수 없습니다');
  }
  if (name && password.includes(name)) {
    errors.push('본인 이름을 비밀번호에 포함할 수 없습니다');
  }
  
  // 기본 비밀번호 경고
  if (['1234', 'admin', 'koition', 'password'].includes(password)) {
    errors.push('기본 비밀번호는 사용할 수 없습니다');
  }
  
  // 연속 문자 경고
  if (/(.)\1{3,}/.test(password)) {
    warnings.push('동일 문자가 4번 이상 반복됩니다');
  }
  if (/(?:0123|1234|2345|3456|4567|5678|6789|abcd|qwer)/i.test(password)) {
    warnings.push('연속된 문자/숫자 사용은 피하세요');
  }
  
  return {
    valid: errors.length === 0,
    score: Math.min(score, 4),
    errors,
    warnings,
    typeCount,
    length: password.length,
  };
}

// 비밀번호 강도 라벨
function passwordStrengthLabel(score) {
  return ['약함', '약함', '보통', '강함', '매우 강함'][score] || '약함';
}

// ============================================================
// ECount 인사카드 연동 헬퍼
// ============================================================

// ECount 인사카드 표준 컬럼 (한글 헤더 기준)
const ECOUNT_HR_COLUMNS = [
  { key: 'id',         label: '사원코드',   required: true,  desc: '코이션 사번' },
  { key: 'name',       label: '성명',       required: true,  desc: '직원 이름' },
  { key: 'dept',       label: '부서',       required: false, desc: '소속 부서' },
  { key: 'position',   label: '직위',       required: false, desc: '직급/직위명' },
  { key: 'level',      label: '직무레벨',   required: false, desc: 'L1/L2/L3/L4' },
  { key: 'group',      label: '직무군',     required: false, desc: 'Archive/Tech/Biz/PM' },
  { key: 'hireDate',   label: '입사일',     required: false, desc: 'YYYY/MM/DD' },
  { key: 'baseSalary', label: '기본급',     required: false, desc: '월 기본급(원)' },
  { key: 'allowance',  label: '제수당',     required: false, desc: '월 수당(원)' },
  { key: 'mealCar',    label: '식대차량',   required: false, desc: '식대+차량유지(원)' },
  { key: 'qualif',     label: '자격수당',   required: false, desc: '자격증 수당(원)' },
  { key: 'email',      label: '이메일',     required: false, desc: 'company@koition.com' },
  { key: 'status',     label: '재직상태',   required: false, desc: 'active/leave/advisor/freelance/resigned' },
  { key: 'note',       label: '비고',       required: false, desc: '특이사항' },
];

// CSV 한 셀에 콤마/줄바꿈/따옴표가 있으면 이스케이프
function csvCell(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (/[,\n\r"]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// 직원 배열을 ECount 인사카드 양식 CSV로 변환 (UTF-8 BOM 포함, Excel 한글 안전)
function employeesToEcountCSV(employees) {
  const headers = ECOUNT_HR_COLUMNS.map(c => c.label);
  const rows = employees.map(emp => 
    ECOUNT_HR_COLUMNS.map(c => csvCell(emp[c.key]))
  );
  const csv = [headers, ...rows].map(r => r.join(',')).join('\r\n');
  // UTF-8 BOM 추가 - Excel에서 한글 깨짐 방지
  return '\uFEFF' + csv;
}

// CSV 텍스트를 파싱 (간단한 RFC 4180 파서)
function parseCSV(text) {
  // BOM 제거
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\r') { /* skip */ }
      else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += ch;
    }
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.length > 0 && r.some(c => c.trim() !== ''));
}

// ECount CSV 텍스트를 직원 객체 배열로 변환 (느슨한 컬럼 매칭)
function ecountCSVToEmployees(csvText) {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return { employees: [], errors: ['데이터가 비어있거나 헤더만 있습니다'] };
  
  const headers = rows[0].map(h => h.trim());
  const errors = [];
  
  // 헤더 → 코이션 필드 매핑 (한글/영문 모두 허용)
  const columnMap = {};
  headers.forEach((h, idx) => {
    const col = ECOUNT_HR_COLUMNS.find(c => 
      c.label === h || c.key === h || 
      c.label.replace(/\s/g, '') === h.replace(/\s/g, '')
    );
    if (col) columnMap[idx] = col.key;
  });
  
  // 필수 컬럼 검증
  const mappedKeys = Object.values(columnMap);
  if (!mappedKeys.includes('id')) errors.push('필수 컬럼 "사원코드"(id)를 찾을 수 없습니다');
  if (!mappedKeys.includes('name')) errors.push('필수 컬럼 "성명"(name)을 찾을 수 없습니다');
  
  if (errors.length > 0) return { employees: [], errors, columnMap, headers };
  
  // 데이터 변환
  const employees = [];
  const numericFields = ['baseSalary', 'allowance', 'mealCar', 'qualif'];
  
  rows.slice(1).forEach((row, ridx) => {
    const emp = {};
    row.forEach((val, idx) => {
      const key = columnMap[idx];
      if (!key) return;
      let v = String(val).trim();
      if (numericFields.includes(key)) {
        // 콤마·원 제거 후 숫자 변환
        v = Number(v.replace(/[,원\s]/g, '')) || 0;
      }
      emp[key] = v;
    });
    // 기본값 보충
    if (!emp.level) emp.level = 'L2';
    if (!emp.group) emp.group = 'Archive';
    if (!emp.status) emp.status = 'active';
    if (emp.evalTarget === undefined) emp.evalTarget = (emp.status === 'active');
    if (!emp.id || !emp.name) {
      errors.push(`${ridx + 2}행: 사원코드 또는 성명이 비어있어 건너뜁니다`);
      return;
    }
    employees.push(emp);
  });
  
  return { employees, errors, columnMap, headers };
}

// ----------------------------------------------------------------------
// Excel(.xlsx, .xls) 지원 - SheetJS를 CDN에서 동적 로드
// ----------------------------------------------------------------------

// SheetJS 동적 로더 (최초 1회만 로드, 이후 캐시)
let _xlsxLibPromise = null;
function loadXLSXLib() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (_xlsxLibPromise) return _xlsxLibPromise;
  
  _xlsxLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.async = true;
    script.onload = () => {
      if (window.XLSX) resolve(window.XLSX);
      else reject(new Error('SheetJS 로드는 완료되었으나 window.XLSX를 찾을 수 없습니다'));
    };
    script.onerror = () => {
      _xlsxLibPromise = null;  // 실패 시 재시도 가능하도록
      reject(new Error('SheetJS 라이브러리를 불러올 수 없습니다. 인터넷 연결을 확인해주세요'));
    };
    document.head.appendChild(script);
  });
  
  return _xlsxLibPromise;
}

// Excel ArrayBuffer를 직원 객체 배열로 변환
async function excelToEmployees(arrayBuffer) {
  const XLSX = await loadXLSXLib();
  
  // 워크북 파싱
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  if (!workbook.SheetNames?.length) {
    return { employees: [], errors: ['Excel에 시트가 없습니다'] };
  }
  
  // 첫 번째 시트 사용
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // 시트를 2D 배열로 변환 (헤더 행 포함)
  const rows = XLSX.utils.sheet_to_json(sheet, { 
    header: 1,         // 헤더를 별도로 두지 않고 1행부터 데이터로
    blankrows: false,  // 빈 행 제외
    defval: '',        // 빈 셀은 빈 문자열로
    raw: false         // 날짜 등을 포맷된 문자열로
  });
  
  if (rows.length < 2) {
    return { employees: [], errors: ['데이터가 비어있거나 헤더만 있습니다'] };
  }
  
  // 2D 배열을 CSV처럼 처리 (기존 ecountCSVToEmployees 로직 재사용)
  const headers = rows[0].map(h => String(h || '').trim());
  const errors = [];
  
  // 헤더 → 코이션 필드 매핑
  const columnMap = {};
  headers.forEach((h, idx) => {
    const col = ECOUNT_HR_COLUMNS.find(c => 
      c.label === h || c.key === h || 
      c.label.replace(/\s/g, '') === h.replace(/\s/g, '')
    );
    if (col) columnMap[idx] = col.key;
  });
  
  const mappedKeys = Object.values(columnMap);
  if (!mappedKeys.includes('id')) errors.push('필수 컬럼 "사원코드"(id)를 찾을 수 없습니다');
  if (!mappedKeys.includes('name')) errors.push('필수 컬럼 "성명"(name)을 찾을 수 없습니다');
  
  if (errors.length > 0) return { employees: [], errors, columnMap, headers, sheetName, totalSheets: workbook.SheetNames.length };
  
  const employees = [];
  const numericFields = ['baseSalary', 'allowance', 'mealCar', 'qualif'];
  
  rows.slice(1).forEach((row, ridx) => {
    const emp = {};
    row.forEach((val, idx) => {
      const key = columnMap[idx];
      if (!key) return;
      let v = String(val ?? '').trim();
      if (numericFields.includes(key)) {
        v = Number(v.replace(/[,원\s]/g, '')) || 0;
      }
      // 날짜 필드는 Excel 날짜 형식 정규화 (YYYY-MM-DD → YYYY/MM/DD)
      if (key === 'hireDate' && v) {
        v = v.replace(/-/g, '/').replace(/\./g, '/');
      }
      emp[key] = v;
    });
    if (!emp.level) emp.level = 'L2';
    if (!emp.group) emp.group = 'Archive';
    if (!emp.status) emp.status = 'active';
    if (emp.evalTarget === undefined) emp.evalTarget = (emp.status === 'active');
    if (!emp.id || !emp.name) {
      errors.push(`${ridx + 2}행: 사원코드 또는 성명이 비어있어 건너뜁니다`);
      return;
    }
    employees.push(emp);
  });
  
  return { 
    employees, errors, columnMap, headers, 
    sheetName, totalSheets: workbook.SheetNames.length 
  };
}

// Excel 양식 샘플 다운로드 (XLSX 형식)
async function downloadExcelTemplate() {
  const XLSX = await loadXLSXLib();
  const sample = [{
    id: 'K-260601', name: '홍길동', dept: '아카이브사업팀', position: '대리', 
    level: 'L2', group: 'Archive', hireDate: '2026/06/01',
    baseSalary: 3500000, allowance: 500000, mealCar: 300000, qualif: 50000,
    email: 'sample@koition.com', status: 'active', note: '신규 입사'
  }];
  
  // 한글 헤더로 변환
  const data = sample.map(emp => {
    const row = {};
    ECOUNT_HR_COLUMNS.forEach(col => {
      row[col.label] = emp[col.key] ?? '';
    });
    return row;
  });
  
  const ws = XLSX.utils.json_to_sheet(data, { header: ECOUNT_HR_COLUMNS.map(c => c.label) });
  
  // 컬럼 너비 자동 조정 (대략적인 값)
  ws['!cols'] = ECOUNT_HR_COLUMNS.map(c => ({ wch: Math.max(c.label.length * 2, 12) }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '인사카드');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'KOITION_인사카드_양식_샘플.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// 파일 다운로드 헬퍼
function downloadFile(content, filename, mimeType = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

const INITIAL_EMPLOYEES = [
  { id: 'K-140401', name: '정일영', dept: '경영기획본부', position: '대표이사', level: 'L4', group: 'Biz', hireDate: '2014/03/24', baseSalary: 4100000, allowance: 1100000, mealCar: 400000, qualif: 100000, evalTarget: false, status: 'active', role: '', email: 'jiy@koition.com', note: '대표이사' },
  { id: 'K-140402', name: '최재교', dept: '공공사업본부', position: '대표이사', level: 'L4', group: 'Biz', hireDate: '2014/03/24', baseSalary: 4100000, allowance: 1100000, mealCar: 400000, qualif: 100000, evalTarget: false, status: 'active', role: '', email: 'cjk@koition.com', note: '대표이사' },
  { id: 'K-230501', name: '김형국', dept: '기업부설연구소', position: '수석연구위원', level: 'L4', group: 'Archive', hireDate: '2023/05/11', baseSalary: 1800000, allowance: 0, mealCar: 200000, qualif: 0, evalTarget: false, status: 'advisor', role: '', email: 'khg@koition.com', note: '자문계약' },
  { id: 'K-200401', name: '진상효', dept: '공공사업본부/PMO', position: '상무이사', level: 'L4', group: 'Biz', hireDate: '2021/05/01', baseSalary: 4400000, allowance: 0, mealCar: 400000, qualif: 200000, evalTarget: false, status: 'freelancer', role: '', email: 'jsh@koition.com', note: '프리랜서' },
  { id: 'K-250801', name: '류용환', dept: '기록연구부', position: '연구위원', level: 'L4', group: 'Archive', hireDate: '2025/08/01', baseSalary: 1000000, allowance: 0, mealCar: 0, qualif: 0, evalTarget: false, status: 'advisor', role: '', email: 'ryh@koition.com', note: '자문/연구위원' },
  { id: 'K-140403', name: '최영숙', dept: '경영지원부/기록연구부', position: '이사', level: 'L4', group: 'Biz', hireDate: '2014/03/24', baseSalary: 3700000, allowance: 600000, mealCar: 600000, qualif: 100000, evalTarget: true, status: 'active', role: '본부장', email: 'cys@koition.com', note: '연구소장 겸직' },
  { id: 'K-140404', name: '신수호', dept: '사업관리부', position: '부장', level: 'L3', group: 'Biz', hireDate: '2014/03/24', baseSalary: 3400000, allowance: 400000, mealCar: 600000, qualif: 100000, evalTarget: true, status: 'active', role: 'PM', email: 'sys@koition.com', note: '부서장' },
  { id: 'K-231001', name: '이종민', dept: '서비스개발부', position: '부장', level: 'L3', group: 'Tech', hireDate: '2023/10/23', baseSalary: 3738000, allowance: 500000, mealCar: 400000, qualif: 100000, evalTarget: true, status: 'active', role: 'PM', email: 'ljm@koition.com', note: '부서장' },
  { id: 'K-210505', name: '최경민', dept: '사업관리부', position: '부장', level: 'L3', group: 'Biz', hireDate: '2022/08/01', baseSalary: 3360000, allowance: 400000, mealCar: 200000, qualif: 0, evalTarget: true, status: 'active', role: 'PM', email: 'ckm@koition.com', note: '' },
  { id: 'K-240201', name: '오창민', dept: '경영기획본부', position: '부장', level: 'L3', group: 'Biz', hireDate: '2024/02/01', baseSalary: 3267000, allowance: 500000, mealCar: 400000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'ocm@koition.com', note: '' },
  { id: 'K-250601', name: '최순용', dept: '사업관리부', position: '부장', level: 'L3', group: 'Biz', hireDate: '2025/06/03', baseSalary: 3706160, allowance: 0, mealCar: 400000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'csy@koition.com', note: '신규입사' },
  { id: 'K-180501', name: '이원규', dept: '아카이브사업팀', position: '부장', level: 'L3', group: 'Archive', hireDate: '2018/05/01', baseSalary: 3180060, allowance: 400000, mealCar: 400000, qualif: 0, evalTarget: true, status: 'active', role: 'PM', email: 'lwk@koition.com', note: '팀장' },
  { id: 'K-180402', name: '김장호', dept: '서비스개발부', position: '차장', level: 'L3', group: 'Tech', hireDate: '2020/04/01', baseSalary: 1696270, allowance: 0, mealCar: 400000, qualif: 0, evalTarget: false, status: 'leave', role: '', email: 'kjh@koition.com', note: '휴직 중' },
  { id: 'K-170801', name: '심도현', dept: '데이터큐레이션팀', position: '차장', level: 'L3', group: 'Archive', hireDate: '2017/08/01', baseSalary: 3187660, allowance: 550000, mealCar: 400000, qualif: 0, evalTarget: true, status: 'active', role: 'PM', email: 'sdh@koition.com', note: '팀장' },
  { id: 'K-250602', name: '이흥주', dept: '사업관리부', position: '차장', level: 'L3', group: 'Biz', hireDate: '2025/06/13', baseSalary: 3100000, allowance: 0, mealCar: 400000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'lhj@koition.com', note: '신규입사' },
  { id: 'K-240202', name: '고영훈', dept: '사업관리부', position: '과장', level: 'L2', group: 'Tech', hireDate: '2024/03/07', baseSalary: 2934000, allowance: 0, mealCar: 400000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'gyh@koition.com', note: '' },
  { id: 'K-220601', name: '오윤경', dept: '데이터큐레이션팀', position: '차장', level: 'L2', group: 'Archive', hireDate: '2022/06/01', baseSalary: 3279570, allowance: 100000, mealCar: 200000, qualif: 0, evalTarget: true, status: 'active', role: 'PL', email: 'owk@koition.com', note: '' },
  { id: 'K-200501', name: '원동현', dept: '아카이브사업팀', position: '차장', level: 'L2', group: 'Tech', hireDate: '2020/05/04', baseSalary: 3146370, allowance: 200000, mealCar: 200000, qualif: 100000, evalTarget: true, status: 'active', role: 'PL', email: 'whw@koition.com', note: '' },
  { id: 'K-241201', name: '정예람', dept: '데이터큐레이션팀', position: '과장', level: 'L2', group: 'Archive', hireDate: '2024/12/01', baseSalary: 2900000, allowance: 0, mealCar: 200000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'jye@koition.com', note: '' },
  { id: 'K-240403', name: '최하연', dept: '기록연구부', position: '대리', level: 'L2', group: 'Archive', hireDate: '2024/04/08', baseSalary: 2512000, allowance: 0, mealCar: 200000, qualif: 200000, evalTarget: true, status: 'active', role: '기록전문', email: 'chy@koition.com', note: '' },
  { id: 'K-240401', name: '조은희', dept: '기록연구부', position: '대리', level: 'L1', group: 'Archive', hireDate: '2024/04/01', baseSalary: 2489800, allowance: 0, mealCar: 200000, qualif: 100000, evalTarget: true, status: 'active', role: '기록전문', email: 'jeh@koition.com', note: '' },
  { id: 'K-260301', name: '오누리', dept: '경영지원부', position: '주임', level: 'L1', group: 'Biz', hireDate: '2026/03/16', baseSalary: 2300000, allowance: 0, mealCar: 200000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'onr@koition.com', note: '신규입사' },
  { id: 'K-260701', name: '임지홍', dept: '기록연구부', position: '사원', level: 'L1', group: 'Archive', hireDate: '2026/07/01', baseSalary: 2300000, allowance: 0, mealCar: 200000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'ljh@koition.com', note: '신규입사' },
  { id: 'K-260702', name: '최하진', dept: '기록연구부', position: '사원', level: 'L1', group: 'Archive', hireDate: '2026/07/01', baseSalary: 2300000, allowance: 0, mealCar: 200000, qualif: 0, evalTarget: true, status: 'active', role: '', email: 'chj@koition.com', note: '신규입사' },
];

const INITIAL_POLICY = {
  comp_expert: 35, comp_problem: 30, comp_learn: 15, comp_collab: 20,
  perf_kpi: 35, perf_profit: 30, perf_delivery: 20, perf_customer: 15,
  // 프로젝트 기여 산정 계수 (기여점수 산출 규칙 — 제도 공식화)
  contrib_exec_w: 70, contrib_bid_w: 30, contrib_core_min: 20, contrib_bonus_multi: 5, contrib_bonus_jikjik: 5, contrib_sales_floor: 20,
  contrib_bid_pm_w: 100, contrib_bid_part_w: 60, contrib_bid_supp_w: 30,
  weight_comp: 50, weight_perf: 50,
  grades: [
    { grade: 'S', min: 90, max: 100, dist: 10, increase: 7.0, piCoef: 2.5, label: '탁월' },
    { grade: 'A', min: 80, max: 89.99, dist: 20, increase: 5.0, piCoef: 1.8, label: '우수' },
    { grade: 'B', min: 70, max: 79.99, dist: 40, increase: 3.0, piCoef: 1.0, label: '기대수준' },
    { grade: 'C', min: 60, max: 69.99, dist: 20, increase: 1.5, piCoef: 0.3, label: '개선필요' },
    { grade: 'D', min: 0, max: 59.99, dist: 10, increase: 0.0, piCoef: 0.0, label: '부진' },
  ],
  piBase: { L1: 1500000, L2: 2500000, L3: 4000000, L4: 6000000 },
  psRate: 5.0,
  // 연간 경영 목표 (경영기획부 설정)
  targets: { revenue: 0, profit: 0 },
  // 공통비(간접비) 배부: basis=기준, mode=annual(연) | monthly(월)
  allocation: { basis: 'labor', mode: 'annual' },
  // 프로젝트 원가구조 진단 기준 (경영기획부 조정 가능)
  diag: {
    ohWarn: 30, ohAlert: 45,        // 제경비/원가 % 주의·경고
    laborRevWarn: 70, laborRevAlert: 85, // 인건비/매출 % 주의·경고
    costRevWarn: 90, costRevAlert: 98,   // 원가율(원가/매출) % 주의·경고
    peerDev: 12,                    // 동종 중앙값 대비 초과 폭(%p)
    pmFloor: 20,                    // PM 최소 기여도 %
  },
  // 로그인 화면 회사 정보 카드 (admin이 직접 편집)
  coverStats: {
    enabled: true,
    items: [
      { label: '강원랜드 산업유산', value: '아카이브 PM', highlight: false },
      { label: '기록물 등록·기술', value: 'ISAD(G) 표준', highlight: false },
      { label: '2026 평가 대상자', value: '17명', highlight: true },
    ],
  },
  // 로그인 화면 우측 상단 표지 이미지 (admin이 URL 입력)
  coverImage: {
    enabled: true,
    url: '',  // 빈 값이면 placeholder 표시 (admin이 호스팅된 이미지 URL 입력)
    caption: '디지털 전환 · 지식 보존',
  },
  // 승진 체계 (Promotion System)
  promotion: {
    enabled: true,
    // 점수→Point 환산률 (예: 종합점수 90 × 0.15 = 13.5pt)
    pointRate: 0.15,
    // 직급별 승진 기준
    tiers: [
      { fromLevel: '1급', fromTitle: '부장(연구소장)', toTitle: '임원', years: null, requiredPoint: null, increase: null, note: '경영진 의사결정' },
      { fromLevel: '2급', fromTitle: '차장',           toTitle: '부장', years: 4,   requiredPoint: 13.5, increase: 2 },
      { fromLevel: '3급', fromTitle: '과장',           toTitle: '차장', years: 3,   requiredPoint: 10,   increase: 3 },
      { fromLevel: '4급', fromTitle: '대리',           toTitle: '과장', years: 3,   requiredPoint: 10,   increase: 4 },
      { fromLevel: '5급', fromTitle: '주임',           toTitle: '대리', years: null, requiredPoint: null, increase: 5, note: '경영진 의사결정' },
      { fromLevel: '6급', fromTitle: '사원(석사)',     toTitle: '대리', years: 2,   requiredPoint: 7,    increase: 8 },
      { fromLevel: '7급', fromTitle: '사원(초대졸/대졸)', toTitle: '대리', years: 3, requiredPoint: 10,  increase: 8 },
      { fromLevel: '8급', fromTitle: '사원(고졸)',     toTitle: '대리', years: 4,   requiredPoint: 14,   increase: 8 },
      { fromLevel: '사원급', fromTitle: '사원',         toTitle: '주임', years: null, requiredPoint: null, increase: 3, note: '경영진 의사결정' },
    ],
  },
};

// ============================================================
// 승진 심사 유틸 함수
// ============================================================

// 직원 직책(position)으로 승진 tier 찾기
function findPromotionTier(position, tiers) {
  if (!tiers || !position) return null;
  // 정확한 매칭 시도
  const exact = tiers.find(t => t.fromTitle === position);
  if (exact) return exact;
  // 부분 매칭 (예: position이 '사원'이면 '사원급'을 찾음)
  if (position === '사원') return tiers.find(t => t.fromLevel === '사원급');
  if (position === '주임') return tiers.find(t => t.fromLevel === '5급');
  if (position === '대리') return tiers.find(t => t.fromLevel === '4급');
  if (position === '과장') return tiers.find(t => t.fromLevel === '3급');
  if (position === '차장') return tiers.find(t => t.fromLevel === '2급');
  if (position === '부장' || position === '연구소장') return tiers.find(t => t.fromLevel === '1급');
  return null;
}

// 입사일 기준 근속 연수 계산 (단위: 년, 소수점 1자리)
function calcTenureYears(hireDate, asOf) {
  if (!hireDate) return 0;
  // YYYY/MM/DD 또는 YYYY-MM-DD 모두 처리
  const normalized = String(hireDate).replace(/\//g, '-');
  const start = new Date(normalized);
  const end = asOf || new Date();
  if (isNaN(start.getTime())) return 0;
  const diff = end - start;
  return Math.floor((diff / (365.25 * 24 * 60 * 60 * 1000)) * 10) / 10;
}

// 승진 심사 정보 계산 (대상자 여부, 진급 Point, 충족 여부 등)
function calcPromotionStatus(emp, policy, totalScore) {
  if (!policy?.promotion?.enabled) return null;
  if (!emp.evalTarget) return null;
  
  const tier = findPromotionTier(emp.position, policy.promotion.tiers);
  if (!tier) return null;
  
  // 체류 연한 (입사일 기준)
  const tenure = calcTenureYears(emp.hireDate);
  
  // 경영진 의사결정 등급
  if (tier.years === null) {
    return {
      tier,
      tenure,
      isEligible: true,
      decisionType: 'executive',
      currentPoint: null,
      requiredPoint: null,
      pointMet: null,
      yearsMet: null,
      yearsRemaining: null,
    };
  }
  
  // 일반 승진 등급
  const yearsMet = tenure >= tier.years;
  const yearsRemaining = Math.max(0, tier.years - tenure);
  
  // 현재 점수 → 진급 Point 환산
  const currentPoint = totalScore != null 
    ? Math.round(totalScore * (policy.promotion.pointRate || 0.15) * 10) / 10 
    : null;
  const pointMet = currentPoint != null && currentPoint >= tier.requiredPoint;
  
  // 승진 심사 대상자 여부 (체류 연한 충족 OR 1년 이내 충족 예정)
  const isEligible = yearsMet || yearsRemaining <= 1;
  
  return {
    tier,
    tenure,
    isEligible,
    decisionType: 'standard',
    currentPoint,
    requiredPoint: tier.requiredPoint,
    pointMet,
    yearsMet,
    yearsRemaining,
  };
}

const HISTORY_2025 = {
  year: 2025, closedDate: '2025-12-23',
  policy: { ...INITIAL_POLICY },
  gradeMap: {
    'K-180501': 'A', 'K-200501': 'B', 'K-210505': 'S', 'K-220601': 'A',
    'K-231001': 'A', 'K-240201': 'C', 'K-240202': 'B', 'K-240401': 'B', 'K-240403': 'S',
  },
};

// ============================================================
// LEVEL_GUIDE · 직무 레벨별 기대 수준 가이드
// L1·L2 등 신입·주니어 직원의 자기평가 참고 자료
// ============================================================
const LEVEL_GUIDE = {
  L1: {
    label: 'L1 · 신입·실무 견습',
    desc: '입사 1~2년차 또는 신규 직무 진입 단계',
    color: '#5DC4D4',
    expectedGrade: 'B~C급 (60~79점)',
    competency: {
      '직무 전문성': '기본 업무 매뉴얼·SOP에 따라 수행. 단순·반복 업무 독립 수행. 복잡 업무는 선배·상사 안내 받으며 학습 중.',
      '문제해결력': '예측 가능한 문제는 매뉴얼대로 대응. 새로운 상황은 적극적으로 질문하고 도움 요청.',
      '학습·자기계발': '신입 교육 충실히 이수. 직무 기초 자격증 도전. 사내 OJT 적극 참여.',
      '협업·커뮤니케이션': '팀 내 보고·전달 체계 숙지. 회의·메일·메신저 등 기본 소통 도구 능숙 사용.',
    },
    performance: {
      'KPI 달성도': '본인 담당 단위 업무의 80% 이상 완료. KPI 의미와 측정 방법 이해.',
      '프로젝트 기여도': '프로젝트 일원으로서 본인 역할 명확히 수행. 직접 수주·영업 기여는 기대 안 함.',
      '납기 준수·완성도': '본인 담당 업무 납기 95% 이상 준수. 결과물은 검토 후 수정 거쳐 완성.',
      '고객 만족도·재계약': '직접 고객 응대는 제한적. 선배 동행 또는 보조 역할로 고객 접점 경험.',
    },
    kpiFocus: '근태 준수율 · 교육 이수 시간 · 기본 직무 수행 건수',
    advice: 'L1은 결과보다 학습 태도와 성장 가능성이 중요합니다. "모르는 것을 모른다고 말하기"가 가장 큰 강점입니다. 무리하게 S급 점수를 주지 말고, 솔직하게 현재 수준을 평가하세요.',
  },
  L2: {
    label: 'L2 · 실무 담당',
    desc: '입사 2~5년차 또는 직무 안정기',
    color: '#1556C9',
    expectedGrade: 'B~A급 (70~89점)',
    competency: {
      '직무 전문성': '담당 직무 대부분을 독립 수행. 표준 작업 절차 준수. 직무 관련 정기 교육 이수. 기본 자격 보유.',
      '문제해결력': '일반적 문제는 스스로 해결. 복잡한 상황에서는 상사와 상의 후 해결. 의사결정 기준 준수.',
      '학습·자기계발': '연 1~2회 외부 교육 또는 자격 도전. 신기술·트렌드 자발 학습. 사내 학습 모임 참여.',
      '협업·커뮤니케이션': '팀 내 협업 원활. 타부서와도 적절히 소통. 후배 1~2명 OJT 지원 가능.',
    },
    performance: {
      'KPI 달성도': '담당 KPI 100% 달성 목표. 분기별 진척 관리 능력. 일부 KPI는 초과 달성 가능.',
      '프로젝트 기여도': '소형 프로젝트 PM 또는 핵심 실무자로 기여. 원가·일정 관리 일부 책임.',
      '납기 준수·완성도': '본인 담당 업무 납기 100% 준수. 결과물 자체 검토 후 제출. 재작업률 낮음.',
      '고객 만족도·재계약': '주요 고객 1~2개 직접 응대 가능. 고객 요구 파악 및 일반 응답 가능.',
    },
    kpiFocus: '직무군별 핵심 지표 (Archive: 등록 건수·메타데이터 품질 / Tech: 릴리즈 건수·버그율 / Biz: 신규 수주·재계약율)',
    advice: 'L2는 "독립 실무 담당"이 핵심 키워드입니다. 본인이 책임지고 끝까지 수행한 업무를 구체적 수치로 자기평가에 기록하세요. 후배 지도 경험이 있다면 협업·커뮤니케이션 점수에서 가산됩니다.',
  },
  L3: {
    label: 'L3 · 시니어·팀장급',
    desc: '입사 5~10년차 또는 팀 리더',
    color: '#0E2D7A',
    expectedGrade: 'A~S급 (80~100점)',
    competency: {
      '직무 전문성': '직무 전 영역 독립 수행 + 후배 지도. 프로젝트 설계·기획 주도. 자격증 또는 전문 교육 이수.',
      '문제해결력': '복잡한 문제 체계적 분석, 복수 대안 제시. 대부분 올바른 판단. 상사 개입 없이 스스로 해결.',
      '학습·자기계발': '연 2회 이상 외부 교육·세미나. 신기술 활용 사례 자체 도입. 후배 멘토링.',
      '협업·커뮤니케이션': '팀 운영 능력. 타부서·외부 협력 능숙. 발표·문서화 능력 우수.',
    },
    performance: {
      'KPI 달성도': '담당 KPI 100% 이상 달성. 팀 KPI 일부 책임. 110% 이상 초과 달성 가능.',
      '프로젝트 기여도': '중형 프로젝트 PM. 원가·일정·품질 종합 관리. 신규 수주 기여.',
      '납기 준수·완성도': '본인 + 팀원 납기 관리. 위기 대응 능력. 결과물 품질 일관성 유지.',
      '고객 만족도·재계약': '주요 고객 관계 관리. 추가 발주 유도. 클레임 대응 능력.',
    },
    kpiFocus: '본인 KPI + 팀 KPI 일부 + 신규 수주 또는 시스템 가용성 등 사업 영향력',
    advice: 'L3는 본인 성과 + 팀 기여 모두 평가됩니다. 후배 양성, 프로젝트 리딩, 외부 기관 협력 등 리더십 활동을 구체적으로 기록하세요.',
  },
  L4: {
    label: 'L4 · 본부장·임원급',
    desc: '본부 운영 및 경영 의사결정 참여',
    color: '#091F5A',
    expectedGrade: 'A~S급 (80~100점)',
    competency: {
      '직무 전문성': '해당 분야 최고 수준 전문성. 사내 지식 전파자. 외부 강연·기고. 기술표준 수립 기여.',
      '문제해결력': '전례 없는 문제 정의·해결. 리스크 사전 식별·예방. 의사결정 속도·정확도 탁월.',
      '학습·자기계발': '업계 동향 선도. 신사업·신기술 발굴. 사내 학습 문화 조성.',
      '협업·커뮤니케이션': '본부 운영. 경영진 보고. 외부 협력 채널 다수 확보. 대외 발표 능숙.',
    },
    performance: {
      'KPI 달성도': '본부 KPI 100% 이상. 전사 KPI 일부 책임. 신사업 KPI 설계.',
      '프로젝트 기여도': '대형 프로젝트 책임. 본부 매출·이익 책임. 신규 사업 발굴·실행.',
      '납기 준수·완성도': '본부 전체 납기·품질 관리. 위기 시 의사결정.',
      '고객 만족도·재계약': '대형 고객 관계 관리. 신규 시장 개척. 장기 파트너십 구축.',
    },
    kpiFocus: '본부 매출·이익 + 신규 수주 + 전사 사업 영향력',
    advice: 'L4는 본부 운영 성과로 평가됩니다. 본인 직접 실적보다 본부의 사업 성과, 신사업 발굴, 외부 협력 채널 구축 등 거시적 기여를 기록하세요.',
  },
};

// ============================================================
// COMMENT_GUIDE · 자기평가 의견란 작성 가이드
// 각 의견란별 작성 기준 + 좋은 예시 + 피해야 할 예시
// 직무군(Archive·Tech·Biz)별로 차별화된 사례 제공
// ============================================================
const COMMENT_GUIDE = {
  selfStrength: {
    label: '성과·강점',
    purpose: '올해 본인이 이뤄낸 구체적 성과와 강점을 정량적으로 기록하는 영역입니다',
    principles: [
      { icon: '📊', title: '정량 수치 우선', desc: '"많이 했다" 보다 "X건 처리", "Y% 향상", "Z명 지도" 같은 구체적 숫자' },
      { icon: '📅', title: '시점 명시', desc: '"올해", "1분기", "Q3 프로젝트" 등 언제 일어난 일인지 명시' },
      { icon: '🎯', title: '본인 기여 명확화', desc: '"팀이 했다" 보다 "내가 담당했다", "내가 주도했다"로 본인 역할 강조' },
      { icon: '💡', title: '결과의 영향 설명', desc: '단순 활동 나열보다 그 결과가 회사·고객·동료에게 어떤 영향을 줬는지' },
    ],
    examples: {
      good: {
        Archive: [
          '동원탄좌 M650 프로젝트에서 1차년도 목표인 유물 3,500점 메타데이터 등록을 100% 달성했으며, ISAD(G) 표준 기반 기록계층 분류표를 본인이 설계하여 자료 검색 정확도를 약 40% 개선했습니다.',
          'OCR 자동화 파이프라인 도입을 주도하여 광업 도면 디지털화 작업 시간을 종전 1건당 평균 25분에서 8분으로 단축했습니다. 연간 약 1,200건 처리 기준 300시간 이상의 인력 절감 효과가 발생했습니다.',
        ],
        Tech: [
          'KOITION HR 시스템 v6 출시를 주도하여 평가-급여-승진 심사를 단일 시스템에서 처리 가능하도록 통합했습니다. 출시 후 admin 작업 시간이 기존 대비 60% 단축되었으며, 사용자 피드백 점수 4.8/5.0을 기록했습니다.',
          'Q2에 발생한 운영 서버 장애 대응에서 평균 복구 시간(MTTR)을 4시간에서 35분으로 줄이는 자동 알림·롤백 시스템을 구축했습니다. 이후 6개월간 동일 유형 장애 0건 유지 중입니다.',
        ],
        Biz: [
          '강원랜드 M650 후속 계약 3억 5천만 원 규모 신규 수주에 핵심 영업 담당으로 기여했습니다. 사전 자문 회의 4회 주관 및 기술 제안서 수석 작성을 통해 입찰 평가에서 1위 획득했습니다.',
          '기존 거래처 7개 중 6개와 2026년 재계약을 완료하여 재계약율 85.7%를 달성했습니다. 특히 평창광업소 건은 경쟁사 제안에도 불구하고 단가 인하 없이 재계약을 성사시켰습니다.',
        ],
        PM: [
          '올해 PM으로 4개 프로젝트(M650 1·2차년도, 평창광업소 사업본부 아카이브, 정선 산업유산 디지털화)를 동시 수행하여 모두 약정 납기 내 완료했습니다. 평균 프로젝트 이익률 26.4%를 달성하여 본부 목표 22%를 초과했습니다.',
          'M650 1차년도 프로젝트에서 발주처(강원랜드 사업본부) CSAT 평가 4.6/5.0점을 획득하여, 후속 2차년도 사업(3억 5천만 원)을 단독 협상을 통해 추가 수주하는 성과를 만들었습니다. 본인의 사전 신뢰 관계 구축이 핵심 요인이었습니다.',
        ],
      },
      bad: [
        '"올해 열심히 일했고 맡은 일을 책임감 있게 수행했습니다." → 너무 추상적, 구체적 사례 없음',
        '"팀과 협력하여 좋은 성과를 냈습니다." → 본인 기여가 불명확, 정량 수치 없음',
        '"항상 최선을 다했고 주변 동료들에게도 인정받았습니다." → 자기 평가에 부적합한 주관적 표현',
      ],
    },
  },
  selfImprovement: {
    label: '개선점',
    purpose: '본인이 부족했다고 느낀 부분을 솔직하게 인정하고 개선 의지를 보이는 영역입니다',
    principles: [
      { icon: '🤔', title: '솔직한 자기 성찰', desc: '"개선할 부분이 없다"는 답변은 오히려 마이너스. 누구나 성장할 영역이 있음' },
      { icon: '🎯', title: '구체적 영역 지목', desc: '"전반적으로 부족"보다 "발표 능력", "일정 관리", "신기술 학습" 등 구체 영역' },
      { icon: '📈', title: '개선 계획 포함', desc: '단순 인정보다 "어떻게 개선할 것인지" 행동 계획까지 함께 기술' },
      { icon: '⚖️', title: '강점과 균형', desc: '강점의 반대편을 개선점으로 (강점이 추진력이면 → 디테일 검토 부족 인정)' },
    ],
    examples: {
      good: {
        Archive: [
          '메타데이터 입력 속도는 빠른 편이지만, 일부 자료의 출처 검증에 충분한 시간을 들이지 못해 후속 보정 작업이 발생한 사례가 3건 있었습니다. 2026년에는 자료 수집 단계에서 출처 검증 체크리스트를 도입하여 사전 검증을 강화하겠습니다.',
          '아카이브 분류 작업은 익숙해졌으나, 디지털 보존 기술(특히 마이그레이션 전략) 영역의 지식이 부족합니다. 2026년 상반기 중 OAIS 표준 교육 1회 이수와 관련 자격증 도전을 계획하고 있습니다.',
        ],
        Tech: [
          '신규 기능 개발에 집중하다 보니 기존 코드 리팩토링·테스트 커버리지 향상 작업이 후순위로 밀린 부분이 있습니다. 2026년에는 매 스프린트의 20%를 기술 부채 해소에 할당하여 장기 유지보수성을 개선하겠습니다.',
          '문서화가 부족하여 후임자 인수인계나 외부 공유 시 시간이 더 소요됩니다. 주요 시스템에 대한 ADR(Architecture Decision Records)를 분기별로 작성하여 의사결정 근거를 남기겠습니다.',
        ],
        Biz: [
          '신규 수주에는 적극적이었으나 기존 고객 정기 미팅을 분기에 1회 이상 진행하지 못한 사례가 있었습니다. 2026년에는 핵심 고객 5개사 대상 월 1회 정기 컨택 일정을 사전에 캘린더에 등록하여 관계 관리를 체계화하겠습니다.',
          '입찰 제안서 작성 시 디자인·시각화 측면에서 외주 의존도가 높았습니다. 2026년 1분기 중 PPT 디자인 실무 교육을 이수하여 자체 제작 비중을 50% 이상으로 높이겠습니다.',
        ],
        PM: [
          '동시에 4개 프로젝트를 수행하다 보니 일정 단위로는 잘 관리했지만, 프로젝트 간 자원 배분 충돌이 2회 발생했습니다. 2026년에는 분기 초 자원 계획서를 작성하여 PM 본부장과 사전 조정하는 체계를 도입하겠습니다.',
          '프로젝트 종료 시 발주처 만족도(CSAT)는 우수했으나, 종료 후 1~2개월 내 추가 발주 전환률이 약 30%에 그쳐 후속 수주 기회를 놓친 사례가 있습니다. 2026년에는 PM 주도 클로징 미팅 + 후속 사업 제안 패키지화를 통해 전환률 50% 이상을 목표합니다.',
        ],
      },
      bad: [
        '"특별히 개선할 점은 없다고 생각합니다." → 자기 성찰 의지 부족으로 평가됨',
        '"더 열심히 하겠습니다." → 구체적 영역이나 행동 계획 없음',
        '"회사의 지원이 부족해서 어려웠습니다." → 외부 환경 탓, 본인 개선점이 아님',
      ],
    },
  },
  selfGoal: {
    label: '내년 목표·요청사항',
    purpose: '내년 도전 목표와 회사·상사에게 필요한 지원을 구체적으로 제안하는 영역입니다',
    principles: [
      { icon: '🎯', title: 'SMART 목표', desc: '구체적(Specific), 측정 가능(Measurable), 달성 가능(Achievable), 관련성(Relevant), 기한(Time-bound)' },
      { icon: '🪜', title: '도전적이되 현실적', desc: '현재 수준의 110~130% 정도가 적정. 너무 쉬우면 성장 없고, 너무 어려우면 실패 부담' },
      { icon: '🤝', title: '필요한 지원 명시', desc: '"교육 기회", "예산 X천만 원", "인력 1명" 등 구체적 요청. 회사 의사결정 자료가 됨' },
      { icon: '📊', title: '본부 KPI와 연결', desc: '본인 목표가 부서·본부 KPI에 어떻게 기여하는지 연결고리 설명' },
    ],
    examples: {
      good: {
        Archive: [
          '2026년에는 M650 프로젝트 2차년도(나머지 1,500점 메타데이터 완성) + 신규 강원랜드 사업본부 아카이브 사업 1개 추가 수주 지원을 목표로 합니다. 이를 위해 ISAD(G) 심화 교육 이수와 ICA 국제표준 워크숍 참가(예산 약 200만 원) 지원을 요청드립니다.',
          '디지털 아카이브 분야의 자격증 ARMA(IGP, Information Governance Professional) 취득을 2026년 상반기 목표로 설정했습니다. 자격증 응시료(약 1,800달러) 회사 지원과 격주 1회 학습 시간(2시간) 활용 양해를 요청드립니다.',
        ],
        Tech: [
          'HR v6 안정화 이후 2026년에는 강원랜드 산업유산 아카이브 외부 공개 플랫폼 개발 PM 역할에 도전하고 싶습니다. 6월 시작 → 12월 베타 오픈을 목표로 하며, 프론트엔드 개발자 1명 추가 채용 검토를 요청드립니다.',
          'AI/LLM 활용 메타데이터 자동 생성 기능 도입을 통해 디지털화 효율을 30% 추가 개선하는 것이 2026년 핵심 목표입니다. Azure OpenAI API 사용료 예산 월 50만 원 책정과 AWS Solutions Architect 자격증 도전 시간 양해를 요청드립니다.',
        ],
        Biz: [
          '2026년 신규 수주 목표를 작년 대비 25% 증가한 12억 원으로 설정합니다. 강원도 7개 지자체 광업 아카이브 통합 수주(약 5억 원)와 타 광산 지역(태백·정선·영월) 신규 1개사 발굴이 핵심 전략입니다. 이를 위해 컨퍼런스 참가(연 3회, 약 500만 원) 지원을 요청드립니다.',
          '본인은 영업 출신이지만 기록학 전문성이 부족해 입찰 제안서 작성에서 한계를 느낍니다. 2026년 한국기록학회 정기 학술대회 참석(2박3일, 약 60만 원)과 기록학 입문 도서 자비 구매(약 30만 원) 정도의 자기계발 시간 허용을 요청드립니다.',
        ],
        PM: [
          '2026년 PM 수행 목표를 6개 프로젝트로 확대하면서 평균 이익률 25% 이상 유지, 납기 100% 달성, CSAT 4.5 이상을 모두 달성하는 것이 핵심 목표입니다. 이를 위해 PM 보조 인력(주니어) 1명 충원과 프로젝트 관리 도구(Jira·Asana 등) 도입 예산 월 30만 원 책정을 요청드립니다.',
          '본인은 Archive 전문성을 보유한 PM이지만, 강원랜드 외 광산 지역 확장을 위해서는 광업 산업 전반에 대한 이해가 필요합니다. 2026년 한국광해광업공단 주최 산업유산 세미나(2회) 참석과 광업 관련 도서·자료 구매 예산 약 50만 원을 요청드리며, 신규 사업 발굴 시간으로 월 8시간 활용 양해를 부탁드립니다.',
        ],
      },
      bad: [
        '"맡겨주시는 일을 잘 해내겠습니다." → 본인 주도성 부족, 도전 의지 없음',
        '"승진하고 싶습니다." → 결과만 있고 과정·계획 없음',
        '"연봉 인상을 부탁드립니다." → 본 영역의 용도와 다름 (별도 면담에서 논의할 사항)',
      ],
    },
  },
};

// ============================================================
// RUBRICS · 평가 척도 기준표
// ============================================================
const RUBRICS = {
  comp: [
    {
      key: 'comp_expert', label: '직무 전문성',
      desc: '담당 직무 전문지식·기술 수준, 자격증·공인 역량',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: '해당 분야 최고 수준 전문성. 사내 지식 전파자 역할. 관련 자격증 보유 또는 기술표준 수립 기여. 외부 강연·기고 실적.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: '직무 전 영역 독립 수행 가능. 후배 지도 가능. 프로젝트 설계·기획 주도. 자격증 또는 전문 교육 이수.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: '주요 업무 독립 수행. 일부 복잡 업무는 상사 확인 필요. 직무 관련 교육 정기 이수. 기본 자격 보유.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: '기본 업무는 수행하나 심화 영역에서 빈번한 지원 필요. 자격·교육 이수 미흡.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: '전문지식 부족으로 업무 지연 또는 오류 반복. 자기계발 노력 현저히 부족.' },
      ],
    },
    {
      key: 'comp_problem', label: '문제해결력',
      desc: '복잡한 문제 분석·해결, 의사결정의 질과 속도',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: '전례 없는 문제를 독자적으로 정의하고 해결책 제시. 리스크 사전 식별 및 예방. 의사결정 속도와 정확도 모두 탁월.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: '복잡한 문제를 체계적으로 분석, 복수 대안 제시. 대부분 올바른 판단. 상사 개입 없이 스스로 해결.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: '일반적 문제는 스스로 해결. 복잡한 상황에서는 상사 상의 후 해결. 의사결정 기준 준수.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: '문제 발생 시 즉각 대응 어려움. 해결책이 표면적·단기적 수준에 그침.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: '문제 인식 자체가 늦거나 회피. 반복 오류에 개선 없음.' },
      ],
    },
    {
      key: 'comp_learn', label: '학습·자기계발',
      desc: '신규 지식 습득, 교육 이수, 자격 취득 등',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: '연 1건 이상 자격·자격증 취득. 사내 스터디·세미나 주도. 습득 지식을 실무에 즉각 적용하여 성과 창출.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: '연간 교육 계획 대비 120% 이상 이수. 외부 컨퍼런스 참석. 개인 학습 콘텐츠 공유.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: '연간 필수 교육 100% 이수. 업무 관련 새로운 도구·기술 자발적 학습.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: '필수 교육 이수율 80% 미만. 자기계발 활동이 수동적·의무적 수준에 그침.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: '교육 불참 또는 미이수 반복. 새로운 업무 방식 적용 거부.' },
      ],
    },
    {
      key: 'comp_collab', label: '협업·커뮤니케이션',
      desc: '팀워크, 보고·소통, 다면평가 반영',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: '부서 간 갈등을 선제적으로 조율. 다면평가 최상위. 보고서·발표 품질 탁월. 의사소통으로 프로젝트 속도 향상.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: '팀 내 협력 분위기 조성. 보고·공유 신속 정확. 다면평가 상위 30%.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: '업무 관련 커뮤니케이션 원활. 팀 회의 적극 참여. 다면평가 보통 수준.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: '소통 부족으로 오해·재작업 발생. 다면평가 하위 30%.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: '팀워크 저해 행동. 보고 누락·지연 반복. 다면평가 최하위.' },
      ],
    },
  ],
  perf: [
    {
      key: 'perf_kpi', label: 'KPI 달성도',
      desc: '연초 설정 KPI 달성률 (계량 지표)',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: 'KPI 달성률 120% 이상. 목표를 초과 달성하여 추가 성과 창출. 도전적 목표를 스스로 설정·달성.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: 'KPI 달성률 105~119%. 대부분의 목표 달성, 일부 초과.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: 'KPI 달성률 90~104%. 설정 목표 대부분 달성.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: 'KPI 달성률 75~89%. 핵심 목표 일부 미달.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: 'KPI 달성률 75% 미만. 핵심 목표 다수 미달성.' },
      ],
    },
    {
      key: 'perf_profit', label: '프로젝트 기여도',
      desc: '참여 프로젝트의 수익률 × 본인 기여도 비중 (경영지원부 수익성 데이터 연계 · 자동 산정)',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: '고수익률(25%↑) 프로젝트에 핵심 역할로 높은 기여. 원가 절감·신규 수주 주도.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: '수익률 18~25% 프로젝트에 주도적 기여. 예산 내 완료 및 추가 발주 유도.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: '수익률 12~18% 프로젝트에 실무 기여. 예산 초과 없이 완료.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: '수익률 5~12% 프로젝트 참여. 기여 비중 제한적 또는 소규모 예산 초과.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: '수익률 5% 미만·적자 프로젝트. 예산 초과 또는 손실 발생.' },
      ],
    },
    {
      key: 'perf_delivery', label: '납기 준수·완성도',
      desc: '계획 대비 납기 준수율, 결과물 품질',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: '납기 준수율 100%. 결과물 품질 고객/발주처로부터 공식 우수 인정. 사전 리스크 관리로 일정 당겨 완료.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: '납기 준수율 95% 이상. 결과물 재작업 1회 이내. 품질 검토 통과율 높음.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: '납기 준수율 85~94%. 경미한 수정 발생하나 최종 마감 내 완료.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: '납기 준수율 70~84%. 재작업 2~3회 발생. 일부 마감 지연.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: '납기 준수율 70% 미만. 반복적 지연 및 품질 불량.' },
      ],
    },
    {
      key: 'perf_customer', label: '고객 만족도·재계약',
      desc: '고객 평가 점수, 재계약·추가 발주 실적',
      bands: [
        { range: '90~100', label: 'S급', grade: 'S', criteria: '고객 만족도 설문 상위 10%. 재계약률 100% + 추가 발주. 고객으로부터 감사 서한 또는 공식 표창.' },
        { range: '80~89', label: 'A급', grade: 'A', criteria: '고객 만족도 상위 30%. 재계약률 90% 이상. 고객 VOC 긍정 비율 높음.' },
        { range: '70~79', label: 'B급', grade: 'B', criteria: '고객 만족도 평균 수준. 재계약률 75% 이상. 클레임 없이 프로젝트 종료.' },
        { range: '60~69', label: 'C급', grade: 'C', criteria: '고객 불만 1~2건 발생. 재계약률 50~74%.' },
        { range: '0~59', label: 'D급', grade: 'D', criteria: '고객 클레임 다수. 재계약 실패. 계약 해지 또는 분쟁 발생.' },
      ],
    },
  ],
};

// ============================================================
// KPI 정량 측정 지표 (전사 공통 + 직무군별 특화)
// ============================================================
const KPI_METRICS = {
  // 전사 공통 KPI (모든 직원 대상)
  common: {
    title: '전사 공통 KPI',
    subtitle: '직무군 무관 전 직원 적용 · 정량 측정',
    color: 'brand',
    metrics: [
      {
        id: 'kpi_attain', name: 'KPI 달성률',
        unit: '%', formula: '실제 달성 / 연초 설정 목표 × 100',
        bands: [
          { range: '120% 이상', grade: 'S', score: 100 },
          { range: '105~119%', grade: 'A', score: 85 },
          { range: '90~104%', grade: 'B', score: 75 },
          { range: '75~89%', grade: 'C', score: 65 },
          { range: '75% 미만', grade: 'D', score: 50 },
        ],
        examples: '연초 KPI: 아카이브 1,500건 등록 → 실제 1,650건 등록 시 110% (A등급)',
      },
      {
        id: 'attendance', name: '근태 준수율',
        unit: '%', formula: '(근무일 - 무단결근·지각 일수) / 근무일 × 100',
        bands: [
          { range: '100% (무결근·무지각)', grade: 'S', score: 100 },
          { range: '98~99.9%', grade: 'A', score: 85 },
          { range: '95~97.9%', grade: 'B', score: 75 },
          { range: '90~94.9%', grade: 'C', score: 65 },
          { range: '90% 미만', grade: 'D', score: 50 },
        ],
        examples: '연 250일 근무일 중 지각 5회(0.5일 환산) → 99.8% (A등급)',
      },
      {
        id: 'edu_hours', name: '교육 이수 시간',
        unit: '시간/년', formula: '연간 사내·외 교육 누적 시간',
        bands: [
          { range: '60시간 이상', grade: 'S', score: 100 },
          { range: '40~59시간', grade: 'A', score: 85 },
          { range: '24~39시간', grade: 'B', score: 75 },
          { range: '16~23시간', grade: 'C', score: 65 },
          { range: '16시간 미만', grade: 'D', score: 50 },
        ],
        examples: 'ISAD(G) 표준 교육 16시간 + 사내 워크샵 24시간 + 자격증 강의 20시간 = 60시간 (S등급)',
      },
      {
        id: 'qualif', name: '자격증·전문 자격 보유',
        unit: '점', formula: '관련 자격 보유 점수 합계 (정보관리기술사 50점, 기록물관리전문요원 30점, 기타 10점)',
        bands: [
          { range: '60점 이상', grade: 'S', score: 100 },
          { range: '40~59점', grade: 'A', score: 85 },
          { range: '20~39점', grade: 'B', score: 75 },
          { range: '10~19점', grade: 'C', score: 65 },
          { range: '0~9점', grade: 'D', score: 50 },
        ],
        examples: '정보관리기술사 50점 + 기록물관리전문요원 30점 = 80점 (S등급)',
      },
    ],
  },
  
  // Archive (기록관리) 직무군 특화
  Archive: {
    title: 'Archive · 기록관리 직무군 KPI',
    subtitle: '아카이브사업팀·데이터큐레이션팀·기록연구부',
    color: 'Archive',
    metrics: [
      {
        id: 'archive_reg', name: '아카이브 등록 건수',
        unit: '건/년', formula: '연간 ISAD(G) 표준 적용 기록물 등록·기술 건수',
        bands: [
          { range: '2,000건 이상', grade: 'S', score: 100 },
          { range: '1,500~1,999건', grade: 'A', score: 85 },
          { range: '1,000~1,499건', grade: 'B', score: 75 },
          { range: '700~999건', grade: 'C', score: 65 },
          { range: '700건 미만', grade: 'D', score: 50 },
        ],
        examples: '강원랜드 동원탄좌 컬렉션 1,800건 + 사북항쟁 자료 320건 = 2,120건 (S등급)',
      },
      {
        id: 'metadata_qa', name: '메타데이터 품질 검증 통과율',
        unit: '%', formula: '검증 통과 건수 / 전체 검증 건수 × 100',
        bands: [
          { range: '98% 이상', grade: 'S', score: 100 },
          { range: '95~97.9%', grade: 'A', score: 85 },
          { range: '90~94.9%', grade: 'B', score: 75 },
          { range: '85~89.9%', grade: 'C', score: 65 },
          { range: '85% 미만', grade: 'D', score: 50 },
        ],
        examples: '품질 검증 1,000건 중 970건 통과 → 97% (A등급)',
      },
      {
        id: 'classification', name: '단위업무 분류표 적용 정확도',
        unit: '%', formula: '재분류 없이 1차 분류된 비율',
        bands: [
          { range: '95% 이상', grade: 'S', score: 100 },
          { range: '90~94.9%', grade: 'A', score: 85 },
          { range: '85~89.9%', grade: 'B', score: 75 },
          { range: '75~84.9%', grade: 'C', score: 65 },
          { range: '75% 미만', grade: 'D', score: 50 },
        ],
        examples: '1차 분류 500건 중 460건 재분류 없이 확정 → 92% (A등급)',
      },
      {
        id: 'preservation', name: '디지털 보존 처리율',
        unit: '%', formula: '장기보존포맷 변환 완료 / 대상 건수 × 100',
        bands: [
          { range: '100%', grade: 'S', score: 100 },
          { range: '95~99.9%', grade: 'A', score: 85 },
          { range: '85~94.9%', grade: 'B', score: 75 },
          { range: '70~84.9%', grade: 'C', score: 65 },
          { range: '70% 미만', grade: 'D', score: 50 },
        ],
        examples: '대상 1,200건 중 1,150건 PDF/A·TIFF 변환 → 95.8% (A등급)',
      },
    ],
  },
  
  // Tech (기술개발) 직무군 특화
  Tech: {
    title: 'Tech · 기술개발 직무군 KPI',
    subtitle: '서비스개발부 · 시스템·플랫폼 개발',
    color: 'Tech',
    metrics: [
      {
        id: 'release_count', name: '서비스 릴리즈 건수',
        unit: '건/년', formula: '연간 프로덕션 배포 횟수 (major + minor)',
        bands: [
          { range: '24건 이상 (월 2건+)', grade: 'S', score: 100 },
          { range: '18~23건', grade: 'A', score: 85 },
          { range: '12~17건', grade: 'B', score: 75 },
          { range: '6~11건', grade: 'C', score: 65 },
          { range: '6건 미만', grade: 'D', score: 50 },
        ],
        examples: '아카이브 검색 시스템 v2 출시(major 2건) + 기능 개선(minor 22건) = 24건 (S등급)',
      },
      {
        id: 'bug_rate', name: '버그 발생률',
        unit: '건/1000라인', formula: '연간 발견된 버그 건수 / 작성한 코드 라인 수(KLOC)',
        bands: [
          { range: '0.5건/KLOC 이하', grade: 'S', score: 100 },
          { range: '0.51~1.0건/KLOC', grade: 'A', score: 85 },
          { range: '1.01~2.0건/KLOC', grade: 'B', score: 75 },
          { range: '2.01~3.5건/KLOC', grade: 'C', score: 65 },
          { range: '3.5건 초과', grade: 'D', score: 50 },
        ],
        examples: '작성 코드 20,000라인 중 버그 15건 → 0.75건/KLOC (A등급)',
      },
      {
        id: 'system_uptime', name: '시스템 가용성 (Uptime)',
        unit: '%', formula: '서비스 정상 가동 시간 / 전체 운영 시간 × 100',
        bands: [
          { range: '99.95% 이상', grade: 'S', score: 100 },
          { range: '99.5~99.94%', grade: 'A', score: 85 },
          { range: '99.0~99.49%', grade: 'B', score: 75 },
          { range: '97.0~98.99%', grade: 'C', score: 65 },
          { range: '97% 미만', grade: 'D', score: 50 },
        ],
        examples: '연 8,760시간 중 다운타임 4시간 → 99.95% (S등급)',
      },
      {
        id: 'code_review', name: '코드 리뷰 참여 건수',
        unit: '건/년', formula: 'PR 리뷰어로 참여한 횟수 (코멘트 작성 기준)',
        bands: [
          { range: '200건 이상', grade: 'S', score: 100 },
          { range: '120~199건', grade: 'A', score: 85 },
          { range: '60~119건', grade: 'B', score: 75 },
          { range: '30~59건', grade: 'C', score: 65 },
          { range: '30건 미만', grade: 'D', score: 50 },
        ],
        examples: 'GitHub PR 리뷰어 참여 156회 (A등급)',
      },
    ],
  },
  
  // Biz (사업경영) 직무군 특화
  Biz: {
    title: 'Biz · 사업경영 직무군 KPI',
    subtitle: '경영기획본부·공공사업본부·사업관리부·경영지원부',
    color: 'Biz',
    metrics: [
      {
        id: 'contract_value', name: '신규 수주 계약 금액',
        unit: '억원/년', formula: '본인 주도 수주 신규 계약 합계',
        bands: [
          { range: '15억원 이상', grade: 'S', score: 100 },
          { range: '10~14.9억원', grade: 'A', score: 85 },
          { range: '5~9.9억원', grade: 'B', score: 75 },
          { range: '2~4.9억원', grade: 'C', score: 65 },
          { range: '2억원 미만', grade: 'D', score: 50 },
        ],
        examples: '강원랜드 아카이브 8억 + 광역시 공공기록 5억 + 자문 2.5억 = 15.5억 (S등급)',
      },
      {
        id: 'profit_rate', name: '담당 프로젝트 영업이익률',
        unit: '%', formula: '(매출 - 직접비) / 매출 × 100 · 담당 PM 기준',
        bands: [
          { range: '25% 이상', grade: 'S', score: 100 },
          { range: '18~24.9%', grade: 'A', score: 85 },
          { range: '12~17.9%', grade: 'B', score: 75 },
          { range: '5~11.9%', grade: 'C', score: 65 },
          { range: '5% 미만', grade: 'D', score: 50 },
        ],
        examples: '담당 프로젝트 매출 10억 / 직접비 7.8억 → 영업이익률 22% (A등급)',
      },
      {
        id: 'renewal_rate', name: '재계약·연장 성공률',
        unit: '%', formula: '재계약 성공 건수 / 만료 도래 건수 × 100',
        bands: [
          { range: '100%', grade: 'S', score: 100 },
          { range: '85~99.9%', grade: 'A', score: 85 },
          { range: '70~84.9%', grade: 'B', score: 75 },
          { range: '50~69.9%', grade: 'C', score: 65 },
          { range: '50% 미만', grade: 'D', score: 50 },
        ],
        examples: '만료 도래 10건 중 9건 재계약 성공 → 90% (A등급)',
      },
      {
        id: 'proposal_winrate', name: '제안 입찰 낙찰률',
        unit: '%', formula: '낙찰 건수 / 제안 참가 건수 × 100',
        bands: [
          { range: '50% 이상', grade: 'S', score: 100 },
          { range: '35~49.9%', grade: 'A', score: 85 },
          { range: '25~34.9%', grade: 'B', score: 75 },
          { range: '15~24.9%', grade: 'C', score: 65 },
          { range: '15% 미만', grade: 'D', score: 50 },
        ],
        examples: '제안 20건 참가 중 8건 낙찰 → 40% (A등급)',
      },
    ],
  },
  
  // PM (사업수행) 직무군 특화 - 사업관리부·PMO 핵심 인력
  PM: {
    title: 'PM · 사업수행 직무군 KPI',
    subtitle: '사업관리부·PMO · 프로젝트 수행 + 사업 개발 양축',
    color: 'PM',
    metrics: [
      {
        id: 'pm_project_count', name: '프로젝트 수행 건수',
        unit: '건/년', formula: '연간 PM 역할로 수행 완료한 프로젝트 수 (단순 참여 제외)',
        bands: [
          { range: '6건 이상', grade: 'S', score: 100 },
          { range: '4~5건', grade: 'A', score: 85 },
          { range: '3건', grade: 'B', score: 75 },
          { range: '2건', grade: 'C', score: 65 },
          { range: '1건 이하', grade: 'D', score: 50 },
        ],
        examples: '동원탄좌 M650 + 강원랜드 사업본부 + 평창광업소 + 정선 사업본부 4개 PM 수행 (A등급)',
      },
      {
        id: 'pm_ontime', name: '납기 준수율',
        unit: '%', formula: '연간 수행한 프로젝트 중 약정 납기 내 완료한 비율',
        bands: [
          { range: '100% (전 프로젝트 납기 준수)', grade: 'S', score: 100 },
          { range: '90~99%', grade: 'A', score: 85 },
          { range: '80~89%', grade: 'B', score: 75 },
          { range: '70~79%', grade: 'C', score: 65 },
          { range: '70% 미만', grade: 'D', score: 50 },
        ],
        examples: '5건 중 4건 정시 완료, 1건 1주 지연 → 80% (B등급)',
      },
      {
        id: 'pm_margin', name: '프로젝트 이익률',
        unit: '%', formula: '(프로젝트 매출 - 인건비·외주비·경비) / 프로젝트 매출 × 100, 본인 PM 수행 건 평균',
        bands: [
          { range: '30% 이상', grade: 'S', score: 100 },
          { range: '22~29.9%', grade: 'A', score: 85 },
          { range: '15~21.9%', grade: 'B', score: 75 },
          { range: '8~14.9%', grade: 'C', score: 65 },
          { range: '8% 미만 또는 적자', grade: 'D', score: 50 },
        ],
        examples: 'M650 3.5억 수주 → 인건비·경비 2.5억 → 이익률 28.6% (A등급)',
      },
      {
        id: 'pm_customer_csat', name: '고객 만족도 (CSAT)',
        unit: '점/5점', formula: '프로젝트 종료 시 발주처 만족도 평가 점수 평균',
        bands: [
          { range: '4.7 이상', grade: 'S', score: 100 },
          { range: '4.3~4.69', grade: 'A', score: 85 },
          { range: '3.8~4.29', grade: 'B', score: 75 },
          { range: '3.3~3.79', grade: 'C', score: 65 },
          { range: '3.3 미만', grade: 'D', score: 50 },
        ],
        examples: 'M650 발주처 평가 4.5점 + 평창광업소 4.7점 평균 4.6 (A등급)',
      },
    ],
  },
};

const fmtKRW = (n) => Math.round(n || 0).toLocaleString('ko-KR');
const fmtMan = (n) => (Math.round((n || 0) / 10000)).toLocaleString('ko-KR') + '만';

// 직무군 컬러 헬퍼 (Archive·Tech·Biz·PM)
const groupColor = (group) => {
  const map = { Archive: T.groupArchive, Tech: T.groupTech, Biz: T.groupBiz, PM: T.groupPM };
  return map[group] || T.textMute;
};
const groupLabel = (group) => {
  const map = { Archive: 'Archive · 기록관리', Tech: 'Tech · 기술개발', Biz: 'Biz · 사업경영', PM: 'PM · 사업수행' };
  return map[group] || group;
};

function calcCompScore(s, p) {
  if (!s || s.comp_expert == null) return null;
  return (Number(s.comp_expert) * p.comp_expert + Number(s.comp_problem ?? 75) * p.comp_problem + Number(s.comp_learn ?? 75) * p.comp_learn + Number(s.comp_collab ?? 75) * p.comp_collab) / 100;
}
function calcPerfScore(s, p) {
  if (!s || s.perf_kpi == null) return null;
  return (Number(s.perf_kpi) * p.perf_kpi + Number(s.perf_profit ?? 75) * p.perf_profit + Number(s.perf_delivery ?? 75) * p.perf_delivery + Number(s.perf_customer ?? 75) * p.perf_customer) / 100;
}
function calcTotal(c, pf, p) { if (c == null || pf == null) return null; return (c * p.weight_comp + pf * p.weight_perf) / 100; }
function getGrade(t, p) { if (t == null) return null; for (const g of p.grades) if (t >= g.min && t <= g.max) return g; return p.grades[p.grades.length - 1]; }

function calcSalary(emp, scores, policy) {
  const totalCurrent = (Number(emp.baseSalary || 0) + Number(emp.allowance || 0) + Number(emp.mealCar || 0) + Number(emp.qualif || 0)) * 12;
  if (!emp.evalTarget) {
    return { isExcluded: true, grade: null, totalScore: null, newSalary: emp.baseSalary, increase: 0, pi: 0, ps: 0, totalComp2026: totalCurrent, delta: 0 };
  }
  const comp = calcCompScore(scores, policy);
  const perf = calcPerfScore(scores, policy);
  const total = calcTotal(comp, perf, policy);
  const grade = getGrade(total, policy);
  if (!grade) return { isExcluded: false, grade: null, totalScore: null, newSalary: emp.baseSalary, increase: 0, pi: 0, ps: 0, totalComp2026: totalCurrent, delta: 0 };
  const newSalary = Math.round(emp.baseSalary * (1 + grade.increase / 100) / 1000) * 1000;
  const piBase = policy.piBase[emp.level] || 0;
  const pi = Math.round(piBase * grade.piCoef);
  const ps = grade.grade === 'D' ? 0 : Math.round((newSalary * 12 * policy.psRate / 100) / 1000) * 1000;
  const totalComp2026 = newSalary * 12 + (Number(emp.allowance || 0) + Number(emp.mealCar || 0) + Number(emp.qualif || 0)) * 12 + pi + ps;
  return { isExcluded: false, grade, comp, perf, totalScore: total, newSalary, increase: grade.increase, pi, ps, totalComp2026, delta: totalComp2026 - totalCurrent };
}

// ============================================================
// 프로젝트 수익성 데이터 (경영지원부 소관)
// - 프로젝트 종료·연말에 프로젝트별 매출·인건비·제경비·기타비를 입력/업로드하면
//   수익률(영업이익률)이 자동 산정되고, 투입 직원의 기여도 점수로 환산된다.
// - 개인이 프로젝트 수익성을 정량 평가할 수 없으므로, 업적평가의 '프로젝트 기여도'
//   항목은 이 데이터를 근거로 자동 계산된다.
// ============================================================
const PROJECT_ROLES = ['PM', '핵심실무', '참여', '지원'];
// PM 최소 기여도(자동 산정 시 하한) 및 제경비·직접경비 비중 경고 임계값
const PM_MIN_CONTRIBUTION = 20;
const OVERHEAD_WARN_PCT = 30;   // 주의
const OVERHEAD_ALERT_PCT = 45;  // 경고
function expenseWarnLevel(directExpensePct) {
  if (directExpensePct == null) return 'none';
  return directExpensePct >= OVERHEAD_ALERT_PCT ? 'alert' : directExpensePct >= OVERHEAD_WARN_PCT ? 'warn' : 'none';
}

// ── 프로젝트 원가구조 진단 모델 ──────────────────────────────
// 인건비 과다 / 제경비 과다 / 원가 과다(수익성 위험)를 절대 임계값 + 동종 대비(중앙값 편차)로 진단
const LABOR_REV_WARN = 70;    // 인건비/매출 % 주의
const LABOR_REV_ALERT = 85;   // 인건비/매출 % 경고
const COST_REV_WARN = 90;     // 원가율(원가/매출) % 주의
const COST_REV_ALERT = 98;    // 원가율 % 경고
const PEER_DEV_PP = 12;       // 동종 프로젝트 중앙값 대비 초과 폭(%p)

// 공통비(간접비) 풀 · 배부
function overheadPoolTotal(overheads, year) {
  return (overheads || []).filter(o => Number(o.year) === Number(year)).reduce((s, o) => s + (Number(o.amount) || 0), 0);
}
function allocateOverhead(projects, poolTotal, basis) {
  const map = {};
  (projects || []).forEach(p => { map[p.id] = 0; });
  if (!poolTotal || poolTotal <= 0 || basis === 'none') return map;
  const ms = (projects || []).map(p => ({ id: p.id, m: projectMetrics(p) })).filter(x => x.m.cost > 0);
  const val = (x) => basis === 'revenue' ? x.m.revenue : x.m.labor; // 기본: 직접인건비
  const tot = ms.reduce((s, x) => s + val(x), 0);
  if (tot <= 0) return map;
  ms.forEach(x => { map[x.id] = Math.round(poolTotal * val(x) / tot); });
  return map;
}
const ALLOC_LABELS = { labor: '직접인건비 기준', revenue: '매출 기준', none: '미배부' };

// 월별 배부: 각 월의 공통비를 그 달의 프로젝트 직접비 비중으로 배부
function allocateOverheadMonthly(projects, overheads, year) {
  const map = {}; (projects || []).forEach(p => { map[p.id] = 0; });
  const ent = (overheads || []).filter(o => Number(o.year) === Number(year));
  if (ent.length === 0) return map;
  // 프로젝트 월별 직접비 (monthly 없으면 연 직접비를 12개월 균등 분배)
  const pm = {};
  (projects || []).forEach(p => {
    const m = projectMetrics(p);
    if (Array.isArray(p.monthly) && p.monthly.some(v => v > 0)) pm[p.id] = p.monthly.slice(0, 13);
    else { const per = m.cost / 12; pm[p.id] = new Array(13).fill(0).map((_, i) => i === 0 ? 0 : per); }
  });
  const dirM = new Array(13).fill(0);
  Object.values(pm).forEach(arr => arr.forEach((v, i) => dirM[i] += (v || 0)));
  const totalDir = dirM.reduce((s, v) => s + v, 0);
  // 월별 공통비 풀: monthly 있으면 그 값, 없으면 amount를 월별 직접비 비중으로 분산
  const poolM = new Array(13).fill(0);
  ent.forEach(o => {
    if (Array.isArray(o.monthly) && o.monthly.some(v => v > 0)) o.monthly.forEach((v, i) => poolM[i] += (v || 0));
    else { const amt = Number(o.amount) || 0; for (let i = 0; i < 13; i++) poolM[i] += totalDir > 0 ? amt * dirM[i] / totalDir : amt / 12; }
  });
  // 월별 배부
  for (let i = 0; i < 13; i++) {
    if (poolM[i] <= 0 || dirM[i] <= 0) continue;
    (projects || []).forEach(p => { map[p.id] += Math.round(poolM[i] * (pm[p.id][i] || 0) / dirM[i]); });
  }
  return map;
}

function _median(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b); const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function costBenchmark(projects) {
  const ms = projects.map(projectMetrics).filter(m => m.cost > 0 && m.revenue > 0);
  return {
    laborMed: _median(ms.map(m => m.labor / m.cost * 100)),   // 원가 대비 인건비 비중 중앙값
    ohMed: _median(ms.map(m => m.overhead / m.cost * 100)),   // 원가 대비 제경비 비중 중앙값
    n: ms.length,
  };
}
function costDiagnosis(m, bench, cfg) {
  const c = cfg || {};
  const ohWarn = c.ohWarn ?? OVERHEAD_WARN_PCT, ohAlert = c.ohAlert ?? OVERHEAD_ALERT_PCT;
  const lrWarn = c.laborRevWarn ?? LABOR_REV_WARN, lrAlert = c.laborRevAlert ?? LABOR_REV_ALERT;
  const crWarn = c.costRevWarn ?? COST_REV_WARN, crAlert = c.costRevAlert ?? COST_REV_ALERT;
  const dev = c.peerDev ?? PEER_DEV_PP;
  const flags = [];
  if (m.cost <= 0 || m.revenue <= 0) return { flags, status: 'none' };
  const laborPctCost = m.labor / m.cost * 100, ohPctCost = m.overhead / m.cost * 100;
  const laborPctRev = m.labor / m.revenue * 100, costPctRev = m.cost / m.revenue * 100;
  let l = 'none';
  if (laborPctRev >= lrAlert) l = 'alert';
  else if (laborPctRev >= lrWarn) l = 'warn';
  else if (bench && bench.laborMed != null && laborPctCost >= bench.laborMed + dev) l = 'warn';
  if (l !== 'none') flags.push({ type: 'labor', level: l, label: '인건비 과다', detail: `매출대비 ${laborPctRev.toFixed(0)}%` });
  let o = 'none';
  if (ohPctCost >= ohAlert) o = 'alert';
  else if (ohPctCost >= ohWarn) o = 'warn';
  else if (bench && bench.ohMed != null && ohPctCost >= bench.ohMed + dev) o = 'warn';
  if (o !== 'none') flags.push({ type: 'overhead', level: o, label: '제경비 과다', detail: `원가대비 ${ohPctCost.toFixed(0)}%` });
  let cc = 'none';
  if (costPctRev >= crAlert) cc = 'alert';
  else if (costPctRev >= crWarn) cc = 'warn';
  if (cc !== 'none') flags.push({ type: 'cost', level: cc, label: '원가 과다', detail: `원가율 ${costPctRev.toFixed(0)}%` });
  const status = flags.some(f => f.level === 'alert') ? 'alert' : flags.length ? 'warn' : 'none';
  return { flags, status, laborPctCost, ohPctCost, laborPctRev, costPctRev };
}
// PM 기여도 하한 적용: PM이 floor 미만이면 floor로 올리고 나머지를 비례 축소해 합 100 유지
function applyPmFloor(members, floor) {
  if (!members || members.length === 0) return members;
  const pmIdx = members.findIndex(m => m.role === 'PM');
  if (pmIdx < 0) return members;
  const pm = members[pmIdx];
  if ((pm.contribution || 0) >= floor) return members;
  const others = members.filter((_, i) => i !== pmIdx);
  const othersSum = others.reduce((s, m) => s + (m.contribution || 0), 0);
  const deficit = floor - (pm.contribution || 0);
  if (othersSum <= 0) { pm.contribution = 100; return members; }
  others.forEach(m => { m.contribution = Math.max(0, Math.round((m.contribution || 0) - deficit * ((m.contribution || 0) / othersSum))); });
  pm.contribution = floor;
  // 반올림 오차 보정 → 합 100
  const sum = members.reduce((s, m) => s + (m.contribution || 0), 0);
  if (sum !== 100 && others.length) {
    const big = others.reduce((a, b) => (b.contribution > a.contribution ? b : a), others[0]);
    big.contribution = Math.max(0, big.contribution + (100 - sum));
  }
  return members;
}

// 프로젝트 1건의 파생 지표 계산
function projectMetrics(p) {
  const revenue = Number(p.revenue) || 0;      // 매출
  const labor = Number(p.laborCost) || 0;      // 인건비(작업자+관리자)
  const overhead = Number(p.overhead) || 0;    // 제경비
  const other = Number(p.otherCost) || 0;      // 외주·기타 직접비
  // 작업자/관리자 분리 (없으면 전체를 작업자로 간주)
  const hasSplit = (p.workerLabor != null) || (p.mgrLabor != null);
  const worker = hasSplit ? (Number(p.workerLabor) || 0) : labor;
  const mgr = hasSplit ? (Number(p.mgrLabor) || 0) : 0;
  const cost = labor + overhead + other;        // 사업비(총원가)
  const profit = revenue - cost;                // 영업이익
  const rate = revenue > 0 ? (profit / revenue * 100) : null; // 수익률(영업이익률)
  const overheadPct = cost > 0 ? (overhead / cost * 100) : null; // 사업비 대비 제경비 %
  const directExpensePct = cost > 0 ? ((overhead + other) / cost * 100) : null; // 사업비 대비 제경비+직접경비 %
  const planCost = Number(p.planCost) || 0;     // 계획 원가(예산)
  const planExecPct = planCost > 0 ? (cost / planCost * 100) : null; // 계획 대비 집행률
  // 진행률(POC): 수기 progress(%) 우선 → 계획원가 기반 → 월별 최종 집행월/12
  let progress = null;
  if (p.status === 'completed') progress = 1;
  else if (p.progress != null && p.progress !== '') progress = Math.min(1.5, Number(p.progress) / 100);
  else if (planCost > 0) progress = Math.min(1.5, cost / planCost);
  else if (Array.isArray(p.monthly)) { let lm = 0; for (let i = 1; i <= 12; i++) if ((Number(p.monthly[i]) || 0) > 0) lm = i; if (lm > 0) progress = lm / 12; }
  const recognizedRevenue = (progress != null) ? Math.round(revenue * Math.min(progress, 1)) : revenue; // 진행기준 인식매출
  const pocProfit = (progress != null) ? (recognizedRevenue - cost) : profit;                            // 진행기준 공헌이익
  const pocRate = recognizedRevenue > 0 ? (pocProfit / recognizedRevenue * 100) : null;                  // 진행기준 수익률
  return { revenue, labor, worker, mgr, overhead, other, cost, profit, rate, overheadPct, directExpensePct, planCost, planExecPct, progress, recognizedRevenue, pocProfit, pocRate, grade: rateGrade(rate), score: rateToScore(rate) };
}

// 수익률(%) → 점수(0~100) : Biz profit_rate 밴드 기준 통일
function rateToScore(rate) {
  if (rate == null || isNaN(rate)) return null;
  if (rate >= 25) return 100;
  if (rate >= 18) return 85;
  if (rate >= 12) return 75;
  if (rate >= 5) return 65;
  return 50;
}
function rateGrade(rate) {
  const s = rateToScore(rate);
  if (s == null) return null;
  return s >= 90 ? 'S' : s >= 80 ? 'A' : s >= 70 ? 'B' : s >= 60 ? 'C' : 'D';
}

// 직원의 프로젝트 기여도 점수 산정
// 참여 프로젝트별 (수익률점수 × 기여도비중)의 가중평균
// 기타(비프로젝트) 사업: 유지보수 연단가 등 계약구조가 달라 프로젝트 수익성 평가에서 제외 (경영보고서에 별도 표기)
const ETC_PROJECT_IDS = ['2026-005', '2026-009', '2026-013'];
function isEtcProject(p) { return !!p && (p.etc === true || ETC_PROJECT_IDS.includes(p.id)); }

// 평가용 프로젝트 점수: 완료 사업=확정 수익률, 진행중=진행기준(pocRate) 수익률 사용.
// 진행중 사업의 '계약 전액 매출' 왜곡(초기 사업 과대·기간 불일치)이 개인 평가에 흘러들지 않게 보정.
function evalProjectScore(p, mm) {
  if (!mm) return null;
  if (p && p.status === 'completed') return rateToScore(mm.rate);
  const r = (mm.pocRate != null) ? mm.pocRate : mm.rate;
  return rateToScore(r);
}

function calcContributionScore(empId, projects, year) {
  const mine = (projects || []).filter(p =>
    !isEtcProject(p) &&
    (year == null || Number(p.year) === Number(year)) &&
    (p.members || []).some(m => m.empId === empId)
  );
  if (mine.length === 0) return null;
  let wsum = 0, ssum = 0;
  const breakdown = [];
  mine.forEach(p => {
    const m = (p.members || []).find(x => x.empId === empId);
    const mm = projectMetrics(p);
    const ps = evalProjectScore(p, mm);   // 완료=확정, 진행중=진행기준 수익률 점수
    if (ps == null) return;
    const w = Math.max(0, Number(m.contribution) || 0);
    if (w < EVAL_CFG.coreMin) return;   // 소액 참여(제안서지원 등)는 수행 기여에서 제외(기준: 정책설정)
    wsum += w;
    ssum += ps * w;
    breakdown.push({ project: p, member: m, metrics: mm, weight: w });
  });
  if (wsum === 0) return null;
  const score = Math.round(ssum / wsum);
  const grade = score >= 90 ? 'S' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';
  return { score, grade, breakdown };
}

// 수주(제안) 기여: 수주 확정된 제안에서 PM/참여인력에게 그 사업 수익률 점수를 크레딧 (PM 가중 1.0, 참여 0.6)
function calcBidScore(empName, proposals, projects, year) {
  const won = (proposals || []).filter(p => p.status === '수주' && p.wonProjectId);
  let wsum = 0, ssum = 0; const breakdown = [];
  won.forEach(p => {
    const isPM = p.pm && p.pm === empName;
    const isPart = (p.participants || []).includes(empName);
    const isSupp = (p.support || []).includes(empName);   // 서류제출·관리 지원 인력
    if (!isPM && !isPart && !isSupp) return;
    const proj = (projects || []).find(x => x.id === p.wonProjectId);
    if (!proj || isEtcProject(proj) || (year != null && Number(proj.year) !== Number(year))) return;
    const mm = projectMetrics(proj);
    const ps = evalProjectScore(proj, mm);
    if (ps == null) return;
    const w = (isPM ? EVAL_CFG.bidPmW : isPart ? EVAL_CFG.bidPartW : EVAL_CFG.bidSuppW) / 100;
    if (w <= 0) return;
    wsum += w; ssum += ps * w;
    breakdown.push({ proposal: p, project: proj, role: isPM ? 'PM' : isPart ? '참여' : '지원', metrics: mm });
  });
  if (wsum === 0) return null;
  const score = Math.round(ssum / wsum);
  return { score, breakdown };
}

// ── 비매출(지원) 조직 평가 트랙 ──
// 이름 → 개인 MBO 점수(0~100). 여기에 넣은 인원은 프로젝트 수익률이 아니라 [전사 성과 40% + MBO 60%]로 평가.
// MBO 점수는 관리자가 목표 대비 달성도를 입력(미입력이면 전사 성과 점수만 적용).
const SUPPORT_TRACK = {
  '오누리': null,   // 경영지원 주임(2026.03 신규입사) — MBO 미입력: 전사성과점수 적용. 평가 시 0~100 점수로 교체
};
function isSupportTrack(name) { return name != null && Object.prototype.hasOwnProperty.call(SUPPORT_TRACK, name); }
function calcSupportScore(name, companyScore) {
  const cs = (companyScore != null) ? companyScore : 60;
  const mbo = SUPPORT_TRACK[name];
  if (mbo == null) return { score: cs, mbo: null, company: cs };
  return { score: Math.round(cs * 0.4 + mbo * 0.6), mbo, company: cs };
}

// ── 영업(수주) 트랙 ──
// 여기에 넣은 인원(영업·사업개발)은 수행 기여가 아니라 [수주(제안) 실적]으로 평가.
// 담당 사업이 있어도 그건 수행이 아니므로 수행 점수를 만들지 않음. 수주 실적이 없으면 기본점수(SALES_FLOOR).
const SALES_TRACK = {
  '오창민': null,
};
function isSalesTrack(name) { return name != null && Object.prototype.hasOwnProperty.call(SALES_TRACK, name); }

// 인사평가용 종합 기여 점수 = 수행/수주 가중합 + 겸직·다축 보너스 (계수는 정책설정에서 조정 → EVAL_CFG로 동기화)
const EVAL_CFG = { execW: 70, bidW: 30, coreMin: 20, bonusMulti: 5, bonusJikjik: 5, salesFloor: 20, bidPmW: 100, bidPartW: 60, bidSuppW: 30 };
function calcEvalScore(empId, empName, projects, proposals, year, emp) {
  const ex = calcContributionScore(empId, projects, year);
  const bid = calcBidScore(empName, proposals, projects, year);
  const exS = ex ? ex.score : null, bidS = bid ? bid.score : null;
  let base = null;
  if (exS != null && bidS != null) base = Math.round((exS * EVAL_CFG.execW + bidS * EVAL_CFG.bidW) / (EVAL_CFG.execW + EVAL_CFG.bidW));
  else if (exS != null) base = exS;
  else if (bidS != null) base = bidS;
  if (base == null) return null;
  const multi = (exS != null && bidS != null);
  const jikjik = !!(emp && (String(emp.note || '').includes('겸직') || String(emp.dept || '').includes('/')));
  let bonus = 0;
  if (multi) bonus += EVAL_CFG.bonusMulti;
  if (jikjik) bonus += EVAL_CFG.bonusJikjik;
  const score = Math.min(100, base + bonus);
  const grade = score >= 90 ? 'S' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';
  return { score, grade, exec: exS, bid: bidS, hasBid: bidS != null, hasExec: exS != null, base, bonus, multi, jikjik };
}

// 초기 시드 데이터 (예시 - 실제 데이터로 교체/업로드)
const INITIAL_PROJECTS = [
  {
    id: 'PRJ-2026-001', name: '동원탄좌 M650 아카이브 2차년도', client: '강원랜드 사업본부',
    year: 2026, period: '2026.01~2026.12', status: 'ongoing',
    revenue: 350000000, laborCost: 210000000, workerLabor: 150000000, mgrLabor: 60000000, overhead: 45000000, otherCost: 30000000,
    members: [
      { empId: 'K-180501', role: 'PM', contribution: 45 },
      { empId: 'K-170801', role: '핵심실무', contribution: 35 },
    ],
    note: '메타데이터 1,500점 · ISAD(G) 분류',
  },
  {
    id: 'PRJ-2026-002', name: '광역시 공공기록물 정리·평가', client: '○○광역시 기록관',
    year: 2026, period: '2026.03~2026.09', status: 'completed',
    revenue: 180000000, laborCost: 120000000, workerLabor: 88000000, mgrLabor: 32000000, overhead: 22000000, otherCost: 10000000,
    members: [
      { empId: 'K-170801', role: 'PM', contribution: 50 },
      { empId: 'K-180501', role: '참여', contribution: 20 },
    ],
    note: '완료 · 발주처 CSAT 4.4',
  },
];

// ============================================================
// 메인 App
// ============================================================
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('앱 오류:', error, info); }
  backup = () => {
    try {
      const keys = ['koition_hr_v6', 'koition_hr_users', 'koition_hr_last_backup'];
      const dump = {};
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('koition') >= 0) dump[k] = localStorage.getItem(k); }
      keys.forEach(k => { if (!(k in dump)) { const v = localStorage.getItem(k); if (v) dump[k] = v; } });
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'koition-hr-백업-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    } catch (e) { alert('백업 실패: ' + e.message); }
  };
  resetData = () => {
    if (!window.confirm('업무 데이터(프로젝트·평가 등)를 초기화합니다.\n계정은 유지됩니다. 먼저 [백업 다운로드]를 하셨나요?')) return;
    try {
      const remove = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('koition') >= 0 && k !== 'koition_hr_users') remove.push(k); }
      remove.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    } catch (e) { alert('초기화 실패: ' + e.message); }
  };
  resetAll = () => {
    if (!window.confirm('계정을 포함한 모든 데이터를 초기화합니다.\n초기 관리자(cys / uj!5n3Rs)로 재설정됩니다. 계속할까요?')) return;
    try {
      const remove = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf('koition') >= 0) remove.push(k); }
      remove.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    } catch (e) { alert('초기화 실패: ' + e.message); }
  };
  render() {
    if (!this.state.error) return this.props.children;
    const err = this.state.error;
    return (
      <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: "'Pretendard', 'Malgun Gothic', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 560, width: '100%', background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#B42318', marginBottom: 8 }}>⚠ 화면 표시 중 오류가 발생했습니다</div>
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
            대부분 이전 버전에서 저장된 데이터와 새 버전의 충돌입니다. 아래 순서대로 진행하세요:<br />
            ① <strong>백업 다운로드</strong>(현재 데이터 보존) → ② <strong>업무 데이터 초기화</strong>(계정 유지) → 재로그인 후 [불러오기]로 백업 복원 시도
          </div>
          <div style={{ background: '#FBEDEC', border: '1px solid #F1C3C0', borderRadius: 8, padding: '10px 12px', fontSize: 11.5, color: '#7A2E28', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginBottom: 16, maxHeight: 120, overflow: 'auto' }}>
            {String(err && (err.message || err))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={this.backup} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#1B3A6F', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>① 백업 다운로드</button>
            <button onClick={this.resetData} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #D97706', background: '#fff', color: '#B45309', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>② 업무 데이터 초기화(계정 유지)</button>
            <button onClick={this.resetAll} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #B42318', background: '#fff', color: '#B42318', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>전체 초기화(계정 포함)</button>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 12 }}>오류가 반복되면 위 빨간 박스의 메시지를 관리자(경영지원)에게 전달하세요.</div>
        </div>
      </div>
    );
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);  // 해시된 비밀번호 포함 사용자 배열
  const [usersInitialized, setUsersInitialized] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [policy, setPolicy] = useState(INITIAL_POLICY);
  const [scores, setScores] = useState({});
  const [selfScores, setSelfScores] = useState({});
  const [comments, setComments] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [projects, setProjects] = useState(INITIAL_PROJECTS);  // 프로젝트별 수익성 데이터
  const [proposals, setProposals] = useState([]);  // 수주 파이프라인(사업제안현황)
  const [overheads, setOverheads] = useState([]);  // 공통비(간접비) 풀: {id, year, category, amount, note}
  const [empLedger, setEmpLedger] = useState([]);  // 직원별 경비/수주: {name, empId, card, newOrder, year}
  const [peerEvals, setPeerEvals] = useState({});  // 동료평가: {targetEmpId: {raterEmpId: {collab,resp,expert,keep,change}}}
  const [loans, setLoans] = useState([
    { id: 'LOAN-1', empId: 'K-240201', name: '오창민', principal: 30000000, rate: 4.6, startDate: '2026-01-01', monthly: 1000000, repayments: [], note: '회사 대출 — 상환약정 체결 예정' },
  ]);  // 임직원 대여금 원장
  const [receivables, setReceivables] = useState([]);  // 수금 관리: {id,project,client,amount,dueDate,paidDate,note}
  const [history, setHistory] = useState([HISTORY_2025]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [historyHighlight, setHistoryHighlight] = useState(null);  // {empId, year}
  const [toast, setToast] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);  // 본인 비밀번호 변경
  const [adminResetTarget, setAdminResetTarget] = useState(null);     // admin이 타인 비밀번호 초기화할 대상
  const [manualContent, setManualContent] = useState(MANUAL_CONTENT);  // 매뉴얼 콘텐츠 (admin 편집 가능)
  const currentYear = 2026;
  
  // 매뉴얼 콘텐츠 localStorage 동기화
  useEffect(() => {
    try {
      const stored = localStorage.getItem('koition_hr_manual');
      if (stored) {
        const parsed = JSON.parse(stored);
        // 버전이 다르면 기본값 사용 (대규모 구조 변경 시 안전)
        if (parsed.version === MANUAL_CONTENT.version) {
          setManualContent(parsed);
        }
      }
    } catch (e) {
      console.error('매뉴얼 로드 실패:', e);
    }
  }, []);
  
  // 매뉴얼 저장 핸들러
  const handleSaveManual = (newContent) => {
    try {
      localStorage.setItem('koition_hr_manual', JSON.stringify(newContent));
      setManualContent(newContent);
      showToast('매뉴얼이 저장되었습니다');
      return { success: true };
    } catch (e) {
      console.error('매뉴얼 저장 실패:', e);
      return { success: false, error: e.message };
    }
  };
  
  // 매뉴얼 기본값 복원
  const handleResetManual = () => {
    if (!window.confirm('매뉴얼을 초기 기본값으로 되돌리시겠습니까? 모든 수정사항이 사라집니다.')) return;
    try {
      localStorage.removeItem('koition_hr_manual');
      setManualContent(MANUAL_CONTENT);
      showToast('매뉴얼이 기본값으로 복원되었습니다');
    } catch (e) {
      console.error('매뉴얼 복원 실패:', e);
    }
  };
  
  // 사용자 데이터 초기 로드 (최초 1회 비밀번호 해시화)
  useEffect(() => {
    const initializeUsers = async () => {
      try {
        const stored = localStorage.getItem('koition_hr_users');
        if (stored) {
          const parsed = JSON.parse(stored);
          // 이미 해시된 데이터: passwordHash 필드 존재
          if (parsed.length > 0 && parsed[0].passwordHash) {
            // 마이그레이션: 시스템관리자 최영숙(cys)을 최고관리자로 승격 (비밀번호는 기존 것 유지)
            let migrated = parsed.map(u => u.username === 'cys' ? { ...u, role: 'admin', deptScope: '전체' } : u);
            // cys 계정이 삭제된 경우 초기 비밀번호로 복구 생성
            if (!migrated.some(u => u.username === 'cys')) {
              migrated = [...migrated, { username: 'cys', passwordHash: await hashPassword('uj!5n3Rs'), role: 'admin', name: '최영숙', empId: 'K-140403', deptScope: '전체', mustChangePassword: true, lastPasswordChange: null }];
            }
            localStorage.setItem('koition_hr_users', JSON.stringify(migrated));
            setUsers(migrated);
            setUsersInitialized(true);
            return;
          }
        }
        // 첫 실행: INITIAL_USERS의 평문 비밀번호를 해시로 변환해 저장
        const hashedUsers = await Promise.all(
          INITIAL_USERS.map(async u => ({
            username: u.username,
            passwordHash: await hashPassword(u.password),
            role: u.role,
            name: u.name,
            empId: u.empId,
            deptScope: u.deptScope,
            mustChangePassword: true,  // 첫 로그인 시 비밀번호 변경 권장
            lastPasswordChange: null,
          }))
        );
        localStorage.setItem('koition_hr_users', JSON.stringify(hashedUsers));
        setUsers(hashedUsers);
        setUsersInitialized(true);
      } catch (e) {
        console.error('User initialization failed:', e);
        setUsersInitialized(true);  // 실패해도 로그인 화면은 표시
      }
    };
    initializeUsers();
  }, []);
  
  // users 변경 시 자동 저장
  useEffect(() => {
    if (usersInitialized && users.length > 0) {
      try {
        localStorage.setItem('koition_hr_users', JSON.stringify(users));
      } catch (e) {
        console.error('User save failed:', e);
      }
    }
  }, [users, usersInitialized]);
  
  // 본인 비밀번호 변경
  const handleChangeOwnPassword = async (currentPassword, newPassword) => {
    const currentUser = users.find(u => u.username === user.username);
    if (!currentUser) return { success: false, error: '사용자를 찾을 수 없습니다' };
    
    const isCurrentValid = await verifyPassword(currentPassword, currentUser.passwordHash);
    if (!isCurrentValid) return { success: false, error: '현재 비밀번호가 일치하지 않습니다' };
    
    const validation = validatePassword(newPassword, currentUser.username, currentUser.name);
    if (!validation.valid) return { success: false, error: validation.errors.join(' / ') };
    
    const newHash = await hashPassword(newPassword);
    setUsers(prev => prev.map(u => 
      u.username === user.username 
        ? { ...u, passwordHash: newHash, mustChangePassword: false, lastPasswordChange: new Date().toISOString() }
        : u
    ));
    setUser(prev => ({ ...prev, mustChangePassword: false }));
    return { success: true };
  };
  
  // admin이 타인 비밀번호 초기화
  const handleAdminResetPassword = async (targetUsername, newPassword) => {
    if (user.role !== 'admin') return { success: false, error: '권한이 없습니다' };
    
    const targetUser = users.find(u => u.username === targetUsername);
    if (!targetUser) return { success: false, error: '대상 사용자를 찾을 수 없습니다' };
    
    const validation = validatePassword(newPassword, targetUser.username, targetUser.name);
    if (!validation.valid) return { success: false, error: validation.errors.join(' / ') };
    
    const newHash = await hashPassword(newPassword);
    setUsers(prev => prev.map(u => 
      u.username === targetUsername 
        ? { ...u, passwordHash: newHash, mustChangePassword: true, lastPasswordChange: new Date().toISOString() }
        : u
    ));
    return { success: true };
  };
  
  // 본인 아이디(username) 변경 (admin 전용)
  const handleChangeUsername = async (currentPassword, newUsername) => {
    if (user.role !== 'admin') return { success: false, error: '아이디 변경은 admin 전용 기능입니다' };
    
    // 1. 현재 비밀번호 검증
    const currentUser = users.find(u => u.username === user.username);
    if (!currentUser) return { success: false, error: '사용자를 찾을 수 없습니다' };
    const isCurrentValid = await verifyPassword(currentPassword, currentUser.passwordHash);
    if (!isCurrentValid) return { success: false, error: '현재 비밀번호가 일치하지 않습니다' };
    
    // 2. 새 아이디 유효성 검증
    const trimmed = (newUsername || '').trim();
    if (!trimmed) return { success: false, error: '새 아이디를 입력하세요' };
    if (trimmed.length < 3) return { success: false, error: '아이디는 최소 3자 이상이어야 합니다' };
    if (trimmed.length > 20) return { success: false, error: '아이디는 최대 20자까지 가능합니다' };
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return { success: false, error: '아이디는 영문, 숫자, 언더바(_), 하이픈(-)만 사용 가능합니다' };
    if (trimmed === user.username) return { success: false, error: '현재 아이디와 동일합니다' };
    
    // 3. 중복 확인
    const exists = users.some(u => u.username.toLowerCase() === trimmed.toLowerCase() && u.username !== user.username);
    if (exists) return { success: false, error: '이미 사용 중인 아이디입니다' };
    
    // 4. 변경 수행
    setUsers(prev => prev.map(u => 
      u.username === user.username 
        ? { ...u, username: trimmed }
        : u
    ));
    
    // 5. 현재 user 객체도 업데이트
    setUser(prev => ({ ...prev, username: trimmed }));
    
    return { success: true, newUsername: trimmed };
  };

  useEffect(() => {
    try {
      const res = localStorage.getItem('koition_hr_v6');
      if (res) {
        const data = JSON.parse(res);
        if (data.employees) setEmployees(data.employees);
        if (data.policy) {
          // 기존 정책에 coverStats/coverImage/promotion이 없으면 기본값 보충 (마이그레이션)
          const migrated = { 
            ...data.policy, 
            coverStats: data.policy.coverStats || INITIAL_POLICY.coverStats,
            coverImage: data.policy.coverImage || INITIAL_POLICY.coverImage,
            promotion: data.policy.promotion || INITIAL_POLICY.promotion,
            diag: { ...INITIAL_POLICY.diag, ...(data.policy.diag || {}) },
            targets: data.policy.targets || INITIAL_POLICY.targets,
            allocation: { ...INITIAL_POLICY.allocation, ...(data.policy.allocation || {}) }
          };
          setPolicy(migrated);
        }
        if (data.scores) setScores(data.scores);
        if (data.selfScores) setSelfScores(data.selfScores);
        if (data.comments) setComments(data.comments);
        if (data.submissions) setSubmissions(data.submissions);
        if (data.projects) setProjects(data.projects);
        if (data.proposals) setProposals(data.proposals);
        if (data.overheads) setOverheads(data.overheads);
        if (data.empLedger) setEmpLedger(data.empLedger);
        if (data.peerEvals) setPeerEvals(data.peerEvals);
        if (data.loans) setLoans(data.loans);
        if (data.receivables) setReceivables(data.receivables);
        if (data.history) setHistory(data.history);
      }
    } catch (e) {}
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  };

  const results = useMemo(() => {
    const map = {};
    employees.forEach(e => { map[e.id] = calcSalary(e, scores[e.id], policy); });
    return map;
  }, [employees, scores, policy]);

  const stats = useMemo(() => {
    const targets = employees.filter(e => e.evalTarget);
    const completed = targets.filter(e => results[e.id]?.grade).length;
    const gradeCount = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    targets.forEach(e => { const g = results[e.id]?.grade?.grade; if (g) gradeCount[g]++; });
    const total2025 = employees.reduce((s, e) => s + (Number(e.baseSalary || 0) + Number(e.allowance || 0) + Number(e.mealCar || 0) + Number(e.qualif || 0)) * 12, 0);
    const total2026 = employees.reduce((s, e) => s + (results[e.id]?.totalComp2026 || 0), 0);
    return { totalEmp: employees.length, evalTargets: targets.length, completed, gradeCount, total2025, total2026, delta: total2026 - total2025, deltaPct: total2025 > 0 ? ((total2026 - total2025) / total2025 * 100) : 0 };
  }, [employees, results]);

  const handleSave = () => {
    try {
      localStorage.setItem('koition_hr_v6', JSON.stringify({ employees, policy, scores, selfScores, comments, submissions, projects, proposals, overheads, empLedger, peerEvals, loans, receivables, history }));
      showToast('데이터가 저장되었습니다');
    } catch (e) { showToast('저장 실패', 'error'); }
  };
  const markBackup = () => { try { localStorage.setItem('koition_hr_last_backup', String(Date.now())); } catch(e){} };
  const [backupDue, setBackupDue] = useState(false);
  useEffect(() => {
    try {
      const t = Number(localStorage.getItem('koition_hr_last_backup') || 0);
      setBackupDue(Date.now() - t > 7 * 24 * 3600 * 1000);
    } catch(e){}
  }, [user]);
  const handleExport = () => {
    markBackup(); setBackupDue(false);
    const data = { year: currentYear, employees, policy, scores, selfScores, comments, submissions, projects, proposals, overheads, empLedger, peerEvals, loans, receivables, history };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `koition_hr_${currentYear}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('JSON 파일이 다운로드되었습니다');
  };
  const handleImport = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.employees) setEmployees(data.employees);
        if (data.policy) {
          const migrated = { 
            ...data.policy, 
            coverStats: data.policy.coverStats || INITIAL_POLICY.coverStats,
            coverImage: data.policy.coverImage || INITIAL_POLICY.coverImage,
            promotion: data.policy.promotion || INITIAL_POLICY.promotion,
            diag: { ...INITIAL_POLICY.diag, ...(data.policy.diag || {}) },
            targets: data.policy.targets || INITIAL_POLICY.targets,
            allocation: { ...INITIAL_POLICY.allocation, ...(data.policy.allocation || {}) }
          };
          setPolicy(migrated);
        }
        if (data.scores) setScores(data.scores);
        if (data.selfScores) setSelfScores(data.selfScores);
        if (data.comments) setComments(data.comments);
        if (data.submissions) setSubmissions(data.submissions);
        if (data.projects) setProjects(data.projects);
        if (data.proposals) setProposals(data.proposals);
        if (data.overheads) setOverheads(data.overheads);
        if (data.empLedger) setEmpLedger(data.empLedger);
        if (data.peerEvals) setPeerEvals(data.peerEvals);
        if (data.loans) setLoans(data.loans);
        if (data.receivables) setReceivables(data.receivables);
        if (data.history) setHistory(data.history);
        showToast('데이터를 불러왔습니다');
      } catch (err) { showToast('파일 형식이 올바르지 않습니다', 'error'); }
    };
    reader.readAsText(file);
  };

  const updateScore = (id, field, value) => {
    const v = value === '' ? null : Math.max(0, Math.min(100, Number(value)));
    setScores(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: v } }));
  };
  const updateSelfScore = (id, field, value) => {
    const v = value === '' ? null : Math.max(0, Math.min(100, Number(value)));
    setSelfScores(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: v } }));
  };
  // 정책설정의 기여 산정 계수를 평가엔진(EVAL_CFG)에 동기화
  useEffect(() => {
    EVAL_CFG.execW = Number(policy.contrib_exec_w ?? 70);
    EVAL_CFG.bidW = Number(policy.contrib_bid_w ?? 30);
    EVAL_CFG.coreMin = Number(policy.contrib_core_min ?? 20);
    EVAL_CFG.bonusMulti = Number(policy.contrib_bonus_multi ?? 5);
    EVAL_CFG.bonusJikjik = Number(policy.contrib_bonus_jikjik ?? 5);
    EVAL_CFG.salesFloor = Number(policy.contrib_sales_floor ?? 20);
    EVAL_CFG.bidPmW = Number(policy.contrib_bid_pm_w ?? 100);
    EVAL_CFG.bidPartW = Number(policy.contrib_bid_part_w ?? 60);
    EVAL_CFG.bidSuppW = Number(policy.contrib_bid_supp_w ?? 30);
  }, [policy]);

  const updateComment = (id, field, value) => {
    setComments(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  };
  const updatePeerEval = (raterId, targetId, data) => {
    setPeerEvals(prev => ({ ...prev, [targetId]: { ...(prev[targetId] || {}), [raterId]: data } }));
  };
  const finalizeEval = (id) => {
    setSubmissions(prev => ({ ...prev, [id]: prev[id] === 'finalized' ? 'self_submitted' : 'finalized' }));
  };
  const closeYearSnapshot = () => {
    const gradeMap = {}; const scoreMap = {};
    (employees || []).forEach(e => {
      const r = results[e.id];
      if (r && r.total != null) { gradeMap[e.id] = r.grade?.grade || null; scoreMap[e.id] = Math.round(r.total); }
    });
    const snap = {
      year: currentYear, closedDate: new Date().toISOString().slice(0, 10),
      policy: JSON.parse(JSON.stringify(policy)),
      gradeMap, scoreMap,
      comments: JSON.parse(JSON.stringify(comments)),
      peerEvals: JSON.parse(JSON.stringify(peerEvals)),
      note: '연말 확정 스냅샷 (점수·등급·정책·목표·동료평가 고정 보관)',
    };
    setHistory(prev => {
      const others = (prev || []).filter(h => Number(h.year) !== Number(currentYear));
      return [...others, snap].sort((a, b) => a.year - b.year);
    });
    markBackup();
    alert(`${currentYear}년 평가 스냅샷이 저장되었습니다.\n저장 후 반드시 [내보내기]로 JSON 백업을 내려받아 보관하세요.`);
  };
  const submitSelfEval = (id) => {
    setSubmissions(prev => ({ ...prev, [id]: prev[id] === 'finalized' ? 'finalized' : 'self_submitted' }));
    showToast('자기 평가가 제출되었습니다');
  };
  const copySelfToEvaluator = (id) => {
    const self = selfScores[id]; if (!self) return;
    setScores(prev => ({ ...prev, [id]: { ...self } }));
    showToast('자기 평가 점수를 가져왔습니다');
  };

  // 직원 추가/수정/삭제 (admin 전용)
  const addEmployee = (emp) => {
    setEmployees(prev => [...prev, emp]);
    showToast(`${emp.name}님이 추가되었습니다`);
  };
  const updateEmployee = (id, updated) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    showToast(`${updated.name || ''}님 정보가 수정되었습니다`);
  };
  const deleteEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast(`${emp?.name || ''}님이 삭제되었습니다`);
  };

  // 프로젝트 수익성 추가/수정/삭제 (admin·경영지원부 전용)
  const upsertProject = (proj) => {
    setProjects(prev => {
      const exists = prev.some(p => p.id === proj.id);
      return exists ? prev.map(p => p.id === proj.id ? proj : p) : [...prev, proj];
    });
    showToast(`프로젝트 "${proj.name}" 저장됨`);
  };
  const deleteProject = (id) => {
    const p = projects.find(x => x.id === id);
    setProjects(prev => prev.filter(x => x.id !== id));
    showToast(`프로젝트 "${p?.name || ''}" 삭제됨`);
  };
  // CSV 등 일괄 업로드 (병합: 동일 id는 덮어쓰기)
  const bulkUpsertProjects = (rows) => {
    setProjects(prev => {
      const map = new Map(prev.map(p => [p.id, p]));
      rows.forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    });
    showToast(`${rows.length}개 프로젝트를 반영했습니다`);
  };

  const bulkUpsertProposals = (rows) => {
    if (!rows || rows.length === 0) return;
    setProposals(prev => {
      const map = new Map(prev.map(p => [p.id, p]));
      rows.forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    });
  };
  const deleteProposal = (id) => setProposals(prev => prev.filter(x => x.id !== id));
  // 수주 확정: 제안 → 신규 프로젝트 생성 + 수주 인력 보상(직원별 원장 신규수주 + 수주 기여점수 자동)
  const winProposal = (proposalId) => {
    const p = (proposals || []).find(x => x.id === proposalId);
    if (!p) return;
    if (p.status === '수주' && p.wonProjectId) { alert('이미 수주 확정된 제안입니다.'); return; }
    if (!window.confirm(`[${p.name}]\n수주 확정 처리할까요?\n\n· 신규 프로젝트가 생성됩니다 (계약금액 = 사업예산 ${fmtMoney(p.budget)}원)\n· PM·제안참여인력에게 수주 기여점수가 자동 반영됩니다\n· PM의 신규수주 실적(직원별 원장)에 기록됩니다`)) return;
    // 새 프로젝트 ID: 2026-0NN 다음 번호
    const yr = currentYear || new Date().getFullYear();
    const nums = (projects || []).map(x => { const m = String(x.id || '').match(/(\d{4})-(\d{3})/); return m ? Number(m[2]) : 0; });
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    const newId = `${yr}-${String(next).padStart(3, '0')}`;
    // PM 사번 매칭
    const pmEmp = (employees || []).find(e => String(e.name).trim() === String(p.pm || '').trim());
    const newProject = {
      id: newId, name: p.name, client: p.client || '', year: yr,
      status: 'ongoing', progress: 0,
      revenue: Number(p.budget) || 0, laborCost: 0, workerLabor: 0, mgrLabor: 0, overhead: 0, otherCost: 0,
      members: pmEmp ? [{ empId: pmEmp.id, role: 'PM', contribution: 0 }] : [],
      note: `제안 수주 확정 (${new Date().toISOString().slice(0, 10)}) — 인건비·경비는 월마감/사업관리 업로드로 반영`,
    };
    setProjects(prev => [...(prev || []), newProject]);
    setProposals(prev => (prev || []).map(x => x.id === proposalId ? { ...x, status: '수주', wonProjectId: newId } : x));
    // PM 신규수주 실적 기록 (직원별 원장)
    if (pmEmp) {
      setEmpLedger(prev => {
        const list = [...(prev || [])];
        const idx = list.findIndex(l => (l.empId && l.empId === pmEmp.id) || l.name === pmEmp.name);
        if (idx >= 0) list[idx] = { ...list[idx], newOrder: (Number(list[idx].newOrder) || 0) + (Number(p.budget) || 0) };
        else list.push({ empId: pmEmp.id, name: pmEmp.name, card: 0, newOrder: Number(p.budget) || 0, year: yr });
        return list;
      });
    }
    showToast(`수주 확정: ${newId} 프로젝트 생성${pmEmp ? ` · ${pmEmp.name} 신규수주 ${fmtMoney(p.budget)}원 기록` : ' (PM 미매칭 — 원장 기록 생략)'}`);
  };

  const bulkSetEmpLedger = (rows) => { if (rows && rows.length) setEmpLedger(rows); };
  const upsertOverhead = (item) => setOverheads(prev => {
    const map = new Map(prev.map(o => [o.id, o]));
    map.set(item.id, item);
    return Array.from(map.values());
  });
  const deleteOverhead = (id) => setOverheads(prev => prev.filter(x => x.id !== id));
  const bulkUpsertOverheads = (rows) => {
    if (!rows || rows.length === 0) return;
    setOverheads(prev => {
      const map = new Map(prev.map(o => [o.id, o]));
      rows.forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    });
  };

  // 결과 상세 패널에서 다년도 이력 메뉴로 이동 + 특정 직원·연도 강조
  const navigateToHistory = (empId, year) => {
    setHistoryHighlight({ empId, year });
    setTab('history');
    // 페이지 이동 후 5초 뒤 강조 해제
    setTimeout(() => setHistoryHighlight(null), 5000);
  };

  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => { setNavOpen(false); }, [tab]);

  if (!user) {
    if (!usersInitialized) {
      return (
        <div style={{ 
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: T.surface, fontFamily: FONT, fontSize: 13, color: T.textMute
        }}>
          시스템 초기화 중...
        </div>
      );
    }
    return <LoginView onLogin={setUser} policy={policy} users={users} />;
  }

  const allMenus = [
    { id: 'dashboard', label: '대시보드', icon: BarChart3, roles: ['admin', 'manager', 'evaluator', 'employee'] },
    { id: 'self', label: '내 평가', icon: UserCheck, roles: ['employee', 'evaluator', 'manager'] },
    { id: 'employees', label: '직원 관리', icon: Users, roles: ['admin'] },
    { id: 'evaluation', label: '평가 입력', icon: FileText, roles: ['admin', 'manager', 'evaluator'] },
    { id: 'projects', label: '프로젝트 수익성', icon: Briefcase, roles: ['admin', 'manager'] },
    { id: 'report', label: '경영보고서', icon: FileBarChart, roles: ['admin'] },
    { id: 'monthclose', label: '월마감 변환', icon: Upload, roles: ['admin', 'manager'] },
    { id: 'loans', label: '대여금 관리', icon: Wallet, roles: ['admin'] },
    { id: 'receivables', label: '수금 관리', icon: Calendar, roles: ['admin'] },
    { id: 'results', label: '평가 결과', icon: Award, roles: ['admin', 'manager'] },
    { id: 'salary', label: '급여 산정', icon: Wallet, roles: ['admin'] },
    { id: 'analytics', label: '통계 분석', icon: PieIcon, roles: ['admin', 'manager'] },
    { id: 'history', label: '다년도 이력', icon: History, roles: ['admin'] },
    { id: 'notify', label: '이메일 통보', icon: Mail, roles: ['admin'] },
    { id: 'policy', label: '정책 설정', icon: Settings, roles: ['admin'] },
    { id: 'guide', label: '사용 가이드', icon: AlertCircle, roles: ['admin', 'manager', 'evaluator', 'employee'] },
  ];
  // 각자대표(정일영·최재교): 전사 경영보고서·평가정보 열람 허용 (대여금·수금·정책 편집은 admin 전용 유지)
  const EXEC_IDS = ['K-140401', 'K-140402'];
  const isExec = user.role === 'admin' || EXEC_IDS.includes(user.empId);
  const visibleMenus = allMenus.filter(m => m.roles.includes(user.role) || (isExec && ['report', 'loans', 'receivables'].includes(m.id)));
  const visibleEmployees = employees.filter(e => {
    if (user.role === 'admin' || EXEC_IDS.includes(user.empId)) return true;  // 임원=전사 조회
    if (user.role === 'manager' || user.role === 'evaluator') return String(e.dept || '').includes(user.deptScope || '') || e.dept === user.deptScope;
    return e.id === user.empId;
  });

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', background: T.bg, fontFamily: FONT, color: T.text }}>
        <Header user={user} onLogout={() => { setUser(null); setTab('dashboard'); }} 
          handleSave={handleSave} handleExport={handleExport} handleImport={handleImport}
          onChangePassword={() => setPasswordModalOpen(true)} />
        {isMobile && (
          <button onClick={() => setNavOpen(o => !o)} aria-label="메뉴"
            style={{ position: 'fixed', bottom: 18, right: 18, zIndex: 1200, width: 52, height: 52, borderRadius: 26, border: 'none', background: T.brand, color: '#fff', fontSize: 22, boxShadow: '0 4px 14px rgba(0,0,0,0.25)', cursor: 'pointer' }}>
            {navOpen ? '✕' : '☰'}
          </button>
        )}
        {isMobile && navOpen && (
          <div onClick={() => setNavOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1100 }} />
        )}
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
          {(!isMobile || navOpen) && (
            <div style={isMobile ? { position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1150, boxShadow: '4px 0 20px rgba(0,0,0,0.2)' } : undefined}>
              <Sidebar visibleMenus={visibleMenus} tab={tab} setTab={setTab} user={user} stats={stats} mobile={isMobile} />
            </div>
          )}
          
          <main style={{ 
            flex: 1, padding: isMobile ? `${S[4]}px ${S[3]}px 80px` : `${S[7]}px ${S[8]}px`, overflow: 'auto', 
            maxWidth: isMobile ? '100vw' : `calc(100vw - ${SIDEBAR_W}px)`,
            position: 'relative'
          }}>
            {/* K 워터마크 - 메인 영역 우하단 거대 배경 */}
            <KWatermark />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
            {user.role === 'admin' && backupDue && (
              <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'rgba(217,119,6,0.08)', border: `1px solid ${T.warning}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: 12.5, color: T.text }}><strong style={{ color: T.warning }}>⚠ 백업 권장</strong> — 마지막 백업 후 7일이 지났습니다. 데이터는 이 브라우저에만 저장되므로, 캐시 삭제 시 복구할 수 없습니다.</div>
                <Button variant="primary" size="sm" icon={Download} onClick={handleExport}>지금 백업(JSON 내보내기)</Button>
              </div>
            )}
            {tab === 'dashboard' && <DashboardView user={user} stats={stats} employees={visibleEmployees} results={results} policy={policy} setTab={setTab} submissions={submissions} proposals={proposals} setTab2={setTab} />}
            {tab === 'self' && <SelfEvalView user={user} employees={employees} selfScores={selfScores} updateSelfScore={updateSelfScore} comments={comments} updateComment={updateComment} policy={policy} submissions={submissions} submitSelfEval={submitSelfEval} projects={projects} proposals={proposals} peerEvals={peerEvals} updatePeerEval={updatePeerEval} allEmployees={employees} />}
            {tab === 'employees' && <EmployeesView user={user} users={users} employees={employees} addEmployee={addEmployee} updateEmployee={updateEmployee} deleteEmployee={deleteEmployee} history={history} results={results} currentYear={currentYear} policy={policy} onResetPassword={(emp) => {
              const target = users.find(u => u.empId === emp.id || (u.empId === null && emp.id === 'K-admin'));
              if (target) setAdminResetTarget(target);
              else showToast(`${emp.name}님의 계정을 찾을 수 없습니다`);
            }} />}
            {tab === 'evaluation' && <EvaluationView user={user} employees={visibleEmployees} scores={scores} updateScore={updateScore} selfScores={selfScores} comments={comments} updateComment={updateComment} policy={policy} selectedEmp={selectedEmp} setSelectedEmp={setSelectedEmp} results={results} currentYear={currentYear} submissions={submissions} copySelfToEvaluator={copySelfToEvaluator} finalizeEval={finalizeEval} projects={projects} proposals={proposals} peerEvals={peerEvals} />}
            {tab === 'projects' && <ProjectProfitView user={user} employees={employees} projects={projects} proposals={proposals} overheads={overheads} upsertProject={upsertProject} deleteProject={deleteProject} bulkUpsertProjects={bulkUpsertProjects} bulkUpsertProposals={bulkUpsertProposals} deleteProposal={deleteProposal} upsertOverhead={upsertOverhead} deleteOverhead={deleteOverhead} bulkUpsertOverheads={bulkUpsertOverheads} bulkSetEmpLedger={bulkSetEmpLedger} currentYear={currentYear} policy={policy} setPolicy={setPolicy} />}
            {tab === 'report' && (user.role === 'admin' || ['K-140401','K-140402'].includes(user.empId)) && <ManagementReportView user={user} projects={projects} proposals={proposals} overheads={overheads} employees={employees} empLedger={empLedger} setEmpLedger={setEmpLedger} currentYear={currentYear} policy={policy} />}
            {tab === 'loans' && (user.role === 'admin' || ['K-140401','K-140402'].includes(user.empId)) && <LoansView loans={loans} setLoans={setLoans} employees={employees} />}
            {tab === 'receivables' && (user.role === 'admin' || ['K-140401','K-140402'].includes(user.empId)) && <ReceivablesView receivables={receivables} setReceivables={setReceivables} projects={projects} />}
            {tab === 'monthclose' && <MonthCloseView projects={projects} employees={employees} bulkUpsertProjects={bulkUpsertProjects} bulkUpsertOverheads={bulkUpsertOverheads} bulkSetEmpLedger={bulkSetEmpLedger} currentYear={currentYear} />}
            {tab === 'results' && <ResultsView user={user} employees={visibleEmployees} results={results} comments={comments} scores={scores} selfScores={selfScores} policy={policy} currentYear={currentYear} history={history} navigateToHistory={navigateToHistory} closeYearSnapshot={closeYearSnapshot} />}
            {tab === 'salary' && <SalaryView employees={employees} results={results} stats={stats} />}
            {tab === 'analytics' && <AnalyticsView employees={visibleEmployees} results={results} policy={policy} stats={stats} />}
            {tab === 'history' && <HistoryView history={history} employees={employees} results={results} currentYear={currentYear} highlight={historyHighlight} />}
            {tab === 'notify' && <NotifyView employees={employees} results={results} currentYear={currentYear} />}
            {tab === 'policy' && <PolicyView policy={policy} setPolicy={setPolicy} />}
            {tab === 'guide' && <GuideView user={user} manualContent={manualContent} onSaveManual={handleSaveManual} onResetManual={handleResetManual} />}
            </div>
          </main>
        </div>
        
        {toast && <Toast {...toast} />}
        
        {/* 본인 비밀번호 변경 모달 */}
        {passwordModalOpen && (
          <PasswordChangeModal
            user={user}
            onChangePassword={handleChangeOwnPassword}
            onChangeUsername={handleChangeUsername}
            onClose={() => setPasswordModalOpen(false)}
            onSuccess={() => {
              showToast('비밀번호가 변경되었습니다');
              setPasswordModalOpen(false);
            }}
            onUsernameSuccess={(newUsername) => {
              showToast(`아이디가 "${newUsername}"로 변경되었습니다`);
              setPasswordModalOpen(false);
            }}
          />
        )}
        
        {/* admin이 타인 비밀번호 초기화 모달 */}
        {adminResetTarget && (
          <AdminPasswordResetModal
            targetUser={adminResetTarget}
            onReset={handleAdminResetPassword}
            onClose={() => setAdminResetTarget(null)}
            onSuccess={(targetName) => {
              showToast(`${targetName}님의 비밀번호가 초기화되었습니다`);
              setAdminResetTarget(null);
            }}
          />
        )}
        
        {/* 첫 로그인 시 비밀번호 변경 권장 배너 */}
        {user?.mustChangePassword && !passwordModalOpen && (
          <div style={{ 
            position: 'fixed', bottom: 20, right: 20, 
            background: '#fff', border: `2px solid ${T.danger}`, borderRadius: 8,
            boxShadow: '0 8px 24px rgba(185,28,28,0.25)', padding: `${S[4]}px ${S[5]}px`,
            display: 'flex', alignItems: 'center', gap: S[3], maxWidth: 380,
            zIndex: 100, fontFamily: FONT
          }}>
            <div style={{ 
              width: 36, height: 36, borderRadius: 18, background: T.danger,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <AlertCircle size={18} style={{ color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.danger, marginBottom: 2 }}>
                보안 경고: 비밀번호 변경 필요
              </div>
              <div style={{ fontSize: 11, color: T.text, lineHeight: 1.6 }}>
                기본 비밀번호를 사용 중입니다. 보안을 위해 즉시 변경해주세요.
              </div>
            </div>
            <button 
              onClick={() => setPasswordModalOpen(true)}
              style={{ 
                padding: '6px 12px', background: T.danger, color: '#fff',
                border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: FONT, flexShrink: 0
              }}
            >
              지금 변경
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================
// 전역 스타일 (CSS Reset & Font)
// ============================================================
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
      * { box-sizing: border-box; }
      body { margin: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      button { font-family: inherit; }
      input, select, textarea { font-family: inherit; }
      input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      @media (max-width: 767px) {
        table { font-size: 11.5px !important; }
        h1 { font-size: 20px !important; }
        h2 { font-size: 17px !important; }
        header .hide-mobile, .hide-mobile { display: none !important; }
        main > div { max-width: 100% !important; }
      }
      @media print { .no-print { display: none !important; } }
      input[type="range"] { accent-color: ${T.brand}; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: ${T.surfaceAlt}; }
      ::-webkit-scrollbar-thumb { background: ${T.borderStrong}; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: ${T.textMute}; }
      @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    `}</style>
  );
}

// ============================================================
// Toast 알림
// ============================================================
function Toast({ message, type }) {
  const color = type === 'error' ? T.danger : T.success;
  return (
    <div style={{
      position: 'fixed', bottom: S[7], right: S[7], zIndex: 1000,
      background: T.surface, padding: `${S[3]}px ${S[5]}px`,
      borderLeft: `4px solid ${color}`, borderRadius: 6,
      boxShadow: T.shadow3, display: 'flex', alignItems: 'center', gap: S[3],
      fontSize: 14, fontWeight: 500, color: T.ink,
      animation: 'slideIn 0.2s ease-out'
    }}>
      {type === 'error' ? <AlertCircle size={16} color={color} /> : <CheckCircle2 size={16} color={color} />}
      {message}
    </div>
  );
}

// ============================================================
// 공통 컴포넌트
// ============================================================
const card = (extra = {}) => ({
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  boxShadow: T.shadow1,
  ...extra
});

const pageHeader = (subtitle) => ({ marginBottom: S[7] });

function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ marginBottom: S[7], display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: S[4] }}>
      <div>
        {eyebrow && (
          <div style={{ 
            fontSize: 11, fontWeight: 600, color: T.brand, 
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: S[2]
          }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{ 
          fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', 
          color: T.ink, lineHeight: 1.2
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: T.textMute, marginTop: S[2], margin: `${S[2]}px 0 0`, maxWidth: 720 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function Button({ variant = 'outline', size = 'md', icon: Icon, children, onClick, disabled, style: extraStyle, ...props }) {
  const sizes = {
    sm: { padding: '6px 10px', fontSize: 12, gap: 5 },
    md: { padding: '8px 14px', fontSize: 13, gap: 6 },
    lg: { padding: '12px 20px', fontSize: 14, gap: 8 }
  };
  const variants = {
    primary: { background: T.brand, color: '#fff', border: `1px solid ${T.brand}` },
    secondary: { background: T.surface, color: T.brand, border: `1px solid ${T.brand}` },
    outline: { background: 'transparent', color: T.text, border: `1px solid ${T.border}` },
    ghost: { background: 'transparent', color: T.text, border: '1px solid transparent' },
    danger: { background: 'transparent', color: T.danger, border: `1px solid ${T.danger}` },
  };
  return (
    <button 
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...props}
      style={{
        ...sizes[size], 
        ...variants[variant],
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 500, 
        cursor: disabled ? 'not-allowed' : 'pointer', 
        borderRadius: 6,
        transition: 'all 0.15s ease', 
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1,
        fontFamily: FONT,
        ...extraStyle
      }}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === 'outline' || variant === 'ghost') e.currentTarget.style.background = T.surfaceAlt;
        if (variant === 'primary') e.currentTarget.style.background = T.brandDark;
        if (variant === 'secondary') e.currentTarget.style.background = T.surfaceAlt;
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.background = variants[variant].background;
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {children}
    </button>
  );
}

function Badge({ children, color = T.textMute, variant = 'solid', size = 'md' }) {
  const sizes = { sm: { padding: '2px 6px', fontSize: 10 }, md: { padding: '3px 8px', fontSize: 11 } };
  const styles = variant === 'solid' 
    ? { background: color, color: '#fff' }
    : { background: 'transparent', color, border: `1px solid ${color}` };
  return (
    <span style={{ ...sizes[size], ...styles, fontWeight: 600, borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4, letterSpacing: '0.02em' }}>
      {children}
    </span>
  );
}

function GradeBadge({ grade, size = 'md' }) {
  if (!grade) return <span style={{ color: T.textLight, fontSize: 11 }}>-</span>;
  const sizes = { sm: 22, md: 28, lg: 36 };
  const fontSize = { sm: 11, md: 13, lg: 16 };
  return (
    <span style={{
      display: 'inline-flex', width: sizes[size], height: sizes[size],
      background: T[grade], color: '#fff', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: fontSize[size], borderRadius: 4
    }}>
      {grade}
    </span>
  );
}

// ============================================================
// 본인 비밀번호 변경 모달
// 현재 비밀번호 검증 + 새 비밀번호 복잡성 검증 + 강도 시각화
// ============================================================
function PasswordChangeModal({ user, onChangePassword, onChangeUsername, onClose, onSuccess, onUsernameSuccess }) {
  // 탭 상태 - admin만 'username' 탭 사용 가능
  const isAdmin = user.role === 'admin';
  const [activeTab, setActiveTab] = useState('password');  // 'password' | 'username'
  
  // 비밀번호 변경 폼 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  // 아이디 변경 폼 상태 (admin 전용)
  const [usernameCurrentPassword, setUsernameCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  
  const validation = validatePassword(newPassword, user.username, user.name);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword && newPassword && confirmPassword && validation.valid && passwordsMatch && !loading;
  
  // 아이디 검증
  const trimmedNewUsername = (newUsername || '').trim();
  const usernameValid = trimmedNewUsername.length >= 3 
    && trimmedNewUsername.length <= 20
    && /^[a-zA-Z0-9_-]+$/.test(trimmedNewUsername)
    && trimmedNewUsername !== user.username;
  const canSubmitUsername = usernameCurrentPassword && usernameValid && !usernameLoading;
  
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const result = await onChangePassword(currentPassword, newPassword);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || '비밀번호 변경에 실패했습니다');
      }
    } catch (e) {
      setError('처리 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitUsername = async () => {
    if (!canSubmitUsername) return;
    setUsernameError('');
    setUsernameLoading(true);
    try {
      const result = await onChangeUsername(usernameCurrentPassword, trimmedNewUsername);
      if (result.success) {
        onUsernameSuccess(result.newUsername);
      } else {
        setUsernameError(result.error || '아이디 변경에 실패했습니다');
      }
    } catch (e) {
      setUsernameError('처리 중 오류가 발생했습니다');
    } finally {
      setUsernameLoading(false);
    }
  };
  
  const strengthColors = [T.danger, T.danger, T.warning, T.brand, T.success];
  const strengthColor = strengthColors[validation.score];
  
  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: 'rgba(15,37,71,0.45)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      padding: S[5], fontFamily: FONT
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ 
        background: T.surface, borderRadius: 10, width: '100%', maxWidth: 480, 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
      }}>
        {/* 헤더 */}
        <div style={{ 
          padding: `${S[5]}px ${S[6]}px ${isAdmin ? S[3] : S[5]}px`, 
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: S[3]
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.brand, letterSpacing: '0.15em', marginBottom: 2 }}>
              SECURITY · 계정 관리
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>
              {activeTab === 'password' ? '내 비밀번호 변경' : '내 아이디 변경'}
            </h2>
            <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>
              {user.name} (<code style={{ background: T.surfaceAlt, padding: '1px 5px', borderRadius: 3, fontSize: 10 }}>{user.username}</code>) · 본인 계정 정보를 변경합니다
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}>
            <X size={18} />
          </button>
        </div>
        
        {/* 탭 (admin 전용) */}
        {isAdmin && (
          <div style={{ 
            display: 'flex', padding: `0 ${S[6]}px`, gap: 0,
            borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt
          }}>
            <button 
              onClick={() => setActiveTab('password')}
              style={{ 
                padding: `${S[3]}px ${S[4]}px`, 
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 12, fontWeight: 600,
                color: activeTab === 'password' ? T.brand : T.textMute,
                borderBottom: activeTab === 'password' ? `2px solid ${T.brand}` : '2px solid transparent',
                marginBottom: -1, transition: 'all 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}
            >
              🔑 비밀번호 변경
            </button>
            <button 
              onClick={() => setActiveTab('username')}
              style={{ 
                padding: `${S[3]}px ${S[4]}px`, 
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: FONT, fontSize: 12, fontWeight: 600,
                color: activeTab === 'username' ? T.brand : T.textMute,
                borderBottom: activeTab === 'username' ? `2px solid ${T.brand}` : '2px solid transparent',
                marginBottom: -1, transition: 'all 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}
            >
              👤 아이디 변경
              <span style={{ 
                fontSize: 8, padding: '1px 4px', background: T.warning, color: '#fff',
                borderRadius: 2, fontWeight: 700, letterSpacing: '0.05em'
              }}>
                ADMIN
              </span>
            </button>
          </div>
        )}
        
        {/* 본문 - 탭에 따라 분기 */}
        {activeTab === 'password' && (
        <div style={{ padding: `${S[5]}px ${S[6]}px` }}>
          {/* 현재 비밀번호 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>
              현재 비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showCurrent ? 'text' : 'password'} 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="현재 사용 중인 비밀번호"
                autoFocus
                style={{ 
                  width: '100%', padding: '10px 38px 10px 14px', 
                  border: `1px solid ${T.border}`, borderRadius: 6,
                  fontSize: 14, fontFamily: FONT, boxSizing: 'border-box', outline: 'none'
                }}
              />
              <button onClick={() => setShowCurrent(!showCurrent)} type="button"
                style={{ 
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 10, color: T.textMute, fontFamily: FONT
                }}>
                {showCurrent ? '숨김' : '보기'}
              </button>
            </div>
          </div>
          
          {/* 새 비밀번호 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>
              새 비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showNew ? 'text' : 'password'} 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                placeholder="8자 이상, 대/소문자·숫자·특수문자 중 3종 이상"
                style={{ 
                  width: '100%', padding: '10px 38px 10px 14px', 
                  border: `1px solid ${T.border}`, borderRadius: 6,
                  fontSize: 14, fontFamily: FONT, boxSizing: 'border-box', outline: 'none'
                }}
              />
              <button onClick={() => setShowNew(!showNew)} type="button"
                style={{ 
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 10, color: T.textMute, fontFamily: FONT
                }}>
                {showNew ? '숨김' : '보기'}
              </button>
            </div>
            
            {/* 강도 표시 바 */}
            {newPassword && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ 
                      flex: 1, height: 4, borderRadius: 2,
                      background: i < validation.score ? strengthColor : T.divider,
                      transition: 'all 0.2s'
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 10, color: strengthColor, fontWeight: 600 }}>
                  비밀번호 강도: {passwordStrengthLabel(validation.score)} · {validation.length}자 · {validation.typeCount}종 문자
                </div>
              </div>
            )}
            
            {/* 검증 오류 */}
            {newPassword && validation.errors.length > 0 && (
              <ul style={{ margin: '8px 0 0', paddingLeft: 16, fontSize: 10, color: T.danger, lineHeight: 1.7 }}>
                {validation.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
            {newPassword && validation.warnings.length > 0 && (
              <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 10, color: T.warning, lineHeight: 1.7 }}>
                {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
          </div>
          
          {/* 새 비밀번호 확인 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>
              새 비밀번호 확인
            </label>
            <input 
              type={showNew ? 'text' : 'password'} 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호를 다시 입력"
              style={{ 
                width: '100%', padding: '10px 14px', 
                border: `1px solid ${confirmPassword && !passwordsMatch ? T.danger : T.border}`, 
                borderRadius: 6, fontSize: 14, fontFamily: FONT, 
                boxSizing: 'border-box', outline: 'none'
              }}
            />
            {confirmPassword && !passwordsMatch && (
              <div style={{ fontSize: 10, color: T.danger, marginTop: 4 }}>
                비밀번호가 일치하지 않습니다
              </div>
            )}
            {confirmPassword && passwordsMatch && (
              <div style={{ fontSize: 10, color: T.success, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={11} /> 비밀번호가 일치합니다
              </div>
            )}
          </div>
          
          {/* 오류 메시지 */}
          {error && (
            <div style={{ 
              padding: '10px 12px', background: '#FBEAEA', border: `1px solid ${T.danger}`,
              borderRadius: 4, marginBottom: S[3], fontSize: 11, color: T.danger,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <AlertCircle size={13} /> {error}
            </div>
          )}
        </div>
        )}
        
        {/* 아이디 변경 탭 (admin 전용) */}
        {activeTab === 'username' && isAdmin && (
        <div style={{ padding: `${S[5]}px ${S[6]}px` }}>
          {/* 안내 박스 */}
          <div style={{ 
            padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', 
            borderLeft: `3px solid ${T.warning}`, borderRadius: 4,
            marginBottom: S[4], fontSize: 11, color: T.text, lineHeight: 1.7
          }}>
            <strong style={{ color: T.warning }}>⚠ 아이디 변경 시 주의사항</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <li>아이디 변경 후 다음 로그인부터 새 아이디로 로그인해야 합니다</li>
              <li>변경 즉시 적용되며 시스템 데이터는 그대로 유지됩니다</li>
              <li>새 아이디는 시스템 내 다른 사용자와 중복될 수 없습니다</li>
            </ul>
          </div>
          
          {/* 현재 아이디 표시 */}
          <div style={{ 
            padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6,
            marginBottom: S[4], display: 'flex', alignItems: 'center', gap: S[3]
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em' }}>
              현재 아이디
            </div>
            <code style={{ 
              fontSize: 14, fontWeight: 700, color: T.brand, 
              background: T.surface, padding: '4px 10px', borderRadius: 4,
              fontFamily: '"SF Mono", Monaco, monospace'
            }}>
              {user.username}
            </code>
          </div>
          
          {/* 현재 비밀번호 확인 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>
              현재 비밀번호 (본인 확인)
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showUsernamePassword ? 'text' : 'password'} 
                value={usernameCurrentPassword} 
                onChange={e => setUsernameCurrentPassword(e.target.value)}
                placeholder="본인 확인을 위해 현재 비밀번호를 입력하세요"
                autoFocus
                style={{ 
                  width: '100%', padding: '10px 38px 10px 14px', 
                  border: `1px solid ${T.border}`, borderRadius: 6,
                  fontSize: 14, fontFamily: FONT, boxSizing: 'border-box', outline: 'none'
                }}
              />
              <button onClick={() => setShowUsernamePassword(!showUsernamePassword)} type="button"
                style={{ 
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 10, color: T.textMute, fontFamily: FONT
                }}>
                {showUsernamePassword ? '숨김' : '보기'}
              </button>
            </div>
          </div>
          
          {/* 새 아이디 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>
              새 아이디
            </label>
            <input 
              type="text" 
              value={newUsername} 
              onChange={e => setNewUsername(e.target.value)}
              placeholder="3~20자, 영문/숫자/_/- 만 사용 가능"
              style={{ 
                width: '100%', padding: '10px 14px', 
                border: `1px solid ${newUsername && !usernameValid ? T.danger : T.border}`, 
                borderRadius: 6, fontSize: 14, fontFamily: '"SF Mono", Monaco, monospace', 
                boxSizing: 'border-box', outline: 'none', letterSpacing: '0.03em'
              }}
            />
            {newUsername && !usernameValid && (
              <div style={{ fontSize: 10, color: T.danger, marginTop: 4 }}>
                {trimmedNewUsername.length < 3 && '최소 3자 이상 입력하세요'}
                {trimmedNewUsername.length >= 3 && trimmedNewUsername.length > 20 && '최대 20자까지 입력 가능합니다'}
                {trimmedNewUsername.length >= 3 && trimmedNewUsername.length <= 20 && !/^[a-zA-Z0-9_-]+$/.test(trimmedNewUsername) && '영문, 숫자, _, - 만 사용 가능합니다'}
                {trimmedNewUsername === user.username && '현재 아이디와 동일합니다'}
              </div>
            )}
            {newUsername && usernameValid && (
              <div style={{ fontSize: 10, color: T.success, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={11} /> 유효한 아이디 형식입니다 ({trimmedNewUsername.length}자)
              </div>
            )}
          </div>
          
          {/* 변경 미리보기 */}
          {usernameValid && (
            <div style={{ 
              padding: `${S[3]}px ${S[4]}px`, background: '#F0F7F1',
              borderLeft: `3px solid ${T.success}`, borderRadius: 4,
              marginBottom: S[4], fontSize: 12, color: T.text
            }}>
              <strong style={{ color: T.success }}>✓ 변경 미리보기</strong>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: S[2], fontFamily: '"SF Mono", Monaco, monospace', fontSize: 13 }}>
                <code style={{ background: T.surface, padding: '3px 8px', borderRadius: 3, color: T.textMute, textDecoration: 'line-through' }}>
                  {user.username}
                </code>
                <span style={{ color: T.textMute }}>→</span>
                <code style={{ background: T.success, padding: '3px 8px', borderRadius: 3, color: '#fff', fontWeight: 700 }}>
                  {trimmedNewUsername}
                </code>
              </div>
            </div>
          )}
          
          {/* 오류 메시지 */}
          {usernameError && (
            <div style={{ 
              padding: '10px 12px', background: '#FBEAEA', border: `1px solid ${T.danger}`,
              borderRadius: 4, fontSize: 11, color: T.danger,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <AlertCircle size={13} /> {usernameError}
            </div>
          )}
        </div>
        )}
        
        {/* 푸터 - 활성 탭에 따라 다른 액션 */}
        <div style={{ 
          padding: `${S[3]}px ${S[6]}px`, borderTop: `1px solid ${T.border}`,
          background: T.surfaceAlt, display: 'flex', justifyContent: 'flex-end', gap: S[2]
        }}>
          <Button variant="outline" size="md" onClick={onClose}>취소</Button>
          {activeTab === 'password' && (
            <Button variant="primary" size="md" onClick={handleSubmit} disabled={!canSubmit}>
              {loading ? '변경 중...' : '비밀번호 변경'}
            </Button>
          )}
          {activeTab === 'username' && (
            <Button variant="primary" size="md" onClick={handleSubmitUsername} disabled={!canSubmitUsername}>
              {usernameLoading ? '변경 중...' : '아이디 변경'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// admin이 타인 비밀번호 초기화 모달
// ============================================================
function AdminPasswordResetModal({ targetUser, onReset, onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const validation = validatePassword(newPassword, targetUser.username, targetUser.name);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = newPassword && confirmPassword && validation.valid && passwordsMatch && !loading;
  
  // 임시 비밀번호 자동 생성 (8자, 영문+숫자+특수문자 혼합)
  const generateTempPassword = () => {
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const special = '!@#$%&*';
    const all = lower + upper + numbers + special;
    let pwd = '';
    pwd += lower[Math.floor(Math.random() * lower.length)];
    pwd += upper[Math.floor(Math.random() * upper.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += special[Math.floor(Math.random() * special.length)];
    for (let i = 0; i < 6; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }
    // 셔플
    pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
    setNewPassword(pwd);
    setConfirmPassword(pwd);
  };
  
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const result = await onReset(targetUser.username, newPassword);
      if (result.success) {
        onSuccess(targetUser.name);
      } else {
        setError(result.error || '비밀번호 초기화에 실패했습니다');
      }
    } catch (e) {
      setError('처리 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: 'rgba(15,37,71,0.45)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      padding: S[5], fontFamily: FONT
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ 
        background: T.surface, borderRadius: 10, width: '100%', maxWidth: 480, 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
      }}>
        {/* 헤더 */}
        <div style={{ 
          padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: S[3],
          background: 'linear-gradient(135deg, #FFF8E6 0%, #FFFAEC 100%)'
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.warning, letterSpacing: '0.15em', marginBottom: 2 }}>
              ⚠ ADMIN ACTION · 타인 비밀번호 초기화
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>
              {targetUser.name}님 비밀번호 초기화
            </h2>
            <div style={{ fontSize: 11, color: T.text, marginTop: 4, lineHeight: 1.6 }}>
              계정: <strong>{targetUser.username}</strong> · 역할: {targetUser.role}<br/>
              초기화 후 본인이 첫 로그인 시 새 비밀번호로 변경하도록 안내됩니다
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}>
            <X size={18} />
          </button>
        </div>
        
        {/* 본문 */}
        <div style={{ padding: `${S[5]}px ${S[6]}px` }}>
          {/* 임시 비밀번호 생성 */}
          <div style={{ 
            padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6,
            marginBottom: S[4], display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.brand }}>임시 비밀번호 자동 생성</div>
              <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>
                8자 길이, 영문 대/소문자·숫자·특수문자 혼합으로 자동 생성
              </div>
            </div>
            <Button variant="outline" size="sm" icon={Sparkles} onClick={generateTempPassword}>
              자동 생성
            </Button>
          </div>
          
          {/* 새 비밀번호 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>
              새 비밀번호
            </label>
            <input 
              type="text"  // admin이 메모하기 쉽도록 표시
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 입력 또는 자동 생성"
              autoFocus
              style={{ 
                width: '100%', padding: '10px 14px', 
                border: `1px solid ${T.border}`, borderRadius: 6,
                fontSize: 14, fontFamily: '"SF Mono", Monaco, monospace', 
                boxSizing: 'border-box', outline: 'none', letterSpacing: '0.05em'
              }}
            />
            {newPassword && validation.errors.length > 0 && (
              <ul style={{ margin: '8px 0 0', paddingLeft: 16, fontSize: 10, color: T.danger, lineHeight: 1.7 }}>
                {validation.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
          </div>
          
          {/* 확인 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>
              새 비밀번호 확인
            </label>
            <input 
              type="text"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="동일하게 다시 입력"
              style={{ 
                width: '100%', padding: '10px 14px', 
                border: `1px solid ${confirmPassword && !passwordsMatch ? T.danger : T.border}`, 
                borderRadius: 6, fontSize: 14, fontFamily: '"SF Mono", Monaco, monospace', 
                boxSizing: 'border-box', outline: 'none', letterSpacing: '0.05em'
              }}
            />
          </div>
          
          {/* 안내 */}
          <div style={{ 
            padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', borderLeft: `3px solid ${T.warning}`,
            borderRadius: 4, fontSize: 11, color: T.text, lineHeight: 1.7
          }}>
            <strong style={{ color: T.warning }}>📋 다음 단계:</strong> 비밀번호 초기화 후 새 비밀번호를 본인에게 직접 전달하세요. 
            본인은 첫 로그인 시 즉시 새 비밀번호로 다시 변경하도록 안내됩니다.
          </div>
          
          {error && (
            <div style={{ 
              padding: '10px 12px', background: '#FBEAEA', border: `1px solid ${T.danger}`,
              borderRadius: 4, marginTop: S[3], fontSize: 11, color: T.danger,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <AlertCircle size={13} /> {error}
            </div>
          )}
        </div>
        
        {/* 푸터 */}
        <div style={{ 
          padding: `${S[3]}px ${S[6]}px`, borderTop: `1px solid ${T.border}`,
          background: T.surfaceAlt, display: 'flex', justifyContent: 'flex-end', gap: S[2]
        }}>
          <Button variant="outline" size="md" onClick={onClose}>취소</Button>
          <Button variant="danger" size="md" onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? '초기화 중...' : '비밀번호 초기화'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Header
// ============================================================
function ImportButton({ handleImport }) {
  const ref = React.useRef(null);
  return (
    <>
      <Button variant="outline" size="sm" icon={Upload} onClick={() => ref.current && ref.current.click()}>불러오기</Button>
      <input ref={ref} type="file" accept=".json" onChange={(e) => { handleImport(e); if (ref.current) ref.current.value = ''; }} style={{ display: 'none' }} />
    </>
  );
}

function Header({ user, onLogout, handleSave, handleExport, handleImport, onChangePassword }) {
  const roleConfig = {
    admin: { label: '관리자', color: T.brand },
    manager: { label: '부서장', color: T.brandLight },
    evaluator: { label: '평가자', color: T.A },
    employee: { label: '직원', color: T.textMute }
  };
  const r = roleConfig[user.role];
  
  return (
    <header style={{
      background: T.surface, height: 72,
      display: 'flex', alignItems: 'stretch',
      borderBottom: `1px solid ${T.border}`,
      boxShadow: T.shadowHeader,
      position: 'sticky', top: 0, zIndex: 50
    }}>
      {/* 로고 영역 - 사이드바와 동일 너비. 클릭하면 로그아웃 */}
      <button
        onClick={() => {
          if (window.confirm('로그아웃하시겠습니까?\n로그인 화면으로 돌아갑니다.')) {
            onLogout();
          }
        }}
        title="클릭하여 로그아웃 (로그인 화면으로 이동)"
        style={{ 
          width: SIDEBAR_W, flexShrink: 0,
          padding: `0 ${S[4]}px`, display: 'flex', alignItems: 'center',
          cursor: 'pointer',
          background: 'transparent', border: 'none',
          borderRight: `1px solid ${T.border}`,
          fontFamily: FONT, transition: 'background 0.15s',
          textAlign: 'left'
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.surfaceAlt}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <KoitionLogo size={26} />
      </button>

      {/* 우측 액션 영역 */}
      <div style={{ 
        flex: 1, padding: `0 ${S[6]}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: S[3]
      }}>
        {/* 페이지 컨텍스트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div style={{ 
            padding: `${S[1]}px ${S[3]}px`,
            background: T.surfaceAlt, borderRadius: 4,
            fontSize: 11, color: T.textMute, fontWeight: 500, letterSpacing: '0.05em'
          }}>
            2026 평가 시즌
          </div>
        </div>

        {/* 사용자 + 액션 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          {/* 사용자 정보 + 비밀번호 변경 버튼 */}
          <button
            onClick={onChangePassword}
            title="클릭하여 비밀번호 변경"
            style={{ 
              display: 'flex', alignItems: 'center', gap: S[2],
              padding: `${S[1]}px ${S[3]}px`, borderRadius: 6,
              background: T.surfaceAlt, border: `1px solid ${T.border}`,
              cursor: 'pointer', fontFamily: FONT, transition: 'all 0.15s'
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.background = T.surface; 
              e.currentTarget.style.borderColor = T.brand;
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(27,58,111,0.1)';
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.background = T.surfaceAlt; 
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Badge color={r.color} variant="solid" size="sm">{r.label}</Badge>
            <span style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{user.name}</span>
            {user.mustChangePassword && (
              <span style={{ 
                fontSize: 9, fontWeight: 700, color: '#fff', background: T.danger,
                padding: '1px 5px', borderRadius: 2, letterSpacing: '0.05em', marginLeft: 2
              }}>
                ⚠ 변경 필요
              </span>
            )}
          </button>
          
          {user.role === 'admin' && (
            <span className="hide-mobile" style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" size="sm" icon={Save} onClick={handleSave}>저장</Button>
              <Button variant="primary" size="sm" icon={Download} onClick={handleExport}>내보내기</Button>
              <ImportButton handleImport={handleImport} />
            </span>
          )}
          <Button variant="ghost" size="sm" icon={LogOut} onClick={onLogout}>로그아웃</Button>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// ============================================================
// 수금 관리 (자금 캘린더 — 청구/입금 예정·실적)
function ReceivablesView({ receivables, setReceivables, projects }) {
  const [form, setForm] = React.useState(null);
  const today = new Date(); today.setHours(0,0,0,0);
  const parse = (v) => { if (!v) return null; const d = new Date(v); return isNaN(d) ? null : d; };
  const rows = (receivables || []).map(r => {
    const due = parse(r.dueDate); const paid = !!r.paidDate;
    const dday = due ? Math.round((due - today) / 86400000) : null;
    return { ...r, due, paid, dday };
  });
  const openRows = rows.filter(r => !r.paid);
  const outstanding = openRows.reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const overdue = openRows.filter(r => r.dday != null && r.dday < 0);
  const overdueAmt = overdue.reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const soon = openRows.filter(r => r.dday != null && r.dday >= 0 && r.dday <= 30).reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const save = () => {
    if (!form || !form.amount) { alert('금액을 입력하세요'); return; }
    const rec = { id: form.id || ('AR-' + Date.now()), project: form.project || '', client: form.client || '', amount: Number(form.amount) || 0, dueDate: form.dueDate || '', paidDate: form.paidDate || '', note: form.note || '' };
    setReceivables(prev => { const o = (prev || []).filter(x => x.id !== rec.id); return [...o, rec]; });
    setForm(null);
  };
  const togglePaid = (id) => setReceivables(prev => (prev || []).map(r => r.id === id ? { ...r, paidDate: r.paidDate ? '' : new Date().toISOString().slice(0, 10) } : r));
  const del = (id) => { if (window.confirm('삭제할까요?')) setReceivables(prev => (prev || []).filter(r => r.id !== id)); };
  const inp = { padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, boxSizing: 'border-box', width: '100%' };
  const sorted = rows.slice().sort((a, b) => { if (a.paid !== b.paid) return a.paid ? 1 : -1; return String(a.dueDate).localeCompare(String(b.dueDate)); });
  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4], flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.ink }}>수금 관리 (자금 캘린더)</h2>
          <div style={{ fontSize: 12.5, color: T.textMute, marginTop: 4 }}>사업별 청구·입금 예정을 등록해 미수금과 자금 유입 시점을 관리합니다.</div>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setForm({ project: '', client: '', amount: '', dueDate: new Date().toISOString().slice(0, 10), paidDate: '', note: '' })}>수금 예정 등록</Button>
      </div>
      <div style={{ display: 'flex', gap: S[4], marginBottom: S[4], flexWrap: 'wrap' }}>
        <MetricCard icon={Wallet} label="미수금 잔액" value={fmtMoney(outstanding)} color={outstanding > 0 ? T.ink : T.success} />
        <MetricCard icon={AlertTriangle} label="연체 미수금" value={fmtMoney(overdueAmt)} unit={overdue.length ? `${overdue.length}건` : ''} color={overdueAmt > 0 ? T.danger : T.success} />
        <MetricCard icon={Calendar} label="30일 내 예정" value={fmtMoney(soon)} color={T.warning} />
      </div>
      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 780 }}>
          <thead><tr style={{ background: T.surfaceAlt }}>
            <Th>사업/발주처</Th><Th align="right">금액</Th><Th align="center">수금예정일</Th><Th align="center">상태</Th><Th>비고</Th><Th align="center">관리</Th>
          </tr></thead>
          <tbody>
            {sorted.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: T.textLight, padding: 24 }}>등록된 수금 예정이 없습니다</td></tr>}
            {sorted.map(r => (
              <tr key={r.id} style={r.paid ? { opacity: 0.55 } : undefined}>
                <Td><strong>{r.project || '-'}</strong>{r.client ? <div style={{ fontSize: 10, color: T.textLight }}>{r.client}</div> : null}</Td>
                <Td align="right" mono>{fmtMoney(r.amount)}</Td>
                <Td align="center" style={{ fontSize: 11.5 }}>{r.dueDate || '-'}</Td>
                <Td align="center">
                  {r.paid ? <Badge color={T.success} size="sm">입금 {r.paidDate}</Badge>
                    : r.dday != null && r.dday < 0 ? <Badge color={T.danger} size="sm">연체 {-r.dday}일</Badge>
                    : r.dday != null ? <Badge color={r.dday <= 30 ? T.warning : T.textMute} size="sm">D-{r.dday}</Badge>
                    : <Badge color={T.textMute} size="sm">미정</Badge>}
                </Td>
                <Td style={{ fontSize: 11.5, color: T.textMute }}>{r.note}</Td>
                <Td align="center">
                  <span style={{ display: 'inline-flex', gap: 4 }}>
                    <Button size="sm" variant={r.paid ? 'ghost' : 'outline'} onClick={() => togglePaid(r.id)}>{r.paid ? '입금취소' : '입금확인'}</Button>
                    <Button size="sm" variant="ghost" icon={Pencil} onClick={() => setForm({ ...r })} />
                    <Button size="sm" variant="ghost" icon={Trash2} onClick={() => del(r.id)} />
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11.5, color: T.textMute, marginTop: S[3], lineHeight: 1.7 }}>정부·공공 사업은 검수 완료 후 수금까지 시차가 있습니다. 검수예정일에 맞춰 수금예정일을 등록해 두면 자금 부족 시점을 미리 파악할 수 있습니다.</div>
      {form && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setForm(null)}>
          <div style={{ ...card(), padding: S[5], width: 420, maxWidth: '100%' }} onClick={e => e.stopPropagation()}>
            <SectionTitle>{form.id ? '수금 수정' : '수금 예정 등록'}</SectionTitle>
            <div style={{ display: 'grid', gap: S[3], marginTop: S[3] }}>
              <input list="ar-proj" placeholder="사업명" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} style={inp} />
              <datalist id="ar-proj">{(projects || []).map(p => <option key={p.id} value={p.name} />)}</datalist>
              <input placeholder="발주처" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} style={inp} />
              <input type="number" placeholder="금액(원)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} style={inp} />
              <div style={{ display: 'flex', gap: S[2] }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: T.textMute, marginBottom: 2 }}>수금 예정일</div><input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={inp} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: T.textMute, marginBottom: 2 }}>입금일(완료시)</div><input type="date" value={form.paidDate} onChange={e => setForm(f => ({ ...f, paidDate: e.target.value }))} style={inp} /></div>
              </div>
              <input placeholder="비고 (검수·계약 단계 등)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} style={inp} />
              <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setForm(null)}>취소</Button>
                <Button variant="primary" onClick={save}>저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 대여금 관리 (임직원 대여금 원장)
function LoansView({ loans, setLoans, employees }) {
  const [form, setForm] = React.useState(null); // null | {id?, empId, principal, rate, startDate, monthly, note}
  const [repay, setRepay] = React.useState(null); // {loanId, amount, date, note}
  const bal = (l) => (l.principal || 0) - (l.repayments || []).reduce((a, r) => a + (Number(r.amount) || 0), 0);
  const totOut = (loans || []).reduce((a, l) => a + Math.max(0, bal(l)), 0);
  const nameOf = (id) => (employees || []).find(e => e.id === id)?.name || '';
  const saveLoan = () => {
    if (!form || !form.empId || !form.principal) { alert('직원과 원금을 입력하세요'); return; }
    const rec = { id: form.id || ('LOAN-' + Date.now()), empId: form.empId, name: nameOf(form.empId), principal: Number(form.principal) || 0, rate: Number(form.rate) || 0, startDate: form.startDate || '', monthly: Number(form.monthly) || 0, repayments: form.repayments || [], note: form.note || '' };
    setLoans(prev => { const others = (prev || []).filter(l => l.id !== rec.id); return [...others, rec]; });
    setForm(null);
  };
  const addRepay = () => {
    if (!repay || !repay.amount) { alert('상환액을 입력하세요'); return; }
    setLoans(prev => (prev || []).map(l => l.id === repay.loanId ? { ...l, repayments: [...(l.repayments || []), { date: repay.date || new Date().toISOString().slice(0, 10), amount: Number(repay.amount) || 0, note: repay.note || '' }] } : l));
    setRepay(null);
  };
  const inp = { padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, boxSizing: 'border-box' };
  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4], flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.ink }}>임직원 대여금 관리</h2>
          <div style={{ fontSize: 12.5, color: T.textMute, marginTop: 4 }}>대여 원장·상환 이력 관리. 급여 공제 상환은 반드시 본인 서면 동의(상환약정서)가 필요합니다.</div>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setForm({ empId: '', principal: '', rate: 4.6, startDate: new Date().toISOString().slice(0, 10), monthly: '', note: '' })}>대여 등록</Button>
      </div>
      <div style={{ display: 'flex', gap: S[4], marginBottom: S[4], flexWrap: 'wrap' }}>
        <MetricCard icon={Wallet} label="대여 잔액 합계" value={fmtMoney(totOut)} color={totOut > 0 ? T.warning : T.success} />
        <MetricCard icon={Users} label="대여 인원" value={String((loans || []).filter(l => bal(l) > 0).length)} unit="명" color={T.ink} />
      </div>
      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 760 }}>
          <thead><tr style={{ background: T.surfaceAlt }}>
            <Th>직원</Th><Th align="right">원금</Th><Th align="center">이자율</Th><Th align="right">월 상환약정</Th><Th align="right">상환누계</Th><Th align="right">잔액</Th><Th align="center">상환률</Th><Th>비고</Th><Th align="center">관리</Th>
          </tr></thead>
          <tbody>
            {(loans || []).length === 0 && <tr><td colSpan={9} style={{ textAlign: 'center', color: T.textLight, padding: 24, fontSize: 12.5 }}>등록된 대여금이 없습니다</td></tr>}
            {(loans || []).map((l, i) => {
              const paid = (l.repayments || []).reduce((a, r) => a + (Number(r.amount) || 0), 0);
              const b = bal(l); const pct = l.principal > 0 ? paid / l.principal * 100 : 0;
              return (
                <tr key={l.id} style={b > 0 ? undefined : { opacity: 0.55 }}>
                  <Td><strong>{l.name || nameOf(l.empId)}</strong><div style={{ fontSize: 10, color: T.textLight }}>{l.startDate}</div></Td>
                  <Td align="right" mono>{fmtMoney(l.principal)}</Td>
                  <Td align="center" style={{ fontSize: 11.5 }}>{l.rate ? l.rate + '%' : <span style={{ color: T.danger }} title="무이자 대여는 인정이자 익금산입·상여처분 세무 리스크가 있습니다">무이자⚠</span>}</Td>
                  <Td align="right" mono>{l.monthly ? fmtMoney(l.monthly) : '-'}</Td>
                  <Td align="right" mono style={{ color: T.success }}>{fmtMoney(paid)}</Td>
                  <Td align="right" mono><strong style={{ color: b > 0 ? T.warning : T.success }}>{fmtMoney(b)}</strong></Td>
                  <Td align="center" style={{ fontSize: 11.5 }}>{pct.toFixed(0)}%</Td>
                  <Td style={{ fontSize: 11.5, color: T.textMute }}>{l.note}</Td>
                  <Td align="center">
                    <span style={{ display: 'inline-flex', gap: 4 }}>
                      <Button size="sm" variant="outline" onClick={() => setRepay({ loanId: l.id, amount: l.monthly || '', date: new Date().toISOString().slice(0, 10), note: '급여 공제' })}>상환입력</Button>
                      <Button size="sm" variant="ghost" icon={Pencil} onClick={() => setForm({ ...l })} />
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(loans || []).some(l => (l.repayments || []).length) && (
        <div style={{ ...card(), padding: S[5], marginTop: S[4] }}>
          <SectionTitle>상환 이력</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: S[2] }}>
            <thead><tr style={{ background: T.surfaceAlt }}><Th>일자</Th><Th>직원</Th><Th align="right">금액</Th><Th>비고</Th></tr></thead>
            <tbody>
              {(loans || []).flatMap(l => (l.repayments || []).map((r, i) => ({ ...r, name: l.name, k: l.id + i }))).sort((a, b) => String(b.date).localeCompare(String(a.date))).map(r => (
                <tr key={r.k}><Td>{r.date}</Td><Td>{r.name}</Td><Td align="right" mono>{fmtMoney(r.amount)}</Td><Td style={{ color: T.textMute }}>{r.note}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ fontSize: 11.5, color: T.textMute, marginTop: S[3], lineHeight: 1.7 }}>
        ⚠ 법무·세무 유의: ① 급여에서 공제 상환은 근로기준법상 <strong>본인의 자발적 서면 동의</strong>가 있어야 합니다(일방 상계 위법). ② 퇴직금 상계도 동의 필요. ③ 무이자·저리 대여는 인정이자 익금산입·상여처분 대상이 될 수 있어 약정서에 적정 이자율 명시를 권장합니다(세무사 확인).
      </div>
      {form && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setForm(null)}>
          <div style={{ ...card(), padding: S[5], width: 420, maxWidth: '100%' }} onClick={e => e.stopPropagation()}>
            <SectionTitle>{form.id ? '대여 수정' : '대여 등록'}</SectionTitle>
            <div style={{ display: 'grid', gap: S[3], marginTop: S[3] }}>
              <select value={form.empId} onChange={e => setForm(f => ({ ...f, empId: e.target.value }))} style={inp}>
                <option value="">직원 선택…</option>
                {(employees || []).map(e => <option key={e.id} value={e.id}>{e.name} ({shortName(e.dept)})</option>)}
              </select>
              <input type="number" placeholder="원금(원)" value={form.principal} onChange={e => setForm(f => ({ ...f, principal: e.target.value }))} style={inp} />
              <div style={{ display: 'flex', gap: S[2] }}>
                <input type="number" step="0.1" placeholder="이자율(%)" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} style={{ ...inp, flex: 1 }} />
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={{ ...inp, flex: 1 }} />
              </div>
              <input type="number" placeholder="월 상환약정액(원)" value={form.monthly} onChange={e => setForm(f => ({ ...f, monthly: e.target.value }))} style={inp} />
              <input placeholder="비고 (약정서 체결일 등)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} style={inp} />
              <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setForm(null)}>취소</Button>
                <Button variant="primary" onClick={saveLoan}>저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {repay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setRepay(null)}>
          <div style={{ ...card(), padding: S[5], width: 380, maxWidth: '100%' }} onClick={e => e.stopPropagation()}>
            <SectionTitle>상환 입력</SectionTitle>
            <div style={{ display: 'grid', gap: S[3], marginTop: S[3] }}>
              <input type="date" value={repay.date} onChange={e => setRepay(r => ({ ...r, date: e.target.value }))} style={inp} />
              <input type="number" placeholder="상환액(원)" value={repay.amount} onChange={e => setRepay(r => ({ ...r, amount: e.target.value }))} style={inp} />
              <input placeholder="비고 (급여 공제 / 계좌이체 등)" value={repay.note} onChange={e => setRepay(r => ({ ...r, note: e.target.value }))} style={inp} />
              <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setRepay(null)}>취소</Button>
                <Button variant="primary" onClick={addRepay}>저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 모바일 감지 훅
function useIsMobile() {
  const [m, setM] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  React.useEffect(() => {
    const onR = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return m;
}

// Sidebar
// ============================================================
function Sidebar({ visibleMenus, tab, setTab, user, stats, mobile }) {
  return (
    <nav style={{ 
      width: SIDEBAR_W, flexShrink: 0,
      background: T.surface, borderRight: `1px solid ${T.border}`,
      padding: `${S[5]}px 0`, position: mobile ? 'relative' : 'sticky', top: mobile ? 0 : 72,
      height: mobile ? '100vh' : 'calc(100vh - 72px)', overflowY: 'auto'
    }}>
      <div style={{ padding: `0 ${S[5]}px`, marginBottom: S[3] }}>
        <div style={{ 
          fontSize: 10, fontWeight: 600, color: T.textMute, 
          letterSpacing: '0.15em', textTransform: 'uppercase' 
        }}>
          MENU
        </div>
      </div>
      
      {visibleMenus.map(it => {
        const Icon = it.icon; const active = tab === it.id;
        return (
          <button key={it.id} onClick={() => setTab(it.id)} style={{
            width: '100%', padding: `${S[3]}px ${S[5]}px`, border: 'none',
            background: active ? T.surfaceAlt : 'transparent',
            color: active ? T.brand : T.text,
            display: 'flex', alignItems: 'center', gap: S[3],
            fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer',
            borderLeft: active ? `3px solid ${T.brand}` : '3px solid transparent',
            textAlign: 'left', transition: 'all 0.15s', position: 'relative'
          }}
          onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.surfaceAlt; }}
          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
            <span>{it.label}</span>
            {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
          </button>
        );
      })}

      <div style={{ 
        margin: `${S[6]}px ${S[5]}px 0`, padding: `${S[4]}px ${S[4]}px`,
        background: T.surfaceAlt, borderRadius: 6,
        fontSize: 12
      }}>
        <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: S[2] }}>
          현황
        </div>
        <Stat label="접속자" value={user.name} />
        <Stat label="범위" value={user.deptScope || '본인'} />
        {user.role === 'admin' && (
          <>
            <Stat label="전체" value={`${stats.totalEmp}명`} />
            <Stat label="평가대상" value={`${stats.evalTargets}명`} />
            <Stat label="완료" value={`${stats.completed}/${stats.evalTargets}`} highlight={stats.completed === stats.evalTargets} />
          </>
        )}
      </div>
    </nav>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0' }}>
      <span style={{ color: T.textMute, fontSize: 11 }}>{label}</span>
      <span style={{ color: highlight ? T.success : T.ink, fontWeight: 600, fontSize: 12 }}>{value}</span>
    </div>
  );
}

// ============================================================
// 로그인 화면
// ============================================================
function LoginView({ onLogin, policy, users }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    
    try {
      // 비상 복구: 시스템관리자(cys) 비밀번호 분실 시 복구 코드로 초기화
      if (username === 'cys' && password === 'koition-recover-2026!') {
        const newHash = await hashPassword('uj!5n3Rs');
        const migrated = users.some(x => x.username === 'cys')
          ? users.map(x => x.username === 'cys' ? { ...x, passwordHash: newHash, role: 'admin', deptScope: '전체', mustChangePassword: true } : x)
          : [...users, { username: 'cys', passwordHash: newHash, role: 'admin', name: '최영숙', empId: 'K-140403', deptScope: '전체', mustChangePassword: true, lastPasswordChange: null }];
        localStorage.setItem('koition_hr_users', JSON.stringify(migrated));
        setError('cys 비밀번호가 초기값으로 재설정되었습니다. 초기 비밀번호로 다시 로그인하세요.');
        setLoading(false);
        return;
      }
      const u = users.find(x => x.username === username);
      if (!u) {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        setLoading(false);
        return;
      }
      
      const isValid = await verifyPassword(password, u.passwordHash);
      if (isValid) {
        // 사용자 정보에 mustChangePassword 플래그 포함 전달
        onLogin({
          username: u.username,
          role: u.role,
          name: u.name,
          empId: u.empId,
          deptScope: u.deptScope,
          mustChangePassword: u.mustChangePassword,
        });
      } else {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('로그인 처리 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: '100vh', display: 'flex',
        background: `linear-gradient(135deg, ${T.brandDark} 0%, ${T.brand} 50%, ${T.brandLight} 100%)`,
        fontFamily: FONT
      }}>
        {/* 좌측 브랜드 영역 - 1:1 비율, 균형잡힌 3단 레이아웃 */}
        <div style={{
          flex: 1, padding: `${S[8]}px ${S[9]}px`,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          color: '#fff', position: 'relative', overflow: 'hidden',
          minHeight: '100vh'
        }}>
          {/* 배경: 미세한 격자 패턴 (한국 전통 격자 모티브) */}
          <svg style={{ 
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0.04, pointerEvents: 'none'
          }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="koreanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#koreanGrid)" />
          </svg>
          
          {/* 배경 글로우 (우상단) */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-15%', width: '70%', height: '70%',
            background: `radial-gradient(circle, rgba(214,56,56,0.12) 0%, transparent 65%)`,
            pointerEvents: 'none'
          }} />
          {/* 배경 글로우 (좌하단) */}
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-10%', width: '60%', height: '60%',
            background: `radial-gradient(circle, rgba(46,91,160,0.25) 0%, transparent 60%)`,
            pointerEvents: 'none'
          }} />
          
          {/* ============ 상단 (30%): 로고 ============ */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: S[4] }}>
            <KoitionLogo size={28} variant="light" />
            
            {/* 우측: 회사 정체성 태그 */}
            <div style={{ 
              marginLeft: 'auto', display: 'flex', gap: S[2], 
              fontSize: 9, fontWeight: 600, letterSpacing: '0.2em'
            }}>
              <span style={{ 
                padding: '4px 10px', background: 'rgba(255,255,255,0.1)', 
                borderRadius: 3, color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                AI · ARCHIVE
              </span>
              <span style={{ 
                padding: '4px 10px', background: 'rgba(214,56,56,0.2)', 
                borderRadius: 3, color: '#fff',
                border: '1px solid rgba(214,56,56,0.4)'
              }}>
                SINCE 2014
              </span>
            </div>
          </div>
          
          {/* ============ 중앙 (40%): 메인 타이포 + 정체성 비주얼 ============ */}
          <div style={{ 
            position: 'relative', zIndex: 1, 
            display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: S[6], 
            alignItems: 'center'
          }}>
            {/* 좌측: 메인 타이포그래피 */}
            <div>
              <div style={{ 
                fontSize: 12, color: T.accent, fontWeight: 700, 
                letterSpacing: '0.3em', marginBottom: S[3] 
              }}>
                HUMAN RESOURCE MANAGEMENT
              </div>
              <h1 style={{ 
                fontSize: 64, fontWeight: 800, margin: 0, 
                letterSpacing: '-0.03em', lineHeight: 1, 
                fontFamily: FONT
              }}>
                KOITION
              </h1>
              <div style={{ 
                fontSize: 26, fontWeight: 600, marginTop: S[3],
                color: '#fff', letterSpacing: '-0.02em',
                lineHeight: 1.3
              }}>
                인사평가·보상<br/>관리 시스템
              </div>
              
              {/* 빨간 액센트 라인 + 짧은 슬로건 */}
              <div style={{ marginTop: S[5], display: 'flex', alignItems: 'center', gap: S[3] }}>
                <div style={{ width: 40, height: 2, background: T.accent }} />
                <div style={{ 
                  fontSize: 11, color: 'rgba(255,255,255,0.85)', 
                  letterSpacing: '0.15em', fontWeight: 500, lineHeight: 1.6
                }}>
                  DATA-DRIVEN HR<br/>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>
                    데이터 기반의 인사평가 체계
                  </span>
                </div>
              </div>
            </div>
            
            {/* 우측: 표지 이미지 (admin이 URL로 교체 가능) */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CoverImageDisplay coverImage={policy?.coverImage} />
            </div>
          </div>
          
          {/* ============ 하단 (30%): 팀 일러스트 + 회사 소개 ============ */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* 회사 소개 카드 - admin이 정책 설정에서 편집 가능, 비활성화 시 숨김 */}
            {policy?.coverStats?.enabled && policy.coverStats.items?.length > 0 && (
              <div style={{ 
                padding: `${S[4]}px ${S[5]}px`, 
                background: 'rgba(255,255,255,0.04)', 
                borderRadius: 8, marginBottom: S[5],
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'grid', 
                gridTemplateColumns: `repeat(${policy.coverStats.items.length}, 1fr)`, 
                gap: S[4]
              }}>
                {policy.coverStats.items.map((item, i) => (
                  <CardStat key={i} label={item.label} value={item.value} highlight={item.highlight} />
                ))}
              </div>
            )}
            
            {/* 비주얼 트리오: 다트+타겟 / 펜+기록 / 디지털 전환 */}
            <div style={{ marginBottom: S[4] }}>
              <KoitionVisualTrio />
            </div>
            
            {/* 푸터 */}
            <div style={{ 
              paddingTop: S[3], borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ 
                fontSize: 10, color: 'rgba(255,255,255,0.45)', 
                letterSpacing: '0.15em', lineHeight: 1.8
              }}>
                © 2026 KOITION · <span style={{ color: 'rgba(255,255,255,0.6)' }}>KOREA INNOVATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 로그인 폼 - 1:1 비율 */}
        <div style={{
          flex: 1, background: T.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: S[10]
        }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ 
              fontSize: 11, color: T.brand, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: S[3] 
            }}>
              SIGN IN
            </div>
            <h2 style={{ 
              fontSize: 28, fontWeight: 700, color: T.ink, margin: 0,
              letterSpacing: '-0.02em'
            }}>
              로그인
            </h2>
            <p style={{ fontSize: 13, color: T.textMute, marginTop: S[2], marginBottom: S[7] }}>
              인사평가·급여 관리 시스템에 접속합니다
            </p>
            
            <div style={{ marginBottom: S[4] }}>
              <label style={{ 
                fontSize: 11, color: T.textMute, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: S[2]
              }}>
                아이디
              </label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="username"
                style={{ 
                  width: '100%', padding: '12px 14px', 
                  border: `1px solid ${T.border}`, borderRadius: 6,
                  fontSize: 14, background: T.surface, boxSizing: 'border-box',
                  fontFamily: FONT, outline: 'none', transition: 'border 0.15s'
                }}
                onFocus={e => e.target.style.borderColor = T.brand}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
            
            <div style={{ marginBottom: S[3] }}>
              <label style={{ 
                fontSize: 11, color: T.textMute, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: S[2]
              }}>
                비밀번호
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                style={{ 
                  width: '100%', padding: '12px 14px',
                  border: `1px solid ${T.border}`, borderRadius: 6,
                  fontSize: 14, background: T.surface, boxSizing: 'border-box',
                  fontFamily: FONT, outline: 'none', transition: 'border 0.15s'
                }}
                onFocus={e => e.target.style.borderColor = T.brand}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
            
            {error && (
              <div style={{ 
                fontSize: 12, color: T.danger, padding: `${S[2]}px ${S[3]}px`,
                background: T.accentSoft, borderRadius: 4, marginBottom: S[3],
                display: 'flex', alignItems: 'center', gap: S[2]
              }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}
            
            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? T.textMute : T.brand, color: '#fff', border: 'none', borderRadius: 6,
              fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
              letterSpacing: '0.05em', fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
              transition: 'background 0.15s', marginTop: S[4]
            }}
            onMouseEnter={e => !loading && (e.target.style.background = T.brandDark)}
            onMouseLeave={e => !loading && (e.target.style.background = T.brand)}
            >
              <LogIn size={16} /> {loading ? '로그인 중...' : '로그인'}
            </button>
            
            {/* 보안 안내 */}
            <div style={{ 
              marginTop: S[6], padding: `${S[3]}px ${S[4]}px`,
              background: T.surfaceAlt, borderLeft: `3px solid ${T.brand}`, borderRadius: 4,
              fontSize: 11, color: T.text, lineHeight: 1.7,
              display: 'flex', alignItems: 'flex-start', gap: S[2]
            }}>
              <AlertCircle size={13} style={{ color: T.brand, flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: T.brand }}>보안 안내</strong>
                <div style={{ marginTop: 4, fontSize: 10.5, color: T.textMute }}>
                  계정 정보는 인사 담당자에게 문의하세요. 비밀번호를 잊으셨다면 인사팀에 초기화를 요청하세요. 
                  본 시스템은 인사평가·급여·승진 등 민감 정보를 다루므로 비밀번호를 타인과 공유하지 마세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// 대시보드
// ============================================================
function DashboardView({ user, stats, employees, results, policy, setTab, submissions, proposals }) {
  if (user.role === 'employee') {
    const emp = employees[0];
    const status = submissions[emp?.id];
    return (
      <div>
        <PageHeader 
          eyebrow="My Dashboard"
          title={`${user.name}님, 환영합니다`}
          subtitle="2026년 인사평가 진행 상황을 확인하세요"
        />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: S[5] }}>
          <div style={{ ...card(), padding: S[7] }}>
            <div style={{ fontSize: 11, color: T.brand, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: S[3] }}>
              자기 평가 현황
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[5], marginBottom: S[5] }}>
              <div style={{
                width: 64, height: 64, borderRadius: 32,
                background: status === 'self_submitted' ? T.success : T.warning,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff'
              }}>
                {status === 'self_submitted' ? <CheckCircle2 size={32} /> : <FileText size={28} />}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: T.ink }}>
                  {status === 'self_submitted' ? '제출 완료' : '작성 중'}
                </div>
                <div style={{ fontSize: 13, color: T.textMute, marginTop: S[1] }}>
                  {status === 'self_submitted' ? '평가자가 검토 중입니다' : '자기 평가를 작성해주세요'}
                </div>
              </div>
            </div>
            <Button variant="primary" icon={ChevronRight} onClick={() => setTab('self')}>
              내 평가 입력하기
            </Button>
          </div>
          
          <div style={{ ...card(), padding: S[6] }}>
            <div style={{ fontSize: 11, color: T.brand, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: S[4] }}>
              내 정보
            </div>
            <InfoRow label="사번" value={emp?.id} />
            <InfoRow label="부서" value={emp?.dept} />
            <InfoRow label="직위" value={`${emp?.position} · ${emp?.level}`} />
            <InfoRow label="직무군" value={emp?.group} />
            <InfoRow label="입사일" value={emp?.hireDate} />
          </div>
        </div>
      </div>
    );
  }

  const targets = employees.filter(e => e.evalTarget);
  const completed = targets.filter(e => results[e.id]?.grade).length;
  const completion = targets.length > 0 ? (completed / targets.length * 100) : 0;
  const gradeCount = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  targets.forEach(e => { const g = results[e.id]?.grade?.grade; if (g) gradeCount[g]++; });
  const total2025 = employees.reduce((s, e) => s + (Number(e.baseSalary || 0) + Number(e.allowance || 0) + Number(e.mealCar || 0) + Number(e.qualif || 0)) * 12, 0);
  const total2026 = employees.reduce((s, e) => s + (results[e.id]?.totalComp2026 || 0), 0);
  const delta = total2026 - total2025;
  const deltaPct = total2025 > 0 ? ((delta / total2025) * 100) : 0;
  const scopeLabel = user.role === 'admin' ? '전사' : user.deptScope;
  
  // 인건비 정보 표시 권한 (admin·manager만)
  const canViewSalary = user.role === 'admin' || user.role === 'manager';

  return (
    <div>
      <PageHeader 
        eyebrow={`${user.role === 'admin' ? 'ADMIN' : user.role === 'manager' ? 'MANAGER' : user.role === 'evaluator' ? 'EVALUATOR' : 'EMPLOYEE'} · ${scopeLabel}`}
        title="대시보드"
        subtitle={`${scopeLabel} 2026년 인사평가 진행 현황${canViewSalary ? ' 및 보상 시뮬레이션' : ''}`}
      />
      
      {(() => {
        // 입찰 마감 D-day (미수주 제안, bidDate 기준). bidDate가 'YYYY/MM'이면 말일로 간주.
        const parseBid = (v) => {
          if (!v) return null;
          const m = String(v).match(/(\d{4})[./-](\d{1,2})(?:[./-](\d{1,2}))?/);
          if (!m) return null;
          const y = +m[1], mo = +m[2], d = m[3] ? +m[3] : new Date(y, mo, 0).getDate();
          return new Date(y, mo - 1, d);
        };
        const today = new Date(); today.setHours(0,0,0,0);
        const rows = (proposals || []).filter(p => p.status !== '수주').map(p => {
          const d = parseBid(p.bidDate); if (!d) return null;
          const dday = Math.round((d - today) / 86400000);
          return { ...p, d, dday };
        }).filter(Boolean).filter(p => p.dday >= -7 && p.dday <= 60).sort((a,b) => a.dday - b.dday);
        if (rows.length === 0) return null;
        const color = (dd) => dd < 0 ? T.danger : dd <= 7 ? T.danger : dd <= 30 ? T.warning : T.textMute;
        return (
          <div className="no-print" style={{ ...card({ borderLeft: `4px solid ${T.warning}` }), padding: S[5], marginBottom: S[5] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: S[3] }}>
              <Clock size={18} color={T.warning} />
              <SectionTitle>입찰 마감 임박 · {rows.length}건 (60일 이내)</SectionTitle>
            </div>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 560 }}>
                <thead><tr style={{ background: T.surfaceAlt }}><Th>사업</Th><Th>발주처</Th><Th align="right">예산</Th><Th align="center">마감</Th><Th align="center">D-day</Th><Th align="center">PM</Th></tr></thead>
                <tbody>
                  {rows.map((p, i) => (
                    <tr key={i}>
                      <Td><strong>{p.name}</strong></Td>
                      <Td style={{ fontSize: 11.5, color: T.textMute }}>{p.client}</Td>
                      <Td align="right" mono>{fmtMoney(p.budget)}</Td>
                      <Td align="center" style={{ fontSize: 11.5 }}>{p.bidDate}</Td>
                      <Td align="center"><Badge color={color(p.dday)} size="sm">{p.dday < 0 ? `마감+${-p.dday}` : `D-${p.dday}`}</Badge></Td>
                      <Td align="center" style={{ fontSize: 11.5 }}>{p.pm || '-'}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>마감일이 연-월만 있는 경우 해당 월 말일 기준으로 표시됩니다. 정확한 관리를 위해 제안현황에 일자까지 입력하세요.</div>
          </div>
        );
      })()}

      {/* 메트릭 카드 - 권한별 컬럼 수 자동 조정 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: canViewSalary ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', 
        gap: S[4], marginBottom: S[6] 
      }}>
        <MetricCard 
          icon={Users} 
          label={user.role === 'admin' ? '전체 직원' : '담당 인원'} 
          value={targets.length + (employees.length - targets.length)} 
          unit="명" 
          sub={`평가대상 ${targets.length}명 · 제외 ${employees.length - targets.length}명`}
        />
        <MetricCard 
          icon={UserCheck} 
          label="평가 완료" 
          value={completed} 
          unit={`/${targets.length}`}
          sub={`진행률 ${completion.toFixed(0)}%`}
          progress={completion}
          color={completion === 100 ? T.success : T.brand}
        />
        
        {/* 인건비 카드 - admin·manager만 표시 */}
        {canViewSalary && (
          <>
            <MetricCard 
              icon={Wallet} 
              label="2026 예상 인건비" 
              value={fmtMan(total2026)} 
              unit="원"
              sub={`2025 대비 ${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(1)}%`}
              color={T.brand}
            />
            <MetricCard 
              icon={TrendingUp} 
              label="총 증감액" 
              value={(delta >= 0 ? '+' : '') + fmtMan(delta)} 
              unit="원"
              sub={`전년 ${fmtMan(total2025)}원`}
              color={delta >= 0 ? T.success : T.danger}
            />
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: S[5] }}>
        {/* 등급 분포 */}
        <div style={{ ...card(), padding: S[6] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: S[5] }}>
            <div>
              <div style={{ fontSize: 11, color: T.brand, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: S[1] }}>
                Grade Distribution
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>등급 분포</h3>
            </div>
            <div style={{ fontSize: 11, color: T.textMute }}>실제 vs 권장</div>
          </div>
          {policy.grades.map(g => {
            const count = gradeCount[g.grade];
            const actPct = completed > 0 ? (count / completed * 100) : 0;
            return (
              <div key={g.grade} style={{ marginBottom: S[4], display: 'flex', alignItems: 'center', gap: S[4] }}>
                <GradeBadge grade={g.grade} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: T.textMute }}>{g.label}</span>
                    <span style={{ color: T.ink }}>
                      <strong>{count}명</strong>
                      <span style={{ color: T.textLight, marginLeft: 6, fontSize: 11 }}>
                        실제 {actPct.toFixed(0)}% · 권장 {g.dist}%
                      </span>
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: T.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${actPct}%`, height: '100%', background: T[g.grade], 
                      borderRadius: 4, transition: 'width 0.4s ease' 
                    }} />
                    <div style={{ 
                      position: 'absolute', left: `${g.dist}%`, top: -2, bottom: -2,
                      width: 2, background: T.ink, opacity: 0.4 
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 평가 진행 상태 */}
        <div style={{ ...card(), padding: S[6] }}>
          <div style={{ marginBottom: S[5] }}>
            <div style={{ fontSize: 11, color: T.brand, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: S[1] }}>
              Status
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>평가 진행 상태</h3>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto', margin: `0 -${S[6]}px`, padding: `0 ${S[6]}px` }}>
            {targets.map(emp => {
              const r = results[emp.id]; const done = !!r?.grade;
              return (
                <div key={emp.id} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: `${S[3]}px 0`, borderBottom: `1px solid ${T.divider}`
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{emp.position} · {emp.level}</div>
                  </div>
                  {done ? <GradeBadge grade={r.grade.grade} size="sm" /> : <Badge color={T.textLight} variant="outline" size="sm">미평가</Badge>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${S[2]}px 0`, borderBottom: `1px solid ${T.divider}` }}>
      <span style={{ fontSize: 12, color: T.textMute }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{value}</span>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, unit, sub, progress, color = T.ink }) {
  return (
    <div style={{ ...card(), padding: S[5], position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[3] }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: 8,
          background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color={color} strokeWidth={2} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: T.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: S[2], fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: S[1] }}>
        <span style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 13, color: T.textMute }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 11, color: T.textMute, marginTop: S[1] }}>{sub}</div>}
      {progress != null && (
        <div style={{ marginTop: S[3], height: 4, background: T.surfaceAlt, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: color, transition: 'width 0.4s' }} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// 직급별 평가 기준 안내 패널 (자기평가 화면 상단)
// L1·L2 직원에게 특히 도움됨
// ============================================================
function LevelGuidePanel({ emp }) {
  const [expanded, setExpanded] = useState(emp.level === 'L1' || emp.level === 'L2');
  const guide = LEVEL_GUIDE[emp.level];
  if (!guide) return null;
  
  const isJunior = emp.level === 'L1' || emp.level === 'L2';
  const accentColor = guide.color;
  
  return (
    <div style={{ 
      ...card({ borderLeft: `4px solid ${accentColor}` }), 
      padding: 0, marginBottom: S[5], overflow: 'hidden'
    }}>
      {/* 헤더 (항상 표시) */}
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{ 
          width: '100%', padding: `${S[4]}px ${S[6]}px`,
          background: isJunior ? 'linear-gradient(135deg, rgba(93,196,212,0.08) 0%, rgba(27,86,201,0.05) 100%)' : T.surface,
          border: 'none', cursor: 'pointer', textAlign: 'left',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: S[4],
          fontFamily: FONT
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 8, background: accentColor,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, letterSpacing: '0.05em'
          }}>
            {emp.level}
          </div>
          <div>
            <div style={{ 
              fontSize: 10, fontWeight: 700, color: accentColor, 
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2
            }}>
              {isJunior ? '★ 직급별 평가 기준 안내' : '직급별 평가 기준'}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>
              {guide.label} <span style={{ fontSize: 11, color: T.textMute, fontWeight: 500, marginLeft: 6 }}>· {guide.desc}</span>
            </div>
            <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>
              기대 평가 등급: <strong style={{ color: accentColor }}>{guide.expectedGrade}</strong>
              {isJunior && <span style={{ color: T.accent, marginLeft: 8 }}>· 자기평가 시 참고하세요</span>}
            </div>
          </div>
        </div>
        <ChevronDown size={18} style={{ 
          color: T.textMute, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}/>
      </button>
      
      {/* 펼친 영역 */}
      {expanded && (
        <div style={{ padding: `0 ${S[6]}px ${S[5]}px`, borderTop: `1px solid ${T.divider}`, paddingTop: S[4] }}>
          {/* 핵심 조언 */}
          {guide.advice && (
            <div style={{ 
              padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', borderLeft: `3px solid ${T.warning}`,
              borderRadius: 4, marginBottom: S[4], display: 'flex', alignItems: 'flex-start', gap: S[2]
            }}>
              <Sparkles size={14} style={{ color: T.warning, flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7 }}>
                <strong style={{ color: T.warning }}>💡 {emp.level} 자기평가 팁:</strong> {guide.advice}
              </div>
            </div>
          )}
          
          {/* 역량/업적 기대 수준 2단 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], marginBottom: S[4] }}>
            {/* 역량 기대 수준 */}
            <div>
              <div style={{ 
                fontSize: 11, fontWeight: 700, color: T.brand, letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: S[3], paddingBottom: 6,
                borderBottom: `2px solid ${T.brand}`
              }}>
                역량 평가 기대 수준
              </div>
              {Object.entries(guide.competency).map(([key, value]) => (
                <div key={key} style={{ marginBottom: S[3] }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 3 }}>
                    {key}
                  </div>
                  <div style={{ fontSize: 11, color: T.text, lineHeight: 1.6 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 업적 기대 수준 */}
            <div>
              <div style={{ 
                fontSize: 11, fontWeight: 700, color: T.success, letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: S[3], paddingBottom: 6,
                borderBottom: `2px solid ${T.success}`
              }}>
                업적 평가 기대 수준
              </div>
              {Object.entries(guide.performance).map(([key, value]) => (
                <div key={key} style={{ marginBottom: S[3] }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 3 }}>
                    {key}
                  </div>
                  <div style={{ fontSize: 11, color: T.text, lineHeight: 1.6 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* KPI 집중 영역 */}
          <div style={{ 
            padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: S[3]
          }}>
            <div style={{ 
              fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em',
              textTransform: 'uppercase', flexShrink: 0
            }}>
              KPI 집중 영역
            </div>
            <div style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>
              {guide.kpiFocus}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 자기평가 ScoreRow + 평가 기준 보기 인라인 펼침
// ============================================================
function SelfScoreRowWithGuide({ itemKey, label, weight, desc, value, onChange, disabled, empLevel, category }) {
  const [guideOpen, setGuideOpen] = useState(false);
  
  // RUBRICS에서 해당 항목의 5단계 기준 찾기
  const rubric = RUBRICS[category]?.find(r => r.key === itemKey);
  
  // L1·L2의 기대 등급 박스 강조
  const expectedGrade = LEVEL_GUIDE[empLevel]?.expectedGrade || '';
  const expectedGradeMatch = expectedGrade.match(/([SABCD])급?[~\-]?([SABCD])?/);
  const expectedGrades = expectedGradeMatch 
    ? (expectedGradeMatch[2] ? [expectedGradeMatch[1], expectedGradeMatch[2]] : [expectedGradeMatch[1]])
    : [];
  const isInExpectedRange = (g) => {
    if (expectedGrades.length === 0) return false;
    const order = { S: 5, A: 4, B: 3, C: 2, D: 1 };
    if (expectedGrades.length === 1) return g === expectedGrades[0];
    const min = Math.min(order[expectedGrades[0]], order[expectedGrades[1]]);
    const max = Math.max(order[expectedGrades[0]], order[expectedGrades[1]]);
    return order[g] >= min && order[g] <= max;
  };
  
  return (
    <div style={{ 
      padding: `${S[4]}px 0`, borderBottom: `1px solid ${T.divider}` 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: S[4] }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{label}</div>
            <Badge color={T.brand} variant="outline" size="sm">{weight}%</Badge>
            {rubric && (
              <button 
                onClick={() => setGuideOpen(!guideOpen)}
                style={{ 
                  padding: '2px 8px', background: guideOpen ? T.brand : 'transparent',
                  color: guideOpen ? '#fff' : T.brand,
                  border: `1px solid ${T.brand}`, borderRadius: 3,
                  fontSize: 10, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontFamily: FONT, transition: 'all 0.15s'
                }}
              >
                <FileText size={10} />
                {guideOpen ? '기준 닫기' : '평가 기준 보기'}
              </button>
            )}
          </div>
          <div style={{ fontSize: 12, color: T.textMute }}>{desc}</div>
        </div>
        <input
          type="number" min="0" max="100" step="1"
          value={value ?? ''} onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
          disabled={disabled}
          style={{ 
            width: 90, padding: '10px 12px', border: `1px solid ${T.border}`, borderRadius: 6,
            fontSize: 18, textAlign: 'center', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
            color: T.ink, background: disabled ? T.surfaceAlt : T.surface, outline: 'none',
            fontFamily: '"SF Mono", Monaco, monospace'
          }}
          onFocus={e => e.target.style.borderColor = T.brand}
          onBlur={e => e.target.style.borderColor = T.border}
        />
      </div>
      
      {/* 평가 기준 펼침 영역 */}
      {guideOpen && rubric && (
        <div style={{ 
          marginTop: S[3], padding: S[4], 
          background: T.surfaceAlt, borderRadius: 6,
          border: `1px solid ${T.divider}`
        }}>
          <div style={{ fontSize: 11, color: T.textMute, marginBottom: S[3], lineHeight: 1.6 }}>
            <strong style={{ color: T.text }}>{rubric.label}</strong> · {rubric.desc}
          </div>
          
          {/* 5단계 기준 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {rubric.bands.map(band => {
              const isExpected = isInExpectedRange(band.grade);
              return (
                <div key={band.grade} style={{ 
                  display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: S[3],
                  alignItems: 'flex-start',
                  padding: `${S[2]}px ${S[3]}px`,
                  background: isExpected ? 'rgba(214,56,56,0.05)' : T.surface,
                  border: `1px solid ${isExpected ? T.accent : T.border}`,
                  borderLeft: `3px solid ${T[band.grade]}`,
                  borderRadius: 4
                }}>
                  <GradeBadge grade={band.grade} size="sm" />
                  <div style={{ 
                    fontSize: 11, fontWeight: 700, color: T.text, 
                    minWidth: 55, fontFamily: '"SF Mono", Monaco, monospace',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {band.range}점
                  </div>
                  <div style={{ fontSize: 11, color: T.text, lineHeight: 1.6 }}>
                    {band.criteria}
                    {isExpected && (
                      <span style={{ 
                        marginLeft: 8, padding: '1px 6px', background: T.accent, 
                        color: '#fff', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em'
                      }}>
                        {empLevel} 기대 수준
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 자기 평가
// ============================================================
function PeerEvalForm({ user, allEmployees, peerEvals, updatePeerEval }) {
  const [target, setTarget] = React.useState('');
  const myId = user.empId || '';
  const mine = [];
  Object.entries(peerEvals || {}).forEach(([tid, raters]) => { if (raters && raters[myId]) mine.push({ tid, ...raters[myId] }); });
  const candidates = (allEmployees || []).filter(e => e.id !== myId && e.status === 'active');
  const cur = target && peerEvals && peerEvals[target] && peerEvals[target][myId] ? peerEvals[target][myId] : { collab: 3, resp: 3, expert: 3, keep: '', change: '' };
  const setF = (k, v) => updatePeerEval && updatePeerEval(myId, target, { ...cur, [k]: v });
  const nameOf = (id) => (allEmployees || []).find(e => e.id === id)?.name || id;
  const Item = ({ k, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: 6 }}>
      <div style={{ width: 170, fontSize: 12.5, color: T.text }}>{label}</div>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => setF(k, n)} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${cur[k] === n ? T.brand : T.border}`, background: cur[k] === n ? T.brand : '#fff', color: cur[k] === n ? '#fff' : T.text, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>{n}</button>
      ))}
    </div>
  );
  return (
    <div>
      {mine.length > 0 && (
        <div style={{ fontSize: 11.5, color: T.success, marginBottom: S[2] }}>작성 완료: {mine.map(m => nameOf(m.tid)).join(', ')} ({mine.length}/3)</div>
      )}
      <select value={target} onChange={e => setTarget(e.target.value)} style={{ padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, marginBottom: S[3] }}>
        <option value="">평가할 동료 선택…</option>
        {candidates.map(e => <option key={e.id} value={e.id}>{e.name} ({shortName(e.dept)})</option>)}
      </select>
      {target && mine.length >= 3 && !(peerEvals[target] && peerEvals[target][myId]) ? (
        <div style={{ fontSize: 12, color: T.warning }}>3명까지만 작성할 수 있습니다.</div>
      ) : target ? (
        <div>
          <Item k="collab" label="협업·소통 (팀워크·정보공유)" />
          <Item k="resp" label="책임감 (약속 이행·마감 준수)" />
          <Item k="expert" label="전문성 기여 (동료 성장 지원)" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3], marginTop: S[3] }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: T.success, marginBottom: 4 }}>계속했으면 하는 것 (필수)</div>
              <textarea value={cur.keep} onChange={e => setF('keep', e.target.value)} style={{ width: '100%', minHeight: 60, padding: S[2], border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: T.warning, marginBottom: 4 }}>바꿨으면 하는 것 (필수)</div>
              <textarea value={cur.change} onChange={e => setF('change', e.target.value)} style={{ width: '100%', minHeight: 60, padding: S[2], border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: T.textMute, marginTop: 6 }}>입력 즉시 저장됩니다. 같은 동료를 다시 선택하면 수정할 수 있습니다.</div>
        </div>
      ) : null}
    </div>
  );
}

function SelfEvalView({ user, employees, selfScores, updateSelfScore, comments, updateComment, policy, submissions, submitSelfEval, projects, proposals, peerEvals, updatePeerEval, allEmployees }) {
  const emp = employees.find(e => e.id === user.empId);
  if (!emp) return <EmptyState icon={AlertCircle} title="평가 대상이 아닙니다" desc="시스템 관리자에게 문의하세요" />;
  if (!emp.evalTarget) return <EmptyState icon={AlertCircle} title="평가 대상자가 아닙니다" desc="대표이사·자문 등 평가 제외 대상입니다" />;
  
  const sc = selfScores[emp.id] || {};
  const cm = comments[emp.id] || {};
  const submitted = submissions[emp.id] === 'self_submitted';
  const selfComp = calcCompScore(sc, policy);
  const selfPerf = calcPerfScore(sc, policy);
  const selfTotal = calcTotal(selfComp, selfPerf, policy);

  return (
    <div>
      {/* 연간 목표(MBO) — 확인·초안 작성 + 작성 가이드 */}
      <div style={{ ...card({ borderLeft: `4px solid #0369A1` }), padding: S[5], marginBottom: S[4] }}>
        <SectionTitle>내 연간 목표(MBO)</SectionTitle>
        {(comments[(user.empId||'')]||{}).mboGoal ? (
          <>
            <div style={{ fontSize: 12.5, color: T.text, whiteSpace: 'pre-wrap', lineHeight: 1.7, marginTop: S[2] }}>{(comments[user.empId]||{}).mboGoal}</div>
            <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>자기평가는 이 목표 대비 달성도를 기준으로 작성하세요. 수정은 평가자와 협의 후 가능합니다.</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.7, marginTop: S[2] }}>아직 연간 목표가 없습니다. 아래 가이드를 참고해 초안을 작성하면 평가자와 협의 후 확정됩니다.</div>
            <textarea
              value={(comments[user.empId]||{}).mboGoalDraft || ''}
              onChange={e => updateComment(user.empId, 'mboGoalDraft', e.target.value)}
              placeholder={'목표 3~5개 · 가중치 합 100% · 측정방법 명시\n예)\n1. 담당 사업 공헌이익률 15% 이상 (경영보고서 기준) — 40%\n2. 납기 준수 100%·검수 지연 0건 — 30%\n3. 신규 제안 참여 2건 (제안현황 기재) — 20%\n4. 매뉴얼 표준화 1건 사내 공유 — 10%'}
              style={{ width: '100%', minHeight: 110, padding: S[3], border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', marginTop: S[3] }}
            />
            {(comments[user.empId]||{}).mboGoalDraft && <div style={{ fontSize: 11, color: T.success, marginTop: 4 }}>✓ 초안 저장됨 — 평가자가 협의 후 확정합니다</div>}
          </>
        )}
        <details style={{ marginTop: S[3] }}>
          <summary style={{ fontSize: 12, fontWeight: 700, color: '#0369A1', cursor: 'pointer' }}>목표 작성 가이드 · 직무별 예시 보기</summary>
          <div style={{ fontSize: 12, color: T.text, lineHeight: 1.8, marginTop: S[2], background: T.surfaceAlt, borderRadius: 8, padding: S[4] }}>
            <strong>좋은 목표의 조건(SMART)</strong>: 구체적 · 측정가능(숫자) · 달성가능(전년 ±20%) · 회사 목표와 연결 · 기한 명시. 목표 3~5개, 가중치 합 100%, 각 목표에 측정 방법(어느 데이터로 판정)을 함께 적으세요.<br /><br />
            <strong>PM·수행</strong>: 공헌이익률 15%↑(40%) · 납기 100%(30%) · 제안 참여 2건(20%) · 표준화 1건(10%)<br />
            <strong>영업</strong>: 신규 수주 3억(40%) · 제안 8건/수주율 25%(30%) · 신규 발주처 2곳(20%) · 카드 태깅 100%(10%)<br />
            <strong>경영지원</strong>: 결산 D+5 12회(30%) · 급여 오류 0건(25%) · 판관비 3% 절감(25%) · 계약갱신 지연 0건(20%)<br />
            <strong>경영기획</strong>: 매출목표 지원 90%↑(30%) · 보고서 적시 발행(25%) · 파이프라인 5억 유지(25%) · 개선안 분기 1건(20%)<br /><br />
            <strong style={{ color: T.danger }}>피해야 할 목표</strong>: "최선을 다한다"(측정 불가) · "회사 매출 100억"(개인 통제 불가) · 한 목표에 40% 초과 배정 · 연말에 몰아 달성 가능한 목표
          </div>
        </details>
      </div>

      {/* 동료평가 작성 */}
      <div style={{ ...card({ borderLeft: `4px solid ${T.brand}` }), padding: S[5], marginBottom: S[4] }}>
        <SectionTitle>동료평가 작성 (같은 프로젝트 동료 최대 3명)</SectionTitle>
        <div style={{ fontSize: 12, color: T.textMute, margin: `${S[2]}px 0 ${S[3]}px`, lineHeight: 1.7 }}>
          함께 일해본 동료만 평가하세요. 점수(1~5)보다 서술이 중요합니다. 작성 내용은 <strong>평가자(관리자)만 열람</strong>하며 동료에게는 익명 요약만 전달됩니다.
        </div>
        <PeerEvalForm user={user} allEmployees={allEmployees || employees} peerEvals={peerEvals || {}} updatePeerEval={updatePeerEval} />
      </div>
      {(() => {
        const me = (employees || []).find(e => e.id === user.empId);
        if (!me) return null;
        const nm = String(me.name || '').trim();
        if (isSupportTrack(nm)) return (
          <div style={{ ...card(), padding: S[5], marginBottom: S[4] }}>
            <SectionTitle>내 기여점수 산출 기준</SectionTitle>
            <div style={{ fontSize: 12.5, color: T.text, marginTop: S[2], lineHeight: 1.7 }}>비매출 지원트랙 — <strong>전사 성과 40% + 개인 목표(MBO) 60%</strong>로 평가됩니다. 프로젝트 수익률은 평가에 사용되지 않습니다.</div>
          </div>
        );
        if (isSalesTrack(nm)) {
          const bid = calcBidScore(nm, proposals, projects, null);
          return (
            <div style={{ ...card(), padding: S[5], marginBottom: S[4] }}>
              <SectionTitle>내 기여점수 산출 기준</SectionTitle>
              <div style={{ fontSize: 12.5, color: T.text, marginTop: S[2], lineHeight: 1.7 }}>영업 트랙 — <strong>수주(제안) 실적으로 평가</strong>됩니다. 현재 {bid ? `수주 실적 점수 ${bid.score}점` : `수주 확정 실적이 없어 기본점수 ${EVAL_CFG.salesFloor}점`}이며, 제안이 수주로 확정되면 자동 반영됩니다.</div>
            </div>
          );
        }
        const ev = calcEvalScore(me.id, nm, projects, proposals, null, me);
        if (!ev) return null;
        return (
          <div style={{ ...card(), padding: S[5], marginBottom: S[4] }}>
            <SectionTitle>내 기여점수 산출 근거 (투명 공개)</SectionTitle>
            <div style={{ fontSize: 12.5, color: T.text, marginTop: S[2], lineHeight: 1.8 }}>
              수행 기여 <strong>{ev.exec ?? '-'}</strong>점 × {EVAL_CFG.execW}%{ev.bid != null ? <> + 수주 기여 <strong>{ev.bid}</strong>점 × {EVAL_CFG.bidW}%</> : ' (수주 기여 없음)'}
              {ev.bonus > 0 && <> + 보너스 <strong>+{ev.bonus}</strong> ({[ev.multi ? '다축 기여' : null, ev.jikjik ? '겸직' : null].filter(Boolean).join(' · ')})</>}
              {' = '}<strong style={{ color: T.brand, fontSize: 15 }}>{ev.score}점</strong>
            </div>
            <div style={{ fontSize: 11, color: T.textMute, marginTop: 4 }}>완료 사업=확정 수익률, 진행중=진행기준 수익률 · 참여율 {EVAL_CFG.coreMin}% 미만은 수행 기여 미인정(수주 기여로만) · 산정 규칙은 정책설정에 공개</div>
          </div>
        );
      })()}
      <PageHeader 
        eyebrow="Self Evaluation"
        title="내 평가 입력"
        subtitle="본인의 한 해를 돌아보며 자기 평가를 작성해주세요. 제출 후 평가자가 검토합니다."
      />
      
      {/* 직급별 평가 기준 안내 패널 (L1·L2 강조) */}
      <LevelGuidePanel emp={emp} />
      
      <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingBottom: S[5], marginBottom: S[5], borderBottom: `1px solid ${T.border}` 
        }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: S[1] }}>{emp.name}</div>
            <div style={{ fontSize: 13, color: T.textMute, display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
              <span>{emp.id}</span>
              <span style={{ color: T.borderStrong }}>·</span>
              <span>{emp.dept}</span>
              <span style={{ color: T.borderStrong }}>·</span>
              <span>{emp.position}</span>
              <Badge color={T.brand} variant="outline" size="sm">{emp.level}</Badge>
              <Badge color={groupColor(emp.group)} variant="solid" size="sm">{emp.group}</Badge>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {submitted ? (
              <div style={{ 
                padding: `${S[2]}px ${S[4]}px`, background: T.success, color: '#fff',
                borderRadius: 6, fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: S[2]
              }}>
                <CheckCircle2 size={16} /> 제출 완료
              </div>
            ) : (
              <Badge color={T.warning} variant="solid">작성 중</Badge>
            )}
            {selfTotal != null && (
              <div style={{ fontSize: 12, color: T.textMute, marginTop: S[2] }}>
                예상 점수 <strong style={{ color: T.brand, fontSize: 14 }}>{selfTotal.toFixed(1)}</strong>
              </div>
            )}
          </div>
        </div>
        
        <SectionTitle>역량 자기평가</SectionTitle>
        {[
          { key: 'comp_expert', label: '직무 전문성', weight: policy.comp_expert, desc: '본인의 직무 전문성에 대해 평가해주세요' },
          { key: 'comp_problem', label: '문제해결력', weight: policy.comp_problem, desc: '복잡한 문제 해결 능력에 대해 평가해주세요' },
          { key: 'comp_learn', label: '학습·자기계발', weight: policy.comp_learn, desc: '학습 및 자기계발 노력을 평가해주세요' },
          { key: 'comp_collab', label: '협업·커뮤니케이션', weight: policy.comp_collab, desc: '팀워크와 소통 능력을 평가해주세요' },
        ].map(it => <SelfScoreRowWithGuide key={it.key} itemKey={it.key} label={it.label} weight={it.weight} desc={it.desc} value={sc[it.key]} onChange={v => updateSelfScore(emp.id, it.key, v)} disabled={submitted} empLevel={emp.level} category="comp" />)}
        
        <div style={{ marginTop: S[7] }}>
          <SectionTitle>업적 자기평가</SectionTitle>
          {[
            { key: 'perf_kpi', label: 'KPI 달성도', weight: policy.perf_kpi, desc: '본인의 KPI 달성률을 평가해주세요' },
            { key: 'perf_profit', label: '프로젝트 기여도', weight: policy.perf_profit, desc: '참여 프로젝트에서 본인의 역할·기여 정도를 평가해주세요 (수익률은 경영지원부 데이터로 산정)' },
            { key: 'perf_delivery', label: '납기·완성도', weight: policy.perf_delivery, desc: '납기 준수 및 결과물 품질을 평가해주세요' },
            { key: 'perf_customer', label: '고객 만족도', weight: policy.perf_customer, desc: '고객 만족도와 재계약 기여를 평가해주세요' },
          ].map(it => <SelfScoreRowWithGuide key={it.key} itemKey={it.key} label={it.label} weight={it.weight} desc={it.desc} value={sc[it.key]} onChange={v => updateSelfScore(emp.id, it.key, v)} disabled={submitted} empLevel={emp.level} category="perf" />)}
        </div>
      </div>
      
      <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
        <SectionTitle>본인 의견</SectionTitle>
        <CommentFieldWithGuide 
          label="올해의 성과·강점" 
          placeholder="올해 본인이 이뤄낸 성과나 강점을 자유롭게 작성해주세요" 
          value={cm.selfStrength} 
          onChange={v => updateComment(emp.id, 'selfStrength', v)} 
          disabled={submitted}
          guideKey="selfStrength"
          empGroup={emp.group}
        />
        <CommentFieldWithGuide 
          label="개선하고 싶은 점" 
          placeholder="향후 개선하거나 발전시키고 싶은 부분을 작성해주세요" 
          value={cm.selfImprovement} 
          onChange={v => updateComment(emp.id, 'selfImprovement', v)} 
          disabled={submitted}
          guideKey="selfImprovement"
          empGroup={emp.group}
        />
        <CommentFieldWithGuide 
          label="내년 목표·요청사항" 
          placeholder="내년 도전 목표나 회사에 대한 요청을 작성해주세요" 
          value={cm.selfGoal} 
          onChange={v => updateComment(emp.id, 'selfGoal', v)} 
          disabled={submitted}
          guideKey="selfGoal"
          empGroup={emp.group}
        />
        {!submitted && (
          <div style={{ marginTop: S[5], paddingTop: S[4], borderTop: `1px solid ${T.divider}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
              <div style={{ fontSize: 12, color: T.textMute, lineHeight: 1.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: 4 }}>
                  <AlertCircle size={14} style={{ color: T.warning }} />
                  <strong style={{ color: T.text }}>제출 전 확인사항</strong>
                </div>
                <div>제출 후에는 수정할 수 없으니 신중히 검토해주세요.</div>
              </div>
              <button
                onClick={() => {
                  const ok = window.confirm('자기 평가를 제출하시겠습니까?\n제출 후에는 수정할 수 없습니다.');
                  if (ok) {
                    submitSelfEval(emp.id);
                  }
                }}
                style={{
                  padding: '14px 28px',
                  background: T.brand,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 8px rgba(27, 58, 111, 0.2)',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = T.brandDark;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(27, 58, 111, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = T.brand;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(27, 58, 111, 0.2)';
                }}
              >
                <CheckCircle2 size={16} /> 자기 평가 제출
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children, accent }) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'baseline', gap: S[3], marginBottom: S[4],
      paddingBottom: S[2], borderBottom: `2px solid ${T.brand}`
    }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.ink }}>{children}</h3>
      {accent && <span style={{ fontSize: 12, color: T.textMute }}>{accent}</span>}
    </div>
  );
}

function ScoreRow({ label, weight, desc, value, onChange, disabled, selfValue }) {
  const diff = selfValue != null && value != null ? value - selfValue : null;
  const cols = selfValue !== undefined ? '1fr 220px 90px 70px' : '1fr 220px 90px';
  return (
    <div style={{ 
      display: 'grid', gridTemplateColumns: cols, gap: S[4], 
      alignItems: 'center', padding: `${S[3]}px 0`,
      borderBottom: `1px solid ${T.divider}`, opacity: disabled ? 0.6 : 1
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>
          {label} <span style={{ color: T.brand, fontSize: 12, fontWeight: 600 }}>{weight}%</span>
        </div>
        <div style={{ fontSize: 11, color: T.textMute, marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
        {selfValue != null && (
          <div style={{ fontSize: 11, color: T.brand, marginTop: 4, fontWeight: 500 }}>
            본인 평가: {selfValue}점
          </div>
        )}
      </div>
      <input type="range" min="0" max="100" step="1" value={value ?? 75} 
        onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ width: '100%' }} />
      <input type="number" min="0" max="100" value={value ?? ''} 
        onChange={e => onChange(e.target.value)} disabled={disabled} placeholder="0-100"
        style={{ 
          padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 6,
          fontSize: 14, textAlign: 'center', background: disabled ? T.surfaceAlt : T.surface, 
          fontFamily: FONT, fontWeight: 600, color: T.ink, outline: 'none'
        }} />
      {selfValue !== undefined && (
        <div style={{ 
          fontSize: 12, textAlign: 'center', fontWeight: 600,
          color: diff == null ? T.textLight : diff > 0 ? T.success : diff < 0 ? T.danger : T.textMute 
        }}>
          {diff != null ? (diff > 0 ? '+' : '') + diff : '-'}
        </div>
      )}
    </div>
  );
}

function CommentField({ label, placeholder, value, onChange, disabled }) {
  return (
    <div style={{ marginBottom: S[4] }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: S[2] }}>
        {label}
      </label>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} rows={3} disabled={disabled}
        style={{ 
          width: '100%', padding: '12px 14px', 
          border: `1px solid ${T.border}`, borderRadius: 6,
          fontSize: 13, fontFamily: FONT, lineHeight: 1.7,
          background: disabled ? T.surfaceAlt : T.surface, 
          boxSizing: 'border-box', resize: 'vertical', outline: 'none',
          color: T.ink
        }}
        onFocus={e => !disabled && (e.target.style.borderColor = T.brand)}
        onBlur={e => e.target.style.borderColor = T.border}
      />
    </div>
  );
}

// ============================================================
// CommentFieldWithGuide - 작성 가이드 + 좋은 예시 인라인 펼침
// 자기평가 의견란 전용 (직무군별 차별화된 예시 제공)
// ============================================================
function CommentFieldWithGuide({ label, placeholder, value, onChange, disabled, guideKey, empGroup }) {
  const [guideOpen, setGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('good');  // 'good' | 'bad'
  const guide = COMMENT_GUIDE[guideKey];
  
  if (!guide) {
    // 가이드가 없으면 기본 CommentField로 폴백
    return <CommentField label={label} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} />;
  }
  
  // 직무군별 좋은 예시 (없으면 Archive 기본값)
  const goodExamples = guide.examples.good[empGroup] || guide.examples.good['Archive'];
  const charCount = (value || '').length;
  
  // 예시를 텍스트 영역에 삽입하는 핸들러
  const insertExample = (example) => {
    if (disabled) return;
    if (value && value.trim().length > 0) {
      if (!window.confirm('현재 작성 중인 내용이 있습니다. 예시로 교체하시겠습니까?')) return;
    }
    onChange(example);
    setGuideOpen(false);
  };
  
  return (
    <div style={{ marginBottom: S[4] }}>
      {/* 라벨 + 가이드 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2], gap: S[2] }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
          {label}
          <span style={{ fontSize: 11, color: T.textMute, fontWeight: 500, marginLeft: 6 }}>· {charCount}자</span>
        </label>
        <button
          type="button"
          onClick={() => setGuideOpen(!guideOpen)}
          style={{ 
            padding: '4px 10px', background: guideOpen ? T.brand : 'transparent',
            color: guideOpen ? '#fff' : T.brand,
            border: `1px solid ${T.brand}`, borderRadius: 4,
            fontSize: 10, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: FONT, transition: 'all 0.15s'
          }}
        >
          <Sparkles size={11} />
          {guideOpen ? '가이드 닫기' : '작성 가이드 + 예시 보기'}
        </button>
      </div>
      
      {/* 작성 가이드 펼침 영역 */}
      {guideOpen && (
        <div style={{ 
          marginBottom: S[3], padding: S[4], 
          background: T.surfaceAlt, borderRadius: 6,
          border: `1px solid ${T.divider}`,
          borderLeft: `3px solid ${T.brand}`
        }}>
          {/* 목적 */}
          <div style={{ 
            fontSize: 11, color: T.text, lineHeight: 1.7, marginBottom: S[3],
            padding: `${S[2]}px ${S[3]}px`, background: T.surface, borderRadius: 4
          }}>
            <strong style={{ color: T.brand }}>📌 작성 목적:</strong> {guide.purpose}
          </div>
          
          {/* 작성 원칙 4가지 */}
          <div style={{ marginBottom: S[3] }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em', marginBottom: S[2] }}>
              작성 원칙
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: S[2] }}>
              {guide.principles.map((p, i) => (
                <div key={i} style={{ 
                  padding: `${S[2]}px ${S[3]}px`, background: T.surface, 
                  borderRadius: 4, border: `1px solid ${T.border}`
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{p.icon}</span> {p.title}
                  </div>
                  <div style={{ fontSize: 10, color: T.textMute, lineHeight: 1.5 }}>
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 좋은 예시 / 나쁜 예시 탭 */}
          <div style={{ marginTop: S[3] }}>
            <div style={{ 
              display: 'flex', gap: S[1], marginBottom: S[2],
              borderBottom: `1px solid ${T.border}`, paddingBottom: 0
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('good')}
                style={{ 
                  padding: `${S[2]}px ${S[3]}px`, background: 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: FONT,
                  borderBottom: activeTab === 'good' ? `2px solid ${T.success}` : '2px solid transparent',
                  color: activeTab === 'good' ? T.success : T.textMute,
                  fontSize: 11, fontWeight: 700, marginBottom: -1,
                  display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                <CheckCircle2 size={11} />
                좋은 예시 ({empGroup})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bad')}
                style={{ 
                  padding: `${S[2]}px ${S[3]}px`, background: 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: FONT,
                  borderBottom: activeTab === 'bad' ? `2px solid ${T.danger}` : '2px solid transparent',
                  color: activeTab === 'bad' ? T.danger : T.textMute,
                  fontSize: 11, fontWeight: 700, marginBottom: -1,
                  display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                <X size={11} />
                피해야 할 예시
              </button>
            </div>
            
            {/* 탭 내용 */}
            {activeTab === 'good' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {goodExamples.map((example, i) => (
                  <div key={i} style={{ 
                    padding: `${S[3]}px ${S[3]}px`, background: '#F0F7F1', 
                    borderRadius: 4, border: `1px solid ${T.success}`,
                    position: 'relative'
                  }}>
                    <div style={{ 
                      fontSize: 9, fontWeight: 700, color: T.success, 
                      letterSpacing: '0.1em', marginBottom: 4
                    }}>
                      ✓ 좋은 예시 {i + 1}
                    </div>
                    <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7, marginBottom: S[2] }}>
                      {example}
                    </div>
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => insertExample(example)}
                        style={{ 
                          padding: '3px 8px', background: T.success, color: '#fff',
                          border: 'none', borderRadius: 3, cursor: 'pointer',
                          fontSize: 10, fontWeight: 600, fontFamily: FONT,
                          display: 'inline-flex', alignItems: 'center', gap: 3
                        }}
                      >
                        <Pencil size={9} />
                        이 예시를 출발점으로 사용
                      </button>
                    )}
                  </div>
                ))}
                <div style={{ 
                  fontSize: 10, color: T.textMute, marginTop: 4, padding: 6,
                  background: 'transparent', borderRadius: 4, lineHeight: 1.6
                }}>
                  💡 위 예시는 <strong>{empGroup} 직무군</strong> 기준입니다. 그대로 복사하지 말고, 본인 상황에 맞게 수치와 사례를 바꿔서 활용하세요.
                </div>
              </div>
            )}
            
            {activeTab === 'bad' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {guide.examples.bad.map((example, i) => (
                  <div key={i} style={{ 
                    padding: `${S[3]}px ${S[3]}px`, background: '#FBEAEA', 
                    borderRadius: 4, border: `1px solid ${T.danger}`
                  }}>
                    <div style={{ 
                      fontSize: 9, fontWeight: 700, color: T.danger, 
                      letterSpacing: '0.1em', marginBottom: 4
                    }}>
                      ✗ 피해야 할 예시 {i + 1}
                    </div>
                    <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7 }}>
                      {example}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 텍스트 영역 */}
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} rows={4} disabled={disabled}
        style={{ 
          width: '100%', padding: '12px 14px', 
          border: `1px solid ${T.border}`, borderRadius: 6,
          fontSize: 13, fontFamily: FONT, lineHeight: 1.7,
          background: disabled ? T.surfaceAlt : T.surface, 
          boxSizing: 'border-box', resize: 'vertical', outline: 'none',
          color: T.ink
        }}
        onFocus={e => !disabled && (e.target.style.borderColor = T.brand)}
        onBlur={e => e.target.style.borderColor = T.border}
      />
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div style={{ padding: S[10], textAlign: 'center', color: T.textMute }}>
      <Icon size={40} style={{ margin: '0 auto', display: 'block', marginBottom: S[3], color: T.textLight }} />
      <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: S[1] }}>{title}</div>
      <div style={{ fontSize: 13 }}>{desc}</div>
    </div>
  );
}

// ============================================================
// 직원 관리
// ============================================================
function EmployeesView({ user, users, employees, addEmployee, updateEmployee, deleteEmployee, history, results, currentYear, policy, onResetPassword }) {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('전체');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [editTarget, setEditTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);  // 펼쳐진 직원 ID
  const departments = ['전체', ...new Set(employees.map(e => e.dept))];
  
  const filtered = employees.filter(e => {
    const ms = !search || e.name.includes(search) || e.id.includes(search);
    const md = filterDept === '전체' || e.dept === filterDept;
    const mst = filterStatus === '전체' || e.status === filterStatus;
    return ms && md && mst;
  });

  const statusMap = {
    active: { label: '재직', color: T.success },
    leave: { label: '휴직', color: T.warning },
    freelancer: { label: '프리랜서', color: T.textMute },
    advisor: { label: '자문', color: T.brand }
  };

  const handleSaveEmployee = (data, isNew) => {
    if (isNew) addEmployee(data);
    else updateEmployee(data.id, data);
    setEditTarget(null);
  };

  const handleAddMemo = (empId, memo) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const newMemo = { id: 'm_' + Date.now(), ...memo };
    const memos = [newMemo, ...(emp.memos || [])];
    updateEmployee(empId, { ...emp, memos });
  };

  const handleDeleteMemo = (empId, memoId) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const memos = (emp.memos || []).filter(m => m.id !== memoId);
    updateEmployee(empId, { ...emp, memos });
  };

  const handleUpdateNote = (empId, note) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    updateEmployee(empId, { ...emp, note });
  };
  
  // ECount 연동 상태
  const [ecountModalOpen, setEcountModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // ECount 인사카드 양식으로 내보내기 (CSV)
  const handleExportEcountCSV = () => {
    const csv = employeesToEcountCSV(employees);
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    downloadFile(csv, `KOITION_인사카드_ECount양식_${today}.csv`, 'text/csv;charset=utf-8');
  };
  
  // ECount 인사카드 양식으로 내보내기 (Excel .xlsx)
  const handleExportEcountXLSX = async () => {
    try {
      setIsExporting(true);
      const XLSX = await loadXLSXLib();
      
      // 한글 헤더로 변환된 데이터
      const data = employees.map(emp => {
        const row = {};
        ECOUNT_HR_COLUMNS.forEach(col => {
          row[col.label] = emp[col.key] ?? '';
        });
        return row;
      });
      
      const ws = XLSX.utils.json_to_sheet(data, { 
        header: ECOUNT_HR_COLUMNS.map(c => c.label) 
      });
      
      // 컬럼 너비 자동 조정
      ws['!cols'] = ECOUNT_HR_COLUMNS.map(c => ({ 
        wch: Math.max(c.label.length * 2, 12) 
      }));
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '인사카드');
      
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KOITION_인사카드_ECount양식_${today}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      alert('Excel 내보내기 실패: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        eyebrow="Employees"
        title="직원 관리"
        subtitle={`전체 ${employees.length}명 · 재직 ${employees.filter(e => e.status === 'active').length}명 · 평가 대상 ${employees.filter(e => e.evalTarget).length}명 · 이름을 클릭하면 상세 정보가 펼쳐집니다`}
        action={
          <div style={{ display: 'flex', gap: S[2] }}>
            <Button variant="outline" size="lg" icon={Building2} onClick={() => setEcountModalOpen(true)}>
              ECount 연동
            </Button>
            <Button variant="primary" size="lg" icon={Plus} onClick={() => setEditTarget({ __isNew: true })}>
              직원 추가
            </Button>
          </div>
        }
      />
      
      <div style={{ display: 'flex', gap: S[3], marginBottom: S[5] }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.textMute }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="사번 또는 이름 검색"
            style={{ 
              width: '100%', padding: '10px 14px 10px 40px', 
              border: `1px solid ${T.border}`, borderRadius: 6,
              fontSize: 13, background: T.surface, boxSizing: 'border-box', 
              fontFamily: FONT, outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = T.brand}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} 
          style={{ 
            padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 6,
            fontSize: 13, background: T.surface, minWidth: 200, fontFamily: FONT, color: T.ink, outline: 'none'
          }}>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} 
          style={{ 
            padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 6,
            fontSize: 13, background: T.surface, minWidth: 140, fontFamily: FONT, color: T.ink, outline: 'none'
          }}>
          <option value="전체">전체</option>
          <option value="active">재직</option>
          <option value="leave">휴직</option>
          <option value="freelancer">프리랜서</option>
          <option value="advisor">자문</option>
        </select>
      </div>

      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              <Th>사번</Th><Th>성명</Th><Th>부서</Th><Th>직위</Th>
              <Th align="center">레벨</Th><Th align="center">직무군</Th>
              <Th>입사일</Th>
              <Th align="right">기본급</Th>
              <Th align="right">직책수당</Th>
              <Th align="right">식대/차량</Th>
              <Th align="right">자격</Th>
              <Th align="center">상태</Th><Th align="center">평가</Th>
              <Th align="center">메모</Th>
              <Th align="center">관리</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, idx) => {
              const isInactive = emp.status !== 'active';
              const st = statusMap[emp.status] || statusMap.active;
              const isExpanded = expandedId === emp.id;
              const memoCount = (emp.memos || []).length;
              return (
                <React.Fragment key={emp.id}>
                  <tr style={{ 
                    borderBottom: isExpanded ? 'none' : `1px solid ${T.divider}`,
                    background: isExpanded ? T.surfaceAlt : (idx % 2 === 0 ? T.surface : '#FBFCFD'),
                    color: isInactive ? T.textMute : T.text,
                    transition: 'background 0.15s'
                  }}>
                    <Td><code style={{ fontSize: 11, color: T.textMute }}>{emp.id}</code></Td>
                    <Td>
                      <button onClick={() => setExpandedId(isExpanded ? null : emp.id)}
                        style={{ 
                          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                          display: 'inline-flex', alignItems: 'center', gap: 6, 
                          fontFamily: FONT, color: T.ink, fontWeight: 600, fontSize: 13
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = T.brand}
                        onMouseLeave={e => e.currentTarget.style.color = T.ink}
                      >
                        {emp.name}
                        <ChevronDown size={12} style={{ 
                          color: T.textMute, 
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}/>
                      </button>
                    </Td>
                    <Td>{emp.dept}</Td>
                    <Td>{emp.position}</Td>
                    <Td align="center"><Badge color={T.brand} variant="outline" size="sm">{emp.level}</Badge></Td>
                    <Td align="center">
                      <Badge color={groupColor(emp.group)} variant="solid" size="sm">{emp.group}</Badge>
                    </Td>
                    <Td>{emp.hireDate}</Td>
                    <Td align="right" mono>{fmtKRW(emp.baseSalary)}</Td>
                    <Td align="right" mono>{emp.allowance > 0 ? fmtKRW(emp.allowance) : '-'}</Td>
                    <Td align="right" mono>{emp.mealCar > 0 ? fmtKRW(emp.mealCar) : '-'}</Td>
                    <Td align="right" mono>{emp.qualif > 0 ? fmtKRW(emp.qualif) : '-'}</Td>
                    <Td align="center"><Badge color={st.color} variant="solid" size="sm">{st.label}</Badge></Td>
                    <Td align="center">
                      {emp.evalTarget 
                        ? <Badge color={T.success} variant="outline" size="sm">대상</Badge>
                        : <span style={{ color: T.textLight, fontSize: 11 }}>제외</span>}
                    </Td>
                    <Td align="center">
                      {memoCount > 0 
                        ? <Badge color={T.brand} variant="solid" size="sm">{memoCount}</Badge>
                        : <span style={{ color: T.textLight, fontSize: 11 }}>-</span>}
                    </Td>
                    <Td align="center">
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button onClick={() => setEditTarget(emp)} title="수정"
                          style={{ padding: 6, background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 4, cursor: 'pointer', display: 'inline-flex', color: T.brand }}
                          onMouseEnter={e => e.currentTarget.style.background = T.surfaceAlt}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => { if (window.confirm(`${emp.name}님을 삭제하시겠습니까?\n삭제된 정보는 복구할 수 없습니다.`)) deleteEmployee(emp.id); }} title="삭제"
                          style={{ padding: 6, background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 4, cursor: 'pointer', display: 'inline-flex', color: T.danger }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FBEAEA'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </Td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ borderBottom: `1px solid ${T.divider}`, background: T.surfaceAlt }}>
                      <td colSpan="15" style={{ padding: 0 }}>
                        <EmployeeDetailPanel 
                          emp={emp} 
                          history={history}
                          results={results}
                          currentYear={currentYear}
                          policy={policy}
                          currentUser={user}
                          allUsers={users}
                          onAddMemo={(memo) => handleAddMemo(emp.id, memo)}
                          onDeleteMemo={(memoId) => handleDeleteMemo(emp.id, memoId)}
                          onUpdateNote={(note) => handleUpdateNote(emp.id, note)}
                          onEdit={() => setEditTarget(emp)}
                          onResetPassword={() => onResetPassword(emp)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan="15" style={{ padding: S[8], textAlign: 'center', color: T.textMute, fontSize: 13 }}>검색 조건에 맞는 직원이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editTarget && (
        <EmployeeModal 
          target={editTarget} 
          existingIds={employees.map(e => e.id)}
          onSave={handleSaveEmployee} 
          onClose={() => setEditTarget(null)} 
        />
      )}
      
      {ecountModalOpen && (
        <EcountSyncModal
          employees={employees}
          isExporting={isExporting}
          onExportCSV={handleExportEcountCSV}
          onExportXLSX={handleExportEcountXLSX}
          onImport={(imported) => {
            // 사번 기준 중복 검사 → 신규 추가 또는 업데이트
            let added = 0, updated = 0;
            imported.forEach(newEmp => {
              const existing = employees.find(e => e.id === newEmp.id);
              if (existing) {
                updateEmployee(newEmp.id, { ...existing, ...newEmp });
                updated++;
              } else {
                addEmployee(newEmp);
                added++;
              }
            });
            return { added, updated };
          }}
          onClose={() => setEcountModalOpen(false)}
        />
      )}
    </div>
  );
}

// ============================================================
// 직원 상세 패널 (이름 클릭 시 펼쳐지는 콘텐츠)
// ============================================================
function EmployeeDetailPanel({ emp, history, results, currentYear, policy, currentUser, allUsers, onAddMemo, onDeleteMemo, onUpdateNote, onEdit, onResetPassword }) {
  // 해당 직원의 계정 정보 찾기
  const empAccount = allUsers?.find(u => u.empId === emp.id);
  const isAdmin = currentUser?.role === 'admin';
  const [memoForm, setMemoForm] = useState({ date: new Date().toISOString().slice(0, 10), category: '평가', content: '' });
  const [noteEdit, setNoteEdit] = useState(emp.note || '');
  const [noteEditing, setNoteEditing] = useState(false);

  // 근속 연수 계산
  const calcTenure = () => {
    if (!emp.hireDate) return '-';
    const parts = emp.hireDate.split('/');
    if (parts.length !== 3) return '-';
    const hire = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const now = new Date();
    const yrs = (now - hire) / (1000 * 60 * 60 * 24 * 365.25);
    const fullYrs = Math.floor(yrs);
    const months = Math.floor((yrs - fullYrs) * 12);
    return `${fullYrs}년 ${months}개월`;
  };

  // 평가 이력 수집 (history + 현재 진행 결과)
  const evalHistory = [];
  history.forEach(h => {
    const g = h.gradeMap?.[emp.id];
    if (g) evalHistory.push({ year: h.year, grade: g, closedDate: h.closedDate });
  });
  const currentGrade = results?.[emp.id]?.grade?.grade;
  if (currentGrade) {
    evalHistory.push({ year: currentYear, grade: currentGrade, isCurrent: true });
  }
  evalHistory.sort((a, b) => b.year - a.year);

  // 총 보상 (현재)
  const monthlyTotal = (emp.baseSalary || 0) + (emp.allowance || 0) + (emp.mealCar || 0) + (emp.qualif || 0);
  const annualTotal = monthlyTotal * 12;

  const categoryColors = {
    '평가': T.brand, '근태': T.warning, '교육': T.success,
    '계약': T.A, '징계': T.danger, '포상': T.S, '기타': T.textMute
  };
  const memos = emp.memos || [];

  const handleAddMemo = () => {
    if (!memoForm.content.trim()) return;
    onAddMemo({
      date: memoForm.date,
      category: memoForm.category,
      content: memoForm.content.trim()
    });
    setMemoForm({ date: new Date().toISOString().slice(0, 10), category: '평가', content: '' });
  };

  const handleSaveNote = () => {
    onUpdateNote(noteEdit);
    setNoteEditing(false);
  };

  return (
    <div style={{ padding: `${S[5]}px ${S[6]}px`, background: T.surfaceAlt, animation: 'fadeIn 0.2s ease-out' }}>
      {/* 헤더 영역 */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: S[4], paddingBottom: S[3], borderBottom: `1px solid ${T.border}` 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 8, background: T.brand, 
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700
          }}>
            {emp.name.slice(0, 1)}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.ink }}>{emp.name} <span style={{ fontSize: 13, color: T.textMute, fontWeight: 500 }}>· {emp.position}</span></div>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>
              {emp.id} · {emp.dept} · 근속 {calcTenure()}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          {isAdmin && empAccount && onResetPassword && (
            <Button variant="outline" size="sm" onClick={onResetPassword}>
              🔑 비밀번호 초기화
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={Pencil} onClick={onEdit}>전체 정보 수정</Button>
        </div>
      </div>
      
      {/* admin에게만 계정 정보 표시 */}
      {isAdmin && empAccount && (
        <div style={{ 
          padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6,
          marginBottom: S[4], display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          gap: S[3], flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em' }}>계정 정보</div>
            <div style={{ fontSize: 12, color: T.ink }}>
              <strong>아이디:</strong> <code style={{ background: T.surface, padding: '2px 6px', borderRadius: 3, fontFamily: '"SF Mono", monospace', fontSize: 11 }}>{empAccount.username}</code>
            </div>
            <div style={{ fontSize: 11, color: T.textMute }}>
              마지막 변경: {empAccount.lastPasswordChange 
                ? new Date(empAccount.lastPasswordChange).toLocaleDateString('ko-KR') 
                : '없음 (기본값)'}
            </div>
          </div>
          {empAccount.mustChangePassword && (
            <span style={{ 
              padding: '3px 8px', background: T.danger, color: '#fff', 
              borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em'
            }}>
              ⚠ 비밀번호 변경 필요
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: S[5] }}>
        {/* 좌측: 기본 정보 + 평가 이력 */}
        <div>
          {/* 기본 정보 카드 */}
          <div style={{ background: T.surface, borderRadius: 8, padding: S[5], marginBottom: S[4], border: `1px solid ${T.border}` }}>
            <DetailSectionTitle icon={Briefcase}>기본 정보</DetailSectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3], fontSize: 12 }}>
              <DetailItem label="입사일" value={emp.hireDate} />
              <DetailItem label="근속 기간" value={calcTenure()} />
              <DetailItem label="직무레벨" value={<Badge color={T.brand} variant="outline" size="sm">{emp.level}</Badge>} />
              <DetailItem label="직무군" value={<Badge color={groupColor(emp.group)} variant="solid" size="sm">{emp.group}</Badge>} />
              <DetailItem label="담당 역할" value={emp.role || '-'} />
              <DetailItem label="이메일" value={<code style={{ fontSize: 11, color: T.textMute }}>{emp.email || '-'}</code>} />
            </div>
            <div style={{ marginTop: S[4], paddingTop: S[3], borderTop: `1px solid ${T.divider}` }}>
              <DetailSectionTitle icon={Wallet}>월 보상 (현재 기준)</DetailSectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3], fontSize: 12 }}>
                <CompItem label="기본급" value={fmtKRW(emp.baseSalary)} />
                <CompItem label="직책수당" value={emp.allowance > 0 ? fmtKRW(emp.allowance) : '-'} />
                <CompItem label="식대/차량" value={emp.mealCar > 0 ? fmtKRW(emp.mealCar) : '-'} />
                <CompItem label="자격" value={emp.qualif > 0 ? fmtKRW(emp.qualif) : '-'} />
              </div>
              <div style={{ marginTop: S[3], padding: `${S[3]}px ${S[4]}px`, background: T.brand, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>월 합계 / 연 환산</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtKRW(monthlyTotal)}원 / {fmtKRW(annualTotal)}원
                </span>
              </div>
            </div>
          </div>

          {/* 평가 이력 */}
          <div style={{ background: T.surface, borderRadius: 8, padding: S[5], border: `1px solid ${T.border}` }}>
            <DetailSectionTitle icon={Award}>평가 이력</DetailSectionTitle>
            {evalHistory.length === 0 ? (
              <div style={{ padding: S[4], textAlign: 'center', color: T.textLight, fontSize: 12 }}>
                평가 이력이 없습니다
              </div>
            ) : (
              <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
                {evalHistory.map(h => (
                  <div key={h.year} style={{ 
                    flex: '0 0 auto', padding: `${S[3]}px ${S[4]}px`, 
                    background: T.surfaceAlt, borderRadius: 6,
                    border: h.isCurrent ? `2px solid ${T.brand}` : `1px solid ${T.border}`,
                    minWidth: 90, textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6 }}>
                      {h.year}년 {h.isCurrent && <span style={{ color: T.brand, fontWeight: 600 }}>· 진행</span>}
                    </div>
                    <GradeBadge grade={h.grade} size="md" />
                    {h.closedDate && (
                      <div style={{ fontSize: 10, color: T.textLight, marginTop: 4 }}>{h.closedDate}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 승진 심사 정보 (대상자만) */}
          <PromotionStatusCard emp={emp} policy={policy} totalScore={results?.[emp.id]?.totalScore} />
        </div>

        {/* 우측: 비고 + 메모 타임라인 */}
        <div>
          {/* 비고 인라인 편집 */}
          <div style={{ background: T.surface, borderRadius: 8, padding: S[5], marginBottom: S[4], border: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[3] }}>
              <DetailSectionTitle icon={StickyNote} noMargin>비고·특이사항</DetailSectionTitle>
              {!noteEditing && (
                <button onClick={() => { setNoteEdit(emp.note || ''); setNoteEditing(true); }} 
                  style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 4, cursor: 'pointer', fontSize: 11, color: T.brand, fontFamily: FONT, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Pencil size={11} /> 편집
                </button>
              )}
            </div>
            {noteEditing ? (
              <>
                <textarea value={noteEdit} onChange={e => setNoteEdit(e.target.value)} rows={4}
                  placeholder="비고를 입력하세요"
                  style={{ 
                    width: '100%', padding: '10px 12px', border: `1px solid ${T.brand}`, borderRadius: 6,
                    fontSize: 13, fontFamily: FONT, lineHeight: 1.7, background: T.surface,
                    boxSizing: 'border-box', resize: 'vertical', outline: 'none', color: T.ink
                  }}
                />
                <div style={{ display: 'flex', gap: S[2], marginTop: S[2], justifyContent: 'flex-end' }}>
                  <Button variant="outline" size="sm" onClick={() => setNoteEditing(false)}>취소</Button>
                  <Button variant="primary" size="sm" icon={CheckCircle2} onClick={handleSaveNote}>저장</Button>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: emp.note ? T.ink : T.textLight, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 40, padding: S[3], background: T.surfaceAlt, borderRadius: 6 }}>
                {emp.note || '비고가 없습니다. 우상단 「편집」을 눌러 추가하세요.'}
              </div>
            )}
          </div>

          {/* 메모 타임라인 */}
          <div style={{ background: T.surface, borderRadius: 8, padding: S[5], border: `1px solid ${T.border}` }}>
            <DetailSectionTitle icon={MessageSquare}>메모 타임라인 ({memos.length})</DetailSectionTitle>
            
            {/* 메모 추가 폼 */}
            <div style={{ padding: S[3], background: T.surfaceAlt, borderRadius: 6, marginBottom: S[3] }}>
              <div style={{ display: 'flex', gap: S[2], marginBottom: S[2] }}>
                <input type="date" value={memoForm.date} onChange={e => setMemoForm({ ...memoForm, date: e.target.value })}
                  style={{ padding: '6px 10px', border: `1px solid ${T.border}`, borderRadius: 4, fontSize: 12, background: T.surface, fontFamily: FONT, color: T.ink, outline: 'none' }} />
                <select value={memoForm.category} onChange={e => setMemoForm({ ...memoForm, category: e.target.value })}
                  style={{ flex: 1, padding: '6px 10px', border: `1px solid ${T.border}`, borderRadius: 4, fontSize: 12, background: T.surface, fontFamily: FONT, color: T.ink, outline: 'none' }}>
                  {Object.keys(categoryColors).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <textarea value={memoForm.content} onChange={e => setMemoForm({ ...memoForm, content: e.target.value })}
                placeholder="메모 내용 입력 후 추가 (예: 정보관리기술사 자격 취득, 강원랜드 PM 변경 등)"
                rows={2}
                style={{ 
                  width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 4,
                  fontSize: 12, fontFamily: FONT, lineHeight: 1.6, background: T.surface,
                  boxSizing: 'border-box', resize: 'vertical', outline: 'none', color: T.ink, marginBottom: S[2]
                }}
              />
              <Button variant="primary" size="sm" icon={Plus} onClick={handleAddMemo} disabled={!memoForm.content.trim()}>
                메모 추가
              </Button>
            </div>

            {/* 메모 목록 */}
            {memos.length === 0 ? (
              <div style={{ padding: S[4], textAlign: 'center', color: T.textLight, fontSize: 12 }}>
                등록된 메모가 없습니다
              </div>
            ) : (
              <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {memos.map(m => {
                  const cColor = categoryColors[m.category] || T.textMute;
                  return (
                    <div key={m.id} style={{ 
                      display: 'flex', gap: S[3], padding: `${S[2]}px ${S[3]}px`, 
                      background: T.surfaceAlt, borderRadius: 6, borderLeft: `3px solid ${cColor}`
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: T.textMute, fontVariantNumeric: 'tabular-nums' }}>{m.date}</span>
                          <Badge color={cColor} variant="solid" size="sm">{m.category}</Badge>
                        </div>
                        <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.content}</div>
                      </div>
                      <button onClick={() => { if (window.confirm('이 메모를 삭제하시겠습니까?')) onDeleteMemo(m.id); }}
                        style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textLight, display: 'inline-flex', alignSelf: 'flex-start' }}
                        onMouseEnter={e => e.currentTarget.style.color = T.danger}
                        onMouseLeave={e => e.currentTarget.style.color = T.textLight}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSectionTitle({ icon: Icon, children, noMargin }) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: 8, 
      marginBottom: noMargin ? 0 : S[3], 
      paddingBottom: noMargin ? 0 : S[2]
    }}>
      <Icon size={14} style={{ color: T.brand }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: T.ink, letterSpacing: '0.02em' }}>{children}</span>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <span style={{ color: T.textMute, fontSize: 11 }}>{label}</span>
      <span style={{ color: T.ink, fontSize: 12, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function CompItem({ label, value }) {
  return (
    <div style={{ textAlign: 'center', padding: `${S[2]}px ${S[2]}px`, background: T.surfaceAlt, borderRadius: 4 }}>
      <div style={{ fontSize: 10, color: T.textMute, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

// ============================================================
// KPI 자동 계산기 모달
// 실측값 입력 → 등급·점수 자동 계산 → 가중 평균으로 KPI 달성도 산출
// ============================================================
function KPICalculatorModal({ employee, currentScore, onApply, onClose, projects, currentYear }) {
  // 직원 직무군에 따라 표시할 KPI 그룹 선택
  const empGroup = employee.group || 'Archive';
  const commonMetrics = KPI_METRICS.common.metrics;
  const groupMetrics = KPI_METRICS[empGroup]?.metrics || [];

  // 경영지원부 프로젝트 수익성 데이터에서 본인 참여 프로젝트의 평균 수익률 산정
  // → profit_rate(Biz) / pm_margin(PM) 지표를 자동 채워 개인 정량 추정 부담을 줄임
  const projRate = (() => {
    const mine = (projects || []).filter(p =>
      (currentYear == null || Number(p.year) === Number(currentYear)) &&
      (p.members || []).some(m => m.empId === employee.id));
    if (mine.length === 0) return null;
    let wsum = 0, rsum = 0;
    mine.forEach(p => {
      const mem = (p.members || []).find(x => x.empId === employee.id);
      const mm = projectMetrics(p);
      if (mm.rate == null) return;
      const w = Math.max(0, Number(mem.contribution) || 0);
      if (w <= 0) return;
      wsum += w; rsum += mm.rate * w;
    });
    return wsum > 0 ? Math.round((rsum / wsum) * 10) / 10 : null;
  })();
  
  // 직무군별 액센트 컬러 매핑 (KPI_METRICS[group].color 키 → 실제 컬러)
  const groupColorMap = { 
    'S': T.S, 'A': T.A, 'B': T.B, 'C': T.C, 'D': T.D,
    'brand': T.brand, 'accent': T.accent,
    'Archive': T.groupArchive, 'Tech': T.groupTech, 
    'Biz': T.groupBiz, 'PM': T.groupPM
  };
  const groupAccent = groupColorMap[KPI_METRICS[empGroup]?.color] || T.brand;
  
  // PM 겸임 여부 확인 (role === 'PM'이면서 group이 PM이 아닌 경우)
  const isPMRole = employee.role === 'PM' && empGroup !== 'PM';
  const pmMetrics = isPMRole ? (KPI_METRICS.PM?.metrics || []) : [];
  
  const allMetrics = [
    ...commonMetrics.map(m => ({ ...m, groupId: 'common', groupLabel: '전사 공통', accent: T.brand })),
    ...groupMetrics.map(m => ({ ...m, groupId: empGroup, groupLabel: empGroup, accent: groupAccent })),
    // PM 겸임 인력은 PM KPI도 표시 (선택적으로 활용)
    ...pmMetrics.map(m => ({ ...m, groupId: 'PM', groupLabel: 'PM 겸임', accent: T.groupPM }))
  ];
  
  // 각 지표의 실측값 + 사용여부 상태
  const [values, setValues] = useState(() => {
    // 프로젝트 수익성 데이터가 있으면 이익률 지표를 자동 채움
    const init = {};
    if (projRate != null) { init.profit_rate = projRate; init.pm_margin = projRate; }
    return init;
  });
  // 기본 선택: 전사 공통 + 본 직무군은 ON, PM 겸임은 OFF (선택적 활용)
  const [selected, setSelected] = useState(
    allMetrics.reduce((acc, m) => ({ ...acc, [m.id]: m.groupId !== 'PM' || empGroup === 'PM' }), {})
  );
  
  // 측정값으로 점수 계산
  const calcScore = (metric, value) => {
    if (value === '' || value === null || value === undefined || isNaN(Number(value))) return null;
    const v = Number(value);
    
    // 각 지표마다 등급 판단 로직 - 첫 번째 일치하는 band 사용
    // 첫 band의 range가 "120% 이상" 같이 ">=" 의미인 경우와, "120%" 인 경우 처리
    for (const band of metric.bands) {
      const r = band.range;
      // "X 이상" 또는 "X+"
      const gteMatch = r.match(/^([\d.]+)\s*[%점건시간억원\/KLOC]*\s*이상/);
      if (gteMatch) {
        if (v >= Number(gteMatch[1])) return { ...band };
        continue;
      }
      // "X~Y" 또는 "X-Y" 범위
      const rangeMatch = r.match(/^([\d.]+)[%점건시간억원\s]*~\s*([\d.]+)/);
      if (rangeMatch) {
        const min = Number(rangeMatch[1]);
        const max = Number(rangeMatch[2]);
        if (v >= min && v <= max) return { ...band };
        continue;
      }
      // "X 미만" 또는 "X 이하"
      const ltMatch = r.match(/^([\d.]+)[%점건시간억원\s]*미만/);
      if (ltMatch) {
        if (v < Number(ltMatch[1])) return { ...band };
        continue;
      }
      const lteMatch = r.match(/^([\d.]+)[%점건시간억원\s]*이하/);
      if (lteMatch) {
        if (v <= Number(lteMatch[1])) return { ...band };
        continue;
      }
      // "X% (무결근)" 같은 패턴 - 정확히 X
      const exactMatch = r.match(/^([\d.]+)%?\s*\(/);
      if (exactMatch) {
        if (v >= Number(exactMatch[1])) return { ...band };
        continue;
      }
    }
    // 어떤 band에도 안 걸리면 마지막(D) 반환
    return { ...metric.bands[metric.bands.length - 1] };
  };
  
  // 선택된 지표들의 가중 평균 계산
  const computedScores = allMetrics.map(m => ({
    metric: m,
    band: calcScore(m, values[m.id]),
    isSelected: selected[m.id],
    rawValue: values[m.id]
  }));
  
  const validScores = computedScores.filter(c => c.isSelected && c.band !== null);
  const finalScore = validScores.length > 0 
    ? Math.round(validScores.reduce((sum, c) => sum + c.band.score, 0) / validScores.length)
    : null;
  
  const finalGrade = finalScore != null 
    ? (finalScore >= 90 ? 'S' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D')
    : null;
  
  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: 'rgba(15, 37, 71, 0.45)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      padding: S[5], animation: 'fadeIn 0.15s ease-out'
    }}
    onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ 
        background: T.surface, borderRadius: 10, width: '100%', maxWidth: 880, 
        maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* 헤더 */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}`,
          background: T.surface
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calculator size={16} style={{ color: T.success }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: T.success, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                KPI Calculator
              </div>
            </div>
            <h2 style={{ margin: `${S[1]}px 0 0`, fontSize: 20, fontWeight: 700, color: T.ink }}>
              {employee.name} · KPI 자동 계산기
            </h2>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {employee.dept} · {employee.position} · 직무군 
              <Badge color={groupColor(empGroup)} variant="solid" size="sm">{empGroup}</Badge>
              {isPMRole && (
                <Badge color={T.groupPM} variant="outline" size="sm">+ PM 겸임</Badge>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute, display: 'inline-flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* 본문 */}
        <div style={{ padding: `${S[5]}px ${S[6]}px`, overflowY: 'auto', flex: 1 }}>
          <div style={{ 
            padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', borderRadius: 6, 
            marginBottom: S[5], fontSize: 11, color: T.text, lineHeight: 1.7,
            display: 'flex', alignItems: 'flex-start', gap: S[2]
          }}>
            <AlertCircle size={14} style={{ color: T.warning, flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong style={{ color: T.warning }}>사용 방법:</strong> 각 지표의 실측값을 입력하면 자동으로 등급·점수가 계산됩니다. 
              사용할 지표만 체크박스로 선택하면 선택된 지표들의 평균이 최종 KPI 달성도 점수로 산정됩니다.
            </div>
          </div>

          {projRate != null && (
            <div style={{ 
              padding: `${S[3]}px ${S[4]}px`, background: '#EEF3FA', borderRadius: 6,
              marginBottom: S[5], fontSize: 11, color: T.text, lineHeight: 1.7,
              display: 'flex', alignItems: 'flex-start', gap: S[2]
            }}>
              <Briefcase size={14} style={{ color: T.brand, flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong style={{ color: T.brand }}>프로젝트 수익성 연계:</strong> 경영지원부 데이터 기준 본인 참여 프로젝트의 기여도 가중 평균 수익률 <strong>{projRate}%</strong>가 이익률 지표에 자동 입력되었습니다.
              </div>
            </div>
          )}

          {/* 전사 공통 KPI */}
          <div style={{ marginBottom: S[5] }}>
            <div style={{ 
              fontSize: 11, fontWeight: 700, color: T.brand, letterSpacing: '0.15em', 
              textTransform: 'uppercase', marginBottom: S[3], paddingBottom: 6,
              borderBottom: `2px solid ${T.brand}`,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Badge color={T.brand} variant="solid" size="sm">전사</Badge>
              <span>공통 KPI · 4종</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
              {commonMetrics.map(m => (
                <KPICalcRow 
                  key={m.id} metric={m} 
                  value={values[m.id] || ''} 
                  selected={selected[m.id]} 
                  onValueChange={v => setValues(prev => ({ ...prev, [m.id]: v }))}
                  onToggle={() => setSelected(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                  computedBand={calcScore(m, values[m.id])}
                  accent={T.brand}
                />
              ))}
            </div>
          </div>

          {/* 직무군 특화 KPI */}
          <div style={{ marginBottom: S[5] }}>
            <div style={{ 
              fontSize: 11, fontWeight: 700, color: T.success, letterSpacing: '0.15em', 
              textTransform: 'uppercase', marginBottom: S[3], paddingBottom: 6,
              borderBottom: `2px solid ${T.success}`,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Badge color={T.success} variant="solid" size="sm">{empGroup}</Badge>
              <span>{KPI_METRICS[empGroup]?.title?.replace(/.*·\s*/, '') || empGroup} · 4종</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
              {groupMetrics.map(m => (
                <KPICalcRow 
                  key={m.id} metric={m} 
                  value={values[m.id] || ''} 
                  selected={selected[m.id]} 
                  onValueChange={v => setValues(prev => ({ ...prev, [m.id]: v }))}
                  onToggle={() => setSelected(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                  computedBand={calcScore(m, values[m.id])}
                  accent={T.success}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 푸터: 결과 요약 + 적용 버튼 */}
        <div style={{ 
          borderTop: `1px solid ${T.border}`, padding: `${S[4]}px ${S[6]}px`,
          background: T.surfaceAlt
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: S[4] }}>
            {/* 좌측: 계산 결과 요약 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: S[5] }}>
              <div>
                <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  사용 지표
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
                  {validScores.length} <span style={{ fontSize: 12, color: T.textMute, fontWeight: 400 }}>/ {allMetrics.length}</span>
                </div>
              </div>
              <div style={{ height: 40, width: 1, background: T.border }} />
              <div>
                <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  KPI 달성도 점수
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ 
                    fontSize: 28, fontWeight: 800, color: finalScore != null ? T.brand : T.textLight, 
                    letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'
                  }}>
                    {finalScore != null ? finalScore : '-'}
                  </span>
                  <span style={{ fontSize: 12, color: T.textMute }}>/ 100</span>
                  {finalGrade && <GradeBadge grade={finalGrade} size="md" />}
                </div>
              </div>
              {currentScore != null && (
                <>
                  <div style={{ height: 40, width: 1, background: T.border }} />
                  <div>
                    <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                      현재 입력값
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: T.textMute, fontVariantNumeric: 'tabular-nums' }}>
                      {currentScore}점
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* 우측: 버튼 */}
            <div style={{ display: 'flex', gap: S[2] }}>
              <Button variant="outline" size="lg" onClick={onClose}>취소</Button>
              <Button 
                variant="primary" 
                size="lg" 
                icon={CheckCircle2} 
                onClick={() => finalScore != null && onApply(finalScore)}
                disabled={finalScore == null}
              >
                이 점수 적용 ({finalScore != null ? `${finalScore}점` : '값 입력 필요'})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICalcRow({ metric, value, selected, onValueChange, onToggle, computedBand, accent }) {
  return (
    <div style={{ 
      padding: S[3], 
      background: selected ? T.surface : T.surfaceAlt, 
      border: `1px solid ${selected ? accent : T.border}`,
      borderRadius: 6,
      opacity: selected ? 1 : 0.6,
      transition: 'all 0.15s'
    }}>
      {/* 헤더: 체크박스 + 이름 + 단위 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[2], gap: S[2] }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', flex: 1, minWidth: 0 }}>
          <input type="checkbox" checked={selected} onChange={onToggle}
            style={{ width: 14, height: 14, accentColor: accent, marginTop: 2, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{metric.name}</div>
            <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>단위: {metric.unit}</div>
          </div>
        </label>
      </div>
      
      {/* 입력 + 결과 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <input 
          type="number" 
          step="0.1"
          value={value} 
          onChange={e => onValueChange(e.target.value)} 
          placeholder="실측값 입력"
          disabled={!selected}
          style={{ 
            flex: 1, padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 4,
            fontSize: 13, textAlign: 'right', background: selected ? T.surface : T.surfaceAlt,
            fontFamily: FONT, fontWeight: 600, color: T.ink, outline: 'none',
            fontVariantNumeric: 'tabular-nums'
          }} 
        />
        <div style={{ 
          minWidth: 90, padding: '8px 10px', borderRadius: 4,
          background: computedBand ? T[computedBand.grade] : T.surfaceAlt,
          color: computedBand ? '#fff' : T.textLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          fontSize: 12, fontWeight: 700
        }}>
          {computedBand ? (
            <>
              <span style={{ fontSize: 14 }}>{computedBand.grade}</span>
              <span style={{ fontSize: 11, opacity: 0.9, fontVariantNumeric: 'tabular-nums' }}>· {computedBand.score}점</span>
            </>
          ) : (
            <span style={{ fontSize: 11 }}>입력 대기</span>
          )}
        </div>
      </div>
      
      {/* 가이드 */}
      <details style={{ marginTop: S[2] }}>
        <summary style={{ 
          fontSize: 10, color: T.textMute, cursor: 'pointer', 
          padding: '4px 0', userSelect: 'none'
        }}>
          기준표 보기
        </summary>
        <div style={{ 
          marginTop: S[1], padding: S[2], background: T.surfaceAlt, 
          borderRadius: 3, fontSize: 10, lineHeight: 1.6
        }}>
          <div style={{ marginBottom: 4, color: T.textMute }}>
            <strong style={{ color: T.text }}>공식:</strong> {metric.formula}
          </div>
          {metric.bands.map(b => (
            <div key={b.grade} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
              <span>
                <span style={{ 
                  display: 'inline-block', width: 14, height: 14, background: T[b.grade], 
                  color: '#fff', textAlign: 'center', fontSize: 9, fontWeight: 700, 
                  borderRadius: 2, lineHeight: '14px', marginRight: 4
                }}>{b.grade}</span>
                {b.range}
              </span>
              <span style={{ color: T.textMute, fontVariantNumeric: 'tabular-nums' }}>{b.score}점</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

// ============================================================
// 승진 심사 카드 (직원 상세 패널용)
// 직원 관리 화면의 상세 패널에서 승진 가능 여부 / 예상 시기 표시
// ============================================================
function PromotionStatusCard({ emp, policy, totalScore }) {
  const status = calcPromotionStatus(emp, policy, totalScore);
  
  // 승진 대상이 아닌 경우 (평가 제외, 매칭되는 tier 없음 등)
  if (!status) return null;
  
  const { tier, tenure, isEligible, decisionType, currentPoint, requiredPoint, pointMet, yearsMet, yearsRemaining } = status;
  
  // 헤더 색상: 대상자 = 빨강(액센트), 비대상자 = 회색
  const accentColor = isEligible ? T.accent : T.textMute;
  const allMet = decisionType === 'standard' && yearsMet && pointMet;
  
  return (
    <div style={{ 
      background: T.surface, borderRadius: 8, padding: S[5], 
      border: `1px solid ${T.border}`,
      borderLeft: `4px solid ${accentColor}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[3] }}>
        <DetailSectionTitle icon={TrendingUp} noMargin>승진 심사 정보</DetailSectionTitle>
        {isEligible && (
          <Badge color={accentColor} variant="solid" size="sm">
            {decisionType === 'executive' ? '경영진 결재' : (allMet ? '승진 가능' : '심사 대상')}
          </Badge>
        )}
      </div>
      
      {/* 승진 경로 */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: S[3], 
        padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6,
        marginBottom: S[3]
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 2 }}>
            현재 직급
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
            {tier.fromLevel} <span style={{ fontSize: 11, color: T.textMute, fontWeight: 500 }}>· {tier.fromTitle}</span>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: accentColor }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 2 }}>
            승진 직급
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: accentColor }}>
            {tier.toTitle}
            {tier.increase != null && (
              <span style={{ fontSize: 11, color: T.textMute, fontWeight: 500, marginLeft: 6 }}>
                +{tier.increase}% 인상
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* 경영진 의사결정 케이스 */}
      {decisionType === 'executive' && (
        <div style={{ 
          padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', borderRadius: 6,
          fontSize: 12, color: T.text, lineHeight: 1.6,
          display: 'flex', alignItems: 'flex-start', gap: S[2]
        }}>
          <AlertCircle size={14} style={{ color: T.warning, flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong style={{ color: T.warning }}>경영진 의사결정 직급</strong>입니다.
            근속 {tenure}년 · 정량 기준이 아닌 종합 판단으로 승진이 결정됩니다.
          </div>
        </div>
      )}
      
      {/* 일반 승진 심사 - 메트릭 3개 */}
      {decisionType === 'standard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[2] }}>
          {/* 체류 연한 */}
          <PromotionMetric 
            label="체류 연한" 
            icon={Clock}
            value={`${tenure}년`}
            target={`${tier.years}년`}
            met={yearsMet}
            extra={!yearsMet ? (yearsRemaining < 1 ? `${Math.round(yearsRemaining * 12)}개월 후` : `${yearsRemaining.toFixed(1)}년 남음`) : '충족'}
          />
          {/* 진급 Point */}
          <PromotionMetric 
            label="진급 Point" 
            icon={Award}
            value={currentPoint != null ? `${currentPoint}점` : '—'}
            target={`${requiredPoint}점`}
            met={pointMet}
            extra={currentPoint == null ? '평가 진행 중' : (pointMet ? '충족' : '부족')}
          />
          {/* 종합 판정 */}
          <div style={{ 
            padding: S[3], borderRadius: 6, 
            background: allMet ? T.success : T.surfaceAlt,
            border: `1px solid ${allMet ? T.success : T.border}`,
            color: allMet ? '#fff' : T.ink,
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4, opacity: allMet ? 0.85 : 1, color: allMet ? '#fff' : T.textMute, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={11} /> 종합 판정
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
              {allMet ? '승진 가능' : (isEligible ? '추가 충족 필요' : '대상 아님')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 승진 심사 메트릭 (체류 연한 / 진급 Point)
function PromotionMetric({ label, icon: Icon, value, target, met, extra }) {
  return (
    <div style={{ 
      padding: S[3], background: T.surfaceAlt, borderRadius: 6,
      border: `1px solid ${met ? T.success : T.border}`,
      borderLeft: `3px solid ${met ? T.success : T.warning}`
    }}>
      <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon size={11} /> {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: met ? T.success : T.ink, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </span>
        <span style={{ fontSize: 10, color: T.textMute }}>/ {target}</span>
        {met && <CheckCircle2 size={11} style={{ color: T.success, marginLeft: 'auto' }} />}
      </div>
      <div style={{ fontSize: 10, color: met ? T.success : T.textMute, marginTop: 2 }}>
        {extra}
      </div>
    </div>
  );
}

// ============================================================
// ECount 인사카드 양식 연동 모달
// Export: 코이션 직원 → ECount 양식 CSV 다운로드
// Import: ECount Excel/CSV → 코이션 직원 일괄 등록
// ============================================================
function EcountSyncModal({ employees, isExporting, onExportCSV, onExportXLSX, onImport, onClose }) {
  const [activeTab, setActiveTab] = useState('export');  // 'export' | 'import'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);  // { employees, errors, columnMap, headers }
  const [importResult, setImportResult] = useState(null);  // { added, updated }
  const [isLoading, setIsLoading] = useState(false);  // Excel 라이브러리 로딩 중
  const fileInputRef = useRef(null);
  
  const handleFileSelect = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setImportResult(null);
    setPreview(null);
    
    // 파일 확장자로 처리 방식 분기
    const ext = f.name.toLowerCase().split('.').pop();
    const isExcel = ['xlsx', 'xls', 'xlsm'].includes(ext);
    
    if (isExcel) {
      // Excel 파일 처리 - SheetJS 동적 로드 후 ArrayBuffer로 읽기
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const buffer = ev.target.result;
          const result = await excelToEmployees(buffer);
          setPreview(result);
        } catch (err) {
          setPreview({ 
            employees: [], 
            errors: [err.message || 'Excel 파일을 읽을 수 없습니다'] 
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setIsLoading(false);
        setPreview({ employees: [], errors: ['Excel 파일을 읽을 수 없습니다'] });
      };
      reader.readAsArrayBuffer(f);
    } else {
      // CSV 파일 처리 (기존 로직)
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        const result = ecountCSVToEmployees(text);
        setPreview(result);
      };
      reader.onerror = () => setPreview({ employees: [], errors: ['파일을 읽을 수 없습니다'] });
      reader.readAsText(f, 'UTF-8');
    }
    
    // input 초기화 (같은 파일 다시 선택 가능하도록)
    e.target.value = '';
  };
  
  const handleConfirmImport = () => {
    if (!preview?.employees?.length) return;
    const result = onImport(preview.employees);
    setImportResult(result);
  };
  
  // CSV 양식 다운로드
  const downloadCSVTemplate = () => {
    const sample = [{
      id: 'K-260601', name: '홍길동', dept: '아카이브사업팀', position: '대리', 
      level: 'L2', group: 'Archive', hireDate: '2026/06/01',
      baseSalary: 3500000, allowance: 500000, mealCar: 300000, qualif: 50000,
      email: 'sample@koition.com', status: 'active', note: '신규 입사'
    }];
    downloadFile(employeesToEcountCSV(sample), 'KOITION_인사카드_양식_샘플.csv');
  };
  
  // Excel 양식 다운로드
  const downloadXLSXTemplate = async () => {
    try {
      setIsLoading(true);
      await downloadExcelTemplate();
    } catch (err) {
      alert('Excel 양식 다운로드 실패: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: 'rgba(15,37,71,0.45)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      padding: S[5]
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ 
        background: T.surface, borderRadius: 10, width: '100%', maxWidth: 820, 
        maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* 헤더 */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}`,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={16} style={{ color: T.brand }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: T.brand, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                ECount Integration
              </div>
            </div>
            <h2 style={{ margin: `${S[1]}px 0 0`, fontSize: 20, fontWeight: 700, color: T.ink }}>
              ECount 인사카드 양방향 연동
            </h2>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>
              ECount ERP의 인사카드 양식과 호환되는 CSV로 직원 데이터를 주고받습니다
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}>
            <X size={20} />
          </button>
        </div>
        
        {/* 탭 */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, padding: `0 ${S[6]}px` }}>
          {[
            { id: 'export', label: '내보내기 (Export)', icon: Download, desc: '코이션 → ECount' },
            { id: 'import', label: '가져오기 (Import)', icon: Upload, desc: 'ECount → 코이션' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ 
                padding: `${S[3]}px ${S[4]}px`, background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === t.id ? `3px solid ${T.brand}` : '3px solid transparent',
                fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 8,
                color: activeTab === t.id ? T.brand : T.textMute,
                fontWeight: activeTab === t.id ? 700 : 500, fontSize: 13,
                marginBottom: -1
              }}>
              <t.icon size={14} />
              <span>{t.label}</span>
              <span style={{ fontSize: 10, color: T.textLight, fontWeight: 400, marginLeft: 4 }}>{t.desc}</span>
            </button>
          ))}
        </div>
        
        {/* 본문 */}
        <div style={{ padding: `${S[5]}px ${S[6]}px`, overflowY: 'auto', flex: 1 }}>
          {activeTab === 'export' && (
            <EcountExportTab 
              employees={employees} 
              isExporting={isExporting}
              onExportCSV={onExportCSV} 
              onExportXLSX={onExportXLSX}
            />
          )}
          {activeTab === 'import' && (
            <EcountImportTab 
              file={file}
              preview={preview}
              importResult={importResult}
              isLoading={isLoading}
              fileInputRef={fileInputRef}
              onFileSelect={handleFileSelect}
              onDownloadCSVTemplate={downloadCSVTemplate}
              onDownloadXLSXTemplate={downloadXLSXTemplate}
              onConfirmImport={handleConfirmImport}
              onReset={() => { setFile(null); setPreview(null); setImportResult(null); }}
            />
          )}
        </div>
        
        {/* 푸터 */}
        <div style={{ 
          borderTop: `1px solid ${T.border}`, padding: `${S[3]}px ${S[6]}px`,
          display: 'flex', justifyContent: 'flex-end', gap: S[2], background: T.surfaceAlt
        }}>
          <Button variant="outline" size="md" onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
}

// Export 탭 콘텐츠
function EcountExportTab({ employees, isExporting, onExportCSV, onExportXLSX }) {
  return (
    <div>
      {/* 안내 */}
      <div style={{ 
        padding: `${S[3]}px ${S[4]}px`, background: '#F0F7F1', borderLeft: `3px solid ${T.success}`, 
        borderRadius: 4, marginBottom: S[5], display: 'flex', alignItems: 'flex-start', gap: S[2]
      }}>
        <CheckCircle2 size={14} style={{ color: T.success, flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7 }}>
          <strong style={{ color: T.success }}>ECount 양식 호환:</strong> 한글 헤더로 된 Excel 또는 CSV 파일을 다운로드하여, ECount의 인사카드 가져오기 기능에 그대로 업로드할 수 있습니다. Excel은 컬럼 너비가 자동 조정되고, CSV는 UTF-8 BOM이 포함되어 한글이 깨지지 않습니다.
        </div>
      </div>
      
      {/* 미리보기 정보 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[3], marginBottom: S[5] }}>
        <div style={{ padding: S[4], background: T.surfaceAlt, borderRadius: 6, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            대상 직원
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.brand, fontVariantNumeric: 'tabular-nums' }}>
            {employees.length}<span style={{ fontSize: 12, color: T.textMute, fontWeight: 500 }}>명</span>
          </div>
        </div>
        <div style={{ padding: S[4], background: T.surfaceAlt, borderRadius: 6, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            컬럼 수
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.brand, fontVariantNumeric: 'tabular-nums' }}>
            {ECOUNT_HR_COLUMNS.length}<span style={{ fontSize: 12, color: T.textMute, fontWeight: 500 }}>개</span>
          </div>
        </div>
        <div style={{ padding: S[4], background: T.surfaceAlt, borderRadius: 6, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            형식
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.brand, marginTop: 4, lineHeight: 1.4 }}>
            XLSX <span style={{ color: T.textMute, fontSize: 11 }}>·</span> CSV
          </div>
        </div>
      </div>
      
      {/* 포함되는 컬럼 */}
      <div style={{ marginBottom: S[5] }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: S[2] }}>
          포함되는 컬럼 ({ECOUNT_HR_COLUMNS.length}개)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: S[2] }}>
          {ECOUNT_HR_COLUMNS.map(col => (
            <div key={col.key} style={{ 
              display: 'flex', alignItems: 'center', gap: 8, 
              padding: `${S[2]}px ${S[3]}px`, background: T.surfaceAlt, borderRadius: 4,
              fontSize: 11
            }}>
              <CheckCircle2 size={11} style={{ color: T.success, flexShrink: 0 }}/>
              <span style={{ fontWeight: 600, color: T.ink }}>{col.label}</span>
              {col.required && <Badge color={T.danger} variant="outline" size="sm">필수</Badge>}
              <span style={{ color: T.textLight, marginLeft: 'auto', fontSize: 10 }}>{col.desc}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* 내보내기 버튼 - 2가지 형식 */}
      <div style={{ textAlign: 'center', padding: `${S[5]}px 0` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: S[3], marginBottom: S[2] }}>
          {/* Excel 다운로드 (권장) */}
          <Button 
            variant="primary" 
            size="lg" 
            icon={isExporting ? null : Download} 
            onClick={onExportXLSX}
            disabled={isExporting}
          >
            {isExporting ? '준비 중...' : 'Excel (.xlsx) 다운로드'}
          </Button>
          {/* CSV 다운로드 */}
          <Button 
            variant="outline" 
            size="lg" 
            icon={Download} 
            onClick={onExportCSV}
          >
            CSV (.csv) 다운로드
          </Button>
        </div>
        <div style={{ fontSize: 11, color: T.textMute, marginTop: 8 }}>
          <strong style={{ color: T.brand }}>Excel 권장</strong> — 컬럼 너비 자동 조정 + 시트 명명 + 한글 안정성. 
          {' '}다운로드 후 ECount → 인사관리 → 인사카드 → 가져오기 메뉴에서 업로드하세요
        </div>
      </div>
    </div>
  );
}

// Import 탭 콘텐츠
function EcountImportTab({ file, preview, importResult, isLoading, fileInputRef, onFileSelect, onDownloadCSVTemplate, onDownloadXLSXTemplate, onConfirmImport, onReset }) {
  return (
    <div>
      {/* 안내 */}
      <div style={{ 
        padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', borderLeft: `3px solid ${T.warning}`, 
        borderRadius: 4, marginBottom: S[4], display: 'flex', alignItems: 'flex-start', gap: S[2]
      }}>
        <AlertCircle size={14} style={{ color: T.warning, flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7 }}>
          <strong style={{ color: T.warning }}>ECount에서 내보낸 인사카드 Excel(.xlsx) 또는 CSV 파일을 업로드하세요.</strong> 사번이 같으면 업데이트, 새 사번이면 신규 추가됩니다. Excel은 첫 번째 시트의 데이터를 읽습니다.
        </div>
      </div>
      
      {/* 파일 업로드 영역 */}
      {!preview && !importResult && (
        <div>
          <div 
            onClick={() => !isLoading && fileInputRef.current?.click()}
            style={{ 
              border: `2px dashed ${isLoading ? T.brand : T.border}`, borderRadius: 8, padding: S[6],
              textAlign: 'center', cursor: isLoading ? 'wait' : 'pointer', transition: 'all 0.15s',
              background: isLoading ? '#F0F4FB' : T.surfaceAlt,
              position: 'relative'
            }}
            onMouseEnter={e => { 
              if (isLoading) return;
              e.currentTarget.style.borderColor = T.brand; 
              e.currentTarget.style.background = '#F0F4FB'; 
            }}
            onMouseLeave={e => { 
              if (isLoading) return;
              e.currentTarget.style.borderColor = T.border; 
              e.currentTarget.style.background = T.surfaceAlt; 
            }}
          >
            {isLoading ? (
              <>
                <div style={{ 
                  width: 32, height: 32, margin: '0 auto 12px', 
                  border: `3px solid ${T.divider}`, borderTop: `3px solid ${T.brand}`,
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.brand, marginBottom: 4 }}>
                  Excel 라이브러리 로딩 중...
                </div>
                <div style={{ fontSize: 11, color: T.textMute }}>
                  최초 1회만 인터넷에서 SheetJS를 가져옵니다 (약 500KB)
                </div>
              </>
            ) : (
              <>
                <Upload size={32} style={{ color: T.brand, margin: '0 auto 12px', display: 'block' }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>
                  Excel 또는 CSV 파일을 클릭하여 업로드
                </div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 8 }}>
                  ECount에서 내보낸 인사카드 파일 (.xlsx · .xls · .csv)
                </div>
                <div style={{ 
                  display: 'inline-flex', gap: 6, fontSize: 10, color: T.textLight,
                  padding: '4px 10px', background: T.surface, borderRadius: 12,
                  marginTop: 4
                }}>
                  <span style={{ padding: '2px 6px', background: '#E8F4E8', color: T.success, borderRadius: 3, fontWeight: 600 }}>XLSX</span>
                  <span style={{ padding: '2px 6px', background: '#E8F4E8', color: T.success, borderRadius: 3, fontWeight: 600 }}>XLS</span>
                  <span style={{ padding: '2px 6px', background: '#F0F0F0', color: T.textMute, borderRadius: 3, fontWeight: 600 }}>CSV</span>
                </div>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".csv,.txt,.xlsx,.xls,.xlsm" onChange={onFileSelect} 
              style={{ display: 'none' }} disabled={isLoading} />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: S[4], display: 'flex', justifyContent: 'center', gap: S[2] }}>
            <Button variant="ghost" size="sm" icon={Download} onClick={onDownloadXLSXTemplate} disabled={isLoading}>
              Excel 양식 샘플 (.xlsx)
            </Button>
            <Button variant="ghost" size="sm" icon={Download} onClick={onDownloadCSVTemplate}>
              CSV 양식 샘플 (.csv)
            </Button>
          </div>
        </div>
      )}
      
      {/* 가져오기 결과 (완료) */}
      {importResult && (
        <div style={{ 
          padding: S[5], background: '#F0F7F1', border: `1px solid ${T.success}`,
          borderRadius: 8, textAlign: 'center'
        }}>
          <CheckCircle2 size={40} style={{ color: T.success, margin: '0 auto 12px', display: 'block' }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
            가져오기 완료
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: S[5], marginTop: S[4] }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.success, fontVariantNumeric: 'tabular-nums' }}>
                +{importResult.added}
              </div>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em' }}>신규 추가</div>
            </div>
            <div style={{ height: 40, width: 1, background: T.border }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.brand, fontVariantNumeric: 'tabular-nums' }}>
                {importResult.updated}
              </div>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em' }}>업데이트</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onReset} style={{ marginTop: S[4] }}>다시 가져오기</Button>
        </div>
      )}
      
      {/* 미리보기 (가져오기 전) */}
      {preview && !importResult && (
        <div>
          {/* 요약 정보 */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6,
            marginBottom: S[4]
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flex: 1, minWidth: 0 }}>
              <FileText size={14} style={{ color: file?.name?.match(/\.(xlsx|xls|xlsm)$/i) ? T.success : T.brand, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file?.name}
              </span>
              <span style={{ fontSize: 11, color: T.textMute, flexShrink: 0 }}>· {(file?.size / 1024).toFixed(1)} KB</span>
              {/* Excel 시트 정보 표시 */}
              {preview.sheetName && (
                <span style={{ 
                  fontSize: 10, padding: '2px 8px', background: T.surface, 
                  border: `1px solid ${T.success}`, color: T.success, borderRadius: 3, 
                  fontWeight: 600, flexShrink: 0, marginLeft: 4
                }}>
                  📄 시트 "{preview.sheetName}"
                  {preview.totalSheets > 1 && (
                    <span style={{ color: T.textMute, marginLeft: 4 }}>(총 {preview.totalSheets}개 중 1번)</span>
                  )}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" icon={X} onClick={onReset}>다른 파일 선택</Button>
          </div>
          
          {/* 여러 시트 안내 (Excel만 해당) */}
          {preview.totalSheets > 1 && (
            <div style={{ 
              padding: `${S[2]}px ${S[3]}px`, background: '#FFF8E6', borderLeft: `3px solid ${T.warning}`,
              borderRadius: 4, marginBottom: S[3], fontSize: 11, color: T.text, lineHeight: 1.6,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <AlertCircle size={12} style={{ color: T.warning, flexShrink: 0 }} />
              <span>
                Excel에 {preview.totalSheets}개의 시트가 있습니다. <strong>첫 번째 시트 "{preview.sheetName}"</strong>의 데이터만 가져옵니다.
                다른 시트의 데이터가 필요하면 ECount에서 해당 시트만 별도로 내보내거나, 첫 번째 시트로 이동시켜주세요.
              </span>
            </div>
          )}
          
          {/* 오류 표시 */}
          {preview.errors?.length > 0 && (
            <div style={{ 
              padding: `${S[3]}px ${S[4]}px`, background: '#FBEAEA', border: `1px solid ${T.danger}`,
              borderRadius: 6, marginBottom: S[4]
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <AlertCircle size={14} style={{ color: T.danger }} />
                <strong style={{ fontSize: 12, color: T.danger }}>오류 {preview.errors.length}건</strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 11, color: T.text, lineHeight: 1.7 }}>
                {preview.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                {preview.errors.length > 5 && <li>... 외 {preview.errors.length - 5}건</li>}
              </ul>
            </div>
          )}
          
          {/* 가져올 데이터 요약 */}
          {preview.employees.length > 0 && (
            <>
              <div style={{ 
                padding: `${S[3]}px ${S[4]}px`, background: '#F0F7F1', border: `1px solid ${T.success}`,
                borderRadius: 6, marginBottom: S[4],
                display: 'flex', alignItems: 'center', gap: S[2]
              }}>
                <CheckCircle2 size={16} style={{ color: T.success }} />
                <strong style={{ fontSize: 13, color: T.success }}>
                  {preview.employees.length}명의 직원 데이터가 인식되었습니다
                </strong>
              </div>
              
              {/* 컬럼 매핑 미리보기 */}
              <div style={{ marginBottom: S[4] }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em', marginBottom: S[2] }}>
                  매핑된 컬럼 ({Object.keys(preview.columnMap || {}).length}개)
                </div>
                <div style={{ 
                  display: 'flex', gap: 6, flexWrap: 'wrap', 
                  padding: S[3], background: T.surfaceAlt, borderRadius: 6
                }}>
                  {Object.entries(preview.columnMap || {}).map(([idx, key]) => {
                    const col = ECOUNT_HR_COLUMNS.find(c => c.key === key);
                    return (
                      <span key={idx} style={{ 
                        padding: '3px 8px', background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: 3, fontSize: 11, color: T.text
                      }}>
                        {preview.headers[idx]} → <strong style={{ color: T.brand }}>{col?.label}</strong>
                      </span>
                    );
                  })}
                </div>
              </div>
              
              {/* 데이터 샘플 (앞 3명) */}
              <div style={{ marginBottom: S[4] }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em', marginBottom: S[2] }}>
                  데이터 샘플 (상위 3명)
                </div>
                <div style={{ overflowX: 'auto', border: `1px solid ${T.border}`, borderRadius: 6 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: T.surfaceAlt }}>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, color: T.textMute, fontWeight: 700 }}>사번</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, color: T.textMute, fontWeight: 700 }}>이름</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, color: T.textMute, fontWeight: 700 }}>부서</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, color: T.textMute, fontWeight: 700 }}>직위</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, color: T.textMute, fontWeight: 700 }}>입사일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.employees.slice(0, 3).map((emp, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${T.divider}` }}>
                          <td style={{ padding: '6px 10px', fontFamily: 'monospace', color: T.textMute }}>{emp.id}</td>
                          <td style={{ padding: '6px 10px', fontWeight: 600 }}>{emp.name}</td>
                          <td style={{ padding: '6px 10px' }}>{emp.dept || '-'}</td>
                          <td style={{ padding: '6px 10px' }}>{emp.position || '-'}</td>
                          <td style={{ padding: '6px 10px' }}>{emp.hireDate || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 가져오기 확정 버튼 */}
              <div style={{ textAlign: 'center', paddingTop: S[3] }}>
                <Button variant="primary" size="lg" icon={Upload} onClick={onConfirmImport}>
                  {preview.employees.length}명 가져오기 실행
                </Button>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 8 }}>
                  사번이 같으면 업데이트, 새 사번이면 신규 추가됩니다
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 직원 추가/수정 모달
// ============================================================
function EmployeeModal({ target, existingIds, onSave, onClose }) {
  const isNew = !!target.__isNew;
  const [form, setForm] = useState(isNew ? {
    id: '', name: '', dept: '', position: '', level: 'L2', group: 'Archive',
    hireDate: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
    baseSalary: 2500000, allowance: 0, mealCar: 200000, qualif: 0,
    evalTarget: true, status: 'active', role: '', email: '', note: ''
  } : { ...target });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.id.trim()) return setError('사번을 입력해주세요.');
    if (!form.name.trim()) return setError('성명을 입력해주세요.');
    if (isNew && existingIds.includes(form.id.trim())) return setError('이미 존재하는 사번입니다.');
    if (!form.dept.trim()) return setError('부서를 입력해주세요.');
    setError('');
    onSave({
      ...form,
      id: form.id.trim(), name: form.name.trim(), dept: form.dept.trim(),
      baseSalary: Number(form.baseSalary) || 0,
      allowance: Number(form.allowance) || 0,
      mealCar: Number(form.mealCar) || 0,
      qualif: Number(form.qualif) || 0,
    }, isNew);
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: 'rgba(15, 37, 71, 0.45)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      padding: S[5], animation: 'fadeIn 0.15s ease-out'
    }}
    onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ 
        background: T.surface, borderRadius: 10, width: '100%', maxWidth: 680, 
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* 헤더 */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}`,
          position: 'sticky', top: 0, background: T.surface, zIndex: 1
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.brand, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {isNew ? 'Add Employee' : 'Edit Employee'}
            </div>
            <h2 style={{ margin: `${S[1]}px 0 0`, fontSize: 20, fontWeight: 700, color: T.ink }}>
              {isNew ? '직원 추가' : `${target.name} 정보 수정`}
            </h2>
          </div>
          <button onClick={onClose} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute, display: 'inline-flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* 폼 본문 */}
        <div style={{ padding: S[6] }}>
          {/* 기본 정보 */}
          <SectionTitle>기본 정보</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], marginBottom: S[5] }}>
            <Field label="사번" required>
              <ModalInput value={form.id} onChange={v => set('id', v)} disabled={!isNew} placeholder="예) K-260401" />
              {!isNew && <div style={{ fontSize: 10, color: T.textLight, marginTop: 4 }}>사번은 수정할 수 없습니다</div>}
            </Field>
            <Field label="성명" required>
              <ModalInput value={form.name} onChange={v => set('name', v)} placeholder="예) 홍길동" />
            </Field>
            <Field label="부서" required>
              <ModalInput value={form.dept} onChange={v => set('dept', v)} placeholder="예) 아카이브사업팀" />
            </Field>
            <Field label="직위">
              <ModalInput value={form.position} onChange={v => set('position', v)} placeholder="예) 대리" />
            </Field>
            <Field label="직무레벨">
              <ModalSelect value={form.level} onChange={v => set('level', v)} options={[
                { v: 'L1', l: 'L1 · 사원·주임' }, { v: 'L2', l: 'L2 · 대리·과장' },
                { v: 'L3', l: 'L3 · 차장·부장' }, { v: 'L4', l: 'L4 · 이사+' }
              ]} />
            </Field>
            <Field label="직무군">
              <ModalSelect value={form.group} onChange={v => set('group', v)} options={[
                { v: 'Archive', l: 'Archive · 기록관리' }, 
                { v: 'Tech', l: 'Tech · 기술개발' }, 
                { v: 'Biz', l: 'Biz · 사업경영' },
                { v: 'PM', l: 'PM · 사업수행' }
              ]} />
            </Field>
            <Field label="입사일">
              <ModalInput value={form.hireDate} onChange={v => set('hireDate', v)} placeholder="예) 2026/04/01" />
            </Field>
            <Field label="이메일">
              <ModalInput value={form.email} onChange={v => set('email', v)} placeholder="예) hong@koition.com" />
            </Field>
            <Field label="담당 역할">
              <ModalInput value={form.role} onChange={v => set('role', v)} placeholder="예) PM, PL, 기록전문, 팀장" />
            </Field>
            <Field label="재직 상태">
              <ModalSelect value={form.status} onChange={v => set('status', v)} options={[
                { v: 'active', l: '재직' }, { v: 'leave', l: '휴직' },
                { v: 'freelancer', l: '프리랜서' }, { v: 'advisor', l: '자문' }
              ]} />
            </Field>
          </div>

          {/* 급여 정보 */}
          <SectionTitle>급여 정보 (월 기준, 원)</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], marginBottom: S[5] }}>
            <Field label="기본급">
              <ModalInput type="number" value={form.baseSalary} onChange={v => set('baseSalary', v)} />
            </Field>
            <Field label="직책수당">
              <ModalInput type="number" value={form.allowance} onChange={v => set('allowance', v)} />
            </Field>
            <Field label="식대·차량유지비">
              <ModalInput type="number" value={form.mealCar} onChange={v => set('mealCar', v)} />
            </Field>
            <Field label="자격수당">
              <ModalInput type="number" value={form.qualif} onChange={v => set('qualif', v)} />
            </Field>
          </div>

          {/* 평가 설정 */}
          <SectionTitle>평가 설정</SectionTitle>
          <div style={{ marginBottom: S[5] }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: S[3], background: T.surfaceAlt, borderRadius: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.evalTarget} onChange={e => set('evalTarget', e.target.checked)} style={{ width: 16, height: 16, accentColor: T.brand }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>인사평가 대상</div>
                <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>체크 해제 시 평가에서 제외됩니다 (대표이사·자문·휴직 등)</div>
              </div>
            </label>
          </div>

          {/* 비고 / 특이사항 */}
          <SectionTitle>비고 · 특이사항</SectionTitle>
          <div style={{ marginBottom: S[3] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
              <StickyNote size={14} style={{ color: T.brand }} />
              <span style={{ fontSize: 12, color: T.textMute }}>승진 이력, 휴직 사유, 계약 조건, 특기사항 등 자유롭게 기입</span>
            </div>
            <textarea value={form.note || ''} onChange={e => set('note', e.target.value)} rows={4}
              placeholder="예) 2025년 우수사원 표창 / 2026.03 육아휴직 예정 / 정보관리기술사 자격 보유 / 강원랜드 아카이브 프로젝트 PM 담당"
              style={{ 
                width: '100%', padding: '12px 14px', border: `1px solid ${T.border}`, borderRadius: 6,
                fontSize: 13, fontFamily: FONT, lineHeight: 1.7, background: T.surface,
                boxSizing: 'border-box', resize: 'vertical', outline: 'none', color: T.ink
              }}
              onFocus={e => e.target.style.borderColor = T.brand}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>

          {error && (
            <div style={{ 
              fontSize: 12, color: T.danger, padding: `${S[2]}px ${S[3]}px`,
              background: '#FBEAEA', borderRadius: 4, marginBottom: S[3],
              display: 'flex', alignItems: 'center', gap: S[2]
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>

        {/* 푸터 버튼 */}
        <div style={{ 
          display: 'flex', justifyContent: 'flex-end', gap: S[3],
          padding: `${S[4]}px ${S[6]}px`, borderTop: `1px solid ${T.border}`,
          position: 'sticky', bottom: 0, background: T.surface
        }}>
          <Button variant="outline" size="lg" onClick={onClose}>취소</Button>
          <Button variant="primary" size="lg" icon={CheckCircle2} onClick={handleSubmit}>
            {isNew ? '직원 추가' : '변경사항 저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: S[2] }}>
        {label}{required && <span style={{ color: T.danger, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function ModalInput({ value, onChange, type = 'text', placeholder, disabled }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} disabled={disabled}
      style={{ 
        width: '100%', padding: '10px 12px', border: `1px solid ${T.border}`, borderRadius: 6,
        fontSize: 13, background: disabled ? T.surfaceAlt : T.surface, boxSizing: 'border-box',
        fontFamily: FONT, outline: 'none', color: disabled ? T.textMute : T.ink,
        fontVariantNumeric: type === 'number' ? 'tabular-nums' : 'normal'
      }}
      onFocus={e => !disabled && (e.target.style.borderColor = T.brand)}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  );
}

function ModalSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ 
        width: '100%', padding: '10px 12px', border: `1px solid ${T.border}`, borderRadius: 6,
        fontSize: 13, background: T.surface, boxSizing: 'border-box', fontFamily: FONT, color: T.ink, outline: 'none'
      }}>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

function Th({ children, align = 'left' }) {
  return <th style={{ padding: `${S[3]}px ${S[3]}px`, textAlign: align, fontSize: 11, fontWeight: 600, color: T.textMute, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: `1px solid ${T.border}`, whiteSpace: 'nowrap' }}>{children}</th>;
}

function Td({ children, align = 'left', mono = false }) {
  return <td style={{ padding: `${S[3]}px ${S[3]}px`, textAlign: align, fontFamily: mono ? '"SF Mono", Monaco, monospace' : FONT, fontVariantNumeric: mono ? 'tabular-nums' : 'normal', whiteSpace: 'nowrap' }}>{children}</td>;
}

// ============================================================
// 프로젝트 수익성 (경영지원부 소관)
// ============================================================
const fmtMoney = (n) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 100000000) return (v / 100000000).toFixed(2).replace(/\.?0+$/, '') + '억';
  if (Math.abs(v) >= 10000) return Math.round(v / 10000).toLocaleString('ko-KR') + '만';
  return v.toLocaleString('ko-KR');
};

// CSV 한 줄 파싱 (따옴표 필드 지원)
function parseCsvLine(line) {
  const out = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { q = false; }
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}

// 참여자 문자열 파싱 : "K-180501:PM:45|K-170801:핵심실무:35"
function parseMembers(str) {
  if (!str) return [];
  return str.split('|').map(seg => seg.trim()).filter(Boolean).map(seg => {
    const [empId, role, contribution] = seg.split(':').map(s => (s || '').trim());
    return { empId, role: role || '참여', contribution: Number(contribution) || 0 };
  }).filter(m => m.empId);
}

function StatusBadge({ status }) {
  return status === 'completed'
    ? <Badge color={T.success} variant="outline" size="sm">종료</Badge>
    : <Badge color={T.warning} variant="outline" size="sm">진행중</Badge>;
}

// 공통비(간접비) 풀 관리 + 배부 → 공헌이익 / 완전영업이익
function OverheadView({ projects, overheads, currentYear, yearFilter, policy, setPolicy, canEdit, upsertOverhead, deleteOverhead }) {
  const [cat, setCat] = useState('');
  const [amt, setAmt] = useState('');
  const poolYear = yearFilter === 'all' ? currentYear : Number(yearFilter);
  const basis = (policy && policy.allocation && policy.allocation.basis) || 'labor';
  const mode = (policy && policy.allocation && policy.allocation.mode) || 'annual';
  const entries = (overheads || []).filter(o => Number(o.year) === poolYear);
  const poolTotal = entries.reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const allocMap = mode === 'monthly'
    ? allocateOverheadMonthly(projects, entries, poolYear)
    : allocateOverhead(projects, poolTotal, basis);
  const rows = projects.map(p => {
    const m = projectMetrics(p); const alloc = allocMap[p.id] || 0;
    return { id: p.id, name: p.name, revenue: m.revenue, cost: m.cost, contrib: m.profit, alloc, full: m.profit - alloc };
  }).filter(r => r.cost > 0 || r.revenue > 0).sort((a, b) => b.revenue - a.revenue);
  const totRev = rows.reduce((s, r) => s + r.revenue, 0);
  const totContrib = rows.reduce((s, r) => s + r.contrib, 0);
  const totFull = totContrib - poolTotal;
  const ohRatio = totRev > 0 ? (poolTotal / totRev * 100) : 0;
  const setBasis = (b) => setPolicy(prev => ({ ...prev, allocation: { ...(prev.allocation || {}), basis: b } }));
  const setMode = (m) => setPolicy(prev => ({ ...prev, allocation: { ...(prev.allocation || {}), mode: m } }));
  const add = () => {
    if (!cat.trim() || !amt) { alert('항목과 금액을 입력하세요.'); return; }
    upsertOverhead({ id: 'OH:' + poolYear + ':' + Date.now(), year: poolYear, category: cat.trim(), amount: Number(amt) || 0, note: '수기 입력' });
    setCat(''); setAmt('');
  };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4], marginBottom: S[5] }}>
        <MetricCard icon={Wallet} label={`${poolYear}년 공통비(간접비)`} value={fmtMoney(poolTotal)} unit="원" color={T.warning} />
        <MetricCard icon={TrendingUp} label="공헌이익 계" value={fmtMoney(totContrib)} unit="원" color={T.brand} />
        <MetricCard icon={Award} label="완전영업이익 계" value={fmtMoney(totFull)} unit="원" color={totFull >= 0 ? T.success : T.danger} />
        <MetricCard icon={PieIcon} label="공통비율(공통비/매출)" value={ohRatio.toFixed(1)} unit="%" color={T.warning} />
      </div>

      <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: S[3], marginBottom: S[3] }}>
          <SectionTitle>배부 방식</SectionTitle>
          <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: T.textMute, fontWeight: 600 }}>기간</span>
              {[['annual', '연 배부'], ['monthly', '월 배부']].map(([mo, lab]) => (
                <button key={mo} disabled={!canEdit} onClick={() => setMode(mo)} style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 12, fontFamily: FONT, cursor: canEdit ? 'pointer' : 'default',
                  border: `1px solid ${mode === mo ? T.brand : T.border}`, background: mode === mo ? T.brand : T.surface,
                  color: mode === mo ? '#fff' : T.text, fontWeight: 600,
                }}>{lab}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: T.textMute, fontWeight: 600 }}>기준</span>
              {[['labor', '직접인건비'], ['revenue', '매출'], ['none', '미배부']].map(([b, lab]) => (
                <button key={b} disabled={!canEdit || mode === 'monthly'} onClick={() => setBasis(b)} style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 12, fontFamily: FONT, cursor: (canEdit && mode !== 'monthly') ? 'pointer' : 'default',
                  border: `1px solid ${basis === b && mode !== 'monthly' ? T.brand : T.border}`, background: basis === b && mode !== 'monthly' ? T.brand : T.surface,
                  color: mode === 'monthly' ? T.textLight : (basis === b ? '#fff' : T.text), fontWeight: 600, opacity: mode === 'monthly' ? 0.5 : 1,
                }}>{lab}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.textMute, lineHeight: 1.7 }}>
          {mode === 'monthly'
            ? <>공통비를 <strong>월별</strong>로 나눠, 각 달의 공통비를 그 달의 프로젝트 <strong>직접비 비중</strong>으로 배부합니다. 특정 월에만 활동한 프로젝트에는 그 달의 공통비만 실립니다. (월별 직접비는 사업관리 엑셀의 월별 현황에서 자동 반영)</>
            : <>공통비를 연 단위로 <strong>{ALLOC_LABELS[basis]}</strong>으로 배부합니다.</>}
          {' '}공헌이익 = 매출 − 직접원가, 완전영업이익 = 공헌이익 − 배부공통비.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: S[5] }}>
        <div style={{ ...card(), padding: S[6] }}>
          <SectionTitle>{poolYear}년 공통비 항목</SectionTitle>
          {canEdit && (
            <div style={{ display: 'flex', gap: S[2], marginBottom: S[3] }}>
              <input value={cat} onChange={e => setCat(e.target.value)} placeholder="항목(예: 본사 임차료)" style={{ flex: 2, padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, fontFamily: FONT, boxSizing: 'border-box' }} />
              <input value={amt} onChange={e => setAmt(e.target.value)} type="number" placeholder="금액" style={{ flex: 1, padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, fontFamily: FONT, textAlign: 'right', boxSizing: 'border-box' }} />
              <Button variant="primary" size="sm" icon={Plus} onClick={add}>추가</Button>
            </div>
          )}
          {entries.length === 0 ? (
            <div style={{ fontSize: 12, color: T.textMute, padding: S[4], textAlign: 'center' }}>공통비 항목이 없습니다. 사업관리 엑셀 업로드(본사운영/공통경비) 또는 수기 입력으로 추가하세요.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><Th>항목</Th><Th align="right">금액</Th>{canEdit && <Th align="center"></Th>}</tr></thead>
              <tbody>
                {entries.map(o => (
                  <tr key={o.id} style={{ borderBottom: `1px solid ${T.divider}` }}>
                    <Td><div style={{ fontWeight: 600, color: T.ink }}>{o.category}</div>{o.note && <div style={{ fontSize: 10, color: T.textMute }}>{o.note}</div>}</Td>
                    <Td align="right" mono>{fmtMoney(o.amount)}</Td>
                    {canEdit && <Td align="center"><button onClick={() => deleteOverhead(o.id)} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}><Trash2 size={14} /></button></Td>}
                  </tr>
                ))}
                <tr><Td><strong>합계</strong></Td><Td align="right" mono><strong>{fmtMoney(poolTotal)}</strong></Td>{canEdit && <Td></Td>}</tr>
              </tbody>
            </table>
          )}
        </div>

        <div style={{ ...card(), padding: S[6] }}>
          <SectionTitle>프로젝트별 배부 · 완전영업이익</SectionTitle>
          {rows.length === 0 ? (
            <EmptyState icon={PieIcon} title="프로젝트 데이터 없음" desc="프로젝트를 등록하거나 사업관리 엑셀을 업로드하세요" />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr><Th>프로젝트</Th><Th align="right">매출</Th><Th align="right">직접원가</Th><Th align="right">공헌이익</Th><Th align="right">배부공통비</Th><Th align="right">완전영업이익</Th></tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${T.divider}` }}>
                      <Td><div style={{ whiteSpace: 'normal', maxWidth: 200, fontWeight: 600, color: T.ink }}>{r.name}</div></Td>
                      <Td align="right" mono>{fmtMoney(r.revenue)}</Td>
                      <Td align="right" mono>{fmtMoney(r.cost)}</Td>
                      <Td align="right" mono style={{ color: r.contrib >= 0 ? T.ink : T.danger }}>{fmtMoney(r.contrib)}</Td>
                      <Td align="right" mono style={{ color: T.warning }}>{r.alloc ? '-' + fmtMoney(r.alloc) : '0'}</Td>
                      <Td align="right" mono><strong style={{ color: r.full >= 0 ? T.success : T.danger }}>{fmtMoney(r.full)}</strong></Td>
                    </tr>
                  ))}
                  <tr style={{ background: T.surfaceAlt }}>
                    <Td><strong>합계</strong></Td>
                    <Td align="right" mono><strong>{fmtMoney(totRev)}</strong></Td>
                    <Td align="right" mono><strong>{fmtMoney(rows.reduce((s, r) => s + r.cost, 0))}</strong></Td>
                    <Td align="right" mono><strong>{fmtMoney(totContrib)}</strong></Td>
                    <Td align="right" mono><strong style={{ color: T.warning }}>-{fmtMoney(poolTotal)}</strong></Td>
                    <Td align="right" mono><strong style={{ color: totFull >= 0 ? T.success : T.danger }}>{fmtMoney(totFull)}</strong></Td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>
            {yearFilter === 'all' ? `공통비는 ${poolYear}년 기준으로 배부됩니다. 특정 연도를 선택하면 해당 연도 기준으로 계산됩니다.` : `${poolYear}년 프로젝트에 ${ALLOC_LABELS[basis]}으로 배부.`} 배부는 추정이므로 기준에 따라 프로젝트별 이익이 달라집니다.
          </div>
        </div>
      </div>
    </div>
  );
}

// 수주 파이프라인 (사업제안현황 연동)
function ProjectPipeline({ proposals, canEdit, deleteProposal, winProposal }) {
  if (!proposals || proposals.length === 0) {
    return <EmptyState icon={TrendingUp} title="제안 데이터가 없습니다" desc="사업관리 엑셀(사업제안현황 시트)을 업로드하면 수주 파이프라인이 표시됩니다" />;
  }
  const total = proposals.length;
  const won = proposals.filter(p => p.status === '수주').length;
  const convRate = total > 0 ? Math.round(won / total * 100) : 0;
  const pipelineBudget = proposals.filter(p => p.status !== '수주').reduce((s, p) => s + (p.budget || 0), 0);
  const wonBudget = proposals.filter(p => p.status === '수주').reduce((s, p) => s + (p.budget || 0), 0);
  const chartData = [
    { name: '제안중', 금액: pipelineBudget, key: 'p' },
    { name: '수주', 금액: wonBudget, key: 'w' },
  ];
  const sorted = [...proposals].sort((a, b) => (b.status === '수주' ? 0 : 1) - (a.status === '수주' ? 0 : 1) || (b.budget || 0) - (a.budget || 0));
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4], marginBottom: S[5] }}>
        <MetricCard icon={FileText} label="총 제안" value={total} unit="건" />
        <MetricCard icon={CheckCircle2} label="수주" value={won} unit="건" color={T.success} sub={`전환율 ${convRate}%`} />
        <MetricCard icon={TrendingUp} label="예상 매출(제안중)" value={fmtMoney(pipelineBudget)} unit="원" color={T.brand} />
        <MetricCard icon={Award} label="수주 확정 매출" value={fmtMoney(wonBudget)} unit="원" color={T.success} />
      </div>

      <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
        <SectionTitle>제안 → 수주 파이프라인 (예산 기준)</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.divider} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: T.textMute }} tickFormatter={(v) => fmtMoney(v)} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: T.textMute }} width={60} />
            <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={(v) => fmtMoney(v) + '원'} />
            <Bar dataKey="금액" radius={[0, 4, 4, 0]}>
              <Cell fill="#7FB0E0" /><Cell fill={T.success} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>수주 여부는 사업명 자동 매칭 또는 [수주 확정] 버튼으로 처리됩니다. 수주 확정 시 신규 프로젝트가 생성되고, PM·제안참여인력에게 수주 기여점수(인사평가)와 PM 신규수주 실적(직원별 원장)이 자동 반영됩니다.</div>
      </div>

      <div style={{ ...card(), padding: S[6] }}>
        <SectionTitle>제안 현황</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <Th>사업명</Th><Th>주관기관</Th><Th align="right">사업예산</Th>
                <Th>입찰</Th><Th>PM</Th><Th align="center">상태</Th>
                {canEdit && <Th align="center">관리</Th>}
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${T.divider}` }}>
                  <Td><div style={{ whiteSpace: 'normal', maxWidth: 280, fontWeight: 600, color: T.ink }}>{p.name}</div>{p.consortium && <div style={{ fontSize: 10, color: T.textMute }}>{p.consortium}</div>}</Td>
                  <Td>{p.client}</Td>
                  <Td align="right" mono>{fmtMoney(p.budget)}</Td>
                  <Td>{p.bidDate}</Td>
                  <Td>{p.pm}</Td>
                  <Td align="center"><Badge color={p.status === '수주' ? T.success : T.textMute} variant={p.status === '수주' ? 'solid' : 'outline'} size="sm">{p.status}</Badge></Td>
                  {canEdit && <Td align="center">
                    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                      {p.status !== '수주' && winProposal && (
                        <Button size="sm" variant="secondary" icon={Award} onClick={() => winProposal(p.id)}>수주 확정</Button>
                      )}
                      <button onClick={() => { if (window.confirm('이 제안을 삭제할까요?')) deleteProposal(p.id); }} style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }} title="삭제"><Trash2 size={14} /></button>
                    </span>
                  </Td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 프로젝트 지출 분석 (작업자/관리자 인건비·제경비 시각화)
const EXP_COLORS = { worker: '#2E5BA0', mgr: '#7FB0E0', overhead: '#E0A64D', other: '#9AA6B2' };
function ProjectAnalytics({ projects, employees, cfg, targets, allProjects }) {
  const shortName = (n) => { n = String(n || '').replace(/^\(예시\)\s*/, ''); return n.length > 12 ? n.slice(0, 11) + '…' : n; };
  const bench = costBenchmark(projects);
  const rows = projects.map(p => {
    const m = projectMetrics(p);
    const diag = costDiagnosis(m, bench, cfg);
    return {
      id: p.id, name: shortName(p.name), full: p.name, dept: p.dept || '미지정',
      작업자: m.worker, 관리자: m.mgr, 제경비: m.overhead, 기타: m.other,
      revenue: m.revenue, cost: m.cost, profit: m.profit,
      overheadPct: m.overheadPct != null ? Math.round(m.overheadPct * 10) / 10 : 0,
      laborPctCost: m.cost > 0 ? Math.round(m.labor / m.cost * 100) : 0,
      laborPctRev: m.revenue > 0 ? Math.round(m.labor / m.revenue * 100) : 0,
      costPctRev: m.revenue > 0 ? Math.round(m.cost / m.revenue * 100) : 0,
      planCost: m.planCost, 계획: m.planCost, 실적: m.cost,
      planExecPct: m.planExecPct != null ? Math.round(m.planExecPct) : null,
      diag, warn: diag.status,
    };
  }).filter(r => r.cost > 0);

  const tot = rows.reduce((a, r) => ({
    worker: a.worker + r.작업자, mgr: a.mgr + r.관리자, overhead: a.overhead + r.제경비,
    other: a.other + r.기타, revenue: a.revenue + r.revenue, cost: a.cost + r.cost,
  }), { worker: 0, mgr: 0, overhead: 0, other: 0, revenue: 0, cost: 0 });
  const totLabor = tot.worker + tot.mgr;
  const ohPct = tot.cost > 0 ? (tot.overhead / tot.cost * 100) : 0;

  // 조직(수행조직)별 롤업
  const orgMap = {};
  rows.forEach(r => {
    if (!orgMap[r.dept]) orgMap[r.dept] = { name: r.dept, 매출: 0, 원가: 0, 영업이익: 0, cnt: 0 };
    orgMap[r.dept].매출 += r.revenue; orgMap[r.dept].원가 += r.cost; orgMap[r.dept].영업이익 += r.profit; orgMap[r.dept].cnt++;
  });
  const orgData = Object.values(orgMap).map(o => ({ ...o, 이익률: o.매출 > 0 ? Math.round(o.영업이익 / o.매출 * 1000) / 10 : 0 }));

  // 연도별 추세 (전체 연도 기준)
  const yearMap = {};
  (allProjects || projects).forEach(p => {
    const m = projectMetrics(p); if (m.cost <= 0) return;
    const y = Number(p.year) || 0; if (!y) return;
    if (!yearMap[y]) yearMap[y] = { year: String(y), 매출: 0, 원가: 0, 영업이익: 0, overhead: 0 };
    const e = yearMap[y]; e.매출 += m.revenue; e.원가 += m.cost; e.영업이익 += m.profit; e.overhead += m.overhead;
  });
  const yearData = Object.values(yearMap).sort((a, b) => Number(a.year) - Number(b.year)).map(e => ({
    ...e, 수익률: e.매출 > 0 ? Math.round(e.영업이익 / e.매출 * 1000) / 10 : 0,
    제경비비중: e.원가 > 0 ? Math.round(e.overhead / e.원가 * 1000) / 10 : 0,
  }));

  // 진단 경고 대상
  const warnList = rows.filter(r => r.diag.status !== 'none').sort((a, b) => (b.diag.status === 'alert' ? 1 : 0) - (a.diag.status === 'alert' ? 1 : 0));
  // 계획 대비 집행 (예산 데이터가 있는 프로젝트만)
  const planRows = rows.filter(r => r.planCost > 0);
  const overBudget = planRows.filter(r => r.planExecPct != null && r.planExecPct > 100).sort((a, b) => b.planExecPct - a.planExecPct);

  // 직원별 투입·기여 현황 (인력 배분 + 평가 반영 기여도 교차확인)
  const empName = (id) => (employees || []).find(e => e.id === id)?.name || id;
  const empDept = (id) => (employees || []).find(e => e.id === id)?.dept || '';
  const empMap = {};
  projects.forEach(p => {
    const m = projectMetrics(p);
    (p.members || []).forEach(mem => {
      if (!empMap[mem.empId]) empMap[mem.empId] = { empId: mem.empId, count: 0, laborIn: 0, wsum: 0, hasPM: false };
      const e = empMap[mem.empId];
      e.count++; e.laborIn += m.labor * (mem.contribution || 0) / 100; e.wsum += (mem.contribution || 0);
      if (mem.role === 'PM') e.hasPM = true;
    });
  });
  const empRows = Object.values(empMap).map(e => {
    const cs = calcContributionScore(e.empId, projects, null);
    return { ...e, name: empName(e.empId), dept: empDept(e.empId), avg: e.count ? Math.round(e.wsum / e.count) : 0, score: cs ? cs.score : null, grade: cs ? cs.grade : null };
  }).sort((a, b) => b.laborIn - a.laborIn);

  const downloadCsv = () => {
    const head = ['프로젝트ID', '프로젝트명', '수행조직', '매출', '작업자인건비', '관리자인건비', '제경비', '총원가', '영업이익', '수익률(%)', '인건비/매출(%)', '제경비/원가(%)', '원가율(%)', '진단'];
    const lines = [head.join(',')];
    rows.forEach(r => {
      const m = projectMetrics(projects.find(p => p.id === r.id));
      const diag = r.diag.flags.map(f => f.label).join(' ') || '정상';
      const cells = [r.id, `"${r.full}"`, r.dept, r.revenue, r.작업자, r.관리자, r.제경비, r.cost, r.profit,
        (m.rate != null ? m.rate.toFixed(1) : ''), r.laborPctRev, r.overheadPct, r.costPctRev, diag];
      lines.push(cells.join(','));
    });
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `프로젝트수익성_분석.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const pieData = [
    { name: '작업자인건비', value: tot.worker, key: 'worker' },
    { name: '관리자인건비', value: tot.mgr, key: 'mgr' },
    { name: '제경비', value: tot.overhead, key: 'overhead' },
    ...(tot.other > 0 ? [{ name: '외주·기타', value: tot.other, key: 'other' }] : []),
  ].filter(d => d.value > 0);

  const tip = { contentStyle: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }, formatter: (v) => fmtMoney(v) + '원' };

  if (rows.length === 0) return <EmptyState icon={PieIcon} title="원가 데이터가 없습니다" desc="사업관리 엑셀 업로드 또는 프로젝트 입력 후 표시됩니다" />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: S[3] }}>
        <Button variant="outline" size="sm" icon={Download} onClick={downloadCsv}>분석 CSV 내보내기</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4], marginBottom: S[5] }}>
        <MetricCard icon={TrendingUp} label="총 매출" value={fmtMoney(tot.revenue)} unit="원" />
        <MetricCard icon={Wallet} label="총 인건비" value={fmtMoney(totLabor)} unit="원" sub={`작업자 ${totLabor > 0 ? Math.round(tot.worker / totLabor * 100) : 0}% · 관리자 ${totLabor > 0 ? Math.round(tot.mgr / totLabor * 100) : 0}%`} />
        <MetricCard icon={Briefcase} label="총 제경비" value={fmtMoney(tot.overhead)} unit="원" />
        <MetricCard icon={PieIcon} label="사업비 대비 제경비" value={ohPct.toFixed(1)} unit="%" color={EXP_COLORS.overhead} />
      </div>

      {targets && (targets.revenue > 0 || targets.profit > 0) && (() => {
        const actualProfit = tot.revenue - tot.cost;
        const bar = (label, actual, target, color) => {
          const pct = target > 0 ? Math.min(100, Math.round(actual / target * 100)) : 0;
          const realPct = target > 0 ? Math.round(actual / target * 100) : 0;
          return (
            <div style={{ marginBottom: S[3] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: T.ink }}>{label} <span style={{ color: realPct >= 100 ? T.success : T.textMute, fontWeight: 700 }}>{realPct}%</span></span>
                <span style={{ color: T.textMute }}>{fmtMoney(actual)} / {fmtMoney(target)}원</span>
              </div>
              <div style={{ height: 10, borderRadius: 6, background: T.surfaceAlt, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 6 }} />
              </div>
            </div>
          );
        };
        return (
          <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
            <SectionTitle>연간 목표 대비 실적</SectionTitle>
            {targets.revenue > 0 && bar('매출', tot.revenue, targets.revenue, EXP_COLORS.worker)}
            {targets.profit > 0 && bar('영업이익', actualProfit, targets.profit, T.success)}
            <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>실적은 현재 조회 연도의 프로젝트 합계 기준입니다. 목표는 정책 설정에서 조정합니다.</div>
          </div>
        );
      })()}

      {warnList.length > 0 && (
        <div style={{ ...card({ borderLeft: `3px solid ${warnList.some(w => w.diag.status === 'alert') ? T.danger : T.warning}` }), padding: `${S[4]}px ${S[5]}px`, marginBottom: S[5] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: S[2] }}>
            <AlertCircle size={16} style={{ color: warnList.some(w => w.diag.status === 'alert') ? T.danger : T.warning }} />
            <span style={{ fontWeight: 700, color: T.ink, fontSize: 13 }}>원가구조 진단 경고 ({warnList.length}건)</span>
            <span style={{ fontSize: 11, color: T.textMute }}>인건비/매출 {LABOR_REV_WARN}%↑ · 제경비/원가 {OVERHEAD_WARN_PCT}%↑ · 원가율 {COST_REV_WARN}%↑ 또는 동종 중앙값 +{PEER_DEV_PP}%p</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
            {warnList.map(w => (
              <span key={w.id} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, background: w.diag.status === 'alert' ? '#FDECEC' : '#FFF6E5', color: w.diag.status === 'alert' ? T.danger : T.warning, fontWeight: 600 }}>
                {w.full.length > 16 ? w.full.slice(0, 15) + '…' : w.full} · {w.diag.flags.map(f => f.label).join('/')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5], marginBottom: S[5] }}>
        <div style={{ ...card(), padding: S[6] }}>
          <SectionTitle>지출 구성 (작업자·관리자·제경비)</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map(d => <Cell key={d.key} fill={EXP_COLORS[d.key]} />)}
              </Pie>
              <Tooltip {...tip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...card(), padding: S[6] }}>
          <SectionTitle>사업비 대비 제경비 %</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rows} margin={{ top: 10, right: 16, left: -10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} tick={{ fontSize: 10, fill: T.textMute }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: T.textMute }} unit="%" />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={(v) => v + '%'} />
              <Bar dataKey="overheadPct" name="제경비 비중" radius={[4, 4, 0, 0]}>
                {rows.map(r => <Cell key={r.id} fill={r.warn === 'alert' ? T.danger : r.warn === 'warn' ? T.warning : EXP_COLORS.overhead} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
        <SectionTitle>조직별 매출 · 원가 · 영업이익 (수익 롤업)</SectionTitle>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={orgData} margin={{ top: 10, right: 16, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
            <XAxis dataKey="name" angle={-25} textAnchor="end" height={70} tick={{ fontSize: 11, fill: T.textMute }} interval={0} />
            <YAxis tick={{ fontSize: 11, fill: T.textMute }} tickFormatter={(v) => fmtMoney(v)} />
            <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={(v, n) => [fmtMoney(v) + '원', n]} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            <Bar dataKey="매출" fill={EXP_COLORS.worker} radius={[4, 4, 0, 0]} />
            <Bar dataKey="원가" fill={EXP_COLORS.overhead} radius={[4, 4, 0, 0]} />
            <Bar dataKey="영업이익" radius={[4, 4, 0, 0]}>
              {orgData.map((o, i) => <Cell key={i} fill={o.영업이익 >= 0 ? T.success : T.danger} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>
          조직별 합계 · 영업이익이 음수(적자)면 붉게 표시됩니다.
        </div>
      </div>

      {yearData.length >= 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5], marginBottom: S[5] }}>
          <div style={{ ...card(), padding: S[6] }}>
            <SectionTitle>연도별 매출·원가·영업이익 추세</SectionTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yearData} margin={{ top: 10, right: 16, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: T.textMute }} />
                <YAxis tick={{ fontSize: 11, fill: T.textMute }} tickFormatter={(v) => fmtMoney(v)} />
                <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={(v) => fmtMoney(v) + '원'} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="매출" fill={EXP_COLORS.worker} radius={[4, 4, 0, 0]} />
                <Bar dataKey="원가" fill={EXP_COLORS.overhead} radius={[4, 4, 0, 0]} />
                <Bar dataKey="영업이익" radius={[4, 4, 0, 0]}>
                  {yearData.map((y, i) => <Cell key={i} fill={y.영업이익 >= 0 ? T.success : T.danger} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ ...card(), padding: S[6] }}>
            <SectionTitle>연도별 수익률·제경비 비중 추세</SectionTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yearData} margin={{ top: 10, right: 16, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: T.textMute }} />
                <YAxis tick={{ fontSize: 11, fill: T.textMute }} unit="%" />
                <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={(v) => v + '%'} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="수익률" fill={T.success} radius={[4, 4, 0, 0]} name="수익률(%)" />
                <Bar dataKey="제경비비중" fill={EXP_COLORS.overhead} radius={[4, 4, 0, 0]} name="제경비 비중(%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {planRows.length > 0 && (
        <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
          <SectionTitle>계획 대비 집행 원가</SectionTitle>
          {overBudget.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: S[3], padding: `${S[2]}px ${S[3]}px`, background: '#FDECEC', borderRadius: 6 }}>
              <AlertCircle size={14} style={{ color: T.danger }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: T.danger }}>예산 초과 {overBudget.length}건</span>
              {overBudget.map(r => (
                <span key={r.id} style={{ fontSize: 11, color: T.danger }}>{r.name}({r.planExecPct}%)</span>
              ))}
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={planRows} margin={{ top: 10, right: 16, left: 10, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} tick={{ fontSize: 10, fill: T.textMute }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: T.textMute }} tickFormatter={(v) => fmtMoney(v)} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={(v) => fmtMoney(v) + '원'} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="계획" fill={EXP_COLORS.mgr} radius={[4, 4, 0, 0]} name="계획원가(예산)" />
              <Bar dataKey="실적" radius={[4, 4, 0, 0]} name="실적원가(집행)">
                {planRows.map(r => <Cell key={r.id} fill={r.planExecPct != null && r.planExecPct > 100 ? T.danger : EXP_COLORS.worker} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>
            실적원가가 계획(예산)을 초과하면 붉게 표시됩니다. 계획값은 사업관리 엑셀의 '계획' 열에서 자동 반영됩니다.
          </div>
        </div>
      )}

      <div style={{ ...card(), padding: S[6] }}>
        <SectionTitle>프로젝트별 지출 분포 (작업자/관리자 인건비 · 제경비)</SectionTitle>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={rows} margin={{ top: 10, right: 16, left: 10, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={90} tick={{ fontSize: 10, fill: T.textMute }} interval={0} />
            <YAxis tick={{ fontSize: 11, fill: T.textMute }} tickFormatter={(v) => fmtMoney(v)} />
            <Tooltip {...tip} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            <Bar dataKey="작업자" stackId="c" fill={EXP_COLORS.worker} name="작업자인건비" />
            <Bar dataKey="관리자" stackId="c" fill={EXP_COLORS.mgr} name="관리자인건비" />
            <Bar dataKey="제경비" stackId="c" fill={EXP_COLORS.overhead} name="제경비" />
            {tot.other > 0 && <Bar dataKey="기타" stackId="c" fill={EXP_COLORS.other} name="외주·기타" radius={[4, 4, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>
          ※ 작업자/관리자 인건비 분리는 사업관리 엑셀(사업별집행내역) 업로드 시 자동 반영됩니다. 수동 입력 프로젝트는 작업자·관리자 인건비 칸을 나눠 입력하세요.
        </div>
      </div>

      <div style={{ ...card(), padding: S[6], marginTop: S[5] }}>
        <SectionTitle>프로젝트 원가구조 진단</SectionTitle>
        <div style={{ fontSize: 11, color: T.textMute, marginBottom: S[3] }}>
          동종 중앙값 — 인건비 비중(원가대비) {bench.laborMed != null ? bench.laborMed.toFixed(0) : '-'}% · 제경비 비중 {bench.ohMed != null ? bench.ohMed.toFixed(0) : '-'}% (분석 {bench.n}건 기준).
          절대 기준 초과 또는 중앙값 +{PEER_DEV_PP}%p 초과 시 과다로 진단합니다.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <Th>프로젝트</Th>
                <Th align="right">인건비/원가</Th><Th align="right">인건비/매출</Th>
                <Th align="right">제경비/원가</Th><Th align="right">원가율</Th>
                <Th>진단</Th>
              </tr>
            </thead>
            <tbody>
              {[...rows].sort((a, b) => (b.diag.status === 'alert' ? 2 : b.diag.status === 'warn' ? 1 : 0) - (a.diag.status === 'alert' ? 2 : a.diag.status === 'warn' ? 1 : 0)).map(r => {
                const hasLabor = r.diag.flags.some(f => f.type === 'labor');
                const hasOh = r.diag.flags.some(f => f.type === 'overhead');
                const hasCost = r.diag.flags.some(f => f.type === 'cost');
                const warnColor = (on) => on ? { color: T.danger, fontWeight: 700 } : {};
                return (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${T.divider}` }}>
                    <Td><div style={{ whiteSpace: 'normal', maxWidth: 260, fontWeight: 600, color: T.ink }}>{r.full}</div></Td>
                    <Td align="right" mono><span style={warnColor(hasLabor)}>{r.laborPctCost}%</span></Td>
                    <Td align="right" mono><span style={warnColor(hasLabor)}>{r.laborPctRev}%</span></Td>
                    <Td align="right" mono><span style={warnColor(hasOh)}>{r.overheadPct}%</span></Td>
                    <Td align="right" mono><span style={warnColor(hasCost)}>{r.costPctRev}%</span></Td>
                    <Td>
                      {r.diag.flags.length === 0
                        ? <Badge color={T.success} variant="outline" size="sm">정상</Badge>
                        : <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {r.diag.flags.map((f, fi) => (
                              <Badge key={fi} color={f.level === 'alert' ? T.danger : T.warning} variant="outline" size="sm">{f.label} · {f.detail}</Badge>
                            ))}
                          </div>}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ ...card(), padding: S[6], marginTop: S[5] }}>
        <SectionTitle>직원별 투입·기여 현황</SectionTitle>
        <div style={{ fontSize: 11, color: T.textMute, marginBottom: S[3] }}>
          참여 프로젝트 기준 투입 인건비(=프로젝트 인건비×기여도 비중)와 산정 기여도 점수입니다. 인력 배분과 평가 반영 기여도를 함께 점검할 수 있습니다.
        </div>
        {empRows.length === 0 ? (
          <EmptyState icon={Users} title="투입 인원 데이터 없음" desc="사업관리 엑셀 업로드 시 인력운영현황에서 자동 반영됩니다" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <Th>성명</Th><Th>부서</Th><Th align="center">참여 PJ</Th>
                  <Th align="right">투입 인건비(추정)</Th><Th align="right">평균 기여도</Th>
                  <Th align="right">산정 기여도 점수</Th><Th align="center">등급</Th>
                </tr>
              </thead>
              <tbody>
                {empRows.map(e => (
                  <tr key={e.empId} style={{ borderBottom: `1px solid ${T.divider}` }}>
                    <Td>
                      <span style={{ fontWeight: 600, color: T.ink }}>{e.name}</span>
                      {e.hasPM && <Badge color={T.brand} variant="outline" size="sm">PM</Badge>}
                    </Td>
                    <Td>{e.dept}</Td>
                    <Td align="center">{e.count}</Td>
                    <Td align="right" mono>{fmtMoney(e.laborIn)}</Td>
                    <Td align="right" mono>{e.avg}%</Td>
                    <Td align="right" mono>{e.score != null ? e.score : '-'}</Td>
                    <Td align="center">{e.grade ? <GradeBadge grade={e.grade} size="sm" /> : '-'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 경영보고서 (월간 경영진단 보고서) — 경영기획 관점 종합 분석
// ============================================================
// ============================================================
// 월마감 변환 — 계약직/정규직급여/지출 3파일 업로드 → 프로젝트 수익성 자동 반영
// ============================================================
function MonthCloseView({ projects, employees, bulkUpsertProjects, bulkUpsertOverheads, bulkSetEmpLedger, currentYear }) {
  const [files, setFiles] = React.useState({ cw: null, exp: null, sal: [], alloc: null });
  const [preview, setPreview] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const STOP = ['용역', '사업', '구축', '개발', '유지관리', '유지보수', '및', '운영', '전수조사', '보존처리', '연구', '관련'];
  const nrm = (s) => { s = String(s || '').replace(/\[[^\]]*\]/g, '').replace(/\([^)]*\)/g, '').replace(/20\d\d년?도?/g, ''); STOP.forEach(w => s = s.split(w).join('')); return s.replace(/[^0-9A-Za-z가-힣]/g, ''); };
  const projList = (projects || []).map(p => ({ id: p.id, name: p.name, pn: nrm(p.name) }));
  const match = (name) => { const n = nrm(name); if (!n) return null; for (const p of projList) { if (p.pn && (p.pn.includes(n) || n.includes(p.pn))) return p.id; } return null; };
  const mnum = (v) => { v = String(v || ''); let m = /\/(\d{1,2})/.exec(v); if (m) return +m[1]; m = /(\d{1,2})\s*월/.exec(v); if (m) return +m[1]; m = /(\d{1,2})/.exec(v); if (m) { const n = +m[1]; if (n >= 1 && n <= 12) return n; } return null; };
  const readBuf = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsArrayBuffer(file); });

  async function analyze() {
    setErr(''); setBusy(true); setPreview(null);
    try {
      if (!files.cw && !files.exp && files.sal.length === 0) throw new Error('최소 한 개 파일을 선택하세요');
      const XLSX = await loadXLSXLib();
      const openWb = async (f) => XLSX.read(await readBuf(f), { type: 'array', cellDates: true });
      const S = (ws, r, c) => { const x = ws[XLSX.utils.encode_cell({ r, c })]; return x ? String(x.v).replace(/[\r\n\t]+/g, ' ').trim() : ''; };
      const Nc = (ws, r, c) => { const x = ws[XLSX.utils.encode_cell({ r, c })]; if (!x || x.t === 'e') return 0; const v = x.v; if (typeof v === 'number') return v; const t = String(v).replace(/,/g, '').trim(); const n = Number(t); return isNaN(n) ? 0 : n; };
      const W = {}, M = {}, E = {}, OH = new Array(13).fill(0), CARD = {};
      const add = (o, id, mo, v) => { if (!o[id]) o[id] = new Array(13).fill(0); o[id][mo] += v; };
      const unmatched = {};
      const empNames = new Set((employees || []).map(e => String(e.name).trim()));
      let hasW = false, hasM = false, hasE = false;

      // 1) 작업자 파일: '통합본'(구양식) 또는 '급여현황'(신양식, 프로젝트명 포함) 자동 감지 · 정규직 명단으로 작업자/관리자 분류
      if (files.cw) {
        const wb = await openWb(files.cw);
        const t = wb.Sheets['통합본'];
        if (t) {
          const rng = XLSX.utils.decode_range(t['!ref']);
          for (let r = 2; r <= rng.e.r; r++) { const code = S(t, r, 1); if (!code) continue; const mo = mnum(S(t, r, 0)); const g = Nc(t, r, 3); const nm = S(t, r, 2); const pr = S(t, r, 17); const id = match(pr); if (id && mo) { if (empNames.has(nm)) { add(M, id, mo, g); hasM = true; } else { add(W, id, mo, g); hasW = true; } } else if (pr && !id) unmatched[pr] = (unmatched[pr] || 0) + g; }
        } else {
          const w = wb.Sheets['급여현황'] || wb.Sheets[wb.SheetNames[0]];
          const rng = XLSX.utils.decode_range(w['!ref']);
          let hr = -1; for (let r = 0; r < 8 && hr < 0; r++) for (let c = 0; c <= rng.e.c; c++) if (S(w, r, c) === '성명') { hr = r; break; }
          if (hr < 0) hr = 1; const col = {}; for (let c = 0; c <= rng.e.c; c++) { const h = S(w, hr, c); if (h) col[h] = c; }
          const cP = col['프로젝트명'] ?? 4, cN = col['성명'] ?? 5, cG = col['지급총액'] ?? 6, cY = col['귀속연월-NO'] ?? col['귀속연월'] ?? 0;
          for (let r = hr + 1; r <= rng.e.r; r++) { const nm = S(w, r, cN); if (!nm) continue; const mo = mnum(S(w, r, cY)); const g = Nc(w, r, cG); const pr = S(w, r, cP); const id = match(pr); if (id && mo) { if (empNames.has(nm)) { add(M, id, mo, g); hasM = true; } else { add(W, id, mo, g); hasW = true; } } else if (pr && !id) unmatched[pr] = (unmatched[pr] || 0) + g; }
        }
      }
      // 2) 지출정리 → 사업경비 + 공통비 + 카드
      if (files.exp) {
        hasE = true; const wb = await openWb(files.exp); const ej = wb.Sheets['통합거래원장'] || wb.Sheets[wb.SheetNames[0]];
        const rng = XLSX.utils.decode_range(ej['!ref']); let hr = 0; for (let r = 0; r < 6; r++) if (S(ej, r, 0) === '월') { hr = r; break; }
        for (let r = hr + 1; r <= rng.e.r; r++) {
          const sec = S(ej, r, 1), amt = Nc(ej, r, 6), proj = S(ej, r, 8), dam = S(ej, r, 9), mo = mnum(S(ej, r, 0));
          if (['매입(외주)', '지출결의서', '부동산', '카드사용'].includes(sec) && proj && mo) {
            if (/본사운영|공통경비/.test(proj)) OH[mo] += amt;
            else { const id = match(proj); if (id) add(E, id, mo, amt); else unmatched[proj] = (unmatched[proj] || 0) + amt; }
          }
          if (sec === '카드사용' && amt) { const m2 = /\(([^)]+)\)/.exec(dam); let who = (m2 ? m2[1] : dam).replace(/^(무기명|기명)\s*/, '').trim(); if (who) CARD[who] = (CARD[who] || 0) + amt; }
        }
      }
      // 3) 정규직 급여 + 배분표 → 관리자인건비
      const ratio = {};
      if (files.alloc && files.sal.length) {
        const aw = (await openWb(files.alloc)); const asheet = aw.Sheets['관리자배분표'] || aw.Sheets[aw.SheetNames[0]];
        const arng = XLSX.utils.decode_range(asheet['!ref']);
        for (let r = 2; r <= arng.e.r; r++) { const no = S(asheet, r, 0), who = S(asheet, r, 2), pct = Nc(asheet, r, 3); if (no && who && pct) { ratio[who] = ratio[who] || {}; ratio[who][no] = pct / 100; } }
        for (const f of files.sal) {
          const wb = await openWb(f); const ws = wb.Sheets[wb.SheetNames[0]]; const rng = XLSX.utils.decode_range(ws['!ref']);
          let hr = 1; for (let r = 0; r < 6; r++) { for (let c = 0; c <= rng.e.c; c++) if (S(ws, r, c) === '사원코드') { hr = r; break; } if (S(ws, hr, 0) === '사원코드' || hr !== 1) break; }
          const col = {}; for (let c = 0; c <= rng.e.c; c++) { const h = S(ws, hr, c); if (h) col[h] = c; }
          for (let r = hr + 1; r <= rng.e.r; r++) {
            if (S(ws, r, col['급여구분'] ?? 1) !== '급여') continue;
            const nm = S(ws, r, col['사원명'] ?? 3); const gross = Nc(ws, r, col['지급총액'] ?? 4); const mo = mnum(S(ws, r, col['귀속연월'] ?? 0));
            if (!nm || !mo || !ratio[nm]) continue;
            hasM = true; for (const [no, fr] of Object.entries(ratio[nm])) add(M, no, mo, gross * fr);
          }
        }
      }

      const ids = new Set([...Object.keys(W), ...Object.keys(M), ...Object.keys(E)]);
      const sum = (o, id) => (o[id] || []).reduce((a, b) => a + b, 0);
      const rows = [...ids].map(id => ({ id, name: (projList.find(p => p.id === id) || {}).name || id, w: sum(W, id), m: sum(M, id), e: sum(E, id) })).sort((a, b) => (b.w + b.m + b.e) - (a.w + a.m + a.e));
      setPreview({ rows, W, M, E, OH, CARD, hasW, hasM, hasE, ohTotal: OH.reduce((a, b) => a + b, 0), unmatched: Object.entries(unmatched).filter(([k, v]) => v > 100000).sort((a, b) => b[1] - a[1]), cardCount: Object.keys(CARD).length });
    } catch (e) { setErr(e.message || String(e)); }
    setBusy(false);
  }

  function apply() {
    if (!preview) return;
    const { W, M, E, OH, CARD, hasW, hasM, hasE } = preview;
    const sum = (o, id) => (o[id] || []).reduce((a, b) => a + b, 0);
    const ids = new Set([...Object.keys(W), ...Object.keys(M), ...Object.keys(E)]);
    const updated = [];
    (projects || []).forEach(p => {
      if (!ids.has(p.id)) return;
      const np = { ...p };
      if (hasW) np.workerLabor = Math.round(sum(W, p.id));
      if (hasM) np.mgrLabor = Math.round(sum(M, p.id));
      if (hasE) np.overhead = Math.round(sum(E, p.id));
      np.laborCost = Math.round((np.workerLabor || 0) + (np.mgrLabor || 0));
      const mon = new Array(13).fill(0);
      for (let i = 0; i < 13; i++) mon[i] = Math.round((W[p.id]?.[i] || 0) + (M[p.id]?.[i] || 0) + (E[p.id]?.[i] || 0));
      np.monthly = mon;
      updated.push(np);
    });
    if (updated.length) bulkUpsertProjects(updated);
    if (hasE && preview.ohTotal > 0) bulkUpsertOverheads([{ id: 'OH:' + currentYear + ':monthclose', year: currentYear, category: '본사운영·공통경비(월마감)', amount: Math.round(preview.ohTotal), monthly: OH.map(v => Math.round(v)), note: '월마감 변환' }]);
    const ledger = Object.entries(CARD).map(([name, card]) => ({ name, empId: (employees || []).find(e => e.name === name)?.id || null, card: Math.round(card), newOrder: 0, year: currentYear }));
    if (ledger.length) bulkSetEmpLedger(ledger);
    setPreview(null); setFiles({ cw: null, exp: null, sal: [], alloc: null });
  }

  const won = (n) => fmtMoney(n) + '원';
  const FileRow = ({ label, hint, req, val, onPick, multi }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `10px 0`, borderBottom: `1px solid ${T.divider}` }}>
      <div style={{ width: 150, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{label} {req && <span style={{ color: T.danger }}>*</span>}</div>
        <div style={{ fontSize: 11, color: T.textMute }}>{hint}</div>
      </div>
      <input type="file" accept=".xlsx" multiple={multi} onChange={e => onPick(multi ? Array.from(e.target.files) : e.target.files[0])} style={{ fontSize: 12, flex: 1 }} />
      <div style={{ fontSize: 12, color: val ? T.success : T.textLight, width: 90, textAlign: 'right' }}>{multi ? (val && val.length ? val.length + '개' : '미선택') : (val ? '선택됨' : '미선택')}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 940 }}>
      <div style={{ ...card(), padding: S[6], marginBottom: S[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Upload size={20} color={T.brand} /><h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>월마감 변환</h2>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: T.textMute, lineHeight: 1.7 }}>
          계약직·정규직급여·지출 파일을 올리면 사업명·담당자를 분석해 <strong>프로젝트별 작업자인건비·관리자인건비·사업경비·공통비</strong>를 계산하고 프로젝트 수익성에 바로 반영합니다. 매출·프로젝트명은 기존 값을 유지합니다.
        </p>
        <FileRow label="작업자 인건비" hint="계약직 통합본 또는 급여현황(프로젝트명)" req val={files.cw} onPick={f => setFiles(s => ({ ...s, cw: f }))} />
        <FileRow label="지출 경비" hint="지출정리(통합거래원장)" req val={files.exp} onPick={f => setFiles(s => ({ ...s, exp: f }))} />
        <FileRow label="직원 인건비" hint="정규직 급여(사원별급여조회, 복수)" val={files.sal} onPick={f => setFiles(s => ({ ...s, sal: f }))} multi />
        <FileRow label="관리자 배분표" hint="정규직→사업 배분율(선택)" val={files.alloc} onPick={f => setFiles(s => ({ ...s, alloc: f }))} />
        <div style={{ display: 'flex', gap: S[3], marginTop: S[4], alignItems: 'center' }}>
          <Button icon={BarChart3} onClick={analyze} disabled={busy}>{busy ? '분석 중…' : '분석'}</Button>
          {preview && <Button variant="primary" icon={CheckCircle2} onClick={apply}>프로젝트 수익성에 반영</Button>}
          {err && <span style={{ color: T.danger, fontSize: 12.5 }}>{err}</span>}
        </div>
        <div style={{ marginTop: S[3], fontSize: 11, color: T.textLight }}>정규직 관리자인건비는 「직원 인건비 + 관리자 배분표」를 함께 올릴 때 계산됩니다. 관리자 배분표가 없으면 작업자·사업경비·공통비만 반영됩니다.</div>
      </div>

      {preview && (
        <div style={{ ...card(), padding: S[5] }}>
          <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap', marginBottom: S[4] }}>
            <div><div style={{ fontSize: 11, color: T.textMute }}>매칭 사업</div><div style={{ fontSize: 20, fontWeight: 800, color: T.brand }}>{preview.rows.length}개</div></div>
            <div><div style={{ fontSize: 11, color: T.textMute }}>공통비(본사운영)</div><div style={{ fontSize: 20, fontWeight: 800 }}>{fmtMoney(preview.ohTotal)}</div></div>
            <div><div style={{ fontSize: 11, color: T.textMute }}>직원 카드</div><div style={{ fontSize: 20, fontWeight: 800 }}>{preview.cardCount}명</div></div>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 560 }}>
              <thead><tr style={{ background: T.surfaceAlt }}><Th>사업</Th><Th align="right">작업자인건비</Th><Th align="right">관리자인건비</Th><Th align="right">사업경비</Th></tr></thead>
              <tbody>
                {preview.rows.map(r => (
                  <tr key={r.id}><Td>{r.name}</Td><Td align="right" mono>{fmtMoney(r.w)}</Td><Td align="right" mono>{preview.hasM ? fmtMoney(r.m) : '-'}</Td><Td align="right" mono>{fmtMoney(r.e)}</Td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.unmatched.length > 0 && (
            <div style={{ marginTop: S[4], padding: S[3], background: 'rgba(217,119,6,0.06)', borderRadius: 8, fontSize: 12, color: T.text }}>
              <strong style={{ color: T.warning }}>미매칭(사업진행에 없어 제외):</strong> {preview.unmatched.map(([k, v]) => `${k.slice(0, 16)} ${fmtMoney(v)}`).join(' · ')}
              <div style={{ color: T.textMute, marginTop: 4 }}>새 사업이면 프로젝트를 먼저 등록하세요.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function ManagementReportView({ user, projects, proposals, overheads, employees, empLedger, setEmpLedger, currentYear, policy }) {
  const canEditLedger = !!setEmpLedger && user.role === 'admin';
  const [ledgerForm, setLedgerForm] = React.useState(null); // {name, empId, card, newOrder}
  const removeLedger = (row) => {
    if (!window.confirm(`[${row.name}] 항목을 직원별 원장에서 삭제할까요?\n(사업 참여 데이터는 유지되며, 신규수주·카드 기록만 제거됩니다)`)) return;
    setEmpLedger(prev => (prev || []).filter(l => !((row.empId && l.empId === row.empId) || l.name === row.name)));
  };
  const saveLedger = () => {
    if (!ledgerForm || !ledgerForm.name) { alert('이름을 입력/선택하세요'); return; }
    const emp = (employees || []).find(e => e.name === ledgerForm.name);
    const rec = { empId: emp ? emp.id : (ledgerForm.empId || null), name: ledgerForm.name, card: Number(ledgerForm.card) || 0, newOrder: Number(ledgerForm.newOrder) || 0, year: yr };
    setEmpLedger(prev => {
      const list = (prev || []).filter(l => !((rec.empId && l.empId === rec.empId) || l.name === rec.name));
      return [...list, rec];
    });
    setLedgerForm(null);
  };
  const yr = currentYear;
  const cfg = (policy && policy.diag) || {};
  const targets = (policy && policy.targets) || { revenue: 0, profit: 0 };
  const allocCfg = (policy && policy.allocation) || { basis: 'labor', mode: 'annual' };

  const yprojectsAll = (projects || []).filter(p => p.year == null || Number(p.year) === yr);
  const etcProjects = yprojectsAll.filter(isEtcProject);
  const yprojects = yprojectsAll.filter(p => !isEtcProject(p));
  const shortName = (n) => { n = String(n || '').replace(/^\(예시\)\s*/, ''); return n.length > 16 ? n.slice(0, 15) + '…' : n; };
  const pct = (a, b) => (b > 0 ? (a / b * 100) : 0);
  const won = (n) => fmtMoney(n) + '원';
  const f1 = (n) => (Math.round(n * 10) / 10);

  // ---- 프로젝트별 지표 + 진단 ----
  const bench = costBenchmark(yprojects);
  const rows = yprojects.map(p => {
    const m = projectMetrics(p);
    const diag = costDiagnosis(m, bench, cfg);
    return { p, m, diag, id: p.id, name: shortName(p.name), full: p.name, dept: p.dept || p.org || '미지정' };
  }).filter(r => r.m.revenue > 0 || r.m.cost > 0);

  // ---- 합계 ----
  const T0 = rows.reduce((a, r) => ({
    revenue: a.revenue + r.m.revenue, worker: a.worker + r.m.worker, mgr: a.mgr + r.m.mgr,
    labor: a.labor + r.m.labor, overhead: a.overhead + r.m.overhead, cost: a.cost + r.m.cost,
  }), { revenue: 0, worker: 0, mgr: 0, labor: 0, overhead: 0, cost: 0 });
  const pool = overheadPoolTotal(overheads, yr);
  const contrib = T0.revenue - T0.cost;
  const full = contrib - pool;
  const marginContrib = pct(contrib, T0.revenue);
  const marginFull = pct(full, T0.revenue);
  const companyScore = rateToScore(marginFull); // 전사 성과 점수 (비매출 지원트랙 평가 baseline)
  const laborRev = pct(T0.labor, T0.revenue);
  const costRev = pct(T0.cost, T0.revenue);
  const poolRev = pct(pool, T0.revenue);
  const totCostAll = T0.cost + pool;

  const allocMap = allocCfg.mode === 'monthly'
    ? allocateOverheadMonthly(yprojects, (overheads || []).filter(o => Number(o.year) === yr), yr)
    : allocateOverhead(yprojects, pool, allocCfg.basis);

  // ---- 월별 추이 ----
  const monthLabels = ['2025.12', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dirM = new Array(13).fill(0);
  yprojects.forEach(p => { if (Array.isArray(p.monthly)) p.monthly.forEach((v, i) => dirM[i] += (Number(v) || 0)); });
  const ohM = new Array(13).fill(0);
  (overheads || []).filter(o => Number(o.year) === yr).forEach(o => { if (Array.isArray(o.monthly) && o.monthly.some(v => v > 0)) o.monthly.forEach((v, i) => ohM[i] += (Number(v) || 0)); });
  const lastM = (() => { let last = 0; for (let i = 1; i <= 12; i++) if (dirM[i] > 0 || ohM[i] > 0) last = i; return last; })();
  const trendData = [];
  for (let i = 1; i <= (lastM || 12); i++) trendData.push({ month: monthLabels[i], 직접원가: Math.round(dirM[i]), 공통비: Math.round(ohM[i]) });
  const refLabel = lastM ? `1~${lastM}월` : '연간';
  const activeMonths = lastM || 12;

  // ---- 수주 파이프라인 / 목표 ----
  const pipe = (proposals || []).filter(p => p.year == null || Number(p.year) === yr);
  const pipeAmt = pipe.reduce((s, p) => s + (Number(p.expectedRevenue || p.amount || p.revenue) || 0), 0);
  const revAch = targets.revenue > 0 ? pct(T0.revenue, targets.revenue) : null;
  const profAch = targets.profit > 0 ? pct(full, targets.profit) : null;

  // ---- 조직·본부별 손익 롤업 ----
  const orgMap = {};
  rows.forEach(r => {
    const k = r.dept;
    if (!orgMap[k]) orgMap[k] = { name: k, revenue: 0, labor: 0, worker: 0, mgr: 0, overhead: 0, cost: 0, alloc: 0, cnt: 0 };
    const o = orgMap[k];
    o.revenue += r.m.revenue; o.labor += r.m.labor; o.worker += r.m.worker; o.mgr += r.m.mgr;
    o.overhead += r.m.overhead; o.cost += r.m.cost; o.alloc += (allocMap[r.id] || 0); o.cnt++;
  });
  const empActive = (employees || []).filter(e => (e.status ? e.status === 'active' : true));
  const headOf = (orgName) => {
    if (!orgName || orgName === '미지정') return 0;
    return empActive.filter(e => { const d = String(e.dept || ''); return d && (d.includes(orgName) || orgName.includes(d.split('/')[0])); }).length;
  };
  const orgRows = Object.values(orgMap).map(o => {
    const contribO = o.revenue - o.cost; const fullO = contribO - o.alloc;
    const head = headOf(o.name);
    return { ...o, contrib: contribO, full: fullO, margin: pct(contribO, o.revenue), fullMargin: pct(fullO, o.revenue), head, perRev: head > 0 ? o.revenue / head : null };
  }).sort((a, b) => b.revenue - a.revenue);
  const orgBar = orgRows.map(o => ({ name: shortName(o.name), 매출: Math.round(o.revenue), 공헌이익: Math.round(o.contrib), 완전이익: Math.round(o.full) }));

  // ---- 인당 생산성 ----
  const N = empActive.length;
  const perRev = N > 0 ? T0.revenue / N : 0;
  const perContrib = N > 0 ? contrib / N : 0;
  const perFull = N > 0 ? full / N : 0;
  const perLabor = N > 0 ? T0.labor / N : 0;
  const valueAddPerLabor = T0.labor > 0 ? contrib / T0.labor : 0;     // 인건비 1원당 공헌이익
  const laborShare = contrib + T0.labor > 0 ? pct(T0.labor, contrib + T0.labor) : 0; // 노동소득분배율(근사)
  const monthlyPerRev = activeMonths > 0 && N > 0 ? T0.revenue / N / activeMonths : 0;

  // ---- 직원별 순기여 (프로젝트 참여·기여도 기준) ----
  const empName = (id) => (employees || []).find(e => e.id === id)?.name || id;
  const empDept = (id) => (employees || []).find(e => e.id === id)?.dept || '';
  const empStatus = (id) => (employees || []).find(e => e.id === id)?.status || '';
  const STATUS_LABEL = { active: '', freelancer: '프리랜서', advisor: '자문', contract: '계약직', inactive: '비활성' };
  const perfLinked = (st) => st === 'freelancer' || st === 'advisor';
  const eMap = {};
  rows.forEach(r => {
    const m = r.m;
    (r.p.members || []).forEach(mem => {
      const c = (Number(mem.contribution) || 0) / 100;
      if (!eMap[mem.empId]) eMap[mem.empId] = { empId: mem.empId, cnt: 0, labor: 0, rev: 0, profit: 0, pm: false };
      const e = eMap[mem.empId]; e.cnt++; e.labor += m.labor * c; e.rev += m.revenue * c; e.profit += m.profit * c;
      if (mem.role === 'PM') e.pm = true;
    });
  });
  const ledger = (empLedger || []).filter(l => l.year == null || Number(l.year) === yr);
  const ledgerById = {}; const ledgerByName = {};
  ledger.forEach(l => { if (l.empId) ledgerById[l.empId] = l; if (l.name) ledgerByName[String(l.name).trim()] = l; });
  const findLedger = (id, name) => ledgerById[id] || ledgerByName[String(name || '').trim()] || null;
  const empRows = Object.values(eMap).map(e => {
    const nm = empName(e.empId); const lg = findLedger(e.empId, nm);
    const card = lg ? (lg.card || 0) : 0; const newOrder = lg ? (lg.newOrder || 0) : 0;
    const emp0 = (employees || []).find(x => x.id === e.empId);
    let score, bidS = null, hasBid = false, jikjik = false, evBonus = 0, track = 'project', mbo = null;
    if (isSupportTrack(nm)) {
      const sp = calcSupportScore(nm, companyScore);
      score = sp.score; track = 'support'; mbo = sp.mbo;
    } else if (isSalesTrack(nm)) {
      const bid = calcBidScore(nm, proposals, yprojects, yr);
      score = bid ? bid.score : EVAL_CFG.salesFloor; track = 'sales'; hasBid = !!bid; bidS = bid ? bid.score : null;
    } else {
      const ev = calcEvalScore(e.empId, nm, yprojects, proposals, yr, emp0) || {};
      score = ev.score ?? null; bidS = ev.bid ?? null; hasBid = !!ev.hasBid; jikjik = !!ev.jikjik; evBonus = ev.bonus || 0;
    }
    return { ...e, name: nm, dept: empDept(e.empId), status: empStatus(e.empId), cover: e.labor > 0 ? e.rev / e.labor : null, net: e.profit, card, newOrder, total: e.profit - card, score, bidScore: bidS, hasBid, jikjik, evBonus, track, mbo };
  });
  // 사업 참여는 없지만 카드/수주 원장에만 있는 인원도 포함
  const seen = new Set(empRows.map(e => (e.empId || '') + '|' + e.name));
  ledger.forEach(l => {
    const key = (l.empId || '') + '|' + (l.name || '');
    const byName = empRows.find(e => e.name === l.name);
    if (l.empId && seen.has(key)) return;
    if (byName) return;
    empRows.push({ empId: l.empId, name: l.name, dept: '', status: empStatus(l.empId), cnt: 0, labor: 0, rev: 0, profit: 0, pm: false, cover: null, net: 0, card: l.card || 0, newOrder: l.newOrder || 0, total: -(l.card || 0), score: null });
  });
  // 수주(제안) 기여만 있는 인력도 포함 (수주 확정 제안의 PM·참여인력)
  const wonProps = (proposals || []).filter(p => p.status === '수주' && p.wonProjectId);
  const bidPeople = new Set();
  wonProps.forEach(p => { if (p.pm) bidPeople.add(p.pm); (p.participants || []).forEach(n => bidPeople.add(n)); });
  bidPeople.forEach(nm => {
    if (empRows.some(e => e.name === nm)) return;
    const emp = (employees || []).find(e => String(e.name).trim() === nm);
    const ev = calcEvalScore(emp ? emp.id : null, nm, yprojects, proposals, yr, emp) || {};
    if (ev.score == null) return;
    empRows.push({ empId: emp ? emp.id : null, name: nm, dept: emp ? emp.dept : '', status: emp ? emp.status : '', cnt: 0, labor: 0, rev: 0, profit: 0, pm: false, cover: null, net: 0, card: 0, newOrder: 0, total: 0, score: ev.score, bidScore: ev.bid ?? null, hasBid: true, jikjik: !!ev.jikjik, evBonus: ev.bonus || 0 });
  });
  empRows.sort((a, b) => a.total - b.total);
  const negEmp = empRows.filter(e => e.total < 0).length;
  const perfRows = empRows.filter(e => perfLinked(e.status));
  const supportNames = Object.keys(SUPPORT_TRACK);
  const supportRows = (employees || []).filter(e => supportNames.includes(String(e.name).trim())).map(e => {
    const sp = calcSupportScore(String(e.name).trim(), companyScore);
    return { name: e.name, dept: e.dept, position: e.position, score: sp.score, mbo: sp.mbo, company: sp.company };
  });
  // 정규직 가동률: 사업 투입 인건비(순기여표 labor) vs 월 급여 — 공통비로 새는 인원 식별
  const laborById = {}; empRows.forEach(e => { if (e.empId) laborById[e.empId] = { labor: e.labor || 0, cnt: e.cnt || 0 }; });
  const monthsElapsed = (() => { const m = new Date().getMonth() + 1; return Math.max(1, Math.min(12, m - 1)); })();
  const utilRows = (employees || []).filter(e => e.status === 'active' && String(e.dept || '').indexOf('계약') < 0 && e.evalTarget !== false)
    .map(e => {
      const pay = (Number(e.baseSalary) || 0) + (Number(e.allowance) || 0) + (Number(e.mealCar) || 0) + (Number(e.qualif) || 0);
      const cap = pay * monthsElapsed;                 // 기간 급여 총액(가동 100% 기준)
      const lab = (laborById[e.id] || {}).labor || 0;  // 사업 투입 인건비
      const cnt = (laborById[e.id] || {}).cnt || 0;
      const util = cap > 0 ? Math.min(150, lab / cap * 100) : null;
      return { id: e.id, name: e.name, dept: e.dept, position: e.position, pay, cap, lab, cnt, util };
    }).sort((a, b) => (a.util ?? 999) - (b.util ?? 999));
  const lowUtil = utilRows.filter(r => r.util != null && r.util < 60).length;
  const hasLedger = ledger.length > 0;

  // ---- 원가 구성 ----
  const costMix = [
    { name: '작업자 인건비', value: Math.round(T0.worker), color: T.brand },
    { name: '관리자 인건비', value: Math.round(T0.mgr), color: T.brandLight },
    { name: '사업경비(제경비)', value: Math.round(T0.overhead), color: T.warning },
    { name: '공통비(간접비)', value: Math.round(pool), color: T.textMute },
  ].filter(x => x.value > 0);

  // ---- 매출 상위 ----
  const byRev = [...rows].sort((a, b) => b.m.revenue - a.m.revenue);
  const revBar = byRev.slice(0, 8).map(r => ({ name: r.name, 매출: Math.round(r.m.revenue), 원가: Math.round(r.m.cost) }));
  const topShare = T0.revenue > 0 && byRev.length ? pct(byRev[0].m.revenue, T0.revenue) : 0;
  const profitable = rows.filter(r => r.m.profit > 0).length;
  const lossmaking = rows.filter(r => r.m.revenue > 0 && r.m.profit < 0).length;

  // ---- 위험요소 ----
  const risks = [];
  rows.forEach(r => {
    const m = r.m;
    if (m.revenue > 0 && m.profit < 0) risks.push({ level: '심각', title: `${r.name} 적자`, detail: `공헌이익 ${won(m.profit)} · 수익률 ${m.rate != null ? m.rate.toFixed(0) : '-'}%`, action: '원가 재점검·정산 협의 또는 계약금액 확인' });
    else if (m.rate != null && m.rate >= 0 && m.rate < 10) risks.push({ level: '주의', title: `${r.name} 저수익`, detail: `수익률 ${m.rate.toFixed(0)}% · 공헌이익 ${won(m.profit)}`, action: '투입 인력·경비 효율화 검토' });
    if (m.planCost > 0 && m.planExecPct != null && m.planExecPct > 100) risks.push({ level: '주의', title: `${r.name} 예산 초과집행`, detail: `계획 대비 ${m.planExecPct.toFixed(0)}%`, action: '잔여 예산·추가원가 통제' });
    (r.diag.flags || []).forEach(fl => { if (fl.level === 'alert') risks.push({ level: '심각', title: `${r.name} ${fl.label}`, detail: fl.detail, action: fl.type === 'labor' ? '투입 인력 재배치' : fl.type === 'overhead' ? '경비 집행 점검' : '원가구조 전면 재검토' }); });
  });
  orgRows.forEach(o => { if (o.revenue > 0 && o.full < 0) risks.push({ level: '주의', title: `${shortName(o.name)} 본부 손실`, detail: `완전영업이익 ${won(o.full)} (이익률 ${o.fullMargin.toFixed(0)}%)`, action: '해당 본부 사업 포트폴리오·원가 점검' }); });
  if (poolRev > 15) risks.push({ level: '주의', title: '공통비(간접비) 부담 과다', detail: `매출 대비 ${poolRev.toFixed(0)}%`, action: '본사운영비 절감·배부기준 재검토' });
  if (topShare > 40) risks.push({ level: '주의', title: '특정 사업 매출 편중', detail: `최대 사업이 총매출의 ${topShare.toFixed(0)}%`, action: '수주 다변화로 리스크 분산' });
  if (revAch != null && activeMonths > 0 && revAch < (activeMonths / 12 * 100) - 10) risks.push({ level: '주의', title: '연간 매출목표 진도 미달', detail: `달성 ${revAch.toFixed(0)}% · 기준 ${(activeMonths / 12 * 100).toFixed(0)}%`, action: '파이프라인 조기 수주 전환' });
  if (valueAddPerLabor < 1.2 && T0.labor > 0) risks.push({ level: '주의', title: '노동생산성 저하', detail: `인건비 1원당 공헌이익 ${valueAddPerLabor.toFixed(2)}원`, action: '가동률 제고·고부가 사업 확대' });
  if (full < 0) risks.push({ level: '심각', title: '전사 완전영업이익 적자', detail: `${won(full)} (공헌이익 ${won(contrib)} − 공통비 ${won(pool)})`, action: '공통비 절감 및 고수익 사업 확대 시급' });
  const sev = risks.filter(r => r.level === '심각');
  const wrn = risks.filter(r => r.level === '주의');

  // ---- 종합 진단 ----
  const health = full >= 0 && marginContrib >= 15 && sev.length === 0 ? '양호' : full >= 0 && sev.length <= 1 ? '보통' : '주의';
  const healthColor = health === '양호' ? T.success : health === '보통' ? T.warning : T.danger;
  const bestOrg = orgRows.filter(o => o.revenue > 0).sort((a, b) => b.fullMargin - a.fullMargin)[0];
  const worstOrg = orgRows.filter(o => o.revenue > 0).sort((a, b) => a.fullMargin - b.fullMargin)[0];
  const assess = [];
  assess.push(`${yr}년 ${refLabel} 누적 기준, 총 ${rows.length}개 사업(수익 ${profitable}건·손실 ${lossmaking}건)에서 계약·수주 매출 ${won(T0.revenue)}, 직접원가 ${won(T0.cost)}로 공헌이익 ${won(contrib)}(공헌이익률 ${marginContrib.toFixed(1)}%)를 시현했습니다. 공통비 ${won(pool)} 배부 후 완전영업이익은 ${won(full)}(${marginFull.toFixed(1)}%)입니다.`);
  assess.push(`원가 구조는 인건비가 매출의 ${laborRev.toFixed(0)}%(총원가의 ${pct(T0.labor, totCostAll).toFixed(0)}%), 사업경비가 총원가의 ${pct(T0.overhead, totCostAll).toFixed(0)}%, 공통비가 ${pct(pool, totCostAll).toFixed(0)}%를 차지합니다. ${laborRev >= 70 ? '인건비 비중이 높아 가동률·투입관리가 수익성의 핵심 변수입니다.' : '인건비 비중은 관리 가능한 수준입니다.'}`);
  if (N > 0) assess.push(`인력 ${N}명 기준 1인당 매출은 ${won(perRev)}(월 ${won(monthlyPerRev)}), 1인당 공헌이익 ${won(perContrib)}이며, 인건비 1원당 ${valueAddPerLabor.toFixed(2)}원의 공헌이익을 창출했습니다(노동소득분배율 ${laborShare.toFixed(0)}%).`);
  if (bestOrg && worstOrg && bestOrg.name !== worstOrg.name) assess.push(`본부별로는 ${shortName(bestOrg.name)}(이익률 ${bestOrg.fullMargin.toFixed(0)}%)이 가장 우수하고, ${shortName(worstOrg.name)}(${worstOrg.fullMargin.toFixed(0)}%)이 상대적으로 부진해 포트폴리오 조정이 필요합니다.`);
  if (sev.length) assess.push(`심각 위험 ${sev.length}건: ${sev.slice(0, 3).map(r => r.title).join(', ')}${sev.length > 3 ? ' 등' : ''}. 즉시 대응이 필요합니다.`);
  else assess.push(`심각 위험은 없으며 주의 항목 ${wrn.length}건을 모니터링합니다.`);
  if (pipeAmt > 0) assess.push(`수주 파이프라인은 ${pipe.length}건·예상매출 ${won(pipeAmt)}로 현 매출 대비 ${pct(pipeAmt, T0.revenue).toFixed(0)}% 규모입니다.`);
  const recs = [];
  if (full < 0 || marginFull < 5) recs.push('저수익·적자 사업의 정산·계약금액을 재확인하고 고수익 사업 비중을 확대해 완전영업이익률을 개선합니다.');
  if (laborRev >= 70 || valueAddPerLabor < 1.3) recs.push('사업별 인력 가동률을 관리하고 유휴 인력을 수주 사업으로 재배치해 노동생산성을 높입니다.');
  if (poolRev > 12) recs.push('본사운영·공통경비를 항목별로 점검해 간접비 부담을 낮춥니다.');
  if (worstOrg && worstOrg.fullMargin < 5) recs.push(`${shortName(worstOrg.name)} 본부의 사업 포트폴리오와 원가구조를 재점검합니다.`);
  if (topShare > 40) recs.push('특정 사업 의존도를 낮추도록 파이프라인을 다변화합니다.');
  if (revAch != null && revAch < 90) recs.push('연간 매출목표 달성을 위해 파이프라인의 수주 전환을 가속합니다.');
  if (recs.length === 0) recs.push('현 수익구조를 유지하며 신규 수주와 원가 통제를 병행해 이익률을 안정화합니다.');

  const KPI = ({ icon: Icon, label, value, unit, sub, color }) => (
    <div style={{ ...card(), padding: S[5], display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.textMute, fontSize: 12, fontWeight: 600 }}>{Icon && <Icon size={15} color={color || T.brand} />}{label}</div>
      <div style={{ fontSize: 23, fontWeight: 800, color: color || T.ink, lineHeight: 1.1 }}>{value}<span style={{ fontSize: 13, fontWeight: 600, color: T.textMute, marginLeft: 3 }}>{unit}</span></div>
      {sub && <div style={{ fontSize: 12, color: T.textMute }}>{sub}</div>}
    </div>
  );
  const H = ({ n, icon: Icon, children, sub }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: `${S[7]}px 0 ${S[4]}px` }}>
      <span style={{ width: 26, height: 26, borderRadius: 7, background: T.brand, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0, alignSelf: 'center' }}>{n}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>{Icon && <Icon size={17} color={T.brand} />}<h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.ink }}>{children}</h3></div>
      {sub && <span style={{ fontSize: 12, color: T.textMute }}>{sub}</span>}
    </div>
  );
  const Note = ({ children }) => (
    <div style={{ marginTop: S[3], padding: `10px 14px`, background: T.surfaceAlt, borderRadius: 8, fontSize: 12.5, color: T.text, lineHeight: 1.7, borderLeft: `3px solid ${T.brandLight}` }}>
      <strong style={{ color: T.brand }}>분석 ▹ </strong>{children}
    </div>
  );

  return (
    <div style={{ maxWidth: 1120 }}>
      {/* 표지 */}
      <div style={{ ...card(), padding: S[6], marginBottom: S[5], background: `linear-gradient(135deg, ${T.brandDark}, ${T.brand})`, color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: S[3] }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.8, fontWeight: 600 }}>KOITION · MANAGEMENT REPORT</div>
            <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 4px' }}>{yr}년 경영진단 보고서</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>기준: {yr}년 {refLabel} 누적 · 작성 {new Date().toLocaleDateString('ko-KR')} · 경영기획 {user?.name || ''}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 16px' }}>
              <div style={{ fontSize: 11, opacity: 0.8 }}>경영상태 종합</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: health === '양호' ? '#7DE0A6' : health === '보통' ? '#FCD34D' : '#FCA5A5' }}>{health}</div>
            </div>
            <Button variant="secondary" icon={Printer} onClick={() => window.print()} style={{ background: '#fff' }}>인쇄 / PDF</Button>
          </div>
        </div>
      </div>

      {/* 1. 경영 요약 */}
      <H n="1" icon={Activity}>경영 요약 (Executive Summary)</H>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: S[3], marginBottom: S[3] }}>
        <KPI icon={TrendingUp} label="계약·수주 매출" value={fmtMoney(T0.revenue)} unit="원" color={T.brand} sub={targets.revenue > 0 ? `연간목표 대비 ${revAch.toFixed(0)}%` : `${rows.length}개 사업`} />
        <KPI icon={Layers} label="직접원가" value={fmtMoney(T0.cost)} unit="원" color={T.text} sub={`원가율 ${costRev.toFixed(0)}%`} />
        <KPI icon={Wallet} label="공헌이익" value={fmtMoney(contrib)} unit="원" color={contrib >= 0 ? T.success : T.danger} sub={`공헌이익률 ${marginContrib.toFixed(1)}%`} />
        <KPI icon={Award} label="완전영업이익" value={fmtMoney(full)} unit="원" color={full >= 0 ? T.success : T.danger} sub={`영업이익률 ${marginFull.toFixed(1)}% · 공통비 차감 후`} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: S[3] }}>
        <KPI icon={Users} label="인건비 계" value={fmtMoney(T0.labor)} unit="원" sub={`작업자 ${fmtMoney(T0.worker)} · 관리자 ${fmtMoney(T0.mgr)}`} />
        <KPI icon={Percent} label="인건비율" value={laborRev.toFixed(0)} unit="%" sub="매출 대비 인건비" color={laborRev >= 70 ? T.warning : T.text} />
        <KPI icon={Building2} label="공통비(간접비)" value={fmtMoney(pool)} unit="원" sub={`매출 대비 ${poolRev.toFixed(0)}%`} color={T.warning} />
        <KPI icon={ShieldAlert} label="위험요소" value={`${sev.length}·${wrn.length}`} unit="건" sub="심각 · 주의" color={sev.length ? T.danger : wrn.length ? T.warning : T.success} />
      </div>
      <Note>{`${refLabel} 누적 공헌이익률 ${marginContrib.toFixed(1)}%, 완전영업이익률 ${marginFull.toFixed(1)}%. 수익 사업 ${profitable}건·손실 사업 ${lossmaking}건이며, ${laborRev >= 70 ? '인건비 비중이 높아 가동률 관리가 이익의 관건' : '원가 구조는 안정적'}입니다.${revAch != null ? ` 연간 매출목표 달성률은 ${revAch.toFixed(0)}%(진도기준 ${(activeMonths / 12 * 100).toFixed(0)}%)입니다.` : ''}`}</Note>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: S[3], marginTop: S[3] }}>
        {(() => {
          const done = (yprojects || []).filter(p => p.status === 'completed').map(projectMetrics);
          const wip = (yprojects || []).filter(p => p.status !== 'completed').map(projectMetrics);
          const dRev = done.reduce((a, m) => a + m.revenue, 0), dPro = done.reduce((a, m) => a + m.profit, 0);
          const wRec = wip.reduce((a, m) => a + (m.recognizedRevenue || 0), 0), wPoc = wip.reduce((a, m) => a + (m.pocProfit || 0), 0);
          const dRate = dRev > 0 ? dPro / dRev * 100 : null, wRate = wRec > 0 ? wPoc / wRec * 100 : null;
          return (<>
            <KPI icon={CheckCircle2} label={`완료(정산확정) ${done.length}건`} value={dRate != null ? dRate.toFixed(1) : '—'} unit="%" color={T.success} sub={done.length ? `확정 매출 ${fmtMoney(dRev)} · 공헌이익 ${fmtMoney(dPro)}` : '정산 완료 사업 없음'} />
            <KPI icon={Activity} label={`진행중(예상) ${wip.length}건`} value={wRate != null ? wRate.toFixed(1) : '—'} unit="%" color={T.warning} sub={`진행기준 추정 · 인식매출 ${fmtMoney(wRec)}`} />
          </>);
        })()}
      </div>
      <Note>{`수익률은 두 가지로 봅니다. 완료(정산확정) 사업은 매출·원가가 확정된 실적 수익률이고, 진행중 사업은 진행률만큼만 매출을 인식한 예상 수익률입니다. 진행중 사업의 수치는 확정이 아니며 사업 종료 시 변동될 수 있습니다.`}</Note>

      {/* 2. 매출·수주 분석 */}
      <H n="2" icon={TrendingUp}>매출·수주 분석</H>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: S[4] }}>
        <div style={{ ...card(), padding: S[5] }}>
          <SectionTitle>프로젝트별 매출·원가 (상위 8)</SectionTitle>
          <div style={{ height: 260, marginTop: S[3] }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revBar} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.textMute }} angle={-30} textAnchor="end" height={60} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: T.textMute }} tickFormatter={v => fmtMoney(v)} />
                <Tooltip formatter={(v) => won(v)} contentStyle={{ fontSize: 12, fontFamily: FONT }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="매출" fill={T.brand} radius={[3, 3, 0, 0]} />
                <Bar dataKey="원가" fill={T.warning} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div style={{ ...card(), padding: S[5] }}>
            <SectionTitle>수주 파이프라인</SectionTitle>
            <div style={{ marginTop: S[3], display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: T.textMute }}>제안·진행 건수</span><strong>{pipe.length}건</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: T.textMute }}>예상 매출</span><strong style={{ color: T.brand }}>{won(pipeAmt)}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: T.textMute }}>현 매출 대비</span><strong>{pct(pipeAmt, T0.revenue).toFixed(0)}%</strong></div>
            </div>
          </div>
          <div style={{ ...card(), padding: S[5] }}>
            <SectionTitle>매출 편중도</SectionTitle>
            <div style={{ marginTop: S[3], fontSize: 13, color: T.textMute }}>최대 사업 비중</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: topShare > 40 ? T.warning : T.ink }}>{topShare.toFixed(0)}%</div>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>{byRev[0] ? byRev[0].name : '-'}</div>
          </div>
        </div>
      </div>
      <Note>{`상위 3개 사업이 매출의 ${pct(byRev.slice(0, 3).reduce((s, r) => s + r.m.revenue, 0), T0.revenue).toFixed(0)}%를 차지합니다. ${topShare > 40 ? '특정 사업 편중이 높아 수주 다변화가 필요합니다.' : '매출이 비교적 분산되어 있습니다.'} 파이프라인(${won(pipeAmt)})은 현 매출의 ${pct(pipeAmt, T0.revenue).toFixed(0)}% 수준으로, ${pipeAmt >= T0.revenue * 0.5 ? '차기 수주 여력이 양호' : '추가 수주 발굴이 필요'}합니다.`}</Note>

      {/* 3. 조직·본부별 손익 */}
      <H n="3" icon={Building2}>조직·본부별 손익</H>
      <div style={{ ...card(), padding: 0, overflow: 'auto', marginBottom: S[3] }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 820 }}>
          <thead><tr style={{ background: T.surfaceAlt }}>
            <Th>본부·조직</Th><Th align="center">사업</Th><Th align="center">인원</Th><Th align="right">매출</Th><Th align="right">인건비</Th><Th align="right">사업경비</Th><Th align="right">공헌이익</Th><Th align="right">배부공통비</Th><Th align="right">완전이익</Th><Th align="right">이익률</Th>
          </tr></thead>
          <tbody>
            {orgRows.map((o, i) => (
              <tr key={i}>
                <Td>{o.name}</Td>
                <Td align="center">{o.cnt}</Td>
                <Td align="center">{o.head > 0 ? o.head + '명' : '-'}</Td>
                <Td align="right" mono>{fmtMoney(o.revenue)}</Td>
                <Td align="right" mono>{fmtMoney(o.labor)}</Td>
                <Td align="right" mono>{fmtMoney(o.overhead)}</Td>
                <Td align="right" mono style={{ color: o.contrib >= 0 ? T.ink : T.danger }}>{fmtMoney(o.contrib)}</Td>
                <Td align="right" mono style={{ color: T.warning }}>{o.alloc ? '-' + fmtMoney(o.alloc) : '0'}</Td>
                <Td align="right" mono><strong style={{ color: o.full >= 0 ? T.success : T.danger }}>{fmtMoney(o.full)}</strong></Td>
                <Td align="right" mono style={{ color: o.fullMargin >= 10 ? T.success : o.fullMargin >= 0 ? T.warning : T.danger }}>{o.fullMargin.toFixed(0)}%</Td>
              </tr>
            ))}
            <tr style={{ background: T.surfaceAlt }}>
              <Td><strong>합계</strong></Td><Td align="center"><strong>{rows.length}</strong></Td><Td align="center"><strong>{N}명</strong></Td>
              <Td align="right" mono><strong>{fmtMoney(T0.revenue)}</strong></Td><Td align="right" mono><strong>{fmtMoney(T0.labor)}</strong></Td>
              <Td align="right" mono><strong>{fmtMoney(T0.overhead)}</strong></Td><Td align="right" mono><strong>{fmtMoney(contrib)}</strong></Td>
              <Td align="right" mono><strong>-{fmtMoney(pool)}</strong></Td><Td align="right" mono><strong style={{ color: full >= 0 ? T.success : T.danger }}>{fmtMoney(full)}</strong></Td>
              <Td align="right" mono><strong>{marginFull.toFixed(0)}%</strong></Td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ ...card(), padding: S[5] }}>
        <SectionTitle>본부별 손익 비교</SectionTitle>
        <div style={{ height: 260, marginTop: S[3] }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orgBar} margin={{ top: 8, right: 8, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textMute }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: T.textMute }} tickFormatter={v => fmtMoney(v)} />
              <Tooltip formatter={(v) => won(v)} contentStyle={{ fontSize: 12, fontFamily: FONT }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="매출" fill={T.brandLight} radius={[3, 3, 0, 0]} />
              <Bar dataKey="공헌이익" fill={T.brand} radius={[3, 3, 0, 0]} />
              <Bar dataKey="완전이익" fill={T.success} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Note>{bestOrg && worstOrg ? `${shortName(bestOrg.name)}이(가) 이익률 ${bestOrg.fullMargin.toFixed(0)}%로 가장 우수하고, ${shortName(worstOrg.name)}이(가) ${worstOrg.fullMargin.toFixed(0)}%로 가장 낮습니다. 본부 간 수익성 격차를 고려해 인력·사업 배분을 조정하면 전사 이익률을 끌어올릴 수 있습니다.` : '수행조직 정보가 있는 사업이 제한적입니다. 사업진행현황의 수행조직을 채우면 본부별 손익이 정확히 집계됩니다.'} 인원은 임직원의 소속 본부명 매칭 기준이며, 미매칭 시 ‘-’로 표시됩니다.</Note>

      {/* 4. 인건비 분석 */}
      <H n="4" icon={Users}>인건비 분석</H>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: S[4] }}>
        <div style={{ ...card(), padding: S[5] }}>
          <SectionTitle>인건비 구성</SectionTitle>
          <div style={{ marginTop: S[3], display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['작업자 인건비(계약직)', T0.worker, T.brand], ['관리자 인건비(정규직)', T0.mgr, T.brandLight]].map(([lb, v, c]) => (
              <div key={lb}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: T.textMute }}>{lb}</span><strong>{won(v)}</strong></div>
                <div style={{ height: 8, background: T.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${pct(v, T0.labor)}%`, height: '100%', background: c }} /></div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.divider}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: T.textMute }}>인건비 계 / 매출 대비</span><strong>{won(T0.labor)} · {laborRev.toFixed(0)}%</strong></div>
          </div>
        </div>
        <div style={{ ...card(), padding: S[5] }}>
          <SectionTitle>월별 집행원가 추이 <span style={{ fontWeight: 400, color: T.textMute }}>(직접원가 + 공통비)</span></SectionTitle>
          <div style={{ height: 240, marginTop: S[3] }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.textMute }} />
                <YAxis tick={{ fontSize: 10, fill: T.textMute }} tickFormatter={v => fmtMoney(v)} />
                <Tooltip formatter={(v) => won(v)} contentStyle={{ fontSize: 12, fontFamily: FONT }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="직접원가" fill={T.brand} radius={[3, 3, 0, 0]} />
                <Line dataKey="공통비" stroke={T.warning} strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Note>{`인건비 계 ${won(T0.labor)} 중 작업자(계약직) ${pct(T0.worker, T0.labor).toFixed(0)}%·관리자(정규직) ${pct(T0.mgr, T0.labor).toFixed(0)}% 구성입니다. 매출 대비 인건비율 ${laborRev.toFixed(0)}%로 ${laborRev >= 85 ? '경보 수준이며 즉시 투입 효율화가 필요' : laborRev >= 70 ? '다소 높아 가동률 관리가 중요' : '적정 범위'}합니다.`}</Note>

      {/* 5. 인당 생산성 */}
      <H n="5" icon={Activity}>인당 생산성 (Per-capita)</H>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: S[3] }}>
        <KPI icon={TrendingUp} label="1인당 매출" value={fmtMoney(perRev)} unit="원" color={T.brand} sub={`월 환산 ${fmtMoney(monthlyPerRev)}`} />
        <KPI icon={Wallet} label="1인당 공헌이익" value={fmtMoney(perContrib)} unit="원" color={perContrib >= 0 ? T.success : T.danger} sub={`1인당 완전이익 ${fmtMoney(perFull)}`} />
        <KPI icon={Users} label="1인당 인건비" value={fmtMoney(perLabor)} unit="원" sub={`인력 ${N}명 기준(정규직)`} />
        <KPI icon={Percent} label="노동생산성" value={valueAddPerLabor.toFixed(2)} unit="배" color={valueAddPerLabor >= 1.5 ? T.success : valueAddPerLabor >= 1.2 ? T.warning : T.danger} sub={`인건비 1원당 공헌이익 · 분배율 ${laborShare.toFixed(0)}%`} />
      </div>
      <Note>{`인력 ${N}명 기준 1인당 매출 ${won(perRev)}, 1인당 공헌이익 ${won(perContrib)}입니다. 인건비 1원당 ${valueAddPerLabor.toFixed(2)}원의 공헌이익을 창출했으며(1.0 미만이면 인건비가 창출가치를 초과), ${valueAddPerLabor >= 1.5 ? '생산성이 양호' : valueAddPerLabor >= 1.2 ? '보통 수준이나 개선 여지' : '생산성이 낮아 가동률 제고가 시급'}합니다. 노동소득분배율 ${laborShare.toFixed(0)}%. (인원은 정규직 기준이며 계약직 인건비는 원가에 포함)`}</Note>

      {/* 6. 직원별 순기여 */}
      <H n="6" icon={UserCheck}>직원별 순기여 (사업 참여 기준)</H>
      {canEditLedger && (
        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: S[2] }}>
          <Button size="sm" variant="outline" icon={Plus} onClick={() => setLedgerForm({ name: '', empId: null, card: 0, newOrder: 0 })}>원장 항목 추가/입력</Button>
        </div>
      )}
      {ledgerForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setLedgerForm(null)}>
          <div style={{ ...card(), padding: S[5], width: 400, maxWidth: '100%' }} onClick={ev => ev.stopPropagation()}>
            <SectionTitle>직원별 원장 입력/수정</SectionTitle>
            <div style={{ display: 'grid', gap: S[3], marginTop: S[3] }}>
              <input list="ledger-emp" placeholder="직원 이름 (목록 선택 또는 입력)" value={ledgerForm.name} onChange={ev => setLedgerForm(f => ({ ...f, name: ev.target.value }))} style={{ padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5 }} />
              <datalist id="ledger-emp">{(employees || []).map(e => <option key={e.id} value={e.name} />)}</datalist>
              <div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 2 }}>신규수주(원)</div>
                <input type="number" value={ledgerForm.newOrder} onChange={ev => setLedgerForm(f => ({ ...f, newOrder: ev.target.value }))} style={{ width: '100%', padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.textMute, marginBottom: 2 }}>법인카드 지출(원)</div>
                <input type="number" value={ledgerForm.card} onChange={ev => setLedgerForm(f => ({ ...f, card: ev.target.value }))} style={{ width: '100%', padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setLedgerForm(null)}>취소</Button>
                <Button variant="primary" onClick={saveLedger}>저장</Button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.textMute, marginTop: S[3], lineHeight: 1.6 }}>같은 이름이 있으면 덮어씁니다. 비직원 항목(부서명·차량 등 오분류)은 표의 휴지통으로 삭제하세요.</div>
          </div>
        </div>
      )}
      <div style={{ ...card(), padding: 0, overflow: 'auto', marginBottom: S[3] }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 860 }}>
          <thead><tr style={{ background: T.surfaceAlt }}>
            <Th>직원</Th><Th>본부</Th><Th align="center">참여</Th><Th align="right">배분인건비</Th><Th align="right">창출매출</Th><Th align="right">순기여(사업)</Th><Th align="right">신규수주</Th><Th align="right">법인카드</Th><Th align="right">종합(순기여−카드)</Th><Th align="center">점수</Th>{canEditLedger && <Th align="center">관리</Th>}
          </tr></thead>
          <tbody>
            {empRows.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center", color: T.textLight, padding: 20, fontSize: 12.5 }}>사업 참여(인력배분) 데이터가 없습니다</td></tr>}
            {empRows.map((e, i) => (
              <tr key={i} style={e.total < 0 ? { background: 'rgba(220,38,38,0.05)' } : undefined}>
                <Td><strong>{e.name}</strong>{e.pm && <span style={{ fontSize: 10, color: T.brand, marginLeft: 4 }}>PM</span>}{STATUS_LABEL[e.status] && <span style={{ fontSize: 10, color: '#fff', background: T.textMute, borderRadius: 4, padding: '1px 5px', marginLeft: 5 }}>{STATUS_LABEL[e.status]}</span>}</Td>
                <Td style={{ fontSize: 11, color: T.textMute }}>{shortName(e.dept)}</Td>
                <Td align="center">{e.cnt}</Td>
                <Td align="right" mono>{fmtMoney(e.labor)}</Td>
                <Td align="right" mono>{fmtMoney(e.rev)}</Td>
                <Td align="right" mono style={{ color: e.net >= 0 ? T.ink : T.danger }}>{fmtMoney(e.net)}</Td>
                <Td align="right" mono style={{ color: hasLedger ? (e.newOrder > 0 ? T.success : T.danger) : T.textLight }}>{hasLedger ? fmtMoney(e.newOrder) : '-'}</Td>
                <Td align="right" mono style={{ color: e.card > 0 ? T.warning : T.textLight }}>{hasLedger ? fmtMoney(e.card) : '-'}</Td>
                <Td align="right" mono><strong style={{ color: e.total >= 0 ? T.success : T.danger }}>{fmtMoney(e.total)}</strong></Td>
                <Td align="center">{e.score != null ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Badge color={e.score >= 80 ? T.success : e.score >= 70 ? T.warning : T.danger} size="sm">{e.score}</Badge>{e.track === 'support' && <span title={'비매출 지원트랙: 전사성과40+MBO60' + (e.mbo != null ? ' (MBO ' + e.mbo + ')' : ' · MBO 미입력')} style={{ fontSize: 9, color: '#7C3AED', fontWeight: 700 }}>지원</span>}{e.track === 'sales' && <span title={'영업 트랙: 수주 실적 기준' + (e.bidScore == null ? ' (수주 실적 없음 → 기본점수)' : '')} style={{ fontSize: 9, color: '#0369A1', fontWeight: 700 }}>영업</span>}{e.hasBid && e.track !== 'sales' && <span title={'수주 기여 포함' + (e.bidScore != null ? ' (수주점수 ' + e.bidScore + ')' : '')} style={{ fontSize: 9, color: T.brand, fontWeight: 700 }}>수주</span>}{e.evBonus > 0 && <span title={(e.jikjik ? '겸직' : '') + ' 다축 기여 보너스 +' + e.evBonus} style={{ fontSize: 9, color: T.success, fontWeight: 700 }}>+{e.evBonus}</span>}</span> : '-'}</Td>
                {canEditLedger && <Td align="center">
                  <span style={{ display: 'inline-flex', gap: 4 }}>
                    <button title="원장 수정 (신규수주·카드)" onClick={() => setLedgerForm({ name: e.name, empId: e.empId, card: e.card || 0, newOrder: e.newOrder || 0 })} style={{ padding: 3, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}><Pencil size={13} /></button>
                    {(e.card || e.newOrder || e.cnt === 0) ? <button title="원장에서 삭제 (비직원·오분류 정리)" onClick={() => removeLedger(e)} style={{ padding: 3, background: 'transparent', border: 'none', cursor: 'pointer', color: T.danger }}><Trash2 size={13} /></button> : null}
                  </span>
                </Td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>{hasLedger
        ? `창출매출·순기여(사업)는 사업 참여·기여도 기준, 신규수주·법인카드는 업로드된 직원별 원장 기준입니다. ‘종합(순기여−카드)’이 음수인 인원 ${negEmp}명 — 사업 기여보다 개인 경비가 큰 경우입니다. 신규수주가 0인데 법인카드 지출이 있는 직원은 영업·사업개발 성과 점검 대상입니다(예: 사업 담당은 있으나 신규 수주가 없는 경우). ▹ 기여점수는 인사평가용 종합점수로, 수행 기여 70% + 수주(제안) 기여 30%로 산출됩니다(‘수주’ 표시=수주 확정 제안 참여). 수행 기여는 참여율 20% 이상만 인정하며, 미만(제안서지원 등)은 수주 기여로만 반영됩니다. 수행+수주 다축 기여(+5)와 경영/관리 겸직(+5) 시 보너스가 가산됩니다(‘+’ 표시, 100점 상한).`
        : `사업 참여(인력배분·기여도) 기준 순기여입니다. 순기여가 음수인 인원 ${negEmp}명. ⚠ 신규수주·법인카드 열이 ‘-’인 것은 업로드 파일에 「직원별경비수주」 시트가 없기 때문입니다 — 이 시트(사원코드·성명·법인카드·신규수주)를 넣으면 개인별 카드지출·신규수주까지 자동 반영되어, 신규수주 0·카드지출 발생 같은 케이스가 종합순기여로 드러납니다.`}</Note>

      {perfRows.length > 0 && (
        <div style={{ ...card(), padding: S[5], marginTop: S[3], borderLeft: `4px solid ${T.brand}` }}>
          <SectionTitle>성과연동형 인력 (자문·프리랜서 · 기여 기준 별도 평가)</SectionTitle>
          <div style={{ overflow: 'auto', marginTop: S[3] }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 640 }}>
              <thead><tr style={{ background: T.surfaceAlt }}>
                <Th>직원</Th><Th align="center">구분</Th><Th align="right">월 기본급</Th><Th align="center">참여</Th><Th align="right">순기여(사업)</Th><Th align="right">신규수주</Th><Th align="center">기여점수</Th>
              </tr></thead>
              <tbody>
                {perfRows.map((e, i) => {
                  const emp = (employees || []).find(x => x.id === e.empId) || {};
                  const base = (emp.baseSalary || 0) + (emp.allowance || 0) + (emp.mealCar || 0);
                  return (
                    <tr key={i}>
                      <Td><strong>{e.name}</strong></Td>
                      <Td align="center"><Badge color={T.textMute} size="sm">{STATUS_LABEL[e.status] || '-'}</Badge></Td>
                      <Td align="right" mono>{fmtMoney(base)}</Td>
                      <Td align="center">{e.cnt}</Td>
                      <Td align="right" mono style={{ color: e.net >= 0 ? T.ink : T.danger }}>{fmtMoney(e.net)}</Td>
                      <Td align="right" mono style={{ color: hasLedger ? (e.newOrder > 0 ? T.success : T.danger) : T.textLight }}>{hasLedger ? fmtMoney(e.newOrder) : '-'}</Td>
                      <Td align="center">{e.score != null ? <Badge color={e.score >= 80 ? T.success : e.score >= 70 ? T.warning : T.danger} size="sm">{e.score}</Badge> : <span style={{ color: T.textLight }}>미참여</span>}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: S[3], fontSize: 12, color: T.textMute, lineHeight: 1.7 }}>
            이들은 낮은 고정급 + 사업 참여 지분으로 보상받는 인력으로, 일반 정규직 KPI가 아닌 <strong>프로젝트 기여·수주 성과(기여점수)로 별도 평가</strong>합니다. 참여 사업이 없으면 기본급만 발생하며 그 비용은 공통비로 처리됩니다. 지분 성과급(변동분)은 지급 시 해당 사업의 관리자인건비로 반영됩니다.
          </div>
        </div>
      )}

      {supportRows.length > 0 && (
        <div style={{ ...card(), padding: S[5], marginTop: S[3], borderLeft: `4px solid #7C3AED` }}>
          <SectionTitle>비매출 지원조직 평가 (경영·경영기획 등 · 전사성과 40% + MBO 60%)</SectionTitle>
          <div style={{ overflow: 'auto', marginTop: S[3] }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 560 }}>
              <thead><tr style={{ background: T.surfaceAlt }}>
                <Th>직원</Th><Th>부서</Th><Th align="center">전사성과점수</Th><Th align="center">개인 MBO</Th><Th align="center">종합점수</Th>
              </tr></thead>
              <tbody>
                {supportRows.map((e, i) => (
                  <tr key={i}>
                    <Td><strong>{e.name}</strong>{e.position ? <span style={{ fontSize: 10, color: T.textMute, marginLeft: 4 }}>{e.position}</span> : null}</Td>
                    <Td style={{ fontSize: 11, color: T.textMute }}>{shortName(e.dept)}</Td>
                    <Td align="center" mono>{e.company}</Td>
                    <Td align="center" mono>{e.mbo != null ? e.mbo : <span style={{ color: T.textLight }}>미입력</span>}</Td>
                    <Td align="center"><Badge color={e.score >= 80 ? T.success : e.score >= 70 ? T.warning : T.danger} size="sm">{e.score}</Badge></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: S[3], fontSize: 12, color: T.textMute, lineHeight: 1.7 }}>
            비매출 지원조직(경영지원·경영기획 등)은 프로젝트 수익률로 평가하면 불리하므로, <strong>전사 성과 40% + 개인 목표달성(MBO) 60%</strong>로 별도 평가합니다. 전사성과점수는 회사 완전영업이익률 기준({companyScore})이며, MBO는 관리자가 기능 목표(결산 정확성·자금관리·경영계획 달성 등) 대비 달성도를 입력합니다. MBO 미입력 시 전사성과점수만 적용됩니다.
          </div>
        </div>
      )}

      {utilRows.length > 0 && (
        <div style={{ ...card(), padding: S[5], marginTop: S[3], borderLeft: `4px solid ${T.ink}` }}>
          <SectionTitle>정규직 가동률 — 사업 투입 인건비 ÷ 급여 (1~{monthsElapsed}월 기준)</SectionTitle>
          {lowUtil > 0 && <div style={{ fontSize: 12, color: T.warning, marginTop: 4 }}>가동률 60% 미만 {lowUtil}명 — 급여의 상당 부분이 특정 사업에 배분되지 않고 공통비로 흡수되고 있습니다.</div>}
          <div style={{ overflow: 'auto', marginTop: S[3] }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 640 }}>
              <thead><tr style={{ background: T.surfaceAlt }}>
                <Th>직원</Th><Th>부서</Th><Th align="center">참여 사업</Th><Th align="right">사업 투입 인건비</Th><Th align="right">기간 급여</Th><Th align="center">가동률</Th>
              </tr></thead>
              <tbody>
                {utilRows.map((r, i) => (
                  <tr key={i}>
                    <Td><strong>{r.name}</strong> <span style={{ fontSize: 10, color: T.textMute }}>{r.position}</span></Td>
                    <Td style={{ fontSize: 11, color: T.textMute }}>{shortName(r.dept)}</Td>
                    <Td align="center" mono>{r.cnt}</Td>
                    <Td align="right" mono>{fmtMoney(r.lab)}</Td>
                    <Td align="right" mono style={{ color: T.textMute }}>{fmtMoney(r.cap)}</Td>
                    <Td align="center">{r.util == null ? '-' : <Badge color={r.util >= 90 ? T.success : r.util >= 60 ? T.warning : T.danger} size="sm">{r.util.toFixed(0)}%</Badge>}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2], lineHeight: 1.6 }}>
            가동률 = 사업에 배분된 인건비 ÷ (월 급여 × 경과월수). 100%면 급여 전액이 사업에 투입된 것, 낮으면 비배분(공통비 부담)이 큽니다. 경영지원·경영기획 등 지원조직은 본래 공통비 성격이라 낮게 나오는 것이 정상이며, <strong>매출조직인데 낮은 인원</strong>이 수주·재배치 검토 대상입니다.
          </div>
        </div>
      )}

      {/* 7. 원가·경비 구조 */}
      <H n="7" icon={Layers}>원가·경비 구조</H>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: S[4] }}>
        <div style={{ ...card(), padding: S[5] }}>
          <SectionTitle>총원가 구성</SectionTitle>
          <div style={{ height: 230, marginTop: S[2] }}>
            {costMix.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={2}>
                    {costMix.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => won(v)} contentStyle={{ fontSize: 12, fontFamily: FONT }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div style={{ ...card(), padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: T.surfaceAlt }}><Th>구분</Th><Th align="right">금액</Th><Th align="right">총원가 대비</Th><Th align="right">매출 대비</Th></tr></thead>
            <tbody>
              {[['작업자 인건비', T0.worker], ['관리자 인건비', T0.mgr], ['사업경비(제경비)', T0.overhead], ['공통비(간접비)', pool]].map(([lb, v]) => (
                <tr key={lb}><Td>{lb}</Td><Td align="right" mono>{won(v)}</Td><Td align="right" mono>{pct(v, totCostAll).toFixed(0)}%</Td><Td align="right" mono>{pct(v, T0.revenue).toFixed(0)}%</Td></tr>
              ))}
              <tr style={{ background: T.surfaceAlt }}><Td><strong>총원가 계</strong></Td><Td align="right" mono><strong>{won(totCostAll)}</strong></Td><Td align="right" mono><strong>100%</strong></Td><Td align="right" mono><strong>{pct(totCostAll, T0.revenue).toFixed(0)}%</strong></Td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <Note>{`총원가 ${won(totCostAll)}는 인건비 ${pct(T0.labor, totCostAll).toFixed(0)}%, 사업경비 ${pct(T0.overhead, totCostAll).toFixed(0)}%, 공통비 ${pct(pool, totCostAll).toFixed(0)}%로 구성됩니다. 공통비가 매출의 ${poolRev.toFixed(0)}%로 ${poolRev > 15 ? '부담이 크므로 본사운영비 점검이 필요' : '관리 가능한 수준'}합니다.`}</Note>

      {/* 7. 프로젝트별 수익성 진단 */}
      <H n="8" icon={Award}>프로젝트별 수익성 진단</H>
      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 900 }}>
          <thead><tr style={{ background: T.surfaceAlt }}>
            <Th>사업</Th><Th>본부</Th><Th align="right">매출</Th><Th align="right">인건비</Th><Th align="right">사업경비</Th><Th align="right">공헌이익</Th><Th align="right">배부공통비</Th><Th align="right">완전이익</Th><Th align="center">진행률</Th><Th align="right">수익률(계약)</Th><Th align="right">수익률(진행)</Th><Th align="center">등급</Th><Th align="center">진단</Th>
          </tr></thead>
          <tbody>
            {byRev.map(r => {
              const alloc = allocMap[r.id] || 0; const fp = r.m.profit - alloc;
              return (
                <tr key={r.id}>
                  <Td><span title={r.full}>{r.name}</span></Td>
                  <Td style={{ fontSize: 11, color: T.textMute }}>{shortName(r.dept)}</Td>
                  <Td align="right" mono>{fmtMoney(r.m.revenue)}</Td>
                  <Td align="right" mono>{fmtMoney(r.m.labor)}</Td>
                  <Td align="right" mono>{fmtMoney(r.m.overhead)}</Td>
                  <Td align="right" mono style={{ color: r.m.profit >= 0 ? T.ink : T.danger }}>{fmtMoney(r.m.profit)}</Td>
                  <Td align="right" mono style={{ color: T.warning }}>{alloc ? '-' + fmtMoney(alloc) : '0'}</Td>
                  <Td align="right" mono><strong style={{ color: fp >= 0 ? T.success : T.danger }}>{fmtMoney(fp)}</strong></Td>
                  <Td align="center" style={{ fontSize: 11, color: T.textMute }}>{r.m.progress != null ? Math.round(Math.min(r.m.progress, 1) * 100) + '%' : '-'}</Td>
                  <Td align="right" mono style={{ color: r.m.rate == null ? T.textLight : r.m.rate >= 10 ? T.success : r.m.rate >= 0 ? T.warning : T.danger }}>{r.m.rate != null ? r.m.rate.toFixed(0) + '%' : '-'}</Td>
                  <Td align="right" mono style={{ color: r.m.pocRate == null ? T.textLight : r.m.pocRate >= 10 ? T.success : r.m.pocRate >= 0 ? T.warning : T.danger }}><strong>{r.m.pocRate != null ? r.m.pocRate.toFixed(0) + '%' : '-'}</strong></Td>
                  <Td align="center">{r.m.grade ? <GradeBadge grade={r.m.grade} size="sm" /> : '-'}</Td>
                  <Td align="center">{r.diag.status === 'alert' ? <Badge color={T.danger} size="sm">위험</Badge> : r.diag.status === 'warn' ? <Badge color={T.warning} size="sm">주의</Badge> : <Badge color={T.success} size="sm">양호</Badge>}</Td>
                </tr>
              );
            })}
            <tr style={{ background: T.surfaceAlt }}>
              <Td><strong>합계</strong></Td><Td></Td>
              <Td align="right" mono><strong>{fmtMoney(T0.revenue)}</strong></Td><Td align="right" mono><strong>{fmtMoney(T0.labor)}</strong></Td>
              <Td align="right" mono><strong>{fmtMoney(T0.overhead)}</strong></Td><Td align="right" mono><strong>{fmtMoney(contrib)}</strong></Td>
              <Td align="right" mono><strong>-{fmtMoney(pool)}</strong></Td><Td align="right" mono><strong style={{ color: full >= 0 ? T.success : T.danger }}>{fmtMoney(full)}</strong></Td>
              <Td></Td>
              <Td align="right" mono><strong>{marginFull.toFixed(0)}%</strong></Td>
              <Td align="right" mono><strong>{(() => { const rt = byRev.reduce((a, r) => a + (r.m.recognizedRevenue || 0), 0); const pp = byRev.reduce((a, r) => a + (r.m.pocProfit || 0), 0); return rt > 0 ? (pp / rt * 100).toFixed(0) + '%' : '-'; })()}</strong></Td>
              <Td></Td><Td></Td>
            </tr>
          </tbody>
        </table>
      </div>
      <Note>{`수익률(계약)은 연간 계약금액 전액을 매출로 본 값이라, 진행 초기 사업은 원가가 덜 쌓여 과대 계상됩니다. 수익률(진행)은 진행률만큼만 매출을 인식(인식매출=계약×진행률)해 원가와 기간을 맞춘 값으로, 실제 수익성에 더 가깝습니다. 계획원가가 없어 진행률은 월별 집행 최종월 기준(예: 5월까지 집행→5/12)으로 추정했으며, 사업별로 실제 진행률을 입력하면 정확해집니다. 음수 수익률 사업(계약금액 오류 추정)은 별도 정정이 필요합니다.`}</Note>
      {etcProjects.length > 0 && (
        <div style={{ ...card({ borderLeft: `4px solid ${T.textMute}` }), padding: S[5], marginTop: S[3] }}>
          <SectionTitle>기타(비프로젝트) — 유지보수 등 계약구조 상이 · 수익성 평가 제외</SectionTitle>
          <div style={{ overflow: 'auto', marginTop: S[3] }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 560 }}>
              <thead><tr style={{ background: T.surfaceAlt }}><Th>사업</Th><Th align="right">계약금액</Th><Th align="right">집행원가</Th><Th align="right">차액</Th></tr></thead>
              <tbody>
                {etcProjects.map((p, i) => { const m = projectMetrics(p); return (
                  <tr key={i}><Td>{p.name}</Td><Td align="right" mono>{fmtMoney(m.revenue)}</Td><Td align="right" mono>{fmtMoney(m.cost)}</Td><Td align="right" mono style={{ color: m.revenue - m.cost >= 0 ? T.ink : T.danger }}>{fmtMoney(m.revenue - m.cost)}</Td></tr>
                ); })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11.5, color: T.textMute, marginTop: S[2], lineHeight: 1.6 }}>유지보수(연단가)·서고관리 등은 계약금액 구조가 일반 사업과 달라 수익률·기여점수 산정에서 제외했습니다. 원가는 실집행 기준이며, 계약금액이 정정되면 프로젝트로 복귀시킬 수 있습니다.</div>
        </div>
      )}

      {/* 8. 위험요소 진단 */}
      <H n="9" icon={ShieldAlert}>위험요소 진단</H>
      {risks.length === 0 ? (
        <div style={{ ...card(), padding: S[6], textAlign: 'center', color: T.success, fontWeight: 600 }}><CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />현재 특이 위험요소가 없습니다.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: S[3] }}>
          {[...sev, ...wrn].map((r, i) => {
            const c = r.level === '심각' ? T.danger : T.warning;
            return (
              <div key={i} style={{ ...card(), padding: S[4], borderLeft: `4px solid ${c}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {r.level === '심각' ? <AlertTriangle size={16} color={c} /> : <AlertCircle size={16} color={c} />}
                  <strong style={{ fontSize: 13.5, color: T.ink }}>{r.title}</strong><Badge color={c} size="sm">{r.level}</Badge>
                </div>
                <div style={{ fontSize: 12.5, color: T.text, marginBottom: 6 }}>{r.detail}</div>
                <div style={{ fontSize: 12, color: T.textMute }}><ChevronRight size={12} style={{ verticalAlign: 'middle' }} /> {r.action}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 9. 종합 진단 및 경영 제언 */}
      <H n="10" icon={FileBarChart}>종합 진단 및 경영 제언</H>
      <div style={{ ...card(), padding: S[6], borderTop: `3px solid ${healthColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: S[4] }}>
          <span style={{ fontSize: 13, color: T.textMute, fontWeight: 600 }}>경영상태 종합 판단</span><Badge color={healthColor}>{health}</Badge>
        </div>
        {assess.map((t, i) => (<p key={i} style={{ margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.8, color: T.text }}>{t}</p>))}
        <div style={{ marginTop: S[4], padding: S[4], background: T.surfaceAlt, borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.brand, marginBottom: 10 }}>경영 제언 (Action Items)</div>
          <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recs.map((r, i) => <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: T.text }}>{r}</li>)}
          </ol>
        </div>
        <div style={{ marginTop: S[4], fontSize: 11, color: T.textLight, borderTop: `1px solid ${T.divider}`, paddingTop: 10 }}>
          본 보고서는 프로젝트 수익성·사업관리 데이터를 기반으로 자동 산출되었습니다. 매출은 계약·수주 기준이며, 진행중 사업은 원가가 일부만 반영되어 수익률이 실제보다 높게 보일 수 있습니다. · 경영기획 {user?.name || ''} · {new Date().toLocaleDateString('ko-KR')}
        </div>
      </div>
    </div>
  );
}

function ProjectProfitView({ user, employees, projects, proposals, overheads, upsertProject, deleteProject, bulkUpsertProjects, bulkUpsertProposals, deleteProposal, upsertOverhead, deleteOverhead, bulkUpsertOverheads, bulkSetEmpLedger, currentYear, policy, setPolicy }) {
  const canEdit = user.role === 'admin' || user.deptScope === '경영지원부';
  const cfg = (policy && policy.diag) || {};
  const pmFloor = cfg.pmFloor ?? PM_MIN_CONTRIBUTION;
  const [editing, setEditing] = useState(null);   // 프로젝트 객체 또는 'new'
  const [yearFilter, setYearFilter] = useState('all');
  const [view, setView] = useState('list');
  const [importOpen, setImportOpen] = useState(false);
  const [sagwanOpen, setSagwanOpen] = useState(false);
  const fileRef = useRef(null);

  const empName = (id) => employees.find(e => e.id === id)?.name || id;

  const years = Array.from(new Set(projects.map(p => Number(p.year)))).sort((a, b) => b - a);
  const shownAll = projects.filter(p => yearFilter === 'all' || Number(p.year) === Number(yearFilter));
  const etcShown = shownAll.filter(isEtcProject);
  const shown = shownAll.filter(p => !isEtcProject(p));
  const bench = costBenchmark(shown);

  // 전사 합계
  const totals = shown.reduce((acc, p) => {
    const m = projectMetrics(p);
    acc.revenue += m.revenue; acc.cost += m.cost; acc.profit += m.profit;
    return acc;
  }, { revenue: 0, cost: 0, profit: 0 });
  const totalRate = totals.revenue > 0 ? (totals.profit / totals.revenue * 100) : null;

  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = String(ev.target.result).replace(/^\uFEFF/, '');
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) { alert('데이터 행이 없습니다.'); return; }
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
          const c = parseCsvLine(lines[i]);
          if (!c[1]) continue;
          rows.push({
            id: c[0] || `PRJ-${Date.now()}-${i}`,
            name: c[1], client: c[2] || '',
            year: Number(c[3]) || currentYear,
            period: c[4] || '', status: (c[5] === '종료' || c[5] === 'completed') ? 'completed' : 'ongoing',
            revenue: Number((c[6] || '').replace(/[^\d.-]/g, '')) || 0,
            laborCost: Number((c[7] || '').replace(/[^\d.-]/g, '')) || 0,
            overhead: Number((c[8] || '').replace(/[^\d.-]/g, '')) || 0,
            otherCost: Number((c[9] || '').replace(/[^\d.-]/g, '')) || 0,
            members: parseMembers(c[10]),
            note: c[11] || '',
          });
        }
        if (rows.length === 0) { alert('반영할 프로젝트가 없습니다.'); return; }
        bulkUpsertProjects(rows);
        setImportOpen(false);
      } catch (err) { alert('CSV 형식이 올바르지 않습니다.'); }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const header = '프로젝트ID,프로젝트명,발주처,연도,기간,상태,매출,인건비,제경비,기타비,참여자,비고';
    const sample = 'PRJ-2026-001,동원탄좌 M650 아카이브 2차년도,강원랜드 사업본부,2026,2026.01~2026.12,진행중,350000000,210000000,45000000,30000000,K-180501:PM:45|K-170801:핵심실무:35,메타데이터 1500점';
    const guide = '# 참여자 형식: 사번:역할:기여도(%) 를 | 로 구분. 상태: 진행중 또는 종료. 금액은 원 단위 숫자.';
    const blob = new Blob(['\uFEFF' + [header, sample, guide].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = '프로젝트수익성_양식.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Project Profitability"
        title="프로젝트 수익성"
        subtitle="프로젝트 종료·연말에 프로젝트별 매출·인건비·제경비를 입력하면 수익률이 자동 산정되고, 투입 직원의 업적평가 '프로젝트 기여도' 점수로 연계됩니다. (경영지원부 소관)"
        action={canEdit && (
          <div style={{ display: 'flex', gap: S[2] }}>
            <Button variant="secondary" size="sm" icon={FileSpreadsheet} onClick={() => setSagwanOpen(true)}>사업관리 엑셀 업로드</Button>
            <Button variant="outline" size="sm" icon={Upload} onClick={() => setImportOpen(true)}>CSV 업로드</Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setEditing('new')}>프로젝트 추가</Button>
          </div>
        )}
      />

      {!canEdit && (
        <div style={{ ...card({ borderLeft: `3px solid ${T.info}` }), padding: `${S[3]}px ${S[4]}px`, marginBottom: S[5], fontSize: 12, color: T.text, display: 'flex', gap: S[2], alignItems: 'center' }}>
          <AlertCircle size={14} style={{ color: T.info }} />
          프로젝트 수익성 데이터의 입력·수정은 경영지원부 소관입니다. 현재는 조회만 가능합니다.
        </div>
      )}

      {/* 합계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4], marginBottom: S[6] }}>
        <MetricCard icon={Briefcase} label="프로젝트 수" value={String(shown.length)} unit="건" />
        <MetricCard icon={TrendingUp} label="총 매출" value={fmtMoney(totals.revenue)} unit="원" />
        <MetricCard icon={Wallet} label="총 사업비" value={fmtMoney(totals.cost)} unit="원" sub="인건비+제경비+기타" />
        <MetricCard icon={PieIcon} label="평균 수익률(계약)" value={totalRate != null ? totalRate.toFixed(1) : '-'} unit="%" color={totalRate != null ? T[rateGrade(totalRate)] : T.ink} sub={(() => { const rt = shown.reduce((a, p) => a + (projectMetrics(p).recognizedRevenue || 0), 0); const pp = shown.reduce((a, p) => a + (projectMetrics(p).pocProfit || 0), 0); return rt > 0 ? `진행기준 ${(pp / rt * 100).toFixed(1)}%` : null; })()} />
      </div>

      {/* 완료/진행중 분리 요약 */}
      {(() => {
        const done = shown.filter(p => p.status === 'completed').map(projectMetrics);
        const wip = shown.filter(p => p.status !== 'completed').map(projectMetrics);
        const dRev = done.reduce((a, m) => a + m.revenue, 0), dPro = done.reduce((a, m) => a + m.profit, 0);
        const dRate = dRev > 0 ? dPro / dRev * 100 : null;
        const wRec = wip.reduce((a, m) => a + (m.recognizedRevenue || 0), 0), wPoc = wip.reduce((a, m) => a + (m.pocProfit || 0), 0);
        const wRate = wRec > 0 ? wPoc / wRec * 100 : null;
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], marginBottom: S[6] }}>
            <div style={{ ...card(), padding: S[5], borderLeft: `4px solid ${T.success}` }}>
              <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600, marginBottom: 4 }}>완료(정산확정) 사업 · {done.length}건</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: dRate != null ? T[rateGrade(dRate)] : T.textLight }}>{dRate != null ? dRate.toFixed(1) + '%' : '—'}</div>
              <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>{done.length ? `확정 매출 ${fmtMoney(dRev)} · 공헌이익 ${fmtMoney(dPro)}` : '정산 완료된 사업이 아직 없습니다'}</div>
              <div style={{ fontSize: 11.5, color: T.success, marginTop: 6, fontWeight: 600 }}>▹ 매출·원가 확정 — 실적 수익률</div>
            </div>
            <div style={{ ...card(), padding: S[5], borderLeft: `4px solid ${T.warning}` }}>
              <div style={{ fontSize: 12, color: T.textMute, fontWeight: 600, marginBottom: 4 }}>진행중 사업(예상) · {wip.length}건</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: wRate != null ? T[rateGrade(wRate)] : T.textLight }}>{wRate != null ? wRate.toFixed(1) + '%' : '—'}</div>
              <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>{wip.length ? `인식매출 ${fmtMoney(wRec)} · 진행기준 공헌이익 ${fmtMoney(wPoc)}` : '진행중 사업이 없습니다'}</div>
              <div style={{ fontSize: 11.5, color: T.warning, marginTop: 6, fontWeight: 600 }}>▹ 진행률 기준 추정 — 확정 아님</div>
            </div>
          </div>
        );
      })()}
      {etcShown.length > 0 && (
        <div style={{ ...card(), padding: S[4], marginBottom: S[5], borderLeft: `4px solid ${T.textMute}` }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: T.textMute, marginBottom: 4 }}>기타(비프로젝트) {etcShown.length}건 — 수익성 집계 제외</div>
          <div style={{ fontSize: 12, color: T.textMute, lineHeight: 1.6 }}>{etcShown.map(p => p.name).join(' · ')}</div>
          <div style={{ fontSize: 11, color: T.textLight, marginTop: 4 }}>유지보수(연단가) 등 계약구조가 달라 수익률·기여점수에서 제외됩니다. 상세는 경영보고서의 기타 표 참조.</div>
        </div>
      )}

      {/* 연도 필터 + 보기 전환 */}
      <div style={{ display: 'flex', gap: S[2], marginBottom: S[4], alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: T.textMute, fontWeight: 600 }}>연도</span>
        {['all', ...years].map(y => (
          <button key={y} onClick={() => setYearFilter(y)} style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 12, fontFamily: FONT, cursor: 'pointer',
            border: `1px solid ${String(yearFilter) === String(y) ? T.brand : T.border}`,
            background: String(yearFilter) === String(y) ? T.brand : T.surface,
            color: String(yearFilter) === String(y) ? '#fff' : T.text, fontWeight: 600,
          }}>{y === 'all' ? '전체' : `${y}년`}</button>
        ))}
        <div style={{ flex: 1 }} />
        {[['list', '목록'], ['analysis', '지출 분석'], ['overhead', '공통비 배부'], ['pipeline', '수주 파이프라인']].map(([v, lab]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 12, fontFamily: FONT, cursor: 'pointer',
            border: `1px solid ${view === v ? T.brand : T.border}`,
            background: view === v ? T.brand : T.surface,
            color: view === v ? '#fff' : T.text, fontWeight: 600,
          }}>{lab}</button>
        ))}
      </div>

      {view === 'pipeline' ? (
        <ProjectPipeline proposals={proposals || []} canEdit={canEdit} deleteProposal={deleteProposal} winProposal={winProposal} />
      ) : view === 'overhead' ? (
        <OverheadView projects={shown} overheads={overheads || []} currentYear={currentYear} yearFilter={yearFilter}
          policy={policy} setPolicy={setPolicy} canEdit={canEdit}
          upsertOverhead={upsertOverhead} deleteOverhead={deleteOverhead} />
      ) : view === 'analysis' ? (
        shown.length === 0
          ? <EmptyState icon={PieIcon} title="분석할 데이터가 없습니다" desc="프로젝트를 등록하거나 사업관리 엑셀을 업로드하세요" />
          : <ProjectAnalytics projects={shown} employees={employees} cfg={cfg} targets={(policy && policy.targets) || {}} allProjects={projects} />
      ) : shown.length === 0 ? (
        <EmptyState icon={Briefcase} title="프로젝트가 없습니다" desc={canEdit ? '프로젝트 추가 또는 CSV 업로드로 시작하세요' : '등록된 프로젝트가 없습니다'} />
      ) : (
        <div style={{ ...card(), overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <Th>프로젝트</Th><Th>발주처</Th><Th>연도</Th>
                <Th align="right">매출</Th><Th align="right">사업비</Th>
                <Th align="right">영업이익</Th><Th align="center">진행률</Th><Th align="right">수익률(계약)</Th><Th align="right">수익률(진행)</Th>
                <Th align="center">등급</Th><Th>투입 인원</Th>
                {canEdit && <Th align="center">관리</Th>}
              </tr>
            </thead>
            <tbody>
              {shown.map(p => {
                const m = projectMetrics(p);
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${T.divider}` }}>
                    <Td>
                      <div style={{ fontWeight: 600, color: T.ink, whiteSpace: 'normal', maxWidth: 240 }}>{p.name}</div>
                      <div style={{ marginTop: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <StatusBadge status={p.status} />
                        {costDiagnosis(m, bench, cfg).flags.map((f, fi) => (
                          <Badge key={fi} color={f.level === 'alert' ? T.danger : T.warning} variant="outline" size="sm">
                            {f.label} {f.detail}
                          </Badge>
                        ))}
                      </div>
                    </Td>
                    <Td>{p.client}</Td>
                    <Td>{p.year}</Td>
                    <Td align="right" mono>{fmtMoney(m.revenue)}</Td>
                    <Td align="right" mono>{fmtMoney(m.cost)}</Td>
                    <Td align="right" mono>
                      <span style={{ color: m.profit >= 0 ? T.success : T.danger }}>{fmtMoney(m.profit)}</span>
                    </Td>
                    <Td align="center" style={{ fontSize: 11, color: T.textMute }}>{m.progress != null ? Math.round(Math.min(m.progress, 1) * 100) + '%' : '-'}</Td>
                    <Td align="right" mono>
                      <span style={{ color: m.rate != null ? T[m.grade] : T.textLight }}>
                        {m.rate != null ? m.rate.toFixed(1) + '%' : '-'}
                      </span>
                    </Td>
                    <Td align="right" mono>
                      <strong style={{ color: m.pocRate == null ? T.textLight : m.pocRate >= 10 ? T.success : m.pocRate >= 0 ? T.warning : T.danger }}>
                        {m.pocRate != null ? m.pocRate.toFixed(1) + '%' : '-'}
                      </strong>
                    </Td>
                    <Td align="center"><GradeBadge grade={m.grade} size="sm" /></Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 220, whiteSpace: 'normal' }}>
                        {(p.members || []).map((mem, i) => (
                          <span key={i} style={{ fontSize: 10, padding: '2px 6px', background: T.surfaceAlt, borderRadius: 4, color: T.text }}>
                            {empName(mem.empId)} · {mem.contribution}%
                          </span>
                        ))}
                        {(p.members || []).length === 0 && <span style={{ fontSize: 11, color: T.textLight }}>미지정</span>}
                      </div>
                    </Td>
                    {canEdit && (
                      <Td align="center">
                        <div style={{ display: 'inline-flex', gap: 4 }}>
                          <button onClick={() => setEditing(p)} title="수정" style={{ padding: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: T.textMute }}><Pencil size={14} /></button>
                          <button onClick={() => { if (window.confirm(`"${p.name}" 프로젝트를 삭제할까요?`)) deleteProject(p.id); }} title="삭제" style={{ padding: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: T.danger }}><Trash2 size={14} /></button>
                        </div>
                      </Td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 산정 방식 안내 */}
      <div style={{ ...card(), padding: S[5], marginTop: S[6] }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: S[3] }}>기여도 산정 방식</div>
        <div style={{ fontSize: 12, color: T.text, lineHeight: 1.8 }}>
          · <strong>수익률(영업이익률)</strong> = (매출 − 사업비) ÷ 매출 × 100, 사업비 = 인건비 + 제경비 + 기타 직접비<br />
          · <strong>수익률 등급</strong> — 25%↑ S(100) · 18~25% A(85) · 12~18% B(75) · 5~12% C(65) · 5%↓ D(50)<br />
          · <strong>직원 기여도 점수</strong> = 참여 프로젝트별 (수익률 점수 × 기여도 비중)의 가중평균<br />
          · 산정된 점수는 평가 입력 화면의 <strong>'프로젝트 기여도'</strong> 항목에서 '자동 산정' 버튼으로 반영됩니다.
        </div>
      </div>

      {editing && (
        <ProjectEditModal
          project={editing === 'new' ? null : editing}
          employees={employees}
          currentYear={currentYear}
          onSave={(p) => { upsertProject(p); setEditing(null); }}
          onClose={() => setEditing(null)}
        />
      )}

      {importOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,37,71,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: S[5] }} onClick={() => setImportOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: 10, width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}` }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>CSV 업로드</h2>
              <button onClick={() => setImportOpen(false)} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}><X size={20} /></button>
            </div>
            <div style={{ padding: S[6] }}>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: S[4] }}>
                프로젝트별 수익성 데이터를 CSV로 일괄 등록합니다. 동일한 프로젝트ID는 덮어쓰기됩니다.<br />
                열 순서: <code style={{ fontSize: 11, background: T.surfaceAlt, padding: '1px 5px', borderRadius: 3 }}>프로젝트ID, 프로젝트명, 발주처, 연도, 기간, 상태, 매출, 인건비, 제경비, 기타비, 참여자, 비고</code>
              </div>
              <div style={{ display: 'flex', gap: S[3] }}>
                <Button variant="outline" size="sm" icon={Download} onClick={downloadTemplate}>양식 다운로드</Button>
                <Button variant="primary" size="sm" icon={Upload} onClick={() => fileRef.current?.click()}>CSV 파일 선택</Button>
                <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={handleFile} />
              </div>
            </div>
          </div>
        </div>
      )}
      {sagwanOpen && (
        <SagwanUploadModal
          employees={employees}
          currentYear={currentYear}
          pmFloor={pmFloor}
          onApply={(rows) => { bulkUpsertProjects(rows); setSagwanOpen(false); }}
          onApplyProposals={(props) => bulkUpsertProposals(props)}
          onApplyOverheads={(ohs) => bulkUpsertOverheads(ohs)}
          onApplyLedger={(l) => bulkSetEmpLedger && bulkSetEmpLedger(l)}
          onClose={() => setSagwanOpen(false)}
        />
      )}
    </div>
  );
}

function ProjectEditModal({ project, employees, currentYear, onSave, onClose }) {
  const [form, setForm] = useState(project ? { ...project, workerLabor: project.workerLabor ?? project.laborCost ?? '', mgrLabor: project.mgrLabor ?? '', members: (project.members || []).map(m => ({ ...m })) } : {
    id: `PRJ-${currentYear}-${String(Date.now()).slice(-4)}`, name: '', client: '',
    year: currentYear, period: '', status: 'ongoing',
    revenue: '', workerLabor: '', mgrLabor: '', overhead: '', otherCost: '', planCost: '', members: [], note: '',
  });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const laborSum = (Number(form.workerLabor) || 0) + (Number(form.mgrLabor) || 0);
  const m = projectMetrics({ ...form, laborCost: laborSum });
  const memberSum = (form.members || []).reduce((s, x) => s + (Number(x.contribution) || 0), 0);

  const addMember = () => set('members', [...(form.members || []), { empId: employees[0]?.id || '', role: '참여', contribution: 0 }]);
  const updMember = (i, k, v) => set('members', form.members.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const delMember = (i) => set('members', form.members.filter((_, idx) => idx !== i));

  const save = () => {
    if (!form.name.trim()) { alert('프로젝트명을 입력하세요.'); return; }
    const worker = Number(form.workerLabor) || 0, mgr = Number(form.mgrLabor) || 0;
    onSave({
      ...form,
      year: Number(form.year) || currentYear,
      revenue: Number(form.revenue) || 0,
      workerLabor: worker, mgrLabor: mgr, laborCost: worker + mgr,
      overhead: Number(form.overhead) || 0,
      otherCost: Number(form.otherCost) || 0,
      planCost: Number(form.planCost) || 0,
      members: (form.members || []).filter(x => x.empId).map(x => ({ empId: x.empId, role: x.role, contribution: Number(x.contribution) || 0 })),
    });
  };

  const inputStyle = { width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, boxSizing: 'border-box', outline: 'none', color: T.ink };
  const numStyle = { ...inputStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: T.textMute, display: 'block', marginBottom: 4 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,37,71,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: S[5] }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: 10, width: '100%', maxWidth: 720, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}` }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>{project ? '프로젝트 수정' : '프로젝트 추가'}</h2>
          <button onClick={onClose} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}><X size={20} /></button>
        </div>

        <div style={{ padding: `${S[5]}px ${S[6]}px`, overflowY: 'auto', flex: 1 }}>
          {/* 기본 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: S[3], marginBottom: S[3] }}>
            <div><label style={labelStyle}>프로젝트명</label><input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="예) 동원탄좌 M650 아카이브 2차년도" /></div>
            <div><label style={labelStyle}>발주처</label><input style={inputStyle} value={form.client} onChange={e => set('client', e.target.value)} placeholder="예) 강원랜드 사업본부" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: S[3], marginBottom: S[5] }}>
            <div><label style={labelStyle}>연도</label><input style={numStyle} type="number" value={form.year} onChange={e => set('year', e.target.value)} /></div>
            <div><label style={labelStyle}>기간</label><input style={inputStyle} value={form.period} onChange={e => set('period', e.target.value)} placeholder="2026.01~2026.12" /></div>
            <div>
              <label style={labelStyle}>상태</label>
              <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="ongoing">진행중</option>
                <option value="completed">종료</option>
              </select>
            </div>
          </div>

          {/* 재무 입력 */}
          <div style={{ fontSize: 12, fontWeight: 700, color: T.brand, marginBottom: S[3], paddingBottom: 6, borderBottom: `2px solid ${T.brand}` }}>재무 (원 단위)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3], marginBottom: S[4] }}>
            <div><label style={labelStyle}>매출</label><input style={numStyle} type="number" value={form.revenue} onChange={e => set('revenue', e.target.value)} placeholder="0" /></div>
            <div><label style={labelStyle}>작업자인건비</label><input style={numStyle} type="number" value={form.workerLabor} onChange={e => set('workerLabor', e.target.value)} placeholder="0" /></div>
            <div><label style={labelStyle}>관리자인건비</label><input style={numStyle} type="number" value={form.mgrLabor} onChange={e => set('mgrLabor', e.target.value)} placeholder="0" /></div>
            <div><label style={labelStyle}>제경비</label><input style={numStyle} type="number" value={form.overhead} onChange={e => set('overhead', e.target.value)} placeholder="0" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3], marginBottom: S[4] }}>
            <div><label style={labelStyle}>외주·기타비</label><input style={numStyle} type="number" value={form.otherCost} onChange={e => set('otherCost', e.target.value)} placeholder="0" /></div>
            <div><label style={labelStyle}>계획 원가(예산)</label><input style={numStyle} type="number" value={form.planCost} onChange={e => set('planCost', e.target.value)} placeholder="0" /></div>
          </div>

          {/* 계산 결과 */}
          <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap', padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6, marginBottom: S[5], alignItems: 'center' }}>
            <div style={{ fontSize: 12 }}><span style={{ color: T.textMute }}>사업비 </span><strong style={{ color: T.ink }}>{fmtMoney(m.cost)}원</strong></div>
            <div style={{ fontSize: 12 }}><span style={{ color: T.textMute }}>영업이익 </span><strong style={{ color: m.profit >= 0 ? T.success : T.danger }}>{fmtMoney(m.profit)}원</strong></div>
            <div style={{ fontSize: 12 }}><span style={{ color: T.textMute }}>수익률 </span><strong style={{ color: m.rate != null ? T[m.grade] : T.textLight }}>{m.rate != null ? m.rate.toFixed(1) + '%' : '-'}</strong></div>
            {m.grade && <GradeBadge grade={m.grade} size="sm" />}
          </div>

          {/* 투입 인원 · 기여도 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[3], paddingBottom: 6, borderBottom: `2px solid ${T.success}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.success }}>투입 인원 · 기여도 비중</div>
            <div style={{ fontSize: 11, color: memberSum === 100 ? T.success : T.warning, fontWeight: 600 }}>합계 {memberSum}%{memberSum !== 100 && ' (100% 권장)'}</div>
          </div>
          {(form.members || []).map((mem, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', gap: S[2], marginBottom: S[2], alignItems: 'center' }}>
              <select style={inputStyle} value={mem.empId} onChange={e => updMember(i, 'empId', e.target.value)}>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.dept})</option>)}
              </select>
              <select style={inputStyle} value={mem.role} onChange={e => updMember(i, 'role', e.target.value)}>
                {PROJECT_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div style={{ position: 'relative' }}>
                <input style={{ ...numStyle, paddingRight: 22 }} type="number" value={mem.contribution} onChange={e => updMember(i, 'contribution', e.target.value)} placeholder="0" />
                <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: T.textMute }}>%</span>
              </div>
              <button onClick={() => delMember(i)} style={{ padding: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: T.danger }}><Trash2 size={14} /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" icon={Plus} onClick={addMember} style={{ marginTop: S[2] }}>인원 추가</Button>

          <div style={{ marginTop: S[5] }}>
            <label style={labelStyle}>비고</label>
            <input style={inputStyle} value={form.note} onChange={e => set('note', e.target.value)} placeholder="메모" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S[2], padding: `${S[4]}px ${S[6]}px`, borderTop: `1px solid ${T.border}` }}>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button variant="primary" icon={Save} onClick={save}>저장</Button>
        </div>
      </div>
    </div>
  );
}

// 프로젝트 기여도 자동 산정 모달 (평가 입력용)
function ContributionCalcModal({ employee, projects, proposals, currentYear, onApply, onClose }) {
  const result = calcContributionScore(employee.id, projects, currentYear);
  const nm = String(employee.name || '').trim();
  const track = isSupportTrack(nm) ? 'support' : isSalesTrack(nm) ? 'sales' : 'project';
  const ev = track === 'project' ? calcEvalScore(employee.id, nm, projects, proposals, currentYear, employee) : null;
  const bid = calcBidScore(nm, proposals, projects, currentYear);
  const salesScore = track === 'sales' ? (bid ? bid.score : EVAL_CFG.salesFloor) : null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,37,71,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: S[5] }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: 10, width: '100%', maxWidth: 700, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={16} style={{ color: T.brand }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: T.brand, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Contribution</div>
            </div>
            <h2 style={{ margin: `${S[1]}px 0 0`, fontSize: 20, fontWeight: 700, color: T.ink }}>{employee.name} · 프로젝트 기여도 산정</h2>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>{currentYear}년 참여 프로젝트의 수익률 × 기여도 비중 가중평균 (경영지원부 수익성 데이터 연계)</div>
          </div>
          <button onClick={onClose} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}><X size={20} /></button>
        </div>

        <div style={{ padding: `${S[5]}px ${S[6]}px`, overflowY: 'auto', flex: 1 }}>
          {!result ? (
            <div style={{ padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', borderRadius: 6, fontSize: 12, color: T.text, display: 'flex', gap: S[2], alignItems: 'flex-start' }}>
              <AlertCircle size={14} style={{ color: T.warning, flexShrink: 0, marginTop: 1 }} />
              <div>{currentYear}년 <strong>{employee.name}</strong>님이 투입된 프로젝트 수익성 데이터가 없습니다. '프로젝트 수익성' 메뉴에서 프로젝트를 등록하고 투입 인원을 지정하세요.</div>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: S[5] }}>
                <thead>
                  <tr>
                    <Th>프로젝트</Th><Th align="right">수익률</Th><Th align="center">등급</Th>
                    <Th align="right">수익점수</Th><Th align="right">기여도</Th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((b, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.divider}` }}>
                      <Td>
                        <div style={{ fontWeight: 600, color: T.ink, whiteSpace: 'normal', maxWidth: 300 }}>{b.project.name}</div>
                        <div style={{ fontSize: 10, color: T.textMute }}>{b.member.role}</div>
                      </Td>
                      <Td align="right" mono>{b.metrics.rate != null ? b.metrics.rate.toFixed(1) + '%' : '-'}</Td>
                      <Td align="center"><GradeBadge grade={b.metrics.grade} size="sm" /></Td>
                      <Td align="right" mono>{b.metrics.score}</Td>
                      <Td align="right" mono>{b.weight}%</Td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: S[4], background: T.surfaceAlt, borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: T.textMute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>산정 기여도 점수</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                    <span style={{ fontSize: 32, fontWeight: 700, color: T.brand }}>{track === 'sales' ? salesScore : (ev ? ev.score : result.score)}</span>
                    <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 4 }}>
                      {track === 'sales' && (bid ? `영업 트랙 · 수주 실적 기준 (${bid.score}점)` : `영업 트랙 · 수주 실적 없음 → 기본 ${EVAL_CFG.salesFloor}점`)}
                      {track === 'support' && '지원 트랙 · 전사성과+MBO로 별도 평가(경영보고서 참조)'}
                      {track === 'project' && ev && `수행 ${ev.exec ?? '-'} × 70% ${ev.bid != null ? `+ 수주 ${ev.bid} × 30%` : '(수주 기여 없음)'}${ev.bonus ? ` + 보너스 ${ev.bonus}(${[ev.multi ? '다축' : null, ev.jikjik ? '겸직' : null].filter(Boolean).join('·')})` : ''} · 완료사업=확정, 진행중=진행기준 수익률로 보정`}
                    </div>
                    <GradeBadge grade={result.grade} size="lg" />
                  </div>
                </div>
                <Button variant="primary" icon={CheckCircle2} onClick={() => onApply(track === 'sales' ? salesScore : (ev ? ev.score : result.score))}>이 점수 적용</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 사업관리 워크북(엑셀) → 프로젝트 수익성 자동 변환
// SheetJS를 CDN에서 동적 로드하여 브라우저에서 직접 파싱
// (검증된 파이썬 변환 로직 이식: 매출=계약금액, 인건비=소계−사업경비,
//  제경비=사업경비, 참여자/기여도=인력운영현황 투입 인건비 비중)
// ============================================================
function ensureXLSX() {
  if (typeof window !== 'undefined' && window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.async = true;
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error('엑셀 처리 모듈(SheetJS) 로드 실패 — 인터넷 연결을 확인하세요.'));
    document.head.appendChild(s);
  });
}
const _sgNorm = (v) => v == null ? '' : String(v).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
const _sgKey = (v) => _sgNorm(v).replace(/\([^)]*\)/g, '').replace(/[^0-9A-Za-z가-힣]/g, '');
const _sgTitle = (v) => _sgNorm(v).replace(/\s*(이사|부장|차장|과장|대리|주임|사원|팀장|부서장|연구원|선임|책임)\s*$/, '').trim();
function _sgCell(ws, XLSX, r, c) { return ws[XLSX.utils.encode_cell({ r, c })]; }
function _sgStr(ws, XLSX, r, c) { const x = _sgCell(ws, XLSX, r, c); return x ? _sgNorm(x.v) : ''; }
function _sgNum(cell) {
  if (!cell || cell.t === 'e') return null;
  const v = cell.v;
  if (typeof v === 'number') return v;
  if (v instanceof Date) return null;
  const t = String(v).replace(/,/g, '').trim();
  if (t === '' || t === '-') return null;
  const n = Number(t); return isNaN(n) ? null : n;
}
function _sgYM(cell) {
  if (cell && cell.t === 'd' && cell.v instanceof Date) {
    const d = cell.v; return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0');
  }
  return '';
}
function parseSagwanWorkbook(XLSX, arrayBuffer, yearDefault, pmFloor) {
  const floor = pmFloor != null ? pmFloor : PM_MIN_CONTRIBUTION;
  const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  for (const n of ['사업진행현황', '사업별집행내역', '인력운영현황']) {
    if (!wb.Sheets[n]) throw new Error(`필수 시트가 없습니다: "${n}". 표준 사업관리 워크북인지 확인하세요.`);
  }
  // 1) 프로젝트 마스터
  const ws1 = wb.Sheets['사업진행현황']; const rng1 = XLSX.utils.decode_range(ws1['!ref']);
  const projects = {}; const name2no = {};
  for (let r = 2; r <= rng1.e.r; r++) {
    const NO = _sgStr(ws1, XLSX, r, 0); const name = _sgStr(ws1, XLSX, r, 3);
    if (!NO || !name || !/^\d{4}-\d+/.test(NO)) continue;
    const ks = _sgCell(ws1, XLSX, r, 10), ke = _sgCell(ws1, XLSX, r, 11);
    const note = _sgStr(ws1, XLSX, r, 14);
    projects[NO] = {
      id: NO, name, client: _sgStr(ws1, XLSX, r, 2),
      year: (ks && ks.t === 'd') ? ks.v.getFullYear() : (yearDefault || 2025),
      period: (_sgYM(ks) || _sgYM(ke)) ? (_sgYM(ks) + '~' + _sgYM(ke)) : '',
      status: /완료|종료/.test(note) ? 'completed' : 'ongoing',
      revenue: _sgNum(_sgCell(ws1, XLSX, r, 6)) || 0,
      pm: _sgTitle(_sgStr(ws1, XLSX, r, 13)), dept: _sgStr(ws1, XLSX, r, 12),
      laborCost: 0, overhead: 0, otherCost: 0, members: [], note,
      _fl: [], _el: null, _em: null, _ee: null, _et: null, _plan: 0, _monthly: new Array(13).fill(0),
    };
    name2no[_sgKey(name)] = NO;
  }
  // 2) 사업별집행내역 → 원가
  const ws2 = wb.Sheets['사업별집행내역']; const rng2 = XLSX.utils.decode_range(ws2['!ref']); let cur = null; let curOH = false; let ohSum = 0;
  const ohMonthly = new Array(13).fill(0);
  const hyeonCols = []; for (let mo = 0; mo < 13; mo++) hyeonCols.push(6 + 2 * mo); // 현황 월 컬럼(0-based: G=6,I=8,...)
  for (let r = 3; r <= rng2.e.r; r++) {
    const NO = _sgStr(ws2, XLSX, r, 0); const F = _sgStr(ws2, XLSX, r, 5);
    const AG = _sgNum(_sgCell(ws2, XLSX, r, 32));  // 현황 합계
    const AH = _sgNum(_sgCell(ws2, XLSX, r, 33));  // 계획 합계
    if (NO && /^\d{4}-\d+/.test(NO)) {
      cur = projects[NO] ? NO : null;
      const nm = _sgStr(ws2, XLSX, r, 3);
      curOH = !cur && /본사운영|공통경비|세종연구소운영|간접비/.test(nm + ' ' + NO);
      continue;
    }
    const isCost = (F === '작업자인건비' || F === '관리자인건비' || F === '사업경비');
    if (curOH) {
      if (isCost && AG) { ohSum += AG; hyeonCols.forEach((c, mi) => { const v = _sgNum(_sgCell(ws2, XLSX, r, c)); if (v) ohMonthly[mi] += v; }); }
      continue;
    }
    if (!cur) continue;
    if (isCost) hyeonCols.forEach((c, mi) => { const v = _sgNum(_sgCell(ws2, XLSX, r, c)); if (v) projects[cur]._monthly[mi] += v; });
    if (F === '작업자인건비') { projects[cur]._el = AG; projects[cur]._plan += (AH || 0); }
    else if (F === '관리자인건비') { projects[cur]._em = AG; projects[cur]._plan += (AH || 0); }
    else if (F === '사업경비') { projects[cur]._ee = AG; projects[cur]._plan += (AH || 0); }
    else if (F === '소계') projects[cur]._et = AG;
  }
  // 3) 인력운영현황 → 참여자·투입 인건비
  const ws3 = wb.Sheets['인력운영현황']; const rng3 = XLSX.utils.decode_range(ws3['!ref']);
  let emp = null, proj = null; const mm = {}; const unmatched = new Set();
  for (let r = 2; r <= rng3.e.r; r++) {
    const A = _sgStr(ws3, XLSX, r, 0);
    if (A.indexOf('K-') === 0) emp = { id: A, name: _sgStr(ws3, XLSX, r, 1), pos: _sgStr(ws3, XLSX, r, 3) };
    const F = _sgStr(ws3, XLSX, r, 5); const H = _sgStr(ws3, XLSX, r, 7);
    if (F) proj = F;
    if (H === '수행별인건비' && emp && proj) {
      const V = _sgNum(_sgCell(ws3, XLSX, r, 21)) || 0;
      const no = name2no[_sgKey(proj)];
      if (no == null) { if (V > 0) unmatched.add(proj); continue; }
      if (!mm[no]) mm[no] = {};
      if (!mm[no][emp.id]) mm[no][emp.id] = { name: emp.name, pos: emp.pos, labor: 0 };
      mm[no][emp.id].labor += V;
    }
  }
  // 4) 합산 + 기여도
  Object.keys(projects).forEach(no => {
    const p = projects[no]; const team = mm[no] || {};
    const totlabor = Object.values(team).reduce((s, m) => s + m.labor, 0);
    const w = typeof p._el === 'number' ? p._el : null, mg = typeof p._em === 'number' ? p._em : null;
    const etc = typeof p._ee === 'number' ? p._ee : null, tot = typeof p._et === 'number' ? p._et : null;
    let labor, overhead;
    if (tot != null && etc != null) { labor = Math.max(0, tot - etc); overhead = etc; }
    else if (w != null || mg != null) { labor = (w || 0) + (mg || 0); overhead = etc || 0; if (w == null) p._fl.push('작업자인건비 오류'); }
    else { labor = 0; overhead = etc || 0; p._fl.push('원가 미집계'); }
    // 작업자/관리자 인건비 분리 (지출 분석용)
    const worker = (w != null) ? w : Math.max(0, labor - (mg || 0));
    const mgr = (mg != null) ? mg : Math.max(0, labor - worker);
    p.workerLabor = Math.round(worker); p.mgrLabor = Math.round(mgr);
    p.laborCost = Math.round(labor); p.overhead = Math.round(overhead);
    p.planCost = Math.round(p._plan || 0);
    p.monthly = p._monthly.map(v => Math.round(v));
    const cost = labor + overhead;
    if (p.revenue > 0 && cost > p.revenue * 1.5) p._fl.push('원가>매출');
    if (p.revenue > 0 && cost === 0) p._fl.push('원가 0');
    p.members = Object.entries(team).sort((a, b) => b[1].labor - a[1].labor).map(([eid, m]) => ({
      empId: eid,
      role: (p.pm && _sgTitle(m.name) === p.pm) ? 'PM' : (/부장|차장|부서장|이사|팀장/.test(m.pos) ? '핵심실무' : '참여'),
      contribution: totlabor > 0 ? Math.round(m.labor / totlabor * 100) : 0,
      _name: m.name,
    }));
    applyPmFloor(p.members, floor);
  });

  // 5) 사업제안현황 → 수주 파이프라인 (있을 때만)
  const proposals = [];
  const wsP = wb.Sheets['사업제안현황'];
  if (wsP) {
    const rngP = XLSX.utils.decode_range(wsP['!ref']);
    for (let r = 0; r <= rngP.e.r; r++) {
      const name = _sgStr(wsP, XLSX, r, 2);
      const client = _sgStr(wsP, XLSX, r, 3);
      const budget = _sgNum(_sgCell(wsP, XLSX, r, 4));
      if (!name || name === '사업명') continue;
      if (!client && budget == null) continue;
      const won = name2no[_sgKey(name)] != null;
      proposals.push({
        id: 'P:' + _sgKey(name),
        name, client, category: _sgStr(wsP, XLSX, r, 1),
        budget: Math.round(budget || 0),
        bidDate: _sgYM(_sgCell(wsP, XLSX, r, 5)),
        pm: _sgTitle(_sgStr(wsP, XLSX, r, 9)),
        participants: _sgStr(wsP, XLSX, r, 8).split(/[,\s/·]+/).map(s => _sgTitle(s.trim())).filter(Boolean),
        consortium: _sgStr(wsP, XLSX, r, 7),
        note: _sgStr(wsP, XLSX, r, 10),
        status: won ? '수주' : '제안',
        wonProjectId: won ? name2no[_sgKey(name)] : null,
      });
    }
  }

  // 6) 직원별경비수주 (있을 때만): 사원코드|성명|법인카드|신규수주|비고
  const empLedger = [];
  const wsE = wb.Sheets['직원별경비수주'] || wb.Sheets['직원별 경비수주'];
  if (wsE) {
    const rngE = XLSX.utils.decode_range(wsE['!ref']);
    for (let r = 0; r <= rngE.e.r; r++) {
      const code = _sgStr(wsE, XLSX, r, 0);
      const name = _sgStr(wsE, XLSX, r, 1);
      if ((!code && !name) || name === '성명' || code === '사원코드') continue;
      const card = _sgNum(_sgCell(wsE, XLSX, r, 2)) || 0;
      const newOrder = _sgNum(_sgCell(wsE, XLSX, r, 3)) || 0;
      if (!card && !newOrder) continue;
      empLedger.push({ empId: code || null, name, card: Math.round(card), newOrder: Math.round(newOrder), year: yearDefault || 2026 });
    }
  }

  const ohYear = yearDefault || 2026;
  const overheads = ohSum > 0 ? [{ id: 'OH:' + ohYear + ':excel', year: ohYear, category: '본사운영·공통경비(엑셀)', amount: Math.round(ohSum), monthly: ohMonthly.map(v => Math.round(v)), note: '사업관리 엑셀 업로드' }] : [];
  return { projects: Object.values(projects), unmatched: Array.from(unmatched), proposals, overheads, empLedger };
}

function SagwanUploadModal({ employees, currentYear, onApply, onApplyProposals, onApplyOverheads, onApplyLedger, onClose, pmFloor }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null); // { projects, unmatched }
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setBusy(true); setError(''); setPreview(null);
    try {
      const XLSX = await ensureXLSX();
      const buf = await file.arrayBuffer();
      const res = parseSagwanWorkbook(XLSX, buf, currentYear, pmFloor);
      if (res.projects.length === 0) throw new Error('변환할 프로젝트를 찾지 못했습니다. 시트 서식을 확인하세요.');
      setPreview(res);
    } catch (err) {
      setError(err.message || '엑셀 처리 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const apply = () => {
    const rows = preview.projects.map(p => ({
      id: p.id, name: p.name, client: p.client, year: Number(p.year) || currentYear,
      period: p.period, status: p.status,
      revenue: Math.round(p.revenue), laborCost: p.laborCost, workerLabor: p.workerLabor, mgrLabor: p.mgrLabor, overhead: p.overhead, otherCost: 0, planCost: p.planCost, monthly: p.monthly,
      members: p.members.map(m => ({ empId: m.empId, role: m.role, contribution: m.contribution })),
      note: (p.note + (p._fl.length ? ' · ' + p._fl.join(' / ') : '')).replace(/^ · /, '').trim(),
    }));
    onApply(rows);
    if (onApplyProposals && preview.proposals && preview.proposals.length) onApplyProposals(preview.proposals);
    if (onApplyOverheads && preview.overheads && preview.overheads.length) onApplyOverheads(preview.overheads);
    if (onApplyLedger && preview.empLedger && preview.empLedger.length) onApplyLedger(preview.empLedger);
  };

  const clean = preview ? preview.projects.filter(p => p._fl.length === 0).length : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,37,71,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: S[5] }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: 10, width: '100%', maxWidth: 860, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${S[5]}px ${S[6]}px`, borderBottom: `1px solid ${T.border}` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileSpreadsheet size={16} style={{ color: T.brand }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: T.brand, letterSpacing: '0.15em', textTransform: 'uppercase' }}>사업관리 워크북 자동 변환</div>
            </div>
            <h2 style={{ margin: `${S[1]}px 0 0`, fontSize: 20, fontWeight: 700, color: T.ink }}>사업관리 엑셀 업로드</h2>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>사업진행현황·사업별집행내역·인력운영현황을 읽어 프로젝트 수익성·기여도를 자동 산정합니다.</div>
          </div>
          <button onClick={onClose} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMute }}><X size={20} /></button>
        </div>

        <div style={{ padding: `${S[5]}px ${S[6]}px`, overflowY: 'auto', flex: 1 }}>
          {!preview && (
            <>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: S[4] }}>
                엑셀(.xlsx) 파일을 선택하면 브라우저에서 바로 분석합니다. 별도 설치는 필요 없습니다.<br />
                매출=계약금액 · 인건비=소계−사업경비 · 제경비=사업경비 · 참여자·기여도=인력운영현황(투입 인건비 비중)으로 계산됩니다.
              </div>
              <Button variant="primary" icon={Upload} onClick={() => fileRef.current?.click()} disabled={busy}>
                {busy ? '분석 중…' : '엑셀 파일 선택'}
              </Button>
              <input ref={fileRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: 'none' }} onChange={handleFile} />
              {error && (
                <div style={{ marginTop: S[4], padding: `${S[3]}px ${S[4]}px`, background: '#FDECEC', borderRadius: 6, fontSize: 12, color: T.danger, display: 'flex', gap: S[2], alignItems: 'flex-start' }}>
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />{error}
                </div>
              )}
            </>
          )}

          {preview && (
            <>
              <div style={{ display: 'flex', gap: S[3], marginBottom: S[4], flexWrap: 'wrap' }}>
                <Badge color={T.brand} variant="outline">총 {preview.projects.length}개</Badge>
                <Badge color={T.success} variant="outline">정상 {clean}개</Badge>
                <Badge color={T.warning} variant="outline">검토 필요 {preview.projects.length - clean}개</Badge>
                {preview.unmatched.length > 0 && <Badge color={T.textMute} variant="outline">이름 미매칭 {preview.unmatched.length}건</Badge>}
                {preview.proposals && preview.proposals.length > 0 && <Badge color={T.brand} variant="outline">제안현황 {preview.proposals.length}건</Badge>}
                {preview.overheads && preview.overheads.length > 0 && <Badge color={T.warning} variant="outline">공통비 {fmtMoney(preview.overheads.reduce((s, o) => s + o.amount, 0))}원</Badge>}
              </div>
              <div style={{ ...card(), overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <Th>프로젝트</Th><Th align="right">매출</Th><Th align="right">인건비</Th>
                      <Th align="right">제경비</Th><Th align="right">수익률</Th><Th align="center">등급</Th>
                      <Th align="center">인원</Th><Th>검토</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.projects.map(p => {
                      const m = projectMetrics(p);
                      return (
                        <tr key={p.id} style={{ borderBottom: `1px solid ${T.divider}` }}>
                          <Td><div style={{ fontWeight: 600, color: T.ink, whiteSpace: 'normal', maxWidth: 230 }}>{p.name}</div></Td>
                          <Td align="right" mono>{fmtMoney(m.revenue)}</Td>
                          <Td align="right" mono>{fmtMoney(m.labor)}</Td>
                          <Td align="right" mono>{fmtMoney(m.overhead)}</Td>
                          <Td align="right" mono><strong style={{ color: m.rate != null ? T[m.grade] : T.textLight }}>{m.rate != null ? m.rate.toFixed(1) + '%' : '-'}</strong></Td>
                          <Td align="center"><GradeBadge grade={m.grade} size="sm" /></Td>
                          <Td align="center">{p.members.length}</Td>
                          <Td>{p._fl.length ? <span style={{ fontSize: 10, color: T.warning, fontWeight: 600 }}>{p._fl.join(', ')}</span> : <span style={{ fontSize: 10, color: T.success }}>정상</span>}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: S[4], padding: `${S[3]}px ${S[4]}px`, background: '#FFF8E6', borderRadius: 6, fontSize: 11, color: T.text, lineHeight: 1.7 }}>
                ‘검토 필요’ 항목은 원본 엑셀의 수식 오류(#VALUE!)나 원가 미집계로 수익률이 부정확할 수 있습니다. 반영 후 필요하면 각 프로젝트에서 직접 수정하거나, 원본을 보완해 다시 업로드하세요. 동일 프로젝트ID는 덮어쓰기됩니다.
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${S[4]}px ${S[6]}px`, borderTop: `1px solid ${T.border}` }}>
          <div>{preview && <Button variant="ghost" size="sm" onClick={() => { setPreview(null); setError(''); }}>다른 파일 선택</Button>}</div>
          <div style={{ display: 'flex', gap: S[2] }}>
            <Button variant="outline" onClick={onClose}>취소</Button>
            {preview && <Button variant="primary" icon={CheckCircle2} onClick={apply}>{preview.projects.length}개 프로젝트 반영</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
// 평가자가 점수를 입력하는 동안 실시간으로 진급 Point 충족 여부를 표시
// ============================================================
function PromotionEvalCard({ emp, policy, totalScore }) {
  const status = calcPromotionStatus(emp, policy, totalScore);
  if (!status || !status.isEligible) return null;
  
  const { tier, tenure, decisionType, currentPoint, requiredPoint, pointMet, yearsMet, yearsRemaining } = status;
  
  // 경영진 의사결정 케이스
  if (decisionType === 'executive') {
    return (
      <div style={{ 
        marginBottom: S[5], padding: S[4],
        background: 'linear-gradient(135deg, #FFF8E6 0%, #FFFAEC 100%)',
        border: `2px solid ${T.warning}`,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: S[4]
      }}>
        <div style={{ 
          width: 44, height: 44, borderRadius: 22, 
          background: T.warning, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <TrendingUp size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: 10, fontWeight: 700, color: T.warning, 
            letterSpacing: '0.15em', marginBottom: 2
          }}>
            ★ 승진 심사 대상 · 경영진 의사결정
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>
            {tier.fromTitle} → {tier.toTitle} 승진 검토
          </div>
          <div style={{ fontSize: 11, color: T.text, marginTop: 4, lineHeight: 1.6 }}>
            근속 {tenure}년 · 정량 기준이 아닌 경영진 의사결정으로 승진이 결정됩니다. 평가 결과는 참고 자료로 활용됩니다.
          </div>
        </div>
      </div>
    );
  }
  
  // 일반 승진 심사
  const allMet = yearsMet && pointMet;
  const bgColor = allMet 
    ? 'linear-gradient(135deg, #F0F7F1 0%, #F5FAF6 100%)'
    : 'linear-gradient(135deg, #FFF8E6 0%, #FFFAEC 100%)';
  const borderColor = allMet ? T.success : T.warning;
  const iconBg = allMet ? T.success : T.warning;
  
  return (
    <div style={{ 
      marginBottom: S[5], padding: S[4],
      background: bgColor,
      border: `2px solid ${borderColor}`,
      borderRadius: 8
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[4], marginBottom: S[3] }}>
        <div style={{ 
          width: 44, height: 44, borderRadius: 22, 
          background: iconBg, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <TrendingUp size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: 10, fontWeight: 700, color: borderColor, 
            letterSpacing: '0.15em', marginBottom: 2
          }}>
            ★ 승진 심사 대상 {allMet ? '· 모든 기준 충족' : `· ${!yearsMet ? '체류 연한 미충족' : '진급 Point 미충족'}`}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>
            {tier.fromLevel} {tier.fromTitle} → {tier.toTitle}
            <span style={{ fontSize: 11, color: T.textMute, fontWeight: 500, marginLeft: 8 }}>
              승진 시 급여 +{tier.increase}% 인상
            </span>
          </div>
        </div>
      </div>
      
      {/* 3개 메트릭 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[3], paddingLeft: 60 }}>
        {/* 체류 연한 */}
        <div style={{ 
          padding: `${S[3]}px ${S[3]}px`, background: 'rgba(255,255,255,0.7)', 
          borderRadius: 6, border: `1px solid ${yearsMet ? T.success : T.border}`,
          borderLeft: `3px solid ${yearsMet ? T.success : T.warning}`
        }}>
          <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> 체류 연한
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: yearsMet ? T.success : T.ink, fontVariantNumeric: 'tabular-nums' }}>
              {tenure}
            </span>
            <span style={{ fontSize: 11, color: T.textMute }}>년 / 기준 {tier.years}년</span>
            {yearsMet && <CheckCircle2 size={13} style={{ color: T.success, marginLeft: 'auto' }} />}
          </div>
          {!yearsMet && (
            <div style={{ fontSize: 10, color: T.warning, marginTop: 2 }}>
              {yearsRemaining < 1 ? `${Math.round(yearsRemaining * 12)}개월 후 충족` : `${yearsRemaining.toFixed(1)}년 더 필요`}
            </div>
          )}
        </div>
        
        {/* 진급 Point */}
        <div style={{ 
          padding: `${S[3]}px ${S[3]}px`, background: 'rgba(255,255,255,0.7)', 
          borderRadius: 6, border: `1px solid ${pointMet ? T.success : T.border}`,
          borderLeft: `3px solid ${pointMet ? T.success : (currentPoint == null ? T.border : T.warning)}`
        }}>
          <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Award size={11} /> 진급 Point
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: pointMet ? T.success : (currentPoint == null ? T.textLight : T.ink), fontVariantNumeric: 'tabular-nums' }}>
              {currentPoint != null ? currentPoint : '—'}
            </span>
            <span style={{ fontSize: 11, color: T.textMute }}>점 / 기준 {requiredPoint}점</span>
            {pointMet && <CheckCircle2 size={13} style={{ color: T.success, marginLeft: 'auto' }} />}
          </div>
          <div style={{ fontSize: 10, color: T.textMute, marginTop: 2 }}>
            {currentPoint == null ? '평가 점수 입력 후 자동 계산' : `종합점수 × ${policy.promotion.pointRate} 환산`}
          </div>
        </div>
        
        {/* 종합 판정 */}
        <div style={{ 
          padding: `${S[3]}px ${S[3]}px`, background: allMet ? T.success : 'rgba(255,255,255,0.7)', 
          borderRadius: 6, border: `1px solid ${allMet ? T.success : T.border}`,
          color: allMet ? '#fff' : T.ink
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4, opacity: allMet ? 0.85 : 1, color: allMet ? '#fff' : T.textMute, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={11} /> 종합 판정
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
            {allMet ? '승진 가능' : '추가 충족 필요'}
          </div>
          <div style={{ fontSize: 10, marginTop: 2, opacity: allMet ? 0.9 : 1, color: allMet ? '#fff' : T.textMute }}>
            {allMet ? '경영진 최종 결재 대기' : `${!yearsMet && !pointMet ? '연한·Point' : !yearsMet ? '체류 연한' : '진급 Point'} 충족 필요`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 평가 입력
// ============================================================
function EvaluationView({ user, employees, scores, updateScore, selfScores, comments, updateComment, policy, selectedEmp, setSelectedEmp, results, currentYear, submissions, copySelfToEvaluator, finalizeEval, projects, proposals, peerEvals }) {
  const [kpiCalcOpen, setKpiCalcOpen] = useState(false);
  const [contribCalcOpen, setContribCalcOpen] = useState(false);
  const targets = employees.filter(e => e.evalTarget);
  const current = selectedEmp ? employees.find(e => e.id === selectedEmp) : targets[0];
  if (!current) return <EmptyState icon={Users} title="평가 대상이 없습니다" desc="권한 범위 내 평가 대상자가 없습니다" />;
  const empScores = scores[current.id] || {};
  const empSelf = selfScores[current.id] || {};
  const empComments = comments[current.id] || {};
  const result = results[current.id];
  const selfSubmitted = submissions[current.id] === 'self_submitted';

  return (
    <div>
      <PageHeader 
        eyebrow="Evaluation"
        title="평가 입력"
        subtitle={`${user.role === 'admin' ? '전사' : user.deptScope} 평가 대상자 ${targets.length}명에 대해 역량·업적 평가를 입력합니다`}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: S[5] }}>
        <div style={{ ...card(), padding: 0, height: 'fit-content', position: 'sticky', top: 96 }}>
          <div style={{ 
            padding: `${S[4]}px ${S[4]}px`, borderBottom: `1px solid ${T.border}`,
            fontSize: 11, fontWeight: 600, color: T.textMute, letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            평가 대상 · {targets.length}명
          </div>
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            {targets.map(emp => {
              const r = results[emp.id]; const done = !!r?.grade; const active = current.id === emp.id;
              const hasSelf = submissions[emp.id] === 'self_submitted';
              return (
                <button key={emp.id} onClick={() => setSelectedEmp(emp.id)} style={{
                  width: '100%', padding: `${S[3]}px ${S[4]}px`, border: 'none', 
                  background: active ? T.brand : 'transparent',
                  color: active ? '#fff' : T.text, 
                  borderBottom: `1px solid ${T.divider}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                  transition: 'all 0.1s'
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.surfaceAlt; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: S[2] }}>
                      {emp.name}
                      {hasSelf && <span style={{ fontSize: 9, padding: '1px 4px', background: active ? 'rgba(255,255,255,0.2)' : T.accentSoft, color: active ? '#fff' : T.accent, borderRadius: 2, fontWeight: 700 }}>자평</span>}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{emp.position} · {emp.level}</div>
                  </div>
                  {done && <GradeBadge grade={r.grade.grade} size="sm" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ ...card(), padding: S[6] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: S[5], borderBottom: `1px solid ${T.border}`, marginBottom: S[5] }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: S[1] }}>{current.name}</div>
                <div style={{ fontSize: 13, color: T.textMute, display: 'flex', gap: S[3], flexWrap: 'wrap', alignItems: 'center' }}>
                  <span>{current.id}</span>
                  <span style={{ color: T.borderStrong }}>·</span>
                  <span>{current.dept}</span>
                  <span style={{ color: T.borderStrong }}>·</span>
                  <span>{current.position}</span>
                  <Badge color={T.brand} variant="outline" size="sm">{current.level}</Badge>
                  <Badge color={T.textMute} variant="outline" size="sm">{current.group}</Badge>
                </div>
                {selfSubmitted && (
                  <div style={{ marginTop: S[3] }}>
                    <Button variant="secondary" size="sm" icon={Sparkles} onClick={() => copySelfToEvaluator(current.id)}>
                      자기평가 점수 가져오기
                    </Button>
                  </div>
                )}
              </div>
              {result?.grade && (
                <div style={{ textAlign: 'center' }}>
                  <GradeBadge grade={result.grade.grade} size="lg" />
                  <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>
                    종합 <strong style={{ color: T.brand, fontSize: 13 }}>{result.totalScore.toFixed(1)}</strong>
                  </div>
                </div>
              )}
            </div>

            <SectionTitle accent={`가중점수 ${result?.comp != null ? result.comp.toFixed(2) : '-'} / 100`}>역량평가</SectionTitle>
            
            {/* 승진 심사 카드 (대상자만 표시) */}
            <PromotionEvalCard emp={current} policy={policy} totalScore={result?.totalScore} />
            
            {[
              { key: 'comp_expert', label: '직무 전문성', weight: policy.comp_expert, desc: '담당 직무 전문지식·기술 수준, 자격증' },
              { key: 'comp_problem', label: '문제해결력', weight: policy.comp_problem, desc: '복잡한 문제 분석·해결, 의사결정 품질' },
              { key: 'comp_learn', label: '학습·자기계발', weight: policy.comp_learn, desc: '신규 지식 습득, 교육 이수, 자격 취득' },
              { key: 'comp_collab', label: '협업·커뮤니케이션', weight: policy.comp_collab, desc: '팀워크, 보고·소통, 다면평가 반영' },
            ].map(it => <ScoreRow key={it.key} {...it} value={empScores[it.key]} selfValue={empSelf[it.key]} onChange={v => updateScore(current.id, it.key, v)} />)}
            
            <div style={{ marginTop: S[6] }}>
              <SectionTitle accent={`가중점수 ${result?.perf != null ? result.perf.toFixed(2) : '-'} / 100`}>업적평가</SectionTitle>
              
              {/* KPI 계산기 버튼 - 업적평가 상단에 안내 */}
              <div style={{ 
                marginBottom: S[4], padding: `${S[3]}px ${S[4]}px`,
                background: '#F0F7F1', borderLeft: `3px solid ${T.success}`, borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3]
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Calculator size={14} style={{ color: T.success }} />
                    <strong style={{ fontSize: 12, color: T.success }}>KPI 자동 계산기</strong>
                  </div>
                  <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>
                    {current.group} 직무군 KPI 8종의 실측값을 입력하면 자동으로 KPI 달성도 점수가 산정됩니다
                  </div>
                </div>
                <Button variant="secondary" size="sm" icon={Calculator} onClick={() => setKpiCalcOpen(true)}>
                  KPI 계산기 열기
                </Button>
              </div>
              
              {[
                { key: 'perf_kpi', label: 'KPI 달성도', weight: policy.perf_kpi, desc: '연초 설정 KPI 달성률 · 계산기 사용 권장' },
                { key: 'perf_profit', label: '프로젝트 기여도', weight: policy.perf_profit, desc: '참여 프로젝트 수익률 × 기여도 비중 · 경영지원부 데이터 연계' },
                { key: 'perf_delivery', label: '납기 준수·완성도', weight: policy.perf_delivery, desc: '계획 대비 납기, 결과물 품질' },
                { key: 'perf_customer', label: '고객 만족도·재계약', weight: policy.perf_customer, desc: '고객 평가, 재계약/추가 발주' },
              ].map(it => (
                <div key={it.key}>
                  <ScoreRow {...it} value={empScores[it.key]} selfValue={empSelf[it.key]} onChange={v => updateScore(current.id, it.key, v)} />
                  {it.key === 'perf_profit' && (
                    <div style={{ 
                      margin: `${S[2]}px 0 ${S[3]}px`, padding: `${S[2]}px ${S[3]}px`,
                      background: '#EEF3FA', borderLeft: `3px solid ${T.brand}`, borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3]
                    }}>
                      <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={13} style={{ color: T.brand, flexShrink: 0 }} />
                        프로젝트 수익성 데이터에서 기여도 점수를 자동 산정합니다 (개인 정량평가 대체)
                      </div>
                      <Button variant="secondary" size="sm" icon={Calculator} onClick={() => setContribCalcOpen(true)}>기여도 자동 산정</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* KPI 계산기 모달 */}
          {kpiCalcOpen && (
            <KPICalculatorModal 
              employee={current}
              currentScore={empScores.perf_kpi}
              projects={projects}
              currentYear={currentYear}
              onApply={(score) => { updateScore(current.id, 'perf_kpi', score); setKpiCalcOpen(false); }}
              onClose={() => setKpiCalcOpen(false)}
            />
          )}

          {/* 프로젝트 기여도 산정 모달 */}
          {contribCalcOpen && (
            <ContributionCalcModal
              employee={current}
              projects={projects}
              proposals={proposals}
              currentYear={currentYear}
              onApply={(score) => { updateScore(current.id, 'perf_profit', score); setContribCalcOpen(false); }}
              onClose={() => setContribCalcOpen(false)}
            />
          )}

          {/* 동료평가 익명 요약 (평가자·관리자 열람) */}
          {(() => {
            const raters = (peerEvals || {})[current.id] || {};
            const list = Object.values(raters).filter(r => r);
            if (list.length === 0) return null;
            const avg = (k) => (list.reduce((a, r) => a + (Number(r[k]) || 0), 0) / list.length).toFixed(1);
            const notes = [];
            list.forEach(r => { if (r.keep) notes.push({ t: '계속', v: r.keep }); if (r.change) notes.push({ t: '개선', v: r.change }); });
            return (
              <div style={{ ...card({ borderLeft: `4px solid ${T.brand}` }), padding: S[5], marginTop: S[5] }}>
                <SectionTitle>동료평가 요약 (익명 · {list.length}명 응답 · 협업 점수 판단 참고용)</SectionTitle>
                <div style={{ display: 'flex', gap: S[5], margin: `${S[3]}px 0`, flexWrap: 'wrap' }}>
                  {[['collab', '협업·소통'], ['resp', '책임감'], ['expert', '전문성 기여']].map(([k, l]) => (
                    <div key={k}><div style={{ fontSize: 11, color: T.textMute }}>{l}</div><div style={{ fontSize: 20, fontWeight: 800, color: Number(avg(k)) >= 4 ? T.success : Number(avg(k)) >= 3 ? T.warning : T.danger }}>{avg(k)}<span style={{ fontSize: 12, color: T.textLight }}>/5</span></div></div>
                  ))}
                </div>
                {notes.length > 0 && (
                  <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                    {notes.map((n, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                        <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#fff', background: n.t === '계속' ? T.success : T.warning, borderRadius: 4, padding: '1px 6px', height: 'fit-content', marginTop: 2 }}>{n.t}</span>
                        <span style={{ color: T.text }}>{n.v}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 11, color: T.textMute, marginTop: S[2] }}>작성자 비공개. 원문을 피평가자에게 직접 전달하지 말고, 면담 시 경향만 요약해 전하세요. 극단 점수는 별도 면담으로 검증하세요.</div>
              </div>
            );
          })()}

          {/* 평가 확정(2차 검토) — 절차 공정성 */}
          <div style={{ ...card(), padding: S[4], marginTop: S[5], display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3], borderLeft: `4px solid ${submissions[current.id] === 'finalized' ? T.success : T.warning}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>평가 상태: {submissions[current.id] === 'finalized' ? '확정 완료 (2차 검토 승인)' : submissions[current.id] === 'self_submitted' ? '자기평가 제출됨 · 평가자 입력/검토 중' : '자기평가 미제출'}</div>
              <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 2 }}>절차: 자기평가 제출 → 1차(평가자) 점수 입력 → 2차(관리자) 검토·확정. 확정 후 변경 시 확정 해제가 기록 관점에서 명확합니다.</div>
            </div>
            {user.role === 'admin' || user.role === 'manager' ? (
              <Button variant={submissions[current.id] === 'finalized' ? 'ghost' : 'primary'} icon={CheckCircle2} onClick={() => finalizeEval && finalizeEval(current.id)}>
                {submissions[current.id] === 'finalized' ? '확정 해제' : '평가 확정'}
              </Button>
            ) : null}
          </div>

          {/* 연초 목표(MBO) 설정 — 기초/기말 사이클 */}
          <div style={{ ...card({ borderLeft: `4px solid #0369A1` }), padding: S[6], marginTop: S[5] }}>
            <SectionTitle>연간 목표(MBO) — 연초 설정 · 기말 KPI 평가 근거</SectionTitle>
            <div style={{ fontSize: 12, color: T.textMute, margin: `${S[2]}px 0 ${S[3]}px` }}>
              연초에 담당 기능·프로젝트 목표를 구체적으로 기록해 두면, 기말 KPI 달성도·기여도 평가의 근거가 됩니다. (예: 매출 목표, 수주 건수, 결산 적시율, 프로젝트 납기 등 측정 가능한 항목)
            </div>
            <textarea
              value={empComments.mboGoal || ''}
              onChange={e => updateComment(current.id, 'mboGoal', e.target.value)}
              placeholder={'예)\n1. 담당 사업 공헌이익률 15% 이상 유지 (가중 40%)\n2. 신규 수주 2건·3억 이상 (가중 30%)\n3. 월 보고 적시 제출률 100% (가중 30%)'}
              style={{ width: '100%', minHeight: 96, padding: S[3], border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
            {empComments.mboGoal && <div style={{ fontSize: 11, color: T.success, marginTop: 4 }}>✓ 목표가 저장되었습니다 — 기말 평가 시 이 목표 대비 달성도로 KPI 점수를 매기세요</div>}
          </div>

          {(empComments.selfStrength || empComments.selfImprovement || empComments.selfGoal) && (
            <div style={{ ...card({ borderLeft: `4px solid ${T.brand}` }), padding: S[6], marginTop: S[5] }}>
              <SectionTitle>본인이 작성한 의견</SectionTitle>
              {empComments.selfStrength && <CommentDisplay label="성과·강점" text={empComments.selfStrength} />}
              {empComments.selfImprovement && <CommentDisplay label="개선점" text={empComments.selfImprovement} />}
              {empComments.selfGoal && <CommentDisplay label="내년 목표·요청" text={empComments.selfGoal} />}
            </div>
          )}
          
          <div style={{ ...card(), padding: S[6], marginTop: S[5] }}>
            <SectionTitle>평가자 의견</SectionTitle>
            <CommentField label="강점" placeholder="우수한 점·칭찬할 부분" value={empComments.strength} onChange={v => updateComment(current.id, 'strength', v)} />
            <CommentField label="개선점" placeholder="보완·발전이 필요한 부분" value={empComments.improvement} onChange={v => updateComment(current.id, 'improvement', v)} />
            <CommentField label="종합 의견" placeholder="종합 평가 의견, 차년도 기대사항" value={empComments.overall} onChange={v => updateComment(current.id, 'overall', v)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], marginTop: S[3] }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: S[2] }}>1차 평가자</label>
                <input type="text" value={empComments.evaluator1 || ''} onChange={e => updateComment(current.id, 'evaluator1', e.target.value)} 
                  placeholder="예) 이종민 부장"
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, background: T.surface, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.text, display: 'block', marginBottom: S[2] }}>2차 평가자</label>
                <input type="text" value={empComments.evaluator2 || ''} onChange={e => updateComment(current.id, 'evaluator2', e.target.value)} 
                  placeholder="예) 최영숙 이사"
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, background: T.surface, boxSizing: 'border-box', fontFamily: FONT, outline: 'none' }} />
              </div>
            </div>
            {result?.grade && (
              <Button variant="primary" icon={Printer} 
                onClick={() => printEvaluationPDF(current, result, empScores, empComments, policy, currentYear, user.role)}
                style={{ marginTop: S[5] }}>
                PDF 평가서 출력
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentDisplay({ label, text }) {
  return (
    <div style={{ marginBottom: S[3], padding: S[4], background: T.surfaceAlt, borderRadius: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.brand, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: S[1] }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{text}</div>
    </div>
  );
}

// ============================================================
// 평가 결과
// ============================================================
function ResultsView({ user, employees, results, comments, scores, selfScores, policy, currentYear, history, navigateToHistory, closeYearSnapshot }) {
  const [expandedId, setExpandedId] = useState(null);
  
  return (
    <div>
      <PageHeader 
        eyebrow="Results" 
        title="평가 결과" 
        subtitle="종합 평가 결과 일람 · 사번이나 이름을 클릭하면 평가 상세 내용이 펼쳐집니다" 
      />
      
      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              <Th>사번</Th><Th>성명</Th><Th>직위</Th><Th align="center">레벨</Th>
              <Th align="right">역량</Th><Th align="right">업적</Th><Th align="right">종합</Th>
              <Th align="center">등급</Th><Th align="right">인상률</Th><Th align="center">PDF</Th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => {
              const r = results[emp.id];
              if (!emp.evalTarget) return (
                <tr key={emp.id} style={{ background: T.surfaceAlt, color: T.textLight, borderBottom: `1px solid ${T.divider}` }}>
                  <Td><code style={{ fontSize: 11 }}>{emp.id}</code></Td>
                  <Td>{emp.name}</Td><Td>{emp.position}</Td><Td align="center">{emp.level}</Td>
                  <td colSpan="6" style={{ padding: `${S[3]}px ${S[3]}px`, textAlign: 'center', fontStyle: 'italic', fontSize: 12 }}>
                    {emp.status === 'leave' ? '휴직 (평가 보류)' : '평가 제외'}
                  </td>
                </tr>
              );
              const isExpanded = expandedId === emp.id;
              return (
                <React.Fragment key={emp.id}>
                  <tr 
                    onClick={() => setExpandedId(isExpanded ? null : emp.id)}
                    style={{ 
                      borderBottom: isExpanded ? 'none' : `1px solid ${T.divider}`, 
                      background: isExpanded ? T.surfaceAlt : (idx % 2 === 0 ? T.surface : '#FBFCFD'),
                      transition: 'background 0.15s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = T.divider; }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = idx % 2 === 0 ? T.surface : '#FBFCFD'; }}
                  >
                    <Td>
                      <code style={{ 
                        fontSize: 11, 
                        color: isExpanded ? T.brand : T.textMute,
                        fontWeight: isExpanded ? 700 : 400,
                        transition: 'color 0.15s'
                      }}>
                        {emp.id}
                      </code>
                    </Td>
                    <Td>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 6, 
                        color: isExpanded ? T.brand : T.ink, 
                        fontWeight: 600, fontSize: 13,
                        textDecoration: isExpanded ? 'none' : 'underline',
                        textDecorationColor: 'rgba(214,56,56,0.3)',
                        textDecorationThickness: 1,
                        textUnderlineOffset: 3,
                        transition: 'color 0.15s'
                      }}>
                        {emp.name}
                        <ChevronDown size={12} style={{ 
                          color: isExpanded ? T.brand : T.textMute, 
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s, color 0.15s'
                        }}/>
                      </span>
                    </Td>
                    <Td>{emp.position}</Td>
                    <Td align="center"><Badge color={T.brand} variant="outline" size="sm">{emp.level}</Badge></Td>
                    <Td align="right" mono>{r?.comp != null ? r.comp.toFixed(2) : '-'}</Td>
                    <Td align="right" mono>{r?.perf != null ? r.perf.toFixed(2) : '-'}</Td>
                    <Td align="right" mono><strong>{r?.totalScore != null ? r.totalScore.toFixed(2) : '-'}</strong></Td>
                    <Td align="center"><GradeBadge grade={r?.grade?.grade} /></Td>
                    <Td align="right" mono>{r?.grade ? `${r.grade.increase}%` : '-'}</Td>
                    <Td align="center" onClick={e => e.stopPropagation()}>
                      {r?.grade && (
                        <Button variant="ghost" size="sm" icon={Printer}
                          onClick={() => printEvaluationPDF(emp, r, scores[emp.id] || {}, comments[emp.id] || {}, policy, currentYear, user.role)}>
                          출력
                        </Button>
                      )}
                    </Td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ borderBottom: `1px solid ${T.divider}`, background: T.surfaceAlt }}>
                      <td colSpan="10" style={{ padding: 0 }}>
                        <ResultDetailPanel 
                          emp={emp}
                          result={r}
                          empScores={scores[emp.id] || {}}
                          empSelfScores={selfScores[emp.id] || {}}
                          empComments={comments[emp.id] || {}}
                          policy={policy}
                          currentYear={currentYear}
                          history={history}
                          onPrint={() => printEvaluationPDF(emp, r, scores[emp.id] || {}, comments[emp.id] || {}, policy, currentYear, user.role)}
                          navigateToHistory={navigateToHistory}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 평가 결과 상세 패널 (사번/이름 클릭 시 펼쳐짐)
// ============================================================
function ResultDetailPanel({ emp, result, empScores, empSelfScores, empComments, policy, currentYear, history, onPrint, navigateToHistory }) {
  // 평가 점수 항목 정의
  const compItems = [
    { key: 'comp_expert', label: '직무 전문성', weight: policy.comp_expert },
    { key: 'comp_problem', label: '문제해결력', weight: policy.comp_problem },
    { key: 'comp_learn', label: '학습·자기계발', weight: policy.comp_learn },
    { key: 'comp_collab', label: '협업·커뮤니케이션', weight: policy.comp_collab },
  ];
  const perfItems = [
    { key: 'perf_kpi', label: 'KPI 달성도', weight: policy.perf_kpi },
    { key: 'perf_profit', label: '프로젝트 기여도', weight: policy.perf_profit },
    { key: 'perf_delivery', label: '납기 준수·완성도', weight: policy.perf_delivery },
    { key: 'perf_customer', label: '고객 만족도·재계약', weight: policy.perf_customer },
  ];
  
  // 평가 이력 (history + 현재)
  const evalHistory = [];
  (history || []).forEach(h => {
    const g = h.gradeMap?.[emp.id];
    if (g) evalHistory.push({ year: h.year, grade: g });
  });
  if (result?.grade?.grade) {
    evalHistory.push({ year: currentYear, grade: result.grade.grade, isCurrent: true });
  }
  evalHistory.sort((a, b) => b.year - a.year);
  
  // 등급별 컬러
  const gradeColor = result?.grade ? T[result.grade.grade] : T.textMute;
  
  return (
    <div style={{ padding: `${S[5]}px ${S[6]}px`, background: T.surfaceAlt, animation: 'fadeIn 0.2s ease-out' }}>
      {/* 헤더: 아바타 + 종합 결과 요약 */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: S[5], paddingBottom: S[4], borderBottom: `1px solid ${T.border}`,
        gap: S[4], flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div style={{ 
            width: 56, height: 56, borderRadius: 10, background: gradeColor, 
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800
          }}>
            {result?.grade?.grade || '?'}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.ink }}>
              {emp.name} <span style={{ fontSize: 13, color: T.textMute, fontWeight: 500 }}>· {emp.position} · {emp.dept}</span>
            </div>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: 4, display: 'flex', alignItems: 'center', gap: S[2] }}>
              <code>{emp.id}</code>
              <span>·</span>
              <Badge color={T.brand} variant="outline" size="sm">{emp.level}</Badge>
              <span>·</span>
              <Badge color={groupColor(emp.group)} variant="solid" size="sm">{emp.group}</Badge>
              {result?.grade?.label && (
                <>
                  <span>·</span>
                  <span style={{ color: gradeColor, fontWeight: 600 }}>{result.grade.label}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: S[5], alignItems: 'center' }}>
          {/* 종합 점수 큰 표시 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              종합 점수
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.brand, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
              {result?.totalScore != null ? result.totalScore.toFixed(2) : '-'}
              <span style={{ fontSize: 14, color: T.textMute, fontWeight: 500 }}> / 100</span>
            </div>
          </div>
          
          <Button variant="primary" size="sm" icon={Printer} onClick={onPrint}>PDF 평가서 출력</Button>
        </div>
      </div>

      {/* 2단 레이아웃: 좌측 점수 세부 / 우측 의견·이력 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: S[5] }}>
        {/* 좌측: 점수 상세 */}
        <div>
          {/* 역량평가 점수 */}
          <ScoreBreakdownCard 
            title="역량평가" 
            weight={policy.weight_comp}
            totalScore={result?.comp}
            items={compItems}
            scores={empScores}
            selfScores={empSelfScores}
            accent={T.brand}
          />
          
          {/* 업적평가 점수 */}
          <div style={{ marginTop: S[4] }}>
            <ScoreBreakdownCard 
              title="업적평가" 
              weight={policy.weight_perf}
              totalScore={result?.perf}
              items={perfItems}
              scores={empScores}
              selfScores={empSelfScores}
              accent={T.success}
            />
          </div>
        </div>
        
        {/* 우측: 본인 의견 + 평가자 코멘트 + 보상 + 이력 */}
        <div>
          {/* 등급 및 보상 */}
          <div style={{ background: T.surface, borderRadius: 8, padding: S[5], marginBottom: S[4], border: `1px solid ${T.border}` }}>
            <DetailSectionTitle icon={Award}>등급 및 보상</DetailSectionTitle>
            {result?.grade ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3], fontSize: 12 }}>
                <ResultStatItem label="기본급 인상률" value={`${result.grade.increase}%`} color={T.success} />
                <ResultStatItem label="PI 계수" value={`× ${result.grade.piCoef.toFixed(1)}`} />
                <ResultStatItem label="현 월급" value={`${fmtKRW(emp.baseSalary)}원`} small />
                <ResultStatItem label="신 월급" value={`${fmtKRW(result.newSalary)}원`} color={T.brand} small />
                <ResultStatItem label="PI (성과 인센티브)" value={result.pi > 0 ? `${fmtKRW(result.pi)}원` : '-'} small />
                <ResultStatItem label="PS (이익 분배)" value={result.ps > 0 ? `${fmtKRW(result.ps)}원` : '-'} small />
              </div>
            ) : (
              <div style={{ padding: S[3], textAlign: 'center', color: T.textLight, fontSize: 12 }}>
                평가가 완료되지 않았습니다
              </div>
            )}
          </div>
          
          {/* 평가 이력 */}
          {evalHistory.length > 0 && (
            <div style={{ background: T.surface, borderRadius: 8, padding: S[5], marginBottom: S[4], border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[3] }}>
                <DetailSectionTitle icon={History} noMargin>다년도 평가 이력</DetailSectionTitle>
                <span style={{ fontSize: 10, color: T.textMute }}>클릭 시 상세 이력 보기 →</span>
              </div>
              <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
                {evalHistory.map(h => (
                  <button key={h.year} 
                    onClick={() => navigateToHistory && navigateToHistory(emp.id, h.year)}
                    style={{ 
                      padding: `${S[2]}px ${S[3]}px`, background: T.surfaceAlt, borderRadius: 6,
                      border: h.isCurrent ? `2px solid ${T.brand}` : `1px solid ${T.border}`,
                      minWidth: 70, textAlign: 'center', cursor: 'pointer',
                      fontFamily: FONT, transition: 'all 0.15s', display: 'block'
                    }}
                    onMouseEnter={e => { 
                      e.currentTarget.style.background = T.brand; 
                      e.currentTarget.style.borderColor = T.brand;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(27,58,111,0.25)';
                      const yearText = e.currentTarget.querySelector('.year-text');
                      if (yearText) yearText.style.color = 'rgba(255,255,255,0.85)';
                      const progText = e.currentTarget.querySelector('.prog-text');
                      if (progText) progText.style.color = '#fff';
                    }}
                    onMouseLeave={e => { 
                      e.currentTarget.style.background = T.surfaceAlt; 
                      e.currentTarget.style.borderColor = h.isCurrent ? T.brand : T.border;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      const yearText = e.currentTarget.querySelector('.year-text');
                      if (yearText) yearText.style.color = T.textMute;
                      const progText = e.currentTarget.querySelector('.prog-text');
                      if (progText) progText.style.color = T.brand;
                    }}
                    title={`${h.year}년 평가 이력 보기`}
                  >
                    <div className="year-text" style={{ fontSize: 10, color: T.textMute, marginBottom: 4, transition: 'color 0.15s' }}>
                      {h.year} {h.isCurrent && <span className="prog-text" style={{ color: T.brand, fontWeight: 600, transition: 'color 0.15s' }}>·진행</span>}
                    </div>
                    <GradeBadge grade={h.grade} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* 본인 의견 */}
          <CommentGroupCard 
            title="본인 의견 (자기 평가)"
            items={[
              { label: '올해의 성과·강점', value: empComments.selfStrength },
              { label: '개선하고 싶은 점', value: empComments.selfImprove },
              { label: '내년 목표·요청사항', value: empComments.selfGoal },
            ]}
          />
          
          {/* 평가자 코멘트 */}
          <div style={{ marginTop: S[4] }}>
            <CommentGroupCard 
              title="평가자 코멘트"
              items={[
                { label: '강점', value: empComments.evalStrength },
                { label: '개선 영역', value: empComments.evalImprove },
                { label: '총평·향후 기대', value: empComments.evalOverall },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 점수 세부 카드 (역량 또는 업적)
function ScoreBreakdownCard({ title, weight, totalScore, items, scores, selfScores, accent }) {
  return (
    <div style={{ background: T.surface, borderRadius: 8, padding: S[5], border: `1px solid ${T.border}` }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: S[3], paddingBottom: S[2], borderBottom: `2px solid ${accent}`
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S[2] }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{title}</span>
          <span style={{ fontSize: 11, color: T.textMute }}>가중치 {weight}%</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: accent, fontVariantNumeric: 'tabular-nums' }}>
          {totalScore != null ? totalScore.toFixed(2) : '-'}
          <span style={{ fontSize: 11, color: T.textMute, fontWeight: 500 }}> / 100</span>
        </div>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.divider}` }}>
            <th style={{ padding: '6px 4px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: T.textMute, letterSpacing: '0.05em' }}>항목</th>
            <th style={{ padding: '6px 4px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: T.textMute, letterSpacing: '0.05em', width: 50 }}>배점</th>
            <th style={{ padding: '6px 4px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: T.textMute, letterSpacing: '0.05em', width: 60 }}>자기</th>
            <th style={{ padding: '6px 4px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: T.textMute, letterSpacing: '0.05em', width: 60 }}>평가</th>
            <th style={{ padding: '6px 4px', textAlign: 'right', fontSize: 10, fontWeight: 600, color: T.textMute, letterSpacing: '0.05em', width: 70 }}>가중점수</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => {
            const selfScore = selfScores[it.key];
            const evalScore = scores[it.key];
            const weighted = evalScore != null ? (evalScore * it.weight / 100) : null;
            return (
              <tr key={it.key} style={{ borderBottom: `1px solid ${T.divider}` }}>
                <td style={{ padding: '8px 4px', color: T.text, fontSize: 12 }}>{it.label}</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: T.textMute, fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{it.weight}%</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: T.textMute, fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                  {selfScore != null ? selfScore : '-'}
                </td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: T.ink, fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {evalScore != null ? evalScore : '-'}
                </td>
                <td style={{ padding: '8px 4px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: accent, fontVariantNumeric: 'tabular-nums' }}>
                  {weighted != null ? weighted.toFixed(2) : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// 결과 통계 항목
function ResultStatItem({ label, value, color, small }) {
  return (
    <div style={{ 
      padding: small ? `${S[2]}px ${S[3]}px` : `${S[3]}px ${S[3]}px`, 
      background: T.surfaceAlt, borderRadius: 6 
    }}>
      <div style={{ fontSize: 10, color: T.textMute, marginBottom: 4 }}>{label}</div>
      <div style={{ 
        fontSize: small ? 12 : 14, fontWeight: 700, 
        color: color || T.ink, fontVariantNumeric: 'tabular-nums' 
      }}>
        {value || '-'}
      </div>
    </div>
  );
}

// 의견 표시 그룹 카드 (자기평가 또는 평가자 의견 그룹)
function CommentGroupCard({ title, items }) {
  const hasContent = items.some(it => it.value && it.value.trim());
  return (
    <div style={{ background: T.surface, borderRadius: 8, padding: S[5], border: `1px solid ${T.border}` }}>
      <DetailSectionTitle icon={MessageSquare}>{title}</DetailSectionTitle>
      {!hasContent ? (
        <div style={{ fontSize: 12, color: T.textLight, padding: `${S[2]}px 0`, fontStyle: 'italic' }}>
          작성된 내용이 없습니다
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {items.map((it, i) => it.value && (
            <div key={i}>
              <div style={{ 
                fontSize: 10, fontWeight: 600, color: T.textMute, 
                letterSpacing: '0.05em', marginBottom: 4 
              }}>
                {it.label}
              </div>
              <div style={{ 
                fontSize: 12, color: T.text, lineHeight: 1.7, 
                padding: `${S[2]}px ${S[3]}px`, background: T.surfaceAlt, borderRadius: 4,
                whiteSpace: 'pre-wrap'
              }}>
                {it.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 급여 산정
// ============================================================
function SalaryView({ employees, results, stats }) {
  return (
    <div>
      <PageHeader eyebrow="Compensation" title="급여 산정" subtitle="기본급 + 직책수당 + 식대·차량유지비 + 자격수당 + PI + PS 통합 산정" />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4], marginBottom: S[6] }}>
        <MetricCard icon={Wallet} label="2025 총 인건비" value={fmtMan(stats.total2025)} unit="원" sub="연간" />
        <MetricCard icon={Wallet} label="2026 총 인건비" value={fmtMan(stats.total2026)} unit="원" sub="연간 예상" color={T.brand} />
        <MetricCard icon={TrendingUp} label="증감액" value={(stats.delta >= 0 ? '+' : '') + fmtMan(stats.delta)} unit="원" color={stats.delta >= 0 ? T.success : T.danger} />
        <MetricCard icon={TrendingUp} label="증감률" value={(stats.deltaPct >= 0 ? '+' : '') + stats.deltaPct.toFixed(2)} unit="%" color={stats.deltaPct >= 0 ? T.success : T.danger} />
      </div>
      
      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              <Th>성명</Th><Th>직위</Th><Th align="center">등급</Th>
              <Th align="right">현 월급</Th><Th align="center">인상</Th>
              <Th align="right">신 월급</Th><Th align="right">직책</Th>
              <Th align="right">식대·차량</Th><Th align="right">자격</Th>
              <Th align="right">PI</Th><Th align="right">PS</Th>
              <Th align="right">총보상(연)</Th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => {
              const r = results[emp.id];
              return (
                <tr key={emp.id} style={{ borderBottom: `1px solid ${T.divider}`, background: r?.isExcluded ? T.surfaceAlt : (idx % 2 === 0 ? T.surface : '#FBFCFD'), color: r?.isExcluded ? T.textMute : T.text }}>
                  <Td><strong style={{ color: T.ink }}>{emp.name}</strong></Td>
                  <Td>{emp.position}</Td>
                  <Td align="center">
                    {r?.grade ? <GradeBadge grade={r.grade.grade} size="sm" /> : <span style={{ fontSize: 11, color: T.textLight }}>{emp.status === 'leave' ? '휴직' : '제외'}</span>}
                  </Td>
                  <Td align="right" mono>{fmtKRW(emp.baseSalary)}</Td>
                  <Td align="center" mono>{r?.grade ? `${r.increase}%` : '-'}</Td>
                  <Td align="right" mono><strong>{fmtKRW(r?.newSalary)}</strong></Td>
                  <Td align="right" mono>{emp.allowance > 0 ? fmtKRW(emp.allowance) : '-'}</Td>
                  <Td align="right" mono>{emp.mealCar > 0 ? fmtKRW(emp.mealCar) : '-'}</Td>
                  <Td align="right" mono>{emp.qualif > 0 ? fmtKRW(emp.qualif) : '-'}</Td>
                  <Td align="right" mono>{r?.pi > 0 ? fmtKRW(r.pi) : '-'}</Td>
                  <Td align="right" mono>{r?.ps > 0 ? fmtKRW(r.ps) : '-'}</Td>
                  <Td align="right" mono><strong style={{ color: T.brand }}>{fmtKRW(r?.totalComp2026)}</strong></Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 통계 분석
// ============================================================
function AnalyticsView({ employees, results, policy, stats }) {
  const deptData = useMemo(() => {
    const map = {};
    employees.filter(e => e.evalTarget).forEach(e => {
      const r = results[e.id];
      if (!map[e.dept]) map[e.dept] = { name: e.dept, count: 0, total: 0, S: 0, A: 0, B: 0, C: 0, D: 0 };
      map[e.dept].count++;
      if (r?.totalScore != null) map[e.dept].total += r.totalScore;
      if (r?.grade) map[e.dept][r.grade.grade]++;
    });
    return Object.values(map).map(d => ({ ...d, avg: d.count > 0 ? (d.total / d.count) : 0 }));
  }, [employees, results]);

  const gradePieData = policy.grades.map(g => ({
    name: g.grade, value: stats.gradeCount[g.grade] || 0, grade: g.grade
  })).filter(d => d.value > 0);

  return (
    <div>
      <PageHeader eyebrow="Analytics" title="통계 분석" subtitle="부서별·직무군별·레벨별 평가 결과 및 보상 분포 분석" />
      
      {user.role === 'admin' && (
        <div className="no-print" style={{ ...card({ borderLeft: `4px solid ${T.brand}` }), padding: S[4], marginBottom: S[5], display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3], flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{currentYear}년 평가 확정 스냅샷</div>
            <div style={{ fontSize: 11.5, color: T.textMute, marginTop: 2 }}>
              확정 시 현재 점수·등급·정책·목표(MBO)·동료평가가 연도 이력으로 고정 저장됩니다 (이의신청·차년도 비교 근거).
              {(history || []).some(h => Number(h.year) === Number(currentYear)) && <strong style={{ color: T.success }}> · 이미 {currentYear}년 스냅샷 있음(재실행 시 갱신)</strong>}
            </div>
          </div>
          <Button variant="primary" icon={CheckCircle2} onClick={() => { if (window.confirm(`${currentYear}년 평가를 확정 스냅샷으로 저장할까요?\n(재실행하면 기존 ${currentYear}년 스냅샷을 덮어씁니다)`)) closeYearSnapshot && closeYearSnapshot(); }}>연말 확정 스냅샷 저장</Button>
        </div>
      )}

      {(() => {
        const low = (employees || []).filter(e => e.evalTarget !== false && results[e.id]?.total != null && (results[e.id].total < 60 || results[e.id]?.grade?.grade === 'D'));
        if (low.length === 0) return null;
        return (
          <div style={{ ...card({ borderLeft: `4px solid ${T.danger}` }), padding: S[6], marginBottom: S[5] }}>
            <SectionTitle>저성과 관리(PIP) 검토 대상 · {low.length}명</SectionTitle>
            <div style={{ overflow: 'auto', marginTop: S[3] }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 520 }}>
                <thead><tr style={{ background: T.surfaceAlt }}><Th>직원</Th><Th>부서</Th><Th align="center">종합점수</Th><Th align="center">등급</Th><Th>권고 절차</Th></tr></thead>
                <tbody>
                  {low.map((e, i) => (
                    <tr key={i}>
                      <Td><strong>{e.name}</strong> <span style={{ fontSize: 10, color: T.textMute }}>{e.position}</span></Td>
                      <Td style={{ fontSize: 11, color: T.textMute }}>{shortName(e.dept)}</Td>
                      <Td align="center" mono>{Math.round(results[e.id].total)}</Td>
                      <Td align="center"><GradeBadge grade={results[e.id]?.grade?.grade} size="sm" /></Td>
                      <Td style={{ fontSize: 11.5 }}>① 면담·원인 파악 → ② 3개월 개선목표 서면 부여 → ③ 월 점검 기록 → ④ 재평가 후 인사조치 검토</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: S[3], fontSize: 11.5, color: T.textMute, lineHeight: 1.7 }}>
              근로기준법상 해고는 정당한 사유와 절차(개선 기회 부여·기록·서면 통지)가 요구됩니다. 위 절차를 문서화(면담일지·개선계획서·월 점검표)해 두면 인사조치 시 법적 리스크를 줄일 수 있습니다. 개선목표는 연간 목표(MBO) 입력란에 기록해 관리하세요.
            </div>
          </div>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5], marginBottom: S[5] }}>
        <div style={{ ...card(), padding: S[6] }}>
          <SectionTitle>등급 분포</SectionTitle>
          {gradePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={gradePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} 
                  label={({ name, value }) => `${name} · ${value}명`}>
                  {gradePieData.map(d => <Cell key={d.grade} fill={T[d.grade]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState icon={PieIcon} title="데이터 없음" desc="평가 입력 후 표시됩니다" />}
        </div>
        
        <div style={{ ...card(), padding: S[6] }}>
          <SectionTitle>부서별 평균 점수</SectionTitle>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptData} margin={{ top: 20, right: 20, left: -10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
                <XAxis dataKey="name" angle={-25} textAnchor="end" height={70} tick={{ fontSize: 11, fill: T.textMute }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: T.textMute }} />
                <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13 }} />
                <Bar dataKey="avg" name="평균 점수" fill={T.brand} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState icon={BarChart3} title="데이터 없음" desc="평가 입력 후 표시됩니다" />}
        </div>
      </div>
      
      <div style={{ ...card(), padding: S[6] }}>
        <SectionTitle>부서별 등급 분포</SectionTitle>
        {deptData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={deptData} margin={{ top: 20, right: 20, left: -10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={70} tick={{ fontSize: 11, fill: T.textMute }} />
              <YAxis tick={{ fontSize: 11, fill: T.textMute }} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="S" stackId="a" fill={T.S} />
              <Bar dataKey="A" stackId="a" fill={T.A} />
              <Bar dataKey="B" stackId="a" fill={T.B} />
              <Bar dataKey="C" stackId="a" fill={T.C} />
              <Bar dataKey="D" stackId="a" fill={T.D} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <EmptyState icon={BarChart3} title="데이터 없음" desc="평가 입력 후 표시됩니다" />}
      </div>
    </div>
  );
}

// ============================================================
// 다년도 이력
// ============================================================
function HistoryView({ history, employees, results, currentYear, highlight }) {
  const highlightRowRef = useRef(null);
  
  // highlight 변경 시 해당 행으로 스크롤
  useEffect(() => {
    if (highlight?.empId && highlightRowRef.current) {
      setTimeout(() => {
        highlightRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlight]);
  
  const trendData = useMemo(() => {
    const all = [...history];
    const currentGradeMap = {};
    employees.forEach(e => { const g = results[e.id]?.grade?.grade; if (g) currentGradeMap[e.id] = g; });
    if (Object.keys(currentGradeMap).length > 0) all.push({ year: currentYear, gradeMap: currentGradeMap, isCurrent: true });
    return all.sort((a, b) => a.year - b.year).map(h => {
      const counts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
      Object.values(h.gradeMap || {}).forEach(g => counts[g]++);
      return { year: h.year + (h.isCurrent ? ' (진행)' : ''), ...counts };
    });
  }, [history, employees, results, currentYear]);

  const employeeTrend = useMemo(() => {
    const allYears = [...history.map(h => h.year), currentYear].sort();
    return employees.filter(e => e.evalTarget || history.some(h => h.gradeMap?.[e.id])).map(emp => {
      const trend = {};
      history.forEach(h => { trend[h.year] = h.gradeMap?.[emp.id] || '-'; });
      trend[currentYear] = results[emp.id]?.grade?.grade || '-';
      return { ...emp, trend, years: allYears };
    });
  }, [history, employees, results, currentYear]);

  const gradeOrder = { S: 5, A: 4, B: 3, C: 2, D: 1, '-': 0 };

  return (
    <div>
      <PageHeader eyebrow="History" title="다년도 평가 이력" subtitle={`저장된 이력 ${history.length}개년의 추이 분석`} />
      
      <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
        <SectionTitle>연도별 등급 분포 추이</SectionTitle>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={trendData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.divider} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: T.textMute }} />
              <YAxis tick={{ fontSize: 11, fill: T.textMute }} />
              <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="S" stackId="a" fill={T.S} />
              <Bar dataKey="A" stackId="a" fill={T.A} />
              <Bar dataKey="B" stackId="a" fill={T.B} />
              <Bar dataKey="C" stackId="a" fill={T.C} />
              <Bar dataKey="D" stackId="a" fill={T.D} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <EmptyState icon={History} title="이력 없음" desc="평가 마감 후 이력이 누적됩니다" />}
      </div>

      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <div style={{ padding: S[5] }}>
          <SectionTitle>직원별 등급 추이</SectionTitle>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              <Th>성명</Th><Th>부서</Th><Th>직위</Th>
              {employeeTrend[0]?.years.map(y => (
                <Th key={y} align="center">{y === currentYear ? `${y} (진행)` : y}</Th>
              ))}
              <Th align="center">추이</Th>
            </tr>
          </thead>
          <tbody>
            {employeeTrend.map(emp => {
              const grades = emp.years.map(y => emp.trend[y]);
              const valid = grades.filter(g => g !== '-');
              let icon = '—', color = T.textLight;
              if (valid.length >= 2) {
                const first = gradeOrder[valid[0]], last = gradeOrder[valid[valid.length - 1]];
                if (last > first) { icon = '↑'; color = T.success; }
                else if (last < first) { icon = '↓'; color = T.danger; }
                else { icon = '→'; color = T.brand; }
              }
              const isHighlighted = highlight?.empId === emp.id;
              return (
                <tr key={emp.id} 
                  ref={isHighlighted ? highlightRowRef : null}
                  style={{ 
                    borderBottom: `1px solid ${T.divider}`,
                    background: isHighlighted ? 'rgba(214,56,56,0.06)' : 'transparent',
                    transition: 'background 0.3s',
                    outline: isHighlighted ? `2px solid ${T.accent}` : 'none',
                    outlineOffset: isHighlighted ? '-2px' : '0',
                  }}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isHighlighted && (
                        <span style={{ 
                          fontSize: 9, fontWeight: 700, color: '#fff', 
                          background: T.accent, padding: '2px 6px', borderRadius: 3,
                          letterSpacing: '0.05em'
                        }}>
                          선택됨
                        </span>
                      )}
                      <strong style={{ color: isHighlighted ? T.accent : T.ink }}>{emp.name}</strong>
                    </div>
                  </Td>
                  <Td>{emp.dept}</Td><Td>{emp.position}</Td>
                  {emp.years.map(y => {
                    const isHighlightYear = isHighlighted && highlight?.year === y;
                    return (
                      <Td key={y} align="center">
                        <div style={isHighlightYear ? { 
                          display: 'inline-block', padding: 2, background: T.accent, 
                          borderRadius: 5, transition: 'all 0.2s'
                        } : {}}>
                          {emp.trend[y] !== '-' ? <GradeBadge grade={emp.trend[y]} size="sm" /> : <span style={{ color: T.textLight, fontSize: 11 }}>-</span>}
                        </div>
                      </Td>
                    );
                  })}
                  <Td align="center"><span style={{ fontSize: 18, fontWeight: 700, color }}>{icon}</span></Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 이메일 통보
// ============================================================
function NotifyView({ employees, results, currentYear }) {
  const [selected, setSelected] = useState([]);
  const targets = employees.filter(e => e.evalTarget && results[e.id]?.grade);

  const generateBody = (emp) => {
    const r = results[emp.id];
    return `안녕하세요 ${emp.name}님,\n\n${currentYear}년 정기 인사평가 결과를 안내드립니다.\n\n▶ 평가 등급: ${r.grade.grade} (${r.grade.label})\n▶ 종합 점수: ${r.totalScore.toFixed(2)} / 100점\n\n▶ ${currentYear + 1}년 보상 산정\n  · 기본급 인상률: ${r.increase}%\n  · 신규 월 기본급: ${fmtKRW(r.newSalary)}원\n  · PI: ${r.pi > 0 ? fmtKRW(r.pi) + '원' : '해당없음'}\n  · PS: ${r.ps > 0 ? fmtKRW(r.ps) + '원' : '해당없음'}\n  · 연간 총 보상: ${fmtKRW(r.totalComp2026)}원\n\n이의신청은 통보일로부터 7일 이내에 가능합니다.\n\n주식회사 코이션 인사담당`;
  };

  const sendOne = (emp) => {
    window.location.href = `mailto:${emp.email}?subject=${encodeURIComponent(`[코이션] ${currentYear}년 인사평가 결과 통보 - ${emp.name}님`)}&body=${encodeURIComponent(generateBody(emp))}`;
  };

  return (
    <div>
      <PageHeader eyebrow="Notify" title="이메일 통보" subtitle="평가 결과 통보 메일을 생성합니다 (mailto: 링크)" />
      
      <div style={{ ...card(), padding: S[5], marginBottom: S[5] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14 }}>
            <strong style={{ color: T.brand }}>{selected.length}명</strong>
            <span style={{ color: T.textMute }}> 선택됨 / 전체 {targets.length}명</span>
          </div>
          <div style={{ display: 'flex', gap: S[2] }}>
            <Button variant="outline" size="sm" onClick={() => setSelected(targets.map(e => e.id))}>전체 선택</Button>
            <Button variant="outline" size="sm" onClick={() => setSelected([])}>선택 해제</Button>
            <Button variant="primary" size="sm" icon={Mail} disabled={selected.length === 0}
              onClick={() => {
                if (!confirm(`${selected.length}명에게 메일을 발송합니다.`)) return;
                selected.forEach((id, i) => {
                  const emp = targets.find(e => e.id === id);
                  if (emp) setTimeout(() => sendOne(emp), i * 500);
                });
              }}>
              선택 발송
            </Button>
          </div>
        </div>
      </div>
      
      <div style={{ ...card(), padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              <Th align="center">
                <input type="checkbox" checked={selected.length === targets.length && targets.length > 0} 
                  onChange={e => setSelected(e.target.checked ? targets.map(emp => emp.id) : [])} />
              </Th>
              <Th>성명</Th><Th>부서</Th><Th>이메일</Th>
              <Th align="center">등급</Th><Th align="center">발송</Th>
            </tr>
          </thead>
          <tbody>
            {targets.map((emp, idx) => (
              <tr key={emp.id} style={{ 
                borderBottom: `1px solid ${T.divider}`, 
                background: selected.includes(emp.id) ? T.surfaceAlt : (idx % 2 === 0 ? T.surface : '#FBFCFD')
              }}>
                <Td align="center">
                  <input type="checkbox" checked={selected.includes(emp.id)} 
                    onChange={() => setSelected(prev => prev.includes(emp.id) ? prev.filter(x => x !== emp.id) : [...prev, emp.id])} />
                </Td>
                <Td><strong style={{ color: T.ink }}>{emp.name}</strong></Td>
                <Td>{emp.dept}</Td>
                <Td><code style={{ fontSize: 11, color: T.textMute }}>{emp.email}</code></Td>
                <Td align="center"><GradeBadge grade={results[emp.id].grade.grade} size="sm" /></Td>
                <Td align="center"><Button variant="secondary" size="sm" icon={Mail} onClick={() => sendOne(emp)}>발송</Button></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// 정책 설정
// ============================================================
function PolicyView({ policy, setPolicy }) {
  const [rubricTab, setRubricTab] = useState('comp');
  const [expandedKey, setExpandedKey] = useState('comp_expert');
  const up = (k, v) => setPolicy(prev => ({ ...prev, [k]: v }));
  const upDiag = (k, v) => setPolicy(prev => ({ ...prev, diag: { ...(prev.diag || {}), [k]: Number(v) } }));
  const upG = (i, k, v) => setPolicy(prev => ({ ...prev, grades: prev.grades.map((g, idx) => idx === i ? { ...g, [k]: Number(v) } : g) }));
  
  return (
    <div>
      <PageHeader eyebrow="Policy" title="정책 설정" subtitle="평가 가중치, 등급 기준, 보상 정책을 회사 방침에 맞게 조정" />
      
      {/* ========== 평가 척도 기준표 (Rubric) ========== */}
      <div style={{ ...card({ borderLeft: `4px solid ${T.brand}` }), padding: S[6], marginBottom: S[6] }}>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
          marginBottom: S[5], paddingBottom: S[4], borderBottom: `1px solid ${T.border}`,
          gap: S[4], flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ 
              fontSize: 11, fontWeight: 600, color: T.brand, 
              letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: S[1] 
            }}>
              Rubric · 평가 척도 기준표
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>
              항목별 점수 판단 기준
            </h2>
            <div style={{ fontSize: 12, color: T.textMute, marginTop: S[1] }}>
              각 평가 항목의 점수 구간별 행동 기준 및 정량 척도 — 평가자 참고용
            </div>
          </div>
          
          {/* 탭 전환 (역량/업적) */}
          <div style={{ display: 'flex', gap: 0, border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            {[{ id: 'comp', label: '역량평가' }, { id: 'perf', label: '업적평가' }].map(t => (
              <button key={t.id} 
                onClick={() => { 
                  setRubricTab(t.id); 
                  setExpandedKey(RUBRICS[t.id][0].key); 
                }} 
                style={{
                  padding: '8px 20px', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  background: rubricTab === t.id ? T.brand : T.surface, 
                  color: rubricTab === t.id ? '#fff' : T.text,
                  fontFamily: FONT, transition: 'all 0.15s'
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 아코디언 형태로 각 평가 항목 표시 */}
        {RUBRICS[rubricTab].map(item => {
          const isOpen = expandedKey === item.key;
          return (
            <div key={item.key} style={{ marginBottom: S[3] }}>
              {/* 헤더 행 (클릭 시 펼쳐짐) */}
              <button onClick={() => setExpandedKey(isOpen ? null : item.key)} style={{
                width: '100%', padding: `${S[3]}px ${S[4]}px`, 
                background: isOpen ? T.brand : T.surfaceAlt,
                color: isOpen ? '#fff' : T.ink, 
                border: `1px solid ${isOpen ? T.brand : T.border}`, 
                borderRadius: isOpen ? '6px 6px 0 0' : '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = T.divider; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = T.surfaceAlt; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flex: 1, minWidth: 0 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 11, opacity: isOpen ? 0.85 : 0.65 }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
                  {/* 등급 미니 인디케이터 (접혔을 때만) */}
                  {!isOpen && item.bands.map(b => (
                    <span key={b.range} style={{ 
                      width: 22, height: 22, background: T[b.grade], 
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: 10, fontWeight: 700, color: '#fff', borderRadius: 3
                    }}>
                      {b.label[0]}
                    </span>
                  ))}
                  <ChevronRight 
                    size={16} 
                    style={{ 
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.2s' 
                    }} 
                  />
                </div>
              </button>

              {/* 펼쳐진 척도 테이블 */}
              {isOpen && (
                <div style={{ 
                  border: `1px solid ${T.brand}`, 
                  borderTop: 'none', 
                  borderRadius: '0 0 6px 6px',
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: T.surfaceAlt }}>
                        <th style={{ 
                          padding: `${S[3]}px ${S[3]}px`, textAlign: 'center', 
                          fontSize: 11, fontWeight: 600, color: T.textMute, 
                          letterSpacing: '0.05em', textTransform: 'uppercase',
                          width: 100, borderRight: `1px solid ${T.border}`,
                          borderBottom: `1px solid ${T.border}`
                        }}>
                          점수 구간
                        </th>
                        <th style={{ 
                          padding: `${S[3]}px ${S[3]}px`, textAlign: 'center', 
                          fontSize: 11, fontWeight: 600, color: T.textMute, 
                          letterSpacing: '0.05em', textTransform: 'uppercase',
                          width: 90, borderRight: `1px solid ${T.border}`,
                          borderBottom: `1px solid ${T.border}`
                        }}>
                          등급
                        </th>
                        <th style={{ 
                          padding: `${S[3]}px ${S[4]}px`, textAlign: 'left', 
                          fontSize: 11, fontWeight: 600, color: T.textMute, 
                          letterSpacing: '0.05em', textTransform: 'uppercase',
                          borderBottom: `1px solid ${T.border}`
                        }}>
                          행동 기준 및 정량 척도
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.bands.map((b, bi) => (
                        <tr key={b.range} style={{ 
                          borderTop: bi > 0 ? `1px solid ${T.divider}` : 'none', 
                          background: bi % 2 === 0 ? T.surface : '#FBFCFD' 
                        }}>
                          <td style={{ 
                            padding: `${S[3]}px ${S[3]}px`, textAlign: 'center',
                            fontVariantNumeric: 'tabular-nums', fontWeight: 700, 
                            color: T[b.grade], borderRight: `1px solid ${T.divider}`, 
                            whiteSpace: 'nowrap', fontSize: 13
                          }}>
                            {b.range}
                          </td>
                          <td style={{ 
                            padding: `${S[3]}px ${S[3]}px`, textAlign: 'center',
                            borderRight: `1px solid ${T.divider}` 
                          }}>
                            <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: 6, 
                              flexDirection: 'column' 
                            }}>
                              <GradeBadge grade={b.grade} size="sm" />
                              <span style={{ fontSize: 10, color: T[b.grade], fontWeight: 600 }}>
                                {b.label}
                              </span>
                            </span>
                          </td>
                          <td style={{ 
                            padding: `${S[3]}px ${S[4]}px`, 
                            lineHeight: 1.7, color: T.text, fontSize: 12.5 
                          }}>
                            {b.criteria}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* 평가자 유의사항 */}
                  <div style={{ 
                    padding: `${S[3]}px ${S[4]}px`, 
                    background: '#FFF8E6', 
                    borderTop: `1px solid ${T.border}`, 
                    fontSize: 11, color: T.text, lineHeight: 1.7,
                    display: 'flex', alignItems: 'flex-start', gap: S[2]
                  }}>
                    <AlertCircle size={14} style={{ color: T.warning, flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <strong style={{ color: T.warning }}>평가자 유의사항:</strong>{' '}
                      점수는 해당 구간의 기준을 종합적으로 판단하여 부여합니다. 
                      단일 사례보다 기간 내 일관된 행동 패턴을 기준으로 평가하며,{' '}
                      <strong>관찰 가능한 행동과 정량 실적</strong>에 근거해야 합니다. 
                      헤일로 효과(halo effect) 및 관대화·가혹화 오류에 주의하십시오.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========== KPI 정량 측정 지표 ========== */}
      <KPIMetricsSection />
      
      {/* ========== 로그인 화면 회사 정보 카드 편집 ========== */}
      <CoverStatsEditor policy={policy} setPolicy={setPolicy} />
      
      {/* ========== 로그인 화면 표지 이미지 편집 ========== */}
      <CoverImageEditor policy={policy} setPolicy={setPolicy} />
      
      {/* ========== 승진 정책 편집 ========== */}
      <PromotionPolicyEditor policy={policy} setPolicy={setPolicy} />
      
      {/* ========== 기존 정책 입력 영역 (배점·가중치) ========== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5], marginBottom: S[5] }}>
        <PolicySection title="역량평가 배점" sumK={['comp_expert', 'comp_problem', 'comp_learn', 'comp_collab']} policy={policy}>
          <PolicyInput label="직무 전문성" value={policy.comp_expert} onChange={v => up('comp_expert', v)} />
          <PolicyInput label="문제해결력" value={policy.comp_problem} onChange={v => up('comp_problem', v)} />
          <PolicyInput label="학습·자기계발" value={policy.comp_learn} onChange={v => up('comp_learn', v)} />
          <PolicyInput label="협업·커뮤니케이션" value={policy.comp_collab} onChange={v => up('comp_collab', v)} />
        </PolicySection>
        <PolicySection title="업적평가 배점" sumK={['perf_kpi', 'perf_profit', 'perf_delivery', 'perf_customer']} policy={policy}>
          <PolicyInput label="KPI 달성도" value={policy.perf_kpi} onChange={v => up('perf_kpi', v)} />
          <PolicyInput label="프로젝트 기여도" value={policy.perf_profit} onChange={v => up('perf_profit', v)} />
          <PolicyInput label="납기·완성도" value={policy.perf_delivery} onChange={v => up('perf_delivery', v)} />
          <PolicyInput label="고객 만족도" value={policy.perf_customer} onChange={v => up('perf_customer', v)} />
        </PolicySection>
        <PolicySection title="프로젝트 기여 산정 기준 (기여점수 규칙)" policy={policy}>
          <PolicyInput label="수행 기여 가중(%)" value={policy.contrib_exec_w} onChange={v => up('contrib_exec_w', v)} />
          <PolicyInput label="수주 기여 가중(%)" value={policy.contrib_bid_w} onChange={v => up('contrib_bid_w', v)} />
          <PolicyInput label="수행 인정 최소 참여율(%)" value={policy.contrib_core_min} onChange={v => up('contrib_core_min', v)} />
          <PolicyInput label="다축 기여 보너스(점)" value={policy.contrib_bonus_multi} onChange={v => up('contrib_bonus_multi', v)} />
          <PolicyInput label="겸직 보너스(점)" value={policy.contrib_bonus_jikjik} onChange={v => up('contrib_bonus_jikjik', v)} />
          <PolicyInput label="영업 기본점수(수주 0)" value={policy.contrib_sales_floor} onChange={v => up('contrib_sales_floor', v)} />
          <PolicyInput label="수주 역할가중 — PM(%)" value={policy.contrib_bid_pm_w} onChange={v => up('contrib_bid_pm_w', v)} />
          <PolicyInput label="수주 역할가중 — 제안참여(%)" value={policy.contrib_bid_part_w} onChange={v => up('contrib_bid_part_w', v)} />
          <PolicyInput label="수주 역할가중 — 서류·지원(%)" value={policy.contrib_bid_supp_w} onChange={v => up('contrib_bid_supp_w', v)} />
          <div style={{ gridColumn: '1 / -1', fontSize: 11.5, color: T.textMute, lineHeight: 1.6 }}>
            기여점수 = 수행점수×수행가중 + 수주점수×수주가중 (합 100 권장) + 보너스(100점 상한). 참여율이 최소 참여율 미만이면 수행 기여로 인정하지 않고 수주 기여로만 평가합니다. 수주 역할가중: 수주 확정 제안에서 PM·제안참여·서류지원 인력이 받는 수주 점수의 비율(예: PM 100% / 참여 60% / 지원 30%). 서류·지원 인력은 제안현황의 제안참여인력 칸에 이름을 넣으면 참여 가중, 별도 지원 명단이 있으면 지원 가중이 적용됩니다. 완료 사업은 확정 수익률, 진행중 사업은 진행기준 수익률로 산정됩니다. 변경 시 전 직원 기여점수에 즉시 반영되므로 평가 기간 중 변경은 지양하세요.
          </div>
        </PolicySection>
        <PolicySection title="종합 가중치" sumK={['weight_comp', 'weight_perf']} policy={policy}>
          <PolicyInput label="역량평가" value={policy.weight_comp} onChange={v => up('weight_comp', v)} />
          <PolicyInput label="업적평가" value={policy.weight_perf} onChange={v => up('weight_perf', v)} />
        </PolicySection>
        <PolicySection title="PS (Profit Sharing)">
          <PolicyInput label="2026 PS 지급률" value={policy.psRate} onChange={v => up('psRate', v)} step="0.1" />
          <div style={{ fontSize: 11, color: T.textMute, marginTop: S[3], lineHeight: 1.8, padding: S[3], background: T.surfaceAlt, borderRadius: 4 }}>
            영업이익 달성률 기준:<br/>· 120% 이상 → 10%<br/>· 100~119% → 5%<br/>· 80~99% → 2%<br/>· 80% 미만 → 0%
          </div>
        </PolicySection>
      </div>

      {/* ========== 프로젝트 원가 진단 기준 ========== */}
      {(() => { const d = policy.diag || INITIAL_POLICY.diag; const tg = policy.targets || INITIAL_POLICY.targets; return (
      <div style={{ ...card({ borderLeft: `4px solid ${T.warning}` }), padding: S[6], marginBottom: S[5] }}>
        <SectionTitle>연간 경영 목표 · 프로젝트 원가 진단 기준</SectionTitle>
        <div style={{ fontSize: 11, color: T.textMute, marginBottom: S[4] }}>
          연간 매출·영업이익 목표와, 프로젝트 수익성 → 지출 분석에서 사용하는 경고 임계값·PM 최소 기여도입니다.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4], marginBottom: S[4] }}>
          <div><label style={{ fontSize: 11, fontWeight: 600, color: T.textMute, display: 'block', marginBottom: 4 }}>연간 매출 목표(원)</label>
            <input type="number" value={policy.targets?.revenue ?? 0} onChange={e => setPolicy(prev => ({ ...prev, targets: { ...(prev.targets || {}), revenue: Number(e.target.value) || 0 } }))} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, boxSizing: 'border-box', textAlign: 'right' }} /></div>
          <div><label style={{ fontSize: 11, fontWeight: 600, color: T.textMute, display: 'block', marginBottom: 4 }}>연간 영업이익 목표(원)</label>
            <input type="number" value={policy.targets?.profit ?? 0} onChange={e => setPolicy(prev => ({ ...prev, targets: { ...(prev.targets || {}), profit: Number(e.target.value) || 0 } }))} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, boxSizing: 'border-box', textAlign: 'right' }} /></div>
          <div><label style={{ fontSize: 11, fontWeight: 600, color: T.textMute, display: 'block', marginBottom: 4 }}>공통비 배부 기준</label>
            <select value={policy.allocation?.basis || 'labor'} onChange={e => setPolicy(prev => ({ ...prev, allocation: { ...(prev.allocation || {}), basis: e.target.value } }))} style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, boxSizing: 'border-box' }}>
              <option value="labor">직접인건비 기준</option><option value="revenue">매출 기준</option><option value="none">미배부</option>
            </select></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
          <PolicyInput label="제경비/원가 주의(%)" value={d.ohWarn} onChange={v => upDiag('ohWarn', v)} />
          <PolicyInput label="제경비/원가 경고(%)" value={d.ohAlert} onChange={v => upDiag('ohAlert', v)} />
          <PolicyInput label="인건비/매출 주의(%)" value={d.laborRevWarn} onChange={v => upDiag('laborRevWarn', v)} />
          <PolicyInput label="인건비/매출 경고(%)" value={d.laborRevAlert} onChange={v => upDiag('laborRevAlert', v)} />
          <PolicyInput label="원가율 주의(%)" value={d.costRevWarn} onChange={v => upDiag('costRevWarn', v)} />
          <PolicyInput label="원가율 경고(%)" value={d.costRevAlert} onChange={v => upDiag('costRevAlert', v)} />
          <PolicyInput label="동종 중앙값 초과폭(%p)" value={d.peerDev} onChange={v => upDiag('peerDev', v)} />
          <PolicyInput label="PM 최소 기여도(%)" value={d.pmFloor} onChange={v => upDiag('pmFloor', v)} />
        </div>
        <div style={{ fontSize: 11, color: T.textMute, marginTop: S[4], padding: S[3], background: T.surfaceAlt, borderRadius: 4, lineHeight: 1.8 }}>
          · 제경비/원가·인건비/매출·원가율이 임계값을 넘거나, 동종 프로젝트 중앙값 +초과폭(%p)을 넘으면 과다로 진단합니다.<br />
          · PM 최소 기여도: 사업관리 엑셀 업로드로 기여도 자동 산정 시 PM(사업담당자)에게 보장하는 하한값입니다.
        </div>
      </div>
      ); })()}

      <div style={{ ...card(), padding: S[6], marginBottom: S[5] }}>
        <SectionTitle>등급 기준 및 보상</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: T.surfaceAlt }}>
              <Th align="center">등급</Th><Th>설명</Th>
              <Th align="right">최소</Th><Th align="right">최대</Th>
              <Th align="right">권장 분포(%)</Th>
              <Th align="right">인상률(%)</Th><Th align="right">PI 계수</Th>
            </tr>
          </thead>
          <tbody>
            {policy.grades.map((g, i) => (
              <tr key={g.grade} style={{ borderBottom: `1px solid ${T.divider}` }}>
                <Td align="center"><GradeBadge grade={g.grade} /></Td>
                <Td>{g.label}</Td>
                <Td align="right"><MiniInput value={g.min} onChange={v => upG(i, 'min', v)} /></Td>
                <Td align="right"><MiniInput value={g.max} onChange={v => upG(i, 'max', v)} /></Td>
                <Td align="right"><MiniInput value={g.dist} onChange={v => upG(i, 'dist', v)} /></Td>
                <Td align="right"><MiniInput value={g.increase} onChange={v => upG(i, 'increase', v)} step="0.1" /></Td>
                <Td align="right"><MiniInput value={g.piCoef} onChange={v => upG(i, 'piCoef', v)} step="0.1" /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...card(), padding: S[6] }}>
        <SectionTitle>PI 기본액 · 직무레벨별</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
          {Object.entries(policy.piBase).map(([lv, amt]) => (
            <div key={lv} style={{ padding: S[4], background: T.surfaceAlt, borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: T.textMute, fontWeight: 600, letterSpacing: '0.05em', marginBottom: S[2] }}>
                {lv}
              </div>
              <input type="number" value={amt} 
                onChange={e => setPolicy(prev => ({ ...prev, piBase: { ...prev.piBase, [lv]: Number(e.target.value) } }))}
                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 4, fontSize: 14, textAlign: 'right', background: T.surface, boxSizing: 'border-box', fontFamily: FONT, fontWeight: 600, color: T.ink, outline: 'none' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// KPI 정량 측정 지표 섹션
// ============================================================
function KPIMetricsSection() {
  const [activeGroup, setActiveGroup] = useState('common');
  
  const groups = [
    { id: 'common', ...KPI_METRICS.common, badge: '전사', accent: T.brand },
    { id: 'Archive', ...KPI_METRICS.Archive, badge: 'Archive', accent: T.groupArchive },
    { id: 'Tech', ...KPI_METRICS.Tech, badge: 'Tech', accent: T.groupTech },
    { id: 'Biz', ...KPI_METRICS.Biz, badge: 'Biz', accent: T.groupBiz },
    { id: 'PM', ...KPI_METRICS.PM, badge: 'PM', accent: T.groupPM },
  ];
  
  const current = groups.find(g => g.id === activeGroup);
  
  return (
    <div style={{ ...card({ borderLeft: `4px solid ${T.success}` }), padding: S[6], marginBottom: S[6] }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
        marginBottom: S[5], paddingBottom: S[4], borderBottom: `1px solid ${T.border}`,
        gap: S[4], flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ 
            fontSize: 11, fontWeight: 600, color: T.success, 
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: S[1] 
          }}>
            KPI Metrics · 정량 측정 지표
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>
            KPI 달성도 세부 측정 기준
          </h2>
          <div style={{ fontSize: 12, color: T.textMute, marginTop: S[1] }}>
            전사 공통 4종 + 직무군별 4종씩 — 모든 지표는 숫자로 측정 가능
          </div>
        </div>
        
        {/* 직무군 탭 */}
        <div style={{ display: 'flex', gap: 0, border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
          {groups.map(g => (
            <button key={g.id} onClick={() => setActiveGroup(g.id)} style={{
              padding: '8px 16px', border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: activeGroup === g.id ? g.accent : T.surface, 
              color: activeGroup === g.id ? '#fff' : T.text,
              fontFamily: FONT, transition: 'all 0.15s'
            }}>
              {g.badge}
            </button>
          ))}
        </div>
      </div>
      
      {/* 현재 선택된 그룹 정보 */}
      <div style={{ 
        padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, borderRadius: 6, 
        marginBottom: S[4], display: 'flex', alignItems: 'center', gap: S[3]
      }}>
        <div style={{ 
          width: 4, height: 32, background: current.accent, borderRadius: 2
        }}/>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{current.title}</div>
          <div style={{ fontSize: 11, color: T.textMute, marginTop: 2 }}>{current.subtitle}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: T.textMute }}>
          총 <strong style={{ color: T.ink }}>{current.metrics.length}개 지표</strong>
        </div>
      </div>
      
      {/* KPI 지표 카드 그리드 (2열) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
        {current.metrics.map((m, idx) => (
          <KPIMetricCard key={m.id} metric={m} index={idx} accent={current.accent} />
        ))}
      </div>
      
      {/* 활용 가이드 */}
      <div style={{ 
        marginTop: S[5], padding: `${S[3]}px ${S[4]}px`, 
        background: '#FFF8E6', borderRadius: 6, border: `1px solid #F4E5B8`,
        fontSize: 11, color: T.text, lineHeight: 1.7,
        display: 'flex', alignItems: 'flex-start', gap: S[2]
      }}>
        <AlertCircle size={14} style={{ color: T.warning, flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong style={{ color: T.warning }}>활용 가이드:</strong>{' '}
          평가자는 각 직원의 직무군에 해당하는 4개 특화 지표 + 전사 공통 4개 지표 중{' '}
          <strong>대표 4~6개를 선정</strong>하여 평가 입력 화면의 "KPI 달성도"(35%) 점수 산정에 활용합니다. 
          각 지표는 객관적 데이터(시스템 로그, 인사 기록, 회계 자료 등)로 검증 가능해야 하며, 
          연초에 직원과 합의된 목표값을 기준으로 평가합니다.
        </div>
      </div>
    </div>
  );
}

function KPIMetricCard({ metric, index, accent }) {
  const [expanded, setExpanded] = useState(index === 0);  // 첫 카드는 펼친 상태
  
  return (
    <div style={{ 
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
      overflow: 'hidden'
    }}>
      {/* 헤더 */}
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', padding: `${S[3]}px ${S[4]}px`,
        background: expanded ? accent : T.surfaceAlt,
        color: expanded ? '#fff' : T.ink,
        border: 'none', borderBottom: expanded ? 'none' : `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
        transition: 'all 0.15s'
      }}
      onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = T.divider; }}
      onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = T.surfaceAlt; }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ 
              width: 22, height: 22, borderRadius: 11,
              background: expanded ? 'rgba(255,255,255,0.2)' : accent,
              color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, fontFamily: FONT
            }}>{index + 1}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{metric.name}</span>
          </div>
          <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4, paddingLeft: 30 }}>
            단위: {metric.unit}
          </div>
        </div>
        <ChevronDown size={16} style={{ 
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', 
          transition: 'transform 0.2s' 
        }}/>
      </button>
      
      {/* 펼쳐진 내용 */}
      {expanded && (
        <div style={{ padding: `${S[3]}px ${S[4]}px`, animation: 'fadeIn 0.2s' }}>
          {/* 측정 공식 */}
          <div style={{ marginBottom: S[3] }}>
            <div style={{ 
              fontSize: 10, fontWeight: 600, color: T.textMute, 
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4
            }}>
              측정 공식
            </div>
            <div style={{ 
              fontSize: 12, color: T.text, padding: '8px 12px', 
              background: T.surfaceAlt, borderRadius: 4,
              fontFamily: '"SF Mono", Monaco, monospace', lineHeight: 1.5
            }}>
              {metric.formula}
            </div>
          </div>
          
          {/* 등급 구간 테이블 */}
          <div style={{ marginBottom: S[3] }}>
            <div style={{ 
              fontSize: 10, fontWeight: 600, color: T.textMute, 
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6
            }}>
              등급별 기준
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <tbody>
                {metric.bands.map((b, bi) => (
                  <tr key={b.grade} style={{ borderBottom: bi < metric.bands.length - 1 ? `1px solid ${T.divider}` : 'none' }}>
                    <td style={{ padding: '6px 8px', width: 36 }}>
                      <GradeBadge grade={b.grade} size="sm" />
                    </td>
                    <td style={{ padding: '6px 8px', fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: T[b.grade], fontSize: 12.5 }}>
                      {b.range}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontSize: 11, color: T.textMute }}>
                      → <strong style={{ color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{b.score}점</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 측정 예시 */}
          <div style={{ 
            padding: `${S[2]}px ${S[3]}px`, background: '#F0F7F1', 
            borderLeft: `3px solid ${T.success}`, borderRadius: 4,
            fontSize: 11, color: T.text, lineHeight: 1.6
          }}>
            <strong style={{ color: T.success }}>예시:</strong> {metric.examples}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 로그인 화면 회사 정보 카드 편집기 (admin 전용)
// ============================================================
function CoverStatsEditor({ policy, setPolicy }) {
  // 마운트 시 coverStats가 없으면 자동으로 기본값 주입
  useEffect(() => {
    if (!policy.coverStats) {
      setPolicy(prev => ({ 
        ...prev, 
        coverStats: INITIAL_POLICY.coverStats 
      }));
    } else if (!policy.coverStats.items) {
      setPolicy(prev => ({
        ...prev,
        coverStats: { ...prev.coverStats, items: INITIAL_POLICY.coverStats.items }
      }));
    }
  }, []);
  
  const cs = policy.coverStats || INITIAL_POLICY.coverStats;
  
  const setEnabled = (v) => {
    setPolicy(prev => ({ 
      ...prev, 
      coverStats: { ...(prev.coverStats || INITIAL_POLICY.coverStats), enabled: v } 
    }));
  };
  const setItem = (idx, key, value) => {
    setPolicy(prev => {
      const current = prev.coverStats || INITIAL_POLICY.coverStats;
      return ({ 
        ...prev, 
        coverStats: { 
          ...current, 
          items: current.items.map((it, i) => i === idx ? { ...it, [key]: value } : it) 
        } 
      });
    });
  };
  const addItem = () => {
    if (cs.items.length >= 4) return;
    setPolicy(prev => {
      const current = prev.coverStats || INITIAL_POLICY.coverStats;
      return ({
        ...prev,
        coverStats: {
          ...current,
          items: [...current.items, { label: '새 항목', value: '내용', highlight: false }]
        }
      });
    });
  };
  const removeItem = (idx) => {
    setPolicy(prev => {
      const current = prev.coverStats || INITIAL_POLICY.coverStats;
      return ({
        ...prev,
        coverStats: {
          ...current,
          items: current.items.filter((_, i) => i !== idx)
        }
      });
    });
  };
  
  return (
    <div style={{ ...card({ borderLeft: `4px solid ${T.accent}` }), padding: S[6], marginBottom: S[6] }}>
      {/* 헤더 + 토글 */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
        marginBottom: S[5], paddingBottom: S[4], borderBottom: `1px solid ${T.border}`,
        gap: S[4]
      }}>
        <div>
          <div style={{ 
            fontSize: 11, fontWeight: 600, color: T.accent, 
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: S[1] 
          }}>
            Cover Stats · 로그인 화면 회사 정보
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>
            로그인 화면 회사 정보 카드
          </h2>
          <div style={{ fontSize: 12, color: T.textMute, marginTop: S[1] }}>
            로그인 화면 좌측 하단에 표시되는 회사 정보 — 사업 변화에 따라 수정하거나 숨길 수 있습니다
          </div>
        </div>
        
        {/* 표시 ON/OFF 토글 */}
        <label style={{ 
          display: 'flex', alignItems: 'center', gap: S[3], cursor: 'pointer',
          padding: `${S[2]}px ${S[3]}px`, background: cs.enabled ? T.surfaceAlt : 'transparent',
          border: `1px solid ${cs.enabled ? T.success : T.border}`, borderRadius: 6,
          transition: 'all 0.15s'
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: cs.enabled ? T.success : T.textMute }}>
            {cs.enabled ? '표시 ON' : '표시 OFF'}
          </span>
          <div style={{ 
            width: 36, height: 20, background: cs.enabled ? T.success : T.divider, 
            borderRadius: 10, position: 'relative', transition: 'all 0.2s'
          }}>
            <div style={{ 
              position: 'absolute', top: 2, left: cs.enabled ? 18 : 2,
              width: 16, height: 16, background: '#fff', borderRadius: 8,
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </div>
          <input type="checkbox" checked={cs.enabled} onChange={e => setEnabled(e.target.checked)} 
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
        </label>
      </div>
      
      {!cs.enabled && (
        <div style={{ 
          padding: `${S[4]}px ${S[5]}px`, background: T.surfaceAlt, borderRadius: 6,
          fontSize: 12, color: T.textMute, lineHeight: 1.7, textAlign: 'center'
        }}>
          현재 로그인 화면에서 이 영역이 숨겨져 있습니다. 다시 표시하려면 위 토글을 클릭하세요.
        </div>
      )}
      
      {cs.enabled && (
        <>
          {/* 항목 편집 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], marginBottom: S[4] }}>
            {cs.items.map((item, idx) => (
              <div key={idx} style={{ 
                display: 'flex', gap: S[3], alignItems: 'center',
                padding: S[3], background: T.surfaceAlt, borderRadius: 6,
                borderLeft: item.highlight ? `3px solid ${T.accent}` : `3px solid ${T.border}`
              }}>
                {/* 순서 번호 */}
                <div style={{ 
                  width: 28, height: 28, borderRadius: 14, 
                  background: T.brand, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                
                {/* 라벨 입력 */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: T.textMute, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    라벨
                  </label>
                  <input type="text" value={item.label} onChange={e => setItem(idx, 'label', e.target.value)}
                    placeholder="예: 강원랜드 산업유산"
                    style={{ 
                      width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 4,
                      fontSize: 12, background: T.surface, boxSizing: 'border-box',
                      fontFamily: FONT, outline: 'none', color: T.ink
                    }}
                    onFocus={e => e.target.style.borderColor = T.brand}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                </div>
                
                {/* 값 입력 */}
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: T.textMute, display: 'block', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    값
                  </label>
                  <input type="text" value={item.value} onChange={e => setItem(idx, 'value', e.target.value)}
                    placeholder="예: 아카이브 PM"
                    style={{ 
                      width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 4,
                      fontSize: 13, background: T.surface, boxSizing: 'border-box',
                      fontFamily: FONT, outline: 'none', color: T.ink, fontWeight: 600
                    }}
                    onFocus={e => e.target.style.borderColor = T.brand}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                </div>
                
                {/* 강조 표시 토글 */}
                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  cursor: 'pointer', minWidth: 60
                }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: T.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>강조</span>
                  <input type="checkbox" checked={item.highlight} onChange={e => setItem(idx, 'highlight', e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: T.accent }} />
                </label>
                
                {/* 삭제 버튼 */}
                <button onClick={() => removeItem(idx)} title="삭제"
                  style={{ 
                    padding: 8, background: 'transparent', border: `1px solid ${T.border}`, 
                    borderRadius: 4, cursor: 'pointer', color: T.danger, display: 'inline-flex',
                    alignSelf: 'flex-end', marginBottom: 1
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FBEAEA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          
          {/* 추가 버튼 */}
          {cs.items.length < 4 && (
            <Button variant="secondary" size="md" icon={Plus} onClick={addItem}>
              항목 추가 ({cs.items.length}/4)
            </Button>
          )}
          {cs.items.length >= 4 && (
            <div style={{ fontSize: 11, color: T.textMute, padding: `${S[2]}px 0` }}>
              최대 4개까지 추가 가능합니다
            </div>
          )}
          
          {/* 미리보기 */}
          {cs.items.length > 0 && (
            <div style={{ marginTop: S[5], paddingTop: S[4], borderTop: `1px solid ${T.divider}` }}>
              <div style={{ 
                fontSize: 11, fontWeight: 600, color: T.textMute, 
                letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: S[3]
              }}>
                미리보기 (로그인 화면)
              </div>
              <div style={{
                padding: `${S[4]}px ${S[5]}px`, 
                background: 'linear-gradient(135deg, #0F2547 0%, #1B3A6F 100%)',
                borderRadius: 8,
                display: 'grid', 
                gridTemplateColumns: `repeat(${cs.items.length}, 1fr)`, 
                gap: S[4]
              }}>
                {cs.items.map((item, i) => (
                  <div key={i} style={{ 
                    padding: '4px 0', 
                    borderLeft: item.highlight ? `2px solid ${T.accent}` : `2px solid rgba(255,255,255,0.15)`,
                    paddingLeft: 12
                  }}>
                    <div style={{ 
                      fontSize: 9, color: 'rgba(255,255,255,0.5)', 
                      letterSpacing: '0.12em', fontWeight: 500, 
                      textTransform: 'uppercase', marginBottom: 4
                    }}>
                      {item.label}
                    </div>
                    <div style={{ 
                      fontSize: 13, color: item.highlight ? '#fff' : 'rgba(255,255,255,0.9)', 
                      fontWeight: item.highlight ? 700 : 600
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// 로그인 화면 표지 이미지 편집기 (admin 전용)
// ============================================================
function CoverImageEditor({ policy, setPolicy }) {
  // 마운트 시 coverImage가 없으면 자동으로 기본값 주입
  useEffect(() => {
    if (!policy.coverImage) {
      setPolicy(prev => ({ ...prev, coverImage: INITIAL_POLICY.coverImage }));
    }
  }, []);
  
  const ci = policy.coverImage || INITIAL_POLICY.coverImage;
  
  const setField = (key, value) => {
    setPolicy(prev => ({ 
      ...prev, 
      coverImage: { 
        ...(prev.coverImage || INITIAL_POLICY.coverImage), 
        [key]: value 
      } 
    }));
  };
  
  // 추천 이미지 URL 예시 (Unsplash 무료)
  const suggestions = [
    { 
      label: '디지털 전환', 
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format', 
      caption: '디지털 전환 · 지식 보존' 
    },
    { 
      label: '데이터 분석', 
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format', 
      caption: '데이터 기반 의사결정' 
    },
    { 
      label: '아카이브', 
      url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format', 
      caption: '기록물 관리·보존' 
    },
  ];
  
  return (
    <div style={{ ...card({ borderLeft: `4px solid ${T.accent}` }), padding: S[6], marginBottom: S[6] }}>
      {/* 헤더 + 토글 */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
        marginBottom: S[5], paddingBottom: S[4], borderBottom: `1px solid ${T.border}`,
        gap: S[4]
      }}>
        <div>
          <div style={{ 
            fontSize: 11, fontWeight: 600, color: T.accent, 
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: S[1] 
          }}>
            Cover Image · 표지 이미지
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>
            로그인 화면 우측 상단 이미지
          </h2>
          <div style={{ fontSize: 12, color: T.textMute, marginTop: S[1] }}>
            외부에 호스팅된 이미지 URL을 입력하면 로그인 화면 우측 상단에 표시됩니다 (admin이 언제든 교체 가능)
          </div>
        </div>
        
        <label style={{ 
          display: 'flex', alignItems: 'center', gap: S[3], cursor: 'pointer',
          padding: `${S[2]}px ${S[3]}px`, background: ci.enabled ? T.surfaceAlt : 'transparent',
          border: `1px solid ${ci.enabled ? T.success : T.border}`, borderRadius: 6,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: ci.enabled ? T.success : T.textMute }}>
            {ci.enabled ? '표시 ON' : '표시 OFF'}
          </span>
          <div style={{ 
            width: 36, height: 20, background: ci.enabled ? T.success : T.divider, 
            borderRadius: 10, position: 'relative', transition: 'all 0.2s'
          }}>
            <div style={{ 
              position: 'absolute', top: 2, left: ci.enabled ? 18 : 2,
              width: 16, height: 16, background: '#fff', borderRadius: 8,
              transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </div>
          <input type="checkbox" checked={ci.enabled} onChange={e => setField('enabled', e.target.checked)} 
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
        </label>
      </div>
      
      {!ci.enabled && (
        <div style={{ 
          padding: `${S[4]}px ${S[5]}px`, background: T.surfaceAlt, borderRadius: 6,
          fontSize: 12, color: T.textMute, lineHeight: 1.7, textAlign: 'center'
        }}>
          현재 로그인 화면에서 이 이미지가 숨겨져 있습니다. 다시 표시하려면 위 토글을 클릭하세요.
        </div>
      )}
      
      {ci.enabled && (
        <>
          {/* URL 입력 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ 
              fontSize: 11, fontWeight: 600, color: T.text, 
              display: 'block', marginBottom: S[2], letterSpacing: '0.05em'
            }}>
              이미지 URL <span style={{ color: T.textMute, fontWeight: 400 }}>(https://...)</span>
            </label>
            <input type="text" value={ci.url || ''} onChange={e => setField('url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ 
                width: '100%', padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 6,
                fontSize: 13, background: T.surface, boxSizing: 'border-box', 
                fontFamily: '"SF Mono", Monaco, monospace', outline: 'none', color: T.ink
              }}
              onFocus={e => e.target.style.borderColor = T.brand}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            <div style={{ fontSize: 10, color: T.textLight, marginTop: 4, lineHeight: 1.6 }}>
              💡 권장: Unsplash, 회사 웹사이트, 클라우드 스토리지(Google Drive/Dropbox 공유 링크) 등 공개 접근 가능한 URL
            </div>
          </div>
          
          {/* 캡션 입력 */}
          <div style={{ marginBottom: S[4] }}>
            <label style={{ 
              fontSize: 11, fontWeight: 600, color: T.text, 
              display: 'block', marginBottom: S[2], letterSpacing: '0.05em'
            }}>
              이미지 캡션 <span style={{ color: T.textMute, fontWeight: 400 }}>(우상단에 작게 표시)</span>
            </label>
            <input type="text" value={ci.caption || ''} onChange={e => setField('caption', e.target.value)}
              placeholder="예: 디지털 전환 · 지식 보존"
              style={{ 
                width: '100%', padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 6,
                fontSize: 13, background: T.surface, boxSizing: 'border-box', 
                fontFamily: FONT, outline: 'none', color: T.ink
              }}
              onFocus={e => e.target.style.borderColor = T.brand}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>
          
          {/* 추천 이미지 빠른 적용 */}
          <div style={{ marginBottom: S[5] }}>
            <div style={{ 
              fontSize: 11, fontWeight: 600, color: T.textMute, 
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: S[2]
            }}>
              추천 이미지 빠른 적용
            </div>
            <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
              {suggestions.map((s, i) => (
                <button key={i} 
                  onClick={() => { setField('url', s.url); setField('caption', s.caption); }}
                  style={{
                    padding: `${S[2]}px ${S[3]}px`, background: T.surfaceAlt,
                    border: `1px solid ${T.border}`, borderRadius: 6,
                    fontSize: 11, cursor: 'pointer', fontFamily: FONT,
                    color: T.text, display: 'inline-flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.background = T.brand; 
                    e.currentTarget.style.color = '#fff'; 
                    e.currentTarget.style.borderColor = T.brand;
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.background = T.surfaceAlt; 
                    e.currentTarget.style.color = T.text;
                    e.currentTarget.style.borderColor = T.border;
                  }}>
                  <Sparkles size={11} /> {s.label}
                </button>
              ))}
              <button onClick={() => { setField('url', ''); setField('caption', ''); }}
                style={{
                  padding: `${S[2]}px ${S[3]}px`, background: 'transparent',
                  border: `1px solid ${T.border}`, borderRadius: 6,
                  fontSize: 11, cursor: 'pointer', fontFamily: FONT,
                  color: T.textMute, display: 'inline-flex', alignItems: 'center', gap: 6
                }}>
                <X size={11} /> 초기화
              </button>
            </div>
          </div>
          
          {/* 미리보기 */}
          <div style={{ paddingTop: S[4], borderTop: `1px solid ${T.divider}` }}>
            <div style={{ 
              fontSize: 11, fontWeight: 600, color: T.textMute, 
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: S[3]
            }}>
              미리보기 (로그인 화면 우측 상단)
            </div>
            <div style={{
              padding: `${S[5]}px ${S[6]}px`,
              background: 'linear-gradient(135deg, #0F2547 0%, #1B3A6F 100%)',
              borderRadius: 8,
              display: 'flex', justifyContent: 'center'
            }}>
              <CoverImageDisplay coverImage={ci} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// 승진 정책 편집기 (admin 전용)
// 직급별 체류연한·진급Point·인상률 직접 수정
// ============================================================
function PromotionPolicyEditor({ policy, setPolicy }) {
  // 마운트 시 promotion이 없으면 기본값 주입
  useEffect(() => {
    if (!policy.promotion) {
      setPolicy(prev => ({ ...prev, promotion: INITIAL_POLICY.promotion }));
    }
  }, []);
  
  const pm = policy.promotion || INITIAL_POLICY.promotion;
  
  const setEnabled = (v) => {
    setPolicy(prev => ({ 
      ...prev, 
      promotion: { ...(prev.promotion || INITIAL_POLICY.promotion), enabled: v } 
    }));
  };
  
  const setPointRate = (v) => {
    setPolicy(prev => ({ 
      ...prev, 
      promotion: { ...(prev.promotion || INITIAL_POLICY.promotion), pointRate: v } 
    }));
  };
  
  const setTier = (idx, key, value) => {
    setPolicy(prev => {
      const current = prev.promotion || INITIAL_POLICY.promotion;
      return ({ 
        ...prev, 
        promotion: { 
          ...current, 
          tiers: current.tiers.map((t, i) => i === idx ? { ...t, [key]: value } : t) 
        } 
      });
    });
  };
  
  const resetToDefault = () => {
    if (window.confirm('승진 정책을 기본값으로 초기화하시겠습니까?')) {
      setPolicy(prev => ({ ...prev, promotion: INITIAL_POLICY.promotion }));
    }
  };
  
  return (
    <div style={{ ...card({ borderLeft: `4px solid ${T.accent}` }), padding: S[6], marginBottom: S[6] }}>
      {/* 헤더 + 토글 */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
        marginBottom: S[5], paddingBottom: S[4], borderBottom: `1px solid ${T.border}`,
        gap: S[4]
      }}>
        <div>
          <div style={{ 
            fontSize: 11, fontWeight: 600, color: T.accent, 
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: S[1] 
          }}>
            Promotion Policy · 승진 체계
          </div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.ink }}>
            승진 정책 · 직급별 인상률 편집
          </h2>
          <div style={{ fontSize: 12, color: T.textMute, marginTop: S[1] }}>
            직급별 체류 연한·진급 Point 기준·승진 시 급여 인상률을 수정할 수 있습니다
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          <Button variant="outline" size="sm" onClick={resetToDefault}>기본값 복원</Button>
          
          {/* 표시 ON/OFF 토글 */}
          <label style={{ 
            display: 'flex', alignItems: 'center', gap: S[3], cursor: 'pointer',
            padding: `${S[2]}px ${S[3]}px`, background: pm.enabled ? T.surfaceAlt : 'transparent',
            border: `1px solid ${pm.enabled ? T.success : T.border}`, borderRadius: 6,
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: pm.enabled ? T.success : T.textMute }}>
              {pm.enabled ? '활성 ON' : '비활성'}
            </span>
            <div style={{ 
              width: 36, height: 20, background: pm.enabled ? T.success : T.divider, 
              borderRadius: 10, position: 'relative', transition: 'all 0.2s'
            }}>
              <div style={{ 
                position: 'absolute', top: 2, left: pm.enabled ? 18 : 2,
                width: 16, height: 16, background: '#fff', borderRadius: 8,
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </div>
            <input type="checkbox" checked={pm.enabled} onChange={e => setEnabled(e.target.checked)} 
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
          </label>
        </div>
      </div>
      
      {!pm.enabled && (
        <div style={{ 
          padding: `${S[4]}px ${S[5]}px`, background: T.surfaceAlt, borderRadius: 6,
          fontSize: 12, color: T.textMute, lineHeight: 1.7, textAlign: 'center'
        }}>
          승진 심사 기능이 비활성화되어 있습니다. 평가 입력 화면과 직원 상세 패널에 승진 심사 정보가 표시되지 않습니다.
        </div>
      )}
      
      {pm.enabled && (
        <>
          {/* 진급 Point 환산률 (전역) */}
          <div style={{ 
            marginBottom: S[5], padding: `${S[3]}px ${S[4]}px`,
            background: '#F0F7F1', borderLeft: `3px solid ${T.success}`, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3]
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.success, marginBottom: 2 }}>
                진급 Point 환산률
              </div>
              <div style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>
                평가 종합점수에 곱해서 진급 Point를 계산합니다 (예: 종합점수 90 × 0.15 = 13.5 Point)
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" step="0.01" min="0.05" max="0.30"
                value={pm.pointRate}
                onChange={e => setPointRate(Number(e.target.value) || 0.15)}
                style={{ 
                  width: 80, padding: '6px 10px', border: `1px solid ${T.border}`, borderRadius: 4,
                  fontSize: 13, textAlign: 'center', background: T.surface,
                  fontFamily: '"SF Mono", Monaco, monospace', fontWeight: 600, color: T.ink, outline: 'none'
                }}
              />
              <span style={{ fontSize: 11, color: T.textMute }}>× 종합점수</span>
            </div>
          </div>
          
          {/* 직급별 정책 테이블 */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: T.surfaceAlt }}>
                  <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.05em', borderBottom: `2px solid ${T.brand}` }}>직급</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.05em', borderBottom: `2px solid ${T.brand}` }}>호칭 (From)</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.05em', borderBottom: `2px solid ${T.brand}` }}>승진 직급 (To)</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.05em', borderBottom: `2px solid ${T.brand}`, minWidth: 90 }}>체류연한</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.05em', borderBottom: `2px solid ${T.brand}`, minWidth: 90 }}>진급 Point</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: '0.05em', borderBottom: `2px solid ${T.accent}`, minWidth: 90 }}>인상률 (%)</th>
                </tr>
              </thead>
              <tbody>
                {pm.tiers.map((tier, idx) => {
                  const isExecutive = tier.years === null;
                  return (
                    <tr key={idx} style={{ 
                      borderBottom: `1px solid ${T.divider}`,
                      background: isExecutive ? '#FFFAEC' : (idx % 2 === 0 ? T.surface : '#FBFCFD')
                    }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: T.ink, fontSize: 12 }}>
                        {tier.fromLevel}
                      </td>
                      <td style={{ padding: '8px', color: T.text }}>{tier.fromTitle}</td>
                      <td style={{ padding: '8px', color: T.text }}>
                        <ChevronRight size={11} style={{ display: 'inline', verticalAlign: 'middle', color: T.textMute, marginRight: 4 }}/>
                        <strong style={{ color: T.brand }}>{tier.toTitle}</strong>
                      </td>
                      {/* 체류 연한 */}
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        {isExecutive ? (
                          <span style={{ fontSize: 10, color: T.warning, fontWeight: 600 }}>경영진 의사결정</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <input type="number" min="0" step="1"
                              value={tier.years}
                              onChange={e => setTier(idx, 'years', Number(e.target.value) || 0)}
                              style={{ 
                                width: 50, padding: '5px 6px', border: `1px solid ${T.border}`, borderRadius: 4,
                                fontSize: 12, textAlign: 'center', background: T.surface,
                                fontFamily: '"SF Mono", Monaco, monospace', fontWeight: 600, color: T.ink, outline: 'none'
                              }}
                            />
                            <span style={{ fontSize: 10, color: T.textMute }}>년</span>
                          </div>
                        )}
                      </td>
                      {/* 진급 Point */}
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        {isExecutive ? (
                          <span style={{ fontSize: 10, color: T.textMute }}>—</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <input type="number" min="0" step="0.5"
                              value={tier.requiredPoint}
                              onChange={e => setTier(idx, 'requiredPoint', Number(e.target.value) || 0)}
                              style={{ 
                                width: 60, padding: '5px 6px', border: `1px solid ${T.border}`, borderRadius: 4,
                                fontSize: 12, textAlign: 'center', background: T.surface,
                                fontFamily: '"SF Mono", Monaco, monospace', fontWeight: 600, color: T.ink, outline: 'none'
                              }}
                            />
                            <span style={{ fontSize: 10, color: T.textMute }}>점</span>
                          </div>
                        )}
                      </td>
                      {/* 인상률 - 강조 */}
                      <td style={{ padding: '8px', textAlign: 'center', background: 'rgba(214,56,56,0.03)' }}>
                        {tier.increase === null ? (
                          <span style={{ fontSize: 10, color: T.warning, fontWeight: 600 }}>경영진 의사결정</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <input type="number" min="0" max="20" step="0.5"
                              value={tier.increase}
                              onChange={e => setTier(idx, 'increase', Number(e.target.value) || 0)}
                              style={{ 
                                width: 60, padding: '5px 6px', border: `1px solid ${T.accent}`, borderRadius: 4,
                                fontSize: 12, textAlign: 'center', background: T.surface,
                                fontFamily: '"SF Mono", Monaco, monospace', fontWeight: 700, color: T.accent, outline: 'none'
                              }}
                              onFocus={e => e.target.style.borderWidth = '2px'}
                              onBlur={e => e.target.style.borderWidth = '1px'}
                            />
                            <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>%</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* 안내 */}
          <div style={{ 
            marginTop: S[4], padding: `${S[3]}px ${S[4]}px`,
            background: T.surfaceAlt, borderRadius: 6,
            fontSize: 11, color: T.textMute, lineHeight: 1.7
          }}>
            <strong style={{ color: T.text }}>💡 인상률은 어떻게 적용되나요?</strong><br/>
            승진이 확정된 직원의 다음 연도 기본급 인상에 적용됩니다. 예를 들어 4급 대리가 과장으로 승진하면 +4% 인상되며, 이는 평가 등급에 따른 일반 인상률(S 7%, A 5%, B 3%...)에 추가로 적용되지 않고 둘 중 큰 값이 적용됩니다.
          </div>
        </>
      )}
    </div>
  );
}

function PolicySection({ title, sumK, policy, children }) {
  const sum = sumK ? sumK.reduce((s, k) => s + (policy[k] || 0), 0) : null;
  const ok = sum === 100;
  return (
    <div style={{ ...card(), padding: S[6] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: S[4], paddingBottom: S[2], borderBottom: `2px solid ${T.brand}` }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.ink }}>{title}</h3>
        {sum !== null && (
          <Badge color={ok ? T.success : T.danger} variant="outline">
            합계 {sum}%{!ok && ' ⚠'}
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}

function PolicyInput({ label, value, onChange, step = "1" }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${S[2]}px 0`, borderBottom: `1px solid ${T.divider}` }}>
      <span style={{ fontSize: 13, color: T.text }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
        <MiniInput value={value} onChange={onChange} step={step} />
        <span style={{ fontSize: 12, color: T.textMute, width: 14 }}>%</span>
      </div>
    </div>
  );
}

function MiniInput({ value, onChange, step = "1" }) {
  return (
    <input type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ width: 70, padding: '6px 10px', border: `1px solid ${T.border}`, borderRadius: 4, fontSize: 13, textAlign: 'right', background: T.surface, fontFamily: FONT, color: T.ink, outline: 'none', fontWeight: 600 }} />
  );
}

// ============================================================
// PDF 평가서
// ============================================================
function printEvaluationPDF(emp, result, scores, comments, policy, year, userRole) {
  const win = window.open('', '_blank');
  if (!win) { alert('팝업 차단을 해제해주세요.'); return; }
  const today = new Date().toISOString().slice(0, 10);
  const gColor = { S: '#1B7F4F', A: '#4A9D6E', B: '#1B3A6F', C: '#D97706', D: '#B91C1C' };
  
  // 인건비 정보 표시 권한 (admin·manager만)
  // userRole이 전달되지 않으면 기본 안전 모드로 인건비 숨김
  const canIncludeSalary = userRole === 'admin' || userRole === 'manager';
  const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>인사평가서 - ${emp.name}</title>
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Pretendard', sans-serif; color: #2C3540; padding: 40px 50px; line-height: 1.6; }
@media print { body { padding: 20px 30px; } .no-print { display: none !important; } @page { size: A4; margin: 15mm; } }
.header { border-bottom: 3px solid #1B3A6F; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
.logo { display: flex; align-items: center; gap: 14px; }
.logo svg { width: 44px; height: 44px; flex-shrink: 0; }
.logo .text-block { display: flex; flex-direction: column; line-height: 1; }
.logo .koitionk-korea { font-size: 9px; font-weight: 500; color: #1B3A6F; letter-spacing: 0.35em; padding-left: 4px; margin-bottom: 4px; }
.logo .koitionk-line { height: 1.5px; background: #D63838; width: 100%; }
.logo .koitionk-main { font-size: 24px; font-weight: 800; color: #1B3A6F; letter-spacing: 0.02em; padding: 4px 0; line-height: 0.95; }
.logo .koitionk-innov { font-size: 9px; font-weight: 500; color: #1B3A6F; letter-spacing: 0.35em; padding-right: 4px; margin-top: 4px; text-align: right; }
.doc-meta { text-align: right; font-size: 11px; color: #6B7280; }
.doc-meta strong { color: #1B3A6F; }
h2 { font-size: 15px; font-weight: 700; color: #1A1A1A; margin: 28px 0 14px; padding-bottom: 8px; border-bottom: 2px solid #1B3A6F; }
.eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #1B3A6F; margin-bottom: 10px; }
.info-box { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 20px; background: #F8F9FB; border-left: 4px solid #1B3A6F; border-radius: 4px; margin-bottom: 24px; }
.info-item .label { font-size: 10px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.info-item .value { font-size: 14px; font-weight: 600; color: #1A1A1A; }
.info-item .value.large { font-size: 20px; font-weight: 700; }
.grade-display { text-align: center; padding: 32px; background: ${gColor[result.grade.grade]}; color: #fff; margin-bottom: 28px; border-radius: 6px; }
.grade-display .grade-letter { font-size: 72px; font-weight: 800; line-height: 1; }
.grade-display .grade-label { font-size: 14px; opacity: 0.9; margin-top: 10px; letter-spacing: 0.15em; }
.grade-display .grade-score { font-size: 13px; opacity: 0.85; margin-top: 8px; }
.score-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
.score-table th { background: #1B3A6F; color: #fff; padding: 10px 14px; text-align: left; font-weight: 600; font-size: 11px; letter-spacing: 0.05em; }
.score-table td { padding: 10px 14px; border-bottom: 1px solid #E5E7EB; }
.score-table .num { text-align: right; font-variant-numeric: tabular-nums; }
.score-table .total-row { background: #F8F9FB; font-weight: 700; }
.comment-block { background: #F8F9FB; border-left: 3px solid #1B3A6F; padding: 16px 20px; margin-bottom: 12px; border-radius: 4px; }
.comment-block .comment-label { font-size: 11px; font-weight: 700; color: #1B3A6F; margin-bottom: 8px; letter-spacing: 0.05em; text-transform: uppercase; }
.comment-block .comment-text { font-size: 13px; color: #2C3540; line-height: 1.8; white-space: pre-wrap; }
.salary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.salary-box { padding: 16px 20px; background: #F8F9FB; border: 1px solid #E5E7EB; border-radius: 6px; }
.salary-box .label { font-size: 10px; color: #6B7280; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; }
.salary-box .value { font-size: 20px; font-weight: 700; margin-top: 6px; color: #1B3A6F; }
.salary-box.highlight { background: #1B3A6F; color: #fff; border-color: #1B3A6F; }
.salary-box.highlight .label { color: rgba(255,255,255,0.7); }
.salary-box.highlight .value { color: #fff; }
.interview-notice { padding: 18px 22px; background: #FFF8E6; border-left: 4px solid #D97706; border-radius: 4px; margin: 24px 0 16px; }
.interview-notice-label { font-size: 11px; font-weight: 700; color: #D97706; letter-spacing: 0.1em; margin-bottom: 6px; }
.interview-notice-text { font-size: 12px; color: #2C3540; line-height: 1.7; }
.signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; padding: 30px 0; border-top: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; }
.sig-box { text-align: center; font-size: 11px; }
.sig-box .sig-label { color: #6B7280; margin-bottom: 32px; }
.sig-box .sig-name { border-top: 1px solid #6B7280; padding-top: 10px; font-weight: 600; color: #1A1A1A; }
.footer { margin-top: 28px; padding-top: 16px; display: flex; justify-content: space-between; font-size: 10px; color: #9CA3AF; letter-spacing: 0.05em; }
.print-btn { position: fixed; top: 20px; right: 20px; padding: 12px 24px; background: #1B3A6F; color: #fff; border: none; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
</style></head><body>
<button class="print-btn no-print" onclick="window.print()">🖨 PDF 저장 / 인쇄</button>
<div class="header">
  <div class="logo">
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="14" height="44" fill="#1B3A6F" rx="1" />
      <rect x="30" y="8" width="14" height="14" fill="#1B3A6F" rx="1" />
      <rect x="45" y="8" width="7" height="7" fill="#D63838" rx="1" />
      <rect x="30" y="24" width="14" height="12" fill="#1B3A6F" rx="1" />
      <rect x="30" y="38" width="14" height="14" fill="#1B3A6F" rx="1" />
    </svg>
    <div class="text-block">
      <div class="koitionk-korea">KOREA</div>
      <div class="koitionk-line"></div>
      <div class="koitionk-main">KOITION</div>
      <div class="koitionk-line"></div>
      <div class="koitionk-innov">INNOVATION</div>
    </div>
  </div>
  <div class="doc-meta">
    <div style="font-size: 16px; font-weight: 700; color: #1A1A1A; margin-bottom: 4px;">
      인사평가서${!canIncludeSalary ? ' <span style="font-size: 10px; padding: 2px 8px; background: #D97706; color: #fff; border-radius: 3px; font-weight: 700; letter-spacing: 0.05em; margin-left: 4px; vertical-align: middle;">면담용</span>' : ''}
    </div>
    <div>문서번호: <strong>HR-${year}-${emp.id}${!canIncludeSalary ? '-INT' : ''}</strong></div>
    <div>발행일: <strong>${today}</strong></div>
    <div style="font-size: 10px; margin-top: 4px; color: ${canIncludeSalary ? '#6B7280' : '#D97706'};">${canIncludeSalary ? '인사 기록물 (보상 정보 포함)' : '면담용 발췌본 (보상 정보 제외)'}</div>
  </div>
</div>
<div class="eyebrow">Employee Information · 평가 대상자</div>
<div class="info-box">
  <div class="info-item"><div class="label">성명</div><div class="value large">${emp.name}</div></div>
  <div class="info-item"><div class="label">사번</div><div class="value">${emp.id}</div></div>
  <div class="info-item"><div class="label">부서</div><div class="value">${emp.dept}</div></div>
  <div class="info-item"><div class="label">직위 / 레벨</div><div class="value">${emp.position} · ${emp.level}</div></div>
  <div class="info-item"><div class="label">직무군</div><div class="value"><span style="display: inline-block; padding: 3px 10px; background: ${({Archive:'#4A9D6E',Tech:'#1556C9',Biz:'#D63838',PM:'#7C3AED'})[emp.group] || '#6B7280'}; color: #fff; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em;">${emp.group}</span></div></div>
  <div class="info-item"><div class="label">입사일</div><div class="value">${emp.hireDate}</div></div>
  <div class="info-item"><div class="label">담당 역할</div><div class="value">${emp.role || '-'}</div></div>
  <div class="info-item"><div class="label">평가 연도</div><div class="value">${year}년 정기평가</div></div>
</div>
<div class="grade-display">
  <div class="eyebrow" style="color: rgba(255,255,255,0.7);">Final Grade · 종합 평가 등급</div>
  <div class="grade-letter">${result.grade.grade}</div>
  <div class="grade-label">${result.grade.label.toUpperCase()}</div>
  <div class="grade-score">종합 점수 ${result.totalScore.toFixed(2)} / 100${canIncludeSalary ? ` · 기본급 인상률 ${result.grade.increase}% · PI 계수 ${result.grade.piCoef}x` : ''}</div>
</div>
<h2>역량평가 (Competency Assessment)</h2>
<table class="score-table">
<thead><tr><th style="width: 50%;">평가 항목</th><th style="width: 20%; text-align: right;">배점</th><th style="width: 15%; text-align: right;">점수</th><th style="width: 15%; text-align: right;">가중점수</th></tr></thead>
<tbody>
<tr><td>직무 전문성</td><td class="num">${policy.comp_expert}%</td><td class="num">${scores.comp_expert ?? '-'}</td><td class="num">${scores.comp_expert != null ? (scores.comp_expert * policy.comp_expert / 100).toFixed(2) : '-'}</td></tr>
<tr><td>문제해결력</td><td class="num">${policy.comp_problem}%</td><td class="num">${scores.comp_problem ?? '-'}</td><td class="num">${scores.comp_problem != null ? (scores.comp_problem * policy.comp_problem / 100).toFixed(2) : '-'}</td></tr>
<tr><td>학습·자기계발</td><td class="num">${policy.comp_learn}%</td><td class="num">${scores.comp_learn ?? '-'}</td><td class="num">${scores.comp_learn != null ? (scores.comp_learn * policy.comp_learn / 100).toFixed(2) : '-'}</td></tr>
<tr><td>협업·커뮤니케이션</td><td class="num">${policy.comp_collab}%</td><td class="num">${scores.comp_collab ?? '-'}</td><td class="num">${scores.comp_collab != null ? (scores.comp_collab * policy.comp_collab / 100).toFixed(2) : '-'}</td></tr>
<tr class="total-row"><td>역량평가 가중점수</td><td class="num">100%</td><td></td><td class="num">${result.comp != null ? result.comp.toFixed(2) : '-'}</td></tr>
</tbody></table>
<h2>업적평가 (Performance Assessment)</h2>
<table class="score-table">
<thead><tr><th style="width: 50%;">평가 항목</th><th style="width: 20%; text-align: right;">배점</th><th style="width: 15%; text-align: right;">점수</th><th style="width: 15%; text-align: right;">가중점수</th></tr></thead>
<tbody>
<tr><td>KPI 달성도</td><td class="num">${policy.perf_kpi}%</td><td class="num">${scores.perf_kpi ?? '-'}</td><td class="num">${scores.perf_kpi != null ? (scores.perf_kpi * policy.perf_kpi / 100).toFixed(2) : '-'}</td></tr>
<tr><td>프로젝트 기여도</td><td class="num">${policy.perf_profit}%</td><td class="num">${scores.perf_profit ?? '-'}</td><td class="num">${scores.perf_profit != null ? (scores.perf_profit * policy.perf_profit / 100).toFixed(2) : '-'}</td></tr>
<tr><td>납기·완성도</td><td class="num">${policy.perf_delivery}%</td><td class="num">${scores.perf_delivery ?? '-'}</td><td class="num">${scores.perf_delivery != null ? (scores.perf_delivery * policy.perf_delivery / 100).toFixed(2) : '-'}</td></tr>
<tr><td>고객 만족도</td><td class="num">${policy.perf_customer}%</td><td class="num">${scores.perf_customer ?? '-'}</td><td class="num">${scores.perf_customer != null ? (scores.perf_customer * policy.perf_customer / 100).toFixed(2) : '-'}</td></tr>
<tr class="total-row"><td>업적평가 가중점수</td><td class="num">100%</td><td></td><td class="num">${result.perf != null ? result.perf.toFixed(2) : '-'}</td></tr>
</tbody></table>
<h2>평가자 의견 (Evaluator Comments)</h2>
<div class="comment-block"><div class="comment-label">▶ 강점</div><div class="comment-text">${comments.strength || '의견 미작성'}</div></div>
<div class="comment-block"><div class="comment-label">▶ 개선점</div><div class="comment-text">${comments.improvement || '의견 미작성'}</div></div>
<div class="comment-block"><div class="comment-label">▶ 종합 의견</div><div class="comment-text">${comments.overall || '의견 미작성'}</div></div>
${canIncludeSalary ? `
<h2>${year + 1}년도 보상 산정</h2>
<div class="salary-grid">
<div class="salary-box"><div class="label">현재 월 기본급</div><div class="value">${fmtKRW(emp.baseSalary)}원</div></div>
<div class="salary-box highlight"><div class="label">${year + 1}년 월 기본급 (+${result.increase}%)</div><div class="value">${fmtKRW(result.newSalary)}원</div></div>
<div class="salary-box"><div class="label">월 직책수당</div><div class="value">${emp.allowance > 0 ? fmtKRW(emp.allowance) + '원' : '해당없음'}</div></div>
<div class="salary-box"><div class="label">PI · Project Incentive</div><div class="value">${result.pi > 0 ? fmtKRW(result.pi) + '원' : '해당없음'}</div></div>
<div class="salary-box"><div class="label">PS · Profit Sharing</div><div class="value">${result.ps > 0 ? fmtKRW(result.ps) + '원' : '해당없음'}</div></div>
<div class="salary-box highlight"><div class="label">${year + 1}년 총 보상 (연)</div><div class="value">${fmtKRW(result.totalComp2026)}원</div></div>
</div>
` : `
<div class="interview-notice">
  <div class="interview-notice-label">📋 면담용 평가서</div>
  <div class="interview-notice-text">본 평가서는 면담 목적으로 출력되었으며, 보상·인건비 관련 정보는 별도 통보됩니다. 평가 결과는 인사 담당자(HR)를 통해 공식적으로 안내됩니다.</div>
</div>
`}
<div class="signatures">
<div class="sig-box"><div class="sig-label">1차 평가자<br/>(직속상사)</div><div class="sig-name">${comments.evaluator1 || '_________________'}</div></div>
<div class="sig-box"><div class="sig-label">2차 평가자<br/>(차상위)</div><div class="sig-name">${comments.evaluator2 || '_________________'}</div></div>
<div class="sig-box"><div class="sig-label">인사 담당<br/>(확인)</div><div class="sig-name">_________________</div></div>
</div>
<div class="footer">
  <div>주식회사 코이션 · KOITION CO., LTD.</div>
  <div>${canIncludeSalary ? '본 평가서는 인사 기록물로 5년간 보존됩니다.' : '본 발췌본은 면담용으로만 사용되며, 외부 유출을 금합니다.'}</div>
</div>
<script>setTimeout(() => { window.print(); }, 600);</script>
</body></html>`;
  win.document.write(html); win.document.close();
}

// ============================================================
// 매뉴얼 콘텐츠 데이터
// 시스템 내 가이드 화면 + Word/PDF 매뉴얼 양쪽에서 공통 사용
// ============================================================
const MANUAL_CONTENT = {
  title: '코이션 인사평가·보상 관리 시스템 매뉴얼',
  subtitle: 'KOITION HR Evaluation & Compensation System User Guide',
  version: 'v39',
  company: '주식회사 코이션 · KOITION CO., LTD.',
  
  sections: [
    {
      id: 'overview',
      title: '1. 시스템 개요',
      audience: 'all',
      blocks: [
        {
          type: 'paragraph',
          text: '코이션 인사평가 관리시스템은 기록물 및 아카이브 사업을 수행하는 전문인력의 인사평가, 급여산정, 승진심사를 통합관리하는 디지털플랫폼입니다.',
        },
        {
          type: 'subtitle',
          text: '1.1 시스템의 목적',
        },
        {
          type: 'list',
          items: [
            '평가 기준의 객관성·공정성 확보 (RUBRICS 5단계 기준 + KPI 정량 지표 16종)',
            '직무군별 특화 평가 (Archive · Tech · Biz · PM 4가지 직무군)',
            '보상 시뮬레이션 자동화 (평가 등급 → 인상률·PI·PS 자동 산정)',
            '승진 심사 자동화 (체류연한·진급Point 자동 충족 여부 판정)',
            'ECount ERP 양방향 연동 (인사카드 데이터 동기화)',
          ],
        },
        {
          type: 'subtitle',
          text: '1.2 평가 사이클',
        },
        {
          type: 'paragraph',
          text: '연 1회 정기 평가 → 자기평가 (직원) → 평가자 검토 (부서장) → 등급 확정 (인사 담당자) → 보상 산정 → 면담 → 다음 연도 적용 순으로 진행됩니다.',
        },
      ],
    },
    {
      id: 'first-login',
      title: '2. 첫 로그인 & 비밀번호 변경',
      audience: 'all',
      blocks: [
        {
          type: 'subtitle',
          text: '2.1 로그인',
        },
        {
          type: 'list',
          items: [
            '시스템 URL 접속 후 로그인 화면에서 인사 담당자에게 전달받은 아이디·임시 비밀번호 입력',
            '비밀번호는 SHA-256 해시로 저장되어 평문이 노출되지 않습니다',
          ],
        },
        {
          type: 'subtitle',
          text: '2.2 첫 로그인 후 즉시 비밀번호 변경',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: '⚠ 보안 필수 절차',
          text: '첫 로그인 시 우측 하단에 "보안 경고: 비밀번호 변경 필요" 배너가 표시됩니다. "지금 변경" 버튼을 눌러 즉시 변경하세요. 본인의 인사·급여 정보 보호의 첫 단계입니다.',
        },
        {
          type: 'subtitle',
          text: '2.3 비밀번호 규칙',
        },
        {
          type: 'list',
          items: [
            '최소 8자 이상',
            '영문 대문자·소문자·숫자·특수문자 중 3종 이상 포함',
            '본인 ID나 이름을 비밀번호에 포함 금지',
            '"1234", "admin", "password" 등 흔한 비밀번호 금지',
            '비밀번호 강도 4단계로 시각화 (약함 → 매우 강함)',
          ],
        },
        {
          type: 'subtitle',
          text: '2.4 비밀번호 분실 시',
        },
        {
          type: 'paragraph',
          text: '비밀번호를 잊으셨다면 인사 담당자(admin)에게 초기화를 요청하세요. admin은 직원 관리 화면에서 해당 직원의 비밀번호를 임시 비밀번호로 초기화할 수 있으며, 본인은 첫 로그인 시 즉시 새 비밀번호로 다시 변경하도록 안내됩니다.',
        },
      ],
    },
    {
      id: 'roles',
      title: '3. 권한별 안내',
      audience: 'all',
      blocks: [
        {
          type: 'subtitle',
          text: '3.1 admin (인사 담당자)',
        },
        {
          type: 'paragraph',
          text: '시스템 전체 운영 권한을 가진 최고 관리자입니다. 모든 메뉴 접근 가능, 모든 직원의 인건비·평가·승진 정보 조회 가능.',
        },
        {
          type: 'list',
          items: [
            '직원 관리: CRUD + 메모 + 비밀번호 초기화',
            '평가 입력 (모든 직원 대상)',
            '평가 결과 (전체 직원 결과 + 등급 분포 + PDF 출력)',
            '급여 산정 (인상률·PI·PS 자동 계산)',
            '통계 분석',
            '다년도 이력',
            '이메일 통보',
            '정책 설정 (가중치·등급 기준·승진 정책·KPI 지표·표지)',
            'ECount ERP 양방향 연동',
            '데이터 백업·복원 (JSON 내보내기·불러오기)',
          ],
        },
        {
          type: 'subtitle',
          text: '3.2 manager (본부장급)',
        },
        {
          type: 'paragraph',
          text: '본부 단위 운영 권한. 본인 본부 소속 직원의 평가·결과·분석 가능.',
        },
        {
          type: 'list',
          items: [
            '대시보드 (본인 본부 + 인건비 정보 확인 가능)',
            '내 평가 (본인 자기평가)',
            '평가 입력 (본인 본부 직원)',
            '평가 결과 (본인 본부 결과)',
            '통계 분석 (본인 본부)',
          ],
        },
        {
          type: 'subtitle',
          text: '3.3 evaluator (부서장·팀장)',
        },
        {
          type: 'paragraph',
          text: '부서·팀 단위 평가 권한. 본인 부서 소속 직원 평가만 가능.',
        },
        {
          type: 'list',
          items: [
            '대시보드 (본인 부서 + 인건비 정보는 비공개)',
            '내 평가 (본인 자기평가)',
            '평가 입력 (본인 부서 직원)',
          ],
        },
        {
          type: 'subtitle',
          text: '3.4 employee (일반 직원)',
        },
        {
          type: 'paragraph',
          text: '본인 데이터에만 접근 가능. 자기평가 작성 및 본인 평가 결과 확인.',
        },
        {
          type: 'list',
          items: [
            '대시보드 (본인 정보 + 인건비 정보는 비공개)',
            '내 평가 (본인 자기평가 작성 + 제출)',
          ],
        },
      ],
    },
    {
      id: 'self-eval',
      title: '4. 자기 평가 작성 가이드',
      audience: 'all',
      blocks: [
        {
          type: 'subtitle',
          text: '4.1 자기 평가의 의미',
        },
        {
          type: 'paragraph',
          text: '자기 평가는 본인의 한 해를 돌아보고, 평가자(상사)에게 본인의 성과를 효과적으로 어필하는 첫 단계입니다. 평가자는 자기 평가를 참고하여 최종 평가를 작성하므로 구체적이고 정량적인 작성이 매우 중요합니다.',
        },
        {
          type: 'subtitle',
          text: '4.2 8개 평가 항목',
        },
        {
          type: 'paragraph',
          text: '역량 4개 + 업적 4개 = 총 8개 항목을 0~100점으로 자기 평가합니다.',
        },
        {
          type: 'table',
          headers: ['구분', '항목', '가중치', '핵심 평가 요소'],
          rows: [
            ['역량', '직무 전문성', '15%', '담당 직무 전문지식·기술 수준, 자격증'],
            ['역량', '문제해결력', '15%', '복잡한 문제 분석·해결, 의사결정 품질'],
            ['역량', '학습·자기계발', '10%', '신규 지식 습득, 교육 이수, 자격 취득'],
            ['역량', '협업·커뮤니케이션', '10%', '팀워크, 보고·소통, 다면평가 반영'],
            ['업적', 'KPI 달성도', '15%', '담당 KPI 달성률 (정량 측정)'],
            ['업적', '프로젝트 기여도', '15%', '참여 프로젝트 수익률 × 기여도 비중 (경영지원부 데이터 연계)'],
            ['업적', '납기·완성도', '10%', '약정 납기 준수, 결과물 품질'],
            ['업적', '고객 만족도', '10%', '발주처 CSAT, 재계약 기여'],
          ],
        },
        {
          type: 'subtitle',
          text: '4.3 점수 등급 구간',
        },
        {
          type: 'table',
          headers: ['등급', '점수 구간', '의미', '기본급 인상률', 'PI 계수'],
          rows: [
            ['S', '90~100점', 'EXCELLENT - 탁월', '7%', '2.5x'],
            ['A', '80~89점', 'GOOD - 우수', '5%', '1.8x'],
            ['B', '70~79점', 'AVERAGE - 보통', '3%', '1.0x'],
            ['C', '60~69점', 'BELOW - 미흡', '1.5%', '0.3x'],
            ['D', '0~59점', 'POOR - 부진', '0%', '0x'],
          ],
        },
        {
          type: 'subtitle',
          text: '4.4 직급별 기대 수준 (L1~L4)',
        },
        {
          type: 'list',
          items: [
            'L1 (신입·견습): B~C급 (60~79점) 기대 - 결과보다 학습 태도와 성장 가능성 평가',
            'L2 (실무 담당): B~A급 (70~89점) 기대 - "독립 실무 담당"이 핵심 키워드',
            'L3 (시니어·팀장): A~S급 (80~100점) 기대 - 본인 성과 + 팀 기여 모두 평가',
            'L4 (본부장·임원): A~S급 (80~100점) 기대 - 본부 운영 성과로 평가',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: '💡 L1·L2 직원은 화면에서 자동 안내',
          text: '자기평가 화면 상단에 본인 직급의 기대 수준 가이드 패널이 자동 펼침으로 표시됩니다. 각 평가 항목 옆 "평가 기준 보기" 버튼으로 5단계 RUBRICS 기준을 확인할 수 있습니다.',
        },
        {
          type: 'subtitle',
          text: '4.5 의견란 작성 원칙',
        },
        {
          type: 'paragraph',
          text: '3개 의견란(성과·강점, 개선점, 내년 목표)에 본인 의견을 작성합니다. 각 의견란마다 "작성 가이드 + 예시 보기" 버튼이 있어 직무군별 좋은 예시를 참고할 수 있습니다.',
        },
        {
          type: 'list',
          items: [
            '정량 수치 우선 ("많이 했다" 보다 "X건 처리", "Y% 향상")',
            '시점 명시 ("올해", "1분기", "Q3 프로젝트")',
            '본인 기여 명확화 ("팀이 했다" 보다 "내가 담당했다")',
            '결과의 영향 설명 (단순 활동이 아닌 결과의 임팩트)',
          ],
        },
        {
          type: 'subtitle',
          text: '4.6 제출 후',
        },
        {
          type: 'paragraph',
          text: '자기평가 제출 후에는 수정할 수 없습니다. 평가자(부서장)가 검토한 후 최종 점수를 입력하며, 본인은 평가 면담을 통해 결과를 확인합니다.',
        },
      ],
    },
    {
      id: 'evaluator',
      title: '5. 평가자 가이드 (evaluator·manager)',
      audience: 'evaluator',
      blocks: [
        {
          type: 'subtitle',
          text: '5.1 평가 입력 흐름',
        },
        {
          type: 'list',
          items: [
            '사이드바 "평가 입력" 메뉴 클릭',
            '평가할 직원 선택 (본인 부서/본부 직원만 표시)',
            '직원의 자기 평가 결과를 참고하며 점수 입력',
            '필요 시 "KPI 자동 계산기" 버튼으로 정량 KPI 산정',
            '평가자 의견 3개 작성 (강점·개선점·종합 의견)',
            '저장 → 등급 자동 산정 → 평가 결과 화면에서 확인',
          ],
        },
        {
          type: 'subtitle',
          text: '5.2 KPI 자동 계산기',
        },
        {
          type: 'paragraph',
          text: '업적평가의 KPI 달성도 입력 시 "KPI 자동 계산기 열기" 버튼을 클릭하면 직무군별 정량 지표 8개(전사 공통 4 + 직무군 4)로 정확한 점수를 산정할 수 있습니다.',
        },
        {
          type: 'list',
          items: [
            '전사 공통 (4개): KPI 달성률, 근태 준수율, 교육 이수 시간, 자격증 점수',
            'Archive (4개): 아카이브 등록 건수, 메타데이터 품질 통과율, 분류표 정확도, 디지털 보존 처리율',
            'Tech (4개): 서비스 릴리즈 건수, 버그 발생률, 시스템 가용성, 코드 리뷰 참여',
            'Biz (4개): 신규 수주 금액, 영업이익률, 재계약 성공률, 입찰 낙찰률',
            'PM (4개): 프로젝트 수행 건수, 납기 준수율, 프로젝트 이익률, 고객 만족도 CSAT',
          ],
        },
        {
          type: 'subtitle',
          text: '5.3 프로젝트 기여도 자동 산정 (경영지원부 연계)',
        },
        {
          type: 'paragraph',
          text: '업적평가의 "프로젝트 기여도" 항목은 개인이 프로젝트 수익성을 정량 평가할 수 없다는 점을 반영하여, 경영지원부가 관리하는 프로젝트별 수익성 데이터에서 자동 산정됩니다. 경영지원부는 프로젝트 종료·연말에 "프로젝트 수익성" 메뉴에서 프로젝트별 매출·인건비·제경비를 입력(또는 CSV 업로드)하고 투입 인원별 기여도 비중을 지정합니다.',
        },
        {
          type: 'list',
          items: [
            '수익률(영업이익률) = (매출 − 사업비) ÷ 매출 × 100, 사업비 = 인건비 + 제경비 + 기타 직접비',
            '수익률 등급 — 25%↑ S(100) · 18~25% A(85) · 12~18% B(75) · 5~12% C(65) · 5%↓ D(50)',
            '직원 기여도 점수 = 참여 프로젝트별 (수익률 점수 × 기여도 비중)의 가중평균',
            '평가 입력 화면의 "프로젝트 기여도" 항목에서 "기여도 자동 산정" 버튼으로 점수를 반영',
            '입력·수정 권한은 경영지원부(및 admin)로 제한되며, 그 외 관리자는 조회만 가능',
          ],
        },
        {
          type: 'subtitle',
          text: '5.4 평가 시 주의사항',
        },
        {
          type: 'list',
          items: [
            '본인 직급의 기대 등급 범위를 고려하여 평가 (L1은 B~C급 기대, L2는 B~A급 기대 등)',
            '권장 등급 분포 (S 10%, A 20%, B 40%, C 20%, D 10%)를 참고하되, 절대 평가 원칙 유지',
            '자기 평가와 본인 평가의 차이가 큰 경우 평가자 의견란에 사유 명시',
            'PM 겸임 직원의 경우 KPI 계산기에서 PM 지표도 선택적으로 활용 가능',
          ],
        },
        {
          type: 'subtitle',
          text: '5.5 평가자 의견 작성',
        },
        {
          type: 'list',
          items: [
            '강점: 직원이 잘한 부분을 구체적으로 명시',
            '개선점: 직원에게 도움될 건설적 피드백 (인격 비판 금지)',
            '종합 의견: 평가 등급의 근거 + 내년 기대 + 면담 시 논의할 핵심 주제',
          ],
        },
      ],
    },
    {
      id: 'results',
      title: '6. 평가 결과 확인 (manager·admin)',
      audience: 'admin',
      blocks: [
        {
          type: 'subtitle',
          text: '6.1 결과 화면',
        },
        {
          type: 'paragraph',
          text: '평가 결과 메뉴에서 전체 직원의 평가 결과를 한눈에 볼 수 있습니다. 등급, 종합 점수, 인상률, PDF 출력 버튼이 표시됩니다.',
        },
        {
          type: 'subtitle',
          text: '6.2 행 클릭으로 상세 패널 확장',
        },
        {
          type: 'paragraph',
          text: '각 행을 클릭하면 아래로 상세 패널이 펼쳐집니다. 역량·업적 점수 상세, 자기 평가 vs 평가자 평가 비교, 다년도 이력, 평가자 코멘트가 표시됩니다.',
        },
        {
          type: 'subtitle',
          text: '6.3 다년도 이력 네비게이션',
        },
        {
          type: 'paragraph',
          text: '상세 패널의 "다년도 평가 이력" 섹션에서 연도 배지를 클릭하면 "다년도 이력" 메뉴로 자동 이동하면서 해당 직원의 해당 연도가 강조 표시됩니다 (5초간).',
        },
        {
          type: 'subtitle',
          text: '6.4 PDF 평가서 출력',
        },
        {
          type: 'paragraph',
          text: '각 행의 "출력" 버튼 또는 상세 패널의 "PDF 출력" 버튼으로 평가서를 PDF로 출력할 수 있습니다.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: '🔒 권한별 자동 분기',
          text: 'admin·manager가 출력하면 "인사 기록물 (보상 정보 포함)" 평가서, evaluator·employee가 출력하면 "면담용 발췌본 (보상 정보 제외)" 평가서가 자동 생성됩니다. 면담용은 문서번호에 "-INT" 접미사가 붙고 빨간 "면담용" 배지가 표시됩니다.',
        },
      ],
    },
    {
      id: 'promotion',
      title: '7. 승진 심사',
      audience: 'all',
      blocks: [
        {
          type: 'subtitle',
          text: '7.1 승진 체계',
        },
        {
          type: 'paragraph',
          text: '코이션은 9단계 직급 체계를 운영합니다. 각 직급별로 체류 연한과 진급 Point 기준이 정해져 있습니다.',
        },
        {
          type: 'table',
          headers: ['직급', '호칭', '승진 직급', '체류 연한', '진급 Point', '인상률'],
          rows: [
            ['1급', '부장(연구소장)', '임원', '경영진 의사결정', '-', '-'],
            ['2급', '차장', '부장', '4년', '13.5점', '2%'],
            ['3급', '과장', '차장', '3년', '10점', '3%'],
            ['4급', '대리', '과장', '3년', '10점', '4%'],
            ['5급', '주임', '대리', '경영진 의사결정', '-', '5%'],
            ['6급(석사)', '사원', '대리', '2년', '7점', '8%'],
            ['7급(초대졸/대졸)', '사원', '대리', '3년', '10점', '8%'],
            ['8급(고졸)', '사원', '대리', '4년', '14점', '8%'],
            ['사원급', '사원', '주임', '경영진 의사결정', '-', '3%'],
          ],
        },
        {
          type: 'subtitle',
          text: '7.2 진급 Point 계산',
        },
        {
          type: 'paragraph',
          text: '진급 Point = 평가 종합점수 × 0.15 (환산률은 정책 설정에서 조정 가능)',
        },
        {
          type: 'list',
          items: [
            'S등급 (90점) → 13.5 Point (2급/차장 기준 충족)',
            'A등급 (85점) → 12.75 Point',
            'B등급 (75점) → 11.25 Point',
            '70점 → 10.5 Point (3·4·7급 충족 기준)',
          ],
        },
        {
          type: 'subtitle',
          text: '7.3 승진 대상자 자동 판정',
        },
        {
          type: 'paragraph',
          text: '체류 연한을 충족했거나 1년 이내 충족 예정인 직원은 자동으로 "심사 대상"으로 표시됩니다. 평가 입력 화면과 직원 상세 패널에 승진 심사 카드가 자동으로 나타납니다.',
        },
      ],
    },
    {
      id: 'admin',
      title: '8. 관리자 가이드 (admin)',
      audience: 'admin',
      blocks: [
        {
          type: 'subtitle',
          text: '8.1 직원 관리',
        },
        {
          type: 'list',
          items: [
            '직원 추가: 우측 상단 "직원 추가" 버튼 → 사번, 이름, 부서, 직급, 직무군, 입사일, 급여 등 입력',
            '직원 수정: 직원 행 클릭 → 상세 패널 우측 상단 "전체 정보 수정" 버튼',
            '직원 삭제: 직원 수정 모달 하단의 삭제 버튼 (신중히 사용)',
            '메모 추가: 상세 패널의 메모 타임라인에서 7가지 카테고리(평가/근태/교육/계약/징계/포상/기타)로 분류 가능',
            '비밀번호 초기화: 상세 패널 상단의 "🔑 비밀번호 초기화" 버튼',
          ],
        },
        {
          type: 'subtitle',
          text: '8.2 ECount ERP 연동',
        },
        {
          type: 'paragraph',
          text: '직원 관리 헤더의 "ECount 연동" 버튼으로 양방향 데이터 동기화가 가능합니다.',
        },
        {
          type: 'list',
          items: [
            '내보내기 (Export): 22명 직원 데이터를 Excel(.xlsx) 또는 CSV로 다운로드 → ECount 인사관리 → 인사카드 → 가져오기',
            '가져오기 (Import): ECount에서 내보낸 Excel/CSV 업로드 → 사번 기준 자동 매칭 → 신규 추가 또는 업데이트',
            '컬럼 매핑 자동 인식, 사번 중복 처리 자동, 미리보기 단계에서 검증',
          ],
        },
        {
          type: 'subtitle',
          text: '8.3 정책 설정',
        },
        {
          type: 'list',
          items: [
            '평가 가중치: 역량/업적 비율, 8개 항목별 가중치 (합계 100% 필수)',
            '등급 기준: S/A/B/C/D 점수 구간, 인상률, PI 계수',
            'PI/PS 정책: 직무레벨별 PI 기본액, 영업이익 달성률별 PS 비율',
            '승진 정책: 9개 직급별 체류연한·진급Point·인상률 (활성 ON/OFF 토글)',
            'KPI 지표: 직무군별 정량 측정 기준 (Archive·Tech·Biz·PM)',
            '로그인 화면 표지: URL 직접 입력, 캡션 편집, 회사 정보 카드 4개 편집',
          ],
        },
        {
          type: 'subtitle',
          text: '8.4 데이터 백업·복원',
        },
        {
          type: 'list',
          items: [
            '헤더의 "저장" 버튼: localStorage에 즉시 저장',
            '헤더의 "내보내기" 버튼: JSON 파일로 전체 데이터 다운로드',
            '헤더의 "불러오기" 버튼: 백업 JSON 파일 업로드 → 시스템 복원',
            '※ 데이터 손실 방지를 위해 정기 백업 권장 (주 1회 이상)',
          ],
        },
      ],
    },
    {
      id: 'security',
      title: '9. 보안 및 개인정보 보호',
      audience: 'all',
      blocks: [
        {
          type: 'subtitle',
          text: '9.1 비밀번호 보안',
        },
        {
          type: 'list',
          items: [
            '비밀번호는 SHA-256 해시로 저장 (평문 보관 안 됨)',
            '8자 이상, 3종 이상 문자 혼합 필수',
            '본인 ID·이름 포함 금지, 흔한 비밀번호 차단',
            '비밀번호를 타인과 공유하지 마세요',
            '주기적 변경 권장 (3~6개월)',
          ],
        },
        {
          type: 'subtitle',
          text: '9.2 인건비 정보 보호',
        },
        {
          type: 'paragraph',
          text: '예상 인건비·증감액·급여 정보는 admin·manager만 확인 가능합니다. evaluator·employee의 대시보드에서는 인건비 카드가 자동 숨김되며, 메뉴 자체도 권한별로 분리됩니다.',
        },
        {
          type: 'subtitle',
          text: '9.3 평가서 PDF 출력 시 자동 마스킹',
        },
        {
          type: 'paragraph',
          text: 'evaluator·employee가 PDF를 출력하면 자동으로 "면담용 발췌본"이 생성됩니다. 등급·점수·코멘트는 포함되지만 기본급·인상률·PI·PS 등 인건비 정보는 완전히 제외됩니다.',
        },
        {
          type: 'subtitle',
          text: '9.4 외부 유출 방지',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: '⚠ 평가서 외부 유출 금지',
          text: '면담용 발췌본 PDF에는 "본 발췌본은 면담용으로만 사용되며, 외부 유출을 금합니다"라는 경고가 표시됩니다. 평가 결과를 타인에게 공유하거나 외부로 유출하지 마세요.',
        },
      ],
    },
    {
      id: 'faq',
      title: '10. 자주 묻는 질문 (FAQ)',
      audience: 'all',
      blocks: [
        {
          type: 'qa',
          q: 'Q1. 비밀번호를 잊었습니다.',
          a: '인사 담당자(admin)에게 비밀번호 초기화를 요청하세요. 임시 비밀번호를 받으면 첫 로그인 시 즉시 새 비밀번호로 변경해야 합니다.',
        },
        {
          type: 'qa',
          q: 'Q2. 자기 평가를 제출했는데 수정하고 싶습니다.',
          a: '제출 후에는 본인이 직접 수정할 수 없습니다. 인사 담당자에게 자기평가 제출 취소를 요청하세요. 평가자가 이미 검토를 시작한 경우 수정이 불가능할 수 있습니다.',
        },
        {
          type: 'qa',
          q: 'Q3. 다른 사람의 점수나 등급을 알 수 있나요?',
          a: '권한에 따라 다릅니다. employee는 본인 정보만 조회 가능, evaluator는 본인 부서 직원, manager는 본인 본부, admin은 전체 조회 가능합니다. 권한을 벗어난 정보 조회 시도는 시스템 로그에 남습니다.',
        },
        {
          type: 'qa',
          q: 'Q4. L1 신입인데 자기평가에서 너무 낮은 점수를 줘야 하나요?',
          a: 'L1은 B~C급(60~79점)이 기대 수준입니다. 자기 평가는 본인의 실제 수준을 솔직하게 표현하는 것이 중요합니다. 무리하게 높은 점수를 주기보다 학습 의지와 성장 가능성을 의견란에서 어필하세요.',
        },
        {
          type: 'qa',
          q: 'Q5. 평가 결과에 동의하지 않습니다.',
          a: '평가 면담에서 평가자와 직접 논의하세요. 평가자의 코멘트와 본인의 자기평가를 비교해 차이가 큰 부분을 짚어 이야기하는 것이 효과적입니다. 면담 후에도 이의가 있다면 인사 담당자에게 공식 이의 신청이 가능합니다.',
        },
        {
          type: 'qa',
          q: 'Q6. PM 겸임 인력은 어떻게 평가받나요?',
          a: '본인의 기본 직무군(Archive·Tech·Biz)으로 평가받되, 평가자가 KPI 계산기에서 PM 지표 4개를 추가로 선택할 수 있습니다. 본인의 실제 PM 업무 비중에 따라 평가자와 협의됩니다.',
        },
        {
          type: 'qa',
          q: 'Q7. 승진 대상인데 카드가 표시되지 않습니다.',
          a: '체류 연한이 1년 이상 남은 경우 카드가 표시되지 않습니다. 또한 정책 설정에서 승진 심사 기능이 비활성화된 경우에도 표시되지 않습니다. 인사 담당자에게 확인을 요청하세요.',
        },
        {
          type: 'qa',
          q: 'Q8. 시스템 오류가 발생했을 때는?',
          a: '브라우저 새로고침을 먼저 시도하세요. 작성 중이던 평가는 자동 저장되어 있으므로 데이터 손실은 없습니다. 지속적인 오류 시 인사 담당자에게 화면 캡처와 함께 보고하세요.',
        },
      ],
    },
    {
      id: 'contact',
      title: '11. 문의처',
      audience: 'all',
      blocks: [
        {
          type: 'paragraph',
          text: '시스템 사용 중 문의사항이나 오류가 발생하면 다음 담당자에게 문의하세요.',
        },
        {
          type: 'list',
          items: [
            '인사 평가·승진 관련: 경영지원부 인사 담당자',
            '계정·비밀번호 관련: 경영지원부 인사 담당자 (시스템 admin)',
            '시스템 오류·기술 문의: 서비스개발부',
            '회사 정보: 주식회사 코이션 · 강원도 정선군 사북읍',
          ],
        },
      ],
    },
    {
      id: 'eval-guide-detail',
      title: '평가 상세 가이드 (직원용) — 처음이라도 쉽게',
      audience: 'all',
      blocks: [
        { type: 'paragraph', text: '내 점수가 어떻게 만들어지는지, 무엇을 준비해야 하는지 예시와 함께 설명합니다. 처음 평가받는 분은 이 순서대로 따라오시면 됩니다.' },
        { type: 'subtitle', text: '① 평가는 3가지로 구성됩니다' },
        { type: 'table', headers: ['구성', '내용', '누가 매기나'], rows: [
          ['역량평가', '직무 전문성·문제해결·자기계발·협업 (4항목)', '자기평가 + 평가자'],
          ['업적평가', 'KPI 달성도·프로젝트 기여도·납기·고객만족 (4항목)', '자기평가 + 평가자 (기여도는 시스템 자동)'],
          ['목표(MBO)', '연초에 세운 개인 목표의 달성도', '본인 자술 → 평가자 확정'],
        ] },
        { type: 'subtitle', text: '② 직무 트랙에 따라 기여도 기준이 다릅니다' },
        { type: 'table', headers: ['트랙', '대상', '어떻게 평가되나'], rows: [
          ['매출조직', 'PM·수행 인력', '수행 기여 70% + 수주 기여 30% (+겸직·다축 보너스)'],
          ['영업', '영업·사업개발', '수주(제안→계약) 실적. 수주 없으면 기본 20점'],
          ['지원', '경영지원 등 비매출', '전사 성과 40% + 개인 MBO 60% (프로젝트 수익률 미적용)'],
        ] },
        { type: 'callout', variant: 'info', title: '💡 예시로 이해하기', text: '홍길동(PM)이 A사업(수익률 20%→85점)에 60%, B사업(15%→75점)에 40% 참여했다면 수행점수 = 85×0.6 + 75×0.4 = 81점. 여기에 제안에도 참여해 수주로 확정됐다면 수주점수가 30% 반영되고, 겸직이면 보너스가 더해집니다.' },
        { type: 'subtitle', text: '③ 참여율이 낮으면 수행 기여로 안 잡힙니다' },
        { type: 'paragraph', text: '한 사업에 20% 미만으로 참여(예: 제안서지원 5%)한 경우는 "수행"이 아니라 "수주·지원"으로 봅니다. 이런 참여는 수행 점수를 만들지 않고, 그 제안이 수주로 확정되면 수주 기여로 반영됩니다. 즉 5%만 참여했는데 100점을 받는 일은 없습니다.' },
        { type: 'subtitle', text: '④ 수익률 왜곡은 자동 보정됩니다' },
        { type: 'paragraph', text: '완료된 사업은 확정 수익률로, 진행중 사업은 진행률 기준 수익률로 계산합니다. 초기 사업의 계약금액 전액이 매출로 잡혀 점수가 부풀려지는 문제를 막습니다. 통제 밖 요인(발주 지연 등)이 있으면 평가 면담에서 소명할 수 있습니다.' },
        { type: 'subtitle', text: '⑤ 연간 목표(MBO) 작성 요령' },
        { type: 'list', items: [
          '목표는 3~5개, 가중치 합계 100% (한 목표에 40% 초과 배정은 지양)',
          '숫자로 판정 가능하게: "열심히 한다"(X) → "신규 제안 4건 제출"(O)',
          '측정 방법을 함께 적기: 어느 데이터로 판정하는지 (경영보고서·제안현황·지출정리 등)',
          '통제 밖 요인이 큰 목표는 과정지표 병행 (예: 수주액 대신 제안 제출 건수)',
        ] },
        { type: 'callout', variant: 'success', title: '✅ 좋은 목표 예시 (직무별)', text: 'PM: 담당 사업 공헌이익률 15%↑(40%)·납기 100%(30%)·제안 참여 2건(20%)·표준화 1건(10%) / 영업: 신규 수주 3억(40%)·제안 8건 수주율 25%(30%)·신규 발주처 2곳(20%)·카드 태깅 100%(10%) / 경영지원: 결산 D+5 12회(30%)·급여 오류 0건(25%)·판관비 3% 절감(25%)·계약갱신 지연 0건(20%)' },
        { type: 'callout', variant: 'danger', title: '⚠ 피해야 할 목표', text: '"업무에 최선을 다한다"(측정 불가) · "회사 매출 100억"(개인 통제 불가) · "보고서 잘 쓰기"(기준 없음) · 한 목표에 가중치 100% · 12월에 몰아서 달성 가능한 목표' },
        { type: 'subtitle', text: '⑥ 동료평가 작성' },
        { type: 'list', items: [
          '같은 프로젝트를 함께한 동료만 평가하세요 (최대 3명)',
          '3개 항목(협업·소통 / 책임감 / 전문성 기여)을 1~5점으로',
          '"계속했으면 하는 것" "바꿨으면 하는 것"을 반드시 서술 — 점수보다 이 서술이 중요합니다',
          '작성 내용은 평가자만 열람하며, 동료에게는 누가 썼는지 비공개로 요약만 전달됩니다',
        ] },
        { type: 'subtitle', text: '⑦ 나의 진행 순서 (연간)' },
        { type: 'table', headers: ['시기', '할 일'], rows: [
          ['1월 초', "연간 목표(MBO) 작성 → 평가자와 협의·확정"],
          ['7월 초', '반기 중간리뷰 — 목표 진척 점검(점수 없음)'],
          ['12월 1~10일', '자기평가 제출 + 동료평가 작성 (내 평가 메뉴)'],
          ['12월 중', '평가자 1차 → 관리자 2차 검토·확정 → 결과 통보'],
          ['확정 후 3일', '이의신청 — 내 평가의 산출 근거 확인 후 경영지원부에 서면 제출'],
        ] },
        { type: 'callout', variant: 'info', title: '🔎 내 점수 근거 보기', text: "'내 평가' 화면에 수행·수주 점수, 가중치, 보너스가 어떻게 합산됐는지 그대로 표시됩니다. 산정 규칙 자체는 관리자가 정책설정에 공개합니다." },
        { type: 'callout', variant: 'success', title: '🤝 낮은 점수를 받아도', text: '바로 불이익이 아니라 개선 기회(면담 → 3개월 개선목표 → 월 점검 → 재평가)를 먼저 부여합니다.' },
      ],
    },
    {
      id: 'admin-ops-manual',
      title: '[관리자] 평가제도 운영·조직변경 매뉴얼',
      audience: 'admin',
      blocks: [
        { type: 'paragraph', text: '경영·인사 최고담당자가 평가 기준을 수정·보완·삭제하고, 조직·구성원 변경에 대응하는 방법입니다. 이 섹션은 관리자에게만 보입니다.' },
        { type: 'subtitle', text: '1. 이 가이드 자체를 수정/추가/삭제하기' },
        { type: 'list', items: [
          '이 화면 우측 상단의 [편집] 버튼으로 편집 모드 진입 (admin 전용)',
          '문단·목록·표·콜아웃 블록을 추가·수정·삭제하고, 섹션도 추가/삭제 가능',
          '각 섹션의 공개 대상(audience)을 전체/평가자/관리자로 지정 — 관리자 전용 지침은 admin으로',
          '[저장]하면 즉시 반영, [초기화]로 기본 매뉴얼 복원. 저장 내용은 JSON 백업에 포함',
        ] },
        { type: 'subtitle', text: '2. 평가 산정 기준(계수) 수정' },
        { type: 'paragraph', text: '정책 설정 메뉴 → "프로젝트 기여 산정 기준"에서 아래를 직접 조정합니다. 변경 즉시 전 직원 점수에 반영되므로 평가 기간(12월) 중에는 변경하지 마세요.' },
        { type: 'table', headers: ['항목', '기본값', '의미'], rows: [
          ['수행 기여 가중', '70%', '프로젝트 수행 점수의 비중'],
          ['수주 기여 가중', '30%', '제안·수주 점수의 비중'],
          ['수행 인정 최소 참여율', '20%', '미만이면 수행 아님 → 수주 기여로만'],
          ['다축 기여 보너스', '5점', '수행+수주 둘 다 기여 시'],
          ['겸직 보너스', '5점', '경영·관리 겸직자'],
          ['영업 기본점수', '20점', '수주 실적 없는 영업'],
        ] },
        { type: 'subtitle', text: '3. 평가 트랙(매출/영업/지원) 지정·변경' },
        { type: 'list', items: [
          '기본은 매출조직(수행+수주). 영업·지원 트랙은 코드의 명단(SALES_TRACK / SUPPORT_TRACK)으로 지정합니다',
          '현재: 영업 트랙 = 오창민 / 지원 트랙 = 오누리(MBO 미입력=전사성과 적용)',
          '트랙 대상이 바뀌면(예: 새 영업 채용, 지원인력 변경) 시스템 관리자(서비스개발부)에게 명단 수정을 요청하세요',
          '지원 트랙의 MBO 점수는 관리자가 평가 시 산정해 명단에 반영합니다',
        ] },
        { type: 'subtitle', text: '4. 구성원 변경 대응' },
        { type: 'table', headers: ['상황', '조치'], rows: [
          ['신규 입사', '직원 등록(사번·부서·직무군·평가대상 여부). 입사 3개월 미만은 MBO 미입력(전사성과/수습 기준)으로 두고 다음 사이클부터 정식 평가'],
          ['퇴사', "평가대상에서 제외(status 변경). 대여금 있으면 퇴직금 상계 정산, 진행 사업의 기여도는 참여기간까지만 인정"],
          ['부서 이동', '부서·평가 트랙 재지정. 이동 전/후 사업 기여는 각 참여율로 자동 반영됨'],
          ['직무 전환(수행→영업 등)', '평가 트랙 변경 요청. 전환 시점 기준으로 이후 평가 기준 적용'],
          ['승진', '직위·직급 변경. 역량 기준(RUBRICS)은 직급에 맞게 상향 적용'],
        ] },
        { type: 'subtitle', text: '5. 조직(부서·본부) 변경' },
        { type: 'list', items: [
          '부서 신설·통합 시: 소속 직원의 부서명을 일괄 갱신하고, 평가자(1차/2차) 라인을 재설정',
          '비매출 조직이 신설되면 그 인원을 지원 트랙 명단에 추가(전사성과+MBO 기준)',
          '겸직 발령 시: 직원 정보의 비고에 "겸직" 또는 복수 본부(부서명에 / 포함)로 표기하면 겸직 보너스가 자동 인식됨',
          '조직 개편은 평가 기간을 피해 연초(1월) 또는 반기(7월) 시점에 반영 권장',
        ] },
        { type: 'callout', variant: 'warning', title: '⚠ 변경 전 필수', text: '조직·구성원·기준을 변경하기 전에 반드시 [내보내기]로 JSON 백업을 먼저 받으세요. 데이터는 이 브라우저에 저장되므로 되돌리기가 어렵습니다. 큰 변경은 연초/반기에, 평가 확정 기간(12월)에는 지양합니다.' },
        { type: 'subtitle', text: '6. 연말 확정 & 이력 보관' },
        { type: 'list', items: [
          '평가 확정 후 "평가 결과" 화면에서 [연말 확정 스냅샷 저장] — 점수·등급·정책·목표·동료평가가 연도 이력으로 고정',
          '스냅샷 저장 후 반드시 JSON 내보내기로 백업 (이의신청·감사·차년도 비교 근거)',
          '저성과자(60점 미만·D등급)는 결과 화면의 PIP 대상에 자동 표기 — 개선 절차를 문서로 진행',
        ] },
      ],
    },
  ],
};

// ============================================================
// GuideView - 시스템 내 사용 가이드 화면
// 좌측 사이드바 목차 + 우측 본문 + 검색 + 매뉴얼 다운로드 버튼
// admin은 편집 모드로 매뉴얼 수정·저장 가능
// ============================================================
function GuideView({ user, manualContent, onSaveManual, onResetManual }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState(null);
  
  // 편집 모드 (admin 전용)
  const isAdmin = user.role === 'admin';
  const [editMode, setEditMode] = useState(false);
  const [draftContent, setDraftContent] = useState(manualContent);  // 편집 중 임시 데이터
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // manualContent prop이 바뀌면 draft도 동기화 (편집 모드가 아닐 때만)
  useEffect(() => {
    if (!editMode) {
      setDraftContent(manualContent);
      setHasUnsavedChanges(false);
    }
  }, [manualContent, editMode]);
  
  // 사용 중인 콘텐츠 (편집 모드면 draft, 아니면 저장된 manualContent)
  const activeContent = editMode ? draftContent : manualContent;
  
  // 권한별 표시 섹션 필터링 (편집 모드일 땐 admin이니 전체 표시)
  const visibleSections = activeContent.sections.filter(s => {
    if (editMode) return true;  // 편집 모드는 모든 섹션 표시
    if (s.audience === 'all') return true;
    if (s.audience === 'admin' && user.role === 'admin') return true;
    if (s.audience === 'evaluator' && ['admin', 'manager', 'evaluator'].includes(user.role)) return true;
    return false;
  });
  
  // 검색 결과
  const searchMatches = searchQuery.trim() 
    ? visibleSections.filter(s => {
        const haystack = [
          s.title,
          ...s.blocks.flatMap(b => [
            b.text || '', 
            ...(b.items || []),
            ...(b.headers || []),
            ...(b.rows || []).flat(),
            b.q || '', b.a || '',
            b.title || ''
          ])
        ].join(' ').toLowerCase();
        return haystack.includes(searchQuery.toLowerCase());
      })
    : visibleSections;
  
  const current = visibleSections.find(s => s.id === activeSection) || visibleSections[0];
  const currentIndex = activeContent.sections.findIndex(s => s.id === current?.id);
  
  // 편집 모드 진입
  const handleEnterEditMode = () => {
    setDraftContent(manualContent);
    setEditMode(true);
    setHasUnsavedChanges(false);
  };
  
  // 편집 모드 종료 (저장 여부 확인)
  const handleExitEditMode = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('저장하지 않은 수정사항이 있습니다. 정말 나가시겠습니까?')) return;
    }
    setEditMode(false);
    setHasUnsavedChanges(false);
    setDraftContent(manualContent);
  };
  
  // 저장
  const handleSave = () => {
    const result = onSaveManual(draftContent);
    if (result.success) {
      setHasUnsavedChanges(false);
    }
  };
  
  // 섹션 업데이트 핸들러
  const updateSection = (sectionId, updates) => {
    setDraftContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s)
    }));
    setHasUnsavedChanges(true);
  };
  
  // 블록 업데이트
  const updateBlock = (sectionId, blockIndex, updates) => {
    setDraftContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId) return s;
        const newBlocks = [...s.blocks];
        newBlocks[blockIndex] = { ...newBlocks[blockIndex], ...updates };
        return { ...s, blocks: newBlocks };
      })
    }));
    setHasUnsavedChanges(true);
  };
  
  // 블록 추가
  const addBlock = (sectionId, blockType) => {
    const newBlock = createDefaultBlock(blockType);
    setDraftContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, blocks: [...s.blocks, newBlock] } : s
      )
    }));
    setHasUnsavedChanges(true);
  };
  
  // 블록 삭제
  const deleteBlock = (sectionId, blockIndex) => {
    if (!window.confirm('이 블록을 삭제하시겠습니까?')) return;
    setDraftContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { ...s, blocks: s.blocks.filter((_, i) => i !== blockIndex) }
          : s
      )
    }));
    setHasUnsavedChanges(true);
  };
  
  // 블록 이동 (상/하)
  const moveBlock = (sectionId, blockIndex, direction) => {
    setDraftContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId) return s;
        const newBlocks = [...s.blocks];
        const newIndex = blockIndex + direction;
        if (newIndex < 0 || newIndex >= newBlocks.length) return s;
        [newBlocks[blockIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[blockIndex]];
        return { ...s, blocks: newBlocks };
      })
    }));
    setHasUnsavedChanges(true);
  };
  
  // 새 섹션 추가
  const addNewSection = () => {
    const newId = 'new-section-' + Date.now();
    const newSection = {
      id: newId,
      title: '새 섹션',
      audience: 'all',
      blocks: [{ type: 'paragraph', text: '여기에 내용을 입력하세요' }]
    };
    setDraftContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setActiveSection(newId);
    setHasUnsavedChanges(true);
  };
  
  // 섹션 삭제
  const deleteSection = (sectionId) => {
    if (!window.confirm('이 섹션 전체를 삭제하시겠습니까?')) return;
    setDraftContent(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
    // 다른 섹션으로 이동
    const remaining = draftContent.sections.filter(s => s.id !== sectionId);
    if (remaining.length > 0) setActiveSection(remaining[0].id);
    setHasUnsavedChanges(true);
  };
  
  // 섹션 이동
  const moveSection = (sectionId, direction) => {
    setDraftContent(prev => {
      const idx = prev.sections.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.sections.length) return prev;
      const newSections = [...prev.sections];
      [newSections[idx], newSections[newIdx]] = [newSections[newIdx], newSections[idx]];
      return { ...prev, sections: newSections };
    });
    setHasUnsavedChanges(true);
  };
  
  const handleDownloadDocx = async () => {
    try {
      setDownloading('docx');
      await downloadManualAsDocx(manualContent);  // 저장된 콘텐츠로
    } catch (e) {
      alert('Word 매뉴얼 다운로드 실패: ' + e.message);
    } finally {
      setDownloading(null);
    }
  };
  
  const handleDownloadPdf = () => {
    try {
      setDownloading('pdf');
      openManualForPrint(manualContent);  // 저장된 콘텐츠로
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };
  
  return (
    <div>
      <PageHeader 
        eyebrow={editMode ? "EDIT MODE · 매뉴얼 편집 중" : "USER GUIDE · 사용 가이드"}
        title={editMode ? "매뉴얼 편집" : "시스템 사용 매뉴얼"}
        subtitle={editMode 
          ? `${hasUnsavedChanges ? '⚠ 저장하지 않은 수정사항이 있습니다' : '저장된 상태입니다'} · 모든 변경사항은 저장 버튼을 눌러야 반영됩니다`
          : `코이션 인사평가 관리시스템 ${activeContent.version} · ${user.name}님 권한 기준`}
        action={
          editMode ? (
            <div style={{ display: 'flex', gap: S[2] }}>
              <Button variant="outline" size="md" onClick={handleExitEditMode}>편집 종료</Button>
              <Button variant="primary" size="md" icon={Save} onClick={handleSave} disabled={!hasUnsavedChanges}>
                {hasUnsavedChanges ? '저장' : '저장됨'}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: S[2] }}>
              {isAdmin && (
                <Button variant="outline" size="md" icon={Pencil} onClick={handleEnterEditMode}>
                  매뉴얼 편집
                </Button>
              )}
              <Button variant="outline" size="md" icon={Download} onClick={handleDownloadPdf} disabled={downloading}>
                {downloading === 'pdf' ? 'PDF 준비 중...' : 'PDF 인쇄'}
              </Button>
              <Button variant="primary" size="md" icon={Download} onClick={handleDownloadDocx} disabled={downloading}>
                {downloading === 'docx' ? 'Word 생성 중...' : 'Word 다운로드'}
              </Button>
            </div>
          )
        }
      />
      
      {/* 편집 모드 안내 */}
      {editMode && (
        <div style={{ 
          padding: `${S[3]}px ${S[4]}px`, marginBottom: S[4],
          background: '#FFF8E6', borderLeft: `3px solid ${T.warning}`, borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[3]
        }}>
          <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>
            <strong style={{ color: T.warning }}>📝 편집 모드:</strong> 텍스트를 직접 수정하거나 블록을 추가·삭제·이동할 수 있습니다. 
            수정 후 반드시 <strong>저장</strong> 버튼을 눌러야 변경사항이 영구 저장됩니다.
          </div>
          <Button variant="ghost" size="sm" onClick={onResetManual}>
            기본값 복원
          </Button>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: S[5] }}>
        {/* 좌측 목차 */}
        <div style={{ position: 'sticky', top: 90, alignSelf: 'flex-start' }}>
          {/* 검색 (편집 모드에서는 숨김) */}
          {!editMode && (
            <div style={{ marginBottom: S[4] }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="가이드 검색"
                  style={{ 
                    width: '100%', padding: '8px 32px 8px 12px', 
                    border: `1px solid ${T.border}`, borderRadius: 6,
                    fontSize: 12, fontFamily: FONT, outline: 'none',
                    background: T.surface, boxSizing: 'border-box'
                  }}
                />
                <Search size={13} style={{ 
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  color: T.textMute
                }} />
              </div>
              {searchQuery && (
                <div style={{ fontSize: 10, color: T.textMute, marginTop: 4 }}>
                  {searchMatches.length}개 섹션 일치
                </div>
              )}
            </div>
          )}
          
          {/* 목차 */}
          <div style={{ 
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6,
            padding: `${S[3]}px 0`, fontSize: 12
          }}>
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: `0 ${S[4]}px`, marginBottom: S[2]
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em' }}>
                목차
              </span>
              {editMode && (
                <button onClick={addNewSection} title="섹션 추가" style={{ 
                  background: 'transparent', border: 'none', cursor: 'pointer', 
                  color: T.brand, padding: 0, display: 'flex'
                }}>
                  <Plus size={12} />
                </button>
              )}
            </div>
            {searchMatches.map((s, idx) => {
              const sIdx = activeContent.sections.findIndex(x => x.id === s.id);
              return (
                <div key={s.id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setActiveSection(s.id)}
                    style={{ 
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: `${S[2]}px ${S[4]}px`,
                      paddingRight: editMode ? 60 : S[4],
                      background: activeSection === s.id ? T.surfaceAlt : 'transparent',
                      borderLeft: activeSection === s.id ? `3px solid ${T.brand}` : '3px solid transparent',
                      border: 'none', cursor: 'pointer',
                      fontSize: 12, fontFamily: FONT,
                      color: activeSection === s.id ? T.brand : T.text,
                      fontWeight: activeSection === s.id ? 700 : 500,
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => activeSection !== s.id && (e.currentTarget.style.background = T.surfaceAlt)}
                    onMouseLeave={e => activeSection !== s.id && (e.currentTarget.style.background = 'transparent')}
                  >
                    {s.title}
                    {editMode && s.audience !== 'all' && (
                      <span style={{ 
                        marginLeft: 6, padding: '1px 4px', background: T.warning, color: '#fff',
                        fontSize: 8, borderRadius: 2, fontWeight: 700
                      }}>
                        {s.audience}
                      </span>
                    )}
                  </button>
                  {editMode && activeSection === s.id && (
                    <div style={{ 
                      position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                      display: 'flex', gap: 2
                    }}>
                      <button onClick={() => moveSection(s.id, -1)} disabled={sIdx === 0} title="위로" style={iconBtnStyle(sIdx === 0)}>
                        <ChevronDown size={11} style={{ transform: 'rotate(180deg)' }} />
                      </button>
                      <button onClick={() => moveSection(s.id, 1)} disabled={sIdx === activeContent.sections.length - 1} title="아래로" style={iconBtnStyle(sIdx === activeContent.sections.length - 1)}>
                        <ChevronDown size={11} />
                      </button>
                      <button onClick={() => deleteSection(s.id)} title="섹션 삭제" style={{ ...iconBtnStyle(false), color: T.danger }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 도움말 */}
          <div style={{ 
            marginTop: S[3], padding: S[3], background: T.surfaceAlt, borderRadius: 6,
            fontSize: 10, color: T.textMute, lineHeight: 1.6
          }}>
            <strong style={{ color: T.brand, display: 'block', marginBottom: 4 }}>
              {editMode ? '✏️ 편집 모드' : '💡 매뉴얼 활용'}
            </strong>
            {editMode ? (
              <>
                <div>• 텍스트 클릭하여 직접 수정</div>
                <div>• 블록 우측 +/-로 추가·삭제</div>
                <div>• ↑↓ 버튼으로 순서 이동</div>
                <div>• 저장 버튼으로 영구 보관</div>
              </>
            ) : (
              <>
                <div>• <strong>Word 다운로드</strong>: 편집·수정 가능</div>
                <div>• <strong>PDF 인쇄</strong>: 새 창 인쇄 다이얼로그</div>
                <div>• <strong>이 화면</strong>: 검색·실시간 확인</div>
              </>
            )}
          </div>
        </div>
        
        {/* 우측 본문 */}
        <div style={{ ...card(), padding: S[7] }}>
          {current && (editMode ? (
            <EditableManualSection 
              section={current}
              onUpdateSection={(updates) => updateSection(current.id, updates)}
              onUpdateBlock={(blockIndex, updates) => updateBlock(current.id, blockIndex, updates)}
              onAddBlock={(blockType) => addBlock(current.id, blockType)}
              onDeleteBlock={(blockIndex) => deleteBlock(current.id, blockIndex)}
              onMoveBlock={(blockIndex, direction) => moveBlock(current.id, blockIndex, direction)}
            />
          ) : (
            <ManualSection section={current} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 작은 아이콘 버튼 스타일
function iconBtnStyle(disabled) {
  return {
    width: 18, height: 18, padding: 0, 
    background: 'transparent', border: 'none', borderRadius: 3,
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? T.textMute : T.text,
    opacity: disabled ? 0.4 : 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };
}

// 새 블록 기본값 생성
function createDefaultBlock(type) {
  switch (type) {
    case 'paragraph': return { type: 'paragraph', text: '내용을 입력하세요' };
    case 'subtitle': return { type: 'subtitle', text: '소제목' };
    case 'list': return { type: 'list', items: ['항목 1', '항목 2'] };
    case 'table': return { type: 'table', headers: ['헤더1', '헤더2'], rows: [['내용1', '내용2']] };
    case 'callout': return { type: 'callout', variant: 'info', title: '안내', text: '안내 내용' };
    case 'qa': return { type: 'qa', q: 'Q. 질문', a: '답변' };
    default: return { type: 'paragraph', text: '' };
  }
}

// ============================================================
// EditableManualSection - 편집 가능한 매뉴얼 섹션
// admin 전용. 섹션 제목·블록 직접 수정·추가·삭제·이동
// ============================================================
function EditableManualSection({ section, onUpdateSection, onUpdateBlock, onAddBlock, onDeleteBlock, onMoveBlock }) {
  return (
    <div>
      {/* 섹션 메타 (제목 + 권한) */}
      <div style={{ 
        padding: S[3], background: T.surfaceAlt, borderRadius: 6, marginBottom: S[5],
        display: 'grid', gridTemplateColumns: '1fr auto', gap: S[3], alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em', marginBottom: 4 }}>
            섹션 제목
          </div>
          <input 
            type="text"
            value={section.title}
            onChange={e => onUpdateSection({ title: e.target.value })}
            style={{ 
              width: '100%', fontSize: 18, fontWeight: 700, color: T.ink,
              padding: '6px 10px', border: `1px solid ${T.border}`, borderRadius: 4,
              outline: 'none', fontFamily: FONT, background: T.surface
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em', marginBottom: 4 }}>
            대상 권한
          </div>
          <select 
            value={section.audience}
            onChange={e => onUpdateSection({ audience: e.target.value })}
            style={{ 
              padding: '6px 10px', fontSize: 12, fontFamily: FONT,
              border: `1px solid ${T.border}`, borderRadius: 4, background: T.surface,
              outline: 'none'
            }}
          >
            <option value="all">전체 (all)</option>
            <option value="evaluator">평가자+ (evaluator)</option>
            <option value="admin">관리자만 (admin)</option>
          </select>
        </div>
      </div>
      
      {/* 블록 편집 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {section.blocks.map((block, i) => (
          <EditableBlock 
            key={i}
            block={block}
            blockIndex={i}
            isFirst={i === 0}
            isLast={i === section.blocks.length - 1}
            onUpdate={(updates) => onUpdateBlock(i, updates)}
            onDelete={() => onDeleteBlock(i)}
            onMove={(dir) => onMoveBlock(i, dir)}
          />
        ))}
      </div>
      
      {/* 블록 추가 버튼 */}
      <div style={{ 
        marginTop: S[5], padding: S[4], 
        background: T.surfaceAlt, borderRadius: 6,
        border: `1px dashed ${T.border}`
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMute, letterSpacing: '0.1em', marginBottom: S[2] }}>
          + 블록 추가
        </div>
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('subtitle')}>소제목</Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('paragraph')}>단락</Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('list')}>리스트</Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('table')}>표</Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('callout')}>알림 박스</Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('qa')}>Q&A</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EditableBlock - 개별 블록 편집 컴포넌트
// 블록 타입별로 다른 편집 UI
// ============================================================
function EditableBlock({ block, blockIndex, isFirst, isLast, onUpdate, onDelete, onMove }) {
  const wrapStyle = {
    position: 'relative',
    padding: S[3],
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    paddingRight: 56,  // 우측 컨트롤 공간
  };
  
  const inputStyle = {
    width: '100%', padding: '6px 10px',
    border: `1px solid ${T.border}`, borderRadius: 4,
    fontSize: 13, fontFamily: FONT, outline: 'none',
    background: T.surface, color: T.text, lineHeight: 1.6,
    boxSizing: 'border-box', resize: 'vertical'
  };
  
  const renderEditor = () => {
    if (block.type === 'subtitle') {
      return (
        <>
          <BlockTypeLabel type="subtitle" />
          <input 
            type="text" 
            value={block.text || ''} 
            onChange={e => onUpdate({ text: e.target.value })}
            placeholder="소제목"
            style={{ ...inputStyle, fontSize: 15, fontWeight: 700, color: T.brand }}
          />
        </>
      );
    }
    if (block.type === 'paragraph') {
      return (
        <>
          <BlockTypeLabel type="paragraph" />
          <textarea 
            value={block.text || ''} 
            onChange={e => onUpdate({ text: e.target.value })}
            placeholder="단락 내용"
            rows={3}
            style={inputStyle}
          />
        </>
      );
    }
    if (block.type === 'list') {
      const items = block.items || [];
      return (
        <>
          <BlockTypeLabel type="list" />
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: S[2], marginBottom: S[2], alignItems: 'flex-start' }}>
              <span style={{ paddingTop: 8, color: T.textMute }}>•</span>
              <input 
                type="text" 
                value={item} 
                onChange={e => {
                  const newItems = [...items];
                  newItems[i] = e.target.value;
                  onUpdate({ items: newItems });
                }}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button 
                onClick={() => onUpdate({ items: items.filter((_, idx) => idx !== i) })}
                style={{ ...iconBtnStyle(false), width: 24, height: 24, color: T.danger }}
                title="항목 삭제"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" icon={Plus} onClick={() => onUpdate({ items: [...items, ''] })}>
            항목 추가
          </Button>
        </>
      );
    }
    if (block.type === 'table') {
      const headers = block.headers || [];
      const rows = block.rows || [];
      return (
        <>
          <BlockTypeLabel type="table" />
          {/* 헤더 편집 */}
          <div style={{ marginBottom: S[2] }}>
            <div style={{ fontSize: 10, color: T.textMute, marginBottom: 4 }}>헤더</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {headers.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={h} 
                    onChange={e => {
                      const newHeaders = [...headers];
                      newHeaders[i] = e.target.value;
                      onUpdate({ headers: newHeaders });
                    }}
                    style={{ ...inputStyle, width: 100, fontWeight: 700, fontSize: 11 }}
                  />
                  <button 
                    onClick={() => {
                      const newHeaders = headers.filter((_, idx) => idx !== i);
                      const newRows = rows.map(r => r.filter((_, idx) => idx !== i));
                      onUpdate({ headers: newHeaders, rows: newRows });
                    }}
                    style={{ ...iconBtnStyle(false), width: 20, height: 20, color: T.danger }}
                    title="열 삭제"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  onUpdate({ 
                    headers: [...headers, '새 열'], 
                    rows: rows.map(r => [...r, ''])
                  });
                }}
                style={{ padding: '4px 8px', fontSize: 11, color: T.brand, background: 'transparent', border: `1px dashed ${T.brand}`, borderRadius: 4, cursor: 'pointer' }}
              >
                + 열
              </button>
            </div>
          </div>
          {/* 행 편집 */}
          <div>
            <div style={{ fontSize: 10, color: T.textMute, marginBottom: 4 }}>행 ({rows.length}개)</div>
            {rows.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 2, marginBottom: 4, alignItems: 'center' }}>
                {row.map((cell, j) => (
                  <input 
                    key={j}
                    type="text" 
                    value={cell} 
                    onChange={e => {
                      const newRows = [...rows];
                      newRows[i] = [...row];
                      newRows[i][j] = e.target.value;
                      onUpdate({ rows: newRows });
                    }}
                    style={{ ...inputStyle, width: 100, fontSize: 11 }}
                  />
                ))}
                <button 
                  onClick={() => onUpdate({ rows: rows.filter((_, idx) => idx !== i) })}
                  style={{ ...iconBtnStyle(false), width: 20, height: 20, color: T.danger }}
                  title="행 삭제"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            <button 
              onClick={() => onUpdate({ rows: [...rows, headers.map(() => '')] })}
              style={{ padding: '4px 8px', fontSize: 11, color: T.brand, background: 'transparent', border: `1px dashed ${T.brand}`, borderRadius: 4, cursor: 'pointer', marginTop: 4 }}
            >
              + 행 추가
            </button>
          </div>
        </>
      );
    }
    if (block.type === 'callout') {
      return (
        <>
          <BlockTypeLabel type="callout" />
          <div style={{ display: 'flex', gap: S[2], marginBottom: S[2] }}>
            <select 
              value={block.variant || 'info'} 
              onChange={e => onUpdate({ variant: e.target.value })}
              style={{ 
                padding: '6px 10px', fontSize: 12, fontFamily: FONT,
                border: `1px solid ${T.border}`, borderRadius: 4, background: T.surface,
                outline: 'none'
              }}
            >
              <option value="info">정보 (파랑)</option>
              <option value="warning">경고 (주황)</option>
              <option value="success">성공 (초록)</option>
              <option value="danger">위험 (빨강)</option>
            </select>
            <input 
              type="text" 
              value={block.title || ''} 
              onChange={e => onUpdate({ title: e.target.value })}
              placeholder="제목 (예: 💡 알아두세요)"
              style={{ ...inputStyle, flex: 1, fontWeight: 700 }}
            />
          </div>
          <textarea 
            value={block.text || ''} 
            onChange={e => onUpdate({ text: e.target.value })}
            placeholder="알림 내용"
            rows={3}
            style={inputStyle}
          />
        </>
      );
    }
    if (block.type === 'qa') {
      return (
        <>
          <BlockTypeLabel type="qa" />
          <input 
            type="text" 
            value={block.q || ''} 
            onChange={e => onUpdate({ q: e.target.value })}
            placeholder="질문 (예: Q1. 비밀번호를 잊었습니다.)"
            style={{ ...inputStyle, fontWeight: 700, color: T.brand, marginBottom: S[2] }}
          />
          <textarea 
            value={block.a || ''} 
            onChange={e => onUpdate({ a: e.target.value })}
            placeholder="답변"
            rows={3}
            style={inputStyle}
          />
        </>
      );
    }
    return null;
  };
  
  return (
    <div style={wrapStyle}>
      {renderEditor()}
      
      {/* 우측 컨트롤 (이동·삭제) */}
      <div style={{ 
        position: 'absolute', top: S[2], right: S[2],
        display: 'flex', flexDirection: 'column', gap: 2
      }}>
        <button 
          onClick={() => onMove(-1)} 
          disabled={isFirst}
          style={iconBtnStyle(isFirst)}
          title="위로"
        >
          <ChevronDown size={12} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <button 
          onClick={() => onMove(1)} 
          disabled={isLast}
          style={iconBtnStyle(isLast)}
          title="아래로"
        >
          <ChevronDown size={12} />
        </button>
        <button 
          onClick={onDelete}
          style={{ ...iconBtnStyle(false), color: T.danger }}
          title="블록 삭제"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// 블록 타입 라벨
function BlockTypeLabel({ type }) {
  const labels = {
    paragraph: '단락',
    subtitle: '소제목',
    list: '리스트',
    table: '표',
    callout: '알림 박스',
    qa: 'Q&A',
  };
  return (
    <div style={{ 
      fontSize: 9, fontWeight: 700, color: T.brand, letterSpacing: '0.1em',
      marginBottom: 6, textTransform: 'uppercase'
    }}>
      {labels[type] || type}
    </div>
  );
}

// 매뉴얼 섹션 렌더링 (블록 타입별 분기)
function ManualSection({ section }) {
  return (
    <div>
      <h1 style={{ 
        fontSize: 24, fontWeight: 700, color: T.ink, 
        margin: 0, paddingBottom: S[3], marginBottom: S[5],
        borderBottom: `2px solid ${T.brand}`
      }}>
        {section.title}
      </h1>
      
      {section.blocks.map((block, i) => {
        if (block.type === 'subtitle') {
          return (
            <h2 key={i} style={{ 
              fontSize: 16, fontWeight: 700, color: T.brand,
              marginTop: S[5], marginBottom: S[3],
              paddingLeft: S[2], borderLeft: `3px solid ${T.brand}`
            }}>
              {block.text}
            </h2>
          );
        }
        if (block.type === 'paragraph') {
          return (
            <p key={i} style={{ 
              fontSize: 13, lineHeight: 1.8, color: T.text,
              marginBottom: S[3]
            }}>
              {block.text}
            </p>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} style={{ 
              fontSize: 13, lineHeight: 1.9, color: T.text,
              marginBottom: S[3], paddingLeft: S[5]
            }}>
              {block.items.map((item, j) => <li key={j} style={{ marginBottom: 4 }}>{item}</li>)}
            </ul>
          );
        }
        if (block.type === 'table') {
          return (
            <div key={i} style={{ overflowX: 'auto', marginBottom: S[3] }}>
              <table style={{ 
                width: '100%', borderCollapse: 'collapse', fontSize: 12,
                border: `1px solid ${T.border}`, borderRadius: 4, overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: T.brand, color: '#fff' }}>
                    {block.headers.map((h, j) => (
                      <th key={j} style={{ padding: `${S[2]}px ${S[3]}px`, textAlign: 'left', fontWeight: 700, fontSize: 11 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j} style={{ 
                      borderBottom: `1px solid ${T.divider}`,
                      background: j % 2 === 0 ? T.surface : T.surfaceAlt
                    }}>
                      {row.map((cell, k) => (
                        <td key={k} style={{ padding: `${S[2]}px ${S[3]}px`, color: T.text, lineHeight: 1.6 }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === 'callout') {
          const variants = {
            info: { bg: '#F0F4FB', border: T.brand, color: T.brand },
            warning: { bg: '#FFF8E6', border: T.warning, color: T.warning },
            success: { bg: '#F0F7F1', border: T.success, color: T.success },
            danger: { bg: '#FBEAEA', border: T.danger, color: T.danger },
          };
          const v = variants[block.variant] || variants.info;
          return (
            <div key={i} style={{ 
              padding: `${S[3]}px ${S[4]}px`, background: v.bg, 
              borderLeft: `3px solid ${v.border}`, borderRadius: 4,
              marginBottom: S[3]
            }}>
              {block.title && (
                <div style={{ fontSize: 12, fontWeight: 700, color: v.color, marginBottom: 4 }}>
                  {block.title}
                </div>
              )}
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7 }}>
                {block.text}
              </div>
            </div>
          );
        }
        if (block.type === 'qa') {
          return (
            <div key={i} style={{ 
              padding: `${S[3]}px ${S[4]}px`, background: T.surfaceAlt, 
              borderRadius: 6, marginBottom: S[3]
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.brand, marginBottom: 6 }}>
                {block.q}
              </div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.8 }}>
                {block.a}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ============================================================
// 매뉴얼 다운로드 - Word(.docx) 형식
// docx 라이브러리를 CDN에서 동적 로드
// ============================================================
let _docxLibPromise = null;
function loadDocxLib() {
  if (window.docx) return Promise.resolve(window.docx);
  if (_docxLibPromise) return _docxLibPromise;
  _docxLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.min.js';
    script.async = true;
    script.onload = () => {
      if (window.docx) resolve(window.docx);
      else reject(new Error('docx 라이브러리 로드 실패'));
    };
    script.onerror = () => {
      _docxLibPromise = null;
      reject(new Error('Word 라이브러리를 불러올 수 없습니다. 인터넷 연결을 확인해주세요'));
    };
    document.head.appendChild(script);
  });
  return _docxLibPromise;
}

async function downloadManualAsDocx(manualContent) {
  const content = manualContent || MANUAL_CONTENT;
  const docx = await loadDocxLib();
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = docx;
  
  // 색상 (#RRGGBB → 16진수)
  const COLORS = {
    brand: '1B3A6F', text: '2C3540', mute: '6B7280', 
    warning: 'D97706', success: '1B7F4F', danger: 'B91C1C',
    accent: 'D63838', divider: 'F0F2F5'
  };
  
  const children = [
    // 표지 - 회사명
    new Paragraph({
      children: [new TextRun({ text: content.company, size: 20, color: COLORS.mute })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 400 },
    }),
    // 표지 - 제목
    new Paragraph({
      children: [new TextRun({ text: content.title, size: 48, bold: true, color: COLORS.brand })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    // 표지 - 부제
    new Paragraph({
      children: [new TextRun({ text: content.subtitle, size: 22, italics: true, color: COLORS.mute })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    // 표지 - 버전
    new Paragraph({
      children: [new TextRun({ text: `버전 ${content.version}  ·  발행일 ${new Date().toISOString().slice(0, 10)}`, size: 20, color: COLORS.text })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 2400 },
    }),
    // 페이지 나누기
    new Paragraph({ children: [new TextRun({ text: '', break: 1 })], pageBreakBefore: true }),
  ];
  
  // 각 섹션을 변환
  content.sections.forEach(section => {
    // 섹션 제목 (Heading 1)
    children.push(new Paragraph({
      children: [new TextRun({ text: section.title, size: 32, bold: true, color: COLORS.brand })],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 240 },
      border: { bottom: { color: COLORS.brand, space: 4, style: BorderStyle.SINGLE, size: 12 } },
    }));
    
    // 블록들
    section.blocks.forEach(block => {
      if (block.type === 'subtitle') {
        children.push(new Paragraph({
          children: [new TextRun({ text: block.text, size: 24, bold: true, color: COLORS.brand })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 280, after: 140 },
        }));
      } else if (block.type === 'paragraph') {
        children.push(new Paragraph({
          children: [new TextRun({ text: block.text, size: 22, color: COLORS.text })],
          spacing: { after: 120, line: 360 },
        }));
      } else if (block.type === 'list') {
        block.items.forEach(item => {
          children.push(new Paragraph({
            children: [new TextRun({ text: item, size: 22, color: COLORS.text })],
            bullet: { level: 0 },
            spacing: { after: 80, line: 320 },
          }));
        });
      } else if (block.type === 'table') {
        const headerRow = new TableRow({
          children: block.headers.map(h => new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: h, size: 20, bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.LEFT
            })],
            shading: { type: ShadingType.CLEAR, fill: COLORS.brand },
            width: { size: 100 / block.headers.length, type: WidthType.PERCENTAGE },
          })),
        });
        const dataRows = block.rows.map((row, idx) => new TableRow({
          children: row.map(cell => new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: String(cell), size: 20, color: COLORS.text })] 
            })],
            shading: idx % 2 === 1 ? { type: ShadingType.CLEAR, fill: 'F8F9FB' } : undefined,
          })),
        }));
        children.push(new Table({
          rows: [headerRow, ...dataRows],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }));
        children.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 200 } }));
      } else if (block.type === 'callout') {
        const colorMap = { info: COLORS.brand, warning: COLORS.warning, success: COLORS.success, danger: COLORS.danger };
        const fillMap = { info: 'F0F4FB', warning: 'FFF8E6', success: 'F0F7F1', danger: 'FBEAEA' };
        const c = colorMap[block.variant] || COLORS.brand;
        const fill = fillMap[block.variant] || 'F0F4FB';
        if (block.title) {
          children.push(new Paragraph({
            children: [new TextRun({ text: block.title, size: 22, bold: true, color: c })],
            shading: { type: ShadingType.CLEAR, fill },
            spacing: { before: 80, after: 60, line: 320 },
            indent: { left: 200 },
            border: { left: { color: c, space: 4, style: BorderStyle.SINGLE, size: 18 } },
          }));
        }
        children.push(new Paragraph({
          children: [new TextRun({ text: block.text, size: 22, color: COLORS.text })],
          shading: { type: ShadingType.CLEAR, fill },
          spacing: { before: 0, after: 240, line: 340 },
          indent: { left: 200 },
          border: { left: { color: c, space: 4, style: BorderStyle.SINGLE, size: 18 } },
        }));
      } else if (block.type === 'qa') {
        children.push(new Paragraph({
          children: [new TextRun({ text: block.q, size: 22, bold: true, color: COLORS.brand })],
          spacing: { before: 200, after: 80 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: block.a, size: 22, color: COLORS.text })],
          spacing: { after: 160, line: 340 },
          indent: { left: 200 },
        }));
      }
    });
    
    // 섹션 끝 페이지 나누기
    children.push(new Paragraph({ children: [new TextRun({ text: '' })], pageBreakBefore: true }));
  });
  
  const doc = new Document({
    creator: 'KOITION HR System',
    title: content.title,
    description: content.subtitle,
    styles: {
      default: {
        document: { run: { font: 'Malgun Gothic', size: 22 } },
      },
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children,
    }],
  });
  
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `KOITION_HR_매뉴얼_${content.version}_${new Date().toISOString().slice(0, 10)}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ============================================================
// 매뉴얼을 PDF로 인쇄 (새 창 열고 인쇄 다이얼로그)
// ============================================================
function openManualForPrint(manualContent) {
  const content = manualContent || MANUAL_CONTENT;
  const win = window.open('', '_blank');
  if (!win) { alert('팝업 차단을 해제해주세요.'); return; }
  
  const today = new Date().toISOString().slice(0, 10);
  
  // 블록 → HTML 변환
  const renderBlock = (block) => {
    if (block.type === 'subtitle') return `<h2>${block.text}</h2>`;
    if (block.type === 'paragraph') return `<p>${block.text}</p>`;
    if (block.type === 'list') return `<ul>${block.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    if (block.type === 'table') {
      return `<table><thead><tr>${block.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
        block.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')
      }</tbody></table>`;
    }
    if (block.type === 'callout') {
      return `<div class="callout callout-${block.variant}">${
        block.title ? `<div class="callout-title">${block.title}</div>` : ''
      }<div class="callout-text">${block.text}</div></div>`;
    }
    if (block.type === 'qa') {
      return `<div class="qa"><div class="qa-q">${block.q}</div><div class="qa-a">${block.a}</div></div>`;
    }
    return '';
  };
  
  const sectionsHtml = content.sections.map(s => 
    `<section class="manual-section"><h1>${s.title}</h1>${s.blocks.map(renderBlock).join('')}</section>`
  ).join('');
  
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${content.title}</title>
<style>
@page { size: A4; margin: 25mm 20mm 20mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; color: #2C3540; line-height: 1.7; font-size: 11pt; }
.cover { text-align: center; padding: 100px 0 50px; page-break-after: always; }
.cover .company { font-size: 11pt; color: #6B7280; letter-spacing: 0.2em; margin-bottom: 20px; }
.cover .title { font-size: 32pt; font-weight: 700; color: #1B3A6F; margin-bottom: 12px; }
.cover .subtitle { font-size: 13pt; color: #6B7280; font-style: italic; margin-bottom: 60px; }
.cover .meta { font-size: 11pt; color: #2C3540; margin-top: 200px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
.manual-section { page-break-after: always; }
.manual-section:last-child { page-break-after: auto; }
h1 { font-size: 22pt; font-weight: 700; color: #1B3A6F; padding-bottom: 8pt; margin-bottom: 16pt; border-bottom: 3pt solid #1B3A6F; }
h2 { font-size: 14pt; font-weight: 700; color: #1B3A6F; margin: 18pt 0 8pt; padding-left: 8pt; border-left: 3pt solid #1B3A6F; }
p { font-size: 11pt; margin-bottom: 8pt; }
ul { margin: 0 0 10pt 18pt; }
ul li { margin-bottom: 4pt; font-size: 11pt; }
table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 10pt; }
th { background: #1B3A6F; color: #fff; padding: 6pt 8pt; text-align: left; font-weight: 700; font-size: 9pt; }
td { padding: 5pt 8pt; border-bottom: 0.5pt solid #E5E7EB; }
tr:nth-child(even) td { background: #F8F9FB; }
.callout { padding: 8pt 12pt; margin: 10pt 0; border-radius: 3pt; }
.callout-title { font-weight: 700; font-size: 10.5pt; margin-bottom: 4pt; }
.callout-text { font-size: 10.5pt; line-height: 1.6; }
.callout-info { background: #F0F4FB; border-left: 3pt solid #1B3A6F; }
.callout-info .callout-title { color: #1B3A6F; }
.callout-warning { background: #FFF8E6; border-left: 3pt solid #D97706; }
.callout-warning .callout-title { color: #D97706; }
.callout-success { background: #F0F7F1; border-left: 3pt solid #1B7F4F; }
.callout-success .callout-title { color: #1B7F4F; }
.callout-danger { background: #FBEAEA; border-left: 3pt solid #B91C1C; }
.callout-danger .callout-title { color: #B91C1C; }
.qa { background: #F8F9FB; padding: 8pt 12pt; margin-bottom: 8pt; border-radius: 4pt; }
.qa-q { font-weight: 700; color: #1B3A6F; margin-bottom: 4pt; font-size: 11pt; }
.qa-a { color: #2C3540; padding-left: 8pt; font-size: 10.5pt; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<div class="cover">
  <div class="company">${content.company}</div>
  <div class="title">${content.title}</div>
  <div class="subtitle">${content.subtitle}</div>
  <div class="meta">버전 ${content.version}  ·  발행일 ${today}</div>
</div>
${sectionsHtml}
<script>setTimeout(() => { window.print(); }, 800);</script>
</body></html>`;
  win.document.write(html); win.document.close();
}


export default function AppRoot() {
  return <AppErrorBoundary><App /></AppErrorBoundary>;
}
