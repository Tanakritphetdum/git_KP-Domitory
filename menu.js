console.log('[KP Menu] menu.js loaded v4');

const KPMenu = (() => {

  const LOGIN_PAGE = 'kpdormlogin.html';

  const MENU_ITEMS = [
    {
      id: 'dashboard',
      label: 'หน้าหลัก',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>`,
      href: 'main.html'
    },
    {
      id: 'rooms',
      label: 'จัดการห้องพัก',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>`,
      href: 'rooms.html'
    },
    {
      id: 'users',
      label: 'จัดการ User',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>`,
      href: 'users.html'
    }
  ];

  function getSession() {
    try {
      // รองรับทั้ง localStorage และ sessionStorage
      const raw = localStorage.getItem('kp_user')
               || sessionStorage.getItem('kp_user');
      console.log('[KP Menu] session raw:', raw);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      console.log('[KP Menu] session parsed:', parsed);
      return parsed;
    } catch(e) {
      console.log('[KP Menu] parse error:', e);
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem('kp_user');
    sessionStorage.removeItem('kp_user');
    console.log('[KP Menu] session cleared');
  }

  function logout() {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
      clearSession();
      window.location.href = LOGIN_PAGE;
    }
  }

  function getActiveId() {
    const page = window.location.pathname.split('/').pop() || 'main.html';
    if (page === 'main.html' || page === '') return 'dashboard';
    if (page.includes('room')) return 'rooms';
    if (page.includes('user')) return 'users';
    return '';
  }

  function getTypeLabel(type) {
    const map = { '1': 'ผู้ดูแลระบบ', '2': 'Super Admin', '3': 'ผู้จัดการ', '4': 'พนักงาน' };
    return map[String(type)] || `Type ${type}`;
  }

  function getAvatarLetters(name) {
    if (!name) return 'KP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  function render(containerId = 'sidebar-container') {
    const user = getSession();
    console.log('[KP Menu] render user:', user);

    if (!user) {
      console.log('[KP Menu] no session → redirect to', LOGIN_PAGE);
      window.location.href = LOGIN_PAGE;
      return;
    }

    const activeId = getActiveId();

    const menuHTML = MENU_ITEMS.map(item => `
      <a href="${item.href}" class="kp-menu-item ${item.id === activeId ? 'active' : ''}" data-id="${item.id}">
        <span class="kp-menu-icon">${item.icon}</span>
        <span class="kp-menu-label">${item.label}</span>
      </a>
    `).join('');

    const sidebarHTML = `
      <style>
        :root {
          --sb-w: 240px;
          --sb-orange: #F97316;
          --sb-orange-dark: #EA580C;
          --sb-orange-pale: #FFF7ED;
          --sb-bg: #FFFFFF;
          --sb-border: #F3F4F6;
          --sb-text: #374151;
          --sb-muted: #9CA3AF;
          --sb-hover: #FFF7ED;
        }
        #kp-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: var(--sb-w);
          background: var(--sb-bg);
          border-right: 1px solid var(--sb-border);
          display: flex; flex-direction: column;
          z-index: 100;
          transition: transform .3s cubic-bezier(.4,0,.2,1);
          box-shadow: 2px 0 16px rgba(0,0,0,0.04);
        }
        .kp-sb-brand {
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--sb-border);
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        }
        .kp-sb-logo {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #F97316, #EA580C);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(249,115,22,0.3);
        }
        .kp-sb-logo svg { width: 20px; height: 20px; stroke: #fff; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .kp-sb-brand-text { line-height: 1.2; }
        .kp-sb-brand-name { font-size: 15px; font-weight: 700; color: #111827; font-family: 'Prompt', sans-serif; letter-spacing: -.2px; }
        .kp-sb-brand-name span { color: #F97316; }
        .kp-sb-brand-sub { font-size: 10px; color: var(--sb-muted); font-weight: 400; }
        .kp-sb-nav {
          flex: 1; overflow-y: auto; padding: 12px 12px 0;
          display: flex; flex-direction: column; gap: 2px;
        }
        .kp-sb-nav::-webkit-scrollbar { width: 4px; }
        .kp-sb-nav::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 2px; }
        .kp-sb-section {
          font-size: 10px; font-weight: 600; color: var(--sb-muted);
          text-transform: uppercase; letter-spacing: .08em;
          padding: 12px 8px 6px;
        }
        .kp-menu-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; color: var(--sb-text);
          font-size: 14px; font-weight: 500;
          transition: background .15s, color .15s;
          cursor: pointer; font-family: 'Sarabun', sans-serif;
        }
        .kp-menu-item:hover { background: var(--sb-hover); color: #F97316; }
        .kp-menu-item.active {
          background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
          color: #EA580C; font-weight: 600;
          box-shadow: inset 3px 0 0 #F97316;
        }
        .kp-menu-icon { width: 20px; height: 20px; flex-shrink: 0; display: flex; align-items: center; }
        .kp-menu-icon svg { width: 100%; height: 100%; }
        .kp-menu-label { flex: 1; }
        .kp-sb-footer { border-top: 1px solid var(--sb-border); padding: 14px; flex-shrink: 0; }
        .kp-user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px; background: #F9FAFB;
          border-radius: 12px; margin-bottom: 8px;
        }
        .kp-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #F97316, #EA580C);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
          flex-shrink: 0; font-family: 'Prompt', sans-serif;
        }
        .kp-user-info { flex: 1; min-width: 0; }
        .kp-user-name { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .kp-user-role { font-size: 11px; color: var(--sb-muted); }
        .kp-user-email { font-size: 11px; color: #F97316; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .kp-btn-logout {
          width: 100%; padding: 9px; border-radius: 10px;
          background: #FEF2F2; border: 1px solid #FECACA;
          color: #991B1B; font-size: 13px; font-weight: 500;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: background .15s; font-family: 'Sarabun', sans-serif;
        }
        .kp-btn-logout:hover { background: #FEE2E2; }
        .kp-btn-logout svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        #kp-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.4); z-index: 99;
          backdrop-filter: blur(2px);
        }
        #kp-overlay.show { display: block; }
        #kp-hamburger {
          display: none; position: fixed; top: 14px; left: 14px; z-index: 101;
          background: #fff; border: 1px solid #E5E7EB; border-radius: 10px;
          width: 40px; height: 40px; cursor: pointer;
          align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: background .15s;
        }
        #kp-hamburger:hover { background: #FFF7ED; }
        #kp-hamburger svg { width: 20px; height: 20px; stroke: #374151; fill: none; stroke-width: 1.8; stroke-linecap: round; }
        @media (max-width: 768px) {
          #kp-sidebar { transform: translateX(calc(-1 * var(--sb-w))); }
          #kp-sidebar.mobile-open { transform: translateX(0); }
          #kp-hamburger { display: flex; }
          .kp-main-content { margin-left: 0 !important; }
        }
      </style>

      <div id="kp-overlay"></div>
      <button id="kp-hamburger" aria-label="เปิดเมนู">
        <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <nav id="kp-sidebar" role="navigation" aria-label="Main navigation">
        <div class="kp-sb-brand">
          <div class="kp-sb-logo">
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div class="kp-sb-brand-text">
            <div class="kp-sb-brand-name">KP <span>Dorm</span>itory</div>
            <div class="kp-sb-brand-sub">Property Management</div>
          </div>
        </div>

        <div class="kp-sb-nav">
          <div class="kp-sb-section">เมนูหลัก</div>
          ${menuHTML}
        </div>

        <div class="kp-sb-footer">
          <div class="kp-user-card">
            <div class="kp-avatar">${getAvatarLetters(user.res_name)}</div>
            <div class="kp-user-info">
              <div class="kp-user-name">${user.res_name || user.res_users}</div>
              <div class="kp-user-role">${getTypeLabel(user.res_type)}</div>
              <div class="kp-user-email">${user.res_email || ''}</div>
            </div>
          </div>
          <button class="kp-btn-logout" id="kp-logout-btn">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            ออกจากระบบ
          </button>
        </div>
      </nav>
    `;

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = sidebarHTML;
    } else {
      const div = document.createElement('div');
      div.id = containerId;
      div.innerHTML = sidebarHTML;
      document.body.prepend(div);
    }

    document.getElementById('kp-logout-btn').addEventListener('click', logout);

    const hamburger = document.getElementById('kp-hamburger');
    const sidebar   = document.getElementById('kp-sidebar');
    const overlay   = document.getElementById('kp-overlay');

    hamburger.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
      overlay.classList.add('show');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('show');
    });

    // Swipe-to-close on mobile
    let touchStartX = 0;
    sidebar.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
    sidebar.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx < -60) closeSidebar();
    }, {passive:true});

  }

  return { render, getSession, clearSession, logout };
})();