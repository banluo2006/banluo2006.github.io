// ===== Theme Management =====

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

  // Dispatch custom event for charts etc.
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
}

function updateThemeIcon() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark
    ? '<span class="icon-sun">☀️</span><span class="icon-moon" style="display:none">🌙</span>'
    : '<span class="icon-sun" style="display:none">☀️</span><span class="icon-moon">🌙</span>';
}
