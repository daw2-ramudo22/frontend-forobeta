//Login del usuario. Envia credenciales al backend y guarda el token en localStorage
import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const mensajeDiv = document.getElementById('mensaje');

  if (!form || !emailInput || !passwordInput || !mensajeDiv) {
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

      const resultado = await res.json();

      if (res.ok) {
        localStorage.setItem('token', resultado.token);
        localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

        mensajeDiv.innerHTML = '<div class="success">Inicio de sesión exitoso. Redirigiendo...</div>';

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        mensajeDiv.innerHTML = `<div class="error">${resultado.error}</div>`;
      }

    } catch (error) {
      console.error('Error:', error);
      mensajeDiv.innerHTML = '<div class="error">Error de conexión</div>';
    }
  });
});
