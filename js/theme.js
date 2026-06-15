// ===== Theme & Color Scheme Management =====

const COLOR_SCHEMES = [
  { id: 'indigo', label: '靛蓝', color: '#6366f1' },
  { id: 'green', label: '青草绿', color: '#10b981' },
  { id: 'ocean', label: '海洋蓝', color: '#3b82f6' },
  { id: 'pink', label: '樱花粉', color: '#ec4899' },
  { id: 'orange', label: '日落橙', color: '#f97316' },
  { id: 'purple', label: '紫罗兰', color: '#8b5cf6' },
  { id: 'gray', label: '极简灰', color: '#475569' },
];

// ===== Theme =====

function initTheme() {
  const saved = localStorage.getItem('blog-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('blog-theme', next);
  updateThemeIcon();
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
}

function updateThemeIcon() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark ? '☀️' : '🌙';
}

// ===== Color Scheme =====

function initColorScheme() {
  // Inject palette into header
  injectPalette();

  const saved = localStorage.getItem('blog-color');
  if (saved && COLOR_SCHEMES.some(s => s.id === saved)) {
    setColorScheme(saved, false);
  }
}

function injectPalette() {
  const container = document.querySelector('.header-actions');
  if (!container || container.querySelector('.color-palette')) return;

  const palette = document.createElement('div');
  palette.className = 'color-palette';
  palette.title = '切换配色';

  // Current scheme
  const current = localStorage.getItem('blog-color') || 'indigo';

  palette.innerHTML = COLOR_SCHEMES.map(s => `
    <button class="color-dot ${s.id === current ? 'active' : ''}"
            data-color="${s.id}"
            style="background:${s.color}"
            onclick="setColorScheme('${s.id}')"
            title="${s.label}"></button>
  `).join('');

  // Insert before theme toggle
  container.insertBefore(palette, container.firstChild);
}

function setColorScheme(schemeId, save = true) {
  if (!schemeId || schemeId === 'indigo') {
    document.documentElement.removeAttribute('data-color');
    if (save) localStorage.removeItem('blog-color');
  } else {
    document.documentElement.setAttribute('data-color', schemeId);
    if (save) localStorage.setItem('blog-color', schemeId);
  }

  // Update active state on dots
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.color === schemeId);
  });

  if (save) {
    window.dispatchEvent(new CustomEvent('themechange', { detail: { color: schemeId } }));
  }
}
