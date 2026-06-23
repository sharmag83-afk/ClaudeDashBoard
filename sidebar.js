// =============================================================
// Sharmaji OS — Persistent sidebar navigation.
// Drop-in replacement for topbar.js. Add to any page with:
//     <script src="sidebar.js" defer></script>
// Desktop (>768px): left sidebar with modules, workstations, ALOK.
// Mobile (≤768px):  top water bar + bottom tab nav (same as before).
// All existing Supabase water sync and WHOOP logic preserved.
// =============================================================
(function () {
  'use strict';

  // ── Supabase config (same as topbar.js) ──
  const SB_URL = (window.DASH_SUPABASE_URL) || 'https://srajryooffirbroltjmg.supabase.co';
  const SB_KEY = (window.DASH_SUPABASE_KEY) || 'sb_publishable_5142ZwTLF_DkSVRzciNuRA_bHwRAu4c';

  const SW = '220px'; // sidebar width

  // ── Page detection ──
  function pageId() {
    const p = (window.location.pathname || '').toLowerCase();
    if (p.endsWith('health.html'))              return 'health';
    if (p.endsWith('gym.html'))                 return 'fitness';
    if (p.endsWith('finance.html'))             return 'finance';
    if (p.endsWith('nova-lite.html'))           return 'nova';
    if (p.endsWith('main.html'))                return 'goals';
    if (p.endsWith('po-water.html'))            return 'health';
    if (p.endsWith('daily-planner.html'))       return 'planner';
    if (p.endsWith('ai-use-cases.html'))        return 'usecases';
    if (p.endsWith('subscriptions.html'))      return 'subscriptions';
    if (p.endsWith('productivity-mentor.html')) return 'productivity';
    if (p.endsWith('personality-mentor.html'))  return 'personality';
    if (p.endsWith('alok.html'))                return 'alok';
    return 'home';
  }

  const PAGE = pageId();
  const isMobile = () => window.innerWidth <= 768;
  const isEmbedded = () => { try { return window.self !== window.top; } catch (e) { return true; } };

  // ── Navigation structure ──
  const MODULES = [
    { id: 'health',   icon: '💪', label: 'Health & Fitness', href: 'health.html' },
    { id: 'finance',  icon: '💰', label: 'Finance',          href: 'finance.html' },
    { id: 'planner',  icon: '📅', label: 'Daily Planner',    href: 'daily-planner.html' },
    { id: 'usecases', icon: '🤖', label: 'AI Use Cases',     href: 'ai-use-cases.html' },
    { id: 'subscriptions', icon: '💳', label: 'Subscriptions',     href: 'subscriptions.html' },
  ];

  const WORKSTATIONS = [
    { id: 'productivity', icon: '⚡', label: 'Productivity',      href: 'productivity-mentor.html' },
    { id: 'fitness',      icon: '🏋️', label: 'Fitness Mentor',    href: 'gym.html' },
    { id: 'personality',  icon: '🌱', label: 'Personality Dev',   href: 'personality-mentor.html' },
    { id: 'nova',         icon: '✨', label: 'AI Mentor — Nova',  href: 'nova-lite.html' },
  ];

  // ── CSS ──
  const css = `
/* ── DESKTOP SIDEBAR ── */
.os-sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: ${SW};
  z-index: 50;
  background: #0a0a0b;
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.os-sidebar-head {
  padding: 18px 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.os-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
}

.os-logo-dot {
  width: 26px; height: 26px;
  border-radius: 6px;
  background: linear-gradient(135deg, #6BE3A4, #7DD3FC);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: #050506;
  flex-shrink: 0;
}

.os-logo-name {
  font-size: 13px; font-weight: 700;
  color: #FAFAFA;
  line-height: 1.2;
}

.os-logo-sub {
  font-size: 10px;
  color: rgba(255,255,255,0.3);
}

/* Water widget in sidebar */
.os-water {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(125,211,252,0.07);
  border: 1px solid rgba(125,211,252,0.14);
  border-radius: 10px;
  padding: 7px 11px;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.os-water:hover { background: rgba(125,211,252,0.12); }
.os-water-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #7DD3FC; flex-shrink: 0;
}
.os-water-dot.warn { background: #fbbf24; }
.os-water-dot.miss {
  background: #ff8a8a;
  animation: os-miss-pulse 1.6s ease-in-out infinite;
}
@keyframes os-miss-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  50%      { box-shadow: 0 0 0 5px rgba(239,68,68,0); }
}
.os-water-label { font-size: 11px; color: rgba(255,255,255,0.45); flex: 1; }
.os-water-count {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 12px; font-weight: 700; color: #FAFAFA;
  font-variant-numeric: tabular-nums;
}
.os-water-add {
  width: 22px; height: 22px;
  background: rgba(125,211,252,0.2);
  border: none; border-radius: 6px;
  color: #7DD3FC; font-size: 16px; font-weight: 700; line-height: 1;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s;
}
.os-water-add:active { transform: scale(0.9); }

/* Nav */
.os-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
.os-nav::-webkit-scrollbar { width: 0; }

.os-nav-section {
  font-size: 9.5px; font-weight: 700;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.09em; text-transform: uppercase;
  padding: 12px 16px 3px;
}

.os-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  color: rgba(255,255,255,0.55);
  font-size: 13px; font-weight: 500;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}
.os-nav-item:hover {
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.04);
}
.os-nav-item.active {
  color: #6BE3A4;
  background: rgba(107,227,164,0.07);
  border-left-color: #6BE3A4;
  font-weight: 600;
}
.os-nav-icon {
  font-size: 15px; width: 18px; text-align: center; flex-shrink: 0;
  filter: grayscale(60%);
  transition: filter 0.15s;
}
.os-nav-item.active .os-nav-icon,
.os-nav-item:hover .os-nav-icon { filter: none; }

/* ALOK button */
.os-sidebar-foot {
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.os-alok-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 13px;
  background: linear-gradient(135deg, rgba(107,227,164,0.18), rgba(125,211,252,0.12));
  border: 1px solid rgba(107,227,164,0.25);
  border-radius: 10px;
  color: #FAFAFA;
  font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.os-alok-btn:hover {
  background: linear-gradient(135deg, rgba(107,227,164,0.28), rgba(125,211,252,0.20));
  border-color: rgba(107,227,164,0.4);
}
.os-alok-btn.active {
  background: linear-gradient(135deg, rgba(107,227,164,0.3), rgba(125,211,252,0.22));
  border-color: #6BE3A4;
}
.os-alok-icon { font-size: 16px; }
.os-alok-lbl { font-size: 13px; font-weight: 600; }
.os-alok-sub { font-size: 10px; opacity: 0.5; font-weight: 400; }

/* Push page content right on desktop */
@media (min-width: 769px) {
  body.os-has-sidebar {
    padding-left: calc(${SW} + 0px) !important;
  }
  .os-sidebar { display: flex; }
}

/* ── MOBILE: hide sidebar, show top+bottom bars ── */
@media (max-width: 768px) {
  .os-sidebar { display: none !important; }
  body.os-has-sidebar { padding-left: 0 !important; }
}

/* ── MOBILE TOPBAR ── */
.os-topbar {
  position: sticky; top: 0; z-index: 40;
  display: none;
  justify-content: flex-end; align-items: center;
  gap: 8px;
  padding: max(10px, env(safe-area-inset-top)) 14px 8px;
  background: #0a0a0b;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
}
@media (max-width: 768px) {
  .os-topbar { display: flex; }
}

.os-tb-water-wrap { display: flex; align-items: stretch; }
.os-tb-water-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 14px;
  background: rgba(125,211,252,0.08);
  border: 1px solid rgba(125,211,252,0.16);
  border-right: none;
  border-radius: 12px 0 0 12px;
  text-decoration: none; color: #FAFAFA;
  -webkit-tap-highlight-color: transparent;
}
.os-tb-water-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #7DD3FC; flex-shrink: 0;
}
.os-tb-water-dot.warn { background: #fbbf24; }
.os-tb-water-dot.miss {
  background: #ff8a8a;
  animation: os-miss-pulse 1.6s ease-in-out infinite;
}
.os-tb-count {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px; font-weight: 700; color: #FAFAFA;
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.os-tb-add {
  width: 44px;
  border: 1px solid rgba(125,211,252,0.16);
  background: linear-gradient(180deg, rgba(125,211,252,0.28), rgba(110,231,183,0.28));
  color: #fff; font-family: inherit; font-size: 20px; font-weight: 700; line-height: 1;
  cursor: pointer; border-radius: 0 12px 12px 0;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, transform 0.1s;
}
.os-tb-add:active { transform: scale(0.94); }
.os-tb-add.flash { background: linear-gradient(180deg, rgba(125,211,252,0.7), rgba(110,231,183,0.7)); }
.os-tb-finance {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 42px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
  border-radius: 12px; text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}
.os-tb-finance:hover { background: rgba(255,255,255,0.08); }
.os-tb-finance-icon { font-size: 20px; line-height: 1; filter: grayscale(100%) brightness(1.4); opacity: 0.85; }

/* ── MOBILE BOTTOM BAR ── */
.os-bottombar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
  display: none;
  justify-content: space-around; align-items: stretch;
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
  background: #0a0a0b;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
}
@media (max-width: 768px) {
  .os-bottombar { display: flex; }
  body.os-has-sidebar { padding-bottom: calc(72px + env(safe-area-inset-bottom)) !important; }
}
.os-btab {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 3px; padding: 6px 0 4px;
  text-decoration: none;
  color: rgba(255,255,255,0.45);
  font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s;
}
.os-btab-icon {
  font-size: 24px; line-height: 1;
  filter: grayscale(100%) brightness(1.2); opacity: 0.55;
  transition: opacity 0.15s, filter 0.15s, transform 0.10s;
}
.os-btab.active { color: #FAFAFA; }
.os-btab.active .os-btab-icon { filter: grayscale(0%) brightness(1); opacity: 1; }
.os-btab:active .os-btab-icon { transform: scale(0.92); }

/* ── Global mobile tweaks (preserve from topbar.js) ── */
html, body { -webkit-text-size-adjust: 100%; }
@media (max-width: 768px) {
  html { touch-action: pan-y; }
  ::-webkit-scrollbar { width: 0; height: 0; display: none; }
  html, body { scrollbar-width: none; -ms-overflow-style: none; }
}
.modal-bg, .modal, .po-modal-bg, .po-modal, .wt-overlay, .wt-viewer {
  overscroll-behavior: contain;
}
body.os-modal-open { overflow: hidden; touch-action: none; }
@media (max-width: 480px) {
  .modal-bg, .po-modal-bg { padding: 0 !important; align-items: stretch !important; justify-content: stretch !important; }
  .modal, .po-modal {
    width: 100% !important; max-width: 100% !important;
    max-height: 100vh !important; height: 100vh !important;
    border-radius: 0 !important;
    padding-top: max(20px, env(safe-area-inset-top)) !important;
    padding-bottom: max(28px, env(safe-area-inset-bottom)) !important;
    overflow-y: auto !important; overscroll-behavior: contain;
  }
}
`;

  // ── HTML ──
  function buildSidebarHtml() {
    const navItem = (item) => {
      const active = PAGE === item.id ? ' active' : '';
      return `<a href="${item.href}" class="os-nav-item${active}">
        <span class="os-nav-icon">${item.icon}</span>${item.label}</a>`;
    };
    const alokActive = PAGE === 'alok' ? ' active' : '';
    return `
<aside class="os-sidebar" id="os-sidebar" role="navigation" aria-label="Sharmaji OS">
  <div class="os-sidebar-head">
    <div class="os-logo">
      <div class="os-logo-dot">S</div>
      <div>
        <div class="os-logo-name">Sharmaji OS</div>
        <div class="os-logo-sub">Personal Command Centre</div>
      </div>
    </div>
    <a href="po-water.html" class="os-water" id="os-water" aria-label="Water progress">
      <span class="os-water-dot" id="os-water-dot"></span>
      <span class="os-water-label">Water</span>
      <span class="os-water-count" id="os-water-count">0/0</span>
      <button class="os-water-add" id="os-water-add" type="button" aria-label="Log drink" onclick="event.preventDefault();event.stopPropagation();window.__osAddWater&&window.__osAddWater()">+</button>
    </a>
  </div>
  <nav class="os-nav">
    <div class="os-nav-section">Modules</div>
    ${MODULES.map(navItem).join('')}
    <div class="os-nav-section">Workstations</div>
    ${WORKSTATIONS.map(navItem).join('')}
  </nav>
  <div class="os-sidebar-foot">
    <a href="alok.html" class="os-alok-btn${alokActive}">
      <span class="os-alok-icon">📱</span>
      <div>
        <div class="os-alok-lbl">ALOK</div>
        <div class="os-alok-sub">Telegram assistant</div>
      </div>
    </a>
  </div>
</aside>`;
  }

  function buildMobileHtml() {
    const mobilePageMap = {
      home: 'main', goals: 'main', health: 'health', fitness: 'fitness',
      finance: 'finance', nova: 'nova', planner: 'main', usecases: 'nova',
      productivity: 'main', personality: 'nova', alok: 'nova',
    };
    const active = mobilePageMap[PAGE] || 'main';
    const tabs = [
      { id: 'main',    icon: '🏠', label: 'Home',    href: 'index.html' },
      { id: 'health',  icon: '💪', label: 'Health',  href: 'health.html' },
      { id: 'fitness', icon: '🏋️', label: 'Fitness', href: 'gym.html' },
      { id: 'finance', icon: '💰', label: 'Finance', href: 'finance.html' },
      { id: 'nova',    icon: '✨', label: 'Nova',    href: 'nova-lite.html' },
    ];
    return `
<header class="os-topbar" id="os-topbar">
  <div class="os-tb-water-wrap">
    <a href="po-water.html" class="os-tb-water-pill" id="os-tb-water">
      <span class="os-tb-water-dot" id="os-tb-dot"></span>
      <span class="os-tb-count" id="os-tb-count">0/0</span>
    </a>
    <button class="os-tb-add" id="os-tb-add" type="button" aria-label="Log drink">+</button>
  </div>
  <a href="finance.html" class="os-tb-finance">
    <span class="os-tb-finance-icon">📊</span>
  </a>
</header>
<nav class="os-bottombar" id="os-bottombar">
  ${tabs.map(t => `<a href="${t.href}" class="os-btab${active===t.id?' active':''}">
    <span class="os-btab-icon">${t.icon}</span><span>${t.label}</span></a>`).join('')}
</nav>`;
  }

  // ── Water helpers (identical logic to topbar.js) ──
  function dateKey() {
    const d = new Date(); const n = new Date(d);
    if (d.getHours() < 6) n.setDate(n.getDate() - 1);
    return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0');
  }
  function calKey() {
    const d = new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function defaultWater() {
    return { unit:'bottle', bottleMl:500, glassMl:250, weightUnit:'kg',
      profile:{ weightKg:75, age:25, sex:'m', activityHrsPerWeek:5 },
      caffeineMgPerDay:200, substances:[], logs:{} };
  }
  function getWaterProgress() {
    let s = null; try { s = JSON.parse(localStorage.getItem('po_water_v1')); } catch(e) {}
    if (!s) return { done:0, total:0 };
    const done = (s.logs || {})[calKey()] || 0;
    const p = s.profile || { weightKg:75 };
    const wKg = s.weightUnit === 'lb' ? (p.weightKg||0)/2.20462 : (p.weightKg||0);
    const base = wKg * 35;
    const exercise = (p.activityHrsPerWeek||0)/7*500;
    const caffeine = Math.max(0, (s.caffeineMgPerDay||0)-200)*1.5;
    const subs = (s.substances||[]).reduce((acc, x) => {
      const dose = (x&&x.dose!=null?x.dose:(x&&x.defaultDose))||0;
      return acc + Math.max(0, dose*((x&&x.mlPerUnit)||0));
    }, 0);
    let adj = 0;
    if (p.sex==='m') adj += 200;
    if ((p.age||0) >= 50) adj += 100;
    const totalMl = base + exercise + caffeine + subs + adj;
    let unitVol;
    if (s.unit==='glass') unitVol = s.glassMl||250;
    else if (s.unit==='oz') unitVol = 30;
    else if (s.unit==='ml') unitVol = 1;
    else unitVol = s.bottleMl||500;
    const total = Math.max(1, Math.ceil(totalMl/unitVol));
    return { done, total };
  }
  function waterStatus(done, total) {
    if (!total) return 'idle';
    if (done >= total) return 'good';
    if (new Date().getHours() >= 18 && done < total*0.5) return 'miss';
    return 'warn';
  }

  function render() {
    const w = getWaterProgress();
    const txt = w.total ? w.done+'/'+w.total : '0/0';
    const status = waterStatus(w.done, w.total);

    // Sidebar water widget
    const sc = document.getElementById('os-water-count');
    const sd = document.getElementById('os-water-dot');
    if (sc) sc.textContent = txt;
    if (sd) { sd.className = 'os-water-dot' + (status==='warn'?' warn':status==='miss'?' miss':''); }

    // Mobile topbar water
    const tc = document.getElementById('os-tb-count');
    const td = document.getElementById('os-tb-dot');
    if (tc) tc.textContent = txt;
    if (td) { td.className = 'os-tb-water-dot' + (status==='warn'?' warn':status==='miss'?' miss':''); }
  }

  async function pushToSupabase(localWater) {
    const onHealthPage = (window.location.pathname||'').toLowerCase().endsWith('health.html');
    if (onHealthPage) return;
    if (!window.supabase || !SB_URL || SB_URL.indexOf('PASTE-')===0) return;
    try {
      const supa = window.supabase.createClient(SB_URL, SB_KEY);
      const { data } = await supa.from('app_state').select('data').eq('key','health').maybeSingle();
      const current = (data&&data.data)||{};
      const merged = Object.assign({}, current, { po_water_v1: localWater });
      await supa.from('app_state').upsert(
        { key:'health', data:merged, updated_at:new Date().toISOString() }, { onConflict:'key' }
      );
    } catch(e) {}
  }

  function addWater() {
    let s = null; try { s = JSON.parse(localStorage.getItem('po_water_v1')); } catch(e) {}
    if (!s || typeof s !== 'object') s = defaultWater();
    s.logs = s.logs || {};
    const k = calKey(); s.logs[k] = (s.logs[k]||0)+1;
    try { localStorage.setItem('po_water_v1', JSON.stringify(s)); } catch(e) {}
    render();
    // Flash button
    ['os-water-add','os-tb-add'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) { btn.classList.add('flash'); setTimeout(()=>btn.classList.remove('flash'),220); }
    });
    pushToSupabase(s);
  }

  // Expose globally for the onclick attribute in sidebar HTML
  window.__osAddWater = addWater;

  // ── Modal scroll lock ──
  function startModalLock() {
    const SELS = ['.modal-bg','.po-modal-bg','.wt-overlay','.wt-viewer','.wt-cam'];
    function anyOpen() {
      for (const sel of SELS) {
        for (const el of document.querySelectorAll(sel)) {
          if (el.classList.contains('show')||el.classList.contains('is-open')) return true;
        }
      }
      return false;
    }
    function sync() { document.body.classList.toggle('os-modal-open', anyOpen()); }
    new MutationObserver(sync).observe(document.body, { attributes:true, attributeFilter:['class'], subtree:true });
    sync();
  }

  // ── Gesture lock (iOS) ──
  function lockGestures() {
    const blk = e => e.preventDefault();
    document.addEventListener('gesturestart', blk, {passive:false});
    document.addEventListener('gesturechange', blk, {passive:false});
    document.addEventListener('gestureend', blk, {passive:false});
    let lastTouch = 0;
    document.addEventListener('touchend', e => {
      const now = Date.now();
      if (now-lastTouch <= 300) e.preventDefault();
      lastTouch = now;
    }, {passive:false});
  }

  // ── Inject ──
  function inject() {
    if (isEmbedded()) return;
    if (document.getElementById('os-sidebar')||document.getElementById('os-topbar')) return;

    // Inject CSS
    const style = document.createElement('style');
    style.id = 'os-sidebar-style';
    style.textContent = css;
    document.head.appendChild(style);

    // Inject sidebar (always, both desktop and mobile — CSS hides appropriately)
    const sidebarWrap = document.createElement('div');
    sidebarWrap.innerHTML = buildSidebarHtml().trim();
    document.body.insertBefore(sidebarWrap.firstChild, document.body.firstChild);

    // Inject mobile chrome
    const mobileWrap = document.createElement('div');
    mobileWrap.innerHTML = buildMobileHtml().trim();
    // Topbar goes first child
    document.body.insertBefore(mobileWrap.children[0], document.body.firstChild);
    // Bottombar goes last
    document.body.appendChild(mobileWrap.children[0]);

    document.body.classList.add('os-has-sidebar');

    // Wire mobile water buttons
    const tbAdd = document.getElementById('os-tb-add');
    if (tbAdd) tbAdd.addEventListener('click', e => { e.preventDefault(); addWater(); });
  }

  // ── Boot ──
  function boot() {
    inject();
    render();
    lockGestures();
    startModalLock();

    window.addEventListener('storage', render);
    window.addEventListener('focus', render);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
    setInterval(render, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {once:true});
  } else {
    boot();
  }
})();
