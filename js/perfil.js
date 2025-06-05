const API_URL = 'https://foro-backend-g0z3.onrender.com';

// Editar nombre
function editarNombre() {
  const nuevoNombre = prompt("Introduce tu nuevo nombre:");
  if (!nuevoNombre) return;

  const token = localStorage.getItem('token');

  fetch(`${API_URL}/usuarios/editar-nombre`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ nombre: nuevoNombre })
  })
    .then(res => res.json())
    .then(data => {
      alert("Nombre actualizado");
      location.reload();
    })
    .catch(err => {
      console.error("Error al editar nombre:", err);
    });
}

// Eliminar cuenta
function eliminarCuenta() {
  const confirmar = confirm("¿Estás seguro de que deseas eliminar tu cuenta?");
  if (!confirmar) return;

  const token = localStorage.getItem('token');

  fetch(`${API_URL}/usuarios/eliminar-cuenta`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.ok) {
        alert("Cuenta eliminada");
        localStorage.removeItem('token');
        window.location.href = "index.html";
      } else {
        alert("Error al eliminar cuenta");
      }
    })
    .catch(err => {
      console.error("Error al eliminar cuenta:", err);
    });
}

// Cargar perfil
async function cargarPerfil() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/usuarios/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Token inválido o expirado");

    const usuario = await res.json();
    console.log("Usuario:", usuario);

    document.getElementById('perfil-nombre').textContent = usuario.nombre;
    document.getElementById('perfil-email').textContent = usuario.email;

    const fechaRegistro = new Date(usuario.createdAt);
    const registroFormateado = isNaN(fechaRegistro)
      ? 'No disponible'
      : fechaRegistro.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

    document.getElementById('perfil-fecha').textContent = registroFormateado;

    const fechaCumple = new Date(usuario.cumple);
    const cumpleFormateado = isNaN(fechaCumple)
      ? 'No establecido'
      : fechaCumple.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

    document.getElementById('perfil-cumple').textContent = cumpleFormateado;

  } catch (err) {
    console.error("Error al cargar perfil:", err);
    alert("Error al obtener los datos del perfil");
  }
}

// Hacer funciones accesibles globalmente si se usan en HTML
window.editarNombre = editarNombre;
window.eliminarCuenta = eliminarCuenta;

document.addEventListener('DOMContentLoaded', cargarPerfil);
