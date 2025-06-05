// En este archivo js se controla los tema claro/oscuro de la pagina principal
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

export function aplicarTema(theme) {
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.textContent = '🌙 Modo Oscuro';
  } else {
    body.classList.remove('dark-mode');
    themeToggleBtn.textContent = '☀️ Modo Claro';
  }
  localStorage.setItem('theme', theme);
}

export function cargarPreferenciaTema() {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      aplicarTema('dark');
    } else {
      aplicarTema('light');
    }
  } else {
    aplicarTema(savedTheme);
  }
}

export function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
      aplicarTema('light');
    } else {
      aplicarTema('dark');
    }
  });
}
