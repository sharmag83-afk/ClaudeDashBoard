/**
 * lock.js — simple password gate for the dashboard
 * Default password: qwer
 * Password is stored as a SHA-256 hash in localStorage so it's never in plain text.
 */
(function () {
  'use strict';

  const LOCK_KEY   = 'dash_unlocked_v1';
  const HASH_KEY   = 'dash_pw_hash_v1';
  const DEFAULT_PW = 'qwer';

  // --- SHA-256 helper (Web Crypto API) ---
  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // --- Overlay HTML ---
  const overlay = document.createElement('div');
  overlay.id = 'lock-overlay';
  overlay.innerHTML = `
    <style>
      #lock-overlay {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        background: #050506;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
      }
      #lock-box {
        width: 100%; max-width: 320px; padding: 32px 28px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.6);
        backdrop-filter: blur(24px);
        text-align: center;
      }
      #lock-icon { font-size: 36px; margin-bottom: 12px; }
      #lock-title {
        font-size: 20px; font-weight: 700; letter-spacing: -0.02em;
        color: #FAFAFA; margin: 0 0 6px;
      }
      #lock-sub {
        font-size: 13px; color: #76746E; margin: 0 0 24px;
      }
      #lock-input {
        width: 100%; padding: 12px 14px; box-sizing: border-box;
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 12px; background: rgba(0,0,0,0.3);
        color: #FAFAFA; font-size: 15px; font-family: inherit;
        outline: none; text-align: center; letter-spacing: 0.1em;
        transition: border-color 0.2s;
        margin-bottom: 12px;
      }
      #lock-input:focus { border-color: rgba(255,255,255,0.3); }
      #lock-input.error { border-color: #F87171; animation: shake 0.3s ease; }
      #lock-btn {
        width: 100%; padding: 13px;
        border: 0; border-radius: 12px;
        background: linear-gradient(180deg, #FFFFFF, #E8E5DD);
        color: #0A0A0B; font-size: 14px; font-weight: 700;
        font-family: inherit; cursor: pointer;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 22px rgba(0,0,0,0.25);
        transition: filter 0.15s, transform 0.1s;
      }
      #lock-btn:hover { filter: brightness(1.05); }
      #lock-btn:active { transform: translateY(1px); }
      #lock-err {
        font-size: 12px; color: #F87171; margin-top: 10px;
        min-height: 16px;
      }
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }
    </style>
    <div id="lock-box">
      <div id="lock-icon">🔒</div>
      <div id="lock-title">Sharmaji Dashboard</div>
      <div id="lock-sub">Enter your password to continue</div>
      <input id="lock-input" type="password" placeholder="Password" autocomplete="current-password">
      <button id="lock-btn" type="button">Unlock</button>
      <div id="lock-err"></div>
    </div>
  `;

  // Prevent page from being visible while locked
  document.documentElement.style.visibility = 'hidden';

  async function init() {
    // Ensure a stored hash exists (first run: store default password hash)
    if (!localStorage.getItem(HASH_KEY)) {
      localStorage.setItem(HASH_KEY, await sha256(DEFAULT_PW));
    }

    // If already unlocked in this session, show page immediately
    if (sessionStorage.getItem(LOCK_KEY) === '1') {
      document.documentElement.style.visibility = '';
      return;
    }

    // Show lock screen
    document.documentElement.style.visibility = '';
    document.body.appendChild(overlay);

    const input = document.getElementById('lock-input');
    const btn   = document.getElementById('lock-btn');
    const err   = document.getElementById('lock-err');

    async function attempt() {
      const hash = await sha256(input.value);
      if (hash === localStorage.getItem(HASH_KEY)) {
        sessionStorage.setItem(LOCK_KEY, '1');
        overlay.remove();
      } else {
        input.classList.remove('error');
        void input.offsetWidth; // reflow to restart animation
        input.classList.add('error');
        err.textContent = 'Incorrect password';
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') attempt(); });
    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
