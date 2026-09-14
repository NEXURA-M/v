/**
 * Nexura Full‑Page Credit Overlay (v2)
 * ─ Mandatory URL hashtags: #nexura, #copy, #copyright, #taqi, #mt
 * ─ User custom hashtags bhi URL mein hone zaroori hain
 * ─ Koi bhi ek missing ho → kuch bhi show nahi hoga
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════
  // 🔒 MANDATORY HASHTAGS — Yeh sab URL mein hona zaroori hai
  // ══════════════════════════════════════════════════════════════════════
  var MANDATORY_HASHTAGS = ['nexura', 'copy', 'copyright', 'taqi', 'mt'];

  // ── User ke custom hashtags parse karo ─────────────────────────────────
  var userHashtags = [];
  if (typeof window.hashtag !== 'undefined' && window.hashtag) {
    userHashtags = String(window.hashtag)
      .split(',')
      .map(function (h) { return h.trim().toLowerCase().replace(/^#/, ''); })
      .filter(function (h) { return h.length > 0; });
  }

  // ── URL hash se hashtags nikalo (comma / slash / plus / space se split) ─
  var rawHash = (window.location.hash || '').replace(/^#/, '').toLowerCase();
  var urlHashtags = rawHash
    .split(/[,/+\s]+/)
    .map(function (h) { return h.trim(); })
    .filter(function (h) { return h.length > 0; });

  // ── Check: saare mandatory hashtags URL mein hone chahiye ──────────────
  var mandatoryOk = MANDATORY_HASHTAGS.every(function (h) {
    return urlHashtags.indexOf(h) !== -1;
  });

  // ── Check: user ke saare custom hashtags bhi URL mein hone chahiye ─────
  var customOk = userHashtags.every(function (h) {
    return urlHashtags.indexOf(h) !== -1;
  });

  // ── Agar koi bhi check fail ho → chup chaap ruk jao ────────────────────
  if (!mandatoryOk || !customOk) {
    return; // ⛔ Kuch bhi show nahi hoga
  }

  // ══════════════════════════════════════════════════════════════════════
  // ✅ Sab check pass — ab overlay banao
  // ══════════════════════════════════════════════════════════════════════

  var DEFAULT_NAME  = 'My Website';
  var DEFAULT_OWNER = 'Anonymous';
  var DEFAULT_IMAGE = 'https://ui-avatars.com/api/?name=User&background=random&size=256';

  function getConfig() {
    return {
      name:  (typeof window.name  !== 'undefined' && window.name)  ? window.name  : DEFAULT_NAME,
      owner: (typeof window.owner !== 'undefined' && window.owner) ? window.owner : DEFAULT_OWNER,
      image: (typeof window.image !== 'undefined' && window.image) ? window.image : DEFAULT_IMAGE
    };
  }

  // ── CSS Inject ──────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('nexura-overlay-styles')) return;

    var style = document.createElement('style');
    style.id = 'nexura-overlay-styles';
    style.textContent = `
      #nexura-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: nexuraFadeIn 0.8s ease-out;
        overflow: hidden;
      }

      #nexura-overlay::before,
      #nexura-overlay::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
        animation: nexuraFloat 8s ease-in-out infinite;
      }
      #nexura-overlay::before {
        width: 400px; height: 400px;
        background: #7c3aed;
        top: -100px; left: -100px;
      }
      #nexura-overlay::after {
        width: 500px; height: 500px;
        background: #06b6d4;
        bottom: -150px; right: -150px;
        animation-delay: 2s;
      }

      @keyframes nexuraFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50%      { transform: translate(30px, -30px) scale(1.1); }
      }

      @keyframes nexuraFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      #nexura-overlay .nexura-card {
        position: relative;
        z-index: 1;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border-radius: 32px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow:
          0 25px 50px -12px rgba(0, 0, 0, 0.6),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        padding: 48px 40px;
        text-align: center;
        max-width: 560px;
        width: 90%;
        animation: nexuraPop 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
      }

      @keyframes nexuraPop {
        from { opacity: 0; transform: scale(0.92) translateY(20px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }

      #nexura-overlay .nexura-close {
        position: absolute;
        top: 18px;
        right: 18px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.2s;
        line-height: 1;
      }
      #nexura-overlay .nexura-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
      }

      #nexura-overlay .nexura-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        margin-bottom: 24px;
        background: #1e1e2e;
      }

      #nexura-overlay .nexura-name {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 6px;
        letter-spacing: -0.5px;
        line-height: 1.2;
      }

      #nexura-overlay .nexura-owner {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 20px;
      }

      #nexura-overlay .nexura-copyfree {
        display: inline-block;
        font-size: 15px;
        font-weight: 700;
        color: #10b981;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 28px;
        padding: 8px 20px;
        border-radius: 40px;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.25);
      }

      #nexura-overlay .nexura-hashtags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin-top: 8px;
      }

      #nexura-overlay .nexura-hashtag {
        font-size: 12px;
        font-weight: 600;
        color: #c4b5fd;
        background: rgba(124, 58, 237, 0.2);
        border: 1px solid rgba(124, 58, 237, 0.3);
        padding: 6px 14px;
        border-radius: 30px;
        letter-spacing: 0.2px;
        transition: background 0.2s, transform 0.2s;
      }
      #nexura-overlay .nexura-hashtag:hover {
        background: rgba(124, 58, 237, 0.35);
        transform: translateY(-1px);
      }

      /* Mandatory badges ko alag color do */
      #nexura-overlay .nexura-hashtag.required {
        color: #6ee7b7;
        background: rgba(16, 185, 129, 0.15);
        border-color: rgba(16, 185, 129, 0.35);
      }
      #nexura-overlay .nexura-hashtag.required:hover {
        background: rgba(16, 185, 129, 0.3);
      }

      @media (max-width: 520px) {
        #nexura-overlay .nexura-card {
          padding: 36px 20px;
          border-radius: 24px;
        }
        #nexura-overlay .nexura-avatar {
          width: 90px;
          height: 90px;
        }
        #nexura-overlay .nexura-name { font-size: 24px; }
        #nexura-overlay .nexura-owner { font-size: 14px; }
        #nexura-overlay .nexura-copyfree {
          font-size: 13px;
          padding: 6px 16px;
        }
        #nexura-overlay .nexura-hashtag {
          font-size: 10px;
          padding: 4px 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Build Overlay DOM ───────────────────────────────────────────────────
  function createOverlay(config) {
    var overlay = document.createElement('div');
    overlay.id = 'nexura-overlay';

    var card = document.createElement('div');
    card.className = 'nexura-card';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'nexura-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.onclick = function () {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(function () { overlay.remove(); }, 300);
    };

    var avatar = document.createElement('img');
    avatar.className = 'nexura-avatar';
    avatar.src = config.image;
    avatar.alt = config.name;
    avatar.onerror = function () { this.src = DEFAULT_IMAGE; };

    var nameEl = document.createElement('div');
    nameEl.className = 'nexura-name';
    nameEl.textContent = config.name;

    var ownerEl = document.createElement('div');
    ownerEl.className = 'nexura-owner';
    ownerEl.textContent = 'by ' + config.owner;

    var copyFree = document.createElement('div');
    copyFree.className = 'nexura-copyfree';
    copyFree.textContent = '✦ This web is copy free';

    // ── Hashtags: mandatory + user custom + name/owner ────────────────────
    var hashtags = document.createElement('div');
    hashtags.className = 'nexura-hashtags';

    var allTags = [];

    // 1) Mandatory hashtags (required class)
    MANDATORY_HASHTAGS.forEach(function (h) {
      allTags.push({ text: '#' + h, required: true });
    });

    // 2) User ke custom hashtags
    userHashtags.forEach(function (h) {
      allTags.push({ text: '#' + h, required: false });
    });

    // 3) Name aur owner se bane hashtags
    if (config.name) {
      allTags.push({ text: '#' + config.name.replace(/\s+/g, ''), required: false });
    }
    if (config.owner) {
      allTags.push({ text: '#' + config.owner.replace(/\s+/g, ''), required: false });
    }

    // Duplicate hatao
    var seen = {};
    allTags = allTags.filter(function (t) {
      var key = t.text.toLowerCase();
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });

    allTags.forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'nexura-hashtag' + (t.required ? ' required' : '');
      span.textContent = t.text;
      hashtags.appendChild(span);
    });

    card.appendChild(closeBtn);
    card.appendChild(avatar);
    card.appendChild(nameEl);
    card.appendChild(ownerEl);
    card.appendChild(copyFree);
    card.appendChild(hashtags);

    overlay.appendChild(card);
    return overlay;
  }

  // ── Init ────────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('nexura-overlay')) return;

    var config = getConfig();
    injectStyles();

    var overlay = createOverlay(config);
    document.body.appendChild(overlay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
