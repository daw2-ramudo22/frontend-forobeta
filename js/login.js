const API_URL = 'https://backend-forobeta.onrender.com';

document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

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
