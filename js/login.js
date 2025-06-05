import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!form || !emailInput || !passwordInput) {
    console.error("Elementos del formulario no encontrados");
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al iniciar sesión');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      alert("Login exitoso");
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Error en login:', err);
      alert("Error en el servidor");
    }
  });
});
