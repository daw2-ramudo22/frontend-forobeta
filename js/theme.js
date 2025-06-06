//js/theme.js
(function () {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  function aplicarTema(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (themeToggleBtn) themeToggleBtn.textContent = '🌙 Modo Oscuro';
    } else {
      body.classList.remove('dark-mode');
      if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Modo Claro';
    }
    localStorage.setItem('theme', theme);
  }

  function cargarPreferenciaTema() {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      const prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      aplicarTema(prefersDark ? 'dark' : 'light');
    } else {
      aplicarTema(savedTheme);
    }
  }

  function setupThemeToggle() {
    if (!themeToggleBtn) return;

    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      aplicarTema(isDark ? 'light' : 'dark');
    });
  }

  //Ejecutar al cargar
  cargarPreferenciaTema();
  setupThemeToggle();

  //Opcionalmente exportar al scope global si lo necesitas en onclick=""
  window.aplicarTema = aplicarTema;
})();
